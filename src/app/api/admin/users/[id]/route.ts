import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-server'
import { emails } from '@/lib/emails'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

async function requireAdmin(minRole?: string) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('admin_role').eq('id', user.id).single()
  if (!profile?.admin_role) return null
  if (minRole === 'super_admin' && profile.admin_role !== 'super_admin') return null
  return { user, role: profile.admin_role as string }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminSupabase()

  const [{ data: profile }, { data: subscription }, { data: tickets }, { data: actions }] = await Promise.all([
    supabase.from('profiles')
      .select('*, families(name)')
      .eq('id', params.id)
      .single(),
    supabase.from('subscriptions')
      .select('*')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('support_tickets')
      .select('id, subject, status, priority, created_at')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('admin_actions')
      .select('action, details, created_at, admin_id')
      .eq('target_user_id', params.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Get Stripe subscription details if available
  let stripeSubscription = null
  if (subscription?.stripe_subscription_id) {
    try {
      stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
    } catch { /* ignore */ }
  }

  return NextResponse.json({
    profile,
    subscription,
    stripeSubscription,
    tickets: tickets || [],
    actions: actions || [],
  })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createAdminSupabase()

  // Block / unblock user
  if ('is_blocked' in body) {
    const updateData: Record<string, unknown> = {
      is_blocked: body.is_blocked,
      blocked_reason: body.is_blocked ? (body.reason || 'Violation des CGU') : null,
      blocked_at: body.is_blocked ? new Date().toISOString() : null,
    }

    const { error } = await supabase.from('profiles')
      .update(updateData)
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Log admin action
    await supabase.from('admin_actions').insert({
      admin_id: admin.user.id,
      target_user_id: params.id,
      action: body.is_blocked ? 'block_user' : 'unblock_user',
      details: { reason: body.reason },
    })

    // Send email to user
    if (body.is_blocked) {
      const { data: profile } = await supabase.from('profiles').select('email, full_name').eq('id', params.id).single()
      if (profile?.email) {
        await emails.accountBlocked(profile.email, profile.full_name || 'Utilisateur', body.reason || 'Violation des CGU')
      }
    }

    return NextResponse.json({ success: true })
  }

  // Change admin role
  if ('admin_role' in body) {
    // Only super_admin can assign roles
    if (admin.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super_admin can assign roles' }, { status: 403 })
    }

    const { error } = await supabase.from('profiles')
      .update({ admin_role: body.admin_role || null })
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('admin_actions').insert({
      admin_id: admin.user.id,
      target_user_id: params.id,
      action: 'change_role',
      details: { new_role: body.admin_role },
    })

    return NextResponse.json({ success: true })
  }

  // Cancel Stripe subscription
  if (body.action === 'cancel_subscription') {
    const { data: subscription } = await supabase.from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', params.id)
      .single()

    if (subscription?.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
        await supabase.from('profiles').update({ is_premium: false, plan: 'free' }).eq('id', params.id)
        await supabase.from('admin_actions').insert({
          admin_id: admin.user.id,
          target_user_id: params.id,
          action: 'cancel_subscription',
          details: { stripe_subscription_id: subscription.stripe_subscription_id },
        })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
