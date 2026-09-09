"use client"

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"
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

type ComparativaTotalChartProps = {
  totalVuelta1: number
  totalVuelta2: number
  className?: string
}

const chartConfig = {
  puntaje: {
    label: "Puntaje",
  },
} satisfies ChartConfig

export function ComparativaTotalChart({
  totalVuelta1,
  totalVuelta2,
  className,
}: ComparativaTotalChartProps) {
  const esMayorV1 = totalVuelta1 >= totalVuelta2

  // Definimos el color de cada barra directamente en el objeto de datos
  const chartData = [
    { 
      vuelta: "1ra Vuelta", 
      puntaje: totalVuelta1,
      fill: esMayorV1 ? "#f59e0b" : "#B7B7B7"
    },
    { 
      vuelta: "2da Vuelta", 
      puntaje: totalVuelta2,
      fill: esMayorV1 ?  "#B7B7B7" : "#f59e0b"
    },
  ]

  return (
    <Card className={`border-border/50 bg-card/50 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold tracking-wider ">
        Puntaje total acumulado: {totalVuelta1 + totalVuelta2}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="w-full h-52">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 25,
              right: 40,
              left: 40,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="vuelta"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs font-medium"
            />
            <YAxis hide domain={[0, 'dataMax + 40']} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            {/* Recharts lee automáticamente la propiedad 'fill' de cada objeto en chartData */}
            <Bar dataKey="puntaje" radius={8} barSize={48}>
              <LabelList
                dataKey="puntaje"
                position="top"
                className="text-xs fill-foreground font-mono font-bold"
                offset={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}