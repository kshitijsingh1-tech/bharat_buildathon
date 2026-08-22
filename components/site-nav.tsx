'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Bell,
  Compass,
  FileText,
  Home,
  LayoutGrid,
  Mic,
  Sparkles,
  User,
  Menu,
  X,
  ClipboardList,
  ScanSearch,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SarthiLogo, SarthiMark } from '@/components/sarthi-logo'
import { GoogleTranslate } from '@/components/google-translate'
import { cn } from '@/lib/utils'

const primaryNav = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore Schemes' },
  { href: '/benefits', label: 'My Benefits' },
  { href: '/eligibility', label: 'Eligibility' },
  { href: '/documents', label: 'Documents' },
  { href: '/applications', label: 'Applications' },
  { href: '/alerts', label: 'Alerts' },
]

const moreNav = [
  { href: '/profile', label: 'Profile' },
  { href: '/family', label: 'My Family' },
  { href: '/simulator', label: 'What If? Simulator' },
  { href: '/readiness', label: 'Application Readiness' },
  { href: '/guide', label: 'Application Guide' },
  { href: '/compare', label: 'Compare Schemes' },
  { href: '/life-events', label: 'Life Events' },
  { href: '/updates', label: 'Scheme Updates' },
  { href: '/help-near-me', label: 'Help Near You' },
  { href: '/trust', label: 'Trust & Sources' },
  { href: '/conflicts', label: 'Source Conflicts' },
  { href: '/settings', label: 'Settings & Privacy' },
  { href: '/admin', label: 'Admin Dashboard' },
]

const mobileNav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/benefits', label: 'Benefits', icon: LayoutGrid },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
]

export function SiteNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState<'EN' | 'हिं'>('EN')

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1800px] items-center gap-4 px-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label="Sarthi home"
          >
            <SarthiLogo className="hidden sm:flex" />
            <SarthiMark className="sm:hidden" />
          </Link>

          <nav
            aria-label="Main"
            className="hidden flex-1 items-center justify-center gap-0.5 xl:flex"
          >
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-2 text-[0.8125rem] font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <GoogleTranslate />

            <Button
              variant="ghost"
              size="icon-lg"
              className="hidden sm:inline-flex"
              aria-label="Voice input"
            >
              <Mic />
            </Button>

            <Button
              variant="ghost"
              size="icon-lg"
              className="relative"
              render={<Link href="/alerts" />}
              aria-label="Notifications, 3 unread"
            >
              <Bell />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-saffron ring-2 ring-background" />
            </Button>

            <Button
              size="lg"
              className="gap-1.5"
              render={<Link href="/chat" />}
            >
              <Sparkles className="size-3.5" />
              <span className="hidden sm:inline">Ask Sarthi</span>
              <span className="sm:hidden">Ask</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border/70 bg-card">
            <div className="mx-auto grid w-full max-w-[1400px] gap-6 px-4 py-6 sm:px-6 md:grid-cols-3">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Citizen
                </p>
                <ul className="flex flex-col gap-0.5">
                  {primaryNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-2.5 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2">
                <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  All pages
                </p>
                <ul className="grid gap-0.5 sm:grid-cols-2">
                  {moreNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <ul className="flex items-stretch">
          {mobileNav.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-[0.6875rem] font-medium',
                    active ? 'text-saffron' : 'text-muted-foreground',
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <Link
        href="/chat"
        aria-label="Ask Sarthi with voice"
        className="fixed right-4 bottom-20 z-50 flex size-14 items-center justify-center rounded-full bg-saffron text-primary-foreground shadow-lg shadow-saffron/30 transition-transform active:scale-95 md:hidden"
      >
        <Mic className="size-6" />
      </Link>
    </>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-saffron uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold text-balance sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function DemoDataNote({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-dashed bg-card/60 text-[0.6875rem] text-muted-foreground"
    >
      <ScanSearch className="size-3" />
      Sample data for demonstration
    </Badge>
  )
}

export function AppFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card/40">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-4 py-10 sm:px-8 lg:px-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <SarthiLogo />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sarthi helps you understand government benefits. Government sources
            define the rules — Sarthi explains them and always shows where the
            answer came from.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <FooterCol
            title="Citizen"
            links={[
              { href: '/explore', label: 'Explore Schemes' },
              { href: '/benefits', label: 'My Benefits' },
              { href: '/documents', label: 'Document Center' },
              { href: '/applications', label: 'My Applications' },
            ]}
          />
          <FooterCol
            title="Trust"
            links={[
              { href: '/trust', label: 'Sources' },
              { href: '/updates', label: 'Scheme Updates' },
              { href: '/conflicts', label: 'Source Conflicts' },
              { href: '/settings', label: 'Privacy' },
            ]}
          />
          <FooterCol
            title="Support"
            links={[
              { href: '/help-near-me', label: 'Help Near You' },
              { href: '/guide', label: 'Application Guide' },
              { href: '/life-events', label: 'Life Events' },
              { href: '/admin', label: 'Admin' },
            ]}
          />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-2 border-t border-border px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>
          Sarthi is an information and guidance tool. It does not submit
          applications on your behalf unless an official integration exists.
        </p>
        <p className="flex items-center gap-1.5">
          <FileText className="size-3.5" />
          All figures shown are sample data
        </p>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
        {title}
      </p>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNav />
      <main
        id="main"
        className={cn(
          'mx-auto w-full max-w-[1800px] flex-1 px-4 pt-8 pb-28 sm:px-8 lg:px-12 md:pb-12',
          className,
        )}
      >
        {children}
      </main>
      <AppFooter />
      <div className="h-16 md:hidden" aria-hidden="true" />
    </div>
  )
}

export { ClipboardList }
