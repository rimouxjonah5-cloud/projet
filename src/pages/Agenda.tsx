import { useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react'
import { useApp } from '../store/AppContext'

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function Agenda() {
  const { state, togglePresence } = useApp()
  const [cursor, setCursor] = useState(new Date())
  const [selected, setSelected] = useState(format(new Date(), 'yyyy-MM-dd'))

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [cursor])

  const eventDates = useMemo(() => new Set(state.events.map((e) => e.date)), [state.events])

  const selectedEvents = state.events.filter((e) => e.date === selected)
  const isPresentSelected = state.presence.includes(selected)

  return (
    <div className="px-4 py-5">
      <h1 className="text-lg font-bold text-white">Mon planning</h1>
      <p className="mb-4 text-xs text-white/50">
        Clique sur un jour pour indiquer si tu es présent — ça se marque directement sur le planning.
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => setCursor((c) => subMonths(c, 1))}
            className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Mois précédent"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold capitalize text-white">
            {format(cursor, 'MMMM yyyy', { locale: fr })}
          </span>
          <button
            onClick={() => setCursor((c) => addMonths(c, 1))}
            className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Mois suivant"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-white/40">
          {WEEKDAYS.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((day) => {
            const iso = format(day, 'yyyy-MM-dd')
            const present = state.presence.includes(iso)
            const inMonth = isSameMonth(day, cursor)
            const isSelected = isSameDay(day, parseISO(selected))
            const hasEvent = eventDates.has(iso)

            return (
              <button
                key={iso}
                onClick={() => {
                  setSelected(iso)
                  togglePresence(iso)
                }}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-colors ${
                  present
                    ? 'bg-red-600 text-white font-semibold'
                    : inMonth
                      ? 'text-white/80 hover:bg-white/10'
                      : 'text-white/25 hover:bg-white/5'
                } ${isSelected && !present ? 'ring-1 ring-red-500' : ''} ${
                  isToday(day) && !present ? 'border border-red-500/70' : ''
                }`}
              >
                {format(day, 'd')}
                {hasEvent && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 rounded-full ${present ? 'bg-white' : 'bg-red-500'}`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            {format(parseISO(selected), 'EEEE d MMMM', { locale: fr })}
          </h2>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              isPresentSelected ? 'bg-red-600 text-white' : 'bg-white/10 text-white/50'
            }`}
          >
            {isPresentSelected ? 'Présent ✓' : 'Non marqué'}
          </span>
        </div>

        {selectedEvents.length === 0 ? (
          <p className="text-sm text-white/40">Aucun Rasso prévu ce jour.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedEvents.map((ev) => (
              <div key={ev.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-sm font-medium text-white">{ev.title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                  <MapPin size={12} /> {ev.address}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
                  <Clock size={12} /> {ev.time}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
