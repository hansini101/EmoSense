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
      "Hi there! I'm **Luma**, your AI wellness companion. I'm here to listen, offer support, and suggest personalized wellness strategies.\n\nHow are you feeling today? You can tell me anything, or try one of the quick prompts below.",
    supportLine: "Luma is an AI companion, not a replacement for professional help.",
    supportLink: "Find professional support",
    crisisTitle: "You are not alone.",
    crisisBody:
      "If you are in crisis or experiencing suicidal thoughts, please reach out immediately. Sri Lanka Sumithrayo Hotline:",
    crisisLink: "View all crisis resources",
    responses: {
      stress: "I hear you, and it's completely okay to feel stressed. University life can be overwhelming sometimes. Let's try something together:\n\n**Quick Grounding Exercise:**\n1. Take a slow deep breath in for 4 seconds\n2. Hold for 4 seconds\n3. Exhale slowly for 6 seconds\n4. Repeat 3 times\n\nStress is your body's way of responding to demands. Would you like to talk about what's specifically causing your stress? Sometimes just naming it can help reduce its power over you.",
      relax: "Let's create a moment of calm together. Here's a progressive muscle relaxation technique:\n\n**Body Scan Relaxation:**\n- Start by tensing your toes for 5 seconds, then release\n- Move to your calves, thighs, stomach, hands, arms, shoulders, and face\n- With each release, feel the tension melting away\n\nYou deserve this moment of peace. Remember, relaxation is not laziness — it's self-care. Would you like me to guide you through a longer meditation?",
      motivation: "I believe in you, and here's why you should too:\n\n**Remember:**\n- You've overcome challenges before, and you will again\n- Progress isn't always linear — small steps matter\n- You're here seeking help, which shows incredible strength\n\n**Try this:** Write down 3 things you've accomplished this week, no matter how small. Acknowledging your wins builds momentum.\n\nWhat's one small goal you'd like to achieve today? Let's make it happen together.",
      breathing: "Let's do a calming breathing exercise together:\n\n**4-7-8 Breathing Technique:**\n1. Breathe IN through your nose for **4 seconds**\n2. HOLD your breath for **7 seconds**\n3. Breathe OUT through your mouth for **8 seconds**\n4. Repeat this cycle **4 times**\n\nThis technique activates your parasympathetic nervous system, helping your body shift from \"fight or flight\" to \"rest and digest.\" It's especially helpful before bed or during anxious moments.\n\nHow do you feel after trying it?",
      repeated_sad: "Hey… I noticed you've been feeling low lately. I see this is affecting you more than usual. Do you want to talk about it, or would you prefer to just sit quietly for a moment? Sometimes we don't need solutions—we just need to be heard.",
      repeated_stress: "I've been watching your patterns, and I notice stress keeps coming back. This tells me something needs to change, even if it's small. What's one thing that's consistently causing this stress? Let's tackle it together.",
      off_topic: "I appreciate you reaching out, but I can only help with wellness and emotional health topics. I'm specifically designed to support your mental wellbeing, help you manage stress, anxiety, and other emotions.\n\n**I can help with:**\n- Stress, anxiety, or worry management\n- Sadness or depression support\n- Coping strategies and breathing exercises\n- Motivation and confidence building\n- Sleep issues and relaxation\n- Emotional support and listening\n\nFor other topics, I'd recommend searching online or asking a general assistant.\n\nHow are you feeling emotionally today? I'm here to listen and support you. 💙",
      default: "Thank you for sharing that with me. I want you to know that your feelings are valid, and it's brave of you to express them.\n\nHere are some things that might help:\n- **Talk it out:** Sometimes verbalizing our feelings helps us understand them better\n- **Take a break:** Step away from what's overwhelming you, even for 5 minutes\n- **Connect with someone:** Reach out to a friend, family member, or counselor\n\nWould you like me to suggest a specific wellness activity, or would you prefer to keep talking about how you're feeling?",
    },
  },
  si: {
    initial:
      "හායි! මම **Luma**, ඔබගේ AI wellness සහකාරයා. මම මෙතැන ඔබව ඇසීමට, සහාය ලබා දීමට, සහ ඔබට ගැලපෙන wellness උපදෙස් යෝජනා කිරීමට ඉන්නේ.\n\nඅද ඔබට කොහොමද දැනෙන්නේ? ඔබට ඕනෑම දෙයක් කියන්න පුළුවන්, නැත්නම් පහත ඉක්මන් prompts එකක් උත්සාහ කරන්න.",
    supportLine: "Luma යනු AI සහකාරියක් වන අතර වෘත්තීය උපකාරයට වෙනුවට ආදේශකයක් නොවේ.",
    supportLink: "වෘත්තීය සහාය බලන්න",
    crisisTitle: "ඔබ තනිව නෙවෙයි.",
    crisisBody:
      "ඔබට අර්බුදයක් තිබේ නම් හෝ සියදිවි නසාගැනීමේ අදහස් තිබේ නම්, වහාම උපකාර ලබාගන්න. Sri Lanka Sumithrayo Hotline:",
    crisisLink: "සියලුම අර්බුද සහාය සම්පත් බලන්න",
    responses: {
      stress: "ඔබට දැනෙන දේ මට ඇහෙනවා. පීඩනයක් දැනෙන්න එක සාමාන්‍යයි. විශ්වවිද්‍යාල ජීවිතය සමහර වෙලාවට අමාරු වෙන්න පුළුවන්. අපි එකට කුඩා ව්‍යායාමයක් කරමු:\n\n**ඉක්මන් Grounding ව්‍යායාමය:**\n1. තත්පර 4ක් හෙමින් ගැඹුරු හුස්මක් ඇතුළට ගන්න\n2. තත්පර 4ක් තබාගන්න\n3. තත්පර 6ක් හෙමින් හුස්ම පිට කරන්න\n4. එය වාර 3ක් නැවත කරන්න\n\nපීඩනය කියන්නේ ඔබගේ ශරීරය ඉල්ලීම් වලට ප්‍රතිචාර දක්වන ආකාරයක්. ඔබට ඒ පීඩනයට හේතුව කතා කරන්න කැමතිද? සමහරවිට ඒක නමකින් කියන්නවත් එහි බලය අඩු වෙනවා.",
      relax: "අපි එකට නිශ්චල මොහොතක් හදාගමු. මෙන්න පේශි ලිහිල් කිරීමේ ක්‍රමයක්:\n\n**ශරීර-සම්පූර්ණ ලිහිල් කිරීම:**\n- මුලින් ඔබේ ඇඟිලි තත්පර 5ක් තද කරලා අතහරින්න\n- පසුව පන්කම්, තිඹිරි, උදරය, අත්, භාජු, උරහිස්, මුහුණ වෙත යන්න\n- එක් එක් වතාවේ තදවීම අතහරින විට එම ආතතිය දියවී යන බව දැනෙන්න\n\nඔබට මේ නිශ්චල මොහොත ලැබිය යුතුයි. ලිහිල් වීම අලසකමක් නෙවෙයි — ඒක self-care එකක්. දිගු meditation එකකට මම ඔබට මගපෙන්වන්නද?",
      motivation: "මම ඔබව විශ්වාස කරනවා, ඔබත් එසේම කළ යුතුයි:\n\n**මතක තබාගන්න:**\n- ඔබ කලින් අභියෝග ජයගෙන තිබේ, නැවතත් ජය ගන්න පුළුවන්\n- ප්‍රගතිය හැමවිටම සෘජු නැහැ — කුඩා පියවරත් වැදගත්\n- ඔබ උදව් ඉල්ලමින් මෙතැන ඉන්නේ, ඒකම මහත් ශක්තියක්\n\n**මෙය උත්සාහ කරන්න:** මේ සතියේ ඔබ කළ දේවල් 3ක් ලියාගන්න, ඒවා කුඩා වුණත් හරි. ඔබගේ ජයග්‍රහණ සැලකිල්ලට ගැනීමෙන් උද්දීපනය වැඩි වෙනවා.\n\nඅද ඔබට ලබාගන්න කැමති කුඩා ඉලක්කය මොකක්ද? අපි එකට කරමු.",
      breathing: "අපි හිත නිහඬ කරන හුස්ම ව්‍යායාමයක් කරමු:\n\n**4-7-8 හුස්ම ගැනීමේ ක්‍රමය:**\n1. නාසයෙන් තත්පර **4ක්** හුස්ම ඇතුළට ගන්න\n2. තත්පර **7ක්** හුස්ම තබාගන්න\n3. මුඛයෙන් තත්පර **8ක්** හුස්ම පිට කරන්න\n4. මේ චක්‍රය **4 වතාවක්** නැවත කරන්න\n\nමෙම ක්‍රමය parasympathetic nervous system එක සක්‍රිය කරනවා. ඒකෙන් ශරීරය \"fight or flight\" තත්ත්වයෙන් \"rest and digest\" තත්ත්වයට මාරු වෙන්න උදව් වෙනවා. නිදාගන්න කලින් හෝ කනස්සල්ලක් ඇති වෙලාවට විශේෂයෙන් ප්‍රයෝජනවත්.\n\nඒක කරලා පස්සේ ඔබට කොහොමද දැනුනේ?",
      repeated_sad: "හේ… අලුතෙන්ම ඔබ ටිකක් දුකෙන් ඉන්නවා වගේ මට පෙනුණා. මෙය සාමාන්‍යයට වඩා ඔබට බලපානවා වගේ. ඒ ගැන කතා කරන්න කැමතිද, නැත්නම් මොහොතක් නිහඬව ඉන්නද? සමහර වෙලාවට විසඳුම් නෙවෙයි, අහගෙන ඉන්න කෙනෙක් පමණක් අවශ්‍ය වෙනවා.",
      repeated_stress: "ඔබේ රටා මම නිරීක්ෂණය කරලා තියෙනවා, පීඩනය නැවත නැවත එනවා කියලා පේනවා. ඒකෙන් මට පේන්නේ කුඩා වුණත් වෙනසක් අවශ්‍යයි කියලා. නිතරම මේ පීඩනයට හේතුවන එක දෙයක් මොකක්ද? අපි එකට ඒකට මුහුණ දෙමු.",
      off_topic: "ඔබ සම්බන්ධ වුණාට ස්තූතියි, නමුත් මට wellness සහ මානසික සෞඛ්‍ය විෂයයන්ට පමණක් උදව් කළ හැකිය. මම විශේෂයෙන්ම ඔබගේ මානසික යහපැවැත්මට සහාය වීමට, පීඩනය, කනස්සල්ල සහ වෙනත් හැඟීම් කළමනාකරණයට නිර්මාණය කර ඇතිවා.\n\n**මට උදව් කළ හැක්කේ:**\n- පීඩනය, කනස්සල්ල, හෝ කරදර කළමනාකරණය\n- දුක හෝ විෂාද සහාය\n- coping ක්‍රම සහ හුස්ම ව්‍යායාම\n- ප්‍රේරණය සහ විශ්වාසය ගොඩනැගීම\n- නින්ද ගැටලු සහ ලිහිල් වීම\n- චිත්තවේගීය සහාය සහ අහගෙන සිටීම\n\nවෙනත් විෂයයන් සඳහා, මම online සෙවීමක් කරන්න හෝ සාමාන්‍ය assistant කෙනෙකුගෙන් අහන්න කියා නිර්දේශ කරනවා.\n\nඅද ඔබට චිත්තවේගීය වශයෙන් කොහොමද දැනෙන්නේ? මම මෙතැන අහගෙන සහ සහාය දෙන්න ඉන්නවා. 💙",
      default: "එය මට බෙදාගත්තාට ස්තූතියි. ඔබගේ හැඟීම් වලංගුයි කියලා මම ඔබට කියන්න ඕනෙ, ඒවා ප්‍රකාශ කිරීම ධෛර්යමත් දෙයක්.\n\nඋදව් විය හැකි දේවල් කිහිපයක් මෙන්න:\n- **කතා කරලා බලන්න:** සමහර වෙලාවට අපේ හැඟීම් වචනෙන් කියන එක ඒවා හොඳින් තේරුම් ගන්න උදව් වෙනවා\n- **විවේකයක් ගන්න:** ඔබව අතිශය පීඩනයට පත් කරන්නේ දේවල් වලින් මිනිත්තු 5ක් හෝ ඉවත් වෙන්න\n- **කෙනෙකු සමඟ සම්බන්ධ වෙන්න:** මිතුරෙකු, පවුලේ සාමාජිකයෙකු හෝ counselor කෙනෙකු සම්බන්ධ කරගන්න\n\nඔබට විශේෂ wellness ක්‍රියාකාරකමක් යෝජනා කරන්න මම කැමතිද, නැත්නම් ඔබ දැනෙන දේ ගැන තවදුරටත් කතා කරගෙන යන්න කැමතිද?",
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
  
  // STRICT: Only these wellness-related keywords are allowed for Luma to respond
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
    'work', 'school', 'study', 'exam', 'test', 'pressure',
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
