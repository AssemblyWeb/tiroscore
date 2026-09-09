import type { CourseStation } from '@/lib/types/ranking'

export type EstacionesPorDistancia = {
  cortas: CourseStation[]
  medias: CourseStation[]
  largas: CourseStation[]
}

export function agruparEstacionesPorDistancia(stations: CourseStation[]): EstacionesPorDistancia {
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

export type EstacionesPorAltura = {
  bajos: CourseStation[]
  llanos: CourseStation[]
  altos: CourseStation[]
}

export function agruparEstacionesPorAltura(stations: CourseStation[]): EstacionesPorAltura {
  return stations.reduce<EstacionesPorAltura>(
    (acc, station) => {
      const h = (station.height || '').toLowerCase()
      if (h.includes('bajo')) {
        acc.bajos.push(station)
      } else if (h.includes('alto')) {
        acc.altos.push(station)
      } else {
        acc.llanos.push(station)
      }
      return acc
    },
    { bajos: [], llanos: [], altos: [] }
  )
}

export type EstacionesPorSuperficie = {
  chicas: CourseStation[]
  medianas: CourseStation[]
  grandes: CourseStation[]
}

export function agruparEstacionesPorSuperficie(stations: CourseStation[]): EstacionesPorSuperficie {
  return stations.reduce<EstacionesPorSuperficie>(
    (acc, station) => {
      const sup = (station.superficie || '').toLowerCase()
      if (sup.includes('chica')) {
        acc.chicas.push(station)
      } else if (sup.includes('grande')) {
        acc.grandes.push(station)
      } else {
        acc.medianas.push(station)
      }
      return acc
    },
    { chicas: [], medianas: [], grandes: [] }
  )
}