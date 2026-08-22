import type { Metadata } from 'next'
import { AppShell } from '@/components/site-nav'
import { DocumentsClient } from './documents-client'

export const metadata: Metadata = {
  title: 'Document Center — Sarthi',
  description:
    'One vault for every certificate. See which schemes each document unlocks, get warned before it expires, and reuse it without re-uploading.',
}

export default function DocumentsPage() {
  return (
    <AppShell>
      <DocumentsClient />
    </AppShell>
  )
}
