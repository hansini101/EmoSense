"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage, type Language } from "@/lib/language-context"
import {
  ArrowLeft,
  Brain,
  Heart,
  Shield,
  Users,
  Target,
  Camera,
  MessageCircle,
  BarChart3,
  ArrowRight,
  AlertTriangle,
} from "lucide-react"

type AboutCopy = {
  title: string
  subtitle: string
  missionTitle: string
  missionBody: string
  valuesTitle: string
  featuresTitle: string
  disclaimerTitle: string
  disclaimerBody: string
  cta: string
  values: Array<{ icon: typeof Heart; title: string; description: string }>
  features: Array<{ icon: typeof Camera; title: string; description: string }>
}

const copy: Record<Language, AboutCopy> = {
  en: {
    title: "About EmoSense",
    subtitle: "Our mission, values, and what makes us different",
    missionTitle: "Our Mission",
    missionBody:
      "EmoSense empowers university students to understand, track, and improve their emotional wellbeing through AI-powered emotion detection, personalized wellness tools, and accessible mental health resources — all within a safe, private, and supportive platform.",
    valuesTitle: "Our Values",
    featuresTitle: "Key Features",
    disclaimerTitle: "Important Disclaimer",
    disclaimerBody:
      "EmoSense is an educational and wellness support tool, NOT a substitute for professional mental health services. The AI emotion detection and Luma AI therapist are designed to provide general wellness support and should not be relied upon for clinical diagnosis or treatment. If you are experiencing a mental health crisis, please contact emergency services or call the national helpline at 1926.",
    cta: "Get Started with EmoSense",
    values: [
      { icon: Heart, title: "Empathy First", description: "Every feature is designed with empathy and care, ensuring students feel supported and understood." },
      { icon: Shield, title: "Privacy by Design", description: "Your data is encrypted and never shared. We believe your emotional data belongs to you alone." },
      { icon: Users, title: "Student-Centered", description: "Built specifically for university students aged 16-30, addressing the unique challenges of student life." },
      { icon: Target, title: "Evidence-Based", description: "Our wellness recommendations are grounded in psychological research and proven therapeutic techniques." },
    ],
    features: [
      { icon: Camera, title: "Emotion Detection", description: "AI-powered facial expression analysis with real-time results" },
      { icon: MessageCircle, title: "Luma AI Therapist", description: "24/7 AI companion for personalized emotional support" },
      { icon: BarChart3, title: "Mood Tracking", description: "Visualize and understand your emotional patterns over time" },
      { icon: Heart, title: "Wellness Hub", description: "Breathing exercises, journaling, playlists, and outdoor activities" },
    ],
  },
  si: {
    title: "EmoSense ගැන",
    subtitle: "අපගේ මෙහෙවර, වටිනාකම්, සහ අපව වෙනස් කරන දේ",
    missionTitle: "අපගේ මෙහෙවර",
    missionBody:
      "EmoSense විශ්වවිද්‍යාල සිසුන්ට AI-මඟින් සක්‍රිය වූ හැඟීම් හඳුනාගැනීම, පුද්ගලික සුවතා මෙවලම්, සහ ප්‍රවේශ විය හැකි මානසික සෞඛ්‍ය සම්පත් හරහා ඔවුන්ගේ චිත්තවේගීය යහපැවැත්ම තේරුම් ගැනීමට, නිරීක්ෂණය කිරීමට, සහ වැඩිදියුණු කිරීමට ශක්තිය ලබාදේ — ආරක්ෂිත, පෞද්ගලික, සහ සහාය දෙන වේදිකාවක් තුළ.",
    valuesTitle: "අපගේ වටිනාකම්",
    featuresTitle: "ප්‍රධාන විශේෂාංග",
    disclaimerTitle: "වැදගත් වියාචනය",
    disclaimerBody:
      "EmoSense යනු අධ්‍යාපනික සහ සුවතා සහාය මෙවලමක් වන අතර වෘත්තීය මානසික සෞඛ්‍ය සේවාවන්ට ආදේශකයක් නොවේ. AI හැඟීම් හඳුනාගැනීම සහ Luma AI therapist සාමාන්‍ය සුවතා සහාය ලබා දීමට නිර්මාණය කර ඇති අතර සායනික රෝග විනිශ්චය හෝ ප්‍රතිකාර සඳහා යොදා නොගත යුතුය. ඔබට මානසික අර්බුදයක් තිබේ නම්, කරුණාකර හදිසි සේවා අමතන්න හෝ 1926 ජාතික helpline අමතන්න.",
    cta: "EmoSense සමඟ ආරම්භ කරන්න",
    values: [
      { icon: Heart, title: "සංවේදනය ප්‍රථමයෙන්", description: "සෑම විශේෂාංගයක්ම සංවේදනය සහ සැලකිල්ලෙන් නිර්මාණය කර ඇති අතර, සිසුන්ට සහාය හා අවබෝධය දැනේ." },
      { icon: Shield, title: "නිර්මාණයෙන්ම පෞද්ගලිකත්වය", description: "ඔබගේ දත්ත සංකේතනය කර ඇති අතර කිසිවිටෙක බෙදා නොගනී. ඔබගේ චිත්තවේගීය දත්ත ඔබටම අයත් බව අපි විශ්වාස කරනවා." },
      { icon: Users, title: "සිසුන් කේන්ද්‍රීය", description: "විශේෂයෙන්ම විශ්වවිද්‍යාල සිසුන් සඳහා, සිසු ජීවිතයේ විශේෂ අභියෝගවලට පිළිතුරු සපයමින් නිර්මාණය කර ඇත." },
      { icon: Target, title: "සාක්ෂි මත පදනම්ව", description: "අපගේ සුවතා නිර්දේශ මනෝවිද්‍යාත්මක පර්යේෂණ සහ ඔප්පු කර ඇති චිකිත්සක ක්‍රම මත පදනම්ව ඇත." },
    ],
    features: [
      { icon: Camera, title: "හැඟීම් හඳුනාගැනීම", description: "AI-මඟින් සක්‍රිය වූ මුහුණේ ප්‍රකාශ විශ්ලේෂණය සහ තත්‍ය කාලීන ප්‍රතිඵල" },
      { icon: MessageCircle, title: "Luma AI Therapist", description: "පුද්ගලික චිත්තවේගීය සහාය සඳහා 24/7 AI සහකාරිය" },
      { icon: BarChart3, title: "මනෝභාවය නිරීක්ෂණය", description: "කාලයත් සමඟ ඔබගේ චිත්තවේගීය රටා දෘශ්‍යමාන කර තේරුම් ගන්න" },
      { icon: Heart, title: "සුවතා මධ්‍යස්ථානය", description: "හුස්ම ව්‍යායාම, ජර්නල් කිරීම, playlists, සහ එළිමහන් ක්‍රියාකාරකම්" },
    ],
  },
}

export default function AboutPage() {
  const { language } = useLanguage()
  const page = copy[language]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
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

      {/* Mission */}
      <div className="mb-12 rounded-2xl bg-primary/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          {page.missionTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {page.missionBody}
        </p>
      </div>

      {/* Values */}
      <h2 className="mb-6 text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{page.valuesTitle}</h2>
      <div className="mb-12 grid gap-4 sm:grid-cols-2">
        {page.values.map((value) => (
          <Card key={value.title}>
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <value.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{value.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Overview */}
      <h2 className="mb-6 text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{page.featuresTitle}</h2>
      <div className="mb-12 grid gap-4 sm:grid-cols-2">
        {page.features.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3 rounded-lg border border-border p-4">
            <feature.icon className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <Card className="mb-8 border-destructive/20 bg-destructive/5">
        <CardContent className="flex items-start gap-4 p-5">
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
          <div>
            <h3 className="font-semibold text-foreground">{page.disclaimerTitle}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {page.disclaimerBody}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Link href="/register">
          <Button size="lg" className="gap-2">
            {page.cta} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
