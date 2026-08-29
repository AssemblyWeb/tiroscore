import { createSupabaseClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { RankingArcher, SeasonInfo } from '@/lib/types/ranking'

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
}

const DEFAULT_SEASON: SeasonInfo = {
  slug: 'liga-pinamarense-2026',
  name: 'Ranking Liga Pinamarense',
  subtitle: 'Liga Pinamarense de Arquería 3D · Temporada 2026',
}

export const totalScores = (scores: (number | null)[]) =>
  scores.reduce<number>((sum, score) => sum + (score ?? 0), 0)

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
  }
}

export async function getRankingEntries(): Promise<RankingArcher[]> {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('arqueros')
    .select('id, nombre, club, categoria, division, localidad, torneo_1, torneo_2, torneo_3, torneo_4')
    .order('nombre')

  if (error) throw error
  return (data ?? []).map(mapArquero)
}

export function getSeasonInfo(): SeasonInfo {
  return DEFAULT_SEASON
}
