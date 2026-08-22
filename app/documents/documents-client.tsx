'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  FileText,
  Landmark,
  Lock,
  Plus,
  RefreshCw,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionTitle, StatTile } from '@/components/sarthi-ui'
import { cn } from '@/lib/utils'
import { documents, schemes, type Doc } from '@/lib/data'

type Filter = 'all' | 'valid' | 'expiring' | 'missing'

const docStatusMeta = {
  valid: {
    label: 'Valid',
    icon: CheckCircle2,
    chip: 'bg-success/12 text-success ring-success/25',
    bar: 'bg-success',
  },
  expiring: {
    label: 'Needs renewal',
    icon: AlertTriangle,
    chip: 'bg-warning/14 text-warning-foreground ring-warning/30',
    bar: 'bg-warning',
  },
  missing: {
    label: 'Missing',
    icon: CircleSlash,
    chip: 'bg-destructive/10 text-destructive ring-destructive/25',
    bar: 'bg-destructive',
  },
} as const

/** Schemes that list this document among their requirements. */
function schemesNeeding(doc: Doc) {
  const needle = doc.name.split(' (')[0].toLowerCase()
  return schemes.filter((s) =>
    s.documents.some((d) => {
      const dl = d.toLowerCase()
      return dl === needle || needle.startsWith(dl) || dl.startsWith(needle.split(' ')[0])
    }),
  )
}

export function DocumentsClient() {
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>('income-certificate')

  const counts = useMemo(
    () => ({
      all: documents.length,
      valid: documents.filter((d) => d.status === 'valid').length,
      expiring: documents.filter((d) => d.status === 'expiring').length,
      missing: documents.filter((d) => d.status === 'missing').length,
    }),
    [],
  )

  const shown = useMemo(
    () => (filter === 'all' ? documents : documents.filter((d) => d.status === filter)),
    [filter],
  )

  /* Schemes blocked purely because a document is absent. */
  const blockedCount = useMemo(() => {
    const ids = new Set<string>()
    documents
      .filter((d) => d.status === 'missing')
      .forEach((d) => schemesNeeding(d).forEach((s) => ids.add(s.id)))
    return ids.size
  }, [])

  const renewalsDue = documents.reduce((n, d) => n + d.needsRenewal, 0)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:py-12">
      {/* ------------------------------------------------------------ header */}
      <header className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Document Center
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
          Ten documents unlock every scheme you qualify for
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Upload once, reuse everywhere. Sarthi tracks what each document unlocks, warns
          you before it expires, and never sends a file anywhere without your permission.
        </p>
        <div className="flex items-center gap-2 rounded-lg bg-info/8 px-3 py-2 text-xs text-info ring-1 ring-info/20 sm:w-fit">
          <Lock className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="leading-relaxed">
            Stored encrypted on your device vault. Shared with a department only when you
            tap Apply.
          </span>
        </div>
      </header>

      {/* -------------------------------------------------------------- stats */}
      <section aria-label="Document summary" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Documents on file"
          value={`${counts.valid} of ${counts.all}`}
          hint="Verified and ready to submit"
          tone="success"
        />
        <StatTile
          label="Renewals due"
          value={renewalsDue}
          hint="Across 2 documents this quarter"
          tone="warning"
        />
        <StatTile
          label="Schemes blocked"
          value={blockedCount}
          hint="Waiting on a missing document"
          tone="saffron"
        />
        <StatTile
          label="Re-uses saved"
          value="38"
          hint="Times a stored file replaced a fresh upload"
          tone="info"
        />
      </section>

      {/* ---------------------------------------------------- missing callout */}
      {counts.missing > 0 && (
        <section className="rounded-2xl bg-saffron/8 p-5 ring-1 ring-saffron/25 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Upload className="size-4 text-saffron" aria-hidden="true" />
                {counts.missing} missing documents block {blockedCount} schemes
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Adding your Land Record alone opens six schemes, including PM-KISAN and the
                crop insurance you were matched with.
              </p>
            </div>
            <Button className="shrink-0 gap-2">
              <Plus className="size-4" aria-hidden="true" />
              Add a document
            </Button>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- vault */}
      <section>
        <SectionTitle
          action={
            <div
              role="group"
              aria-label="Filter documents by status"
              className="flex flex-wrap gap-1.5"
            >
              {(['all', 'valid', 'expiring', 'missing'] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium capitalize ring-1 transition-colors',
                    filter === f
                      ? 'bg-foreground text-background ring-foreground'
                      : 'bg-card text-muted-foreground ring-foreground/12 hover:text-foreground',
                  )}
                >
                  {f === 'all' ? 'All' : f === 'expiring' ? 'Needs renewal' : f}
                  <span className="ml-1.5 tabular-nums opacity-60">{counts[f]}</span>
                </button>
              ))}
            </div>
          }
        >
          Your vault
        </SectionTitle>

        <ul className="flex flex-col gap-3">
          {shown.map((doc) => {
            const meta = docStatusMeta[doc.status]
            const Icon = meta.icon
            const unlocks = schemesNeeding(doc)
            const isOpen = openId === doc.id
            const pct = doc.usedBy ? Math.round((doc.validFor / doc.usedBy) * 100) : 0

            return (
              <li
                key={doc.id}
                className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : doc.id)}
                  aria-expanded={isOpen}
                  className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-lg',
                      doc.status === 'missing'
                        ? 'bg-destructive/8 text-destructive'
                        : doc.status === 'expiring'
                          ? 'bg-warning/12 text-warning-foreground'
                          : 'bg-success/10 text-success',
                    )}
                  >
                    <FileText className="size-5" aria-hidden="true" />
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{doc.name}</span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium ring-1',
                          meta.chip,
                        )}
                      >
                        <Icon className="size-3" aria-hidden="true" />
                        {meta.label}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">{doc.detail}</span>
                  </span>

                  {/* value: how many schemes this document serves */}
                  <span className="flex shrink-0 items-center gap-3 sm:w-48">
                    <span className="flex-1">
                      <span className="mb-1 flex items-baseline justify-between gap-2">
                        <span className="font-mono text-sm font-semibold tabular-nums">
                          {doc.usedBy}
                        </span>
                        <span className="text-[0.6875rem] text-muted-foreground">
                          schemes use this
                        </span>
                      </span>
                      <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
                        <span
                          className={cn('block h-full rounded-full', meta.bar)}
                          style={{ width: `${doc.status === 'missing' ? 100 : pct}%` }}
                        />
                      </span>
                    </span>
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-foreground/8 bg-muted/30 px-4 py-4">
                    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
                      <dl className="flex flex-col gap-3 text-sm">
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-xs text-muted-foreground">Issuing authority</dt>
                          <dd className="flex items-center gap-1.5 font-medium">
                            <Landmark className="size-3.5 text-muted-foreground" aria-hidden="true" />
                            {doc.issuedBy}
                          </dd>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-xs text-muted-foreground">Accepted as-is by</dt>
                          <dd className="font-medium tabular-nums">
                            {doc.validFor} of {doc.usedBy} schemes
                            {doc.needsRenewal > 0 && (
                              <span className="ml-1.5 font-normal text-warning-foreground">
                                · {doc.needsRenewal} need a fresher copy
                              </span>
                            )}
                          </dd>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {doc.status === 'missing' ? (
                            <Button size="sm" className="gap-1.5">
                              <Upload className="size-3.5" aria-hidden="true" />
                              Upload now
                            </Button>
                          ) : doc.status === 'expiring' ? (
                            <Button size="sm" className="gap-1.5">
                              <RefreshCw className="size-3.5" aria-hidden="true" />
                              Start renewal
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="gap-1.5">
                              <FileText className="size-3.5" aria-hidden="true" />
                              View file
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" render={<Link href="/help-near-me" />}>
                            Get help nearby
                          </Button>
                        </div>
                      </dl>

                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {doc.status === 'missing' ? 'Would unlock' : 'Used by'}
                        </p>
                        {unlocks.length > 0 ? (
                          <ul className="flex flex-col gap-1.5">
                            {unlocks.slice(0, 5).map((s) => (
                              <li key={s.id}>
                                <Link
                                  href={`/scheme/${s.id}`}
                                  className="flex items-center justify-between gap-3 rounded-lg bg-card px-3 py-2 text-sm ring-1 ring-foreground/8 transition-colors hover:ring-foreground/25"
                                >
                                  <span className="min-w-0 truncate font-medium">
                                    {s.name}
                                  </span>
                                  <span className="shrink-0 font-mono text-[0.6875rem] text-muted-foreground">
                                    {s.benefit}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No matched schemes require this yet.
                          </p>
                        )}
                        {unlocks.length > 5 && (
                          <p className="text-xs text-muted-foreground">
                            + {unlocks.length - 5} more
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
