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
  distance: number
  height: string
  animal: Animal | null
}

export type PlanillaHeader = {
  id: number
  patrol: number | null
  archerNumber: number | null
  startingStation: number | null
  division: string | null
  className: string | null
}
