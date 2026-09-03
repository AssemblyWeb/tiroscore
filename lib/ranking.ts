import { createSupabaseClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type {
  Animal,
  CourseStation,
  PlanillaHeader,
  RankingArcher,
  SeasonInfo,
  Tournament,
} from '@/lib/types/ranking'

type ArqueroRow = {
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

type TorneoRow = {
  id: string
  fecha: string | null
  nombre: string
  total_estaciones: number | null
  vueltas: number | null
  tipo_torneo: string | null
}

type AnimalRow = {
  id: number
  tipo: string
  superficie: Animal['superficie']
  imagen: string
}

type PlanillaRow = {
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

const DEFAULT_SEASON: SeasonInfo = {
  slug: 'liga-pinamarense-2026',
  name: 'Ranking Liga Pinamarense',
  subtitle: 'Liga Pinamarense de Arquería 3D · Temporada 2026',
}

function unwrap<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function formatDate(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function scoreForRound(archer: Pick<ArqueroRow, 'torneo_1' | 'torneo_2' | 'torneo_3' | 'torneo_4'>, round: number) {
  const scores = [archer.torneo_1, archer.torneo_2, archer.torneo_3, archer.torneo_4]
  const score = scores[round] ?? null
  return score === 0 ? null : score
}

function mapArquero(row: ArqueroRow): RankingArcher {
  return {
    id: String(row.id),
    name: row.nombre,
    slug: slugify(row.nombre),
    club: row.club,
    location: row.localidad,
    division: row.division,
    category: row.categoria,
    scores: [row.torneo_1, row.torneo_2, row.torneo_3, row.torneo_4],
    total: row.total ?? 0,
  }
}

function mapTournament(row: TorneoRow): Tournament {
  return {
    id: row.id,
    name: row.nombre,
    date: row.fecha ?? '',
    dateLabel: formatDate(row.fecha) ?? row.fecha ?? '',
    stationCount: row.total_estaciones ?? 0,
    laps: row.vueltas ?? 1,
    type: row.tipo_torneo ?? '',
  }
}

function mapAnimal(row: AnimalRow | null | undefined): Animal | null {
  if (!row) return null
  return {
    id: row.id,
    tipo: row.tipo,
    superficie: row.superficie,
    imagen: row.imagen,
  }
}

export async function getRankingEntries(): Promise<RankingArcher[]> {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('arqueros')
    .select('id, nombre, club, categoria, division, localidad, torneo_1, torneo_2, torneo_3, torneo_4, total')
    .order('nombre')

  if (error) throw error
  return (data ?? []).map(mapArquero)
}

export async function getTournamentsOrdered(): Promise<Tournament[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('torneos')
    .select('id, fecha, nombre, total_estaciones, vueltas, tipo_torneo')
    .order('fecha', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapTournament)
}

function roundIndexForTournament(tournaments: Tournament[], tournamentId: string) {
  return tournaments.findIndex((tournament) => tournament.id === tournamentId)
}

export async function getTournamentEntries(arquero_id: string): Promise<TournamentHistoryEntry[]> {
  const supabase = createSupabaseClient()
  const archerId = Number(arquero_id)
  if (!Number.isFinite(archerId)) return []

  const tournaments = await getTournamentsOrdered()

  const { data, error } = await supabase
    .from('planillas')
    .select(
      `
      id,
      torneo_id,
      arquero_id,
      torneos ( id, fecha, nombre, total_estaciones, vueltas, tipo_torneo ),
      arqueros ( id, nombre, torneo_1, torneo_2, torneo_3, torneo_4 )
    `,
    )
    .eq('arquero_id', archerId)
    .order('id')

  if (error) throw error

  return mapTournamentHistoryEntries((data ?? []) as Parameters<typeof mapTournamentHistoryEntries>[0], tournaments)
}

function mapTournamentHistoryEntries(
  rows: Array<{
    id: number
    torneo_id: string
    arquero_id: number
    torneos?: TorneoRow | TorneoRow[] | null
    arqueros?: ArqueroRow | ArqueroRow[] | null
  }>,
  tournaments: Tournament[],
): TournamentHistoryEntry[] {
  return rows.map((row) => {
    const tournament = unwrap(row.torneos)
    const archer = unwrap(row.arqueros)
    const round = tournament ? roundIndexForTournament(tournaments, tournament.id) : -1
    const total = archer && round >= 0 ? scoreForRound(archer, round) : null

    return {
      id: Number(row.id),
      torneo_id: row.torneo_id,
      arquero_id: row.arquero_id,
      total,
      tournamentName: tournament?.nombre ?? `Torneo ${row.torneo_id}`,
      tournamentSlug: String(row.torneo_id),
      tournamentDate: formatDate(tournament?.fecha ?? null),
    }
  })
}

export async function getTournamentById(id: string): Promise<Tournament | null> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('torneos')
    .select('id, fecha, nombre, total_estaciones, vueltas, tipo_torneo')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? mapTournament(data) : null
}

export async function getTournamentStations(tournamentId: string): Promise<CourseStation[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('torneo_estaciones')
    .select('numero_estacion, distancia, altura, animal_id, animales ( id, tipo, superficie, imagen )')
    .eq('torneo_id', tournamentId)
    .order('numero_estacion')

  if (error) throw error

  return (data ?? []).map((row: {
    numero_estacion: number
    distancia: number
    altura: string
    animales?: AnimalRow | AnimalRow[] | null
  }) => ({
    number: row.numero_estacion,
    distance: row.distancia,
    height: row.altura,
    animal: mapAnimal(unwrap(row.animales)),
  }))
}

export async function getTournamentClassification(tournamentId: string): Promise<RankingArcher[]> {
  const supabase = createSupabaseClient()
  const tournaments = await getTournamentsOrdered()
  const round = roundIndexForTournament(tournaments, tournamentId)

  const { data, error } = await supabase
    .from('planillas')
    .select(
      `
      arquero_id,
      arqueros ( id, nombre, club, categoria, division, localidad, torneo_1, torneo_2, torneo_3, torneo_4, total )
    `,
    )
    .eq('torneo_id', tournamentId)

  if (error) throw error

  const archers = (data ?? [])
    .map((row: { arqueros?: ArqueroRow | ArqueroRow[] | null }) => unwrap(row.arqueros))
    .filter((row): row is ArqueroRow => Boolean(row))
    .map(mapArquero)

  return [...archers].sort((a, b) => {
    const scoreA = round >= 0 ? (a.scores[round] ?? 0) : a.total
    const scoreB = round >= 0 ? (b.scores[round] ?? 0) : b.total
    return scoreB - scoreA
  })
}

export async function getArcherBySlug(slug: string) {
  const entries = await getRankingEntries()
  const normalized = slugify(slug)
  const compact = normalized.replaceAll('-', '')
  return (
    entries.find((archer) => archer.slug === normalized || archer.slug.replaceAll('-', '') === compact) ??
    null
  )
}

export async function getArcherPlanilla(archerId: number, tournamentId: string) {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('planillas')
    .select('id, torneo_id, arquero_id, patrulla, division, clase, arquero_numero, estacion_inicial')
    .eq('arquero_id', archerId)
    .eq('torneo_id', tournamentId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const header: PlanillaHeader = {
    id: data.id,
    patrol: data.patrulla,
    archerNumber: data.arquero_numero,
    startingStation: data.estacion_inicial,
    division: data.division,
    className: data.clase,
  }

  return header
}

export function getSeasonInfo(): SeasonInfo {
  return DEFAULT_SEASON
}
