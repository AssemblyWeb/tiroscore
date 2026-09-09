import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

type ResumenProps = {
  tirosConEstaciones: any[]
  className?: string
}

// Mapeo de colores basado en la referencia visual proporcionada
function getPuntajeColorStyle(puntos: number | string) {
  const num = typeof puntos === "string" ? parseInt(puntos) : puntos
  if (puntos === "M" || num === 0) {
    return "bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30" // Rojo (Fallado / M)
  }
  if (num === 5) {
    return "bg-[#eab308]/15 text-[#ca8a04] border-[#eab308]/30 dark:text-[#eab308]" // Amarillo (5 pts)
  }
  if (num === 8) {
    return "bg-[#22c55e]/15 text-[#16a34a] border-[#22c55e]/30 dark:text-[#22c55e]" // Verde (8 pts)
  }
  if (num === 10) {
    return "bg-[#3b82f6]/15 text-[#2563eb] border-[#3b82f6]/30 dark:text-[#3b82f6]" // Azul (10 y 11 pts)
  }
  if (num === 11) {
    return "bg-[#a855f7]/15 text-[#a855f7] border-[#a855f7]/30 dark:text-[##a855f7]" // Azul (10 y 11 pts)
  }
  return "bg-muted text-muted-foreground border-border"
}

export function Resumen({ tirosConEstaciones, className }: ResumenProps) {
  const estacionesMap = new Map<number, {
    stationNumber: number
    animal: any
    tiros: (number | string)[]
  }>()

  tirosConEstaciones.forEach((item) => {
    const numeroEstacion = item.station?.number ?? 1
    const animal = item.station?.animal

    if (!estacionesMap.has(numeroEstacion)) {
      estacionesMap.set(numeroEstacion, {
        stationNumber: numeroEstacion,
        animal: animal,
        tiros: [],
      })
    }

    const estData = estacionesMap.get(numeroEstacion)!
    if (item.tiro1 !== undefined && item.tiro1 !== null) estData.tiros.push(item.tiro1)
    if (item.tiro2 !== undefined && item.tiro2 !== null) estData.tiros.push(item.tiro2)
  })

  const estacionesOrdenadas = Array.from(estacionesMap.values()).sort(
    (a, b) => a.stationNumber - b.stationNumber
  )

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full ${className}`}>
      {estacionesOrdenadas.map((est) => {
        const imageUrl = est.animal?.imagen_url || est.animal?.imagen || "/placeholder.svg"
        const animalNombre = est.animal?.nombre || `Estación ${est.stationNumber}`

        const puntajesCompletos = [
          est.tiros[0],
          est.tiros[1],
          est.tiros[2],
          est.tiros[3],
        ]

        return (
          <Card key={est.stationNumber} className="border-border/40 bg-card/60 backdrop-blur-md shadow-sm hover:border-border transition-all duration-200 p-3.5">
            <CardContent className="p-0 flex items-center gap-3.5">
              {/* Foto del animal con un marco más estilizado */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-muted ring-2 ring-border/50 shadow-inner">
                <Image
                  src={imageUrl}
                  alt={animalNombre}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Información de la estación y puntajes */}
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground truncate">
                  Estación #{est.stationNumber}
                </span>

                {/* Badges de puntajes con los colores solicitados */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {puntajesCompletos.map((puntos, pIdx) => {
                    if (puntos === undefined || puntos === null) {
                      return (
                        <div
                          key={pIdx}
                          className="w-7 h-7 flex items-center justify-center rounded-lg font-mono text-xs font-medium text-muted-foreground/30 bg-muted/30 border border-dashed border-border/40"
                        >
                          -
                        </div>
                      )
                    }

                    const displayVal = puntos === 0 ? "M" : puntos
                    const colorStyle = getPuntajeColorStyle(puntos)

                    return (
                      <div
                        key={pIdx}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg font-mono text-xs font-bold border shadow-2xs ${colorStyle}`}
                      >
                        {displayVal}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}