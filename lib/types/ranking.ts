export type RankingArcher = {
  id: string
  name: string
  slug: string
  club: string
  location: string
  division: string
  category: string
  scores: (number | null)[]
  total: number
}

export type RankingDivision = {
  name: string
  rows: RankingArcher[]
}

export type SeasonInfo = {
  slug: string
  name: string
  subtitle: string
}

export type Animal = {
  id: number
  tipo: string
  superficie: 'chica' | 'media' | 'grande'
  imagen: string
}

export type Tournament = {
  id: string
  name: string
  date: string
  dateLabel: string
  stationCount: number
  laps: number
  type: string
}

export type CourseStation = {
  number: number
  yellow_marker_distance: number
  blue_marker_distance: number
  red_marker_distance: number
  height: string
  animal: Animal | null
}

export type PlanillaHeader = {
  id: number
  patrol: number | null
  archerNumber: number | null
  startingStation: number | null
  division: string | null
  categoria: string | null
}

export type TiroEstacionHeader = {
  id: number
  tiro1: number | null
  tiro2: number | null
  parcial: number | null
  acumulado: number | null
}

export type CategoryDistance = 'cortas' | 'medias' | 'largas'

export type EstacionesPorDistancia = {
  cortas: CourseStation[]
  medias: CourseStation[]
  largas: CourseStation[]
}


export type ArqueroRow = {
  id: number
  nombre: string
  club: string
  categoria: string
  division: string
  localidad: string
  torneo_1: number | null
  torneo_2: number | null
  torneo_3: number | null
  torneo_4: number | null
  total: number | null
}

export type TorneoRow = {
  id: string
  fecha: string | null
  nombre: string
  total_estaciones: number | null
  vueltas: number | null
  tipo_torneo: string | null
}

export type AnimalRow = {
  id: number
  tipo: string
  superficie: Animal['superficie']
  imagen: string
}

export type PlanillaRow = {
  id: number
  torneo_id: string
  arquero_id: number
  patrulla: number | null
  division: string | null
  clase: string | null
  arquero_numero: number | null
  estacion_inicial: number | null
  torneos?: TorneoRow | TorneoRow[] | null
  arqueros?: ArqueroRow | ArqueroRow[] | null
}

export type TournamentHistoryEntry = {
  id: number
  torneo_id: string | null
  arquero_id: number | null
  total?: number | null
  tournamentName?: string | null
  tournamentSlug?: string | null
  tournamentDate?: string | null
}
