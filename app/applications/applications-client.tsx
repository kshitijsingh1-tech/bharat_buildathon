'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  CalendarClock,
  Check,
  Copy,
  FileText,
  Phone,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionTitle, StatTile } from '@/components/sarthi-ui'
import { cn } from '@/lib/utils'
import { applications, applicationStages, schemes, type Application } from '@/lib/data'

/** Extra narrative per application — what is happening and who to chase. */
const caseNotes: Record<
  string,
  { office: string; next: string; eta: string; helpline: string; blocked?: string }
> = {
  app1: {
    office: 'Block Agriculture Office, Ludhiana West',
    next: 'Field officer verifies your land record and equipment quote',
    eta: 'Expected by 5 Sep 2026',
    helpline: '0161-2401-885',
    blocked: 'Officer requested a clearer photograph of the equipment quotation.',
  },
  app2: {
    office: 'Directorate of Higher Education, Punjab',
    next: 'Amount is queued for release to your Aadhaar-linked account',
    eta: 'Credit expected within 9 days',
    helpline: '0172-2864-321',
  },
  app3: {
    office: 'National Skill Development Corporation',
    next: 'Nothing pending — certificate and stipend both released',
    eta: 'Closed 28 Jun 2026',
    helpline: '1800-123-9626',
  },
  app4: {
    office: 'State Health Agency, Punjab',
    next: 'Family details are being matched against the SECC database',
    eta: 'Expected by 12 Sep 2026',
    helpline: '14555',
  },
}

function stageTone(stage: number) {
  if (stage >= 5) return 'success'
  if (stage >= 3) return 'info'
  return 'saffron'
}

function StageRail({ stage }: { stage: number }) {
  return (
    <ol className="flex items-stretch gap-1" aria-label={`Stage ${stage} of ${applicationStages.length}`}>
      {applicationStages.map((label, i) => {
        const n = i + 1
        const done = n < stage
        const current = n === stage
        return (
          <li key={label} className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span
              className={cn(
                'h-1.5 rounded-full',
                done && 'bg-success',
                current && 'bg-saffron',
                !done && !current && 'bg-muted',
              )}
            />
            <span
              className={cn(
                'truncate text-[0.625rem] leading-tight',
                current
                  ? 'font-semibold text-foreground'
                  : done
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/60',
              )}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function ApplicationCard({ app }: { app: Application }) {
  const [copied, setCopied] = useState(false)
  const note = caseNotes[app.id]
  const scheme = schemes.find((s) => s.name === app.scheme)
  const done = app.stage >= applicationStages.length
  const tone = stageTone(app.stage)

  const copy = () => {
    navigator.clipboard?.writeText(app.applicationId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <li className="flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
      {/* header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="text-base font-semibold text-pretty">
            {scheme ? (
              <Link href={`/scheme/${scheme.id}`} className="hover:underline">
                {app.scheme}
              </Link>
            ) : (
              app.scheme
            )}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 font-mono transition-colors hover:text-foreground"
              aria-label={`Copy application ID ${app.applicationId}`}
            >
              {copied ? (
                <Check className="size-3 text-success" aria-hidden="true" />
              ) : (
                <Copy className="size-3" aria-hidden="true" />
              )}
              {app.applicationId}
            </button>
            <span aria-hidden="true">·</span>
            <span>Submitted {app.submitted}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium ring-1',
              tone === 'success' && 'bg-success/12 text-success ring-success/25',
              tone === 'info' && 'bg-info/10 text-info ring-info/25',
              tone === 'saffron' && 'bg-saffron/12 text-accent-foreground ring-saffron/30',
            )}
          >
            {app.status}
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums">{app.amount}</span>
        </div>
      </div>

      <StageRail stage={app.stage} />

      {/* blocked banner */}
      {note?.blocked && (
        <div className="flex items-start gap-2.5 rounded-lg bg-warning/10 px-3 py-2.5 ring-1 ring-warning/25">
          <TriangleAlert
            className="mt-0.5 size-4 shrink-0 text-warning-foreground"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-xs font-semibold text-warning-foreground">Action needed from you</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{note.blocked}</p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto shrink-0">
            Fix it
          </Button>
        </div>
      )}

      {/* case detail */}
      {note && (
        <dl className="grid gap-3 border-t border-foreground/8 pt-4 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">With</dt>
            <dd className="flex items-start gap-1.5 leading-snug">
              <Building2
                className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              {note.office}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">
              {done ? 'Outcome' : 'What happens next'}
            </dt>
            <dd className="leading-snug">{note.next}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">Timeline</dt>
            <dd className="flex items-start gap-1.5 leading-snug">
              <CalendarClock
                className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              {note.eta}
            </dd>
          </div>
        </dl>
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="gap-1.5">
          <FileText className="size-3.5" aria-hidden="true" />
          View submission
        </Button>
        <Button size="sm" variant="ghost" className="gap-1.5">
          <Phone className="size-3.5" aria-hidden="true" />
          {note?.helpline}
        </Button>
      </div>
    </li>
  )
}

export function ApplicationsClient() {
  const [tab, setTab] = useState<'active' | 'completed'>('active')

  const active = useMemo(
    () => applications.filter((a) => a.stage < applicationStages.length),
    [],
  )
  const completed = useMemo(
    () => applications.filter((a) => a.stage >= applicationStages.length),
    [],
  )
  const shown = tab === 'active' ? active : completed

  const received = '₹8,000'
  const inFlight = '₹85,000'

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 sm:px-6 lg:py-12">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          My Applications
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
          Every application, and who is holding it right now
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Government portals rarely tell you what stage you are at. Sarthi names the office,
          the next step and the person you can call.
        </p>
      </header>

      <section aria-label="Application summary" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Active applications" value={active.length} hint="Moving through stages" tone="saffron" />
        <StatTile label="Value in flight" value={inFlight} hint="Awaiting approval or payment" tone="info" />
        <StatTile label="Received to date" value={received} hint="Credited to your account" tone="success" />
        <StatTile label="Needs your action" value="1" hint="One officer query pending" tone="warning" />
      </section>

      <section>
        <SectionTitle
          action={
            <div role="group" aria-label="Filter applications" className="flex gap-1.5">
              {(['active', 'completed'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium capitalize ring-1 transition-colors',
                    tab === t
                      ? 'bg-foreground text-background ring-foreground'
                      : 'bg-card text-muted-foreground ring-foreground/12 hover:text-foreground',
                  )}
                >
                  {t}
                  <span className="ml-1.5 tabular-nums opacity-60">
                    {t === 'active' ? active.length : completed.length}
                  </span>
                </button>
              ))}
            </div>
          }
        >
          {tab === 'active' ? 'In progress' : 'Closed'}
        </SectionTitle>

        <ul className="flex flex-col gap-4">
          {shown.map((a) => (
            <ApplicationCard key={a.id} app={a} />
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold text-balance">
            Four more schemes are ready to submit
          </h2>
          <p className="text-sm leading-relaxed opacity-80">
            Your documents already satisfy them. The nearest deadline is in five days.
          </p>
        </div>
        <Button
          variant="secondary"
          className="shrink-0 gap-1.5"
          render={<Link href="/readiness" />}
        >
          Check readiness
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </section>
    </div>
  )
}
