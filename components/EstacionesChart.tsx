"use client"

import { Area, AreaChart, XAxis, YAxis, ReferenceLine } from "recharts"
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

type EstacionesChartProps = {
  tirosConEstaciones: any[]
  className?: string
}

const chartConfig = {
  total: {
    label: "Total Estación",
    color: "#eab308", // Dorado principal
  },
} satisfies ChartConfig

export function EstacionesChart({
  tirosConEstaciones,
  className,
}: EstacionesChartProps) {
  const mitadIndex = Math.floor(tirosConEstaciones.length / 2)

  const chartData = tirosConEstaciones.map((item, index) => {
    const t1 = item.tiro1 ?? 0
    const t2 = item.tiro2 ?? 0
    const numeroEstacion = item.station?.number ?? index + 1
    const esVuelta2 = index >= mitadIndex

    return {
      estacion: `Est. ${numeroEstacion}`,
      vuelta: esVuelta2 ? "2da Vuelta" : "1ra Vuelta",
      tiro1: t1,
      tiro2: t2,
      total: t1 + t2,
    }
  })

  const estacionMitadLabel = chartData[mitadIndex]?.estacion || `Est. ${mitadIndex + 1}`

  return (
    <Card className={`border-border/50 bg-card/50 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-bold tracking-wider ">
            Evolución con umbrales de puntaje y separación de vueltas
          </CardTitle>
          {/* <CardDescription className="text-xs">
            Evolución con umbrales de puntaje y separación de vueltas
          </CardDescription> */}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <AreaChart 
            data={chartData} 
            margin={{ top: 0, right: 0, left: -40, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillDorado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            {/* Eje X forzando a mostrar todas las estacas (interval={0}) */}
            <XAxis
              dataKey="estacion"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tick={{ fontSize: 9 }}
              angle={-45} // Rota los textos 45 grados
              textAnchor="end" // Alinea el texto con la marca
              height={45} // Da espacio inferior en la card para que no se corte
            />

            {/* Eje Y visible a la derecha para mostrar los valores de referencia */}
            <YAxis
              orientation="left"
              domain={[0, 22]}
              ticks={[5, 10, 15, 20]}
              tickLine={false}
              axisLine={false}
              className="text-xs font-mono font-medium fill-[#eab308]"
              tick={{ fill: "#000", fontSize: 11 }}
            />

            {/* Línea punteada divisoria en la mitad del recorrido */}
            <ReferenceLine
              x={estacionMitadLabel}
              stroke="#000"
              strokeDasharray="4 4"
              strokeOpacity={0.7}
              label={{
                value: "Mitad",
                position: "top",
                fill: "#000",
                fontSize: 10,
              }}
            />

            {/* Líneas de referencia horizontales en 5, 10, 15 y 20 */}
            <ReferenceLine y={5} stroke="#000" strokeDasharray="3 3" strokeOpacity={0.4} />
            <ReferenceLine y={10} stroke="#000" strokeOpacity={0.8} />
            <ReferenceLine y={15} stroke="#000" strokeDasharray="3 3" strokeOpacity={0.4} />
            <ReferenceLine y={20} stroke="#000" strokeOpacity={0.8} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => {
                    const data = item.payload
                    return (
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="font-semibold text-foreground mb-0.5">
                          {data.estacion} ({data.vuelta})
                        </span>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Tiro 1:</span>
                          <span className="font-mono font-medium">{data.tiro1} pts</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Tiro 2:</span>
                          <span className="font-mono font-medium">{data.tiro2} pts</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t border-border/40 pt-1 mt-0.5">
                          <span className="font-bold text-foreground">Total:</span>
                          <span className="font-mono font-bold text-[#eab308]">{data.total} pts</span>
                        </div>
                      </div>
                    )
                  }}
                  indicator="dot"
                />
              }
            />

            {/* Área con borde superior sólido negro y relleno degradado dorado */}
            <Area
              type="monotone"
              dataKey="total"
              stroke="#eab308"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fillDorado)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}