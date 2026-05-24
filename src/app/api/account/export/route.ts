import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await adminSupabase.from('profiles').select('*').eq('id', user.id).single()
  const familyId = profile?.family_id

  // Collecter toutes les données utilisateur (RGPD — droit à la portabilité)
  const [routines, memories, children, grocery, notifications, logs] = await Promise.all([
    familyId ? adminSupabase.from('routines').select('*').eq('family_id', familyId) : { data: [] },
    familyId ? adminSupabase.from('memories').select('*').eq('family_id', familyId) : { data: [] },
    familyId ? adminSupabase.from('children').select('*').eq('family_id', familyId) : { data: [] },
    familyId ? adminSupabase.from('grocery_items').select('*').eq('family_id', familyId) : { data: [] },
    adminSupabase.from('notifications').select('*').eq('user_id', user.id),
    adminSupabase.from('audit_logs').select('action, created_at').eq('user_id', user.id),
  ])

  const exportData = {
    exported_at: new Date().toISOString(),
    rgpd_notice: 'Données exportées conformément au RGPD (Règlement Général sur la Protection des Données)',
    account: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
    },
    profile: {
      full_name: profile?.full_name,
      role: profile?.role,
      is_premium: profile?.is_premium,
      off_mode: profile?.off_mode,
      created_at: profile?.created_at,
    },
    family_data: {
      routines: routines.data || [],
      memories: memories.data || [],
      children: children.data || [],
      grocery_items: grocery.data || [],
    },
    notifications: notifications.data || [],
    activity_log: logs.data || [],
  }

  // Log de l'export (RGPD)
  await adminSupabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'data_exported',
    details: { email: user.email },
  })

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="myoffmode-data-${user.id.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  })
}
