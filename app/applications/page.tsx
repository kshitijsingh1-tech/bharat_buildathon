import type { Metadata } from 'next'
import { ApplicationsClient } from './applications-client'

export const metadata: Metadata = {
  title: 'My Applications — Sarthi',
  description:
    'Track every scheme application by stage, see which office is holding it, what happens next, and who to call.',
}

export default function ApplicationsPage() {
  return (
    <main id="main">
      <ApplicationsClient />
    </main>
  )
}
