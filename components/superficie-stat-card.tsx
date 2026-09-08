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

type SuperficieStatCardProps = {
  titulo: string
  subtitulo: string
  estaciones: Station[]
  variant: "rose" | "teal" | "indigo"
}

const chartConfig = {
  cantidad: {
    label: "Cantidad",
  },
} satisfies ChartConfig

const variantStyles = {
  rose: {
    cardBorder: "border-rose-500/30 bg-rose-500/5",
    titleColor: "text-rose-600 dark:text-rose-400",
    badge: "border-rose-500/30 text-rose-600 dark:text-rose-400",
    stationBadge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
  },
  teal: {
    cardBorder: "border-teal-500/30 bg-teal-500/5",
    titleColor: "text-teal-600 dark:text-teal-400",
    badge: "border-teal-500/30 text-teal-600 dark:text-teal-400",
    stationBadge: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
  },
  indigo: {
    cardBorder: "border-indigo-500/30 bg-indigo-500/5",
    titleColor: "text-indigo-600 dark:text-indigo-400",
    badge: "border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
    stationBadge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
  },
}

export function SuperficieStatCard({
  titulo,
  subtitulo,
  estaciones,
  variant,
}: SuperficieStatCardProps) {
  const contadorPuntajes: Record<number, number> = {
    0: 0,
    5: 0,
    8: 0,
    10: 0,
    11: 0,
  }

  estaciones.forEach((station) => {
    ;[station.tiro1, station.tiro2].forEach((puntos) => {
      if (puntos !== undefined && puntos !== null && contadorPuntajes[puntos] !== undefined) {
        contadorPuntajes[puntos] += 1
      }
    })
  })

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
            {subtitulo}
          </Badge>
        </div>

      </CardHeader>

      <CardContent className="pb-4 space-y-4">
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