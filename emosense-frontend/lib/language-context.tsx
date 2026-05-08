'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Language = 'en' | 'si'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome to your Wellness Hub',
    'dashboard.emotion': 'Check Your Emotion',
    'dashboard.chat': 'Chat with Luma',
    'dashboard.affirmation': 'Daily Affirmation',
    'dashboard.wellness': 'Wellness Activities',
    'dashboard.history': 'Emotion History',
    'dashboard.resources': 'Resources',
    'dashboard.settings': 'Settings',
    'dashboard.profile': 'Profile',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Log Out',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.email': 'Email',
    'auth.fullname': 'Full Name',
    'auth.already_member': 'Already have an account?',
    'auth.no_account': "Don't have an account?",
    'auth.login': 'Sign In to continue your wellness journey',
    'auth.register': 'Create Your Account',    'auth.forgot': 'Forgot password?',
    'auth.confirm_password': 'Confirm Password',    'emotion.title': 'Emotion Detection',
    'emotion.capture': 'Capture & Analyze',
    'emotion.upload': 'Upload Image',
    'emotion.analyze': 'Analyze Emotion',
    'emotion.reset': 'Reset',
    'emotion.result': 'Analysis Result',
    'luma.title': 'Luma - AI Wellness Companion',
    'luma.placeholder': "Tell Luma how you're feeling...",
    'luma.stressed': 'I feel stressed',
    'luma.relax': 'Help me relax',
    'luma.motivation': 'I need motivation',
    'luma.breathing': 'Breathing exercise',
    'luma.new_chat': 'New Chat',
    'luma.resources': 'Resources',
    'wellness.title': 'Wellness Hub',
    'wellness.activities': 'Activities and tools for your emotional wellbeing',
    'wellness.affirmation': 'Daily Affirmation',
    'wellness.breathing': 'Breathing Exercises',
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
  },
  si: {
    'dashboard.title': ' Dashboard එක',
    'dashboard.welcome': 'ඔබගේ Wellness Hub එකට සාදරයි',
    'dashboard.emotion': 'ඔබගේ හැඟීම පරීක්ෂා කරන්න',
    'dashboard.chat': 'Luma සමඟ කතා කරන්න',
    'dashboard.affirmation': 'දෛනික නිකුතුවල පෙනුම',
    'dashboard.wellness': 'Wellness කටයුතු',
    'dashboard.history': 'හැඟීම් ඉතිහාසය',
    'dashboard.resources': 'සම්පත්',
    'dashboard.settings': 'සැකසුම්',
    'dashboard.profile': 'පැතිකඩ',
    'auth.signin': 'ඇතුල් වන්න',
    'auth.signup': 'ලියාපදිංචි වන්න',
    'auth.logout': 'ඉවත් වන්න',
    'auth.username': 'භාවිතා නම',
    'auth.password': 'මුරපදය',
    'auth.email': 'ඉ-තැපෑල',
    'auth.fullname': 'සම්පූර්ණ නම',
    'auth.already_member': 'ඔබට දැනටමත් ගිණුමක් තිබේ ද?',
    'auth.no_account': 'ඔබට ගිණුමක් නොමැතිද?',
    'auth.login': 'ඔබගේ wellness ගමනෙන් ඉදිරියට යාමට ඇතුල් වන්න',
    'auth.register': 'ඔබගේ ගිණුම සාදන්න',
    'auth.forgot': 'මුරපදය අමතකයි ද?',
    'auth.confirm_password': 'මුරපදය තහවුරු කරන්න',
    'emotion.title': 'හැඟීම සනාក්ෂණය',
    'emotion.capture': 'ග්‍රහණ කරන්න & විශ්ලේෂණ කරන්න',
    'emotion.upload': 'පින්තූරය උඩුගත කරන්න',
    'emotion.analyze': 'හැඟීම විශ්ලේෂණ කරන්න',
    'emotion.reset': 'ප්‍රතිසිටුවන්න',
    'emotion.result': 'විශ්ලේෂණ ප්‍රතිඵලය',
    'luma.title': 'Luma - AI Wellness සহකරු',
    'luma.placeholder': 'Luma ට ඔබ කෙතරම් හැඟෙන්නේ ඒ කියන්න...',
    'luma.stressed': 'මම පීඩිතයි',
    'luma.relax': 'මට විශ්‍රාම ගැනීමට උදව් කරන්න',
    'luma.motivation': 'මට ප්‍රේරණය අවශ්‍යය',
    'luma.breathing': 'හුස්ම ව්‍යායාම',    'luma.new_chat': 'නව කතාව',
    'luma.resources': 'සම්පත්',    'wellness.title': 'Wellness Hub එක',
    'wellness.activities': 'ඔබගේ චිත්තවේගී යතුරුවර සඳහා කටයුතු සහ මෙවලම්',
    'wellness.affirmation': 'දෛනික නිකුතුවල පෙනුම',
    'wellness.breathing': 'හුස්ම ව්‍යායාම',
    'settings.title': 'සැකසුම්',
    'settings.appearance': 'පෙනුම',
    'settings.notifications': 'දැනුම්කිරීම්',
    'settings.privacy': 'පෞද්ගලිකත්වය',
    'settings.language': 'භාෂාව',
    'settings.theme': 'තේමාව',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'si')) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    // Return a default fallback during SSR/hydration
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key
    }
  }
  return context
}
