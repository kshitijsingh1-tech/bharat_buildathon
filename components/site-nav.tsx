'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Bell,
  Compass,
  FileText,
  Home,
  LayoutGrid,
  Moon,
  Sparkles,
  Sun,
  User,
  ClipboardList,
  ScanSearch,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SarthiLogo, SarthiMark } from '@/components/sarthi-logo'
import { GoogleTranslate } from '@/components/google-translate'
import { cn } from '@/lib/utils'
import { useUiPreferences } from '@/components/ui-preferences'
import { PortalGuide } from '@/components/portal-guide'

const primaryNav = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore Schemes' },
  { href: '/benefits', label: 'My Benefits' },
  { href: '/eligibility', label: 'Eligibility' },
  { href: '/documents', label: 'Documents' },
  { href: '/applications', label: 'Applications' },
  { href: '/alerts', label: 'Alerts' },
]

const mobileNav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/benefits', label: 'Benefits', icon: LayoutGrid },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
]

const hindiLabels: Record<string, string> = {
  Home: 'होम',
  'Explore Schemes': 'योजनाएँ खोजें',
  'My Benefits': 'मेरे लाभ',
  Eligibility: 'पात्रता',
  Documents: 'दस्तावेज़',
  Applications: 'आवेदन',
  Alerts: 'सूचनाएँ',
  Explore: 'खोजें',
  Benefits: 'लाभ',
  Profile: 'प्रोफ़ाइल',
  'Ask Sarthi': 'सारथी से पूछें',
  'My Family': 'मेरा परिवार',
  'What If? Simulator': 'परिस्थिति सिम्युलेटर',
  'Application Readiness': 'आवेदन तैयारी',
  'Application Guide': 'आवेदन मार्गदर्शिका',
  'Compare Schemes': 'योजनाओं की तुलना',
  'Life Events': 'जीवन की घटनाएँ',
  'Scheme Updates': 'योजना अपडेट',
  'Help Near You': 'पास में सहायता',
  'Trust & Sources': 'विश्वास और स्रोत',
  'Source Conflicts': 'स्रोत मतभेद',
  'Settings & Privacy': 'सेटिंग्स और गोपनीयता',
  'Admin Dashboard': 'प्रशासन डैशबोर्ड',
}

export function SiteNav() {
  const pathname = usePathname()
  const [guideOpen, setGuideOpen] = useState(false)
  const [fontScale, setFontScale] = useState<1 | 1.15 | 1.3>(1)
  const { language, setLanguage, theme, toggleTheme } = useUiPreferences()

  useEffect(() => {
    const stored = window.localStorage.getItem('sarthi-font-scale')
    if (stored === '1.15' || stored === '1.3') setFontScale(Number(stored) as 1.15 | 1.3)
  }, [])

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`
    window.localStorage.setItem('sarthi-font-scale', String(fontScale))
  }, [fontScale])
  const label = (english: string) =>
    language === 'hi' ? hindiLabels[english] ?? english : english

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
                {label(item.label)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <GoogleTranslate />


            <button
              type="button"
              onClick={() => setFontScale(current => current === 1 ? 1.15 : current === 1.15 ? 1.3 : 1)}
              className="hidden sm:inline-flex items-center justify-center size-9 rounded-lg text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label={language === 'hi' ? 'फ़ॉन्ट आकार बदलें' : 'Change font size'}
              title={language === 'hi' ? 'फ़ॉन्ट आकार बदलें' : 'Change font size'}
            >
              {fontScale === 1 ? 'A' : fontScale === 1.15 ? 'A+' : 'A++'}
            </button>

            <Button
              variant="ghost"
              size="icon-lg"
              className="hidden sm:inline-flex"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
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

          </div>
        </div>
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
                  {label(item.label)}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="fixed right-4 bottom-20 z-50 md:right-7 md:bottom-7">
        {guideOpen && <div className="absolute right-0 bottom-18 mb-3"><PortalGuide onClose={() => setGuideOpen(false)} /></div>}
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          aria-expanded={guideOpen}
          aria-label={language === 'hi' ? 'सारथी पोर्टल गाइड खोलें' : 'Open Sarthi Portal Guide'}
          className="animate-sarthi-beat flex h-14 items-center gap-2 rounded-full bg-saffron px-4 text-sm font-bold text-primary-foreground shadow-xl shadow-saffron/40 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-saffron/40 active:scale-95 md:h-15"
        >
          <Sparkles className="size-5" />
          <span>{language === 'hi' ? 'सारथी गाइड' : 'Sarthi Guide'}</span>
        </button>
      </div>
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
  const { language } = useUiPreferences()
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-dashed bg-card/60 text-[0.6875rem] text-muted-foreground"
    >
      <ScanSearch className="size-3" />
      {language === 'hi' ? 'प्रदर्शन के लिए नमूना डेटा' : 'Sample data for demonstration'}
    </Badge>
  )
}

export function AppFooter() {
  const { language } = useUiPreferences()
  const hi = language === 'hi'

  return (
    <footer className="mt-16 border-t border-border bg-card/40">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-4 py-10 sm:px-8 lg:px-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <SarthiLogo />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {hi ? 'सारथी आपको सरकारी लाभों को समझने में मदद करता है। सरकारी स्रोत नियम निर्धारित करते हैं — सारथी उन्हें समझाता है और हमेशा दिखाता है कि उत्तर कहाँ से आया।' : 'Sarthi helps you understand government benefits. Government sources define the rules — Sarthi explains them and always shows where the answer came from.'}
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <FooterCol
            title={hi ? 'नागरिक' : 'Citizen'}
            links={[
              { href: '/explore', label: hi ? 'योजनाएँ खोजें' : 'Explore Schemes' },
              { href: '/benefits', label: hi ? 'मेरे लाभ' : 'My Benefits' },
              { href: '/documents', label: hi ? 'दस्तावेज़ केंद्र' : 'Document Center' },
              { href: '/applications', label: hi ? 'मेरे आवेदन' : 'My Applications' },
            ]}
          />
          <FooterCol
            title={hi ? 'विश्वास' : 'Trust'}
            links={[
              { href: '/trust', label: hi ? 'स्रोत' : 'Sources' },
              { href: '/updates', label: hi ? 'योजना अपडेट' : 'Scheme Updates' },
              { href: '/conflicts', label: hi ? 'स्रोत मतभेद' : 'Source Conflicts' },
              { href: '/settings', label: hi ? 'गोपनीयता' : 'Privacy' },
            ]}
          />
          <FooterCol
            title={hi ? 'सहायता' : 'Support'}
            links={[
              { href: '/help-near-me', label: hi ? 'पास में सहायता' : 'Help Near You' },
              { href: '/guide', label: hi ? 'आवेदन मार्गदर्शिका' : 'Application Guide' },
              { href: '/life-events', label: hi ? 'जीवन की घटनाएँ' : 'Life Events' },
              { href: '/admin', label: hi ? 'प्रशासन' : 'Admin' },
            ]}
          />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-2 border-t border-border px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>
          {hi ? 'सारथी एक सूचना और मार्गदर्शन उपकरण है। यह आपकी ओर से आवेदन जमा नहीं करता जब तक कोई आधिकारिक एकीकरण मौजूद न हो।' : 'Sarthi is an information and guidance tool. It does not submit applications on your behalf unless an official integration exists.'}
        </p>
        <p className="flex items-center gap-1.5">
          <FileText className="size-3.5" />
          {hi ? 'सभी दिखाए गए आँकड़े नमूना डेटा हैं' : 'All figures shown are sample data'}
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
