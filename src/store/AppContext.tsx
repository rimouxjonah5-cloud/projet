import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppState, ChatMessage, Friend, Profile, RassoEvent } from '../types'
import { seedDiscoverableUsers, seedState } from './seed'

const STORAGE_KEY = 'rasso-app-state-v1'

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    // ignore corrupt storage
  }
  return seedState
}

export interface AppContextValue {
  state: AppState
  addEvent: (event: Omit<RassoEvent, 'id' | 'creatorId' | 'creatorName' | 'creatorPhoto'>) => void
  togglePresence: (date: string) => void
  addFriend: (friendId: string) => void
  removeFriend: (friendId: string) => void
  sendMessage: (friendId: string, text: string) => void
  updateProfile: (profile: Profile) => void
  searchUsers: (query: string) => Promise<Friend[]>
  getUserById: (id: string) => Promise<Friend | null>
}

export const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)
  const [discoverable, setDiscoverable] = useState<Friend[]>(seedDiscoverableUsers)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function addEvent(event: Omit<RassoEvent, 'id' | 'creatorId' | 'creatorName' | 'creatorPhoto'>) {
    setState((s) => ({
      ...s,
      events: [
        {
          ...event,
          id: `e${Date.now()}`,
          creatorId: 'me',
          creatorName: s.profile.pseudo,
          creatorPhoto: s.profile.photoUrl,
        },
        ...s.events,
      ],
      presence: s.presence.includes(event.date) ? s.presence : [...s.presence, event.date],
    }))
  }

  function togglePresence(date: string) {
    setState((s) => ({
      ...s,
      presence: s.presence.includes(date)
        ? s.presence.filter((d) => d !== date)
        : [...s.presence, date],
    }))
  }

  function addFriend(friendId: string) {
    setState((s) => {
      if (s.friends.some((f) => f.id === friendId)) return s
      const user = discoverable.find((u) => u.id === friendId)
      if (!user) return s
      setDiscoverable((d) => d.filter((u) => u.id !== friendId))
      return { ...s, friends: [...s.friends, user] }
    })
  }

  function removeFriend(friendId: string) {
    setState((s) => ({ ...s, friends: s.friends.filter((f) => f.id !== friendId) }))
  }

  function sendMessage(friendId: string, text: string) {
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      friendId,
      from: 'me',
      text,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }
    setState((s) => ({ ...s, messages: [...s.messages, msg] }))
  }

  function updateProfile(profile: Profile) {
    setState((s) => ({ ...s, profile }))
  }

  async function searchUsers(query: string): Promise<Friend[]> {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return discoverable.filter((f) => f.pseudo.toLowerCase().includes(q))
  }

  async function getUserById(id: string): Promise<Friend | null> {
    return (
      state.friends.find((f) => f.id === id) ??
      discoverable.find((f) => f.id === id) ??
      null
    )
  }

  return (
    <AppContext.Provider
      value={{
        state,
        addEvent,
        togglePresence,
        addFriend,
        removeFriend,
        sendMessage,
        updateProfile,
        searchUsers,
        getUserById,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
