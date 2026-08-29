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
