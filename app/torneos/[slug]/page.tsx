import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, Target, Trophy } from 'lucide-react'
import { AnimalImage } from '@/components/animal-image'
import { Scoreboard as ScoreboardTournamentComponent } from '@/components/scoreboard-tournament'
import {
  getTournamentById,
  getTournamentClassification,
  getTournamentStations,
  getTournamentsOrdered,
  getTournamentScoreboard,
} from '@/lib/ranking'

export default async function TournamentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tournament = await getTournamentById(slug)

  if (!tournament) notFound()

  const [stations, ranked, allTournaments, scoreboard] = await Promise.all([
    getTournamentStations(tournament.id),
    getTournamentClassification(tournament.id),
    getTournamentsOrdered(),
    getTournamentScoreboard(tournament.id),
  ])

  console.log('scoreboard', scoreboard)

  const round = allTournaments.findIndex((item) => item.id === tournament.id)
  const participants = ranked.length
  const roundScores = ranked
    .map((archer) => (round >= 0 ? archer.scores[round] : archer.total) ?? 0)
    .filter((score) => score > 0)
  const average =
    roundScores.length > 0
      ? Math.round(roundScores.reduce((sum, score) => sum + score, 0) / roundScores.length)
      : 0

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Volver al scoreboard
        </Link>

        <header className="mt-8 flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Detalle del torneo
            </p>
            <h1 className="mt-2 max-w-3xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              {tournament.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {tournament.dateLabel && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  {tournament.dateLabel}
                </span>
              )}
              {tournament.type && <span>{tournament.type}</span>}
            </div>
          </div>
          <div className="rounded-xl bg-secondary p-5 text-secondary-foreground">
            <Trophy className="size-6 text-primary" />
            <p className="mt-4 font-mono text-3xl font-bold">{participants}</p>
            <p className="text-sm opacity-80">arqueros con planilla</p>
          </div>
        </header>

        <section aria-label="Resumen del torneo" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Promedio general', average > 0 ? `${average} pts` : '—', 'por arquero con puntaje'],
            ['Estaciones', String(tournament.stationCount || stations.length), 'blancos 3D'],
            ['Vueltas', String(tournament.laps), 'del circuito'],
            ['Planillas', String(participants), 'cargadas'],
          ].map(([label, value, detail]) => (
            <div key={label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 font-mono text-3xl font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 pb-3 border-b-1">
          <ScoreboardTournamentComponent entries={scoreboard} />
        </section>

        {/* <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Control de recorrido
              </p>
              <h2 className="mt-2 text-xl font-bold">Detalle de estaciones</h2>
            </div>
            <Target className="size-5 text-muted-foreground" />
          </div>
          {stations.length === 0 ? (
            <p className="rounded-xl border border-border bg-card p-6 text-muted-foreground">
              Este torneo todavía no tiene estaciones cargadas.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-[650px] text-sm">
                <thead className="bg-secondary text-secondary-foreground">
                  <tr>
                    {['Estación', 'Blanco', 'Distancia', 'Altura'].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wide"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stations.map((station) => (
                    <tr key={station.number} className="border-b border-border last:border-0">
                      <td className="px-4 py-4 font-mono font-bold">
                        {String(station.number).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <AnimalImage animal={station.animal} alt={station.animal?.tipo} />
                          <div>
                            <p className="font-semibold capitalize">
                              {station.animal?.tipo ?? 'Blanco 3D'}
                            </p>
                            <p className="text-xs font-normal capitalize text-muted-foreground">
                              {station.animal?.superficie ?? '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono">{station.distance} m</td>
                      <td className="px-4 py-4 capitalize text-muted-foreground">{station.height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section> */}
      </div>
    </main>
  )
}
