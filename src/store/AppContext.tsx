import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppState, ChatMessage, Profile, RassoEvent } from '../types'
import { seedState } from './seed'

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

interface AppContextValue {
  state: AppState
  addEvent: (event: Omit<RassoEvent, 'id' | 'creatorId' | 'creatorName' | 'creatorPhoto'>) => void
  togglePresence: (date: string) => void
  addFriend: (friendId: string) => void
  removeFriend: (friendId: string) => void
  sendMessage: (friendId: string, text: string) => void
  updateProfile: (profile: Profile) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

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
      const user = s.discoverableUsers.find((u) => u.id === friendId)
      if (!user) return s
      return {
        ...s,
        friends: [...s.friends, user],
        discoverableUsers: s.discoverableUsers.filter((u) => u.id !== friendId),
      }
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

  return (
    <AppContext.Provider
      value={{ state, addEvent, togglePresence, addFriend, removeFriend, sendMessage, updateProfile }}
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
