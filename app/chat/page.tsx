import { ChatClient } from './chat-client'

export const metadata = {
  title: 'Ask Sarthi',
  description:
    'Ask about any government scheme in plain language. Sarthi answers with citations from official documents.',
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return <ChatClient initialQuery={q} />
}
