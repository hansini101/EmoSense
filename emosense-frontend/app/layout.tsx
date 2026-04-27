import type { Metadata, Viewport } from 'next'
import { Inter, Nunito } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'EmoSense - AI-Powered Emotion Wellness',
  description: 'EmoSense helps university students understand their emotions through AI-powered detection and personalized wellness recommendations. Talk to Luma, your AI therapist.',
  keywords: ['emotion detection', 'mental health', 'AI therapist', 'student wellness', 'mood tracking'],
  icons: {
    icon: '/emosense-logo.png',
    shortcut: '/emosense-logo.png',
    apple: '/emosense-logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDFBFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${nunito.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
