import { useState } from 'react'

export function AgeOnboarding({ onSubmit }: { onSubmit: (age: number) => void }) {
  const [age, setAge] = useState(25)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-black via-red-950 to-black px-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-white">Quel âge as-tu ?</h1>
      <p className="mt-2 max-w-xs text-sm text-white/50">
        Ça s'affichera sur ton profil, pour que les autres sachent à qui ils parlent.
      </p>

      <div className="mt-10 w-full max-w-xs">
        <p className="mb-6 text-6xl font-bold text-white tabular-nums">{age}</p>
        <input
          type="range"
          min={0}
          max={100}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full accent-red-600"
        />
        <div className="mt-1 flex justify-between text-xs text-white/30">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      <button
        onClick={() => onSubmit(age)}
        className="mt-10 w-full max-w-xs rounded-full bg-gradient-to-r from-red-600 to-red-800 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 hover:opacity-90"
      >
        Valider
      </button>
    </div>
  )
}
