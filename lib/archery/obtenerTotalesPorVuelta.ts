import type { CourseStation } from '@/lib/types/ranking'

export type TotalesPorVuelta = {
  totalVuelta1: number
  totalVuelta2: number
}

/**
 * Calcula el puntaje total de la primera y segunda vuelta 
 * directamente desde el array de tirosConEstaciones.
 */
export function obtenerTotalesPorVuelta(tirosConEstaciones: any[]): TotalesPorVuelta {
  const mitad = Math.floor(tirosConEstaciones.length / 2)

  let totalVuelta1 = 0
  let totalVuelta2 = 0

  tirosConEstaciones.forEach((item, index) => {
    const sumaTiros = (item.tiro1 ?? 0) + (item.tiro2 ?? 0)

    if (index < mitad) {
      totalVuelta1 += sumaTiros
    } else {
      totalVuelta2 += sumaTiros
    }
  })

  return { totalVuelta1, totalVuelta2 }
}