import { AppShell } from '@/components/site-nav'
import { BenefitsClient } from './benefits-client'

export const metadata = {
  title: 'My Benefits',
  description:
    'A single view of every scheme matched to your profile — claimable now, blocked, or closing soon.',
}

export default function BenefitsPage() {
  return (
    <AppShell>
      <BenefitsClient />
    </AppShell>
  )
}
