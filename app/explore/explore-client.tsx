'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SchemeCard } from '@/components/sarthi-ui'
import { PageHeader } from '@/components/site-nav'
import { schemes, statusMeta, type EligibilityState } from '@/lib/data'
import { cn } from '@/lib/utils'

type Sort = 'match' | 'deadline' | 'name'

const sortLabels: Record<Sort, string> = {
  match: 'Best match first',
  deadline: 'Closing soonest',
  name: 'Name (A–Z)',
}

const allCategories = [...new Set(schemes.map((s) => s.category))].sort()
const allStates = [...new Set(schemes.map((s) => s.state))].sort()
const allStatuses: EligibilityState[] = [
  'eligible',
  'likely',
  'missing-info',
  'not-eligible',
]

export function ExploreClient({
  initialCategory,
}: {
  initialCategory?: string
}) {
  const [query, setQuery] = useState('')
  const [cats, setCats] = useState<string[]>(
    initialCategory && allCategories.includes(initialCategory)
      ? [initialCategory]
      : [],
  )
  const [levels, setLevels] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [statuses, setStatuses] = useState<EligibilityState[]>([])
  const [closingSoon, setClosingSoon] = useState(false)
  const [sort, setSort] = useState<Sort>('match')
  const [showFilters, setShowFilters] = useState(false)

  const toggle = <T,>(
    list: T[],
    setList: (v: T[]) => void,
    value: T,
  ) =>
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    )

  const activeCount =
    cats.length +
    levels.length +
    states.length +
    statuses.length +
    (closingSoon ? 1 : 0)

  const clearAll = () => {
    setCats([])
    setLevels([])
    setStates([])
    setStatuses([])
    setClosingSoon(false)
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = schemes.filter((s) => {
      if (
        q &&
        !`${s.name} ${s.nameHi} ${s.department} ${s.category} ${s.summary}`
          .toLowerCase()
          .includes(q)
      )
        return false
      if (cats.length && !cats.includes(s.category)) return false
      if (levels.length && !levels.includes(s.level)) return false
      if (states.length && !states.includes(s.state)) return false
      if (statuses.length && !statuses.includes(s.status)) return false
      if (closingSoon && (s.deadlineDays === null || s.deadlineDays > 30))
        return false
      return true
    })

    return filtered.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'deadline') {
        const av = a.deadlineDays ?? 9999
        const bv = b.deadlineDays ?? 9999
        return av - bv
      }
      return b.match - a.match
    })
  }, [query, cats, levels, states, statuses, closingSoon, sort])

  const facet = (
    title: string,
    children: React.ReactNode,
  ) => (
    <div className="border-b border-border pb-5 last:border-0 last:pb-0">
      <p className="mb-3 text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
        {title}
      </p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )

  const check = (
    id: string,
    label: React.ReactNode,
    checked: boolean,
    onChange: () => void,
    count?: number,
  ) => (
    <div key={id} className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label
        htmlFor={id}
        className="flex-1 cursor-pointer justify-between text-sm font-normal"
      >
        <span>{label}</span>
        {count !== undefined && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {count}
          </span>
        )}
      </Label>
    </div>
  )

  const filterPanel = (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="size-4 text-saffron" />
          Filters
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-saffron hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {facet(
        'Eligibility',
        allStatuses.map((s) =>
          check(
            `st-${s}`,
            <span className="inline-flex items-center gap-1.5">
              <span
                className={cn('size-1.5 rounded-full', statusMeta[s].dot)}
                aria-hidden="true"
              />
              {statusMeta[s].label}
            </span>,
            statuses.includes(s),
            () => toggle(statuses, setStatuses, s),
            schemes.filter((x) => x.status === s).length,
          ),
        ),
      )}

      {facet(
        'Category',
        allCategories.map((c) =>
          check(
            `cat-${c}`,
            c,
            cats.includes(c),
            () => toggle(cats, setCats, c),
            schemes.filter((x) => x.category === c).length,
          ),
        ),
      )}

      {facet(
        'Level',
        ['Central', 'State'].map((l) =>
          check(
            `lvl-${l}`,
            l,
            levels.includes(l),
            () => toggle(levels, setLevels, l),
            schemes.filter((x) => x.level === l).length,
          ),
        ),
      )}

      {facet(
        'Applies in',
        allStates.map((s) =>
          check(
            `state-${s}`,
            s,
            states.includes(s),
            () => toggle(states, setStates, s),
            schemes.filter((x) => x.state === s).length,
          ),
        ),
      )}

      {facet(
        'Deadline',
        check(
          'closing-soon',
          'Closing within 30 days',
          closingSoon,
          () => setClosingSoon(!closingSoon),
        ),
      )}
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Explore"
        title="Browse every scheme in one place"
        description="Search 428 central and state schemes. Every result shows how well it matches your profile, what it pays, and when it closes."
        actions={
          <Button variant="outline" render={<Link href="/chat" />}>
            Ask Sarthi instead
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by scheme name, department or keyword"
            aria-label="Search schemes"
            className="h-11 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <Filter />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1 tabular-nums">
                {activeCount}
              </Badge>
            )}
          </Button>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="h-11 w-full min-w-48 sm:w-auto" aria-label="Sort results">
              <SelectValue>{(v) => sortLabels[v as Sort]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(sortLabels) as Sort[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {sortLabels[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {[
            ...statuses.map((s) => ({
              key: `s-${s}`,
              label: statusMeta[s].label,
              clear: () => toggle(statuses, setStatuses, s),
            })),
            ...cats.map((c) => ({
              key: `c-${c}`,
              label: c,
              clear: () => toggle(cats, setCats, c),
            })),
            ...levels.map((l) => ({
              key: `l-${l}`,
              label: l,
              clear: () => toggle(levels, setLevels, l),
            })),
            ...states.map((s) => ({
              key: `st-${s}`,
              label: s,
              clear: () => toggle(states, setStates, s),
            })),
            ...(closingSoon
              ? [
                  {
                    key: 'cs',
                    label: 'Closing within 30 days',
                    clear: () => setClosingSoon(false),
                  },
                ]
              : []),
          ].map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground hover:bg-saffron-soft hover:text-accent-foreground"
            >
              {chip.label}
              <X className="size-3" />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside
          className={cn(
            'lg:w-64 lg:shrink-0',
            showFilters ? 'block' : 'hidden lg:block',
          )}
        >
          <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 lg:sticky lg:top-20">
            {filterPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="mb-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground tabular-nums">
              {results.length}
            </span>{' '}
            {results.length === 1 ? 'scheme' : 'schemes'} shown
            {activeCount > 0 && ' with current filters'}
          </p>

          {results.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <Search className="size-8 text-muted-foreground" />
                <div>
                  <p className="font-semibold">No schemes match these filters</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try removing a filter, or describe your situation to Sarthi
                    in plain language.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearAll}>
                    Clear filters
                  </Button>
                  <Button render={<Link href="/chat" />}>Ask Sarthi</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {results.map((s) => (
                <li key={s.id}>
                  <SchemeCard scheme={s} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
