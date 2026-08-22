import type { Metadata } from 'next'
import { ReadinessClient } from './readiness-client'

export const metadata: Metadata = {
  title: 'Application Readiness — Sarthi',
  description:
    'A pre-flight check for every scheme you qualify for: which requirements are satisfied, what is blocking you, and the single next action.',
}

export default function ReadinessPage() {
  return (
    <main id="main">
      <ReadinessClient />
    </main>
  )
}
