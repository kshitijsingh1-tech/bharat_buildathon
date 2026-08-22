import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Noto_Sans_Devanagari } from 'next/font/google'
import './globals.css'
import { UiPreferencesProvider } from '@/components/ui-preferences'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const notoDeva = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-deva',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sarthi — Your Government Benefits Copilot',
  description:
    'Discover government schemes, understand why you qualify, get your documents ready and track applications. Every important answer grounded in an official source.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${notoDeva.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        <UiPreferencesProvider>{children}</UiPreferencesProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
