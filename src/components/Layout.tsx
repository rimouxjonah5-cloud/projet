import { Outlet } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 px-4 pb-3 pt-4 backdrop-blur">
        <SearchBar />
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
