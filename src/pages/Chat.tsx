import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { avatarFor } from '../utils/avatar'
import type { Friend } from '../types'

export function Chat() {
  const { friendId } = useParams<{ friendId: string }>()
  const { state, sendMessage, getUserById } = useApp()
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [person, setPerson] = useState<Friend | null>(null)

  useEffect(() => {
    if (!friendId) return
    const fromFriends = state.friends.find((f) => f.id === friendId)
    if (fromFriends) {
      setPerson(fromFriends)
      return
    }
    let cancelled = false
    getUserById(friendId).then((found) => {
      if (cancelled) return
      setPerson(found ?? { id: friendId, pseudo: 'Utilisateur', photoUrl: avatarFor(friendId) })
    })
    return () => {
      cancelled = true
    }
  }, [friendId, state.friends, getUserById])

  const thread = state.messages.filter((m) => m.friendId === friendId)

  function handleSend(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() || !friendId) return
    sendMessage(friendId, text.trim())
    setText('')
  }

  if (!person) return null

  return (
    <div className="flex h-full min-h-[calc(100svh-140px)] flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white" aria-label="Retour">
          <ArrowLeft size={20} />
        </button>
        <img src={person.photoUrl} alt="" className="h-9 w-9 rounded-full" />
        <span className="text-sm font-semibold text-white">{person.pseudo}</span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {thread.length === 0 && (
          <p className="mt-6 text-center text-xs text-white/40">
            Aucun message. Dis bonjour à {person.pseudo} !
          </p>
        )}
        {thread.map((m) => (
          <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                m.from === 'me' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/90'
              }`}
            >
              {m.text}
              <span className="mt-1 block text-right text-[10px] opacity-60">{m.time}</span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-white/10 px-3 py-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écris un message..."
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-red-500"
        />
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500"
          aria-label="Envoyer"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
