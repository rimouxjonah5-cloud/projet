import { Outlet } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { BottomNav } from './BottomNav'
import { NotificationBell } from './NotificationBell'
import { GhostBackdrop } from './GhostBackdrop'

export function Layout() {
  return (
    <>
      <GhostBackdrop />
      <div className="relative z-10 mx-auto flex min-h-svh max-w-md flex-col bg-black text-white lg:shadow-2xl lg:shadow-black">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 px-4 pb-3 pt-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <SearchBar />
            </div>
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </>
  )
}
