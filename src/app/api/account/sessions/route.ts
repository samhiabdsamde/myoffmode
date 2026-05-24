import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// Révoquer toutes les sessions (déconnexion globale)
export async function DELETE(req: NextRequest) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Supabase signOut global révoque tous les refresh tokens
  const { error } = await supabase.auth.signOut({ scope: 'global' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const response = NextResponse.json({ success: true })
  // Clear tous les cookies d'auth
  const cookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`,
  ]
  cookieNames.forEach(name => response.cookies.delete(name))
  return response
}
