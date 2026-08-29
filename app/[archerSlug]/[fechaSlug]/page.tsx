import Link from 'next/link'
import { ArrowLeft, CalendarDays, Target, Trophy } from 'lucide-react'
import { AnimalImage } from '@/components/animal-image'
import { getAnimal, getArcher, getArcherMetrics, tournament } from '@/lib/tournaments'

// export function generateStaticParams() {
//   return [{ archerSlug: 'alfio-perino', fechaSlug: 'fecha1' }]
// }

export default async function ArcherTournamentPage({
  params,
}: {
  params: Promise<{ archerSlug: string; fechaSlug: string }>
}) {
  const { archerSlug, fechaSlug } = await params
  const archer = getArcher(archerSlug)

  if (!archer || fechaSlug !== 'fecha1') {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-5 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="size-4" /> Volver al scoreboard
        </Link>
        <h1 className="mt-10 text-3xl font-bold">Planilla no encontrada</h1>
        <p className="mt-2 text-muted-foreground">No encontramos los datos de este arquero y torneo.</p>
      </main>
    )
  }

  const metrics = getArcherMetrics(archer)
  const encabezado = archer.encabezado
  const stationAverage = Math.round(metrics.total / archer.stations.length)
  console.log("metrics",metrics)
  console.log("archer",archer)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-6 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Volver al scoreboard
        </Link>

        <header className="mt-8 border-b border-border pb-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Planilla de tiro 3D · Fecha 1
              </p>
              <h1 className="mt-2 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
                {archer.name}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {archer.club} · {archer.division} · {tournament.location}
              </p>
            </div>
            <div className="rounded-xl bg-secondary p-5 text-secondary-foreground">
              <Trophy className="size-5 text-primary" />
              <p className="mt-3 font-mono text-4xl font-bold">{metrics.total}</p>
              <p className="text-sm opacity-80">puntos totales</p>
            </div>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Info label="Organizador" value={encabezado?.organizador ?? 'ARQUERÍA PINAMAR CET'} />
            <Info
              label="Fecha"
              value={encabezado?.fecha ?? '21/06/26'}
              icon={<CalendarDays className="size-4" />}
            />
            <Info label="Patrulla" value={String(encabezado?.patrulla ?? 8)} />
            <Info label="Inicio" value={`Estación ${encabezado?.startingPoint ?? 8}`} />
            <Info label="Arquero Nº" value={String(encabezado?.arq_n ?? 2)} />
            <Info label="Sexo" value={encabezado?.sexo ?? 'Masc.'} />
          </div>
        </header>

        <section aria-label="Resumen de la planilla" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Aciertos"
            value={`${metrics.aciertos} / ${archer.stations.length}`}
            detail="estaciones con al menos un impacto"
          />
          <Metric label="Promedio" value={`${stationAverage} pts`} detail="por estación" />
          <Metric label="Zona 10" value={String(metrics.zonas10)} detail="impactos registrados" />
          <Metric label="Zona 11" value={String(metrics.zonas11)} detail="impactos registrados" />
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Detalle del recorrido
              </p>
              <h2 className="mt-2 text-2xl font-bold">24 estaciones · 2 vueltas</h2>
            </div>
            <Target className="size-5 text-muted-foreground" />
          </div>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  {[
                    'Estación',
                    'Blanco 3D',
                    'Distancia',
                    'Altura',
                    'Flecha 1',
                    'Flecha 2',
                    'Parcial',
                    'Acumulado',
                  ].map((heading) => (
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
                {archer.stations.map((station, index) => {
                  const animal = getAnimal(station.animalId)
                  const vuelta = index >= 12 ? 'Vuelta 2' : 'Vuelta 1'
                  return (
                    <tr
                      key={`${station.number}-${index}`}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-4 py-4 font-mono font-bold">
                        {String(station.number).padStart(2, '0')}
                        <span className="ml-2 font-sans text-xs font-normal text-muted-foreground">
                          {vuelta}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <AnimalImage animal={animal} size="md" />
                          <div>
                            <p className="font-semibold capitalize">{animal?.tipo ?? station.target}</p>
                            <p className="text-xs capitalize text-muted-foreground">
                              {animal?.superficie ?? '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono">{station.distancia} m</td>
                      <td className="px-4 py-4 capitalize text-muted-foreground">{station.altura}</td>
                      <td
                        className={`px-4 py-4 font-mono font-bold ${station.flecha1 === 'M' ? 'text-muted-foreground' : ''}`}
                      >
                        {station.flecha1}
                      </td>
                      <td
                        className={`px-4 py-4 font-mono font-bold ${station.flecha2 === 'M' ? 'text-muted-foreground' : ''}`}
                      >
                        {station.flecha2}
                      </td>
                      <td className="px-4 py-4 font-mono font-bold">{station.score}</td>
                      <td className="px-4 py-4 font-mono font-bold">{station.acumulado}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="rounded-lg border border-border bg-card px-3 py-2">M = Miss / 0 puntos</span>
          <span className="rounded-lg border border-border bg-card px-3 py-2">
            Circuito: {tournament.config.tipoTorneo}
          </span>
          {/* <Link
            href={`/torneos/${tournament.slug}`}
            className="rounded-lg border border-primary/40 px-3 py-2 font-semibold text-foreground hover:bg-accent"
          >
            Ver estadísticas del torneo
          </Link> */}
        </div>
      </div>
    </main>
  )
}

function Info({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {value}
      </p>
    </div>
  )
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  )
}
