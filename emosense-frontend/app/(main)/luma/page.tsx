"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
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

const quickPrompts = [
  { label: "I feel stressed", icon: Wind },
  { label: "Help me relax", icon: Heart },
  { label: "I need motivation", icon: Sparkles },
  { label: "Breathing exercise", icon: Wind },
]

const lumaResponses: Record<string, string> = {
  stress: "I hear you, and it's completely okay to feel stressed. University life can be overwhelming sometimes. Let's try something together:\n\n**Quick Grounding Exercise:**\n1. Take a slow deep breath in for 4 seconds\n2. Hold for 4 seconds\n3. Exhale slowly for 6 seconds\n4. Repeat 3 times\n\nStress is your body's way of responding to demands. Would you like to talk about what's specifically causing your stress? Sometimes just naming it can help reduce its power over you.",
  relax: "Let's create a moment of calm together. Here's a progressive muscle relaxation technique:\n\n**Body Scan Relaxation:**\n- Start by tensing your toes for 5 seconds, then release\n- Move to your calves, thighs, stomach, hands, arms, shoulders, and face\n- With each release, feel the tension melting away\n\nYou deserve this moment of peace. Remember, relaxation is not laziness — it's self-care. Would you like me to guide you through a longer meditation?",
  motivation: "I believe in you, and here's why you should too:\n\n**Remember:**\n- You've overcome challenges before, and you will again\n- Progress isn't always linear — small steps matter\n- You're here seeking help, which shows incredible strength\n\n**Try this:** Write down 3 things you've accomplished this week, no matter how small. Acknowledging your wins builds momentum.\n\nWhat's one small goal you'd like to achieve today? Let's make it happen together.",
  breathing: "Let's do a calming breathing exercise together:\n\n**4-7-8 Breathing Technique:**\n1. Breathe IN through your nose for **4 seconds**\n2. HOLD your breath for **7 seconds**\n3. Breathe OUT through your mouth for **8 seconds**\n4. Repeat this cycle **4 times**\n\nThis technique activates your parasympathetic nervous system, helping your body shift from \"fight or flight\" to \"rest and digest.\" It's especially helpful before bed or during anxious moments.\n\nHow do you feel after trying it?",
  repeated_sad: "Hey… I noticed you've been feeling low lately. I see this is affecting you more than usual. Do you want to talk about it, or would you prefer to just sit quietly for a moment? Sometimes we don't need solutions—we just need to be heard.",
  repeated_stress: "I've been watching your patterns, and I notice stress keeps coming back. This tells me something needs to change, even if it's small. What's one thing that's consistently causing this stress? Let's tackle it together.",
  default: "Thank you for sharing that with me. I want you to know that your feelings are valid, and it's brave of you to express them.\n\nHere are some things that might help:\n- **Talk it out:** Sometimes verbalizing our feelings helps us understand them better\n- **Take a break:** Step away from what's overwhelming you, even for 5 minutes\n- **Connect with someone:** Reach out to a friend, family member, or counselor\n\nWould you like me to suggest a specific wellness activity, or would you prefer to keep talking about how you're feeling?",
}

function getLumaResponse(message: string, messageHistory?: Message[]): string {
  const lower = message.toLowerCase()
  
  // Check message history for patterns (context-aware)
  let sadCount = 0
  let stressCount = 0
  if (messageHistory) {
    messageHistory.slice(-5).forEach((msg) => {
      if (msg.role === "user") {
        const msgLower = msg.content.toLowerCase()
        if (msgLower.includes("sad") || msgLower.includes("sad") || msgLower.includes("depressed")) sadCount++
        if (msgLower.includes("stress") || msgLower.includes("anxious")) stressCount++
      }
    })
  }
  
  // If repeated sad pattern detected
  if ((lower.includes("sad") || lower.includes("depressed")) && sadCount >= 2) {
    return lumaResponses.repeated_sad
  }
  
  // If repeated stress pattern detected
  if ((lower.includes("stress") || lower.includes("anxious")) && stressCount >= 2) {
    return lumaResponses.repeated_stress
  }

  // Regular keyword-based responses
  if (lower.includes("stress") || lower.includes("anxious") || lower.includes("worried") || lower.includes("overwhelm")) return lumaResponses.stress
  if (lower.includes("relax") || lower.includes("calm") || lower.includes("peace") || lower.includes("sleep")) return lumaResponses.relax
  if (lower.includes("motivat") || lower.includes("inspire") || lower.includes("give up") || lower.includes("hopeless")) return lumaResponses.motivation
  if (lower.includes("breath") || lower.includes("meditat") || lower.includes("mindful")) return lumaResponses.breathing
  return lumaResponses.default
}

const initialMessages: Message[] = [
  {
    id: 0,
    role: "luma",
    content: "Hi there! I'm **Luma**, your AI wellness companion. I'm here to listen, offer support, and suggest personalized wellness strategies.\n\nHow are you feeling today? You can tell me anything, or try one of the quick prompts below.",
    timestamp: "",
  },
]

export default function LumaPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
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

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollEndRef.current) {
      scrollEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, typing])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setTyping(true)

    setTimeout(() => {
      const response = getLumaResponse(text, messages)
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
    setMessages(initialMessages)
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
              <p className="text-xs text-muted-foreground">AI Wellness Companion</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetChat} className="gap-1">
            <RefreshCw className="h-3 w-3" /> New Chat
          </Button>
          <Link href="/resources">
            <Button variant="outline" size="sm" className="gap-1">
              <BookOpen className="h-3 w-3" /> Resources
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
            {quickPrompts.map((prompt) => (
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
              placeholder="Tell Luma how you're feeling..."
              className="flex-1"
              disabled={typing}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || typing}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Luma is an AI companion, not a replacement for professional help.{" "}
            <Link href="/resources" className="text-primary hover:underline">Find professional support</Link>
          </p>
        </CardContent>
      </Card>

      {/* Crisis Support Banner */}
      <div className="mt-3 rounded-xl border border-secondary/30 bg-secondary/5 p-4">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
          <Heart className="h-5 w-5 shrink-0 text-secondary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">You are not alone.</p>
            <p className="text-xs text-muted-foreground">
              If you are in crisis or experiencing suicidal thoughts, please reach out immediately.
              Sri Lanka Sumithrayo Hotline:{" "}
              <a href="tel:+94112682535" className="font-medium text-primary hover:underline">011-2682535</a>
              {" | "}
              <Link href="/resources" className="font-medium text-primary hover:underline">View all crisis resources</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
