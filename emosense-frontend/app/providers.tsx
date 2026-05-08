'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { LanguageProvider } from '@/lib/language-context'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}
