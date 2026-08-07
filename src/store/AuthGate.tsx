import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | 'loading'>('loading')
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [pseudo, setPseudo] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmPending, setConfirmPending] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!supabase) return <>{children}</>
  if (session === 'loading') {
    return (
      <div className="flex min-h-svh items-center justify-center bg-black">
        <p className="text-sm text-white/40">Chargement...</p>
      </div>
    )
  }

  if (session) return <>{children}</>

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'signup') {
        if (!pseudo.trim()) throw new Error('Choisis un pseudo')
        const { data, error: err } = await supabase!.auth.signUp({
          email,
          password,
          options: { data: { pseudo: pseudo.trim() } },
        })
        if (err) throw err
        if (!data.session) setConfirmPending(true)
      } else {
        const { error: err } = await supabase!.auth.signInWithPassword({ email, password })
        if (err) throw err
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setBusy(false)
    }
  }

  if (confirmPending) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-black via-red-950 to-black px-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Vérifie ta boîte mail</h1>
        <p className="mt-3 max-w-sm text-sm text-white/60">
          On a envoyé un lien de confirmation à <span className="text-white">{email}</span>. Clique dessus
          pour activer ton compte, puis reviens ici te connecter.
        </p>
        <button
          onClick={() => setConfirmPending(false)}
          className="mt-6 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/70 hover:bg-white/10"
        >
          Retour
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-black via-red-950 to-black px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">RassoGo</h1>
        <p className="mt-1 text-sm text-white/50">Organise et rejoins des Rasso près de chez toi</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <div className="mb-4 flex rounded-full bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              mode === 'signup' ? 'bg-red-600 text-white' : 'text-white/50'
            }`}
          >
            Créer un compte
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-red-600 text-white' : 'text-white/50'
            }`}
          >
            Se connecter
          </button>
        </div>

        {mode === 'signup' && (
          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Pseudo"
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-red-500"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-red-500"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Mot de passe"
          minLength={6}
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-red-500"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-2 w-full rounded-full bg-gradient-to-r from-red-600 to-red-800 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 hover:opacity-90 disabled:opacity-50"
        >
          {busy ? 'Un instant...' : mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
