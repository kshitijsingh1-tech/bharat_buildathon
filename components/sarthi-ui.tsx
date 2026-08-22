import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  CircleAlert,
  FileText,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { statusMeta, type Criterion, type EligibilityState, type Scheme } from '@/lib/data'

/* ---------------------------------------------------------------- status */

export function StatusPill({
  status,
  className,
}: {
  status: EligibilityState
  className?: string
}) {
  const meta = statusMeta[status]
  const Icon =
    status === 'not-eligible'
      ? X
      : status === 'missing-info'
        ? CircleAlert
        : Check
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        meta.className,
        className,
      )}
    >
      <Icon className="size-3.5" strokeWidth={2.75} aria-hidden="true" />
      {meta.label}
    </span>
  )
}

export function MatchScore({
  value,
  size = 'default',
}: {
  value: number
  size?: 'default' | 'lg'
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full bg-secondary',
          size === 'lg' ? 'h-2 w-24' : 'h-1.5 w-16',
        )}
        role="img"
        aria-label={`${value} percent profile match`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-saffron"
          style={{ width: `${value}%` }}
        />
      </div>
      <span
        className={cn(
          'font-semibold tabular-nums',
          size === 'lg' ? 'text-sm' : 'text-xs',
        )}
      >
        {value}%
      </span>
      <span className="text-xs text-muted-foreground">match</span>
    </div>
  )
}

export function DeadlineBadge({
  days,
  label,
}: {
  days: number | null
  label: string
}) {
  if (days === null) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <CalendarClock className="size-3.5" />
        {label}
      </span>
    )
  }
  const urgent = days <= 7
  const soon = days <= 20
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold',
        urgent
          ? 'bg-destructive/8 text-destructive'
          : soon
            ? 'bg-warning-soft text-warning'
            : 'bg-secondary text-muted-foreground',
      )}
    >
      <CalendarClock className="size-3.5" />
      {days} days left
    </span>
  )
}

export function TrustBadge({
  verified,
  className,
}: {
  verified: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-success',
        className,
      )}
    >
      <ShieldCheck className="size-3" />
      Official source · verified {verified}
    </span>
  )
}

/* ----------------------------------------------------------- scheme card */

export function SchemeCard({
  scheme,
  compact = false,
}: {
  scheme: Scheme
  compact?: boolean
}) {
  return (
    <Card className="group/scheme h-full transition-all hover:ring-foreground/20 hover:shadow-sm">
      <CardContent className="flex h-full flex-col gap-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="text-[0.6875rem]">
                {scheme.level}
              </Badge>
              <Badge variant="secondary" className="text-[0.6875rem]">
                {scheme.category}
              </Badge>
              <span className="inline-flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
                <MapPin className="size-3" />
                {scheme.state}
              </span>
            </div>
            <h3 className="text-[0.9375rem] leading-snug font-semibold text-pretty">
              <Link
                href={`/scheme/${scheme.id}`}
                className="hover:text-saffron focus-visible:outline-none focus-visible:underline"
              >
                {scheme.name}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {scheme.department}
            </p>
          </div>
          <StatusPill status={scheme.status} className="shrink-0" />
        </div>

        <div className="flex items-baseline gap-2 rounded-lg bg-saffron-soft px-3 py-2">
          <span className="text-lg font-semibold text-accent-foreground tabular-nums">
            {scheme.benefit}
          </span>
          {!compact && (
            <span className="truncate text-xs text-accent-foreground/75">
              {scheme.benefitDetail}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <MatchScore value={scheme.match} />
          <DeadlineBadge days={scheme.deadlineDays} label={scheme.deadlineLabel} />
        </div>

        {!compact && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <FileText className="size-3" />
              {scheme.documents.length} documents
            </span>
            <span className="inline-flex items-center gap-1">
              <BadgeCheck className="size-3 text-success" />
              Verified {scheme.lastVerified}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-0.5">
          <Button size="sm" render={<Link href={`/scheme/${scheme.id}`} />}>
            View details
          </Button>
          <Button
            size="sm"
            variant="outline"
            render={<Link href={`/eligibility?scheme=${scheme.id}`} />}
          >
            Check eligibility
          </Button>
          <Button
            size="sm"
            variant="ghost"
            render={<Link href={`/documents?scheme=${scheme.id}`} />}
          >
            Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------- criterion rows */

export function EligibilityCriterion({ criterion }: { criterion: Criterion }) {
  const icon =
    criterion.status === 'pass' ? (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    ) : criterion.status === 'fail' ? (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <X className="size-3.5" strokeWidth={3} />
      </span>
    ) : (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning">
        <CircleAlert className="size-3.5" strokeWidth={2.5} />
      </span>
    )

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-3.5 sm:p-4',
        criterion.status === 'fail'
          ? 'border-destructive/25 bg-destructive/4'
          : criterion.status === 'unknown'
            ? 'border-warning/25 bg-warning-soft/40'
            : 'border-border bg-card',
      )}
    >
      {icon}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm font-semibold">{criterion.label}</p>
          <p className="text-xs text-muted-foreground">
            Requirement: <span className="font-medium text-foreground">{criterion.requirement}</span>
          </p>
        </div>
        <p className="mt-1 text-sm">
          <span className="text-muted-foreground">Your value: </span>
          <span
            className={cn(
              'font-semibold',
              criterion.status === 'fail' && 'text-destructive',
              criterion.status === 'unknown' && 'text-warning',
            )}
          >
            {criterion.userValue}
          </span>
        </p>
        <details className="group mt-2">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-md text-xs font-semibold text-info hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
            Why this rule?
            <ArrowRight className="size-3 transition-transform group-open:rotate-90" />
          </summary>
          <div className="mt-2 rounded-lg bg-secondary/70 p-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {criterion.why}
            </p>
            <SourceCitation
              source={criterion.source}
              page={criterion.page}
              className="mt-2"
            />
          </div>
        </details>
      </div>
    </div>
  )
}

/* -------------------------------------------------------- source citation */

export function SourceCitation({
  source,
  page,
  verified = '20 Aug 2026',
  className,
}: {
  source: string
  page: string
  verified?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] text-muted-foreground',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1 font-semibold text-success">
        <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
        Official source
      </span>
      <span aria-hidden="true">·</span>
      <span className="font-medium text-foreground">{source}</span>
      <span aria-hidden="true">·</span>
      <span>{page}</span>
      <span aria-hidden="true">·</span>
      <span>Verified {verified}</span>
    </div>
  )
}

/* ---------------------------------------------------------------- metrics */

export function StatTile({
  label,
  value,
  hint,
  tone = 'neutral',
}: {
  label: string
  value: string | number
  hint?: string
  tone?: 'neutral' | 'success' | 'warning' | 'info' | 'saffron'
}) {
  const tones = {
    neutral: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
    saffron: 'text-saffron',
  } as const
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={cn('text-2xl font-semibold tabular-nums', tones[tone])}>
        {value}
      </p>
      {hint && <p className="text-[0.6875rem] text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="text-lg font-semibold text-balance sm:text-xl">{children}</h2>
      {action}
    </div>
  )
}
