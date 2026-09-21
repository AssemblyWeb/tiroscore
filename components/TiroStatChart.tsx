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

type TiroStatChartProps = {
  contadorPuntajes: Record<number | string, number>
}

const chartConfig = {
  cantidad: {
    label: "Cantidad",
  },
} satisfies ChartConfig

export function TiroStatChart({ contadorPuntajes }: TiroStatChartProps) {
  // Calculamos el total general para sacar los porcentajes reales
  const totalCantidad = Object.values(contadorPuntajes).reduce((acc, val) => acc + val, 0)

  const chartData = Object.entries(contadorPuntajes).map(([puntos, cantidad]) => {
    const isM = Number(puntos) === 0
    const percentage = totalCantidad > 0 ? ((cantidad / totalCantidad) * 100).toFixed(1) : "0"

    let color = "hsl(var(--primary))"
    if (isM) color = "#ef4444"     
    else if (puntos === "5") color = "#eab308"  
    else if (puntos === "8") color = "#22c55e"  
    else if (puntos === "10") color = "#3b82f6" 
    else if (puntos === "11") color = "#a855f7" 
    return {
      puntos: isM ? "M" : `${puntos} pts`,
      cantidad,
      percentage: `${percentage}%`,
      color,
    }
  })



  return (
    <Card className="h-80">
      <CardHeader className="pb-2">
        <CardTitle>Distribución de Puntajes</CardTitle>
        <CardDescription>Cantidad y porcentaje de impactos logrados en el torneo</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer 
          config={chartConfig} 
          className="w-full h-60"

        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              top: 0,
              right: 45, // Margen extra a la derecha para que entren cómodos los porcentajes
              left: 0,
              bottom: 34,
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar 
              dataKey="cantidad" 
              radius={4} 
              barSize={18}
            >
              {/* Pintamos cada barra de forma independiente */}
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              {/* Mostramos el porcentaje al final de cada barra */}
            
              <LabelList 
                dataKey="percentage" 
                position="right" 
                className="text-xs fill-muted-foreground font-mono font-medium" 
                offset={8}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}