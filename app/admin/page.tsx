import type { Metadata } from 'next'
import { AdminClient } from './admin-client'

export const metadata: Metadata = {
  title: 'Knowledge Base Admin — Sarthi',
  description:
    'Internal console for the scheme registry, retrieval index health and the verified change log behind every answer Sarthi gives.',
}

export default function AdminPage() {
  return (
    <main id="main">
      <AdminClient />
    </main>
  )
}
