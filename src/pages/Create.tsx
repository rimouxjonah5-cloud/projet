import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Car, Bike, Shuffle, MapPin } from 'lucide-react'
import { useApp } from '../store/AppContext'
import type { VehicleType } from '../types'

const TYPES: { value: VehicleType; label: string; icon: typeof Car }[] = [
  { value: 'voiture', label: 'Voiture', icon: Car },
  { value: 'moto', label: 'Moto', icon: Bike },
  { value: 'mixte', label: 'Mixte', icon: Shuffle },
]

interface NavState {
  presetAddress?: string
  presetType?: VehicleType
}

export function Create() {
  const { state, addEvent } = useApp()
  const navigate = useNavigate()
  const routerLocation = useLocation()
  const navState = (routerLocation.state as NavState) ?? {}

  const [type, setType] = useState<VehicleType>(navState.presetType ?? 'voiture')
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState(navState.presetAddress ?? '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [rules, setRules] = useState('')
  const [conditions, setConditions] = useState('')
  const [showLocations, setShowLocations] = useState(false)

  const suggestedLocations = state.locations.filter((l) => l.type === type || l.type === 'mixte')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title || !address || !date || !time || !endTime) return
    addEvent({ title, type, address, date, time, endTime, rules, conditions })
    navigate('/')
  }

  return (
    <div className="px-4 py-5">
      <h1 className="text-lg font-bold text-white">Créer un Rasso</h1>
      <p className="mb-5 text-xs text-white/50">
        Choisis le type, la date, l'heure, l'emplacement, les règles et les conditions.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Type de véhicule
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-colors ${
                  type === value
                    ? 'border-red-500 bg-red-600/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Nom du Rasso
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ex : Rasso Tuning Nocturne"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500 [color-scheme:dark]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
              Heure de début
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500 [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
              Heure de fin
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min={time || undefined}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500 [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wide text-white/50">
              Emplacement
            </label>
            <button
              type="button"
              onClick={() => setShowLocations((s) => !s)}
              className="flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300"
            >
              <MapPin size={13} /> Lieux disponibles
            </button>
          </div>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Adresse du rendez-vous"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-red-500"
          />

          {showLocations && (
            <div className="mt-2 flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/5 p-2">
              {suggestedLocations.length === 0 && (
                <p className="p-2 text-xs text-white/40">Aucun lieu suggéré pour ce type.</p>
              )}
              {suggestedLocations.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setAddress(`${l.name}, ${l.address}`)
                    setShowLocations(false)
                  }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-white/80 hover:bg-white/10"
                >
                  <MapPin size={13} className="text-red-400 shrink-0" />
                  <span>
                    <span className="font-medium text-white">{l.name}</span> — {l.address}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Règles
          </label>
          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            rows={3}
            placeholder="Ex : casque obligatoire, respect du voisinage..."
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Conditions
          </label>
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            rows={2}
            placeholder="Ex : places limitées, niveau requis..."
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-red-500"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-full bg-gradient-to-r from-red-600 to-red-800 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 hover:opacity-90"
        >
          Publier le Rasso
        </button>
      </form>
    </div>
  )
}
