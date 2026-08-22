import Link from 'next/link'
import {
  Accessibility,
  ArrowRight,
  Baby,
  Briefcase,
  CheckCircle2,
  Compass,
  FileCheck2,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Home as HomeIcon,
  Layers,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  TrendingUp,
  UserRound,
  Zap,
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
    body: 'See exactly why you qualify or don’t qualify, rule by rule.',
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
  const featured = schemes.slice(0, 4)

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteNav />

      <main id="main" className="flex-1 pb-28 md:pb-0">
        {/* Widescreen Immersive Hero */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card/60 via-background to-background">
          {/* Subtle Ambient Background Lighting */}
          <div className="pointer-events-none absolute -top-40 left-1/4 size-[500px] rounded-full bg-saffron/8 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 right-1/4 size-[500px] rounded-full bg-info/8 blur-[120px]" />

          <div className="mx-auto w-full max-w-[1800px] px-4 pt-10 pb-16 sm:px-8 lg:px-12 lg:pt-14 lg:pb-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              {/* Main Widescreen Content & Search Column */}
              <div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    variant="outline"
                    className="h-7 gap-1.5 bg-card/90 px-3 text-xs shadow-xs backdrop-blur-md"
                  >
                    <span
                      className="size-1.5 rounded-full bg-success animate-pulse"
                      aria-hidden="true"
                    />
                    428 schemes tracked · last verified 20 Aug 2026
                  </Badge>

                  <Badge
                    variant="secondary"
                    className="h-7 gap-1.5 text-xs text-muted-foreground"
                  >
                    <ShieldCheck className="size-3 text-saffron" />
                    Official Source Grounded
                  </Badge>
                </div>

                <h1 className="text-4xl leading-[1.06] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
                  Government schemes,{' '}
                  <span className="bg-gradient-to-r from-saffron to-amber-600 bg-clip-text text-transparent">
                    explained for YOU.
                  </span>
                </h1>

                <p className="max-w-3xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg lg:text-xl">
                  Tell Sarthi about your needs in natural language or voice. We&apos;ll find relevant schemes across Central & State departments, check your eligibility rule by rule, and guide your application.
                </p>

                {/* Full-width Widescreen Search Box */}
                <div className="mt-2 w-full max-w-4xl">
                  <NeedSearch />
                </div>

                {/* Quick Call-to-Actions */}
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="h-12 px-6 text-base font-semibold shadow-md shadow-primary/10 transition-all hover:scale-[1.01]"
                    render={<Link href="/benefits" />}
                  >
                    Find Schemes for Me
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 text-base font-medium transition-all hover:bg-secondary"
                    render={<Link href="/chat" />}
                  >
                    <Sparkles className="size-4 text-saffron" />
                    Ask Sarthi AI Copilot
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-12 px-5 text-base font-medium text-muted-foreground hover:text-foreground"
                    render={<Link href="/explore" />}
                  >
                    <Compass className="size-4" />
                    Browse Catalog
                  </Button>
                </div>
              </div>

              {/* Right Side Widescreen Live Copilot & Insights Panel */}
              <div className="lg:col-span-5 xl:col-span-4">
                <Card className="relative overflow-hidden border-border/80 bg-card/80 p-1 shadow-xl shadow-foreground/5 backdrop-blur-2xl transition-all hover:border-saffron/40">
                  <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-saffron via-amber-500 to-info" />
                  <CardContent className="flex flex-col gap-5 p-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-saffron-soft text-saffron">
                          <Sparkles className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Sarthi AI Copilot</p>
                          <p className="text-xs text-muted-foreground">Live Profile Matching Active</p>
                        </div>
                      </div>
                      <Badge className="bg-success-soft text-success border-none text-[0.7rem] font-semibold">
                        Ready
                      </Badge>
                    </div>

                    {/* Citizen Snapshot Quick Metrics */}
                    <div className="rounded-xl bg-secondary/60 p-4 ring-1 ring-border/50">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Active Citizen Profile</span>
                        <span className="font-semibold text-foreground">{citizen.name} ({citizen.initials})</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
                        <div>
                          <span className="block text-[0.7rem] uppercase tracking-wider text-muted-foreground">State / District</span>
                          <span className="text-sm font-semibold">{citizen.state}, {citizen.district}</span>
                        </div>
                        <div>
                          <span className="block text-[0.7rem] uppercase tracking-wider text-muted-foreground">Occupation</span>
                          <span className="text-sm font-semibold">{citizen.occupation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Insight Highlights */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 rounded-xl bg-card p-3.5 ring-1 ring-foreground/10">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <TrendingUp className="size-3.5 text-success" />
                          Matches Found
                        </div>
                        <span className="text-xl font-extrabold text-foreground tabular-nums">11 Schemes</span>
                      </div>
                      <div className="flex flex-col gap-1 rounded-xl bg-card p-3.5 ring-1 ring-foreground/10">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Zap className="size-3.5 text-saffron" />
                          Est. Annual Value
                        </div>
                        <span className="text-xl font-extrabold text-saffron tabular-nums">₹97,000</span>
                      </div>
                    </div>

                    {/* Quick Scheme Launcher Item */}
                    <div className="flex items-center justify-between rounded-xl bg-saffron-soft/40 p-3 ring-1 ring-saffron/30">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="size-4 text-saffron shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-foreground">Punjab Equipment Subsidy</p>
                          <p className="text-[0.7rem] text-muted-foreground">94% Match · Eligible · Closes in 18 days</p>
                        </div>
                      </div>
                      <Button size="xs" variant="default" className="shrink-0" render={<Link href="/scheme/punjab-farmer-equipment-subsidy" />}>
                        View Rule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Widescreen Explore by Need - 10 Column Full Width Grid */}
        <section className="mx-auto w-full max-w-[1800px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          <SectionTitle
            action={
              <Button size="sm" variant="ghost" className="gap-1 font-semibold" render={<Link href="/explore" />}>
                All schemes catalog
                <ArrowRight className="size-3.5" />
              </Button>
            }
          >
            Explore by category
          </SectionTitle>
          <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.name] ?? Sparkles
              return (
                <li key={cat.name}>
                  <Link
                    href={`/explore?category=${encodeURIComponent(cat.name)}`}
                    className="group flex h-full min-h-32 flex-col justify-between gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 transition-all hover:-translate-y-1 hover:ring-saffron/50 hover:shadow-md"
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-saffron-soft text-accent-foreground transition-colors group-hover:bg-saffron group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <span className="block text-sm font-semibold text-foreground group-hover:text-saffron transition-colors">
                        {cat.name}
                      </span>
                      <span className="block text-xs text-muted-foreground tabular-nums">
                        {cat.count} schemes
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {/* How Sarthi Helps - 3-Column Widescreen Cards */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto w-full max-w-[1800px] px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
            <SectionTitle>How Sarthi platform operates</SectionTitle>
            <ul className="grid gap-6 md:grid-cols-3">
              {pillars.map((p) => {
                const Icon = p.icon
                return (
                  <li key={p.n}>
                    <Card className="h-full border-border/80 transition-all hover:shadow-lg hover:border-saffron/40">
                      <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
                        <div className="flex items-center justify-between">
                          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <Icon className="size-6" />
                          </span>
                          <span className="text-3xl font-bold tracking-tight text-border/80 tabular-nums">
                            {p.n}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{p.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
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

        {/* Built Around You - Expansive Widescreen 3-Column Grid */}
        <section className="mx-auto w-full max-w-[1800px] px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* Citizen Profile Side Panel */}
            <div className="lg:col-span-4 xl:col-span-3">
              <SectionTitle>Built around you</SectionTitle>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                Sarthi matches schemes against a structured profile you control.
                Nothing is guessed — every match is evaluated against deterministic eligibility rules.
              </p>

              <Card className="mt-5 border-border/80 bg-card/90 shadow-sm">
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                      {citizen.initials}
                    </span>
                    <div>
                      <p className="text-base font-bold">{citizen.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Active Profile · {citizen.state}
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
                    className="mt-2 w-full font-semibold"
                    size="lg"
                    render={<Link href="/benefits" />}
                  >
                    View All Benefit Calculations
                    <ArrowRight className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Top Matched Schemes - Expansive Grid */}
            <div className="lg:col-span-8 xl:col-span-9">
              <SectionTitle
                action={
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 font-semibold"
                    render={<Link href="/explore" />}
                  >
                    View all 428 schemes
                    <ArrowRight className="size-3.5" />
                  </Button>
                }
              >
                Top eligible matches for your profile
              </SectionTitle>

              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                {featured.map((s) => (
                  <li key={s.id}>
                    <SchemeCard scheme={s} compact />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Widescreen Trust & Source Verification Banner */}
        <section className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto w-full max-w-[1800px] px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                  <ShieldCheck className="size-3.5" />
                  Trust by design
                </span>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                  Government information you can verify.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/80 text-pretty">
                  Every important answer is grounded in an official source document. Sarthi does not treat LLM hallucinations as facts — a deterministic rule engine evaluates criteria, and AI explains the result with exact source citations.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground/25 bg-transparent font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    render={<Link href="/trust" />}
                  >
                    How verification works
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    render={<Link href="/updates" />}
                  >
                    See recent rule changes
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <Card className="bg-card text-card-foreground shadow-2xl">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
                      <p className="text-base font-bold">
                        Income must be below ₹3,00,000
                      </p>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                        <span
                          className="size-1.5 rounded-full bg-success"
                          aria-hidden="true"
                        />
                        Verified Clause
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
                          className="rounded-xl bg-secondary/70 p-3"
                        >
                          <dt className="text-[0.6875rem] font-medium tracking-wider text-muted-foreground uppercase">
                            {k}
                          </dt>
                          <dd className="mt-1 text-sm font-bold text-pretty">
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <SourceCitation
                      source="Equipment Subsidy Guidelines 2026"
                      page="Page 4, Clause 5.1"
                    />
                    <div className="flex flex-wrap gap-2 pt-2">
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
          </div>
        </section>
      </main>

      <AppFooter />
      <div className="h-16 md:hidden" aria-hidden="true" />
    </div>
  )
}
