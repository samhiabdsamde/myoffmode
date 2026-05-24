import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { emails } from '@/lib/emails'
import { logger } from '@/lib/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    logger.error('[Webhook] Signature invalide', { err: err.message })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  logger.info('[Webhook] Event reçu', { type: event.type })

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan || 'pro'
        if (!userId) break

        // Récupérer l'email utilisateur
        const { data: authUser } = await supabase.auth.admin.getUserById(userId)
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', userId).single()

        await supabase.from('profiles').update({
          is_premium: true,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        }).eq('id', userId)

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          plan,
          status: session.status === 'complete' ? 'active' : 'trialing',
        }, { onConflict: 'user_id' })

        await supabase.from('notifications').insert({
          user_id: userId,
          title: `✨ Bienvenue dans le plan ${plan === 'family' ? 'Famille' : 'Pro'} !`,
          message: 'Ton abonnement est actif. Toutes les fonctionnalités premium sont débloquées.',
          type: 'payment',
        })

        // Email de confirmation
        if (authUser?.user?.email) {
          const planLabel = plan === 'family' ? 'Famille — 12€/mois' : 'Pro — 7€/mois'
          await emails.paymentSuccess(
            authUser.user.email,
            profile?.full_name || 'toi',
            planLabel,
            plan === 'family' ? '12€' : '7€'
          )
        }

        logger.event('subscription_started', userId, { plan })
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.userId
        if (!userId) break

        const status = sub.status
        const isActive = ['active', 'trialing'].includes(status)

        await supabase.from('profiles').update({ is_premium: isActive }).eq('stripe_subscription_id', sub.id)
        await supabase.from('subscriptions').update({
          status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        }).eq('stripe_subscription_id', sub.id)

        // Notifier si annulation programmée
        if (sub.cancel_at_period_end) {
          const endDate = new Date(sub.current_period_end * 1000).toLocaleDateString('fr-FR')
          await supabase.from('notifications').insert({
            user_id: userId,
            title: '📅 Abonnement annulé',
            message: `Ton abonnement se terminera le ${endDate}. Tu garderas l'accès jusqu'à cette date.`,
            type: 'payment',
          })
        }

        logger.event('subscription_updated', userId, { status })
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.userId

        await supabase.from('profiles').update({ is_premium: false }).eq('stripe_subscription_id', sub.id)
        await supabase.from('subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', sub.id)

        if (userId) {
          await supabase.from('notifications').insert({
            user_id: userId,
            title: '❌ Abonnement terminé',
            message: 'Ton abonnement Premium a été résilié. Tu repasses en plan gratuit.',
            type: 'payment',
          })
          logger.event('subscription_canceled', userId)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const { data: profile } = await supabase.from('profiles')
          .select('id, full_name').eq('stripe_customer_id', customerId).single()
        const { data: authUser } = profile
          ? await supabase.auth.admin.getUserById(profile.id)
          : { data: null }

        if (profile && authUser?.user?.email) {
          await supabase.from('subscriptions').update({ status: 'active' }).eq('stripe_customer_id', customerId)
          logger.event('invoice_paid', profile.id, { amount: invoice.amount_paid })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const attemptCount = invoice.attempt_count

        const { data: profile } = await supabase.from('profiles')
          .select('id, full_name').eq('stripe_customer_id', customerId).single()
        const { data: authUser } = profile
          ? await supabase.auth.admin.getUserById(profile.id)
          : { data: null }

        await supabase.from('subscriptions').update({ status: 'past_due' }).eq('stripe_customer_id', customerId)

        if (profile) {
          await supabase.from('notifications').insert({
            user_id: profile.id,
            title: '⚠️ Paiement échoué',
            message: `Tentative ${attemptCount}/4. Mets à jour ta carte pour garder l'accès Premium.`,
            type: 'payment',
          })

          // Email après 1ère tentative ratée
          if (authUser?.user?.email) {
            await emails.paymentFailed(authUser.user.email, profile.full_name || 'toi')
          }

          // Slack alert si configuré
          if (process.env.SLACK_WEBHOOK_URL) {
            await fetch(process.env.SLACK_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `⚠️ Paiement échoué — ${authUser?.user?.email} (tentative ${attemptCount})`,
              }),
            }).catch(() => {})
          }

          logger.event('payment_failed', profile.id, { attemptCount })
        }
        break
      }

      case 'invoice.upcoming': {
        // Rappel 7 jours avant renouvellement
        const invoice = event.data.object as Stripe.Invoice
        logger.info('[Webhook] Facture à venir', { customer: invoice.customer, amount: invoice.amount_due })
        break
      }
    }
  } catch (err: any) {
    logger.error('[Webhook] Handler error', { err: err.message, event: event.type })
  }

  return NextResponse.json({ received: true })
}
