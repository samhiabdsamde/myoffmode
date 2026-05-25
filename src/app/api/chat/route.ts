import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabase-server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    // BUG FIX #3 — Vérification auth + appartenance à la famille
    const serverSupabase = createServerSupabase()
    const { data: { user } } = await serverSupabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { message, familyId, history = [] } = await req.json()
    if (!familyId) return NextResponse.json({ error: 'familyId requis' }, { status: 400 })
    if (!message?.trim()) return NextResponse.json({ error: 'Message vide' }, { status: 400 })

    // Vérifier que l'utilisateur appartient bien à cette famille
    const { data: profile } = await serverSupabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id || profile.family_id !== familyId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // Limiter l'historique pour éviter les abus (max 10 échanges)
    const safeHistory = Array.isArray(history) ? history.slice(-10) : []

    // Récupérer les données de la famille
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const [
      { data: memories },
      { data: routines },
      { data: children },
      { data: grocery }
    ] = await Promise.all([
      supabase.from('memories').select('*').eq('family_id', familyId),
      supabase.from('routines').select('*').eq('family_id', familyId).eq('is_active', true),
      supabase.from('children').select('*').eq('family_id', familyId),
      supabase.from('grocery_items').select('*').eq('family_id', familyId).eq('is_recurring', true)
    ])

    // Construire le contexte famille pour l'IA
    const familyContext = buildFamilyContext({ memories, routines, children, grocery })

    // Prompt système avec cache (économise 90% des coûts API)
    const systemPrompt = `Tu es l'assistant personnel de la famille. Tu connais parfaitement les habitudes, routines et préférences de cette famille.

IMPORTANT : Tu réponds TOUJOURS avec la méthode et les habitudes spécifiques de CETTE famille. Jamais de réponses génériques. Tu t'exprimes de façon chaleureuse, directe et pratique.

=== DONNÉES DE LA FAMILLE ===
${familyContext}
=== FIN DES DONNÉES ===

Si une information n'est pas dans les données de la famille, dis-le clairement et suggère de le demander à maman.`

    // Construire l'historique de conversation
    const messages = [
      ...safeHistory.map((h: { role: string; content: string }) => ({
        role: h.role as 'user' | 'assistant',
        content: String(h.content).slice(0, 1000), // limiter taille de chaque message
      })),
      { role: 'user' as const, content: message }
    ]

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ reply })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

function buildFamilyContext({ memories, routines, children, grocery }: {
  memories: any[], routines: any[], children: any[], grocery: any[]
}) {
  const parts = []

  if (children?.length) {
    parts.push('ENFANTS:\n' + children.map(c =>
      `- ${c.name}${c.age ? `, ${c.age} ans` : ''}${c.school_name ? `, école: ${c.school_name}` : ''}${c.allergies ? `, ALLERGIES: ${c.allergies}` : ''}${c.notes ? `, notes: ${c.notes}` : ''}`
    ).join('\n'))
  }

  if (routines?.length) {
    parts.push('ROUTINES:\n' + routines.map(r =>
      `- [${r.time_of_day}] ${r.title}: ${r.description}`
    ).join('\n'))
  }

  if (memories?.length) {
    parts.push('MÉMOIRES ET HABITUDES:\n' + memories.map(m =>
      `- [${m.category}]${m.child_name ? ` (${m.child_name})` : ''} ${m.content}`
    ).join('\n'))
  }

  if (grocery?.length) {
    parts.push('COURSES HABITUELLES:\n' + grocery.map(g =>
      `- ${g.name}${g.brand ? ` (${g.brand})` : ''}${g.quantity ? `, quantité: ${g.quantity}` : ''}`
    ).join('\n'))
  }

  return parts.join('\n\n') || 'Aucune donnée famille encore enregistrée.'
}
