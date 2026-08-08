export function DesktopBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="desktop-backdrop pointer-events-none fixed inset-0 z-0 hidden overflow-hidden lg:block"
    >
      <div className="desktop-backdrop-beam" />

      <svg
        className="desktop-backdrop-bolt desktop-backdrop-bolt--left"
        viewBox="0 0 512 512"
        aria-hidden="true"
      >
        <path d="M296 48 L176 288 L240 288 L216 464 L360 224 L288 224 Z" fill="currentColor" />
      </svg>
      <svg
        className="desktop-backdrop-bolt desktop-backdrop-bolt--right"
        viewBox="0 0 512 512"
        aria-hidden="true"
      >
        <path d="M296 48 L176 288 L240 288 L216 464 L360 224 L288 224 Z" fill="currentColor" />
      </svg>

      <p className="desktop-backdrop-word desktop-backdrop-word--left">RASSOGO</p>
      <p className="desktop-backdrop-word desktop-backdrop-word--right">RASSOGO</p>

      <div className="desktop-backdrop-road" />
    </div>
  )
}
