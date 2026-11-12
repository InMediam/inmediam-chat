type Rect = [x: number, y: number, width: number, height: number]

interface SkylineColors {
  backBuilding: string
  frontBuilding: string
  window: string
  windowOpacity: number
  glowOpacity: number
}

const BACK_BUILDINGS: Rect[] = [
  [-20, 306, 69, 254],
  [55, 351, 56, 209],
  [111, 365, 50, 195],
  [164, 347, 104, 213],
  [274, 283, 43, 277],
  [324, 301, 98, 259],
  [429, 171, 64, 389],
  [499, 276, 51, 284],
  [553, 221, 42, 339],
  [599, 296, 106, 264],
  [712, 215, 88, 345],
  [801, 376, 73, 184],
  [875, 242, 89, 318],
  [970, 231, 53, 329],
  [1023, 340, 83, 220],
  [1107, 169, 103, 391],
  [1220, 170, 106, 390],
  [1329, 245, 58, 315],
  [1388, 391, 109, 169],
  [1504, 363, 64, 197],
  [1577, 214, 98, 346],
]

const FRONT_BUILDINGS: { building: Rect; windows: [x: number, y: number][] }[] =
  [
    {
      building: [-20, 377, 106, 183],
      windows: [
        [31, 393],
        [45, 453],
        [59, 453],
        [59, 473],
        [17, 493],
        [45, 493],
        [59, 493],
        [59, 513],
      ],
    },
    {
      building: [95, 346, 107, 214],
      windows: [
        [146, 362],
        [160, 362],
        [174, 362],
        [104, 402],
        [118, 402],
        [132, 402],
        [132, 422],
        [160, 422],
        [104, 442],
        [174, 442],
        [132, 462],
        [104, 482],
        [118, 482],
        [160, 482],
        [104, 522],
        [132, 522],
      ],
    },
    {
      building: [202, 340, 96, 220],
      windows: [
        [211, 396],
        [253, 396],
        [253, 416],
        [267, 456],
        [267, 476],
        [267, 516],
      ],
    },
    {
      building: [306, 430, 114, 130],
      windows: [
        [329, 446],
        [385, 446],
        [357, 526],
        [399, 526],
      ],
    },
    {
      building: [427, 279, 108, 281],
      windows: [
        [464, 295],
        [450, 315],
        [478, 355],
        [436, 375],
        [506, 375],
        [464, 395],
        [492, 395],
        [506, 395],
        [436, 455],
        [478, 455],
        [506, 455],
        [506, 515],
      ],
    },
    {
      building: [539, 288, 113, 272],
      windows: [
        [604, 304],
        [576, 324],
        [604, 324],
        [590, 344],
        [618, 344],
        [632, 344],
        [562, 364],
        [632, 364],
        [562, 384],
        [576, 404],
        [590, 424],
        [604, 424],
        [562, 444],
        [576, 524],
        [590, 524],
        [618, 524],
      ],
    },
    {
      building: [656, 413, 77, 147],
      windows: [
        [707, 429],
        [665, 449],
        [679, 449],
        [707, 449],
        [693, 489],
      ],
    },
    {
      building: [733, 318, 62, 242],
      windows: [
        [756, 374],
        [770, 374],
        [770, 434],
        [742, 454],
        [756, 454],
        [770, 514],
      ],
    },
    {
      building: [798, 422, 74, 138],
      windows: [[807, 478]],
    },
    {
      building: [877, 409, 128, 151],
      windows: [
        [970, 425],
        [886, 445],
        [970, 445],
        [914, 465],
        [984, 465],
        [942, 485],
        [956, 485],
        [928, 505],
        [942, 505],
        [956, 505],
        [984, 505],
        [886, 525],
        [928, 525],
      ],
    },
    {
      building: [1012, 290, 85, 270],
      windows: [
        [1049, 306],
        [1077, 326],
        [1021, 386],
        [1021, 406],
        [1049, 426],
        [1021, 446],
        [1063, 466],
        [1077, 466],
        [1035, 486],
        [1077, 486],
        [1063, 506],
      ],
    },
    {
      building: [1097, 426, 124, 134],
      windows: [
        [1148, 442],
        [1162, 442],
        [1106, 462],
        [1134, 462],
        [1148, 462],
        [1190, 482],
        [1106, 502],
        [1120, 502],
        [1106, 522],
        [1134, 522],
      ],
    },
    {
      building: [1229, 307, 90, 253],
      windows: [
        [1280, 323],
        [1238, 343],
        [1252, 343],
        [1266, 343],
        [1280, 343],
        [1294, 363],
        [1280, 403],
        [1252, 423],
        [1238, 443],
        [1238, 463],
        [1252, 463],
        [1238, 483],
        [1280, 523],
      ],
    },
    {
      building: [1320, 343, 130, 217],
      windows: [
        [1329, 359],
        [1343, 359],
        [1413, 359],
        [1343, 399],
        [1385, 399],
        [1399, 399],
        [1371, 419],
        [1385, 419],
        [1399, 419],
        [1329, 479],
        [1329, 499],
        [1427, 499],
        [1329, 519],
        [1343, 519],
      ],
    },
    {
      building: [1456, 306, 121, 254],
      windows: [
        [1493, 362],
        [1549, 362],
        [1479, 382],
        [1549, 382],
        [1479, 422],
        [1521, 422],
        [1535, 442],
        [1479, 462],
        [1521, 462],
        [1521, 482],
        [1549, 502],
        [1507, 522],
      ],
    },
    {
      building: [1580, 358, 57, 202],
      windows: [
        [1603, 394],
        [1589, 414],
        [1617, 414],
        [1603, 434],
        [1589, 474],
        [1603, 474],
        [1589, 494],
        [1603, 494],
      ],
    },
  ]

function rect([x, y, width, height]: Rect, fill: string) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`
}

function fadingGradient(id: string, color: string, top: number) {
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="${top}"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient>`
}

function buildSkyline(colors: SkylineColors) {
  const back = BACK_BUILDINGS.map((building) => rect(building, 'url(#back)'))
  const front = FRONT_BUILDINGS.map(
    ({ building, windows }) =>
      rect(building, 'url(#front)') +
      `<g fill="${colors.window}" fill-opacity="${colors.windowOpacity}">${windows
        .map(
          ([x, y]) => `<rect x="${x}" y="${y}" width="6" height="9" rx="1"/>`,
        )
        .join('')}</g>`,
  )

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="560" viewBox="0 0 1600 560" preserveAspectRatio="xMidYMax slice"><defs>${fadingGradient('back', colors.backBuilding, 140)}${fadingGradient('front', colors.frontBuilding, 240)}<radialGradient id="glow" cx="50%" cy="100%" r="70%"><stop offset="0" stop-color="#F5C21B" stop-opacity="${colors.glowOpacity}"/><stop offset="1" stop-color="#F5C21B" stop-opacity="0"/></radialGradient></defs><rect width="1600" height="560" fill="url(#glow)"/>${back.join('')}${front.join('')}</svg>`

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const LIGHT_SKYLINE = buildSkyline({
  backBuilding: '#DCDCDC',
  frontBuilding: '#CACACA',
  window: '#FAFAFA',
  windowOpacity: 0.55,
  glowOpacity: 0.06,
})

const DARK_SKYLINE = buildSkyline({
  backBuilding: '#202020',
  frontBuilding: '#2C2C2C',
  window: '#F5C21B',
  windowOpacity: 0.16,
  glowOpacity: 0.07,
})

// `100% 100%` entrega o corte ao `xMidYMax slice` do SVG: a silhueta cobre a
// largura e fica ancorada no rodapé em qualquer proporção da conversa.
const SKYLINE_STYLE = {
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
}

export function ChatWallpaper() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-secondary"
    >
      <div
        className="absolute inset-0 dark:hidden"
        style={{ ...SKYLINE_STYLE, backgroundImage: LIGHT_SKYLINE }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{ ...SKYLINE_STYLE, backgroundImage: DARK_SKYLINE }}
      />
    </div>
  )
}
