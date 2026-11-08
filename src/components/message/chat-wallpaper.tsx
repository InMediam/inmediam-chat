const PATTERN = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 18h22a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H28l-8 6v-6h-2a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z"/>
    <circle cx="112" cy="28" r="7"/><path d="M117 33l14 14M126 42l4-4M122 46l3-3"/>
    <path d="M70 70h16l8 8v22H70z"/><path d="M86 70v8h8M76 86h12M76 92h8"/>
    <path d="M128 98l12 10v16h-24v-16z"/><path d="M134 124v-8h-6v8"/>
    <path d="M22 110l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/>
    <circle cx="58" cy="140" r="2.5"/><circle cx="96" cy="140" r="2.5"/><circle cx="150" cy="66" r="2.5"/><circle cx="44" cy="74" r="2.5"/>
  </svg>`,
)

export function ChatWallpaper() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-current text-fg-quaternary opacity-[0.08]"
      style={{
        maskImage: `url("data:image/svg+xml,${PATTERN}")`,
        WebkitMaskImage: `url("data:image/svg+xml,${PATTERN}")`,
        maskSize: '160px',
        WebkitMaskSize: '160px',
      }}
    />
  )
}
