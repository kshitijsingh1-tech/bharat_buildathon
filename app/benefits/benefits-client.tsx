'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarClock,
  CircleAlert,
  FileText,
  Layers,
  MessageCircle,
  TrendingUp,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SchemeCard, SectionTitle, StatusPill } from '@/components/sarthi-ui'
import { PageHeader } from '@/components/site-nav'
import {
  benefitsSummary,
  categoryBreakdown,
  citizen,
  family,
  schemes,
} from '@/lib/data'
import { cn } from '@/lib/utils'

export function BenefitsClient() {
  const [member, setMember] = useState('me')
  const active = family.find((f) => f.id === member) ?? family[2]
  const isMe = active.id === 'me'

  const eligible = useMemo(
    () => schemes.filter((s) => s.status === 'eligible' || s.status === 'likely'),
    [],
  )
  const blocked = useMemo(
    () => schemes.filter((s) => s.status === 'missing-info'),
    [],
  )
  const urgent = useMemo(
    () =>
      schemes
        .filter(
          (s) =>
            s.deadlineDays !== null &&
            s.deadlineDays <= 30 &&
            s.status !== 'not-eligible',
        )
        .sort((a, b) => (a.deadlineDays ?? 0) - (b.deadlineDays ?? 0)),
    [],
  )

  const tiles = [
    {
      label: 'Schemes you could claim',
      value: active.potential,
      icon: Layers,
      tone: 'text-foreground',
      hint: 'Matched to your profile',
    },
    {
      label: 'Eligible right now',
      value: active.eligible,
      icon: TrendingUp,
      tone: 'text-success',
      hint: 'All rules already met',
    },
    {
      label: 'Waiting on documents',
      value: isMe ? benefitsSummary.needDocuments : active.missingDocs,
      icon: FileText,
      tone: 'text-warning',
      hint: 'Upload to unlock',
    },
    {
      label: 'Need a detail from you',
      value: isMe ? benefitsSummary.needInfo : 2,
      icon: CircleAlert,
      tone: 'text-info',
      hint: 'One question each',
    },
  ]

  const maxTotal = Math.max(...categoryBreakdown.map((c) => c.total))

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="My benefits"
        title={`Everything ${isMe ? 'you' : active.name.split(' ')[0]} could be receiving`}
        description="One view across every central and state scheme matched to the profile — what is claimable now, what is blocked, and what closes soon."
        actions={
          <Button variant="outline" render={<Link href="/explore" />}>
            Browse all schemes
          </Button>
        }
      />

      {/* --------------------------------------------------- family switch */}
      <div>
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
          <Users className="size-3.5" />
          Viewing benefits for
        </p>
        <div className="flex flex-wrap gap-2">
          {family.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setMember(f.id)}
              aria-pressed={f.id === member}
              className={cn(
                'flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-left transition-colors',
                f.id === member
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-foreground hover:bg-saffron-soft hover:text-accent-foreground',
              )}
            >
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                  f.id === member
                    ? 'bg-background/15 text-background'
                    : 'bg-card text-foreground',
                )}
              >
                {f.initials}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">{f.relation}</span>
                <span
                  className={cn(
                    'text-[11px]',
                    f.id === member
                      ? 'text-background/70'
                      : 'text-muted-foreground',
                  )}
                >
                  {f.eligible} eligible
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------- tiles */}
      <section aria-label="Benefit summary">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <div
              key={t.label}
              className="flex flex-col gap-1 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <t.icon className={cn('size-4', t.tone)} />
              <dd
                className={cn(
                  'mt-1 text-3xl font-semibold tabular-nums',
                  t.tone,
                )}
              >
                {t.value}
              </dd>
              <dt className="text-sm font-medium">{t.label}</dt>
              <p className="text-xs text-muted-foreground">{t.hint}</p>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------------- profile */}
      <Card className="bg-saffron-soft/50">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
              {active.initials}
            </span>
            <div>
              <p className="font-semibold text-accent-foreground">
                {active.name}
              </p>
              <p className="text-sm text-accent-foreground/75">
                {active.age} years · {active.occupation} · {active.state}
                {isMe && ` · income ${citizen.income}`}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            render={<Link href="/chat?q=Update my profile details" />}
          >
            Update profile
          </Button>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------- priorities */}
      {urgent.length > 0 && (
        <section aria-labelledby="priorities">
          <SectionTitle>
            <span id="priorities">Do these first</span>
          </SectionTitle>
          <ul className="flex flex-col gap-2.5">
            {urgent.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center"
              >
                <span
                  className={cn(
                    'flex shrink-0 flex-col items-center justify-center rounded-lg px-3 py-2',
                    (s.deadlineDays ?? 0) <= 7
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-warning-soft text-warning',
                  )}
                >
                  <span className="text-xl leading-none font-semibold tabular-nums">
                    {s.deadlineDays}
                  </span>
                  <span className="text-[10px] font-medium tracking-wide uppercase">
                    days
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{s.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {s.benefit} · closes {s.deadlineLabel.replace('Closes ', '')}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusPill status={s.status} />
                  <Button
                    size="sm"
                    render={<Link href={`/apply/${s.id}`} />}
                  >
                    Start
                    <ArrowRight />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ------------------------------------------------------ breakdown */}
      <section aria-labelledby="breakdown">
        <SectionTitle>
          <span id="breakdown">Where your matches are</span>
        </SectionTitle>
        <Card>
          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3.5">
              {categoryBreakdown.map((c) => (
                <li key={c.name} className="flex items-center gap-4">
                  <span className="w-28 shrink-0 truncate text-sm font-medium">
                    {c.name}
                  </span>
                  <div
                    className="relative h-6 flex-1 overflow-hidden rounded-md bg-secondary"
                    role="img"
                    aria-label={`${c.name}: ${c.eligible} eligible of ${c.total} matched schemes`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 rounded-md bg-saffron-soft"
                      style={{ width: `${(c.total / maxTotal) * 100}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-md bg-saffron"
                      style={{ width: `${(c.eligible / maxTotal) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right text-sm tabular-nums">
                    <span className="font-semibold">{c.eligible}</span>
                    <span className="text-muted-foreground"> / {c.total}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-saffron" aria-hidden="true" />
                Eligible now
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-sm bg-saffron-soft"
                  aria-hidden="true"
                />
                Matched, not yet eligible
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ------------------------------------------------------- eligible */}
      <section aria-labelledby="eligible-now">
        <SectionTitle
          action={
            <Badge variant="secondary" className="tabular-nums">
              {eligible.length} schemes
            </Badge>
          }
        >
          <span id="eligible-now">Ready to claim</span>
        </SectionTitle>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {eligible.map((s) => (
            <li key={s.id}>
              <SchemeCard scheme={s} />
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------------- blocked */}
      {blocked.length > 0 && (
        <section aria-labelledby="blocked">
          <SectionTitle>
            <span id="blocked">One answer away</span>
          </SectionTitle>
          <ul className="flex flex-col gap-2.5">
            {blocked.map((s) => {
              const missing = s.criteria.filter((c) => c.status === 'unknown')
              return (
                <li
                  key={s.id}
                  className="flex flex-col gap-3 rounded-xl bg-warning-soft/40 p-4 ring-1 ring-warning/20 sm:flex-row sm:items-center"
                >
                  <CircleAlert className="size-5 shrink-0 text-warning" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{s.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
                      Sarthi needs your{' '}
                      <span className="font-medium text-foreground">
                        {missing.map((c) => c.label.toLowerCase()).join(' and ')}
                      </span>{' '}
                      to finish this check · worth {s.benefit}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    render={
                      <Link href={`/chat?q=Complete my check for ${s.name}`} />
                    }
                  >
                    <MessageCircle />
                    Answer now
                  </Button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <Card className="bg-foreground text-background">
        <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 font-semibold">
              <CalendarClock className="size-4" />
              Sarthi is watching {benefitsSummary.potential} schemes for you
            </p>
            <p className="mt-1 text-sm text-background/75 text-pretty">
              If a rule changes or a deadline nears, you get told what changed
              and what it means — not a generic notification.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background"
            render={<Link href="/alerts" />}
          >
            Manage alerts
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
