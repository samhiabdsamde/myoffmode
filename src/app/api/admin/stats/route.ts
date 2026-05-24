import { NextResponse } from 'next/server'
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

async function requireAdmin() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('admin_role').eq('id', user.id).single()
  if (!profile?.admin_role) return null
  return user
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminSupabase()

  // Parallel fetches
  const [
    { count: totalUsers },
    { count: premiumUsers },
    { count: openTickets },
    { count: newUsersThisMonth },
    { data: recentSignups },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
    supabase.from('support_tickets').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from('profiles').select('full_name, email, created_at, is_premium, admin_role')
      .order('created_at', { ascending: false }).limit(5),
  ])

  // Stripe MRR
  let mrr = 0
  let activeSubscriptions = 0
  try {
    const subs = await stripe.subscriptions.list({ status: 'active', limit: 100 })
    activeSubscriptions = subs.data.length
    mrr = subs.data.reduce((sum, sub) => {
      const amount = sub.items.data[0]?.price?.unit_amount || 0
      const interval = sub.items.data[0]?.price?.recurring?.interval
      return sum + (interval === 'year' ? amount / 12 : amount)
    }, 0) / 100
  } catch {
    // Stripe not configured
  }

  return NextResponse.json({
    totalUsers: totalUsers || 0,
    premiumUsers: premiumUsers || 0,
    openTickets: openTickets || 0,
    newUsersThisMonth: newUsersThisMonth || 0,
    mrr,
    activeSubscriptions,
    recentSignups: recentSignups || [],
  })
}
