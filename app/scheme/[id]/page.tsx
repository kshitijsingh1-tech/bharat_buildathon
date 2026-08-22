import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarClock,
  CircleCheck,
  Clock,
  ExternalLink,
  FileText,
  IndianRupee,
  MapPin,
  MessageCircle,
  Timer,
  Upload,
  UserRound,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  DeadlineBadge,
  EligibilityCriterion,
  MatchScore,
  SchemeCard,
  SectionTitle,
  SourceCitation,
  StatusPill,
  TrustBadge,
} from '@/components/sarthi-ui'
import { AppShell } from '@/components/site-nav'
import { documents, schemeById, schemes } from '@/lib/data'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return schemes.map((s) => ({ id: s.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const scheme = schemeById(id)
  if (!scheme) return { title: 'Scheme not found' }
  return { title: scheme.name, description: scheme.summary }
}

const docStatusMeta = {
  valid: { label: 'Verified', className: 'text-success', dot: 'bg-success' },
  expiring: { label: 'Renew soon', className: 'text-warning', dot: 'bg-warning' },
  missing: { label: 'Missing', className: 'text-destructive', dot: 'bg-destructive' },
} as const

export default async function SchemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const scheme = schemeById(id)
  if (!scheme) notFound()

  const passed = scheme.criteria.filter((c) => c.status === 'pass').length
  const unknown = scheme.criteria.filter((c) => c.status === 'unknown').length
  const failed = scheme.criteria.filter((c) => c.status === 'fail').length

  const related = schemes
    .filter((s) => s.id !== scheme.id && s.category === scheme.category)
    .slice(0, 2)

  const requiredDocs = scheme.documents.map((label) => {
    const match = documents.find(
      (d) =>
        d.name.toLowerCase().includes(label.toLowerCase()) ||
        label.toLowerCase().includes(d.name.split(' ')[0].toLowerCase()),
    )
    return { label, doc: match }
  })

  const facts = [
    { icon: IndianRupee, label: 'Income limit', value: scheme.incomeLimit },
    { icon: UserRound, label: 'Age range', value: scheme.ageRange },
    { icon: MapPin, label: 'Applies in', value: scheme.state },
    { icon: Upload, label: 'How to apply', value: scheme.applicationMode },
    { icon: Timer, label: 'Processing time', value: scheme.processingTime },
    { icon: CalendarClock, label: 'Window', value: scheme.deadlineLabel },
  ]

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <Link
          href="/explore"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to all schemes
        </Link>

        {/* ------------------------------------------------------------ hero */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{scheme.level}</Badge>
              <Badge variant="secondary">{scheme.category}</Badge>
              <TrustBadge verified={scheme.lastVerified} />
            </div>
            <h1 className="text-2xl leading-tight font-semibold text-balance sm:text-3xl">
              {scheme.name}
            </h1>
            <p className="text-hi mt-1.5 text-base text-muted-foreground">
              {scheme.nameHi}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="size-4 shrink-0" />
              {scheme.department}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-pretty">
              {scheme.summary}
            </p>
          </div>

          <Card className="w-full lg:w-80 lg:shrink-0">
            <CardContent className="flex flex-col gap-4">
              <StatusPill status={scheme.status} />
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  What you could receive
                </p>
                <p className="mt-1 text-2xl font-semibold text-accent-foreground">
                  {scheme.benefit}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {scheme.benefitDetail}
                </p>
              </div>
              <Separator />
              <MatchScore value={scheme.match} />
              <DeadlineBadge
                days={scheme.deadlineDays}
                label={scheme.deadlineLabel}
              />
              <div className="flex flex-col gap-2">
                <Button render={<Link href={`/eligibility?scheme=${scheme.id}`} />}>
                  <CircleCheck />
                  See why this decision
                </Button>
                <Button
                  variant="outline"
                  render={<Link href={`/apply/${scheme.id}`} />}
                >
                  Check application readiness
                </Button>
                <Button
                  variant="ghost"
                  render={<Link href={`/chat?q=Tell me about ${scheme.name}`} />}
                >
                  <MessageCircle />
                  Ask Sarthi about this
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ----------------------------------------------------- key facts */}
        <section aria-labelledby="facts">
          <SectionTitle>
            <span id="facts">Key facts</span>
          </SectionTitle>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
              >
                <f.icon className="mt-0.5 size-4 shrink-0 text-saffron" />
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-pretty">
                    {f.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------------- eligibility */}
        <section aria-labelledby="eligibility">
          <SectionTitle
            action={
              <Button
                size="sm"
                variant="outline"
                render={<Link href={`/eligibility?scheme=${scheme.id}`} />}
              >
                Full explanation
              </Button>
            }
          >
            <span id="eligibility">Why you got this result</span>
          </SectionTitle>

          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-secondary/60 px-4 py-3 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              <span className="font-semibold tabular-nums">{passed}</span>
              <span className="text-muted-foreground">rules met</span>
            </span>
            {failed > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-destructive" aria-hidden="true" />
                <span className="font-semibold tabular-nums">{failed}</span>
                <span className="text-muted-foreground">not met</span>
              </span>
            )}
            {unknown > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
                <span className="font-semibold tabular-nums">{unknown}</span>
                <span className="text-muted-foreground">need your input</span>
              </span>
            )}
          </div>

          <ul className="flex flex-col gap-3">
            {scheme.criteria.map((c) => (
              <li key={c.label}>
                <EligibilityCriterion criterion={c} />
              </li>
            ))}
          </ul>
        </section>

        {/* ----------------------------------------------------- documents */}
        <section aria-labelledby="documents">
          <SectionTitle
            action={
              <Button
                size="sm"
                variant="outline"
                render={<Link href="/documents" />}
              >
                Document Center
              </Button>
            }
          >
            <span id="documents">Documents you need</span>
          </SectionTitle>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {requiredDocs.map(({ label, doc }) => {
              const meta = doc ? docStatusMeta[doc.status] : null
              return (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-card p-3.5 ring-1 ring-foreground/10"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {doc ? doc.detail : 'Not yet in your Document Center'}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold',
                      meta ? meta.className : 'text-muted-foreground',
                    )}
                  >
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        meta ? meta.dot : 'bg-muted-foreground',
                      )}
                      aria-hidden="true"
                    />
                    {meta ? meta.label : 'Not added'}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* --------------------------------------------------------- source */}
        <section aria-labelledby="source">
          <SectionTitle>
            <span id="source">Where this information comes from</span>
          </SectionTitle>
          <Card>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                Every rule on this page is read from the official scheme
                document published by {scheme.department}. Sarthi does not
                interpret or estimate eligibility beyond what the document
                states.
              </p>
              <div className="flex flex-col gap-2.5">
                {[...new Set(scheme.criteria.map((c) => c.source))].map((src) => (
                  <div
                    key={src}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3.5 py-3"
                  >
                    <SourceCitation
                      source={src}
                      page={`${scheme.criteria.filter((c) => c.source === src).length} clauses cited`}
                      verified={scheme.lastVerified}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      render={<Link href="/trust" />}
                    >
                      <ExternalLink />
                      View document
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-border p-3.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Rules change. If this scheme is amended, Sarthi re-checks your
                  eligibility and tells you what changed — it will never quietly
                  update an answer you already relied on.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* -------------------------------------------------------- related */}
        {related.length > 0 && (
          <section aria-labelledby="related">
            <SectionTitle>
              <span id="related">Other {scheme.category.toLowerCase()} schemes</span>
            </SectionTitle>
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.map((s) => (
                <li key={s.id}>
                  <SchemeCard scheme={s} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <Card className="bg-saffron-soft/60">
          <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="flex items-center gap-2 font-semibold text-accent-foreground">
                <Banknote className="size-4" />
                Ready to move forward?
              </p>
              <p className="mt-1 text-sm text-accent-foreground/80">
                Sarthi will check your documents, flag gaps, and walk you
                through the official process step by step.
              </p>
            </div>
            <Button render={<Link href={`/apply/${scheme.id}`} />}>
              Start readiness check
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
