import type { CourseStation, EstacionesPorDistancia } from '@/lib/types/ranking' 

/**
 * Categoriza las estaciones de tiro en cortas, medias y largas según su distancia.
 * - Cortas: <= 15 metros
 * - Medias: 16 a 25 metros
 * - Largas: > 25 metros
 */
export function groupStationsByDistance(stations: CourseStation[]): EstacionesPorDistancia {
  return stations.reduce<EstacionesPorDistancia>(
    (acc, station) => {
      if (station.distance <= 15) {
        acc.cortas.push(station)
      } else if (station.distance <= 25) {
        acc.medias.push(station)
      } else {
        acc.largas.push(station)
      }
      return acc
    },
    { cortas: [], medias: [], largas: [] }
  )
}