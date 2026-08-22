'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  CheckCheck,
  FileWarning,
  RefreshCcw,
  Scale,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionTitle } from '@/components/sarthi-ui'
import { cn } from '@/lib/utils'
import { alerts as seedAlerts, schemes, type Alert } from '@/lib/data'

const typeMeta = {
  'New Scheme': {
    icon: Sparkles,
    tint: 'bg-saffron/12 text-accent-foreground',
    ring: 'ring-saffron/25',
    label: 'New scheme',
  },
  Deadline: {
    icon: CalendarClock,
    tint: 'bg-destructive/8 text-destructive',
    ring: 'ring-destructive/20',
    label: 'Deadline',
  },
  'Eligibility Change': {
    icon: Scale,
    tint: 'bg-info/10 text-info',
    ring: 'ring-info/25',
    label: 'Rule change',
  },
  'Document Expiry': {
    icon: FileWarning,
    tint: 'bg-warning/12 text-warning-foreground',
    ring: 'ring-warning/25',
    label: 'Document',
  },
  'Application Update': {
    icon: RefreshCcw,
    tint: 'bg-success/10 text-success',
    ring: 'ring-success/25',
    label: 'Application',
  },
} as const

type FilterKey = 'all' | keyof typeof typeMeta

/** Where each alert should take the citizen next. */
const alertAction: Record<string, { label: string; href: string }> = {
  a1: { label: 'Check eligibility', href: '/eligibility' },
  a2: { label: 'Apply now', href: '/scheme/post-matric-scholarship' },
  a3: { label: 'See what changed', href: '/updates' },
  a4: { label: 'Renew document', href: '/documents' },
  a5: { label: 'Track application', href: '/applications' },
  a6: { label: 'Complete details', href: '/scheme/pm-fasal-bima' },
  a7: { label: 'View scheme', href: '/explore' },
}

export function AlertsClient() {
  const [items, setItems] = useState<Alert[]>(seedAlerts)
  const [filter, setFilter] = useState<FilterKey>('all')

  const unread = items.filter((a) => a.unread).length

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length }
    ;(Object.keys(typeMeta) as (keyof typeof typeMeta)[]).forEach((k) => {
      c[k] = items.filter((a) => a.type === k).length
    })
    return c
  }, [items])

  const shown = useMemo(
    () => (filter === 'all' ? items : items.filter((a) => a.type === filter)),
    [items, filter],
  )

  const markAllRead = () => setItems((prev) => prev.map((a) => ({ ...a, unread: false })))
  const toggleRead = (id: string) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, unread: !a.unread } : a)))

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-9 px-4 py-8 sm:px-6 lg:py-12">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Alerts
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
          Schemes change quietly. You should not have to notice on your own.
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Sarthi re-reads official notifications every night. When a rule, deadline or
          document requirement moves against you, it says so — and tells you what to do.
        </p>
      </header>

      {/* ------------------------------------------------------- act now band */}
      <section className="flex flex-col gap-4 rounded-2xl bg-primary p-5 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/12">
            <BellRing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">
              {unread > 0 ? `${unread} alerts need your attention` : 'You are all caught up'}
            </h2>
            <p className="text-sm leading-relaxed opacity-80">
              {unread > 0
                ? 'The most urgent one closes in five days and your documents are already valid.'
                : 'We will notify you the moment an official notification affects you.'}
            </p>
          </div>
        </div>
        {unread > 0 && (
          <Button
            variant="secondary"
            className="shrink-0 gap-1.5"
            onClick={markAllRead}
          >
            <CheckCheck className="size-4" aria-hidden="true" />
            Mark all read
          </Button>
        )}
      </section>

      {/* --------------------------------------------------------------- feed */}
      <section>
        <SectionTitle>Your feed</SectionTitle>

        <div
          role="group"
          aria-label="Filter alerts by type"
          className="mb-5 flex flex-wrap gap-1.5"
        >
          {(['all', ...(Object.keys(typeMeta) as (keyof typeof typeMeta)[])] as FilterKey[]).map(
            (k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                aria-pressed={filter === k}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors',
                  filter === k
                    ? 'bg-foreground text-background ring-foreground'
                    : 'bg-card text-muted-foreground ring-foreground/12 hover:text-foreground',
                )}
              >
                {k === 'all' ? 'Everything' : typeMeta[k].label}
                <span className="ml-1.5 tabular-nums opacity-60">{counts[k]}</span>
              </button>
            ),
          )}
        </div>

        <ul className="flex flex-col gap-3">
          {shown.map((a) => {
            const meta = typeMeta[a.type]
            const Icon = meta.icon
            const action = alertAction[a.id]
            const scheme = schemes.find((s) => s.name === a.scheme)

            return (
              <li
                key={a.id}
                className={cn(
                  'flex gap-4 rounded-xl p-4 ring-1 transition-colors sm:p-5',
                  a.unread ? cn('bg-card', meta.ring) : 'bg-card/50 ring-foreground/8',
                )}
              >
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg',
                    a.unread ? meta.tint : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3
                      className={cn(
                        'text-pretty',
                        a.unread ? 'font-semibold' : 'font-medium text-muted-foreground',
                      )}
                    >
                      {a.title}
                    </h3>
                    {a.unread && (
                      <span className="sr-only">Unread</span>
                    )}
                    {a.unread && (
                      <span
                        className="size-1.5 shrink-0 rounded-full bg-saffron"
                        aria-hidden="true"
                      />
                    )}
                    <span className="ml-auto shrink-0 font-mono text-[0.6875rem] text-muted-foreground">
                      {a.time}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">{a.body}</p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-0.5">
                    {scheme ? (
                      <Link
                        href={`/scheme/${scheme.id}`}
                        className="text-xs font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-2 hover:text-foreground"
                      >
                        {a.scheme}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">{a.scheme}</span>
                    )}
                    <span className="ml-auto flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => toggleRead(a.id)}
                      >
                        {a.unread ? 'Mark read' : 'Mark unread'}
                      </Button>
                      {action && (
                        <Button
                          size="sm"
                          variant={a.unread ? 'default' : 'outline'}
                          className="h-7 gap-1 px-2.5 text-xs"
                          render={<Link href={action.href} />}
                        >
                          {action.label}
                          <ArrowRight className="size-3" aria-hidden="true" />
                        </Button>
                      )}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Alerts are generated from official gazette notifications and departmental circulars.
        {' '}
        <Link href="/trust" className="underline underline-offset-2 hover:text-foreground">
          See our sources
        </Link>
        .
      </p>
    </div>
  )
}
