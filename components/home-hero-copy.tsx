'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiPreferences } from '@/components/ui-preferences'

export function HomeHeroCopy() {
  const { language } = useUiPreferences()
  const hi = language === 'hi'

  return <>
    <h1 className="text-4xl leading-[1.06] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
      {hi ? 'सरकारी योजनाएँ,' : 'Government schemes,'}{' '}
      <span className="bg-gradient-to-r from-saffron to-amber-600 bg-clip-text text-transparent">
        {hi ? 'अब आपके लिए आसान।' : 'explained for YOU.'}
      </span>
    </h1>
    <p className="max-w-3xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg lg:text-xl">
      {hi ? 'अपनी ज़रूरत के बारे में सारथी को लिखें या बोलें। सारथी आपके लिए सही योजनाएँ खोजेगा, पात्रता जाँचेगा, दस्तावेज़ बताएगा और आवेदन में मार्गदर्शन देगा।' : "Tell Sarthi about your needs in natural language or voice. We'll find relevant schemes across Central & State departments, check your eligibility rule by rule, and guide your application."}
    </p>
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <Button size="lg" className="h-12 px-6 text-base font-semibold shadow-md shadow-primary/10 transition-all hover:scale-[1.01]" render={<Link href="/benefits" />}>
        {hi ? 'मेरी योजनाएँ खोजें' : 'Find Schemes for Me'}<ArrowRight className="size-4" />
      </Button>
      <Button size="lg" variant="outline" className="h-12 px-6 text-base font-medium transition-all hover:bg-secondary" render={<Link href="/eligibility" />}>
        <CheckCircle2 className="size-4 text-saffron" />{hi ? 'मेरी पात्रता जाँचें' : 'Check My Eligibility'}
      </Button>
      <Button size="lg" variant="ghost" className="h-12 px-5 text-base font-medium text-muted-foreground hover:text-foreground" render={<Link href="/explore" />}>
        <Compass className="size-4" />{hi ? 'योजनाएँ देखें' : 'Browse Catalog'}
      </Button>
    </div>
  </>
}
