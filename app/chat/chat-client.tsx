'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowUp,
  BookOpen,
  CheckCircle2,
  FileText,
  Languages,
  Mic,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  User,
  Volume2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SarthiMark } from '@/components/sarthi-logo'
import { SchemeCard, SourceCitation } from '@/components/sarthi-ui'
import { citizen, schemes } from '@/lib/data'
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
    text: "Namaste! I'm Sarthi AI Copilot. Tell me about your situation — your age, occupation, location — and I'll find the exact government schemes that apply to you.",
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
    <div className="flex h-[calc(100svh-4rem)] w-full gap-6">
      {/* Left Sidebar Panel - Active Context & Policy Sources (Widescreen Only) */}
      <aside className="hidden lg:flex lg:w-80 xl:w-96 flex-col gap-5 border-r border-border/80 pr-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <User className="size-4 text-saffron" />
            Active Citizen Context
          </p>
          <Badge variant="outline" className="text-[0.6875rem] font-semibold text-success border-success/30">
            Connected
          </Badge>
        </div>

        <Card className="bg-card/70 border-border/80">
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {citizen.initials}
              </span>
              <div>
                <p className="text-sm font-bold">{citizen.name}</p>
                <p className="text-xs text-muted-foreground">{citizen.occupation} · {citizen.state}</p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs border-t border-border pt-3">
              <div>
                <span className="text-muted-foreground block text-[0.6875rem]">Age</span>
                <span className="font-semibold">{citizen.age} years</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[0.6875rem]">Income</span>
                <span className="font-semibold">{citizen.income}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="size-3.5 text-saffron" />
            Grounded Knowledge Sources
          </p>

          {[
            { name: 'Punjab Agriculture Equipment Guidelines 2026', clause: 'Page 4, Clause 5.1' },
            { name: 'PM-KISAN Samman Nidhi Operational Framework', clause: 'Page 6, Exclusion 4(e)' },
            { name: 'Punjab Post-Matric Scholarship Rules', clause: 'Page 3, Clause 4.2' },
          ].map((src, i) => (
            <div key={i} className="rounded-xl bg-secondary/50 p-3 ring-1 ring-border/50 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="size-3.5 text-saffron shrink-0" />
                <span className="truncate">{src.name}</span>
              </div>
              <p className="mt-1 text-[0.7rem] text-muted-foreground">{src.clause}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Studio Conversation Area */}
      <div className="flex flex-1 flex-col h-full min-w-0">
        <div className="flex items-center justify-between gap-3 border-b border-border py-3">
          <div className="flex items-center gap-2.5">
            <SarthiMark className="size-8" />
            <div>
              <p className="text-base font-bold text-foreground">Ask Sarthi AI Studio</p>
              <p className="text-xs text-muted-foreground">
                Multilingual AI RAG Assistant · Grounded in official policy rules
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-semibold"
              onClick={() => {
                turnRef.current = 0
                setMessages(initialThread())
              }}
            >
              <Plus className="size-4" />
              New Conversation
            </Button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto py-6 pr-2">
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[75%] rounded-2xl rounded-br-md bg-primary px-5 py-3 text-sm leading-relaxed text-primary-foreground shadow-sm">
                  {m.text}
                </p>
              </div>
            ) : (
              <div key={m.id} className="flex gap-4">
                <SarthiMark className="mt-0.5 size-8 shrink-0" />
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="rounded-2xl rounded-tl-md bg-card p-5 ring-1 ring-foreground/10 shadow-xs">
                    <p className="text-base leading-relaxed text-pretty">{m.text}</p>
                    {m.citation && (
                      <SourceCitation
                        source={m.citation.source}
                        page={m.citation.page}
                        className="mt-4 border-t border-border pt-3"
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
                          className="rounded-full bg-card px-4 py-2 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10 transition-all hover:bg-saffron-soft hover:text-accent-foreground hover:ring-saffron/40"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}

                  {m.schemeIds && (
                    <ul className="grid gap-4 md:grid-cols-2">
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
                      <CardContent className="flex flex-wrap items-center justify-between gap-3 py-2 px-4">
                        <p className="text-xs font-semibold text-accent-foreground">
                          Want full eligibility breakdown across all 428 schemes?
                        </p>
                        <Button size="sm" render={<Link href="/benefits" />}>
                          Open My Benefits Studio
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
                          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-saffron-soft hover:text-accent-foreground"
                        >
                          <Sparkles className="size-3.5 text-saffron" />
                          {f}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1 pt-1">
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
            <div className="flex gap-4" aria-live="polite">
              <SarthiMark className="mt-0.5 size-8 shrink-0" />
              <div className="flex items-center gap-3 rounded-2xl rounded-tl-md bg-card px-5 py-4 ring-1 ring-foreground/10">
                <span className="flex gap-1.5" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-2 animate-bounce rounded-full bg-saffron"
                      style={{ animationDelay: `${i * 130}ms` }}
                    />
                  ))}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  Running AI RAG Knowledge Retriever over official scheme documents...
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-0 bg-background pt-3 pb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="rounded-2xl bg-card p-3 ring-1 ring-foreground/12 shadow-lg focus-within:ring-2 focus-within:ring-ring/60"
          >
            <label htmlFor="chat-input" className="sr-only">
              Message Sarthi AI Copilot
            </label>
            <textarea
              id="chat-input"
              rows={2}
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
              placeholder="Ask about any government scheme, eligibility rule, document or deadline..."
              className="w-full resize-none bg-transparent px-3 py-2 text-base leading-relaxed placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex items-center justify-between gap-2 px-1 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLang(lang === 'English' ? 'हिन्दी' : 'English')}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Languages className="size-4" />
                  <span className={cn(lang === 'हिन्दी' && 'text-hi')}>{lang}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecording((v) => !v)}
                  aria-pressed={recording}
                  aria-label={recording ? 'Stop recording' : 'Start voice input'}
                  className={cn(
                    'inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium',
                    recording
                      ? 'bg-destructive/10 text-destructive'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  {recording ? (
                    <>
                      <Square className="size-3.5 fill-current" />
                      Listening...
                    </>
                  ) : (
                    <>
                      <Mic className="size-4" />
                      Voice Input
                    </>
                  )}
                </button>
              </div>
              <Button type="submit" size="icon-lg" aria-label="Send message">
                <ArrowUp />
              </Button>
            </div>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Sarthi AI Copilot grounds responses in official policy documents. Always verify details on official portals before applying.
          </p>
        </div>
      </div>
    </div>
  )
}
