import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import { AppContext, type AppContextValue } from './AppContext'
import type { AppState, ChatMessage, Friend, Profile, RassoEvent } from '../types'
import { avatarFor } from '../utils/avatar'
import { AgeOnboarding } from '../components/AgeOnboarding'

const emptyState: AppState = {
  profile: { pseudo: '', age: 0, photoUrl: '', bannerUrl: '', description: '', carPhotoUrl: '', motoPhotoUrl: '' },
  friends: [],
  events: [],
  locations: [],
  presence: [],
  messages: [],
}

interface ProfileRow {
  id: string
  pseudo: string
  age: number | null
  photo_url: string | null
  banner_url: string | null
  description: string | null
  car_photo_url: string | null
  moto_photo_url: string | null
}

function toProfile(row: ProfileRow): Profile {
  return {
    pseudo: row.pseudo,
    age: row.age ?? 0,
    photoUrl: row.photo_url || avatarFor(row.pseudo),
    bannerUrl: row.banner_url || '',
    description: row.description || '',
    carPhotoUrl: row.car_photo_url || '',
    motoPhotoUrl: row.moto_photo_url || '',
  }
}

function toFriend(row: ProfileRow): Friend {
  return { id: row.id, pseudo: row.pseudo, photoUrl: row.photo_url || avatarFor(row.pseudo) }
}

export function SupabaseAppProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [state, setState] = useState<AppState>(emptyState)
  const [loaded, setLoaded] = useState(false)
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set())

  const loadAll = useCallback(async (uid: string) => {
    const [profileRes, friendshipsRes, eventsRes, presenceRes, messagesRes, locationsRes] = await Promise.all([
      supabase!.from('profiles').select('*').eq('id', uid).single(),
      supabase!.from('friendships').select('friend_id').eq('user_id', uid),
      supabase!
        .from('events')
        .select('*, creator:profiles!events_creator_id_fkey(id, pseudo, photo_url)')
        .order('event_date', { ascending: true }),
      supabase!.from('presence').select('present_date').eq('user_id', uid),
      supabase!
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${uid},recipient_id.eq.${uid}`)
        .order('created_at', { ascending: true }),
      supabase!.from('locations').select('*'),
    ])

    const friendIds = (friendshipsRes.data ?? []).map((f) => f.friend_id as string)
    const friendsRes = friendIds.length
      ? await supabase!.from('profiles').select('*').in('id', friendIds)
      : { data: [] as ProfileRow[] }

    const events: RassoEvent[] = (eventsRes.data ?? []).map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      address: e.address,
      date: e.event_date,
      time: (e.event_time as string).slice(0, 5),
      rules: e.rules || '',
      conditions: e.conditions || '',
      creatorId: e.creator_id,
      creatorName: e.creator?.pseudo ?? 'Utilisateur',
      creatorPhoto: e.creator?.photo_url || avatarFor(e.creator?.pseudo ?? e.creator_id),
    }))

    const messages: ChatMessage[] = (messagesRes.data ?? []).map((m) => ({
      id: m.id,
      friendId: m.sender_id === uid ? m.recipient_id : m.sender_id,
      from: m.sender_id === uid ? 'me' : 'them',
      text: m.text,
      time: new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }))

    setState({
      profile: profileRes.data ? toProfile(profileRes.data) : emptyState.profile,
      friends: (friendsRes.data ?? []).map(toFriend),
      events,
      locations: (locationsRes.data ?? []).map((l) => ({ id: l.id, name: l.name, address: l.address, type: l.type })),
      presence: (presenceRes.data ?? []).map((p) => p.present_date as string),
      messages,
    })
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        loadAll(data.user.id)
      }
    })
  }, [loadAll])

  useEffect(() => {
    if (!supabase || !userId) return
    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const m = payload.new as { id: string; sender_id: string; recipient_id: string; text: string; created_at: string }
          if (m.sender_id !== userId && m.recipient_id !== userId) return
          setState((s) => {
            if (s.messages.some((existing) => existing.id === m.id)) return s
            const msg: ChatMessage = {
              id: m.id,
              friendId: m.sender_id === userId ? m.recipient_id : m.sender_id,
              from: m.sender_id === userId ? 'me' : 'them',
              text: m.text,
              time: new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            }
            return { ...s, messages: [...s.messages, msg] }
          })
        },
      )
      .subscribe()

    return () => {
      supabase!.removeChannel(channel)
    }
  }, [userId])

  useEffect(() => {
    if (!supabase || !userId) return
    const channel = supabase.channel('online-users', {
      config: { presence: { key: userId } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        setOnlineIds(new Set(Object.keys(channel.presenceState())))
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.track({ online_at: new Date().toISOString() })
        }
      })

    return () => {
      supabase!.removeChannel(channel)
    }
  }, [userId])

  const isOnline: AppContextValue['isOnline'] = (id) => onlineIds.has(id)

  const addEvent: AppContextValue['addEvent'] = (event) => {
    if (!supabase || !userId) return
    supabase
      .from('events')
      .insert({
        creator_id: userId,
        title: event.title,
        type: event.type,
        address: event.address,
        event_date: event.date,
        event_time: event.time,
        rules: event.rules,
        conditions: event.conditions,
      })
      .select('*, creator:profiles!events_creator_id_fkey(id, pseudo, photo_url)')
      .single()
      .then(({ data }) => {
        if (!data) return
        const newEvent: RassoEvent = {
          id: data.id,
          title: data.title,
          type: data.type,
          address: data.address,
          date: data.event_date,
          time: (data.event_time as string).slice(0, 5),
          rules: data.rules || '',
          conditions: data.conditions || '',
          creatorId: data.creator_id,
          creatorName: data.creator?.pseudo ?? state.profile.pseudo,
          creatorPhoto: data.creator?.photo_url || state.profile.photoUrl,
        }
        setState((s) => ({
          ...s,
          events: [newEvent, ...s.events],
          presence: s.presence.includes(event.date) ? s.presence : [...s.presence, event.date],
        }))
      })
    supabase.from('presence').upsert({ user_id: userId, present_date: event.date }).then()
  }

  const removeEvent: AppContextValue['removeEvent'] = (eventId) => {
    if (!supabase || !userId) return
    setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== eventId) }))
    supabase.from('events').delete().eq('id', eventId).eq('creator_id', userId).then()
  }

  const togglePresence: AppContextValue['togglePresence'] = (date) => {
    if (!supabase || !userId) return
    const isPresent = state.presence.includes(date)
    setState((s) => ({
      ...s,
      presence: isPresent ? s.presence.filter((d) => d !== date) : [...s.presence, date],
    }))
    if (isPresent) {
      supabase.from('presence').delete().eq('user_id', userId).eq('present_date', date).then()
    } else {
      supabase.from('presence').upsert({ user_id: userId, present_date: date }).then()
    }
  }

  const addFriend: AppContextValue['addFriend'] = (friendId) => {
    if (!supabase || !userId) return
    supabase.rpc('add_friend', { target_id: friendId }).then(async ({ error }) => {
      if (error) return
      const { data } = await supabase!.from('profiles').select('*').eq('id', friendId).single()
      if (data) setState((s) => ({ ...s, friends: [...s.friends, toFriend(data)] }))
    })
  }

  const removeFriend: AppContextValue['removeFriend'] = (friendId) => {
    if (!supabase) return
    setState((s) => ({ ...s, friends: s.friends.filter((f) => f.id !== friendId) }))
    supabase.rpc('remove_friend', { target_id: friendId }).then()
  }

  const sendMessage: AppContextValue['sendMessage'] = (friendId, text) => {
    if (!supabase || !userId) return
    supabase
      .from('messages')
      .insert({ sender_id: userId, recipient_id: friendId, text })
      .select()
      .single()
      .then(({ data }) => {
        if (!data) return
        setState((s) => {
          if (s.messages.some((m) => m.id === data.id)) return s
          const msg: ChatMessage = {
            id: data.id,
            friendId,
            from: 'me',
            text: data.text,
            time: new Date(data.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          }
          return { ...s, messages: [...s.messages, msg] }
        })
      })
  }

  const updateProfile: AppContextValue['updateProfile'] = (profile) => {
    if (!supabase || !userId) return
    setState((s) => ({ ...s, profile }))
    supabase
      .from('profiles')
      .update({
        pseudo: profile.pseudo,
        age: profile.age,
        photo_url: profile.photoUrl,
        banner_url: profile.bannerUrl,
        description: profile.description,
        car_photo_url: profile.carPhotoUrl,
        moto_photo_url: profile.motoPhotoUrl,
      })
      .eq('id', userId)
      .then()
  }

  const searchUsers: AppContextValue['searchUsers'] = async (query) => {
    if (!supabase || !userId) return []
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('pseudo', `%${query}%`)
      .neq('id', userId)
      .limit(10)
    const friendIds = new Set(state.friends.map((f) => f.id))
    return (data ?? []).filter((row) => !friendIds.has(row.id)).map(toFriend)
  }

  const getUserById: AppContextValue['getUserById'] = async (id) => {
    if (!supabase) return null
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    return data ? toFriend(data) : null
  }

  if (!loaded) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-black">
        <p className="text-sm text-white/40">Chargement de RassoGo...</p>
      </div>
    )
  }

  if (!state.profile.age) {
    return <AgeOnboarding onSubmit={(age) => updateProfile({ ...state.profile, age })} />
  }

  return (
    <AppContext.Provider
      value={{
        state,
        myId: userId ?? '',
        addEvent,
        removeEvent,
        togglePresence,
        addFriend,
        removeFriend,
        sendMessage,
        updateProfile,
        searchUsers,
        getUserById,
        isOnline,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
