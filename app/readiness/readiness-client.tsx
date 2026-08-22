'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleDashed,
  Clock,
  FileText,
  MapPin,
  Send,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeadlineBadge, SectionTitle } from '@/components/sarthi-ui'
import { cn } from '@/lib/utils'
import { documents, schemes, type Scheme } from '@/lib/data'

/** Scheme-specific submission steps beyond documents. */
const extraSteps: Record<string, { label: string; done: boolean; note: string }[]> = {
  'post-matric-scholarship': [
    { label: 'Institution verification code', done: true, note: 'Provided by your college office' },
    { label: 'Bank account seeded with Aadhaar', done: true, note: 'Verified with NPCI' },
  ],
  'pm-fasal-bima': [
    { label: 'Sowing declaration', done: false, note: 'Village revenue officer must sign' },
    { label: 'Crop and survey number', done: true, note: 'Taken from your land record' },
  ],
  'pm-kisan': [
    { label: 'Land record seeding', done: false, note: 'Land Record (Fard) not uploaded yet' },
  ],
  'health-cover': [
    { label: 'Family member list', done: true, note: 'Four members added' },
  ],
}

type Row = {
  scheme: Scheme
  ready: number
  total: number
  blockers: string[]
}

const docStatus = new Map(documents.map((d) => [d.name.split(' (')[0].toLowerCase(), d.status]))

/** Resolve a scheme's required document to a vault status. */
function statusFor(req: string) {
  const rl = req.toLowerCase()
  for (const [name, status] of docStatus) {
    if (name === rl || name.startsWith(rl) || rl.startsWith(name.split(' ')[0])) return status
  }
  return 'missing' as const
}

export function ReadinessClient() {
  const rows: Row[] = useMemo(() => {
    return schemes
      .filter((s) => s.status === 'eligible' || s.status === 'likely')
      .map((s) => {
        const docChecks = s.documents.map((d) => ({ label: d, status: statusFor(d) }))
        const extras = extraSteps[s.id] ?? []
        const total = docChecks.length + extras.length
        const ready =
          docChecks.filter((d) => d.status === 'valid').length +
          extras.filter((e) => e.done).length
        const blockers = [
          ...docChecks.filter((d) => d.status !== 'valid').map((d) => d.label),
          ...extras.filter((e) => !e.done).map((e) => e.label),
        ]
        return { scheme: s, ready, total, blockers }
      })
      .sort((a, b) => b.ready / b.total - a.ready / a.total)
  }, [])

  const [openId, setOpenId] = useState<string | null>(rows[0]?.scheme.id ?? null)

  const submitNow = rows.filter((r) => r.blockers.length === 0)
  const almost = rows.filter((r) => r.blockers.length > 0 && r.blockers.length <= 1)
  const blocked = rows.filter((r) => r.blockers.length > 1)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 sm:px-6 lg:py-12">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Application Readiness
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
          What is standing between you and each application
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Rejections usually come from one missing paper, not from ineligibility. This is the
          pre-flight check: every requirement, its current state, and the single next action.
        </p>
      </header>

      {/* ------------------------------------------------------ triage bands */}
      <section aria-label="Readiness summary" className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: 'Ready to submit',
            value: submitNow.length,
            hint: 'Nothing pending on your side',
            tone: 'success' as const,
            icon: Check,
          },
          {
            label: 'One step away',
            value: almost.length,
            hint: 'A single item is blocking',
            tone: 'warning' as const,
            icon: Clock,
          },
          {
            label: 'Needs work',
            value: blocked.length,
            hint: 'Two or more items pending',
            tone: 'saffron' as const,
            icon: AlertTriangle,
          },
        ].map((b) => {
          const Icon = b.icon
          return (
            <div
              key={b.label}
              className={cn(
                'flex items-center gap-4 rounded-xl bg-card p-4 ring-1',
                b.tone === 'success' && 'ring-success/25',
                b.tone === 'warning' && 'ring-warning/25',
                b.tone === 'saffron' && 'ring-saffron/25',
              )}
            >
              <span
                className={cn(
                  'flex size-11 shrink-0 items-center justify-center rounded-lg',
                  b.tone === 'success' && 'bg-success/10 text-success',
                  b.tone === 'warning' && 'bg-warning/12 text-warning-foreground',
                  b.tone === 'saffron' && 'bg-saffron/12 text-accent-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-2xl font-semibold tabular-nums">{b.value}</span>
                <span className="text-sm font-medium">{b.label}</span>
                <span className="text-xs text-muted-foreground">{b.hint}</span>
              </div>
            </div>
          )
        })}
      </section>

      {/* --------------------------------------------------------- checklist */}
      <section>
        <SectionTitle
          action={
            <Button size="sm" variant="outline" className="gap-1.5" render={<Link href="/documents" />}>
              <Upload className="size-3.5" aria-hidden="true" />
              Document Center
            </Button>
          }
        >
          Scheme by scheme
        </SectionTitle>

        <ul className="flex flex-col gap-3">
          {rows.map(({ scheme, ready, total, blockers }) => {
            const pct = Math.round((ready / total) * 100)
            const isOpen = openId === scheme.id
            const clear = blockers.length === 0
            const docChecks = scheme.documents.map((d) => ({ label: d, status: statusFor(d) }))
            const extras = extraSteps[scheme.id] ?? []

            return (
              <li
                key={scheme.id}
                className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : scheme.id)}
                  aria-expanded={isOpen}
                  className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-muted/40 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="font-medium text-pretty">{scheme.name}</span>
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <span className="font-mono">{scheme.benefit}</span>
                        <span aria-hidden="true">·</span>
                        <span>{scheme.department}</span>
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <DeadlineBadge days={scheme.deadlineDays} label={scheme.deadlineLabel} />
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                          clear
                            ? 'bg-success/12 text-success ring-success/25'
                            : blockers.length === 1
                              ? 'bg-warning/12 text-warning-foreground ring-warning/25'
                              : 'bg-saffron/12 text-accent-foreground ring-saffron/25',
                        )}
                      >
                        {clear ? 'Ready' : `${blockers.length} pending`}
                      </span>
                    </div>
                  </div>

                  {/* progress */}
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className={cn(
                          'block h-full rounded-full transition-[width] duration-500',
                          clear ? 'bg-success' : 'bg-saffron',
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {ready}/{total}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-foreground/8 bg-muted/30 p-4 sm:p-5">
                    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                      {/* requirement list */}
                      <div className="flex flex-col gap-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Requirements
                        </p>
                        <ul className="flex flex-col gap-1.5">
                          {docChecks.map((d) => (
                            <li
                              key={d.label}
                              className="flex items-center gap-2.5 rounded-lg bg-card px-3 py-2 text-sm ring-1 ring-foreground/8"
                            >
                              {d.status === 'valid' ? (
                                <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
                              ) : d.status === 'expiring' ? (
                                <AlertTriangle
                                  className="size-4 shrink-0 text-warning-foreground"
                                  aria-hidden="true"
                                />
                              ) : (
                                <CircleDashed
                                  className="size-4 shrink-0 text-destructive"
                                  aria-hidden="true"
                                />
                              )}
                              <span className="min-w-0 flex-1 truncate">{d.label}</span>
                              <span
                                className={cn(
                                  'shrink-0 text-[0.6875rem] font-medium',
                                  d.status === 'valid' && 'text-success',
                                  d.status === 'expiring' && 'text-warning-foreground',
                                  d.status === 'missing' && 'text-destructive',
                                )}
                              >
                                {d.status === 'valid'
                                  ? 'On file'
                                  : d.status === 'expiring'
                                    ? 'Renew'
                                    : 'Missing'}
                              </span>
                            </li>
                          ))}
                          {extras.map((e) => (
                            <li
                              key={e.label}
                              className="flex items-start gap-2.5 rounded-lg bg-card px-3 py-2 text-sm ring-1 ring-foreground/8"
                            >
                              {e.done ? (
                                <Check
                                  className="mt-0.5 size-4 shrink-0 text-success"
                                  aria-hidden="true"
                                />
                              ) : (
                                <CircleDashed
                                  className="mt-0.5 size-4 shrink-0 text-destructive"
                                  aria-hidden="true"
                                />
                              )}
                              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <span>{e.label}</span>
                                <span className="text-[0.6875rem] text-muted-foreground">
                                  {e.note}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* next action */}
                      <div className="flex flex-col gap-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {clear ? 'You can submit' : 'Do this next'}
                        </p>
                        <div
                          className={cn(
                            'flex flex-col gap-3 rounded-xl p-4 ring-1',
                            clear
                              ? 'bg-success/6 ring-success/25'
                              : 'bg-saffron/8 ring-saffron/25',
                          )}
                        >
                          <p className="text-sm leading-relaxed">
                            {clear ? (
                              <>
                                Every requirement is satisfied. Submitting takes about four
                                minutes and Sarthi pre-fills the form from your vault.
                              </>
                            ) : (
                              <>
                                Sort out{' '}
                                <strong className="font-semibold">{blockers[0]}</strong>
                                {blockers.length > 1 && (
                                  <> and {blockers.length - 1} other item
                                    {blockers.length > 2 ? 's' : ''}</>
                                )}
                                . Everything else is already in place.
                              </>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {clear ? (
                              <Button size="sm" className="gap-1.5">
                                <Send className="size-3.5" aria-hidden="true" />
                                Start application
                              </Button>
                            ) : (
                              <Button size="sm" className="gap-1.5" render={<Link href="/documents" />}>
                                <FileText className="size-3.5" aria-hidden="true" />
                                Resolve in vault
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1.5"
                              render={<Link href="/help-near-me" />}
                            >
                              <MapPin className="size-3.5" aria-hidden="true" />
                              Nearby help
                            </Button>
                          </div>
                        </div>
                        <Link
                          href={`/scheme/${scheme.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-2 hover:text-foreground"
                        >
                          Read the full scheme rules
                          <ArrowRight className="size-3" aria-hidden="true" />
                        </Link>
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
