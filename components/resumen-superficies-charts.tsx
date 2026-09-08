import type { CourseStation } from "@/lib/types/ranking"
import { agruparEstacionesPorSuperficie } from "@/lib/archery/agruparEstacionesPorSuperficie"
import { SuperficieStatCard } from "./superficie-stat-card"

type ResumenSuperficiesChartsProps = {
  stations: CourseStation[]
  className?: string
}

export function ResumenSuperficiesCharts({ stations, className }: ResumenSuperficiesChartsProps) {
  const agrupadas = agruparEstacionesPorSuperficie(stations)

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <SuperficieStatCard
          titulo="Blancos Chicos"
          subtitulo="Superficie Chica"
          estaciones={agrupadas.chicas}
          variant="rose"
        />
        <SuperficieStatCard
          titulo="Blancos Medianos"
          subtitulo="Superficie Mediana"
          estaciones={agrupadas.medianas}
          variant="teal"
        />
        <SuperficieStatCard
          titulo="Blancos Grandes"
          subtitulo="Superficie Grande"
          estaciones={agrupadas.grandes}
          variant="indigo"
        />
      </div>
    </div>
  )
}