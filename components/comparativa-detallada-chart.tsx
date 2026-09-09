"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type ComparativaDetalladaChartProps = {
  tirosConEstaciones: any[]
  className?: string
}

const chartConfig = {
  vuelta1: {
    label: "1ra Vuelta",
    color: "#f59e0b",
  },
  vuelta2: {
    label: "2da Vuelta",
    color: "#f59e0b",
  },
} satisfies ChartConfig

export function ComparativaDetalladaChart({
  tirosConEstaciones,
  className,
}: ComparativaDetalladaChartProps) {
  const mitad = Math.floor(tirosConEstaciones.length / 2)

  const contV1: Record<number, number> = { 0: 0, 5: 0, 8: 0, 10: 0, 11: 0 }
  const contV2: Record<number, number> = { 0: 0, 5: 0, 8: 0, 10: 0, 11: 0 }

  tirosConEstaciones.forEach((item, index) => {
    const tiros = [item.tiro1, item.tiro2]
    tiros.forEach((p) => {
      if (p !== undefined && p !== null && contV1[p] !== undefined) {
        if (index < mitad) {
          contV1[p] += 1
        } else {
          contV2[p] += 1
        }
      }
    })
  })

  const ordenPuntajes = [0, 5, 8, 10, 11]
  const chartData = ordenPuntajes.map((p) => ({
    puntaje: p === 0 ? "M" : `${p} pts`,
    vuelta1: contV1[p],
    vuelta2: contV2[p],
  }))

  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.vuelta1, d.vuelta2)),
    0
  )
  return (
    <Card className={`border-border/50 bg-card/50 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold tracking-wider">
          Comparativa de impactos (M, 5, 8, 10, 11) por vuelta
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="w-full h-52">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis dataKey="puntaje" tickLine={false} tickMargin={8} axisLine={false} className="text-xs" />
            <YAxis hide domain={[0, 'dataMax + 2']} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            
            <Bar 
              dataKey="vuelta1" 
              radius={4} 
              barSize={12}
              // fill="#f59e0b"
              shape={(props: any) => {
                const { x, y, width, height, payload } = props
                const isMax = payload.vuelta1 >= payload.vuelta2
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={4}
                    ry={4}
                    fill={isMax ? "#f59e0b" : "#BFBFBF"}
                  />
                )
              }}
            />

            <Bar 
              dataKey="vuelta2" 
              radius={4} 
              barSize={12}
              // fill="#f59e0b"
              shape={(props: any) => {
                const { x, y, width, height, payload } = props
                const isMax = payload.vuelta1 <= payload.vuelta2
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={4}
                    ry={4}
                    fill={isMax ? "#f59e0b" : "#BFBFBF" }

                  />
                )
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}