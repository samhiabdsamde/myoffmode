import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-server'
import { emails } from '@/lib/emails'

async function requireAdmin() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('admin_role, full_name').eq('id', user.id).single()
  if (!profile?.admin_role) return null
  return { user, role: profile.admin_role as string, name: profile.full_name as string }
}

// GET /api/admin/support — list tickets
export async function GET(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminSupabase()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'open'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('support_tickets')
    .select('*, profiles!support_tickets_user_id_fkey(full_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  const { data: tickets, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ tickets: tickets || [], total: count || 0, page })
}

// POST /api/admin/support — reply to ticket or update status
export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createAdminSupabase()

  // Update ticket status
  if (body.action === 'update_status') {
    const { error } = await supabase.from('support_tickets')
      .update({
        status: body.status,
        assigned_to: admin.user.id,
        ...(body.status === 'resolved' ? { resolved_at: new Date().toISOString() } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.ticket_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Reply to ticket
  if (body.action === 'reply') {
    const { error } = await supabase.from('support_replies').insert({
      ticket_id: body.ticket_id,
      user_id: admin.user.id,
      message: body.message,
      is_admin_reply: true,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Update ticket status to in_progress
    await supabase.from('support_tickets')
      .update({ status: 'in_progress', assigned_to: admin.user.id, updated_at: new Date().toISOString() })
      .eq('id', body.ticket_id)

    // Send email to user
    const { data: ticket } = await supabase.from('support_tickets')
      .select('email, subject')
      .eq('id', body.ticket_id)
      .single()

    if (ticket) {
      await emails.supportReply(ticket.email, 'Utilisateur', ticket.subject, body.message, admin.name || 'L\'équipe MyOffMode')
    }

    return NextResponse.json({ success: true })
  }

  // Add admin note
  if (body.action === 'add_note') {
    const { error } = await supabase.from('support_tickets')
      .update({ admin_notes: body.note, updated_at: new Date().toISOString() })
      .eq('id', body.ticket_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
