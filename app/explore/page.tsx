import { AppShell } from '@/components/site-nav'
import { ExploreClient } from './explore-client'

export const metadata = {
  title: 'Explore Schemes',
  description:
    'Search and filter central and state government schemes by category, eligibility, state and deadline.',
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  return (
    <AppShell>
      <ExploreClient initialCategory={category} />
    </AppShell>
  )
}
