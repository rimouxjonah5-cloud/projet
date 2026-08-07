import { Home as HouseIcon, MapPin, Clock, CalendarDays, ScrollText, MessageCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import type { VehicleType } from '../types'

const TYPE_LABEL: Record<VehicleType, string> = {
  voiture: 'Voiture',
  moto: 'Moto',
  mixte: 'Mixte',
}

const TYPE_EMOJI: Record<VehicleType, string> = {
  voiture: '🚗',
  moto: '🏍️',
  mixte: '🔀',
}

export function Home() {
  const { state } = useApp()
  const navigate = useNavigate()

  const events = [...state.events].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="min-h-full bg-gradient-to-b from-black via-red-950 to-red-800">
      <div className="flex items-center gap-2 px-4 pt-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
          <HouseIcon size={18} className="text-red-400" />
        </span>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Accueil</h1>
          <p className="text-xs text-white/60">Tous les Rasso créés par la communauté</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-5">
        {events.length === 0 && (
          <p className="mt-10 text-center text-sm text-white/50">
            Aucun Rasso pour le moment. Crée le premier avec le bouton +
          </p>
        )}

        {events.map((ev) => (
          <article
            key={ev.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-lg shadow-black/40 backdrop-blur"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-red-700/80 to-black/60 px-4 py-3">
              <h2 className="text-base font-semibold text-white">{ev.title}</h2>
              <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white">
                {TYPE_EMOJI[ev.type]} {TYPE_LABEL[ev.type]}
              </span>
            </div>

            <div className="space-y-2 px-4 py-3 text-sm text-white/85">
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-red-400 shrink-0" />
                {ev.address}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays size={15} className="text-red-400 shrink-0" />
                {format(parseISO(ev.date), 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={15} className="text-red-400 shrink-0" />
                {ev.time}
              </p>

              {ev.rules && (
                <div className="mt-2 rounded-xl bg-white/5 p-3">
                  <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/50">
                    <ScrollText size={13} /> Règles
                  </p>
                  <p className="text-sm text-white/80">{ev.rules}</p>
                </div>
              )}

              {ev.conditions && (
                <p className="text-xs text-white/50">Conditions : {ev.conditions}</p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <img src={ev.creatorPhoto} alt="" className="h-7 w-7 rounded-full" />
                <span className="text-xs text-white/70">Organisé par {ev.creatorName}</span>
              </div>
              {ev.creatorId !== 'me' && (
                <button
                  onClick={() => navigate(`/messages/${ev.creatorId}`)}
                  className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
                >
                  <MessageCircle size={14} /> Contacter
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
