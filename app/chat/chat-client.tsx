'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowUp,
  Languages,
  Mic,
  Plus,
  RotateCcw,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SarthiMark } from '@/components/sarthi-logo'
import { SchemeCard, SourceCitation, StatusPill } from '@/components/sarthi-ui'
import { schemes } from '@/lib/data'
import { cn } from '@/lib/utils'

type Msg =
  | { id: string; role: 'user'; text: string }
  | {
      id: string
      role: 'sarthi'
      text: string
      chips?: string[]
      schemeIds?: string[]
      citation?: { source: string; page: string }
      followUps?: string[]
    }

const initialThread = (q?: string): Msg[] => {
  const opening: Msg = {
    id: 'm0',
    role: 'sarthi',
    text: "Namaste! I'm Sarthi. Tell me about your situation — your age, what you do, where you live — and I'll find the government schemes that actually apply to you.",
    chips: [
      "I'm a farmer in Punjab",
      "I'm a student looking for scholarships",
      'Find benefits for my parents',
      'I need help with medical bills',
    ],
  }
  if (!q) return [opening]
  return [
    opening,
    { id: 'm1', role: 'user', text: q },
    {
      id: 'm2',
      role: 'sarthi',
      text: 'Got it. To narrow this down accurately I need two quick details — what is your age, and which state do you live in?',
      chips: ['I am 21, Punjab', 'I am 35, Bihar', 'Prefer not to say'],
    },
  ]
}

const cannedReply = (turn: number): Msg => {
  if (turn === 0) {
    return {
      id: `s${Date.now()}`,
      role: 'sarthi',
      text: 'Got it. To narrow this down accurately I need two quick details — what is your age, and which state do you live in?',
      chips: ['I am 21, Punjab', 'I am 35, Bihar', 'Prefer not to say'],
    }
  }
  if (turn === 1) {
    return {
      id: `s${Date.now()}`,
      role: 'sarthi',
      text: 'Thanks. A couple more details will make the eligibility check exact — what is your approximate annual household income, and do you own agricultural land?',
      chips: [
        'Under ₹2,50,000',
        '₹2,50,000 – ₹5,00,000',
        'Yes, about 3 acres',
        'No land',
      ],
    }
  }
  if (turn === 2) {
    return {
      id: `s${Date.now()}`,
      role: 'sarthi',
      text: "Based on your profile — 21 years old, student in Punjab, household income ₹2,40,000 — I found 3 schemes you're eligible for right now. Here are the strongest matches:",
      schemeIds: [
        'post-matric-scholarship',
        'skill-development',
        'punjab-farmer-equipment-subsidy',
      ],
      citation: {
        source: 'Punjab Post-Matric Scholarship Guidelines',
        page: 'Page 4, Clause 5.1',
      },
      followUps: [
        'Which documents do I need?',
        'Why am I eligible for the scholarship?',
        'What if my income were higher?',
        'Show me schemes for my father',
      ],
    }
  }
  return {
    id: `s${Date.now()}`,
    role: 'sarthi',
    text: 'For the Post-Matric Scholarship you need five documents. Four are already verified in your Document Center — only your income certificate needs renewal, since it expires in 18 days and the scheme requires a certificate valid at the time of submission.',
    citation: {
      source: 'Punjab Post-Matric Scholarship Guidelines',
      page: 'Page 7, Clause 8.2',
    },
    followUps: [
      'How do I renew my income certificate?',
      'Where is the nearest help center?',
      'Start my application',
    ],
  }
}

export function ChatClient({ initialQuery }: { initialQuery?: string }) {
  const [messages, setMessages] = useState<Msg[]>(() =>
    initialThread(initialQuery),
  )
  const [value, setValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const [recording, setRecording] = useState(false)
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English')
  const turnRef = useRef(initialQuery ? 1 : 0)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  const send = (raw?: string) => {
    const text = (raw ?? value).trim()
    if (!text) return
    setValue('')
    setMessages((m) => [
      ...m,
      { id: `u${Date.now()}`, role: 'user', text },
    ])
    setThinking(true)
    const turn = turnRef.current
    turnRef.current += 1
    window.setTimeout(() => {
      setThinking(false)
      setMessages((m) => [...m, cannedReply(turn)])
    }, 1100)
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-4rem)] w-full max-w-3xl flex-col px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3 border-b border-border py-3">
        <div className="flex items-center gap-2">
          <SarthiMark className="size-7" />
          <div>
            <p className="text-sm leading-none font-semibold">Ask Sarthi</p>
            <p className="mt-1 text-[0.6875rem] text-muted-foreground">
              Grounded in official scheme documents
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="hidden gap-1.5 text-[0.6875rem] sm:inline-flex">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            Profile connected
          </Badge>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="New conversation"
            onClick={() => {
              turnRef.current = 0
              setMessages(initialThread())
            }}
          >
            <Plus />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto py-6">
        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex gap-3">
              <SarthiMark className="mt-0.5 size-7 shrink-0" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="rounded-2xl rounded-tl-md bg-card px-4 py-3 ring-1 ring-foreground/10">
                  <p className="text-sm leading-relaxed text-pretty">{m.text}</p>
                  {m.citation && (
                    <SourceCitation
                      source={m.citation.source}
                      page={m.citation.page}
                      className="mt-3 border-t border-border pt-2.5"
                    />
                  )}
                </div>

                {m.chips && (
                  <div className="flex flex-wrap gap-2">
                    {m.chips.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => send(c)}
                        className="rounded-full bg-card px-3 py-1.5 text-[0.8125rem] text-muted-foreground ring-1 ring-foreground/10 transition-colors hover:bg-saffron-soft hover:text-accent-foreground hover:ring-saffron/40"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}

                {m.schemeIds && (
                  <ul className="grid gap-3">
                    {m.schemeIds.map((id) => {
                      const s = schemes.find((x) => x.id === id)
                      if (!s) return null
                      return (
                        <li key={id}>
                          <SchemeCard scheme={s} compact />
                        </li>
                      )
                    })}
                  </ul>
                )}

                {m.schemeIds && (
                  <Card className="border-dashed bg-saffron-soft/50">
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 py-1">
                      <p className="text-[0.8125rem] text-accent-foreground">
                        Want the full picture across all 428 schemes?
                      </p>
                      <Button size="sm" render={<Link href="/benefits" />}>
                        Open My Benefits
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {m.followUps && (
                  <div className="flex flex-wrap gap-2">
                    {m.followUps.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => send(f)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[0.8125rem] font-medium text-foreground transition-colors hover:bg-saffron-soft hover:text-accent-foreground"
                      >
                        <Sparkles className="size-3 text-saffron" />
                        {f}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon-xs" aria-label="Read aloud">
                    <Volume2 />
                  </Button>
                  <Button variant="ghost" size="icon-xs" aria-label="Helpful">
                    <ThumbsUp />
                  </Button>
                  <Button variant="ghost" size="icon-xs" aria-label="Not helpful">
                    <ThumbsDown />
                  </Button>
                  <Button variant="ghost" size="icon-xs" aria-label="Regenerate">
                    <RotateCcw />
                  </Button>
                </div>
              </div>
            </div>
          ),
        )}

        {thinking && (
          <div className="flex gap-3" aria-live="polite">
            <SarthiMark className="mt-0.5 size-7 shrink-0" />
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-card px-4 py-3 ring-1 ring-foreground/10">
              <span className="flex gap-1" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-saffron"
                    style={{ animationDelay: `${i * 130}ms` }}
                  />
                ))}
              </span>
              <span className="text-xs text-muted-foreground">
                Checking official scheme documents
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 bg-background pt-2 pb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="rounded-2xl bg-card p-2 ring-1 ring-foreground/12 focus-within:ring-2 focus-within:ring-ring/60"
        >
          <label htmlFor="chat-input" className="sr-only">
            Message Sarthi
          </label>
          <textarea
            id="chat-input"
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing &&
                e.keyCode !== 229
              ) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Ask about any scheme, document or deadline..."
            className="max-h-32 w-full resize-none bg-transparent px-3 py-2 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLang(lang === 'English' ? 'हिन्दी' : 'English')}
                className="inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Languages className="size-3.5" />
                <span className={cn(lang === 'हिन्दी' && 'text-hi')}>{lang}</span>
              </button>
              <button
                type="button"
                onClick={() => setRecording((v) => !v)}
                aria-pressed={recording}
                aria-label={recording ? 'Stop recording' : 'Start voice input'}
                className={cn(
                  'inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-medium',
                  recording
                    ? 'bg-destructive/10 text-destructive'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                {recording ? (
                  <>
                    <Square className="size-3 fill-current" />
                    Listening
                  </>
                ) : (
                  <>
                    <Mic className="size-3.5" />
                    Speak
                  </>
                )}
              </button>
            </div>
            <Button type="submit" size="icon" aria-label="Send message">
              <ArrowUp />
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-[0.6875rem] text-muted-foreground">
          Sarthi explains official rules but does not replace them. Always
          confirm on the official portal before applying.
        </p>
      </div>
    </div>
  )
}
