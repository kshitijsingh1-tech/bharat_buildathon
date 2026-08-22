'use client'

import ReactMarkdown from 'react-markdown'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowUp,
  ArrowLeft,
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
import { schemes } from '@/lib/data'
import { cn } from '@/lib/utils'
import { type AppLanguage, useUiPreferences } from '@/components/ui-preferences'

/* =================================================================
   USER PROFILE — collected through conversation
================================================================= */

type UserProfile = {
  profession?: string
  age?: number
  state?: string
  income?: number
  gender?: string
  category?: string
  need?: string
}

/* Fields we collect, in order */
const PROFILE_FIELDS = ['need', 'profession', 'age', 'state', 'income'] as const
type ProfileField = (typeof PROFILE_FIELDS)[number]

/* =================================================================
   INPUT PARSING — extract structured data from free text
================================================================= */

const STATE_MAP: Record<string, string> = {
  punjab: 'Punjab', haryana: 'Haryana', up: 'Uttar Pradesh', 'uttar pradesh': 'Uttar Pradesh',
  bihar: 'Bihar', mp: 'Madhya Pradesh', 'madhya pradesh': 'Madhya Pradesh', rajasthan: 'Rajasthan',
  maharashtra: 'Maharashtra', gujarat: 'Gujarat', 'tamil nadu': 'Tamil Nadu', tn: 'Tamil Nadu',
  karnataka: 'Karnataka', kerala: 'Kerala', 'west bengal': 'West Bengal', wb: 'West Bengal',
  ap: 'Andhra Pradesh', 'andhra pradesh': 'Andhra Pradesh', telangana: 'Telangana',
  odisha: 'Odisha', assam: 'Assam', jharkhand: 'Jharkhand', chhattisgarh: 'Chhattisgarh',
  uttarakhand: 'Uttarakhand', goa: 'Goa', delhi: 'Delhi', 'himachal pradesh': 'Himachal Pradesh',
  hp: 'Himachal Pradesh', 'jammu': 'Jammu & Kashmir', 'j&k': 'Jammu & Kashmir',
  // Hindi state names
  'पंजाब': 'Punjab', 'हरियाणा': 'Haryana', 'बिहार': 'Bihar', 'राजस्थान': 'Rajasthan',
  'महाराष्ट्र': 'Maharashtra', 'गुजरात': 'Gujarat', 'दिल्ली': 'Delhi', 'केरल': 'Kerala',
  'उत्तर प्रदेश': 'Uttar Pradesh', 'मध्य प्रदेश': 'Madhya Pradesh',
}

const PROFESSION_KEYWORDS: Record<string, string[]> = {
  Farmer: ['farmer', 'farming', 'agriculture', 'cultivator', 'kisan', 'किसान', 'खेती'],
  Student: ['student', 'studying', 'college', 'university', 'school', 'छात्र', 'पढ़ाई', 'विद्यार्थी'],
  'Business Owner': ['business', 'shop', 'entrepreneur', 'self-employed', 'व्यापार', 'दुकान', 'व्यवसाय'],
  'Daily Wage Worker': ['labour', 'labor', 'daily wage', 'mazdoor', 'मजदूर', 'दिहाड़ी'],
  Homemaker: ['homemaker', 'housewife', 'गृहिणी'],
  'Senior / Retired': ['retired', 'pension', 'senior', 'old age', 'सेवानिवृत्त', 'बुज़ुर्ग'],
  Unemployed: ['unemployed', 'no job', 'jobless', 'बेरोज़गार'],
  'Government Employee': ['government', 'sarkari', 'सरकारी नौकरी'],
  'Private Employee': ['private', 'job', 'employed', 'salary', 'नौकरी', 'कर्मचारी'],
}

const NEED_KEYWORDS: Record<string, string[]> = {
  Education: ['education', 'scholarship', 'school', 'college', 'tuition', 'शिक्षा', 'छात्रवृत्ति', 'पढ़ाई'],
  Agriculture: ['farm', 'agriculture', 'crop', 'land', 'kisan', 'खेती', 'फसल', 'किसान'],
  Healthcare: ['health', 'medical', 'hospital', 'treatment', 'medicine', 'स्वास्थ्य', 'इलाज', 'अस्पताल'],
  Housing: ['house', 'home', 'housing', 'awas', 'मकान', 'आवास', 'घर'],
  Employment: ['job', 'employment', 'skill', 'training', 'रोज़गार', 'नौकरी', 'कौशल'],
  Business: ['business', 'loan', 'startup', 'enterprise', 'व्यापार', 'लोन', 'उद्यम'],
  'Senior Citizens': ['pension', 'old age', 'senior', 'elderly', 'पेंशन', 'बुज़ुर्ग', 'वृद्ध'],
  'Women & Child': ['women', 'mahila', 'child', 'maternity', 'महिला', 'बच्चा', 'मातृत्व'],
}

function extractAge(text: string): number | undefined {
  // Match patterns like "21", "21 years", "21 sal", "age 21", "उम्र 21"
  const patterns = [
    /(?:age|उम्र|आयु|sal|years old|year old)\s*[:\-]?\s*(\d{1,3})/i,
    /(\d{1,3})\s*(?:years?\s*old|sal|साल|वर्ष)/i,
    /(?:i\s*am|i'm|main|मैं)\s*(\d{1,3})/i,
    /\b(\d{1,3})\b/,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) {
      const n = parseInt(m[1], 10)
      if (n >= 5 && n <= 120) return n
    }
  }
  return undefined
}

function extractIncome(text: string): number | undefined {
  // Match patterns like "2,40,000", "240000", "2.4 lakh", "₹2,40,000"
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख)/i)
  if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000)

  const numMatch = text.match(/₹?\s*([\d,]+(?:\.\d+)?)/i)
  if (numMatch) {
    const n = parseInt(numMatch[1].replace(/,/g, ''), 10)
    if (n >= 1000) return n
  }
  return undefined
}

function extractState(text: string): string | undefined {
  const lower = text.toLowerCase()
  for (const [key, value] of Object.entries(STATE_MAP)) {
    if (lower.includes(key)) return value
  }
  return undefined
}

function extractProfession(text: string): string | undefined {
  const lower = text.toLowerCase()
  for (const [prof, keywords] of Object.entries(PROFESSION_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return prof
  }
  return undefined
}

function extractNeed(text: string): string | undefined {
  const lower = text.toLowerCase()
  for (const [need, keywords] of Object.entries(NEED_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return need
  }
  return undefined
}

/** Parse user text and extract as many profile fields as possible */
function parseInput(text: string): Partial<UserProfile> {
  const parsed: Partial<UserProfile> = {}
  const age = extractAge(text)
  if (age) parsed.age = age
  const state = extractState(text)
  if (state) parsed.state = state
  const income = extractIncome(text)
  if (income) parsed.income = income
  const profession = extractProfession(text)
  if (profession) parsed.profession = profession
  const need = extractNeed(text)
  if (need) parsed.need = need
  return parsed
}

/* =================================================================
   SCHEME MATCHING — filter schemes based on user profile
================================================================= */

function parseAgeRange(range: string): [number, number] {
  const m = range.match(/(\d+)\s*[–-]\s*(\d+)/)
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : [0, 999]
}

function parseIncomeLimit(limit: string): number {
  const m = limit.replace(/,/g, '').match(/(\d+)/)
  return m ? parseInt(m[1], 10) : Infinity
}

function matchSchemes(profile: UserProfile) {
  return schemes
    .map((scheme) => {
      let score = 0
      let reasons: string[] = []
      let reasonsHi: string[] = []

      // State match
      if (profile.state) {
        if (scheme.state === profile.state || scheme.state === 'All India' || scheme.level === 'Central') {
          score += 25
          reasons.push(`Available in ${profile.state}`)
          reasonsHi.push(`${profile.state} में उपलब्ध`)
        } else {
          score -= 50
          reasons.push(`Not available in ${profile.state}`)
          reasonsHi.push(`${profile.state} में उपलब्ध नहीं`)
        }
      }

      // Age match
      if (profile.age) {
        const [min, max] = parseAgeRange(scheme.ageRange)
        if (profile.age >= min && profile.age <= max) {
          score += 25
          reasons.push(`Age ${profile.age} fits ${scheme.ageRange}`)
          reasonsHi.push(`आयु ${profile.age} सीमा ${scheme.ageRange} में है`)
        } else {
          score -= 30
          reasons.push(`Age ${profile.age} outside ${scheme.ageRange}`)
          reasonsHi.push(`आयु ${profile.age} सीमा ${scheme.ageRange} से बाहर`)
        }
      }

      // Income match
      if (profile.income) {
        const limit = parseIncomeLimit(scheme.incomeLimit)
        if (profile.income <= limit) {
          score += 25
          reasons.push('Income within limit')
          reasonsHi.push('आय सीमा के अंदर')
        } else if (limit < Infinity) {
          score -= 20
          reasons.push(`Income exceeds limit (${scheme.incomeLimit})`)
          reasonsHi.push(`आय सीमा (${scheme.incomeLimit}) से अधिक`)
        }
      }

      // Category / need match
      if (profile.need && scheme.category === profile.need) {
        score += 30
        reasons.push(`Matches your need: ${profile.need}`)
        reasonsHi.push(`आपकी ज़रूरत से मेल: ${profile.need}`)
      }

      // Profession relevance
      if (profile.profession) {
        const profLower = profile.profession.toLowerCase()
        const schemeLower = (scheme.name + ' ' + scheme.summary + ' ' + scheme.category).toLowerCase()
        if (profLower.includes('farmer') && schemeLower.includes('farm')) {
          score += 20
        } else if (profLower.includes('student') && schemeLower.includes('scholar')) {
          score += 20
        } else if (profLower.includes('senior') && schemeLower.includes('pension')) {
          score += 20
        } else if (profLower.includes('women') && schemeLower.includes('women')) {
          score += 20
        }
      }

      return { scheme, score, reasons, reasonsHi }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

/* =================================================================
   CONVERSATION ENGINE — dynamic question flow
================================================================= */

type Msg =
  | { id: string; role: 'user'; text: string }
  | {
      id: string
      role: 'sarthi'
      text: string
      chips?: string[]
      schemeIds?: string[]
      matchResults?: ReturnType<typeof matchSchemes>
      profileSummary?: { en: string; hi: string }
      citation?: { source: string; page?: string }
      followUps?: string[]
    }

function buildProfileSummary(profile: UserProfile): { en: string; hi: string } {
  const parts: string[] = []
  const partsHi: string[] = []
  if (profile.age) { parts.push(`${profile.age} years old`); partsHi.push(`${profile.age} वर्ष`) }
  if (profile.profession) { parts.push(profile.profession); partsHi.push(profile.profession) }
  if (profile.state) { parts.push(`from ${profile.state}`); partsHi.push(`${profile.state} से`) }
  if (profile.income) {
    const fmt = profile.income >= 100000 ? `₹${(profile.income / 100000).toFixed(1)} lakh` : `₹${profile.income.toLocaleString('en-IN')}`
    const fmtHi = profile.income >= 100000 ? `₹${(profile.income / 100000).toFixed(1)} लाख` : `₹${profile.income.toLocaleString('en-IN')}`
    parts.push(`income ${fmt}`)
    partsHi.push(`आय ${fmtHi}`)
  }
  if (profile.need) { parts.push(`looking for ${profile.need}`); partsHi.push(`${profile.need} में रुचि`) }
  return { en: parts.join(' · '), hi: partsHi.join(' · ') }
}

type SpeechResult = { readonly 0: { transcript: string }; readonly isFinal: boolean; readonly length: number }
type SpeechResultList = { readonly length: number; [index: number]: SpeechResult }

type BrowserSpeechRecognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: { results: SpeechResultList }) => void) | null
  onend: (() => void) | null
  onerror: ((event: { error: string; message?: string }) => void) | null
  onaudiostart: (() => void) | null
  onspeechstart: (() => void) | null
}

function getNextMissingField(profile: UserProfile): ProfileField | null {
  for (const field of PROFILE_FIELDS) {
    if (profile[field] === undefined) return field
  }
  return null
}

function getQuestion(field: ProfileField, hi: boolean): { text: string; chips: string[] } {
  switch (field) {
    case 'need':
      return {
        text: hi
          ? 'नमस्ते! मैं सारथी AI कोपायलट हूँ। आप किस क्षेत्र में सरकारी योजना खोज रहे हैं? शिक्षा, स्वास्थ्य, खेती, आवास, रोज़गार — कुछ भी बताइए।'
          : "Namaste! I'm Sarthi AI Copilot. What area are you looking for government schemes in? Education, health, farming, housing, employment — tell me anything.",
        chips: hi
          ? ['शिक्षा / छात्रवृत्ति', 'खेती / किसान', 'स्वास्थ्य / इलाज', 'नौकरी / कौशल', 'आवास / मकान', 'पेंशन / बुज़ुर्ग']
          : ['Education / Scholarship', 'Farming / Agriculture', 'Healthcare', 'Jobs / Skills', 'Housing', 'Pension / Senior'],
      }
    case 'profession':
      return {
        text: hi ? 'आप क्या काम करते हैं? आपका पेशा बताइए।' : 'What is your profession or occupation?',
        chips: hi
          ? ['किसान', 'छात्र', 'व्यापारी', 'मजदूर', 'गृहिणी', 'नौकरी (प्राइवेट)', 'सेवानिवृत्त', 'बेरोज़गार']
          : ['Farmer', 'Student', 'Business owner', 'Daily wage worker', 'Homemaker', 'Private employee', 'Retired', 'Unemployed'],
      }
    case 'age':
      return {
        text: hi ? 'आपकी उम्र कितनी है?' : 'How old are you?',
        chips: hi
          ? ['18–25 साल', '25–35 साल', '35–50 साल', '50–60 साल', '60 से ऊपर']
          : ['18–25 years', '25–35 years', '35–50 years', '50–60 years', 'Above 60'],
      }
    case 'state':
      return {
        text: hi ? 'आप किस राज्य में रहते हैं?' : 'Which state do you live in?',
        chips: hi
          ? ['पंजाब', 'हरियाणा', 'उत्तर प्रदेश', 'बिहार', 'राजस्थान', 'महाराष्ट्र', 'दिल्ली', 'अन्य']
          : ['Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Maharashtra', 'Delhi', 'Other'],
      }
    case 'income':
      return {
        text: hi ? 'आपकी अनुमानित वार्षिक घरेलू आय कितनी है?' : 'What is your approximate annual household income?',
        chips: hi
          ? ['₹1,00,000 से कम', '₹1,00,000 – ₹2,50,000', '₹2,50,000 – ₹5,00,000', '₹5,00,000 से ऊपर']
          : ['Below ₹1,00,000', '₹1,00,000 – ₹2,50,000', '₹2,50,000 – ₹5,00,000', 'Above ₹5,00,000'],
      }
    default:
      return { text: '', chips: [] }
  }
}

export function ChatClient({ initialQuery, fullScreen = false }: { initialQuery?: string; fullScreen?: boolean }) {
  const router = useRouter()
  const { language, setLanguage } = useUiPreferences()
  const hi = language === 'hi'
  const [profile, setProfile] = useState<UserProfile>({})
  const [sessionProfile, setSessionProfile] = useState<any>({})
  const [messages, setMessages] = useState<Msg[]>([])

  const [value, setValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const [recording, setRecording] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const [voiceLanguage, setVoiceLanguage] = useState<'हिंदी' | 'English' | 'Hinglish'>('हिंदी')
  const endRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finalTranscriptRef = useRef('')
  const stoppingRef = useRef(false)
  const initRef = useRef(false)

  // Initialize conversation with the first question
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    const firstQ = getQuestion('need', language === 'hi')
    setMessages([{ id: 'm0', role: 'sarthi', text: firstQ.text, chips: firstQ.chips }])
  }, [language])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  useEffect(() => () => {
    stoppingRef.current = true
    recognitionRef.current?.abort()
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
  }, [])

  const sendToBackend = async (text: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/chat/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: hi ? 'hi' : 'en',
          citizenProfile: Object.keys(sessionProfile).length > 0 ? sessionProfile : undefined
        })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.citizenProfile) setSessionProfile(data.citizenProfile)
        return data
      }
    } catch (e) {
      console.warn('Backend server offline:', e)
    }
    return null
  }

  const processInput = async (text: string, currentProfile: UserProfile) => {
    // Parse input locally
    const parsed = parseInput(text)

    // Also try direct state/age matching for chip inputs
    if (!parsed.state) {
      const direct = text.trim()
      if (STATE_MAP[direct.toLowerCase()]) parsed.state = STATE_MAP[direct.toLowerCase()]
      for (const [key, val] of Object.entries(STATE_MAP)) {
        if (direct.toLowerCase() === key || direct === val) { parsed.state = val; break }
      }
    }

    if (!parsed.age) {
      const rangeMatch = text.match(/(\d{1,3})\s*[–-]\s*(\d{1,3})/)
      if (rangeMatch) {
        parsed.age = Math.round((parseInt(rangeMatch[1], 10) + parseInt(rangeMatch[2], 10)) / 2)
      }
      if (/above|ऊपर/i.test(text)) {
        const aboveMatch = text.match(/(\d{1,3})/)
        if (aboveMatch) parsed.age = parseInt(aboveMatch[1], 10) + 5
      }
    }

    if (!parsed.income) {
      if (/below|कम|से कम/i.test(text)) {
        const m = text.replace(/,/g, '').match(/(\d{4,})/)
        if (m) parsed.income = Math.round(parseInt(m[1], 10) * 0.7)
      } else if (/above|ऊपर/i.test(text)) {
        const m = text.replace(/,/g, '').match(/(\d{4,})/)
        if (m) parsed.income = Math.round(parseInt(m[1], 10) * 1.3)
      } else {
        const rangeM = text.replace(/,/g, '').match(/(\d{4,})\s*[–-]\s*[₹]?\s*(\d{4,})/)
        if (rangeM) parsed.income = Math.round((parseInt(rangeM[1], 10) + parseInt(rangeM[2], 10)) / 2)
      }
    }

    if (!parsed.profession) {
      for (const [prof, keywords] of Object.entries(PROFESSION_KEYWORDS)) {
        if (keywords.some((k) => text.toLowerCase().includes(k)) || text.toLowerCase().trim() === prof.toLowerCase()) {
          parsed.profession = prof
          break
        }
      }
    }

    if (!parsed.need) {
      for (const [need, keywords] of Object.entries(NEED_KEYWORDS)) {
        if (keywords.some((k) => text.toLowerCase().includes(k))) {
          parsed.need = need
          break
        }
      }
      const categories = ['Education', 'Agriculture', 'Healthcare', 'Housing', 'Employment', 'Business', 'Senior Citizens', 'Women & Child']
      for (const cat of categories) {
        if (text.toLowerCase().includes(cat.toLowerCase())) { parsed.need = cat; break }
      }
    }

    // Merge with current profile
    const newProfile = { ...currentProfile, ...parsed }
    setProfile(newProfile)

    // Call RAG backend
    const backendData = await sendToBackend(text)

    // Find next missing field
    const nextField = getNextMissingField(newProfile)

    if (backendData && backendData.reply) {
      setMessages((m) => [
        ...m,
        {
          id: `s${Date.now()}`,
          role: 'sarthi',
          text: backendData.reply,
          citation: backendData.citations?.[0] ? { source: backendData.citations[0].source, page: backendData.citations[0].clause } : undefined,
          schemeIds: backendData.topScheme?.id ? [backendData.topScheme.id] : undefined,
        }
      ])
    } else if (nextField) {
      const question = getQuestion(nextField, hi)
      const confirmText = Object.keys(parsed).length > 0 ? (hi ? '✓ समझ गया। ' : '✓ Got it. ') : ''
      setMessages((m) => [
        ...m,
        {
          id: `s${Date.now()}`,
          role: 'sarthi',
          text: confirmText + question.text,
          chips: question.chips,
        },
      ])
    } else {
      const results = matchSchemes(newProfile)
      const summary = buildProfileSummary(newProfile)
      if (results.length > 0) {

        setMessages((m) => [
          ...m,
          {
            id: `s${Date.now()}`,
            role: 'sarthi',
            text: hi
              ? `आपकी प्रोफ़ाइल (${summary.hi}) के आधार पर, मुझे ${results.length} योजनाएँ मिलीं जो आपके लिए उपयुक्त हो सकती हैं:`
              : `Based on your profile (${summary.en}), I found ${results.length} schemes that may be relevant to you:`,
            schemeIds: results.map((r) => r.scheme.id),
            matchResults: results,
            profileSummary: summary,
            followUps: hi
              ? ['मुझे कौन से दस्तावेज़ चाहिए?', 'मेरे परिवार के लिए योजनाएँ', 'अलग जानकारी से फिर खोजें']
              : ['Which documents do I need?', 'Schemes for my family', 'Search again with different info'],
          },
        ])
      } else {
        setMessages((m) => [
          ...m,
          {
            id: `s${Date.now()}`,
            role: 'sarthi',
            text: hi
              ? `आपकी प्रोफ़ाइल (${summary.hi}) के आधार पर, अभी हमारे डेटाबेस में सटीक मिलान नहीं मिला। कृपया अलग जानकारी से खोजें या सभी योजनाएँ ब्राउज़ करें।`
              : `Based on your profile (${summary.en}), I couldn't find exact matches in our database right now. Try searching with different info or browse all schemes.`,
            followUps: hi
              ? ['सभी योजनाएँ देखें', 'अलग जानकारी से फिर खोजें']
              : ['Browse all schemes', 'Search again with different info'],
          },
        ])
      }
    }
  }

  const send = (raw?: string) => {
    const text = (raw ?? value).trim()
    if (!text) return
    setValue('')

    // Handle "Search again" / reset
    if (text.includes('फिर खोजें') || text.includes('Search again')) {
      setProfile({})
      const firstQ = getQuestion('need', hi)
      setMessages([{ id: `m${Date.now()}`, role: 'sarthi', text: firstQ.text, chips: firstQ.chips }])
      return
    }
    if (text.includes('सभी योजनाएँ') || text.includes('Browse all')) {
      router.push('/explore')
      return
    }

    setMessages((m) => [...m, { id: `u${Date.now()}`, role: 'user', text }])
    setThinking(true)

    // Simulate processing delay
    window.setTimeout(() => {
      setThinking(false)
      processInput(text, profile)
    }, 800)
  }

  /* ---- SPEECH ---- */
  const toggleRecording = () => {
    if (recording) {
      stoppingRef.current = true
      recognitionRef.current?.stop()
      return
    }
    const SpeechRecognitionCtor = (
      window as unknown as Record<string, unknown>
    ).SpeechRecognition ?? (
      window as unknown as Record<string, unknown>
    ).webkitSpeechRecognition
    if (!SpeechRecognitionCtor) {
      setVoiceError(hi ? 'आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता। कृपया Google Chrome उपयोग करें।' : 'Voice input is not supported in this browser. Please use Google Chrome.')
      return
    }
    const recognition = new (SpeechRecognitionCtor as new () => BrowserSpeechRecognition)()
    recognition.lang = voiceLanguage === 'English' ? 'en-IN' : 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = true
    stoppingRef.current = false
    finalTranscriptRef.current = value
    recognition.onresult = (event) => {
      let interim = ''
      let finalText = ''
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) finalText += result[0].transcript
        else interim += result[0].transcript
      }
      if (finalText) finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + finalText.trim()
      setValue(finalTranscriptRef.current + (interim ? (finalTranscriptRef.current ? ' ' : '') + interim : ''))
      setVoiceError('')
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => { stoppingRef.current = true; recognitionRef.current?.stop() }, 4000)
    }
    recognition.onend = () => {
      if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null }
      if (!stoppingRef.current && recording) { try { recognition.start(); return } catch { /* fall through */ } }
      setRecording(false)
      recognitionRef.current = null
    }
    recognition.onerror = (event) => {
      if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null }
      if (event.error === 'no-speech' || event.error === 'aborted') return
      stoppingRef.current = true
      setRecording(false)
      recognitionRef.current = null
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceError(hi ? 'माइक्रोफ़ोन की अनुमति अवरुद्ध है। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।' : 'Microphone permission blocked. Allow access in browser settings.')
      } else {
        setVoiceError(hi ? 'आवाज़ नहीं मिल सकी। कृपया फिर कोशिश करें।' : 'Could not hear you. Please try again.')
      }
    }
    recognitionRef.current = recognition
    setVoiceError('')
    setRecording(true)
    try { recognition.start() } catch { setRecording(false); recognitionRef.current = null; setVoiceError(hi ? 'वॉइस शुरू नहीं हो सका।' : 'Could not start voice.') }
  }

  /* ---- RENDER ---- */
  return (
    <div className={cn('flex w-full gap-6', fullScreen ? 'h-svh p-4 sm:p-6' : 'h-[calc(100svh-4rem)]')}>
      {/* Left Sidebar — Profile being built */}
      <aside className="hidden lg:flex lg:w-80 xl:w-96 flex-col gap-5 border-r border-border/80 pr-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <User className="size-4 text-saffron" />
            {hi ? 'आपकी प्रोफ़ाइल' : 'Your Profile'}
          </p>
          <Badge variant="outline" className="text-[0.6875rem] font-semibold text-saffron border-saffron/30">
            {hi ? 'निर्माण में' : 'Building...'}
          </Badge>
        </div>

        <Card className="bg-card/70 border-border/80">
          <CardContent className="flex flex-col gap-3 p-4">

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {hi ? 'एकत्रित जानकारी' : 'Collected Information'}
            </p>
            <div className="grid gap-2 text-sm">
              {([
                ['need', hi ? 'ज़रूरत' : 'Need', profile.need],
                ['profession', hi ? 'पेशा' : 'Profession', profile.profession],
                ['age', hi ? 'आयु' : 'Age', profile.age ? `${profile.age} ${hi ? 'वर्ष' : 'years'}` : undefined],
                ['state', hi ? 'राज्य' : 'State', profile.state],
                ['income', hi ? 'आय' : 'Income', profile.income ? `₹${profile.income.toLocaleString('en-IN')}` : undefined],
              ] as const).map(([key, label, val]) => (
                <div key={key} className={cn('flex items-center justify-between rounded-lg px-3 py-2', val ? 'bg-success-soft/50 ring-1 ring-success/20' : 'bg-secondary/50 ring-1 ring-border/50')}>
                  <span className="text-xs text-muted-foreground">{label}</span>
                  {val ? (
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-success" />
                      {val}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/60 italic">{hi ? 'अभी नहीं' : 'Pending'}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="size-3.5 text-saffron" />
            {hi ? 'कैसे काम करता है' : 'How it works'}
          </p>
          {[
            { n: '1', en: 'Tell me your situation in your own words', hi: 'अपनी स्थिति अपने शब्दों में बताएँ' },
            { n: '2', en: 'I\'ll ask follow-up questions as needed', hi: 'मैं ज़रूरत अनुसार सवाल पूछूँगा' },
            { n: '3', en: 'See matching schemes with eligibility details', hi: 'पात्रता विवरण के साथ मिलती योजनाएँ देखें' },
          ].map((step) => (
            <div key={step.n} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3 ring-1 ring-border/50 text-xs">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-saffron text-primary-foreground font-bold text-[0.625rem]">{step.n}</span>
              <span className="text-foreground">{hi ? step.hi : step.en}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Conversation */}
      <div className="flex flex-1 flex-col h-full min-w-0">
        <div className="flex items-center justify-between gap-3 border-b border-border py-3">
          <div className="flex items-center gap-2.5">
            <SarthiMark className="size-8" />
            <div>
              <p className="text-base font-bold text-foreground">{hi ? 'सारथी AI स्टूडियो' : 'Sarthi AI Studio'}</p>
              <p className="text-xs text-muted-foreground">{hi ? 'आपकी जानकारी से योजनाएँ खोजता है' : 'Finds schemes based on YOUR information'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {fullScreen && (
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => router.back()}>
                <ArrowLeft className="size-4" />{hi ? 'वापस' : 'Back'}
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1.5 font-semibold" onClick={() => {
              setProfile({})
              const firstQ = getQuestion('need', hi)
              setMessages([{ id: `m${Date.now()}`, role: 'sarthi', text: firstQ.text, chips: firstQ.chips }])
            }}>
              <Plus className="size-4" />{hi ? 'नई खोज' : 'New Search'}
            </Button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto py-6 pr-2">
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[75%] rounded-2xl rounded-br-md bg-primary px-5 py-3 text-sm leading-relaxed text-primary-foreground shadow-sm">{m.text}</p>
              </div>
            ) : (
              <div key={m.id} className="flex gap-4">
                <SarthiMark className="mt-0.5 size-8 shrink-0" />
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="rounded-2xl rounded-tl-md bg-card p-5 ring-1 ring-foreground/10 shadow-xs prose prose-sm dark:prose-invert max-w-none text-base leading-relaxed text-pretty">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                    {m.citation && (
                      <SourceCitation
                        source={m.citation.source || 'Official Policy'}
                        page={m.citation.page}
                        className="mt-4 border-t border-border pt-3"
                      />
                    )}
                    {m.profileSummary && (
                      <div className="mt-3 rounded-lg bg-secondary/70 px-3 py-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{hi ? 'प्रोफ़ाइल: ' : 'Profile: '}</span>
                        {hi ? m.profileSummary.hi : m.profileSummary.en}
                      </div>
                    )}
                  </div>

                  {m.chips && (
                    <div className="flex flex-wrap gap-2">
                      {m.chips.map((c) => (
                        <button key={c} type="button" onClick={() => send(c)} className="rounded-full bg-card px-4 py-2 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10 transition-all hover:bg-saffron-soft hover:text-accent-foreground hover:ring-saffron/40 min-h-[36px]">
                          {c}
                        </button>
                      ))}
                    </div>
                  )}

                  {m.matchResults && (
                    <ul className="grid gap-4 md:grid-cols-2">
                      {m.matchResults.map((result) => (
                        <li key={result.scheme.id}>
                          <Card className="h-full transition-all hover:ring-foreground/20 hover:shadow-sm">
                            <CardContent className="flex flex-col gap-2.5 p-4">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-semibold leading-snug">
                                  <Link href={`/scheme/${result.scheme.id}`} className="hover:text-saffron">
                                    {hi ? result.scheme.nameHi : result.scheme.name}
                                  </Link>
                                </h3>
                                <Badge variant="outline" className="text-[0.625rem] shrink-0">{result.scheme.level}</Badge>
                              </div>
                              <div className="flex items-baseline gap-2 rounded-lg bg-saffron-soft px-3 py-2">
                                <span className="text-base font-semibold text-accent-foreground">{result.scheme.benefit}</span>
                              </div>
                              <ul className="space-y-1">
                                {(hi ? result.reasonsHi : result.reasons).map((r, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                    <CheckCircle2 className="size-3 text-success shrink-0 mt-0.5" />
                                    {r}
                                  </li>
                                ))}
                              </ul>
                              <Button size="sm" className="mt-1" render={<Link href={`/scheme/${result.scheme.id}`} />}>
                                {hi ? 'विवरण देखें' : 'View details'}
                              </Button>
                            </CardContent>
                          </Card>
                        </li>
                      ))}
                    </ul>
                  )}

                  {m.followUps && (
                    <div className="flex flex-wrap gap-2">
                      {m.followUps.map((f) => (
                        <button key={f} type="button" onClick={() => send(f)} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-saffron-soft hover:text-accent-foreground min-h-[36px]">
                          <Sparkles className="size-3.5 text-saffron" />{f}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1 pt-1">
                    <Button variant="ghost" size="icon-xs" aria-label="Read aloud"><Volume2 /></Button>
                    <Button variant="ghost" size="icon-xs" aria-label="Helpful"><ThumbsUp /></Button>
                    <Button variant="ghost" size="icon-xs" aria-label="Not helpful"><ThumbsDown /></Button>
                    <Button variant="ghost" size="icon-xs" aria-label="Regenerate"><RotateCcw /></Button>
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
                    <span key={i} className="size-2 animate-bounce rounded-full bg-saffron" style={{ animationDelay: `${i * 130}ms` }} />
                  ))}
                </span>
                <span className="text-sm font-medium text-muted-foreground">{hi ? 'आपकी जानकारी विश्लेषण कर रहे हैं...' : 'Analyzing your information...'}</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-0 bg-background pt-3 pb-4">
          <form onSubmit={(e) => { e.preventDefault(); send() }} className="rounded-2xl bg-card p-3 ring-1 ring-foreground/12 shadow-lg focus-within:ring-2 focus-within:ring-ring/60">
            <label htmlFor="chat-input" className="sr-only">{hi ? 'सारथी से बात करें' : 'Talk to Sarthi'}</label>
            <textarea
              id="chat-input"
              rows={2}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); send() } }}
              placeholder={hi ? 'अपनी जानकारी यहाँ लिखें — पेशा, उम्र, राज्य, आय...' : 'Type your info — profession, age, state, income...'}
              className="w-full resize-none bg-transparent px-3 py-2 text-base leading-relaxed placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex items-center justify-between gap-2 px-1 pt-1">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { const next = language === 'en' ? 'hi' : 'en'; setLanguage(next); setProfile({}); const q = getQuestion('need', next === 'hi'); setMessages([{ id: `m${Date.now()}`, role: 'sarthi', text: q.text, chips: q.chips }]) }} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Languages className="size-4" />
                  <span className={cn(hi && 'text-hi')}>{hi ? 'हिन्दी' : 'English'}</span>
                </button>
                <button type="button" onClick={() => setVoiceLanguage((c) => c === 'हिंदी' ? 'English' : c === 'English' ? 'Hinglish' : 'हिंदी')} className="inline-flex h-8 items-center rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" title={hi ? 'आवाज़ की भाषा बदलें' : 'Change voice language'}>
                  {voiceLanguage === 'हिंदी' ? (hi ? 'हिंदी' : 'Hindi') : voiceLanguage === 'English' ? (hi ? 'अंग्रेज़ी' : 'English') : (hi ? 'हिंग्लिश' : 'Hinglish')}
                </button>
                <button type="button" onClick={toggleRecording} aria-pressed={recording} aria-label={recording ? 'Stop recording' : 'Start voice input'} className={cn('inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium', recording ? 'animate-pulse bg-destructive/10 text-destructive' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                  {recording ? (<><Square className="size-3.5 fill-current" />{hi ? 'सुन रहे हैं...' : 'Listening...'}</>) : (<><Mic className="size-4" />{hi ? 'आवाज़ इनपुट' : 'Voice Input'}</>)}
                </button>
              </div>
              <Button type="submit" size="icon-lg" aria-label="Send message"><ArrowUp /></Button>
            </div>
          </form>
          {voiceError && <p className="mt-2 text-center text-xs font-medium text-destructive">{voiceError}</p>}
          <p className="mt-2 text-center text-xs text-muted-foreground">{hi ? 'सारथी आपकी जानकारी के आधार पर योजनाएँ खोजता है। आवेदन से पहले आधिकारिक पोर्टल पर सत्यापित करें।' : 'Sarthi finds schemes based on your info. Always verify on official portals before applying.'}</p>
        </div>
      </div>
    </div>
  )
}
