import type { CourseStation, EstacionesPorDistancia } from '@/lib/types/ranking'

/**
 * Categoriza las estaciones de tiro en cortas, medianas y largas según su distancia.
 * - Cortas: <= 15 metros
 * - Medias: 16 a 25 metros
 * - Largas: > 25 metros
 */
export function groupStationsByDistance(tirosConEstaciones: CourseStation[]): EstacionesPorDistancia {
  return tirosConEstaciones.reduce<EstacionesPorDistancia>(
    (acc, item) => {
      // Accedemos a la distancia a través de item.station.distance
      const distance = item.station?.distance

      if (distance !== undefined) {
        if (distance <= 15) {
          acc.cortas.push(item)
        } else if (distance <= 25) {
          acc.medias.push(item)
        } else {
          acc.largas.push(item)
        }
      }

      return acc
    },
    { cortas: [], medias: [], largas: [] }
  )
}