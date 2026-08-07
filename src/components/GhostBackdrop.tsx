export function GhostBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="ghost-backdrop pointer-events-none fixed inset-0 z-0 hidden overflow-hidden lg:block"
    >
      <div className="ghost-backdrop-beam" />
      <div className="ghost-backdrop-scene">
        <svg viewBox="0 0 900 500" className="h-full w-full">
          <ellipse cx="450" cy="425" rx="430" ry="24" fill="#000" opacity="0.55" />

          <g transform="translate(100,235)">
            <path
              d="M0,150 L0,128 L16,108 L52,78 L92,24 L142,18 L186,26 L214,52 L232,46 L262,16 L300,62 L316,102 L314,150 Z"
              fill="#030303"
              stroke="#4a4a50"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M92,24 L142,18 L172,44 L84,50 Z"
              fill="#0a0a0d"
              stroke="#4a4a50"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M18,106 L84,86 L200,84 L232,50"
              fill="none"
              stroke="#525259"
              strokeWidth="1.4"
              opacity="0.8"
            />
            <path
              d="M232,46 L262,16 L300,62"
              fill="none"
              stroke="#5c5c63"
              strokeWidth="1.6"
              opacity="0.8"
            />
            <path d="M84,50 L84,86" stroke="#2a2a2e" strokeWidth="1.2" />
            <path d="M0,128 L0,140 L14,140" stroke="#57575e" strokeWidth="2" fill="none" />
            <path d="M2,102 L18,98 L19,108 L4,111 Z" fill="#c9c9ce" opacity="0.9" />
            <path
              d="M296,66 C306,76 312,88 314,100 L306,103 C303,92 298,82 290,74 Z"
              fill="#9a1717"
            />
            <circle cx="58" cy="150" r="38" fill="#020202" stroke="#4a4a50" strokeWidth="3" />
            <circle cx="58" cy="150" r="17" fill="#0a0a0a" stroke="#57575e" strokeWidth="2" />
            <circle cx="272" cy="150" r="42" fill="#020202" stroke="#4a4a50" strokeWidth="3" />
            <circle cx="272" cy="150" r="19" fill="#0a0a0a" stroke="#57575e" strokeWidth="2" />
            <rect x="-3" y="121" width="18" height="10" rx="1.4" fill="#e8e8e0" />
            <text
              x="6"
              y="128.5"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontWeight="700"
              fontSize="4.6"
              fill="#0a0a0a"
              letterSpacing="0.2"
            >
              GHOST
            </text>
          </g>

          <g transform="translate(650,150)">
            <ellipse cx="30" cy="278" rx="46" ry="10" fill="#000" opacity="0.5" />
            <path
              d="M14,178 L10,270 L27,270 L30,188 L33,270 L50,270 L46,178 Z"
              fill="#020202"
              stroke="#38383d"
              strokeWidth="1.5"
            />
            <rect x="5" y="266" width="23" height="13" rx="3" fill="#000" stroke="#2c2c30" strokeWidth="1" />
            <rect x="32" y="266" width="23" height="13" rx="3" fill="#000" stroke="#2c2c30" strokeWidth="1" />
            <path
              d="M8,86 C4,116 6,148 13,182 L47,182 C54,148 56,116 52,86 C51,68 42,54 30,54 C18,54 9,68 8,86 Z"
              fill="#040404"
              stroke="#38383d"
              strokeWidth="1.5"
            />
            <path
              d="M2,88 C0,80 8,72 18,70 L42,70 C52,72 60,80 58,88 L56,100 L4,100 Z"
              fill="#030303"
              stroke="#38383d"
              strokeWidth="1.4"
            />
            <rect
              x="-2"
              y="104"
              width="64"
              height="24"
              rx="12"
              fill="#020202"
              stroke="#3d3d42"
              strokeWidth="1.5"
              transform="rotate(-3 30 116)"
            />
            <ellipse cx="6" cy="112" rx="9" ry="8" fill="#000" stroke="#3d3d42" strokeWidth="1.3" />
            <ellipse cx="54" cy="120" rx="9" ry="8" fill="#000" stroke="#3d3d42" strokeWidth="1.3" />
            <rect x="24" y="44" width="12" height="12" fill="#020202" />
            <path
              d="M30,0 C9,0 -3,16 -3,32 C-3,45 3,53 11,55 L49,55 C57,53 63,45 63,32 C63,16 51,0 30,0 Z"
              fill="#030303"
              stroke="#3a3a3f"
              strokeWidth="2"
            />
            <path
              d="M1,28 C1,40 9,48 17,49 L43,49 C51,48 59,40 59,28 C59,22 52,18 44,18 L16,18 C8,18 1,22 1,28 Z"
              fill="#0a0a0e"
              stroke="#222226"
              strokeWidth="1.5"
            />
            <path
              d="M7,24 C14,20 22,19 30,19"
              stroke="#4e4e58"
              strokeWidth="1.4"
              opacity="0.6"
              fill="none"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
