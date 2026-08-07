import { BadgeCheck } from 'lucide-react'

const CREATOR_PSEUDO = 'ghost'

export function VerifiedName({ name, className = '' }: { name: string; className?: string }) {
  if (name.trim().toLowerCase() !== CREATOR_PSEUDO) {
    return <span className={className}>{name}</span>
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="ghost-name font-bold">{name}</span>
      <BadgeCheck size={15} className="shrink-0 text-blue-500" fill="#3b82f6" stroke="white" strokeWidth={2} />
      <span className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-400">
        Créateur
      </span>
    </span>
  )
}
