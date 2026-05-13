"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Lock,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Shield,
  Database,
  UserCheck,
} from "lucide-react"
import { useLanguage, type Language } from "@/lib/language-context"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45 },
  }),
}

type PrivacyEthicsCopy = {
  title: string
  subtitle: string
  disclaimerTitle: string
  disclaimerBody: string
  privacyTitle: string
  cards: Array<{ icon: typeof Lock; title: string; description: string; bullets: string[] }>
}

const copy: Record<Language, PrivacyEthicsCopy> = {
  en: {
    title: "Privacy & Ethical AI",
    subtitle: "Your data, your control, responsible AI",
    disclaimerTitle: "Not a Medical Tool",
    disclaimerBody:
      "EmoSense is a wellness and reflection tool, not a medical device or substitute for professional mental health care. If you're experiencing mental health concerns, please contact a healthcare professional or therapist. In emergencies, always call emergency services.",
    privacyTitle: "Your Privacy, Protected",
    cards: [
      {
        icon: Lock,
        title: "End-to-End Encryption",
        description: "Your emotions and data are encrypted in transit and at rest",
        bullets: [
          "All data transmitted over HTTPS with TLS 1.3 encryption",
          "Your conversation with Luma is private and not shared with third parties",
          "Emotion detection happens locally on your device when possible",
        ],
      },
      {
        icon: Database,
        title: "Data Minimization",
        description: "We only collect what's necessary for your wellness",
        bullets: [
          "We don't store photos or video feeds—only emotion classifications",
          "No tracking of your location, device ID, or browsing behavior",
          "No third-party cookies or analytics scripts",
        ],
      },
      {
        icon: Shield,
        title: "Controlled Sharing",
        description: "Your data stays under your control",
        bullets: [
          "Aggregated anonymous insights may help improve university support services",
          "Your individual data is never shared without explicit consent",
          "You can delete your data from settings whenever you choose",
        ],
      },
      {
        icon: UserCheck,
        title: "User Rights",
        description: "You can view, export, and delete your data",
        bullets: [
          "Access your stored data from your Privacy & Data page",
          "Export personal data in a readable format",
          "Request permanent deletion of your account data",
        ],
      },
    ],
  },
  si: {
    title: "පුද්ගලිකත්වය සහ සදාචාරාත්මක AI",
    subtitle: "ඔබගේ දත්ත, ඔබගේ පාලනය, වගකිවයුතු AI",
    disclaimerTitle: "වෛද්‍ය මෙවලමක් නොවේ",
    disclaimerBody:
      "EmoSense යනු සුවතා සහ ස්වයං-පරාවර්තන මෙවලමක් වන අතර වෛද්‍ය උපකරණයක් හෝ වෘත්තීය මානසික සෞඛ්‍ය රැකවරණයකට ආදේශකයක් නොවේ. ඔබට මානසික ගැටලු ඇති නම්, කරුණාකර සෞඛ්‍ය වෘත්තිකයෙකු හෝ therapist කෙනෙකු සම්බන්ධ කරගන්න. හදිසි අවස්ථාවලදී හැමවිටම හදිසි සේවා අමතන්න.",
    privacyTitle: "ඔබගේ පුද්ගලිකත්වය ආරක්ෂිතයි",
    cards: [
      {
        icon: Lock,
        title: "අන්ත-සිට-අන්ත සංකේතනය",
        description: "ඔබගේ හැඟීම් සහ දත්ත ගමනාගමනයේදී සහ ගබඩාවේදී සංකේතනය කර ඇත",
        bullets: [
          "සියලු දත්ත HTTPS සහ TLS 1.3 සංකේතනය සමඟ යැවෙයි",
          "Luma සමඟ ඔබගේ සංවාද පෞද්ගලිකයි සහ තුන්වන පාර්ශව සමඟ බෙදා නොගනී",
          "හැකි තරම් emotion detection ඔබගේ උපාංගයේ දේශීයව සිදුවේ",
        ],
      },
      {
        icon: Database,
        title: "අවම දත්ත එකතු කිරීම",
        description: "ඔබගේ සුවතාවයට අවශ්‍ය දේ පමණක් අපි එකතු කරමු",
        bullets: [
          "අපි ඡායාරූප හෝ වීඩියෝ feed ගබඩා කරන්නේ නැහැ—හැඟීම් වර්ගීකරණ පමණි",
          "ඔබගේ ස්ථානය, device ID, හෝ browsing හැසිරීම නිරීක්ෂණය කරන්නේ නැහැ",
          "තුන්වන පාර්ශව cookies හෝ analytics scripts නැහැ",
        ],
      },
      {
        icon: Shield,
        title: "පාලිත බෙදාහැරීම",
        description: "ඔබගේ දත්ත ඔබගේ පාලනය යටතේ පවතී",
        bullets: [
          "සංයුක්ත, නාමරහිත අවබෝධයන් විශ්වවිද්‍යාල සහාය සේවාවන් වැඩිදියුණු කිරීමට උපකාරී විය හැක",
          "ඔබගේ තනි දත්ත ඔබගේ පැහැදිලි අවසරයකින් තොරව කිසිවිටෙක බෙදා නොගනී",
          "ඔබට අවශ්‍ය විට settings හරහා ඔබගේ දත්ත මකා දැමිය හැක",
        ],
      },
      {
        icon: UserCheck,
        title: "පරිශීලක අයිතිවාසිකම්",
        description: "ඔබට ඔබගේ දත්ත බැලීමට, export කිරීමට, සහ මකා දැමීමට හැකිය",
        bullets: [
          "ඔබගේ Privacy & Data පිටුවෙන් ගබඩා කළ දත්ත බලන්න",
          "පුද්ගලික දත්ත කියවිය හැකි ආකාරයෙන් export කරන්න",
          "ඔබගේ ගිණුම් දත්ත ස්ථිරව මකා දැමීමට ඉල්ලන්න",
        ],
      },
    ],
  },
}

export default function PrivacyEthicsPage() {
  const { language } = useLanguage()
  const page = copy[language]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {page.title}
          </h1>
          <p className="mt-1 text-muted-foreground">{page.subtitle}</p>
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        <Card className="border-yellow-200/50 bg-yellow-50/50 dark:border-yellow-900/30 dark:bg-yellow-950/20">
          <CardContent className="flex items-start gap-4 p-6">
            <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="font-bold text-foreground">{page.disclaimerTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{page.disclaimerBody}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-8">
        <h2 className="mb-6 text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          {page.privacyTitle}
        </h2>
        <div className="space-y-4">
          {page.cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index + 1}
              variants={fadeUp}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <card.icon className="h-5 w-5 text-primary" />
                    <CardTitle>{card.title}</CardTitle>
                  </div>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {card.bullets.map((bullet) => (
                    <p key={bullet}>• {bullet}</p>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
        <Eye className="h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">{language === "en" ? "Questions about your privacy?" : "ඔබගේ පුද්ගලිකත්වය ගැන ප්‍රශ්න තියෙනවාද?"}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {language === "en"
              ? <>For questions or concerns about your privacy, contact us at <Link href="/contact" className="text-primary hover:underline">privacy@emosense.app</Link>.</>
              : <>ඔබගේ පුද්ගලිකත්වය ගැන ප්‍රශ්න හෝ කරුණු තිබේ නම්, <Link href="/contact" className="text-primary hover:underline">privacy@emosense.app</Link> හරහා අප අමතන්න.</>}
          </p>
        </div>
      </div>
    </div>
  )
}
