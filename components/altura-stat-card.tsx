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
import type { CourseStation } from "@/lib/types/ranking"

type AlturaStatCardProps = {
  titulo: string
  subtitulo: string
  estaciones: CourseStation[]
  variant: "purple" | "slate" | "orange"
}

const chartConfig = {
  cantidad: {
    label: "Cantidad",
  },
} satisfies ChartConfig

const variantStyles = {
  purple: {
    cardBorder: "border-purple-500/30 bg-purple-500/5",
    titleColor: "text-purple-600 dark:text-purple-400",
    badge: "border-purple-500/30 text-purple-600 dark:text-purple-400",
    stationBadge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  },
  slate: {
    cardBorder: "border-slate-500/30 bg-slate-500/5",
    titleColor: "text-slate-600 dark:text-slate-400",
    badge: "border-slate-500/30 text-slate-600 dark:text-slate-400",
    stationBadge: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
  },
  orange: {
    cardBorder: "border-orange-500/30 bg-orange-500/5",
    titleColor: "text-orange-600 dark:text-orange-400",
    badge: "border-orange-500/30 text-orange-600 dark:text-orange-400",
    stationBadge: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
  },
}

export function AlturaStatCard({
  titulo,
  subtitulo,
estaciones,
  variant,
}: AlturaStatCardProps) {
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