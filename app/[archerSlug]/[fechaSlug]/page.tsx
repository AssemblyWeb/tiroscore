import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, Target, Trophy } from 'lucide-react'
import { AnimalImage } from '@/components/animal-image'
import { TiroStatChart } from '@/components/TiroStatChart'
import { groupStationsByDistance } from '@/lib/archery/categoryDistance'
import { ResumenDistanciasCharts } from '@/components/resumen-distancias-charts'
import { ResumenAlturasCharts } from '@/components/resumen-alturas-charts'
import { ResumenSuperficiesCharts } from '@/components/resumen-superficies-charts'
import { ComparativaTotalChart } from '@/components/comparativa-total-cards'
import { ComparativaDetalladaChart } from "@/components/comparativa-detallada-chart"
import { Resumen } from "@/components/resumen"
import { EstacionesChart } from "@/components/EstacionesChart"
import { obtenerTotalesPorVuelta } from "@/lib/archery/obtenerTotalesPorVuelta"
import type { CourseStation } from "@/lib/types/ranking"
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
  
  // 1. Obtener datos principales del arquero y torneo
  const archer = await getArcherBySlug(archerSlug)
  if (!archer) notFound()

  const tournaments = await getTournamentsOrdered()
  const tournament =
    (await getTournamentById(fechaSlug)) ??
    tournaments.find((item, index) => fechaSlug === `fecha${index + 1}` || fechaSlug === item.id) ??
    null

  if (!tournament) notFound()

  // 2. Obtener planilla y estaciones en paralelo
  const [planilla, stations] = await Promise.all([
    getArcherPlanilla(Number(archer.id), tournament.id),
    getTournamentStations(tournament.id),
  ])

  // Validación si el arquero no cargó planilla para este torneo
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

  const tirosEstaciones = await getTirosEstacionesByPlanillaId(planilla.id)

  // ==========================================
  // PROCESAMIENTO DE DATOS Y ESTADÍSTICAS
  // ==========================================

  // Conteo de frecuencia de cada puntaje (0, 5, 8, 10, 11) en todos los tiros realizados
  const puntajesBuscados = [0, 5, 8, 10, 11]
  const contadorPuntajes = puntajesBuscados.reduce((acc, puntos) => {
    acc[puntos] = 0
    return acc
  }, {} as Record<number, number>)

  tirosEstaciones.forEach((tiro) => {
    const tirosRealizados = [tiro.tiro1, tiro.tiro2]
    tirosRealizados.forEach((puntos) => {
      if (contadorPuntajes[puntos] !== undefined) {
        contadorPuntajes[puntos]++
      }
    })
  })

  // Sincronización de estaciones: asocia cada tiro con su estación correspondiente 
  // teniendo en cuenta la estación de inicio (startingStation) del arquero.
  const startIndex = stations.findIndex(s => s.number === planilla.startingStation)
  const tirosConEstaciones = tirosEstaciones.map((tiro, index) => {
    const stationIndex = (startIndex + index) % stations.length
    return {
      ...tiro,
      station: stations[stationIndex],
    }
  })

  // Obtención de métricas globales y por vuelta
  const total = tirosEstaciones.reduce((max, tiro) => Math.max(max, tiro.acumulado), 0) || 0
  const estacionesCategorizadas = groupStationsByDistance(stations)
  const { totalVuelta1, totalVuelta2 } = obtenerTotalesPorVuelta(tirosConEstaciones)

  // Formato plano necesario para los componentes de gráficos de resumen (distancia, altura, superficie)
  const stationsFormat: CourseStation[] = tirosConEstaciones.map((item: any) => ({
    number: item.station.number,
    distance: item.station.distance,
    height: item.station.height,
    superficie: item.station.animal.superficie,
    tiro1: item.tiro1,
    tiro2: item.tiro2,
  }))

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-6 sm:px-6 lg:px-10">
        
        {/* Enlace de navegación superior */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Volver al scoreboard
        </Link>

        {/* Encabezado con información general del arquero y puntaje total */}
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

        {/* Tabla de recorrido estación por estación */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Tu recorrido
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {tournament.stationCount || stations.length} estaciones
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
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
                    {['Estación', 'Blanco', 'Tamaño', 'Distancia', 'Altura', '1º tiro', '2º tiro', 'Parcial', 'Acumulado'].map((heading) => (
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
                    <tr key={tiro.id ?? index} className="border-b border-border last:border-0 transition-colors hover:bg-muted/50">
                      <td className="px-4 py-4 font-mono font-bold">
                        {String(tiro.station?.number ?? index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <AnimalImage animal={tiro.station?.animal} alt={tiro.station?.animal?.tipo} size="md" />
                        </div>
                      </td>
                      <td className="px-4 py-4 capitalize text-muted-foreground">
                        {tiro.station?.animal?.superficie ?? '—'}
                      </td>
                      <td className="px-4 py-4 font-mono">
                        {tiro.station?.distance ? `${tiro.station.distance} m` : '—'}
                      </td>
                      <td className="px-4 py-4 capitalize text-muted-foreground">
                        {tiro.station?.height ?? '—'}
                      </td>
                      <td className="px-4 py-4 font-mono font-medium">
                        {tiro.tiro1 === 0 ? "M" : tiro.tiro1}
                      </td>
                      <td className="px-4 py-4 font-mono font-medium">
                        {tiro.tiro2 === 0 ? "M" : tiro.tiro2}
                      </td>
                      <td className="px-4 py-4 font-mono font-semibold">
                        {tiro.parcial}
                      </td>
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

        {/* Gráfico de estadísticas generales de tiros */}
        <section className="mt-10 border-b border-border pb-8">
          <TiroStatChart contadorPuntajes={contadorPuntajes} />
        </section>

        {/* Rangos de distancia */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Tus datos
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Rangos de distancia
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Distribución de puntajes según la distancia del tiro (alta, media y larga)
              </p>
            </div>
          </div>
          <ResumenDistanciasCharts stations={stationsFormat} className="w-full" />
        </section>

        {/* Rangos de altura */}
        <section className="mt-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="mt-2 text-2xl font-bold">
                Rangos de altura
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Distribución de puntajes según la elevación del tiro (bajos, llanos y altos)
              </p>
            </div>
          </div>
          <ResumenAlturasCharts stations={stationsFormat} className="w-full" />
        </section>

        {/* Rangos de superficie */}
        <section className="mt-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="mt-2 text-2xl font-bold">
                Rangos de superficie
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Distribución de puntajes según la superficie del blanco
              </p>
            </div>
          </div>
          <ResumenSuperficiesCharts stations={stationsFormat} className="w-full" />
        </section>

        {/* Comparativa 1ra y 2da vuelta */}
        <section className="mt-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="mt-2 text-2xl font-bold">
                Comparativas por vueltas
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <ComparativaTotalChart totalVuelta1={totalVuelta1} totalVuelta2={totalVuelta2} />
            <ComparativaDetalladaChart tirosConEstaciones={tirosConEstaciones} />
          </div>
        </section>

        {/* Rendimiento detallado por estación */}
        <section className="mt-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="mt-2 text-2xl font-bold">
                Rendimiento detallado por estación
              </h2>
            </div>
          </div>
          <EstacionesChart tirosConEstaciones={tirosConEstaciones} />
        </section>

        {/* Resumen final */}
        <section className="mt-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="mt-2 text-2xl font-bold">
                Resumen
              </h2>
            </div>
          </div>
          <Resumen tirosConEstaciones={tirosConEstaciones} />
        </section>

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