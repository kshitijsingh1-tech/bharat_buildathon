import type { Metadata } from 'next'
import { ComingSoon } from '@/components/coming-soon'

export const metadata: Metadata = {
  title: 'Compare Schemes — Sarthi',
  description:
    'Put two or three similar schemes side by side and see which one actually pays more.',
}

export default function ComparePage() {
  return (
    <main id="main">
      <ComingSoon
        eyebrow="Compare Schemes"
        title="Two schemes look alike until you read the fine print"
        description="Side-by-side columns for benefit amount, income ceiling, documents, processing time and whether you can hold both at once."
        related={[
          { href: '/explore', label: 'Explore Schemes' },
          { href: '/readiness', label: 'Application Readiness' },
        ]}
      />
    </main>
  )
}
