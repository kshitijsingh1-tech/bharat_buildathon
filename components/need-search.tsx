'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowUp, Languages, Mic, Square } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const examples = [
  { icon: '🎓', text: "I'm a student looking for scholarships" },
  { icon: '🌾', text: "I'm a farmer looking for subsidies" },
  { icon: '🏠', text: 'I need housing assistance' },
  { icon: '💼', text: 'I want to start a business' },
  { icon: '👵', text: 'Find benefits for my parents' },
]

export function NeedSearch({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [recording, setRecording] = useState(false)
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English')

  const submit = () => {
    router.push(`/chat${value ? `?q=${encodeURIComponent(value)}` : ''}`)
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className={cn(
          'rounded-2xl bg-card p-2.5 ring-1 ring-foreground/12 transition-shadow focus-within:ring-2 focus-within:ring-ring/60',
          size === 'lg' ? 'shadow-lg shadow-foreground/5' : 'shadow-xs',
        )}
      >
        <label htmlFor="need-search" className="sr-only">
          Tell Sarthi what you need
        </label>
        <textarea
          id="need-search"
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
              submit()
            }
          }}
          rows={size === 'lg' ? 2 : 1}
          placeholder="Tell me what you need..."
          className={cn(
            'w-full resize-none bg-transparent px-3 py-2 leading-relaxed placeholder:text-muted-foreground focus:outline-none',
            size === 'lg' ? 'text-base sm:text-lg' : 'text-sm',
          )}
        />
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setLang(lang === 'English' ? 'हिन्दी' : 'English')}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
                'inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors',
                recording
                  ? 'bg-destructive/10 text-destructive'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {recording ? (
                <>
                  <Square className="size-3 fill-current" />
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-0.5 animate-pulse rounded-full bg-destructive"
                        style={{
                          height: `${6 + i * 3}px`,
                          animationDelay: `${i * 140}ms`,
                        }}
                      />
                    ))}
                  </span>
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
          <Button
            type="submit"
            size={size === 'lg' ? 'icon-lg' : 'icon'}
            aria-label="Ask Sarthi"
          >
            <ArrowUp />
          </Button>
        </div>
      </form>

      {size === 'lg' && (
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {examples.map((ex) => (
            <li key={ex.text}>
              <button
                type="button"
                onClick={() => setValue(ex.text)}
                className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-2 text-[0.8125rem] text-muted-foreground ring-1 ring-foreground/10 transition-all hover:-translate-y-px hover:text-foreground hover:ring-saffron/40"
              >
                <span aria-hidden="true">{ex.icon}</span>
                {ex.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
