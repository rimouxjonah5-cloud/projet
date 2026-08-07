import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { VerifiedName } from '../components/VerifiedName'
import { Avatar } from '../components/Avatar'

export function Messages() {
  const { state, isOnline } = useApp()
  const navigate = useNavigate()

  function lastMessage(friendId: string) {
    const msgs = state.messages.filter((m) => m.friendId === friendId)
    return msgs[msgs.length - 1]
  }

  return (
    <div className="px-4 py-5">
      <h1 className="text-lg font-bold text-white">Messages</h1>
      <p className="mb-4 text-xs text-white/50">Discute avec les personnes que tu as ajoutées.</p>

      {state.friends.length === 0 ? (
        <p className="mt-10 text-center text-sm text-white/50">
          Tu n'as pas encore d'amis. Utilise la barre de recherche en haut pour en trouver.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {state.friends.map((f) => {
            const last = lastMessage(f.id)
            return (
              <button
                key={f.id}
                onClick={() => navigate(`/messages/${f.id}`)}
                className="flex items-center gap-3 rounded-xl px-2 py-3 text-left hover:bg-white/5"
              >
                <Avatar src={f.photoUrl} size="h-11 w-11" online={isOnline(f.id)} />
                <span className="min-w-0 flex-1">
                  <VerifiedName name={f.pseudo} className="block text-sm font-medium text-white" />
                  <span className="block truncate text-xs text-white/50">
                    {last ? last.text : 'Dis bonjour 👋'}
                  </span>
                </span>
                <MessageCircle size={16} className="shrink-0 text-white/30" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
