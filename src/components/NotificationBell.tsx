import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Avatar } from './Avatar'
import { VerifiedName } from './VerifiedName'

export function NotificationBell() {
  const { state, markNotificationsRead } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const unreadCount = state.notifications.filter((n) => !n.read).length

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function toggle() {
    const next = !open
    setOpen(next)
    if (next && unreadCount > 0) markNotificationsRead()
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={toggle}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white/80 hover:bg-white/15"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-black" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 shadow-xl">
          {state.notifications.length === 0 ? (
            <p className="p-4 text-sm text-white/50">Aucune notification pour le moment.</p>
          ) : (
            <div className="p-2">
              {state.notifications.map((n) => (
                <div key={n.id} className="flex items-center gap-3 rounded-xl px-2 py-2">
                  <Avatar src={n.actorPhoto} size="h-9 w-9" />
                  <p className="text-sm text-white/90">
                    <VerifiedName name={n.actorName} className="font-medium text-white" /> te suit maintenant
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
