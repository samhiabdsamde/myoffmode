import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getAdminUser() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, admin_role')
    .eq('id', user.id)
    .single()

  if (!profile?.admin_role) return null
  return { ...user, profile }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser()
  if (!admin) redirect('/dashboard')

  const navLinks = [
    { href: '/admin', label: '📊 Dashboard', exact: true },
    { href: '/admin/users', label: '👥 Utilisateurs' },
    { href: '/admin/subscriptions', label: '💳 Abonnements' },
    { href: '/admin/support', label: '🎫 Support' },
    { href: '/admin/emails', label: '📧 Emails' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div>
              <p className="font-semibold text-sm">Backoffice</p>
              <p className="text-xs text-gray-400">MyOffMode</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 bg-rose-500/20 rounded-full flex items-center justify-center text-xs text-rose-400 font-semibold">
              {admin.profile.full_name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{admin.profile.full_name || admin.email}</p>
              <p className="text-xs text-rose-400">{admin.profile.admin_role}</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="mt-2 flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Retour app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
