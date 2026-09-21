import { Scoreboard } from '@/components/scoreboard'
import { formatSupabaseError } from '@/lib/supabase/errors'
import { getRankingEntries, getSeasonInfo  } from '@/lib/ranking'

export default async function Page() {
  const season = getSeasonInfo()
  try {
    const entries = await getRankingEntries()

    if (entries.length === 0) {
      return (
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 text-center">
          <h1 className="text-2xl font-bold">No hay arqueros en el ranking</h1>
        </main>
      )
    }

    return <Scoreboard entries={entries} season={season} />
  } catch (error) {
    const message = formatSupabaseError(error)

    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-bold">No se pudo cargar el ranking</h1>
        <p className="mt-3 text-muted-foreground">{message}</p>
      </main>
    )
  }
}
