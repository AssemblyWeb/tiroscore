'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Search, X, ArrowUpRight } from 'lucide-react'
import type { RankingArcher, RankingDivision, SeasonInfo, } from '@/lib/types/ranking'
import { getTournamentEntries, type TournamentHistoryEntry } from '@/lib/ranking'

const categories = ['Tradicional', 'Raso', 'Longbow', 'Cazador']

const DIVISION_ORDER = ['Masculino Senior', 'Femenino Senior', 'Escuela'] as const

function compareDivisions(a: string, b: string) {
  const indexA = DIVISION_ORDER.indexOf(a as (typeof DIVISION_ORDER)[number])
  const indexB = DIVISION_ORDER.indexOf(b as (typeof DIVISION_ORDER)[number])
  const orderA = indexA === -1 ? DIVISION_ORDER.length : indexA
  const orderB = indexB === -1 ? DIVISION_ORDER.length : indexB

  if (orderA !== orderB) return orderA - orderB
  return a.localeCompare(b, 'es')
}

type ScoreboardProps = {
  entries: RankingArcher[]
  season: SeasonInfo
}

function groupByDivision(entries: RankingArcher[]): RankingDivision[] {
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

export function Scoreboard({ entries, season }: ScoreboardProps) {
  const [category, setCategory] = useState('Tradicional')
  const [selected, setSelected] = useState<RankingArcher | null>(null)
  const [query, setQuery] = useState('')

  const visibleDivisions = useMemo(() => {
    const filtered = entries.filter(
      (entry) =>
        entry.category === category &&
        entry.name.toLowerCase().includes(query.toLowerCase()),
    )
    return groupByDivision(filtered)
  }, [entries, category, query])

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-black text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 px-5 py-8 text-center lg:px-10">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              Score Shooter
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              {season.name}
            </h1>
            <p className="mt-2 text-sm text-white sm:text-base">{season.subtitle}</p>
          </div>
          {/* search filter */}
          {/* <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50"
              aria-hidden="true"
            />
            <label htmlFor="search" className="sr-only">
              Buscar arquero
            </label>
            <input
              id="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar arquero"
              className="h-10 w-full rounded-lg border border-white/20 bg-white/10 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div> */}
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-3 pb-20 pt-6 sm:px-5 lg:px-10">
      <h2 className="mt-1 mb-7 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Resultados</h2>

        {/* button nav */}
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
              Torneo · {category}
            </p>
          </div>
        </div>

        {visibleDivisions.length === 0 ? (
          <p className="pt-10 text-center text-muted-foreground">
            No hay arqueros cargados para la categoría {category}.
          </p>
        ) : (
          <div className="space-y-10 pt-7">
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
  return (
    <section aria-labelledby={division.name.replaceAll(' ', '-')}>
      <div className="mb-3 flex items-center justify-between">
        <h3 id={division.name.replaceAll(' ', '-')} className="text-2xl font-bold tracking-tight">
          {division.name} 
        </h3>
        <span className="font-mono text-xs text-muted-foreground">{division.rows.length} arqueros</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full min-w-[850px] border-collapse text-sm">
          <caption className="sr-only">Puntajes de {division.name}</caption>
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              {['Puesto', 'Nombre', 'Club', 'Localidad', 'Fecha 1', 'Fecha 2', 'Fecha 3', 'Fecha 4', 'Total'].map(
                (heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-4 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wide first:w-20 first:text-center last:text-right"
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
                  index < 4 ? 'bg-accent' : 'bg-card'
                } hover:bg-muted/80`}
              >
                <td className="px-4 py-3 text-center font-mono font-bold">
                  {index < 4 ? (
                    <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
                      {index + 1}
                    </span>
                  ) : (
                    index + 1
                  )}
                </td>
                <td className="px-4 py-3 font-bold">
                  <button
                    onClick={() => onSelect(row)}
                    className="group inline-flex items-center gap-1 text-left hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>{row.name}</span>
                    <ChevronRight
                      className="size-3 opacity-0 transition group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.club}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.location}</td>
                {row.scores.map((score, i) => (
                  <td key={i} className="px-4 py-3 text-center font-semibold">
                    {score==null || score==0 ? '—' : score}
                  </td>
                ))}
                <td className="px-4 py-3 text-right font-mono font-bold">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ArcherHistory({ archerId, archerSlug }: { archerId: string, archerSlug: string }) {
  const [entries, setEntries] = useState<TournamentHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const data = await getTournamentEntries(archerId)
        if (!active) return
        setEntries(data)
      } catch {
        if (!active) return
        setEntries([])
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      active = false
    }
  }, [archerId])

  if (loading) {
    return <p className="mt-3 text-sm text-muted-foreground">Cargando historial...</p>
  }

  if (entries.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h3 className="font-bold">Historial de torneos</h3>
      <div className="mt-3 space-y-3">
        {entries.map((entry) => {
          const label = entry.tournamentName ?? `Torneo #${entry.torneo_id ?? entry.id}`
          const detail = entry.tournamentDate ? `${entry.tournamentDate}` : 'Ver planilla'
          const scoreText = typeof entry.total === 'number' ? `${entry.total} pts` : 'Ver planilla'
          const hasLink = typeof entry.tournamentSlug === 'string' && entry.tournamentSlug.trim().length > 0

          const content = (
            <div className="flex items-center justify-between gap-4 rounded-xl border-2 border-primary/50 p-4 transition hover:border-primary hover:bg-accent">
              <div>
                <p className="font-semibold">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{detail} · {scoreText}</p>
              </div>
              <ArrowUpRight className="size-4 text-foreground" />
            </div>
          )

          if (!hasLink) {
            return <div key={entry.id}>{content}</div>
          }

          return (
            <Link key={entry.id} href={`${archerSlug}/${entry.tournamentSlug}`}>
              {content}
            </Link>
          )
        })}
      </div>
    </div>
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
              {archer.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {archer.club} · {archer.location}
            </p>
          </div>
          <button onClick={onClose} aria-label="Cerrar perfil" className="rounded-lg p-2 hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-accent p-4">
            <p className="text-xs text-muted-foreground">Puntaje total</p>
            <p className="mt-1 font-mono text-3xl font-bold">{archer.total}</p>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <p className="text-xs text-muted-foreground">División</p>
            <p className="mt-1 text-lg font-bold">{archer.division}</p>
          </div>
        </div>
        <ArcherHistory archerId={archer.id} archerSlug={archer.slug} />
      </aside>
    </div>
  )
}
