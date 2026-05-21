"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type Language, useLanguage } from "@/lib/language-context"
import {
  ArrowLeft,
  Send,
  Heart,
  Wind,
  Sparkles,
  BookOpen,
  RefreshCw,
} from "lucide-react"

type Message = {
  id: number
  role: "user" | "luma"
  content: string
  timestamp: string
}

const lumaCopy = {
  en: {
    initial:
      "Hi, I'm **Luma**. I'm here like a calm, supportive friend who listens and helps with feelings, stress, anxiety, sadness, and other mental-health concerns.\n\nTell me what's on your mind, and I’ll stay focused on your emotional wellbeing.",
    supportLine: "Luma supports emotional wellbeing and is not a replacement for professional mental health care.",
    supportLink: "Find professional support",
    crisisTitle: "You are not alone.",
    crisisBody:
      "If you are in crisis or experiencing suicidal thoughts, please reach out immediately. Sri Lanka Sumithrayo Hotline:",
    crisisLink: "View all crisis resources",
    responses: {
      stress: "I hear you. Stress can feel heavy, and you don't have to carry it alone. Let's slow things down together:\n\n**Quick grounding:**\n1. Breathe in slowly for 4 seconds\n2. Hold for 4 seconds\n3. Breathe out for 6 seconds\n4. Repeat 3 times\n\nIf you want, you can tell me what is making you feel pressured, and I’ll help you sort through it gently.",
      relax: "Let's make this moment softer together. Try this:\n\n**Gentle body relaxation:**\n- Notice your feet and let them relax\n- Move slowly up through your legs, stomach, shoulders, and face\n- As you exhale, imagine the tension leaving your body\n\nYou deserve a calm moment. If you want, I can stay with you and guide you through another calming step.",
      motivation: "I’m glad you reached out. Needing support does not mean you are weak — it means you are human.\n\n**Remember:**\n- You have already survived hard days before\n- Small steps still count\n- Asking for support is a strong thing to do\n\nIf you want, tell me what feels hardest right now, and we can take it one step at a time.",
      breathing: "Let's breathe together, slowly and kindly:\n\n**4-7-8 breathing:**\n1. Breathe in through your nose for **4 seconds**\n2. Hold for **7 seconds**\n3. Breathe out through your mouth for **8 seconds**\n4. Repeat **4 times**\n\nThis can help your body settle when anxiety or tension is high. If you'd like, I can stay with you while you do it.",
      unclear_feelings: "That’s okay — sometimes it’s hard to name exactly what we feel. You do not need the perfect words here.\n\nTry telling me one of these:\n- what happened before you felt this way\n- where you feel it in your body\n- whether it feels like stress, sadness, fear, numbness, or confusion\n\nI can help you figure it out gently, one step at a time.",
      repeated_sad: "I’m noticing you’ve been feeling low more than once. That matters, and I’m glad you told me. If you want, we can keep talking about what’s weighing on you, or just take a quiet moment together.",
      repeated_stress: "It sounds like stress has been returning a lot, and that can be exhausting. I’m here with you. What feels like the biggest source of pressure right now?",
      off_topic: "I can only help with mental health, emotional wellbeing, and psychological support. If you want, tell me how you’re feeling, what is troubling you, or what kind of support you need emotionally.\n\nI’m here to listen, gently and without judgment.",
      default: "Thank you for telling me that. Your feelings matter, and you don't have to explain them perfectly here.\n\nIf it helps, you can share:\n- what emotion you are feeling\n- what happened before you started feeling this way\n- whether you want comfort, calming, or simple listening\n\nI’m here with you.",
    },
  },
  si: {
    initial:
      "හායි, මම **Luma**. මම මෙතැන හිතවත් මිතුරෙකු වගේ ඔබට අහන්න, සහ ඔබගේ දැනෙන දේවල්, පීඩනය, කනස්සල්ල, දුක, සහ වෙනත් මානසික සෞඛ්‍ය ගැටලු ගැන උදව් කරන්න ඉන්නේ.\n\nඔබගේ හිතේ තියෙන දේ මට කියන්න, මම ඔබගේ චිත්තවේගීය යහපැවැත්මට පමණක් අවධානය දෙන්නම්.",
    supportLine: "Luma චිත්තවේගීය යහපැවැත්මට සහාය දෙයි, නමුත් වෘත්තීය මානසික සෞඛ්‍ය සේවාවන්ට ආදේශකයක් නොවේ.",
    supportLink: "වෘත්තීය සහාය බලන්න",
    crisisTitle: "ඔබ තනිව නෙවෙයි.",
    crisisBody:
      "ඔබට අර්බුදයක් තිබේ නම් හෝ සියදිවි නසාගැනීමේ අදහස් තිබේ නම්, වහාම උපකාර ලබාගන්න. Sri Lanka Sumithrayo Hotline:",
    crisisLink: "සියලුම අර්බුද සහාය සම්පත් බලන්න",
    responses: {
      stress: "මට ඔබ දැනෙන පීඩනය ඇහෙනවා. ඒක තනිව දරාගන්න ඕන නැහැ. අපි හෙමින් හුස්ම ගනිමු:\n\n**ඉක්මන් grounding එක:**\n1. තත්පර 4ක් හෙමින් හුස්ම ඇතුළට ගන්න\n2. තත්පර 4ක් තබාගන්න\n3. තත්පර 6ක් හෙමින් හුස්ම පිට කරන්න\n4. එය වාර 3ක් නැවත කරන්න\n\nඔබ කැමති නම්, ඔබට පීඩනය දැනෙන්නේ මොන හේතුවෙන්ද කියලා මට කියන්න. මම හෙමින් අහගෙන ඉන්නම්.",
      relax: "අපි මේ මොහොත ටිකක් සැහැල්ලු කරමු. මෘදු ලෙස මෙය උත්සාහ කරන්න:\n\n**ශරීරය ලිහිල් කිරීම:**\n- පාවලින් පටන්ගෙන ශරීරය හරහා හෙමින් ඉහළට යන්න\n- එක් එක් හුස්ම පිට කිරීමේදී ආතතිය අතහරින්න\n- ඔබ ආරක්ෂිතයි කියලා ඔබටම මතක් කරගන්න\n\nඔබට අවශ්‍ය නම්, මම තව ටිකක් ඔබ සමඟ ඉඳගෙන මේක හෙමින් කරගෙන යන්නම්.",
      motivation: "ඔබ මෙතැන ඇවිත් කතා කරන එකම වැදගත් දෙයක්. උදව් ඉල්ලීම දුර්වලකමක් නෙවෙයි — එය ශක්තියක්.\n\n**මතක තබාගන්න:**\n- ඔබ කලින්ද අමාරු දේවල් පහු කරලා තියෙනවා\n- කුඩා පියවරත් වැදගත්\n- සහාය ඉල්ලීම හොඳ දෙයක්\n\nඔබට කැමති නම්, දැන් ඔබට වඩාත් අමාරු දේ මට කියන්න. අපි ඒක එකට බෙදාගෙන බලමු.",
      breathing: "අපි හෙමින් හුස්ම ගනිමු, එකට:\n\n**4-7-8 හුස්ම ගැනීම:**\n1. නාසයෙන් තත්පර **4ක්** හුස්ම ඇතුළට ගන්න\n2. තත්පර **7ක්** තබාගන්න\n3. මුඛයෙන් තත්පර **8ක්** හුස්ම පිට කරන්න\n4. එය **4 වතාවක්** නැවත කරන්න\n\nකනස්සල්ල හෝ තදවීම දැනෙද්දී මේක ශරීරය සන්සුන් කරන්න උදව් වෙනවා. ඔබ කැමති නම්, මම මේක කරන අතරතුරත් ඔබ සමඟ ඉන්නම්.",
      unclear_feelings: "ඒක හොඳයි — සමහර වෙලාවට හරියටම මොනව දැනෙනවද කියලා කියන්න අමාරුයි. මෙතැන perfect words අවශ්‍ය නැහැ.\n\nඔබට මෙවැනි දේවල් කියන්න පුළුවන්:\n- මේ හැඟීම ආවෙ මොනකින් පස්සේද\n- ඒක ශරීරයේ කොහෙද දැනෙන්නේද\n- පීඩනය, දුක, බය, numbness, නැත්නම් confusion වගේද\n\nමම ඔබට හෙමින් ඒක තේරුම් ගන්න උදව් කරමි, එක පියවරක් ගෙන් එක පියවරක්.",
      repeated_sad: "ඔබ නැවත නැවත දුකෙන් ඉන්නවා වගේ මට පේනවා. ඒක වැදගත්. ඔබට කැමති නම්, ඒ දේවල් ගැන තව කතා කරමු, නැත්නම් මොහොතකට නිශ්ශබ්දව ඉඳිමු.",
      repeated_stress: "පීඩනය නැවත නැවත එනවා වගේ පේනවා, ඒක ඉතා මහන්සි කරවන දෙයක්. මම ඔබ සමඟ ඉන්නවා. දැන් වඩාත්ම තද කරන්නේ මොකක්ද?",
      off_topic: "මට උදව් කළ හැක්කේ මානසික සෞඛ්‍යය, චිත්තවේගීය යහපැවැත්ම, සහ psychological support ගැන පමණි. ඔබට කැමති නම්, ඔබට දැනෙන්නේ කොහොමද, මොකක්ද කරදරය, හෝ මොන වගේ සහායක් අවශ්‍යද කියලා මට කියන්න.\n\nමම විනිශ්චය නැතුව අහගෙන ඉන්නම්.",
      default: "ඔබ ඒක මා සමඟ බෙදාගත්තාට ස්තූතියි. ඔබගේ හැඟීම් වැදගත්, සහ ඒවා හරිහැටි කියන්න ඕන නැහැ කියලා මතක තබාගන්න.\n\nකැමති නම් ඔබට මෙවැනි දේවල් කියන්න පුළුවන්:\n- ඔබට දැනෙන්නේ මොන හැඟීමද\n- මේ හැඟීම ආරම්භ වුණේ කුමක් පසුද\n- ඔබට අවශ්‍ය වන්නේ සැනසීමද, සන්සුන්කමද, නැත්නම් simply අහගෙන ඉඳීමද\n\nමම මෙතැන ඉන්නවා.",
    },
  },
} as const

function getLumaText(language: Language) {
  return lumaCopy[language] ?? lumaCopy.en
}

function createInitialMessages(language: Language): Message[] {
  return [
    {
      id: 0,
      role: "luma",
      content: getLumaText(language).initial,
      timestamp: "",
    },
  ]
}

function getLumaResponse(message: string, messageHistory: Message[] | undefined, language: Language): string {
  const copy = getLumaText(language)
  const lower = message.toLowerCase().trim()
  
  // STRICT: Only mental-health and emotional wellbeing keywords are allowed for Luma to respond
  const strictWellnessKeywords = [
    // Emotions
    'stress', 'anxious', 'anxiety', 'worried', 'fear', 'afraid', 'panic',
    'sad', 'sadness', 'depressed', 'depression', 'unhappy', 'upset', 'down',
    'angry', 'anger', 'frustrated', 'frustration', 'mad', 'irritated',
    'happy', 'happiness', 'joy', 'joyful', 'excited', 'excited',
    'lonely', 'loneliness', 'alone', 'isolated',
    'nervous', 'nervous', 'tension', 'overwhelm', 'overwhelmed',
    'tired', 'exhausted', 'fatigue', 'tired', 'burnout',
    'confused', 'confused', 'lost', 'unsure',
    // Wellness activities
    'breathing', 'breathe', 'meditat', 'meditation', 'mindful', 'mindfulness',
    'relax', 'relaxation', 'calm', 'calming', 'peace', 'peaceful',
    'exercise', 'yoga', 'workout', 'fitness',
    'sleep', 'sleeping', 'insomnia', 'rest',
    'journal', 'journaling', 'gratitude',
    'affirmation', 'positive',
    // Mental health related
    'mental', 'mental health', 'emotional', 'feelings', 'feeling', 'feel',
    'therapist', 'therapy', 'counselor', 'counseling', 'psychologist',
    'wellness', 'wellbeing', 'health', 'self-care',
    'support', 'help', 'cope', 'coping', 'manage', 'managing',
    'suicide', 'suicidal', 'crisis', 'emergency',
    'motivation', 'motivate', 'inspire', 'inspiration',
    'confidence', 'self-esteem', 'self worth',
    'relationship', 'relationships', 'social',
    'grief', 'loss', 'pain',
    'how are you', 'how do you', 'what should', 'can you help',
    'i feel', 'i am', 'i think', 'i have', 'i want to'
  ]
  
  // Check if message contains ANY wellness keywords
  const hasWellnessContent = strictWellnessKeywords.some(keyword => lower.includes(keyword))
  
  // STRICT: If NO wellness keywords found, reject
  if (!hasWellnessContent) {
    return copy.responses.off_topic
  }
  
  // Check message history for patterns (context-aware)
  let sadCount = 0
  let stressCount = 0
  if (messageHistory) {
    messageHistory.slice(-5).forEach((msg) => {
      if (msg.role === "user") {
        const msgLower = msg.content.toLowerCase()
        if (msgLower.includes("sad") || msgLower.includes("depressed")) sadCount++
        if (msgLower.includes("stress") || msgLower.includes("anxious")) stressCount++
      }
    })
  }
  
  // If repeated sad pattern detected
  if ((lower.includes("sad") || lower.includes("depressed")) && sadCount >= 2) {
    return copy.responses.repeated_sad
  }
  
  // If repeated stress pattern detected
  if ((lower.includes("stress") || lower.includes("anxious")) && stressCount >= 2) {
    return copy.responses.repeated_stress
  }

  // When the user cannot clearly name the feeling, respond with gentle clarification
  if (
    lower.includes("don't know what i feel") ||
    lower.includes("dont know what i feel") ||
    lower.includes("can't understand what i feel") ||
    lower.includes("cant understand what i feel") ||
    lower.includes("not sure what i feel") ||
    lower.includes("what am i feeling") ||
    lower.includes("feeling confused") ||
    lower.includes("confused about what i feel") ||
    lower.includes("numb") ||
    lower.includes("empty")
  ) {
    return copy.responses.unclear_feelings
  }

  // Regular keyword-based responses
  if (lower.includes("stress") || lower.includes("anxious") || lower.includes("worried") || lower.includes("overwhelm")) return copy.responses.stress
  if (lower.includes("relax") || lower.includes("calm") || lower.includes("peace") || lower.includes("sleep")) return copy.responses.relax
  if (lower.includes("motivat") || lower.includes("inspire") || lower.includes("give up") || lower.includes("hopeless")) return copy.responses.motivation
  if (lower.includes("breath") || lower.includes("meditat") || lower.includes("mindful")) return copy.responses.breathing
  
  // Default response for wellness-related messages
  return copy.responses.default
}

export default function LumaPage() {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>(() => createInitialMessages(language))
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize timestamps on client after hydration
  useEffect(() => {
    setHydrated(true)
    setMessages((prev) =>
      prev.map((msg) =>
        msg.timestamp === ""
          ? { ...msg, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
          : msg
      )
    )
  }, [])

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "luma" && prev[0].timestamp === "") {
        return createInitialMessages(language)
      }
      return prev
    })
  }, [language])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollEndRef.current) {
        // Scroll the end ref into view with smooth behavior
        scrollEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
      }
    }, 150)
    return () => clearTimeout(timer)
  }, [messages, typing])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput("")
    setTyping(true)

    setTimeout(() => {
      const response = getLumaResponse(text, updatedMessages, language)
      const lumaMsg: Message = {
        id: Date.now() + 1,
        role: "luma",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, lumaMsg])
      setTyping(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const resetChat = () => {
    setMessages(createInitialMessages(language))
    setInput("")
  }

  function renderContent(content: string) {
    return content.split("\n").map((line, i) => {
      const boldReplaced = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      if (line.startsWith("- ")) {
        return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: boldReplaced.slice(2) }} />
      }
      if (/^\d+\./.test(line)) {
        return <li key={i} className="ml-4 list-decimal" dangerouslySetInnerHTML={{ __html: boldReplaced }} />
      }
      return <p key={i} dangerouslySetInnerHTML={{ __html: boldReplaced }} />
    })
  }

  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col px-4 py-4 lg:px-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BrandLogo className="h-10 w-10" imageClassName="rounded-full" />
            <div>
              <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Luma</h1>
              <p className="text-xs text-muted-foreground">{t('dashboard.chat')}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetChat} className="gap-1">
            <RefreshCw className="h-3 w-3" /> {t('luma.new_chat')}
          </Button>
          <Link href="/resources">
            <Button variant="outline" size="sm" className="gap-1">
              <BookOpen className="h-3 w-3" /> {t('luma.resources')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex flex-1 flex-col overflow-hidden bg-background">
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <div className="text-sm leading-relaxed [&_li]:mt-1 [&_p]:mt-1 [&_p:first-child]:mt-0">
                    {renderContent(msg.content)}
                  </div>
                  <p className={`mt-2 text-right text-xs ${msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {hydrated && msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollEndRef} />
          </div>
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        <div className="border-t border-border px-4 pt-3">
          <div className="mb-2 flex flex-wrap gap-2">
            {[
              { label: t('luma.stressed'), icon: Wind },
              { label: t('luma.relax'), icon: Heart },
              { label: t('luma.motivation'), icon: Sparkles },
              { label: t('luma.breathing'), icon: Wind },
            ].map((prompt) => (
              <Button
                key={prompt.label}
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
                onClick={() => sendMessage(prompt.label)}
              >
                <prompt.icon className="h-3 w-3" /> {prompt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <CardContent className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('luma.placeholder')}
              className="flex-1"
              disabled={typing}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || typing}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {getLumaText(language).supportLine}{" "}
            <Link href="/resources" className="text-primary hover:underline">{getLumaText(language).supportLink}</Link>
          </p>
        </CardContent>
      </Card>

      {/* Crisis Support Banner */}
      <div className="mt-3 rounded-xl border border-secondary/30 bg-secondary/5 p-4">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
          <Heart className="h-5 w-5 shrink-0 text-secondary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{getLumaText(language).crisisTitle}</p>
            <p className="text-xs text-muted-foreground">
              {getLumaText(language).crisisBody}{" "}
              <a href="tel:+94112682535" className="font-medium text-primary hover:underline">011-2682535</a>
              {" | "}
              <Link href="/resources" className="font-medium text-primary hover:underline">{getLumaText(language).crisisLink}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
