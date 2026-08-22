import Link from 'next/link'
import { ArrowRight, Compass, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Shared placeholder for screens in the spec that are not built yet.
 * Keeps every navigation link resolvable instead of dead-ending in a 404.
 */
export function ComingSoon({
  eyebrow,
  title,
  description,
  related = [],
}: {
  eyebrow: string
  title: string
  description: string
  related?: { href: string; label: string }[]
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6 lg:py-24">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold text-balance sm:text-4xl">{title}</h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This screen is part of the full specification but is not built in this pass. The
          design system, demo data and shared components are already in place, so it can be
          added without rework.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-1.5" render={<Link href="/chat" />}>
            <MessageSquare className="size-4" aria-hidden="true" />
            Ask Sarthi instead
          </Button>
          <Button variant="outline" className="gap-1.5" render={<Link href="/explore" />}>
            <Compass className="size-4" aria-hidden="true" />
            Explore schemes
          </Button>
        </div>
      </div>

      {related.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Built and closest to this
          </h2>
          <ul className="flex flex-col gap-2">
            {related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10 transition-colors hover:ring-foreground/25"
                >
                  <span className="font-medium">{r.label}</span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
