import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
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

  try {
    const subscriptions = await stripe.subscriptions.list({ status: 'active', limit: 100, expand: ['data.customer'] })

    let mrr = 0
    let cancelingCount = 0

    const formatted = await Promise.all(subscriptions.data.map(async sub => {
      const customer = sub.customer as Stripe.Customer
      const price = sub.items.data[0]?.price
      const amount = (price?.unit_amount || 0) / 100
      const interval = price?.recurring?.interval || 'month'
      const monthlyAmount = interval === 'year' ? amount / 12 : amount
      mrr += monthlyAmount

      if (sub.cancel_at_period_end) cancelingCount++

      return {
        id: sub.id,
        status: sub.status,
        cancel_at_period_end: sub.cancel_at_period_end,
        current_period_end: sub.current_period_end,
        customer: customer.id,
        customer_email: customer.email || undefined,
        amount,
        interval,
        plan_name: price?.nickname || price?.id || '—',
      }
    }))

    return NextResponse.json({
      subscriptions: formatted,
      mrr: Math.round(mrr * 100) / 100,
      totalActive: subscriptions.data.length,
      cancelingCount,
    })
  } catch {
    return NextResponse.json({
      subscriptions: [],
      mrr: 0,
      totalActive: 0,
      cancelingCount: 0,
    })
  }
}
