'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  CircleAlert,
  FileText,
  MessageCircle,
  RotateCcw,
  ScrollText,
  Sparkles,
  X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import {
  DeadlineBadge,
  EligibilityCriterion,
  MatchScore,
  SectionTitle,
  SourceCitation,
  StatusPill,
  TrustBadge,
} from '@/components/sarthi-ui'
import { PageHeader } from '@/components/site-nav'
import { citizen, schemes, type Scheme } from '@/lib/data'
import { cn } from '@/lib/utils'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

export function EligibilityClient({ schemeId }: { schemeId?: string }) {
  const initial =
    schemes.find((s) => s.id === schemeId) ??
    schemes.find((s) => s.status === 'not-eligible') ??
    schemes[0]

  const [active, setActive] = useState<Scheme>(initial)
  const [income, setIncome] = useState(citizen.incomeValue)
  const [age, setAge] = useState(citizen.age)

  const changed = income !== citizen.incomeValue || age !== citizen.age

  /* Recompute the criteria that depend on the simulated values. */
  const simulated = useMemo(() => {
    return active.criteria.map((c) => {
      const label = c.label.toLowerCase()

      if (label.includes('income')) {
        const cap = Number(c.requirement.replace(/[^\d]/g, ''))
        if (!cap) return c
        const pass = income <= cap
        return {
          ...c,
          userValue: inr(income),
          status: (pass ? 'pass' : 'fail') as typeof c.status,
        }
      }

      if (label === 'age') {
        const bounds = c.requirement.match(/\d+/g)?.map(Number) ?? []
        const [min, max] = [bounds[0] ?? 0, bounds[1] ?? 200]
        const pass = age >= min && age <= max
        return {
          ...c,
          userValue: `${age} years`,
          status: (pass ? 'pass' : 'fail') as typeof c.status,
        }
      }

      return c
    })
  }, [active, income, age])

  const failed = simulated.filter((c) => c.status === 'fail')
  const unknown = simulated.filter((c) => c.status === 'unknown')
  const passed = simulated.filter((c) => c.status === 'pass')

  const verdict =
    failed.length > 0
      ? ('not-eligible' as const)
      : unknown.length > 0
        ? ('missing-info' as const)
        : ('eligible' as const)

  const blockers = failed.map((c) => c.label.toLowerCase())

  const reset = () => {
    setIncome(citizen.incomeValue)
    setAge(citizen.age)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Explainable eligibility"
        title="Every decision, traced to the rule behind it"
        description="Sarthi never says just yes or no. Each rule shows your value, the requirement, the reason it exists, and the clause it came from."
        actions={
          <Button
            variant="outline"
            render={<Link href={`/scheme/${active.id}`} />}
          >
            View scheme page
          </Button>
        }
      />

      {/* -------------------------------------------------- scheme selector */}
      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
          Checking eligibility for
        </p>
        <div className="flex flex-wrap gap-2">
          {schemes.slice(0, 6).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActive(s)
                reset()
              }}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                s.id === active.id
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-foreground hover:bg-saffron-soft hover:text-accent-foreground',
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------- verdict */}
      <Card
        className={cn(
          'ring-2',
          verdict === 'eligible'
            ? 'bg-success-soft/50 ring-success/25'
            : verdict === 'not-eligible'
              ? 'bg-destructive/4 ring-destructive/20'
              : 'bg-warning-soft/40 ring-warning/25',
        )}
      >
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusPill status={verdict} />
                {changed && (
                  <Badge variant="outline" className="gap-1 border-dashed">
                    <Sparkles className="size-3" />
                    Simulated result
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-semibold text-balance">
                {active.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {active.department}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">
                Benefit if eligible
              </p>
              <p className="text-xl font-semibold text-accent-foreground">
                {active.benefit}
              </p>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-relaxed text-pretty">
            {verdict === 'eligible' ? (
              <>
                You meet all{' '}
                <span className="font-semibold">{passed.length} rules</span> for
                this scheme. Nothing is blocking your application.
              </>
            ) : verdict === 'not-eligible' ? (
              <>
                You meet{' '}
                <span className="font-semibold">
                  {passed.length} of {simulated.length} rules
                </span>
                . The only thing standing between you and this benefit is{' '}
                <span className="font-semibold text-destructive">
                  {blockers.join(' and ')}
                </span>
                .
              </>
            ) : (
              <>
                You meet{' '}
                <span className="font-semibold">{passed.length} rules</span>, but{' '}
                <span className="font-semibold text-warning">
                  {unknown.length}{' '}
                  {unknown.length === 1 ? 'detail is' : 'details are'} missing
                </span>{' '}
                before Sarthi can give you a final answer.
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <MatchScore value={active.match} />
            <DeadlineBadge
              days={active.deadlineDays}
              label={active.deadlineLabel}
            />
            <TrustBadge verified={active.lastVerified} />
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button
              render={
                <Link href={`/chat?q=Why am I ${verdict === 'eligible' ? 'eligible' : 'not eligible'} for ${active.name}?`} />
              }
            >
              <MessageCircle />
              Ask why in plain language
            </Button>
            <Button
              variant="outline"
              render={<Link href={`/documents?scheme=${active.id}`} />}
            >
              <FileText />
              Check my documents
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------- rule ledger */}
      <section aria-labelledby="rules">
        <SectionTitle>
          <span id="rules">The rules, one by one</span>
        </SectionTitle>

        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Check,
              label: 'Rules met',
              value: passed.length,
              tone: 'text-success',
              bg: 'bg-success-soft/60',
            },
            {
              icon: X,
              label: 'Rules not met',
              value: failed.length,
              tone: 'text-destructive',
              bg: 'bg-destructive/6',
            },
            {
              icon: CircleAlert,
              label: 'Need your input',
              value: unknown.length,
              tone: 'text-warning',
              bg: 'bg-warning-soft/60',
            },
          ].map((t) => (
            <div
              key={t.label}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3.5',
                t.bg,
              )}
            >
              <t.icon className={cn('size-5 shrink-0', t.tone)} strokeWidth={2.5} />
              <div>
                <p className={cn('text-2xl font-semibold tabular-nums', t.tone)}>
                  {t.value}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {t.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ul className="flex flex-col gap-3">
          {simulated.map((c) => (
            <li key={c.label}>
              <EligibilityCriterion criterion={c} />
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------ what-if */}
      <section aria-labelledby="whatif">
        <SectionTitle
          action={
            changed && (
              <Button size="sm" variant="ghost" onClick={reset}>
                <RotateCcw />
                Reset to my profile
              </Button>
            )
          }
        >
          <span id="whatif">What if something changed?</span>
        </SectionTitle>

        <Card>
          <CardContent className="flex flex-col gap-6">
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
              Move a value to see how the decision would change. This is a
              simulation only — it does not alter your profile or any
              application.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="income-sim" className="text-sm">
                    Annual household income
                  </Label>
                  <span
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      income !== citizen.incomeValue && 'text-saffron',
                    )}
                  >
                    {inr(income)}
                  </span>
                </div>
                <Slider
                  id="income-sim"
                  value={income}
                  onValueChange={(v) => setIncome(v as number)}
                  min={0}
                  max={600000}
                  step={10000}
                />
                <p className="text-xs text-muted-foreground">
                  Your profile: {inr(citizen.incomeValue)}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="age-sim" className="text-sm">
                    Age
                  </Label>
                  <span
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      age !== citizen.age && 'text-saffron',
                    )}
                  >
                    {age} years
                  </span>
                </div>
                <Slider
                  id="age-sim"
                  value={age}
                  onValueChange={(v) => setAge(v as number)}
                  min={14}
                  max={85}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Your profile: {citizen.age} years
                </p>
              </div>
            </div>

            {changed && (
              <div className="flex items-start gap-3 rounded-xl bg-saffron-soft/70 p-4">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-saffron" />
                <div>
                  <p className="text-sm font-semibold text-accent-foreground">
                    With these values you would be{' '}
                    {verdict === 'eligible'
                      ? 'eligible'
                      : verdict === 'not-eligible'
                        ? 'not eligible'
                        : 'awaiting more information'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-accent-foreground/80">
                    {verdict === 'eligible'
                      ? 'All rules pass at these values.'
                      : `Blocked by ${blockers.join(' and ') || 'missing information'}.`}{' '}
                    Your real profile is unchanged.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ------------------------------------------------------ next steps */}
      {(failed.length > 0 || unknown.length > 0) && (
        <section aria-labelledby="next">
          <SectionTitle>
            <span id="next">What you can do about it</span>
          </SectionTitle>
          <ul className="flex flex-col gap-2.5">
            {[...failed, ...unknown].map((c, i) => (
              <li
                key={c.label}
                className="flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold tabular-nums">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {c.status === 'fail'
                      ? `Your ${c.label.toLowerCase()} does not meet ${c.requirement}`
                      : `Tell Sarthi your ${c.label.toLowerCase()}`}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {c.status === 'fail'
                      ? 'This rule is set by the department and cannot be waived. Sarthi can show you similar schemes with a higher threshold.'
                      : 'Once you provide this detail, Sarthi completes the check immediately.'}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={c.status === 'fail' ? 'outline' : 'default'}
                      render={
                        <Link
                          href={
                            c.status === 'fail'
                              ? '/explore'
                              : `/chat?q=My ${c.label.toLowerCase()} for ${active.name}`
                          }
                        />
                      }
                    >
                      {c.status === 'fail'
                        ? 'Find similar schemes'
                        : 'Provide this detail'}
                      <ArrowRight />
                    </Button>
                  </div>
                  <SourceCitation
                    source={c.source}
                    page={c.page}
                    verified={active.lastVerified}
                    className="mt-3"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Card className="border-dashed bg-transparent">
        <CardContent className="flex items-start gap-3">
          <ScrollText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
            Sarthi explains the rules published by the department. It is not the
            deciding authority — the final decision always rests with the
            issuing department, and you should confirm on the official portal
            before applying.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
