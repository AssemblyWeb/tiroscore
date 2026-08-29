export type ShotValue = number | 'M'

export type Animal = {
  id: number
  tipo: string
  superficie: 'chica' | 'media' | 'grande'
  imagen: string
}

export type TournamentStation = {
  distancia: number
  altura: 'llano' | 'abajo' | 'arriba'
  animalId: number
}

export type Station = {
  number: number
  name: string
  target: string
  animalId: number
  distancia: number
  altura: TournamentStation['altura']
  flecha1: ShotValue
  flecha2: ShotValue
  score: number
  maxScore: number
  hits: number
  arrows: number
  acumulado: number
  zona10?: number
  zona11?: number
}

export type Archer = {
  name: string
  club: string
  location: string
  division: string
  scores: (number | null)[]
  stations: Station[]
  encabezado?: {
    organizador: string
    fecha: string
    patrulla: number
    arq_n: number
    sexo: string
    startingPoint?: number
    total?: number
  }
}

export const animales: Animal[] = [
  { id: 1, tipo: 'zorro', superficie: 'media', imagen: '/animals/zorro.png' },
  { id: 2, tipo: 'lobo echado', superficie: 'media', imagen: '/animals/lobo-echado.png' },
  { id: 3, tipo: 'caracol', superficie: 'chica', imagen: '/animals/caracol.png' },
  { id: 4, tipo: 'mandril', superficie: 'media', imagen: '/animals/mandril.png' },
  { id: 5, tipo: 'mulita', superficie: 'chica', imagen: '/animals/mulita.png' },
  { id: 6, tipo: 'oso', superficie: 'grande', imagen: '/animals/oso.png' },
  { id: 7, tipo: 'ardilla', superficie: 'chica', imagen: '/animals/ardilla.png' },
  { id: 8, tipo: 'buho', superficie: 'media', imagen: '/animals/buho.png' },
  { id: 9, tipo: 'liebre', superficie: 'chica', imagen: '/animals/liebre.png' },
  { id: 10, tipo: 'perdiz', superficie: 'chica', imagen: '/animals/perdiz.png' },
  { id: 11, tipo: 'gato', superficie: 'media', imagen: '/animals/gato.png' },
  { id: 12, tipo: 'condor', superficie: 'media', imagen: '/animals/condor.png' },
  { id: 13, tipo: 'tortuga', superficie: 'media', imagen: '/animals/tortuga.png' },
  { id: 14, tipo: 'pavo', superficie: 'grande', imagen: '/animals/pavo.png' },
  { id: 15, tipo: 'buitre', superficie: 'grande', imagen: '/animals/buitre.png' },
  { id: 16, tipo: 'lobo parado', superficie: 'grande', imagen: '/animals/lobo-parado.png' },
]

export const getAnimal = (id: number) => animales.find((animal) => animal.id === id)

export const torneoPrimeraFecha = {
  id: '1-fecha-2026-06-21', fecha: '21/06/26', nombre: '1ª Fecha', totalEstaciones: 24, vueltas: 2,
  tipoTorneo: '2 vueltas de 12 estaciones (blancos repetidos)',
  estaciones: {
    1: { distancia: 10, altura: 'llano', animalId: 5 }, 2: { distancia: 26, altura: 'llano', animalId: 6 },
    3: { distancia: 16, altura: 'llano', animalId: 14 }, 4: { distancia: 14, altura: 'abajo', animalId: 13 },
    5: { distancia: 23, altura: 'abajo', animalId: 2 }, 6: { distancia: 20, altura: 'llano', animalId: 15 },
    7: { distancia: 23, altura: 'llano', animalId: 16 }, 8: { distancia: 7, altura: 'llano', animalId: 10 },
    9: { distancia: 8, altura: 'abajo', animalId: 3 }, 10: { distancia: 19, altura: 'llano', animalId: 4 },
    11: { distancia: 10, altura: 'llano', animalId: 1 }, 12: { distancia: 25, altura: 'llano', animalId: 8 },
  } as Record<number, TournamentStation>,
}

export const tournament = {
  slug: 'copa-apertura-pinamar-2026', name: 'Copa Apertura Pinamar', location: 'Pinamar, Buenos Aires', date: '21 de junio de 2026', category: 'Tradicional', stations: 24,
  config: torneoPrimeraFecha,
}

const stationNames = ['Estación 1', 'Estación 2', 'Estación 3', 'Estación 4', 'Estación 5', 'Estación 6', 'Estación 7', 'Estación 8', 'Estación 9', 'Estación 10', 'Estación 11', 'Estación 12', 'Estación 1 · Vuelta 2', 'Estación 2 · Vuelta 2', 'Estación 3 · Vuelta 2', 'Estación 4 · Vuelta 2', 'Estación 5 · Vuelta 2', 'Estación 6 · Vuelta 2', 'Estación 7 · Vuelta 2', 'Estación 8 · Vuelta 2', 'Estación 9 · Vuelta 2', 'Estación 10 · Vuelta 2', 'Estación 11 · Vuelta 2', 'Estación 12 · Vuelta 2']
const targets = [5, 6, 14, 13, 2, 15, 2, 10, 3, 4, 1, 8, 5, 6, 14, 13, 2, 15, 2, 10, 3, 4, 1, 8]

function makeStations(base: number, variation: number): Station[] {
  let acumulado = 0
  return stationNames.map((name, index) => {
    const score = Math.max(0, Math.min(20, base + ((index * 7 + variation * 3) % 8) - 3))
    const flecha1 = score === 0 ? 'M' : Math.min(11, score)
    const flecha2 = score === 0 ? 'M' : Math.max(0, score - Number(flecha1))
    acumulado += score
    const config = tournament.config.estaciones[index % 12 + 1]
    const animal = animales.find((item) => item.id === (config?.animalId ?? targets[index]))
    return { number: index + 1, name, target: animal?.tipo ?? 'blanco 3D', animalId: animal?.id ?? 0, distancia: config?.distancia ?? 0, altura: config?.altura ?? 'llano', flecha1, flecha2, score, maxScore: 20, hits: score > 0 ? 1 : 0, arrows: 2, acumulado }
  })
}

const alfioStations: Station[] = [
  [8, 5, 13], [10, 8, 31, 1], [10, 5, 46, 1], [8, 5, 59], [5, 'M', 64], [8, 'M', 74], [5, 'M', 79], [11, 5, 95, undefined, 1], [8, 'M', 103], [5, 'M', 108], ['M', 'M', 108], [8, 'M', 116], [10, 8, 134, 1], [8, 'M', 144], [5, 5, 154], ['M', 'M', 154], ['M', 'M', 154], [8, 5, 167], [8, 'M', 175], [5, 5, 185], [5, 5, 195], [5, 5, 205], [8, 'M', 213], [8, 5, 226],
].map(([flecha1, flecha2, acumulado, zona10, zona11], index) => {
  const startingPoint = 8
  const courseNumber = ((startingPoint - 1 + (index % 12)) % 12) + 1
  const config = tournament.config.estaciones[courseNumber]
  const animal = animales.find((item) => item.id === (config?.animalId ?? targets[courseNumber - 1]))
  return { number: courseNumber, name: `Estación ${courseNumber}${index >= 12 ? ' · Vuelta 2' : ' · Vuelta 1'}`, target: animal?.tipo ?? 'blanco 3D', animalId: animal?.id ?? 0, distancia: config?.distancia ?? 0, altura: config?.altura ?? 'llano', flecha1: flecha1 as ShotValue, flecha2: flecha2 as ShotValue, score: Number(flecha1 === 'M' ? 0 : flecha1) + Number(flecha2 === 'M' ? 0 : flecha2), maxScore: 20, hits: flecha1 === 'M' && flecha2 === 'M' ? 0 : 1, arrows: 2, acumulado: Number(acumulado), ...(zona10 ? { zona10: Number(zona10) } : {}), ...(zona11 ? { zona11: Number(zona11) } : {}) }
})

export const archers: Archer[] = [
  { name: 'Alexis yarde buller', club: 'APCET', location: 'Pinamar', division: 'Masculino Senior', scores: [352, null, null, null], stations: makeStations(15, 1) },
  { name: 'Javier Carmona', club: 'Arquero libre', location: 'Pinamar', division: 'Masculino Senior', scores: [325, null, null, null], stations: makeStations(14, 2) },
  { name: 'Matias Latorre', club: 'APCET', location: 'Pinamar', division: 'Masculino Senior', scores: [300, null, null, null], stations: makeStations(13, 3) },
  { name: 'Rene correa', club: 'APCET', location: 'Pinamar', division: 'Masculino Senior', scores: [273, null, null, null], stations: makeStations(12, 4) },
  { name: 'Roberto Benjamin Orden', club: '3DAVG', location: 'Villa Gesell', division: 'Masculino Senior', scores: [252, null, null, null], stations: makeStations(11, 5) },
  { name: 'Alfio Perino', club: 'APCET', location: 'Pinamar', division: 'Masculino Senior', scores: [226, null, null, null], encabezado: { organizador: 'ARQUERÍA PINAMAR CET', fecha: '21/06/26', patrulla: 8, arq_n: 2, sexo: 'Masc.', startingPoint: 8, total: 226 }, stations: alfioStations },
  { name: 'Guillermo peralta', club: 'APCET', location: 'Pinamar', division: 'Masculino Senior', scores: [209, null, null, null], stations: makeStations(10, 7) },
  { name: 'Oscar Gómez', club: 'APCET', location: 'Pinamar', division: 'Escuela', scores: [350, null, null, null], stations: makeStations(15, 8) },
  { name: 'Elizabeth Bergesio', club: 'APCET', location: 'Pinamar', division: 'Escuela', scores: [279, null, null, null], stations: makeStations(12, 9) },
  { name: 'Claudia Tiezzi', club: 'APCET', location: 'Pinamar', division: 'Escuela', scores: [221, null, null, null], stations: makeStations(10, 10) },
  { name: 'Matias Maximiliano Morel Zabala', club: 'APCET', location: 'Pinamar', division: 'Escuela', scores: [184, null, null, null], stations: makeStations(9, 11) },
  { name: 'Ana Claudia Reynoso', club: 'APCET', location: 'Pinamar', division: 'Escuela', scores: [104, null, null, null], stations: makeStations(6, 12) },
]

export const divisions = ['Masculino Senior', 'Escuela'].map((name) => ({ name, rows: archers.filter((archer) => archer.division === name) }))
export const tournamentStats = { participants: archers.length, arrows: archers.length * tournament.stations * 2, average: Math.round(archers.reduce((sum, archer) => sum + (archer.scores[0] ?? 0), 0) / archers.length), maxScore: tournament.stations * 20 }
export const total = (scores: (number | null)[]) => scores.reduce<number>((sum, score) => sum + (score ?? 0), 0)
export const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
export const getArcher = (slug: string) => { const normalized = slugify(slug); const compact = normalized.replaceAll('-', ''); return archers.find((archer) => { const archerSlug = slugify(archer.name); return archerSlug === normalized || archerSlug.replaceAll('-', '') === compact }) }
export const getStationAverage = (stationNumber: number) => Math.round(archers.reduce((sum, archer) => sum + archer.stations[stationNumber - 1].score, 0) / archers.length)

export const getArcherMetrics = (archer: Archer) => ({ total: archer.encabezado?.total ?? archer.stations.reduce((sum, station) => sum + station.score, 0), aciertos: archer.stations.reduce((sum, station) => sum + station.hits, 0), zonas10: archer.stations.reduce((sum, station) => sum + (station.zona10 ?? 0), 0), zonas11: archer.stations.reduce((sum, station) => sum + (station.zona11 ?? 0), 0) })

export const planillaTiro3D = archers.find((archer) => archer.name === 'Alfio Perino')
