'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { ArrowUp, Languages, Mic, Square } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUiPreferences } from '@/components/ui-preferences'

const examples = [
  { icon: '🎓', text: 'मैं छात्रवृत्ति खोज रहा/रही हूँ' },
  { icon: '🌾', text: 'मैं किसान हूँ और सहायता चाहता/चाहती हूँ' },
  { icon: '🏠', text: 'मुझे आवास सहायता चाहिए' },
  { icon: '💼', text: 'मैं व्यवसाय शुरू करना चाहता/चाहती हूँ' },
  { icon: '👵', text: 'मेरे माता-पिता के लिए लाभ खोजें' },
]

export function NeedSearch({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const router = useRouter()
  const { language } = useUiPreferences()
  const [value, setValue] = useState('')
  const [recording, setRecording] = useState(false)
  const [voiceLanguage, setVoiceLanguage] = useState<'हिंदी' | 'English' | 'Hinglish'>('हिंदी')
  const [voiceError, setVoiceError] = useState('')
  const recognitionRef = useRef<{ stop: () => void } | null>(null)
  const hi = language === 'hi'

  const submit = () => {
    router.push(`/chat${value ? `?q=${encodeURIComponent(value)}` : ''}`)
  }

  const startVoiceInput = () => {
    if (recording) {
      recognitionRef.current?.stop()
      return
    }
    const Recognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!Recognition) return setVoiceError(hi ? 'इस ब्राउज़र में आवाज़ से लिखना उपलब्ध नहीं है।' : 'Voice input is not supported in this browser.')
    const recognition = new Recognition()
    recognition.lang = voiceLanguage === 'English' ? 'en-IN' : 'hi-IN'
    recognition.interimResults = false
    recognition.onresult = (event: any) => setValue((current) => `${current}${current ? ' ' : ''}${event.results[event.results.length - 1][0].transcript}`)
    recognition.onerror = () => setVoiceError(hi ? 'आवाज़ स्पष्ट नहीं मिली। फिर कोशिश करें।' : 'We could not hear you clearly. Please try again.')
    recognition.onend = () => setRecording(false)
    recognitionRef.current = recognition
    setVoiceError('')
    setRecording(true)
    recognition.start()
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
          {hi ? 'अपनी ज़रूरत बताएँ' : 'Tell Sarthi what you need'}
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
          placeholder={hi ? 'आपको किस सहायता की ज़रूरत है?' : 'What help do you need?'}
          className={cn(
            'w-full resize-none bg-transparent px-3 py-2 leading-relaxed placeholder:text-muted-foreground focus:outline-none',
            size === 'lg' ? 'text-base sm:text-lg' : 'text-sm',
          )}
        />
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setVoiceLanguage((current) => current === 'हिंदी' ? 'English' : current === 'English' ? 'Hinglish' : 'हिंदी')}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Languages className="size-3.5" />
              <span className="text-hi">{voiceLanguage}</span>
            </button>
            <button
              type="button"
              onClick={startVoiceInput}
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
                  {hi ? 'सुन रहे हैं' : 'Listening'}
                </>
              ) : (
                <>
                  <Mic className="size-3.5" />
                  {hi ? 'बोलें' : 'Speak'}
                </>
              )}
            </button>
          </div>
          <Button
            type="submit"
            size={size === 'lg' ? 'icon-lg' : 'icon'}
            aria-label={hi ? 'सारथी से पूछें' : 'Ask Sarthi'}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
      {voiceError && <p className="mt-2 text-xs text-destructive">{voiceError}</p>}

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
