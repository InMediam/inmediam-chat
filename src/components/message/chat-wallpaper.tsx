const HOUSE =
  '<path d="M6 22 24 7l18 15"/><path d="M10 19v21h28V19"/><path d="M20 40V28h8v12"/>'
const KEY =
  '<circle cx="16" cy="24" r="8"/><circle cx="16" cy="24" r="2.5"/><path d="M24 24h18M36 24v6M42 24v5"/>'
const DOCUMENT =
  '<path d="M12 5h17l9 9v29H12z"/><path d="M29 5v9h9M18 22h14M18 28h14M18 34h9"/>'
const SHIELD =
  '<path d="M24 5l16 6v13c0 10-7 16-16 20-9-4-16-10-16-20V11z"/><path d="m16 24 6 6 10-12"/>'
const CAMERA =
  '<rect x="6" y="14" width="36" height="26" rx="4"/><circle cx="24" cy="27" r="7"/><path d="m17 14 3-6h8l3 6"/><circle cx="36" cy="20" r="1"/>'
const BUILDING =
  '<rect x="12" y="6" width="24" height="36" rx="2"/><path d="M17 12h5M26 12h5M17 20h5M26 20h5M17 28h5M26 28h5"/><path d="M21 42V35h6v7"/>'
const SPEECH_BUBBLE =
  '<path d="M8 10h32a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H24L14 41v-9H8a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z"/><path d="M14 18h20M14 25h13"/>'
const BARCODE =
  '<rect x="6" y="12" width="36" height="24" rx="3"/><path d="M12 17v14M16 17v14M19 17v14M24 17v14M28 17v14M31 17v14M36 17v14"/>'
const DOOR =
  '<path d="M12 42V8a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v34M8 42h32"/><circle cx="30" cy="25" r="1.5"/>'

const ROWS = [
  [HOUSE, KEY, DOCUMENT, SHIELD],
  [SHIELD, CAMERA, BUILDING, SPEECH_BUBBLE],
  [SPEECH_BUBBLE, BARCODE, DOOR, HOUSE],
  [HOUSE, KEY, DOCUMENT, SHIELD],
  [SHIELD, CAMERA, BUILDING, SPEECH_BUBBLE],
  [SPEECH_BUBBLE, BARCODE, DOOR, HOUSE],
  [HOUSE, KEY, DOCUMENT, SHIELD],
  [SHIELD, CAMERA, BUILDING, SPEECH_BUBBLE],
]

const TILE_SIZE = 336
const STEP = TILE_SIZE / ROWS.length

function placeIcon(icon: string, x: number, y: number) {
  return `<g transform="translate(${x} ${y}) scale(0.62) translate(-24 -24)">${icon}</g>`
}

// As linhas ímpares começam meio passo à direita, e o ícone cortado na borda
// direita se repete na esquerda para o ladrilho emendar sem costura.
const PATTERN = ROWS.map((icons, row) => {
  const y = STEP / 2 + row * STEP

  return icons
    .map((icon, column) => {
      const x = (row % 2 === 0 ? STEP : 2 * STEP) + column * 2 * STEP

      return x === TILE_SIZE
        ? placeIcon(icon, x, y) + placeIcon(icon, 0, y)
        : placeIcon(icon, x, y)
    })
    .join('')
}).join('')

function buildWallpaperTile(background: string, stroke: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_SIZE}" height="${TILE_SIZE}" viewBox="0 0 ${TILE_SIZE} ${TILE_SIZE}"><rect width="${TILE_SIZE}" height="${TILE_SIZE}" fill="${background}"/><g fill="none" stroke="${stroke}" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${PATTERN}</g></svg>`
}

function toCssUrl(svg: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const LIGHT_TILE = toCssUrl(buildWallpaperTile('#F4F4F2', '#D8D8D1'))
const DARK_TILE = toCssUrl(buildWallpaperTile('#121212', '#2A2A2A'))

export function ChatWallpaper() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{ backgroundImage: LIGHT_TILE }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{ backgroundImage: DARK_TILE }}
      />
    </>
  )
}
