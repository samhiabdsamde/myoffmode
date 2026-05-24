import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabase } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PREMIUM_PRICE_ID!,
  family: process.env.STRIPE_FAMILY_PRICE_ID || process.env.STRIPE_PREMIUM_PRICE_ID!,
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const plan = (body.plan || 'pro') as string
    const coupon = body.coupon as string | undefined
    const isGuest = !user // guest checkout (toujours false ici, gardé pour extension)

    const priceId = PRICE_IDS[plan]
    if (!priceId) return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium, stripe_customer_id, full_name')
      .eq('id', user.id)
      .single()

    // Déjà premium → portail de gestion
    if (profile?.is_premium && profile?.stripe_customer_id) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      })
      logger.info('[Stripe] Redirect to portal', { userId: user.id })
      return NextResponse.json({ url: portalSession.url })
    }

    // Valider le coupon si fourni
    let validatedCoupon: string | undefined
    if (coupon) {
      try {
        const couponObj = await stripe.coupons.retrieve(coupon)
        if (couponObj.valid) {
          validatedCoupon = coupon
          logger.info('[Stripe] Coupon valide', { coupon, userId: user.id })
        }
      } catch {
        logger.warn('[Stripe] Coupon invalide', { coupon })
        return NextResponse.json({ error: 'Code promo invalide' }, { status: 400 })
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
      metadata: { userId: user.id, plan, app: 'myoffmode' },
      subscription_data: { metadata: { userId: user.id, plan } },
      allow_promotion_codes: !validatedCoupon, // si coupon manuel, désactiver le champ promo
      billing_address_collection: 'auto',
      invoice_creation: { enabled: false }, // géré via subscription
      tax_id_collection: { enabled: true }, // TVA entreprise
      locale: 'fr',
    }

    // Appliquer coupon si validé
    if (validatedCoupon) {
      sessionParams.discounts = [{ coupon: validatedCoupon }]
      sessionParams.allow_promotion_codes = false
    }

    // Essai gratuit 7 jours sur le plan Pro
    if (plan === 'pro' && !profile?.stripe_customer_id) {
      sessionParams.subscription_data = {
        ...sessionParams.subscription_data,
        trial_period_days: 7,
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    logger.info('[Stripe] Checkout session created', { userId: user.id, plan, sessionId: session.id })
    return NextResponse.json({ url: session.url })

  } catch (err: any) {
    logger.error('[Stripe Checkout Error]', { err: err.message })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
