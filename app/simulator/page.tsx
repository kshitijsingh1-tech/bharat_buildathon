import type { Metadata } from 'next'
import { ComingSoon } from '@/components/coming-soon'

export const metadata: Metadata = {
  title: 'What If? Simulator — Sarthi',
  description:
    'Change your income, age or land holding and watch which schemes open or close.',
}

export default function SimulatorPage() {
  return (
    <main id="main">
      <ComingSoon
        eyebrow="What If? Simulator"
        title="Move one number and see which schemes open or close"
        description="A full sandbox across every scheme at once — raise your income, add a family member, change district, and watch the match list shift in real time."
        related={[
          { href: '/eligibility', label: 'Explainable Eligibility — has a live what-if slider' },
          { href: '/explore', label: 'Explore Schemes' },
        ]}
      />
    </main>
  )
}
