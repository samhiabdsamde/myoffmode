'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Section = 'profile' | 'security' | 'notifications' | '2fa' | 'danger'

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [section, setSection] = useState<Section>('profile')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Profile
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // Security
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [securityMsg, setSecurityMsg] = useState('')

  // 2FA / MFA
  const [mfaFactors, setMfaFactors] = useState<any[]>([])
  const [qrCode, setQrCode] = useState('')
  const [totpSecret, setTotpSecret] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [mfaMsg, setMfaMsg] = useState('')
  const [enrollId, setEnrollId] = useState('')

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Notifications prefs
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [offModeNotifs, setOffModeNotifs] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setNewEmail(user.email || '')

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      setFullName(prof?.full_name || '')

      // Récupérer les facteurs MFA
      const { data } = await supabase.auth.mfa.listFactors()
      setMfaFactors(data?.totp || [])
      setLoading(false)
    }
    load()
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    setSaveMsg('')
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    setSaveMsg('✅ Profil mis à jour')
    setSaving(false)
  }

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) { setSecurityMsg('❌ Mots de passe différents'); return }
    if (newPassword.length < 8) { setSecurityMsg('❌ Minimum 8 caractères'); return }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setSecurityMsg(`❌ ${error.message}`)
    else { setSecurityMsg('✅ Mot de passe mis à jour'); setNewPassword(''); setConfirmPassword('') }
  }

  const updateEmail = async () => {
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) setSecurityMsg(`❌ ${error.message}`)
    else setSecurityMsg('✅ Vérifie ton nouvel email pour confirmer')
  }

  const startMFAEnroll = async () => {
    setMfaMsg('')
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'MyOffMode' })
    if (error || !data) { setMfaMsg(`❌ ${error?.message}`); return }
    setEnrollId(data.id)
    setQrCode(data.totp.qr_code)
    setTotpSecret(data.totp.secret)
  }

  const verifyMFA = async () => {
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: enrollId })
    if (challengeError) { setMfaMsg(`❌ ${challengeError.message}`); return }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enrollId,
      challengeId: challengeData.id,
      code: totpCode,
    })
    if (verifyError) setMfaMsg(`❌ Code invalide`)
    else {
      setMfaMsg('✅ 2FA activé avec succès !')
      setQrCode('')
      const { data } = await supabase.auth.mfa.listFactors()
      setMfaFactors(data?.totp || [])
    }
  }

  const disableMFA = async (factorId: string) => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId })
    if (error) setMfaMsg(`❌ ${error.message}`)
    else {
      setMfaMsg('✅ 2FA désactivé')
      setMfaFactors(prev => prev.filter(f => f.id !== factorId))
    }
  }

  const signOut = async () => {
    // Déconnexion propre : sessions, cookies, localStorage
    await supabase.auth.signOut({ scope: 'global' })
    localStorage.clear()
    sessionStorage.clear()
    router.push('/')
    router.refresh()
  }

  const exportData = () => {
    window.location.href = '/api/account/export'
  }

  const deleteAccount = async () => {
    if (deleteConfirm !== 'SUPPRIMER MON COMPTE') {
      setDeleteError('Tape exactement : SUPPRIMER MON COMPTE')
      return
    }
    setDeleteLoading(true)
    setDeleteError('')
    const res = await fetch('/api/account/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation: deleteConfirm }),
    })
    if (res.ok) {
      localStorage.clear()
      sessionStorage.clear()
      router.push('/?deleted=true')
    } else {
      const { error } = await res.json()
      setDeleteError(error || 'Erreur lors de la suppression')
      setDeleteLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-3xl animate-pulse">🔴</div></div>

  const navItems: { id: Section; label: string; icon: string; danger?: boolean }[] = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'security', label: 'Sécurité', icon: '🔒' },
    { id: '2fa', label: 'Double authentification', icon: '🛡️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'danger', label: 'Compte & données', icon: '⚠️', danger: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-600">←</button>
          <h1 className="font-bold text-gray-900">Paramètres</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Nav */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition ${section === item.id ? (item.danger ? 'bg-red-50' : 'bg-rose-50') : 'hover:bg-gray-50'}`}
            >
              <span>{item.icon}</span>
              <span className={`text-sm font-medium ${section === item.id ? (item.danger ? 'text-red-600' : 'text-rose-600') : item.danger ? 'text-red-500' : 'text-gray-700'}`}>{item.label}</span>
              <span className="ml-auto text-gray-300">›</span>
            </button>
          ))}
        </div>

        {/* PROFIL */}
        {section === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-bold text-gray-900">Mon profil</h2>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Prénom</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Email (lecture seule)</label>
              <input value={user?.email || ''} disabled
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Pour changer l'email, va dans Sécurité</p>
            </div>
            {saveMsg && <p className="text-sm text-green-600 bg-green-50 rounded-xl px-3 py-2">{saveMsg}</p>}
            <button onClick={saveProfile} disabled={saving}
              className="w-full bg-rose-500 text-white rounded-2xl py-3 text-sm font-bold hover:bg-rose-600 disabled:opacity-50 transition">
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </div>
        )}

        {/* SÉCURITÉ */}
        {section === 'security' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h2 className="font-bold text-gray-900">Changer le mot de passe</h2>
              <input type="password" placeholder="Nouveau mot de passe" value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <input type="password" placeholder="Confirmer le mot de passe" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <button onClick={updatePassword}
                className="w-full bg-gray-900 text-white rounded-2xl py-3 text-sm font-bold hover:bg-black transition">
                Changer le mot de passe
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h2 className="font-bold text-gray-900">Changer l'email</h2>
              <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <button onClick={updateEmail}
                className="w-full bg-gray-900 text-white rounded-2xl py-3 text-sm font-bold hover:bg-black transition">
                Changer l'email
              </button>
            </div>

            {securityMsg && <p className={`text-sm rounded-xl px-3 py-2 ${securityMsg.startsWith('✅') ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>{securityMsg}</p>}

            <button onClick={signOut}
              className="w-full border border-red-200 text-red-500 rounded-2xl py-3 text-sm font-medium hover:bg-red-50 transition">
              Se déconnecter
            </button>
          </div>
        )}

        {/* 2FA / TOTP */}
        {section === '2fa' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-bold text-gray-900">Double authentification (2FA)</h2>
            <p className="text-sm text-gray-500">Protège ton compte avec une application comme Google Authenticator ou Authy.</p>

            {mfaFactors.length > 0 ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-sm text-green-700 font-medium">2FA activé</span>
                </div>
                {mfaFactors.map(f => (
                  <div key={f.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{f.friendly_name}</p>
                      <p className="text-xs text-gray-400">TOTP · Actif</p>
                    </div>
                    <button onClick={() => disableMFA(f.id)}
                      className="text-xs text-red-500 hover:text-red-700">
                      Désactiver
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {!qrCode ? (
                  <button onClick={startMFAEnroll}
                    className="w-full bg-gray-900 text-white rounded-2xl py-3 text-sm font-bold hover:bg-black transition">
                    🛡️ Activer la 2FA
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                      <p className="text-sm font-medium text-gray-700 mb-3">Scanne ce QR Code avec ton app</p>
                      <img src={qrCode} alt="QR Code 2FA" className="w-40 h-40 mx-auto rounded-xl" />
                      <div className="mt-3 bg-white border border-gray-200 rounded-xl px-3 py-2">
                        <p className="text-xs text-gray-400 mb-1">Ou entre ce code manuellement :</p>
                        <p className="text-xs font-mono text-gray-700 break-all">{totpSecret}</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Code à 6 chiffres"
                      value={totpCode}
                      onChange={e => setTotpCode(e.target.value)}
                      maxLength={6}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                    <button onClick={verifyMFA} disabled={totpCode.length !== 6}
                      className="w-full bg-rose-500 text-white rounded-2xl py-3 text-sm font-bold hover:bg-rose-600 disabled:opacity-50 transition">
                      Vérifier et activer
                    </button>
                  </div>
                )}
              </div>
            )}
            {mfaMsg && <p className={`text-sm rounded-xl px-3 py-2 ${mfaMsg.startsWith('✅') ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>{mfaMsg}</p>}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {section === 'notifications' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-bold text-gray-900">Préférences de notifications</h2>
            {[
              { label: 'Notifications par email', desc: 'Résumé quotidien, alertes importantes', state: emailNotifs, set: setEmailNotifs },
              { label: 'OFF Mode activé/désactivé', desc: 'Notifie le partenaire quand tu actives le OFF Mode', state: offModeNotifs, set: setOffModeNotifs },
            ].map(({ label, desc, state, set }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <button onClick={() => set(!state)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${state ? 'bg-rose-500' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${state ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
            <button className="w-full bg-rose-500 text-white rounded-2xl py-3 text-sm font-bold hover:bg-rose-600 transition">
              Enregistrer les préférences
            </button>
          </div>
        )}

        {/* DANGER ZONE */}
        {section === 'danger' && (
          <div className="space-y-4">
            {/* Export données RGPD */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h2 className="font-bold text-gray-900">📦 Exporter mes données</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Conformément au RGPD, tu peux télécharger l'intégralité de tes données : profil, routines, enfants, courses, historique.
              </p>
              <button
                onClick={exportData}
                className="w-full border border-gray-200 text-gray-700 rounded-2xl py-3 text-sm font-medium hover:bg-gray-50 transition"
              >
                📥 Télécharger mes données (JSON)
              </button>
            </div>

            {/* Déconnexion globale */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h2 className="font-bold text-gray-900">🚪 Déconnexion globale</h2>
              <p className="text-sm text-gray-500">Déconnecte tous tes appareils en même temps (révoque toutes les sessions actives).</p>
              <button
                onClick={signOut}
                className="w-full border border-orange-200 text-orange-600 rounded-2xl py-3 text-sm font-medium hover:bg-orange-50 transition"
              >
                Déconnecter tous mes appareils
              </button>
            </div>

            {/* Suppression de compte */}
            <div className="bg-white rounded-2xl border-2 border-red-200 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗑️</span>
                <h2 className="font-bold text-red-600">Supprimer mon compte</h2>
              </div>

              <div className="bg-red-50 rounded-xl p-3 space-y-1">
                <p className="text-xs font-semibold text-red-700">⚠️ Cette action est irréversible</p>
                <ul className="text-xs text-red-600 space-y-0.5 list-disc list-inside">
                  <li>Toutes tes données seront supprimées définitivement</li>
                  <li>Tes routines, enfants, memories, courses — tout effacé</li>
                  <li>Ton abonnement Stripe sera annulé immédiatement</li>
                  <li>Ton partenaire perdra accès à la famille</li>
                </ul>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Tape <span className="text-red-600 font-mono">SUPPRIMER MON COMPTE</span> pour confirmer
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder="SUPPRIMER MON COMPTE"
                  className="w-full bg-gray-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>

              {deleteError && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{deleteError}</p>}

              <button
                onClick={deleteAccount}
                disabled={deleteLoading || deleteConfirm !== 'SUPPRIMER MON COMPTE'}
                className="w-full bg-red-500 text-white rounded-2xl py-3 text-sm font-bold hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                {deleteLoading ? 'Suppression en cours...' : '🗑️ Supprimer définitivement mon compte'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
