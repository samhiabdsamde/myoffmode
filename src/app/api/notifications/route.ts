import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET — récupérer les notifications
export async function GET(req: NextRequest) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ notifications: data })
}

// PATCH — marquer comme lues
export async function PATCH(req: NextRequest) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { ids } = await req.json()
  // BUG FIX — .in() retourne un nouveau builder, doit être chaîné correctement
  if (ids?.length) {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).in('id', ids)
  } else {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id)
  }
  return NextResponse.json({ success: true })
}

// DELETE — supprimer une notification
export async function DELETE(req: NextRequest) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = await req.json()
  await supabase.from('notifications').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ success: true })
}
