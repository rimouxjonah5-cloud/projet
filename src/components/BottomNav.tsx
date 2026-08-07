import { Home, CalendarDays, Plus, MessageCircle, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const linkBase =
  'flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[11px] font-medium transition-colors'

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-end px-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? 'text-red-500' : 'text-white/50 hover:text-white/80'}`
          }
        >
          <Home size={22} />
          Accueil
        </NavLink>

        <NavLink
          to="/agenda"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? 'text-red-500' : 'text-white/50 hover:text-white/80'}`
          }
        >
          <CalendarDays size={22} />
          Agenda
        </NavLink>

        <NavLink to="/create" className="flex flex-1 flex-col items-center justify-center">
          {({ isActive }) => (
            <>
              <span
                className={`-mt-6 flex h-14 w-14 items-center justify-center rounded-full border-4 border-black shadow-lg shadow-red-900/50 ${
                  isActive ? 'bg-red-500' : 'bg-gradient-to-br from-red-600 to-black'
                }`}
              >
                <Plus size={28} className="text-white" strokeWidth={2.5} />
              </span>
              <span className={`mt-1 text-[11px] font-medium ${isActive ? 'text-red-500' : 'text-white/50'}`}>
                Créer
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? 'text-red-500' : 'text-white/50 hover:text-white/80'}`
          }
        >
          <MessageCircle size={22} />
          Message
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? 'text-red-500' : 'text-white/50 hover:text-white/80'}`
          }
        >
          <UserRound size={22} />
          Profil
        </NavLink>
      </div>
    </nav>
  )
}
