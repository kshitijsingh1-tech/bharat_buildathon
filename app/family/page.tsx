import type { Metadata } from 'next'
import { ComingSoon } from '@/components/coming-soon'

export const metadata: Metadata = {
  title: 'My Family — Sarthi',
  description: 'One household, separate eligibility. Track schemes for every member.',
}

export default function FamilyPage() {
  return (
    <main id="main">
      <ComingSoon
        eyebrow="My Family"
        title="One household, four different eligibility profiles"
        description="Most benefits are claimed per person, not per family. Add each member once and Sarthi tracks their matches, documents and deadlines separately."
        related={[
          { href: '/benefits', label: 'My Benefits — includes a family switcher' },
          { href: '/documents', label: 'Document Center' },
        ]}
      />
    </main>
  )
}
