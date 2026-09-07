import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, Target, Trophy } from 'lucide-react'
import { AnimalImage } from '@/components/animal-image'
import { TiroStatChart } from '@/components/TiroStatChart'
import {
  getArcherBySlug,
  getArcherPlanilla,
  getTournamentById,
  getTournamentStations,
  getTournamentsOrdered,
  getTirosEstacionesByPlanillaId,
} from '@/lib/ranking'

export default async function ArcherTournamentPage({
  params,
}: {
  params: Promise<{ archerSlug: string; fechaSlug: string }>
}) {
  const { archerSlug, fechaSlug } = await params
  const archer = await getArcherBySlug(archerSlug)
  if (!archer) notFound()

  const tournaments = await getTournamentsOrdered()
  const tournament =
    (await getTournamentById(fechaSlug)) ??
    tournaments.find((item, index) => fechaSlug === `fecha${index + 1}` || fechaSlug === item.id) ??
    null

  if (!tournament) notFound()

  const [planilla, stations] = await Promise.all([
    getArcherPlanilla(Number(archer.id), tournament.id),
    getTournamentStations(tournament.id),
  ])

  // check for planilla call
  if (!planilla) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-5 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="size-4" /> Volver al scoreboard
        </Link>
        <h1 className="mt-10 text-3xl font-bold">Planilla no encontrada</h1>
        <p className="mt-2 text-muted-foreground">
          {archer.name} no tiene una planilla cargada para {tournament.name}.
        </p>
      </main>
    )
  }

  const tirosEstaciones = await getTirosEstacionesByPlanillaId(planilla.id);

  const puntajesBuscados = [0, 5, 8, 10, 11];

  // Inicializar el contador para cada puntaje de interés
  const contadorPuntajes = puntajesBuscados.reduce((acc, puntos) => {
    acc[puntos] = 0;
    return acc;
  }, {});

  // Recorrer todas las rondas y evaluar tanto el tiro1 como el tiro2 de forma independiente
  tirosEstaciones.forEach((tiro) => {
    const tirosRealizados = [tiro.tiro1, tiro.tiro2];
    
    tirosRealizados.forEach((puntos) => {
      if (contadorPuntajes[puntos] !== undefined) {
        contadorPuntajes[puntos]++;
      }
    });
  });

// Resultado: { '0': X, '5': X, '8': X, '10': X, '11': X }
console.log(contadorPuntajes);
  // Encontrar el índice de inicio en el array de stations (asumiendo que 'number' va del 1 al 12)
  const startIndex = stations.findIndex(s => s.number === planilla.startingStation);

  const tirosConEstaciones = tirosEstaciones.map((tiro, index) => {
    // Como son 24 tiros para 12 estaciones, cada estación abarca 2 posiciones consecutivas
    const stationIndex = (startIndex + index) % stations.length;

    return {
      ...tiro,
      station: stations[stationIndex] // Inyecta la info de la estación correspondiente
    };
  });


  const total = tirosEstaciones.reduce((max, tiro) => Math.max(max, tiro.acumulado), 0) || 0;
  

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
                Planilla de tiro 3D · {tournament.name}
              </p>
              <h1 className="mt-2 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
                {archer.name}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {archer.club} · {archer.division} · {archer.location}
              </p>
            </div>
            <div className="rounded-xl bg-secondary p-5 text-secondary-foreground">
              <Trophy className="size-5 text-primary" />
              <p className="mt-3 font-mono text-4xl font-bold">{total && total > 0 ? total : '—'}</p>
              <p className="text-sm opacity-80">puntos totales</p>
            </div>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info label={String(tournament.name)} value={tournament.dateLabel} icon={<CalendarDays className="size-4" />} />
            {planilla.patrol != null && <Info label="Patrulla" value={String(planilla.patrol)} />}
            {planilla.startingStation != null && (
              <Info label="Inicio" value={`Estación ${planilla.startingStation}`} />
            )}
            {planilla.archerNumber != null && (
              <Info label="Arquero Nº" value={String(planilla.archerNumber)} />
            )}
          </div>
        </header>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Recorrido
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {tournament.stationCount || stations.length} estaciones
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {tournament.type}
              </p>
            </div>
            <Target className="size-5 text-muted-foreground" />
          </div>

          {stations.length === 0 ? (
            <p className="rounded-xl border border-border bg-card p-6 text-muted-foreground">
              El recorrido de este torneo todavía no está cargado.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead className="bg-secondary text-secondary-foreground">
                  <tr>
                    {['Estación', 'Blanco','Tamaño', 'Distancia', 'Altura', '1 tiro', '2 tiro', 'Parcial', 'Acumulado'].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wide"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
              <tbody className="divide-y divide-border">
                  {tirosConEstaciones.map((tiro, index) => (
                    <tr key={tiro.id ?? index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      {/* Estación */}
                      <td className="px-4 py-4 font-mono font-bold">
                        {String(tiro.station?.number ?? index + 1).padStart(2, '0')}
                      </td>

                      {/* Blanco (Imagen y Nombre) */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <AnimalImage animal={tiro.station?.animal} alt={tiro.station?.animal?.tipo} size="md"/>
                        </div>
                      </td>

                      {/* Tamaño (Asumiendo que viene en la estación o animal, lo dejamos defensivo) */}
                      <td className="px-4 py-4 capitalize text-muted-foreground">
                        {tiro.station?.animal?.superficie ?? '—'}
                      </td>

                      {/* Distancia */}
                      <td className="px-4 py-4 font-mono">
                        {tiro.station?.distance ? `${tiro.station.distance} m` : '—'}
                      </td>

                      {/* Altura */}
                      <td className="px-4 py-4 capitalize text-muted-foreground">
                        {tiro.station?.height ?? '—'}
                      </td>

                      {/* 1 tiro */}
                      <td className="px-4 py-4 font-mono font-medium">
                        {tiro.tiro1 === 0 ? "M" : tiro.tiro1}
                      </td>

                      {/* 2 tiro */}
                      <td className="px-4 py-4 font-mono font-medium">
                        {tiro.tiro2 === 0 ? "M" : tiro.tiro2}
                      </td>

                      {/* Parcial */}
                      <td className="px-4 py-4 font-mono font-semibold">
                        {tiro.parcial}
                      </td>

                      {/* Acumulado */}
                      <td className="px-4 py-4 font-mono font-bold text-primary">
                        {tiro.acumulado}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-10">

          <TiroStatChart contadorPuntajes={contadorPuntajes} />
        </section>
        
     
        {/* <Link
          href={`/torneos/${tournament.id}`}
          className="mt-4 inline-flex rounded-lg border border-primary/40 px-3 py-2 text-sm font-semibold hover:bg-accent"
        >
          Ver estadísticas del torneo
        </Link> */}
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
