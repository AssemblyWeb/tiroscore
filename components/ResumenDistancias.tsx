import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CourseStation } from "@/lib/types/ranking"
import { groupStationsByDistance, type EstacionesPorDistancia } from "@/lib/archery/categoryDistance"

type ResumenDistanciasProps = {
  stations: CourseStation[]
  className?: string
}

export function ResumenDistancias({ stations, className }: ResumenDistanciasProps) {
  const agrupadas: EstacionesPorDistancia = groupStationsByDistance(stations)

  const getMinMax = (group: CourseStation[]) => {
    if (group.length === 0) return { min: 0, max: 0 }
    const dists = group.map((s) => s.distance)
    return {
      min: Math.min(...dists),
      max: Math.max(...dists),
    }
  }

  const cortasStats = getMinMax(agrupadas.cortas)
  const mediasStats = getMinMax(agrupadas.medias)
  const largasStats = getMinMax(agrupadas.largas)

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* SECTOR: DISTANCIA CORTA */}
        <Card className="border-emerald-500/30 bg-emerald-500/5 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                Distancia Corta
              </CardTitle>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                &le; 15 mts
              </Badge>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              Mín: {cortasStats.min} mts | Máx: {cortasStats.max} mts
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Estaciones
            </div>
            <div className="flex flex-wrap gap-1.5">
              {agrupadas.cortas.length > 0 ? (
                agrupadas.cortas.map((station) => (
                  <span
                    key={station.number}
                    className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-semibold border border-emerald-500/20"
                  >
                    #{String(station.number).padStart(2, '0')}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">— Sin estaciones</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SECTOR: DISTANCIA MEDIA */}
        <Card className="border-amber-500/30 bg-amber-500/5 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                Distancia Media
              </CardTitle>
              <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs">
                16 - 25 mts
              </Badge>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              Mín: {mediasStats.min} mts | Máx: {mediasStats.max} mts
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Estaciones
            </div>
            <div className="flex flex-wrap gap-1.5">
              {agrupadas.medias.length > 0 ? (
                agrupadas.medias.map((station) => (
                  <span
                    key={station.number}
                    className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-xs font-semibold border border-amber-500/20"
                  >
                    #{String(station.number).padStart(2, '0')}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">— Sin estaciones</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SECTOR: DISTANCIA LARGA */}
        <Card className="border-blue-500/30 bg-blue-500/5 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                Distancia Larga
              </CardTitle>
              <Badge variant="outline" className="border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono text-xs">
                &gt; 25 mts
              </Badge>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              Mín: {largasStats.min} mts | Máx: {largasStats.max} mts
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Estaciones
            </div>
            <div className="flex flex-wrap gap-1.5">
              {agrupadas.largas.length > 0 ? (
                agrupadas.largas.map((station) => (
                  <span
                    key={station.number}
                    className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400 font-mono text-xs font-semibold border border-blue-500/20"
                  >
                    #{String(station.number).padStart(2, '0')}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">— Sin estaciones</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}