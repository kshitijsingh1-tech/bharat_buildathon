import type { Metadata } from 'next'
import { AlertsClient } from './alerts-client'

export const metadata: Metadata = {
  title: 'Alerts — Sarthi',
  description:
    'Deadline reminders, eligibility rule changes, document expiries and application updates — each one traced to an official notification.',
}

export default function AlertsPage() {
  return (
    <main id="main">
      <AlertsClient />
    </main>
  )
}
