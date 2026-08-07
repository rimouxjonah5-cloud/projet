import { useRef, useState, type ChangeEvent } from 'react'
import { Camera, Car, Bike, Pencil, Check } from 'lucide-react'
import { useApp } from '../store/AppContext'
import type { Profile as ProfileType } from '../types'

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function Profile() {
  const { state, updateProfile } = useApp()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ProfileType>(state.profile)

  const bannerInput = useRef<HTMLInputElement>(null)
  const photoInput = useRef<HTMLInputElement>(null)
  const carInput = useRef<HTMLInputElement>(null)
  const motoInput = useRef<HTMLInputElement>(null)

  async function handleUpload(e: ChangeEvent<HTMLInputElement>, field: keyof ProfileType) {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    setDraft((d) => ({ ...d, [field]: dataUrl }))
  }

  function save() {
    updateProfile(draft)
    setEditing(false)
  }

  const profile = editing ? draft : state.profile

  return (
    <div className="pb-6">
      <div className="relative h-36 w-full">
        <img src={profile.bannerUrl} alt="" className="h-full w-full object-cover" />
        {editing && (
          <button
            onClick={() => bannerInput.current?.click()}
            className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur"
          >
            <Camera size={13} /> Bannière
          </button>
        )}
        <input ref={bannerInput} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e, 'bannerUrl')} />
      </div>

      <div className="px-4">
        <div className="-mt-10 flex items-end justify-between">
          <div className="relative">
            <img
              src={profile.photoUrl}
              alt=""
              className="h-20 w-20 rounded-full border-4 border-black object-cover"
            />
            {editing && (
              <button
                onClick={() => photoInput.current?.click()}
                className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white"
                aria-label="Changer la photo de profil"
              >
                <Camera size={13} />
              </button>
            )}
            <input ref={photoInput} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e, 'photoUrl')} />
          </div>

          <button
            onClick={() => {
              if (editing) {
                save()
              } else {
                setDraft(state.profile)
                setEditing(true)
              }
            }}
            className="mb-1 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
          >
            {editing ? (
              <>
                <Check size={14} /> Enregistrer
              </>
            ) : (
              <>
                <Pencil size={14} /> Modifier
              </>
            )}
          </button>
        </div>

        <div className="mt-3">
          {editing ? (
            <input
              value={draft.pseudo}
              onChange={(e) => setDraft((d) => ({ ...d, pseudo: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-lg font-bold text-white outline-none focus:border-red-500"
            />
          ) : (
            <h1 className="text-lg font-bold text-white">{profile.pseudo}</h1>
          )}

          {editing ? (
            <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
              <span>Âge :</span>
              <input
                type="number"
                min={16}
                max={99}
                value={draft.age}
                onChange={(e) => setDraft((d) => ({ ...d, age: Number(e.target.value) }))}
                className="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white outline-none focus:border-red-500"
              />
              <span>ans</span>
            </div>
          ) : (
            <p className="text-sm text-white/60">{profile.age} ans</p>
          )}

          {editing ? (
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              rows={3}
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white outline-none focus:border-red-500"
            />
          ) : (
            <p className="mt-2 text-sm text-white/80">{profile.description}</p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/50">
              <Car size={14} className="text-red-400" /> Ma voiture
            </p>
            {profile.carPhotoUrl ? (
              <img src={profile.carPhotoUrl} alt="Voiture" className="h-24 w-full rounded-lg object-cover" />
            ) : (
              <div className="flex h-24 w-full items-center justify-center rounded-lg bg-black/40 text-xs text-white/30">
                Aucune photo
              </div>
            )}
            {editing && (
              <>
                <button
                  onClick={() => carInput.current?.click()}
                  className="mt-2 w-full rounded-lg bg-white/10 py-1.5 text-xs text-white hover:bg-white/20"
                >
                  Changer
                </button>
                <input ref={carInput} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e, 'carPhotoUrl')} />
              </>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/50">
              <Bike size={14} className="text-red-400" /> Ma moto
            </p>
            {profile.motoPhotoUrl ? (
              <img src={profile.motoPhotoUrl} alt="Moto" className="h-24 w-full rounded-lg object-cover" />
            ) : (
              <div className="flex h-24 w-full items-center justify-center rounded-lg bg-black/40 text-xs text-white/30">
                Aucune photo
              </div>
            )}
            {editing && (
              <>
                <button
                  onClick={() => motoInput.current?.click()}
                  className="mt-2 w-full rounded-lg bg-white/10 py-1.5 text-xs text-white hover:bg-white/20"
                >
                  Changer
                </button>
                <input ref={motoInput} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e, 'motoPhotoUrl')} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
