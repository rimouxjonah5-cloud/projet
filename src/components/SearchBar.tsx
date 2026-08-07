import { useEffect, useMemo, useState } from 'react'
import { Search, UserPlus, MapPin, X } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useNavigate } from 'react-router-dom'
import type { Friend } from '../types'

export function SearchBar() {
  const { state, addFriend, searchUsers } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [discoverResults, setDiscoverResults] = useState<Friend[]>([])

  const q = query.trim().toLowerCase()

  useEffect(() => {
    if (!q) {
      setDiscoverResults([])
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      searchUsers(q).then((results) => {
        if (!cancelled) setDiscoverResults(results)
      })
    }, 200)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [q, searchUsers])

  const friendResults = useMemo(() => {
    if (!q) return []
    return state.friends.filter((f) => f.pseudo.toLowerCase().includes(q))
  }, [q, state.friends])

  const locationResults = useMemo(() => {
    if (!q) return []
    return state.locations.filter(
      (l) => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q),
    )
  }, [q, state.locations])

  const hasResults = friendResults.length + discoverResults.length + locationResults.length > 0

  function useLocation(id: string) {
    const loc = state.locations.find((l) => l.id === id)
    if (!loc) return
    navigate('/create', { state: { presetAddress: `${loc.name}, ${loc.address}`, presetType: loc.type } })
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2.5 backdrop-blur">
        <Search size={18} className="text-white/60 shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher des amis ou un lieu de Rasso..."
          className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
        />
        {query && (
          <button
            aria-label="Effacer"
            onClick={() => setQuery('')}
            className="text-white/50 hover:text-white shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && q && (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 shadow-xl max-h-96 overflow-y-auto">
          {!hasResults && (
            <p className="p-4 text-sm text-white/50">Aucun résultat pour « {query} »</p>
          )}

          {friendResults.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 text-xs uppercase tracking-wide text-white/40">Mes amis</p>
              {friendResults.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    navigate(`/messages/${f.id}`)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5"
                >
                  <img src={f.photoUrl} alt="" className="h-8 w-8 rounded-full" />
                  <span className="text-sm text-white">{f.pseudo}</span>
                </button>
              ))}
            </div>
          )}

          {discoverResults.length > 0 && (
            <div className="p-2 border-t border-white/10">
              <p className="px-2 py-1 text-xs uppercase tracking-wide text-white/40">Trouver des amis</p>
              {discoverResults.map((f) => (
                <div key={f.id} className="flex items-center gap-3 rounded-xl px-2 py-2">
                  <img src={f.photoUrl} alt="" className="h-8 w-8 rounded-full" />
                  <span className="flex-1 text-sm text-white">{f.pseudo}</span>
                  <button
                    onClick={() => {
                      addFriend(f.id)
                      setDiscoverResults((r) => r.filter((u) => u.id !== f.id))
                    }}
                    className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500"
                  >
                    <UserPlus size={14} /> Ajouter
                  </button>
                </div>
              ))}
            </div>
          )}

          {locationResults.length > 0 && (
            <div className="p-2 border-t border-white/10">
              <p className="px-2 py-1 text-xs uppercase tracking-wide text-white/40">Lieux disponibles</p>
              {locationResults.map((l) => (
                <button
                  key={l.id}
                  onClick={() => useLocation(l.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5"
                >
                  <MapPin size={18} className="text-red-500 shrink-0" />
                  <span className="flex-1">
                    <span className="block text-sm text-white">{l.name}</span>
                    <span className="block text-xs text-white/50">{l.address}</span>
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase text-white/60">
                    {l.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
