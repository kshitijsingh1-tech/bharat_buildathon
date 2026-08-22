import type { Metadata } from 'next'
import { ComingSoon } from '@/components/coming-soon'

export const metadata: Metadata = {
  title: 'Life Events — Sarthi',
  description:
    'Marriage, a new baby, a crop failure, retirement — each event opens a different set of schemes.',
}

export default function LifeEventsPage() {
  return (
    <main id="main">
      <ComingSoon
        eyebrow="Life Events"
        title="Tell Sarthi what changed, not which scheme you want"
        description="Nobody wakes up looking for a subsidy scheme. They have a daughter getting married, a failed crop, or a parent turning sixty. Pick the event and Sarthi works backwards to the schemes."
        related={[
          { href: '/chat', label: 'Ask Sarthi — describe your situation' },
          { href: '/explore', label: 'Explore Schemes' },
        ]}
      />
    </main>
  )
}
