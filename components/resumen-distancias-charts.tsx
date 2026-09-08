import type { CourseStation } from "@/lib/types/ranking"
import { groupStationsByDistance } from "@/lib/archery/categoryDistance"
import { DistanciaStatCard } from "../lib/archery/distancia-stat-card"

type ResumenDistanciasChartsProps = {
  stations: CourseStation[]
  className?: string
}

export function ResumenDistanciasCharts({ stations, className }: ResumenDistanciasChartsProps) {
  const agrupadas = groupStationsByDistance(stations)
console.log("stations", stations)
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <DistanciaStatCard
          titulo="Distancia Corta"
          rangoEtiqueta="≤ 15 mts"
          estaciones={agrupadas.cortas}
          variant="emerald"
        />
        <DistanciaStatCard
          titulo="Distancia Media"
          rangoEtiqueta="16 - 25 mts"
          estaciones={agrupadas.medias}
          variant="amber"
        />
        <DistanciaStatCard
          titulo="Distancia Larga"
          rangoEtiqueta="> 25 mts"
          estaciones={agrupadas.largas}
          variant="blue"
        />
      </div>
    </div>
  )
}