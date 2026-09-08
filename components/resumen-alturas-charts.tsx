import type { CourseStation } from "@/lib/types/ranking"
import { agruparEstacionesPorAltura } from "@/lib/archery/agruparEstacionesPorAtulra"
import { AlturaStatCard } from "./altura-stat-card"

type ResumenAlturasChartsProps = {
  stations: CourseStation[]
  className?: string
}

export function ResumenAlturasCharts({ stations, className }: ResumenAlturasChartsProps) {
  const agrupadas = agruparEstacionesPorAltura(stations)

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <AlturaStatCard
          titulo="Tiros Bajos"
          subtitulo="Bajada / Tiro Bajo"
          estaciones={agrupadas.bajos}
          variant="purple"
        />
        <AlturaStatCard
          titulo="Tiros Llanos"
          subtitulo="Terreno Llano"
          estaciones={agrupadas.llanos}
          variant="slate"
        />
        <AlturaStatCard
          titulo="Tiros Altos"
          subtitulo="Subida / Tiro Alto"
          estaciones={agrupadas.altos}
          variant="orange"
        />
      </div>
    </div>
  )
}