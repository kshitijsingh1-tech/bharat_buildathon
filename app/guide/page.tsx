import type { Metadata } from 'next'
import { ComingSoon } from '@/components/coming-soon'

export const metadata: Metadata = {
  title: 'Application Guide — Sarthi',
  description:
    'Step-by-step walkthroughs for filling and submitting each scheme application.',
}

export default function GuidePage() {
  return (
    <main id="main">
      <ComingSoon
        eyebrow="Application Guide"
        title="Every form field, explained in plain language"
        description="Screen-by-screen walkthroughs of the official portals, with the exact wording to use, the papers to carry, and the mistakes that cause rejections."
        related={[
          { href: '/readiness', label: 'Application Readiness' },
          { href: '/applications', label: 'My Applications' },
        ]}
      />
    </main>
  )
}
