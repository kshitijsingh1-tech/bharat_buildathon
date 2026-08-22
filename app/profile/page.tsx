import type { Metadata } from 'next'
import { ComingSoon } from '@/components/coming-soon'

export const metadata: Metadata = {
  title: 'Profile — Sarthi',
  description: 'The details Sarthi uses to match you, and control over each one.',
}

export default function ProfilePage() {
  return (
    <main id="main">
      <ComingSoon
        eyebrow="Profile"
        title="The facts Sarthi matches you against"
        description="Age, income, occupation, state and category — each field shown with which schemes it affects, and editable without losing your matches."
        related={[
          { href: '/eligibility', label: 'Explainable Eligibility' },
          { href: '/benefits', label: 'My Benefits' },
        ]}
      />
    </main>
  )
}
