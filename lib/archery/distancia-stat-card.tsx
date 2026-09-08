"use client"

import { Bar, BarChart, XAxis, YAxis, Cell, LabelList } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import type { Station } from "@/lib/types/ranking"

type DistanciaStatCardProps = {
  titulo: string
  rangoEtiqueta: string
  estaciones: Station[]
  variant: "emerald" | "amber" | "blue"
}

const chartConfig = {
  cantidad: {
    label: "Cantidad",
  },
} satisfies ChartConfig

const variantStyles = {
  emerald: {
    cardBorder: "border-emerald-500/30 bg-emerald-500/5",
    titleColor: "text-emerald-600 dark:text-emerald-400",
    badge: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    stationBadge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  },
  amber: {
    cardBorder: "border-amber-500/30 bg-amber-500/5",
    titleColor: "text-amber-600 dark:text-amber-400",
    badge: "border-amber-500/30 text-amber-600 dark:text-amber-400",
    stationBadge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  },
  blue: {
    cardBorder: "border-blue-500/30 bg-blue-500/5",
    titleColor: "text-blue-600 dark:text-blue-400",
    badge: "border-blue-500/30 text-blue-600 dark:text-blue-400",
    stationBadge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
}

export function DistanciaStatCard({
  titulo,
  rangoEtiqueta,
  estaciones,
  variant,
}: DistanciaStatCardProps) {
  // 1. Extraer distancias mín y máx de este grupo
  const distancias = estaciones.map((s) => s.distance)
  const minDistance = distancias.length > 0 ? Math.min(...distancias) : 0
  const maxDistance = distancias.length > 0 ? Math.max(...distancias) : 0

  // 2. Inicializamos el contador con TODOS los puntajes posibles en 0
  const contadorPuntajes: Record<number, number> = {
    0: 0,
    5: 0,
    8: 0,
    10: 0,
    11: 0,
  }

  // Acumulamos los puntajes de todas las vueltas/tiros
  estaciones.forEach((station) => {
    ;[station.tiro1, station.tiro2].forEach((puntos) => {
      if (puntos !== undefined && puntos !== null && contadorPuntajes[puntos] !== undefined) {
        contadorPuntajes[puntos] += 1
      }
    })
  })

  // 3. Procesar datos para Recharts
  const totalCantidad = Object.values(contadorPuntajes).reduce((acc, val) => acc + val, 0)
  const ordenPuntajes = [0, 5, 8, 10, 11]

  const chartData = ordenPuntajes.map((puntos) => {
    const cantidad = contadorPuntajes[puntos]
    const isM = puntos === 0
    const percentage = totalCantidad > 0 ? ((cantidad / totalCantidad) * 100).toFixed(1) : "0"

    let color = "hsl(var(--primary))"
    if (isM) color = "#ef4444"
    else if (puntos === 5) color = "#eab308"
    else if (puntos === 8) color = "#22c55e"
    else if (puntos === 10) color = "#3b82f6"
    else if (puntos === 11) color = "#a855f7"

    return {
      puntos: isM ? "M" : `${puntos} pts`,
      cantidad,
      percentage: `${percentage}%`,
      color,
    }
  })

  // 4. Obtenemos las estaciones únicas filtrando duplicados y ordenándolas por número
  const estacionesUnicas = Array.from(
    new Map(estaciones.map((s) => [s.number, s])).values()
  ).sort((a, b) => a.number - b.number)

  const style = variantStyles[variant]

  return (
    <Card className={`${style.cardBorder} transition-colors flex flex-col justify-between`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-sm font-bold tracking-wider uppercase ${style.titleColor}`}>
            {titulo}
          </CardTitle>
          <Badge variant="outline" className={`font-mono text-xs ${style.badge}`}>
            {rangoEtiqueta}
          </Badge>
        </div>
        <CardDescription className="text-xs font-mono pt-1">
          {estaciones.length > 0 ? `Min: ${minDistance}m | Max: ${maxDistance}m` : "Sin datos"}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4 space-y-4">
        {/* Gráfico de barras */}
        <ChartContainer config={chartConfig} className="w-full h-52">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              top: 0,
              right: 45,
              left: 0,
              bottom: 20,
            }}
          >
            <XAxis type="number" dataKey="cantidad" hide />
            <YAxis
              dataKey="puntos"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="cantidad" radius={4} barSize={16}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="percentage"
                position="right"
                className="text-xs fill-muted-foreground font-mono font-medium"
                offset={8}
              />
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Display inferior de estaciones únicas */}
        <div className="border-t pt-3 space-y-1.5">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Estaciones
          </div>
          <div className="flex flex-wrap gap-1.5">
            {estacionesUnicas.length > 0 ? (
              estacionesUnicas.map((station) => (
                <span
                  key={station.number}
                  className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md font-mono text-xs font-semibold border ${style.stationBadge}`}
                >
                  #{String(station.number).padStart(2, '0')}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">— Sin estaciones</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}