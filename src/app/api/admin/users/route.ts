import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-server'

async function requireAdmin() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('admin_role').eq('id', user.id).single()
  if (!profile?.admin_role) return null
  return { user, role: profile.admin_role as string }
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminSupabase()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit
  const search = searchParams.get('search') || ''
  const filter = searchParams.get('filter') || 'all' // all | premium | blocked | admin

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, is_premium, is_blocked, blocked_reason, admin_role, created_at, plan', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  if (filter === 'premium') query = query.eq('is_premium', true)
  if (filter === 'blocked') query = query.eq('is_blocked', true)
  if (filter === 'admin') query = query.not('admin_role', 'is', null)

  const { data: users, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    users: users || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  })
}
