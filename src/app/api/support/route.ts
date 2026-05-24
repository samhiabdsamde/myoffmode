import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { emails } from '@/lib/emails'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { subject, message, priority, email, user_id } = body

  if (!subject || !message || !email) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const supabase = createAdminSupabase()

  const { data: ticket, error } = await supabase.from('support_tickets').insert({
    user_id: user_id || null,
    email,
    subject,
    message,
    priority: priority || 'medium',
    status: 'open',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send confirmation email to user
  await emails.supportTicketConfirmation(email, 'Utilisateur', subject, ticket.id)

  return NextResponse.json({ ticket })
}
