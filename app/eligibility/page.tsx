import { AppShell } from '@/components/site-nav'
import { EligibilityClient } from './eligibility-client'

export const metadata = {
  title: 'Explainable Eligibility',
  description:
    'See exactly which rule decided your eligibility, why it exists, and the official clause it came from.',
}

export default async function EligibilityPage({
  searchParams,
}: {
  searchParams: Promise<{ scheme?: string }>
}) {
  const { scheme } = await searchParams
  return (
    <AppShell>
      <EligibilityClient schemeId={scheme} />
    </AppShell>
  )
}
