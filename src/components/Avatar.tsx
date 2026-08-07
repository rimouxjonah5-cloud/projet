export function Avatar({
  src,
  alt = '',
  size = 'h-10 w-10',
  online = false,
}: {
  src: string
  alt?: string
  size?: string
  online?: boolean
}) {
  return (
    <span className={`relative inline-block shrink-0 ${size}`}>
      <img src={src} alt={alt} className="h-full w-full rounded-full object-cover" />
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-black" />
      )}
    </span>
  )
}
