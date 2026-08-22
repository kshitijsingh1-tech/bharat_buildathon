import Link from 'next/link'
import {
  Accessibility,
  ArrowRight,
  Baby,
  Briefcase,
  FileCheck2,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Home as HomeIcon,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  UserRound,
} from 'lucide-react'

import { AppFooter, SiteNav } from '@/components/site-nav'
import { NeedSearch } from '@/components/need-search'
import { SchemeCard, SectionTitle, SourceCitation } from '@/components/sarthi-ui'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { categories, citizen, schemes } from '@/lib/data'

const categoryIcons: Record<string, typeof GraduationCap> = {
  Education: GraduationCap,
  Agriculture: Sprout,
  Employment: Briefcase,
  Healthcare: HeartPulse,
  Housing: HomeIcon,
  'Women & Child': Baby,
  'Senior Citizens': UserRound,
  Business: Store,
  'Social Welfare': HandHeart,
  Disability: Accessibility,
}

const pillars = [
  {
    n: '01',
    title: 'Discover',
    body: 'Find schemes relevant to your life and needs — not a list of 400 PDFs.',
    icon: Sparkles,
  },
  {
    n: '02',
    title: 'Understand',
    body: 'See exactly why you qualify or don\u2019t qualify, rule by rule.',
    icon: ScrollText,
  },
  {
    n: '03',
    title: 'Prepare',
    body: 'Get your documents ready and know precisely what to do next.',
    icon: FileCheck2,
  },
]

export default function HomePage() {
  const featured = schemes.slice(0, 3)

  return (
    <div className="flex min-h-svh flex-col">
      <SiteNav />

      <main id="main" className="flex-1 pb-28 md:pb-0">
        {/* hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="mx-auto w-full max-w-[1400px] px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20">
            <div className="mx-auto max-w-3xl text-center">
              <Badge
                variant="outline"
                className="mb-6 h-7 gap-1.5 bg-card px-3 text-xs"
              >
                <span
                  className="size-1.5 rounded-full bg-success"
                  aria-hidden="true"
                />
                428 schemes tracked · last verified 20 Aug 2026
              </Badge>
              <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Government schemes,{' '}
                <span className="text-saffron">explained for YOU.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                Tell Sarthi about your needs. We&apos;ll find relevant schemes,
                check your eligibility, explain why, and guide you through the
                next step.
              </p>
            </div>

            <div className="mx-auto mt-9 max-w-2xl">
              <NeedSearch />
            </div>

            <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="h-11 w-full px-5 text-[0.9375rem] sm:w-auto"
                render={<Link href="/benefits" />}
              >
                Find Schemes for Me
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 w-full px-5 text-[0.9375rem] sm:w-auto"
                render={<Link href="/chat" />}
              >
                <Sparkles className="size-4" />
                Ask Sarthi
              </Button>
            </div>
          </div>
        </section>

        {/* explore by need */}
        <section className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 sm:py-16">
          <SectionTitle
            action={
              <Button size="sm" variant="ghost" render={<Link href="/explore" />}>
                All schemes
                <ArrowRight className="size-3.5" />
              </Button>
            }
          >
            Or explore by need
          </SectionTitle>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.name] ?? Sparkles
              return (
                <li key={cat.name}>
                  <Link
                    href={`/explore?category=${encodeURIComponent(cat.name)}`}
                    className="group flex h-full min-h-28 flex-col justify-between gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:ring-saffron/45 hover:shadow-sm"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-saffron-soft text-accent-foreground transition-colors group-hover:bg-saffron group-hover:text-primary-foreground">
                      <Icon className="size-4.5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        {cat.name}
                      </span>
                      <span className="block text-xs text-muted-foreground tabular-nums">
                        {cat.count} schemes
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {/* how Sarthi helps */}
        <section className="border-y border-border bg-card/50">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 sm:py-16">
            <SectionTitle>How Sarthi helps</SectionTitle>
            <ul className="grid gap-4 md:grid-cols-3">
              {pillars.map((p) => {
                const Icon = p.icon
                return (
                  <li key={p.n}>
                    <Card className="h-full">
                      <CardContent className="flex h-full flex-col gap-4 py-2">
                        <div className="flex items-center justify-between">
                          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Icon className="size-5" />
                          </span>
                          <span className="text-2xl font-semibold text-border tabular-nums">
                            {p.n}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{p.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                            {p.body}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* built around you */}
        <section className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            <div>
              <SectionTitle>Built around you</SectionTitle>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
                Sarthi matches schemes against a structured profile you control.
                Nothing is guessed — every match is evaluated against
                deterministic eligibility rules.
              </p>

              <Card className="mt-5 max-w-md">
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {citizen.initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{citizen.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Sample citizen profile
                      </p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
                    {[
                      ['Age', `${citizen.age}`],
                      ['State', citizen.state],
                      ['Occupation', citizen.occupation],
                      ['Annual income', citizen.income],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-muted-foreground">{k}</dt>
                        <dd className="mt-0.5 text-sm font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <Button
                    className="w-full"
                    size="lg"
                    render={<Link href="/benefits" />}
                  >
                    See my potential benefits
                    <ArrowRight className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              <SectionTitle
                action={
                  <Button
                    size="sm"
                    variant="ghost"
                    render={<Link href="/explore" />}
                  >
                    View all
                    <ArrowRight className="size-3.5" />
                  </Button>
                }
              >
                Top matches for this profile
              </SectionTitle>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {featured.map((s) => (
                  <li key={s.id}>
                    <SchemeCard scheme={s} compact />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* trust */}
        <section className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                  <ShieldCheck className="size-3.5" />
                  Trust by design
                </span>
                <h2 className="mt-5 text-2xl font-semibold text-balance sm:text-3xl lg:text-4xl">
                  Government information you can verify.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-primary-foreground/75 text-pretty sm:text-base">
                  Every important answer is grounded in a source. Sarthi does not
                  treat AI-generated information as the source of truth — a rule
                  engine evaluates the criteria, and the AI only explains the
                  result.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    render={<Link href="/trust" />}
                  >
                    How verification works
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    render={<Link href="/updates" />}
                  >
                    See recent rule changes
                  </Button>
                </div>
              </div>

              <Card className="bg-card text-card-foreground">
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
                    <p className="text-sm font-semibold">
                      Income must be below ₹3,00,000
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-success">
                      <span
                        className="size-1.5 rounded-full bg-success"
                        aria-hidden="true"
                      />
                      Verified
                    </span>
                  </div>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {[
                      ['Official source', 'Department of Agriculture, Punjab'],
                      ['Source document', 'Equipment Subsidy Guidelines 2026'],
                      ['Eligibility rule', 'annual_income ≤ 300000'],
                      ['Last verified', '20 August 2026'],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-lg bg-secondary/70 px-3 py-2.5"
                      >
                        <dt className="text-[0.6875rem] font-medium text-muted-foreground">
                          {k}
                        </dt>
                        <dd className="mt-0.5 text-[0.8125rem] font-semibold text-pretty">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <SourceCitation
                    source="Equipment Subsidy Guidelines 2026"
                    page="Page 4, Clause 5.1"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      render={<Link href="/trust" />}
                    >
                      View original source
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      render={<Link href="/conflicts" />}
                    >
                      Report incorrect information
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
      <div className="h-16 md:hidden" aria-hidden="true" />
    </div>
  )
}
