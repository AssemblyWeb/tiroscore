'use client'

import { useMemo, useState } from 'react'
import { ChevronRight, X } from 'lucide-react'
import type { RankingArcher, RankingDivision } from '@/lib/types/ranking'

const categories = ['Recurvo Tradicional', 'Raso', 'Longbow', 'Cazador']

// Orden requerido: 1. Masculino Senior, 2. Femenino Senior, 3. Escuela, luego otras
const DIVISION_ORDER = ['Masculino Senior', 'Femenino Senior', 'Escuela'] as const

function compareDivisions(a: string, b: string) {
  const indexA = DIVISION_ORDER.indexOf(a as (typeof DIVISION_ORDER)[number])
  const indexB = DIVISION_ORDER.indexOf(b as (typeof DIVISION_ORDER)[number])
  const orderA = indexA === -1 ? DIVISION_ORDER.length : indexA
  const orderB = indexB === -1 ? DIVISION_ORDER.length : indexB

  if (orderA !== orderB) return orderA - orderB
  return a.localeCompare(b, 'es')
}

function groupByDivision(entries: RankingArcher[]): RankingDivision[] {
    // console.log('entries', entries)
  const divisions = new Map<string, RankingArcher[]>()

  for (const entry of entries) {
    const rows = divisions.get(entry.division) ?? []
    rows.push(entry)
    divisions.set(entry.division, rows)
  }

  return Array.from(divisions.entries())
    .sort(([a], [b]) => compareDivisions(a, b))
    .map(([name, rows]) => ({
      name,
      rows: [...rows].sort((a, b) => b.total - a.total),
    }))
}
export function Scoreboard({ entries }: { entries: RankingArcher[] }) {
  const [category, setCategory] = useState('Recurvo Tradicional')
  const [selected, setSelected] = useState<RankingArcher | null>(null)

  const visibleDivisions = useMemo(() => {
    const filtered = entries.filter(
      (entry) =>
        entry.categoria.toLowerCase().trim("") === category.toLowerCase().trim("") 
    )
    return groupByDivision(filtered)
  }, [entries, category])
console.log('visibleDivisions', visibleDivisions)
  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-[1400px] px-3 pb-20 pt-6 sm:px-5 lg:px-10">
        <h2 className="mt-1 mb-7 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Resultados por Categoría</h2>

        {/* Botones de Categorías (Pestañas) */}
        <nav aria-label="Categorías de arco" className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-md border-2 px-3 py-3 text-sm font-semibold transition ${
                category === item
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-primary bg-card text-foreground hover:bg-accent'
              }`}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-4 pb-0 sm:flex-row justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Categoría · {category}
            </p>
          </div>
        </div>

        {visibleDivisions.length === 0 ? (
          <p className="pt-10 text-center text-muted-foreground">
            No hay arqueros cargados para la categoría {category}.
          </p>
        ) : (
          // Grid para mostrar de 50% de ancho en desktop (2 columnas)
          <div className="grid grid-cols-1 gap-8 pt-7 lg:grid-cols-2">
            {visibleDivisions.map((division) => (
              <DivisionTable key={division.name} division={division} onSelect={setSelected} />
            ))}
          </div>
        )}
      </main>

      {selected && <ArcherPanel archer={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function DivisionTable({
  division,
  onSelect,
}: {
  division: RankingDivision
  onSelect: (row: RankingArcher) => void
}) {
    console.log('division2', division)
  return (
    <section aria-labelledby={division.name} className="w-full flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 id={division.name} className="text-xl font-bold tracking-tight">
          {division.name} 
        </h3>
        <span className="font-mono text-xs text-muted-foreground">{division.rows.length} arqueros</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border shadow-sm bg-card flex-1">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Puntajes de {division.name}</caption>
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              {['Puesto', 'Nombre', 'Club', 'Localidad', 'Puntaje'].map(
                (heading, idx) => (
                  <th
                    key={heading}
                    scope="col"
                    className={`px-3 py-3 font-mono text-xs font-semibold uppercase tracking-wide ${
                      idx === 0 ? 'w-16 text-center' : idx === 4 ? 'text-right' : 'text-left'
                    }`}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {division.rows.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-border last:border-0 ${
                  index < 3 ? 'bg-accent/50' : 'bg-card'
                } hover:bg-muted/80`}
              >
                <td className="px-3 py-2.5 text-center font-mono font-bold">
                  {index < 3 ? (
                    <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
                      {index + 1}
                    </span>
                  ) : (
                    index + 1
                  )}
                </td>
                <td className="px-3 py-2.5 font-bold">
                  <button
                    onClick={() => onSelect(row)}
                    className="group cursor-pointer inline-flex items-center gap-1 text-left hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="truncate max-w-[140px] sm:max-w-[200px]">{row.arqueros.nombre}</span>
                    <ChevronRight
                      className="size-3 opacity-0 transition group-hover:opacity-100 shrink-0"
                      aria-hidden="true"
                    />
                  </button>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground truncate max-w-[100px] sm:max-w-[130px]">{row.arqueros.club}</td>
                <td className="px-3 py-2.5 text-muted-foreground truncate max-w-[90px] sm:max-w-[110px]">{row.arqueros.localidad}</td>
                <td className="px-3 py-2.5 text-right font-mono font-bold text-primary">{row.tiros_estaciones[23].acumulado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ArcherPanel({ archer, onClose }: { archer: RankingArcher; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-20 flex justify-end bg-black/30"
      role="presentation"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="archer-title"
        onClick={(event) => event.stopPropagation()}
        className="h-full w-full max-w-md overflow-y-auto bg-card p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Perfil del arquero
            </p>
            <h2 id="archer-title" className="mt-2 text-2xl font-extrabold">
              {archer.arqueros.nombre}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {archer.arqueros.club} · {archer.arqueros.localidad}
            </p>
          </div>
          <button onClick={onClose} aria-label="Cerrar perfil" className="rounded-lg p-2 hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-accent p-4">
            <p className="text-xs text-muted-foreground">Puntaje total</p>
            <p className="mt-1 font-mono text-3xl font-bold">{archer.tiros_estaciones[23].acumulado}</p>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <p className="text-xs text-muted-foreground">Categoría y división</p>
            <p className="mt-1 text-sm font-bold">{archer.categoria} - {archer.division}</p>
          </div>
        </div>
      </aside>
    </div>
  )
}