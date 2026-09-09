import type { CourseStation } from '@/lib/types/ranking'

export type EstacionesPorAltura = {
  bajos: CourseStation[]
  llanos: CourseStation[]
  altos: CourseStation[]
}

/**
 * Categoriza las estaciones de tiro según la altura del tiro (bajo, llano, alto).
 */
export function agruparEstacionesPorAltura(stations: CourseStation[]): EstacionesPorAltura {
  return stations.reduce<EstacionesPorAltura>(
    (acc, station) => {
      const h = (station.height || '').toLowerCase()
      if (h.includes('abajo')) {
        acc.bajos.push(station)
      } else if (h.includes('arriba')) {
        acc.altos.push(station)
      } else {
        acc.llanos.push(station)
      }
      return acc
    },
    { bajos: [], llanos: [], altos: [] }
  )
}