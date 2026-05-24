import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Client admin avec service role pour pouvoir supprimer l'utilisateur auth
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { confirmation } = await req.json()
    if (confirmation !== 'SUPPRIMER MON COMPTE') {
      return NextResponse.json({ error: 'Confirmation incorrecte' }, { status: 400 })
    }

    // 1. Récupérer le profil pour avoir stripe_customer_id et family_id
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id, family_id, role')
      .eq('id', user.id)
      .single()

    // 2. Annuler l'abonnement Stripe si existant
    if (profile?.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(profile.stripe_subscription_id)
        console.log(`[Delete] Stripe subscription canceled: ${profile.stripe_subscription_id}`)
      } catch (e) {
        console.error('[Delete] Stripe cancel error:', e)
      }
    }

    // 3. Si maman (créatrice de famille) → supprimer toute la famille en cascade
    // Supabase cascade via FK s'occupe de : routines, memories, children, grocery_items,
    // notifications, subscriptions, file_uploads, audit_logs, daily_logs, partner_invites
    if (profile?.role === 'mom' && profile?.family_id) {
      const { error: famError } = await adminSupabase
        .from('families')
        .delete()
        .eq('id', profile.family_id)
      if (famError) console.error('[Delete] Family delete error:', famError)
    }

    // 4. Log avant suppression (RGPD — on garde trace de la demande)
    await adminSupabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'account_deleted',
      details: {
        email: user.email,
        deleted_at: new Date().toISOString(),
        reason: 'user_request',
      },
      ip_address: req.headers.get('x-forwarded-for') ?? null,
    })

    // 5. Supprimer le user Supabase Auth (cascade sur profiles via FK)
    const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(user.id)
    if (authDeleteError) {
      console.error('[Delete] Auth delete error:', authDeleteError)
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
    }

    console.log(`[Delete] Account deleted: ${user.email}`)

    // 6. Réponse avec headers pour cleaner les cookies côté client
    const response = NextResponse.json({ success: true })
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')
    // Supabase SSR cookies
    ;['sb-evdigavfwjpevlvifrgm-auth-token', 'sb-evdigavfwjpevlvifrgm-auth-token-code-verifier'].forEach(name => {
      response.cookies.delete(name)
    })
    return response

  } catch (err: any) {
    console.error('[Delete Account Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
