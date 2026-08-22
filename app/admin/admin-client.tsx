'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Boxes,
  CircleSlash,
  Database,
  FileStack,
  GitCompare,
  RefreshCw,
  Search,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionTitle } from '@/components/sarthi-ui'
import { cn } from '@/lib/utils'
import { adminMetrics, adminSchemeRows, ragIndex, schemeUpdates } from '@/lib/data'

type Tab = 'registry' | 'index' | 'changes'

const healthMeta = {
  healthy: { label: 'Healthy', className: 'bg-success/12 text-success ring-success/25' },
  degraded: {
    label: 'Degraded',
    className: 'bg-warning/12 text-warning-foreground ring-warning/25',
  },
  stale: { label: 'Stale', className: 'bg-destructive/8 text-destructive ring-destructive/25' },
} as const

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'neutral',
}: {
  label: string
  value: string | number
  hint: string
  icon: React.ElementType
  tone?: 'neutral' | 'warning' | 'danger'
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <Icon
          className={cn(
            'size-4 shrink-0',
            tone === 'danger'
              ? 'text-destructive'
              : tone === 'warning'
                ? 'text-warning-foreground'
                : 'text-muted-foreground',
          )}
          aria-hidden="true"
        />
      </div>
      <span
        className={cn(
          'font-mono text-2xl font-semibold tabular-nums',
          tone === 'danger' && 'text-destructive',
          tone === 'warning' && 'text-warning-foreground',
        )}
      >
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </span>
      <span className="text-xs leading-relaxed text-muted-foreground">{hint}</span>
    </div>
  )
}

export function AdminClient() {
  const [tab, setTab] = useState<Tab>('registry')
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return adminSchemeRows
    return adminSchemeRows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.category.toLowerCase().includes(needle) ||
        r.state.toLowerCase().includes(needle),
    )
  }, [q])

  const unverified = adminSchemeRows.filter((r) => !r.rulesVerified).length
  const notIndexed = adminSchemeRows.filter((r) => !r.indexed).length

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-9 px-4 py-8 sm:px-6 lg:py-12">
      {/* ------------------------------------------------------------ header */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Knowledge Base Admin
          </p>
          <span className="rounded-full bg-info/10 px-2 py-0.5 text-[0.6875rem] font-medium text-info ring-1 ring-info/25">
            Internal
          </span>
        </div>
        <h1 className="max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
          Every answer Sarthi gives traces back to this table
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Scheme rules, source documents and their embeddings. When a notification changes, an
          operator verifies it here before citizens see a different answer.
        </p>
      </header>

      {/* ----------------------------------------------------------- metrics */}
      <section aria-label="Knowledge base metrics" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Schemes tracked"
          value={adminMetrics.totalSchemes}
          hint={`${adminMetrics.activeSchemes} active, ${adminMetrics.totalSchemes - adminMetrics.activeSchemes} archived`}
          icon={Boxes}
        />
        <MetricCard
          label="Source documents"
          value={adminMetrics.documentsIndexed}
          hint="Gazettes, circulars and guideline PDFs parsed"
          icon={FileStack}
        />
        <MetricCard
          label="Updated this month"
          value={adminMetrics.recentlyUpdated}
          hint="Rule, deadline or benefit changes detected"
          icon={RefreshCw}
        />
        <MetricCard
          label="Pending verification"
          value={adminMetrics.pendingVerification}
          hint="Awaiting an operator sign-off"
          icon={AlertTriangle}
          tone="warning"
        />
        <MetricCard
          label="Source conflicts"
          value={adminMetrics.sourceConflicts}
          hint="Two documents state different limits"
          icon={ShieldAlert}
          tone="danger"
        />
        <MetricCard
          label="Rules unverified"
          value={unverified}
          hint="Parsed automatically, not yet reviewed"
          icon={GitCompare}
          tone="warning"
        />
      </section>

      {/* ------------------------------------------------------ conflict band */}
      <section className="flex flex-col gap-4 rounded-2xl bg-destructive/6 p-5 ring-1 ring-destructive/20 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">
              {adminMetrics.sourceConflicts} schemes have conflicting sources
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              PMFBY lists three required documents in the 2026 guidelines and four in the state
              circular. Citizens are shown the stricter set until an operator resolves it.
            </p>
          </div>
        </div>
        <Button variant="outline" className="shrink-0 gap-1.5">
          Review conflicts
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </section>

      {/* -------------------------------------------------------------- tabs */}
      <section>
        <SectionTitle
          action={
            <div role="group" aria-label="Admin views" className="flex flex-wrap gap-1.5">
              {(
                [
                  ['registry', 'Scheme registry'],
                  ['index', 'Retrieval index'],
                  ['changes', 'Change log'],
                ] as [Tab, string][]
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  aria-pressed={tab === k}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors',
                    tab === k
                      ? 'bg-foreground text-background ring-foreground'
                      : 'bg-card text-muted-foreground ring-foreground/12 hover:text-foreground',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        >
          {tab === 'registry'
            ? 'Scheme registry'
            : tab === 'index'
              ? 'Retrieval index health'
              : 'Verified changes'}
        </SectionTitle>

        {/* ------------------------------------------------------- registry */}
        {tab === 'registry' && (
          <div className="flex flex-col gap-4">
            <div className="relative max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter by scheme, category or state"
                aria-label="Filter scheme registry"
                className="pl-9"
              />
            </div>

            <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-foreground/10">
              <table className="w-full min-w-[52rem] text-sm">
                <caption className="sr-only">
                  Scheme registry with verification and indexing status
                </caption>
                <thead>
                  <tr className="border-b border-foreground/8 text-left">
                    {['Scheme', 'Category', 'Jurisdiction', 'Version', 'Last verified', 'Status'].map(
                      (h) => (
                        <th
                          key={h}
                          scope="col"
                          className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.name}
                      className="border-b border-foreground/6 last:border-0 hover:bg-muted/40"
                    >
                      <th scope="row" className="px-4 py-3 text-left font-medium">
                        {r.name}
                      </th>
                      <td className="px-4 py-3 text-muted-foreground">{r.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.state}</td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-muted-foreground">
                        {r.version}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-muted-foreground">
                        {r.lastVerified}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex flex-wrap gap-1.5">
                          {r.rulesVerified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[0.6875rem] font-medium text-success ring-1 ring-success/25">
                              <BadgeCheck className="size-3" aria-hidden="true" />
                              Rules verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-warning/12 px-2 py-0.5 text-[0.6875rem] font-medium text-warning-foreground ring-1 ring-warning/25">
                              <AlertTriangle className="size-3" aria-hidden="true" />
                              Needs review
                            </span>
                          )}
                          {!r.indexed && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/8 px-2 py-0.5 text-[0.6875rem] font-medium text-destructive ring-1 ring-destructive/25">
                              <CircleSlash className="size-3" aria-hidden="true" />
                              Not indexed
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rows.length === 0 && (
              <p className="rounded-xl bg-card p-6 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
                No schemes match{' '}
                <span className="font-medium text-foreground">&ldquo;{q}&rdquo;</span>.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Showing {rows.length} of {adminSchemeRows.length} rows · {notIndexed} awaiting
              embedding
            </p>
          </div>
        )}

        {/* ---------------------------------------------------------- index */}
        {tab === 'index' && (
          <ul className="flex flex-col gap-3">
            {ragIndex.map((r) => {
              const meta = healthMeta[r.health as keyof typeof healthMeta]
              const pct = r.chunks ? Math.round((r.embeddings / r.chunks) * 100) : 0
              return (
                <li
                  key={r.scheme}
                  className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Database className="size-4" aria-hidden="true" />
                      </span>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="font-medium">{r.scheme}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {r.docs} docs · {r.chunks} chunks · indexed {r.indexed}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                        meta.className,
                      )}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className={cn(
                          'block h-full rounded-full',
                          r.health === 'healthy'
                            ? 'bg-success'
                            : r.health === 'degraded'
                              ? 'bg-warning'
                              : 'bg-destructive',
                        )}
                        style={{ width: `${Math.max(pct, r.health === 'stale' ? 3 : pct)}%` }}
                      />
                    </span>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {r.embeddings}/{r.chunks} embedded
                    </span>
                  </div>

                  {r.health !== 'healthy' && (
                    <div className="flex flex-wrap items-center gap-3 border-t border-foreground/8 pt-3">
                      <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted-foreground">
                        {r.health === 'stale'
                          ? 'No embeddings exist. Sarthi cannot cite this scheme and will fall back to the summary text.'
                          : 'Three chunks failed to embed. Answers may miss the newest clause.'}
                      </p>
                      <Button size="sm" variant="outline" className="shrink-0 gap-1.5">
                        <RefreshCw className="size-3.5" aria-hidden="true" />
                        Re-index
                      </Button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {/* -------------------------------------------------------- changes */}
        {tab === 'changes' && (
          <ul className="flex flex-col gap-3">
            {schemeUpdates.map((u) => (
              <li
                key={`${u.scheme}-${u.field}`}
                className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-medium">{u.scheme}</span>
                    <span className="text-xs text-muted-foreground">{u.field}</span>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                      u.status === 'Verified'
                        ? 'bg-success/12 text-success ring-success/25'
                        : 'bg-warning/12 text-warning-foreground ring-warning/25',
                    )}
                  >
                    {u.status}
                  </span>
                </div>

                {/* before → after */}
                <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className="font-mono text-sm text-muted-foreground line-through decoration-destructive/60">
                    {u.from}
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="font-mono text-sm font-semibold">{u.to}</span>
                  <span className="ml-auto font-mono text-[0.6875rem] text-muted-foreground">
                    {u.date}
                  </span>
                </div>

                <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
                  <FileStack className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  Source: {u.source}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
