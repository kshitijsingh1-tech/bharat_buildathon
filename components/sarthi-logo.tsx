'use client'

import { cn } from '@/lib/utils'
import { useUiPreferences } from '@/components/ui-preferences'

export function SarthiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('size-8', className)}
    >
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path
        d="M16 6.5a9.5 9.5 0 1 0 9.5 9.5"
        stroke="var(--saffron)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M11.6 20.4 20.4 11.6M20.4 11.6h-4.6M20.4 11.6v4.6"
        stroke="var(--primary-foreground)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SarthiLogo({
  className,
  showTagline = true,
}: {
  className?: string
  showTagline?: boolean
}) {
  const { language } = useUiPreferences()
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <SarthiMark />
      <span className="flex flex-col leading-none">
        <span className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
          Sarthi
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[0.6875rem] font-medium text-muted-foreground">
            {language === 'hi' ? 'सरकारी लाभ सहायक' : 'Government Benefits Copilot'}
          </span>
        )}
      </span>
    </span>
  )
}
