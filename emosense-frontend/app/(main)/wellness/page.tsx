"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Heart,
  Share2,
  BookOpen,
  Music,
  TreePine,
  Wind,
  Target,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

const activities = [
  {
    title: "Share Your Joy",
    description: "Celebrate your happy moments and share positive vibes with the community.",
    icon: Share2,
    href: "/wellness/share-joy",
    color: "bg-primary/10 text-primary",
    borderColor: "hover:border-primary/50",
  },
  {
    title: "Gratitude Journal",
    description: "Write down things you're grateful for and build a positive mindset.",
    icon: BookOpen,
    href: "/wellness/gratitude-journal",
    color: "bg-secondary/20 text-foreground",
    borderColor: "hover:border-secondary/50",
  },
  {
    title: "Create a Playlist",
    description: "Curate mood-based playlists to match and improve your emotional state.",
    icon: Music,
    href: "/wellness/playlist",
    color: "bg-primary/10 text-primary",
    borderColor: "hover:border-primary/50",
  },
  {
    title: "Outdoor Activities",
    description: "Discover outdoor activities recommended for your current emotional state.",
    icon: TreePine,
    href: "/wellness/outdoor",
    color: "bg-accent/20 text-foreground",
    borderColor: "hover:border-accent/50",
  },
  {
    title: "Set Goals",
    description: "Define and track your personal wellness goals for the week.",
    icon: Target,
    href: "/wellness/goals",
    color: "bg-secondary/10 text-foreground",
    borderColor: "hover:border-secondary/50",
  },
]

const breathingExercises = [
  { name: "Box Breathing", steps: [
    { label: "Breathe In", duration: 4 },
    { label: "Hold", duration: 4 },
    { label: "Breathe Out", duration: 4 },
    { label: "Hold", duration: 4 },
  ]},
  { name: "4-7-8 Technique", steps: [
    { label: "Breathe In", duration: 4 },
    { label: "Hold", duration: 7 },
    { label: "Breathe Out", duration: 8 },
  ]},
  { name: "Deep Belly", steps: [
    { label: "Breathe In", duration: 5 },
    { label: "Breathe Out", duration: 5 },
  ]},
]

function BreathingTimer() {
  const [selectedExercise, setSelectedExercise] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const exercise = breathingExercises[selectedExercise]
  const step = exercise.steps[currentStep]

  const stop = useCallback(() => {
    setIsActive(false)
    setCurrentStep(0)
    setCountdown(0)
    setCycles(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const start = useCallback(() => {
    setIsActive(true)
    setCurrentStep(0)
    setCycles(0)
    setCountdown(exercise.steps[0].duration)
  }, [exercise])

  useEffect(() => {
    if (!isActive) return
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCurrentStep((s) => {
            const next = s + 1
            if (next >= exercise.steps.length) {
              setCycles((c) => c + 1)
              setCountdown(exercise.steps[0].duration)
              return 0
            }
            setCountdown(exercise.steps[next].duration)
            return next
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isActive, exercise])

  const progress = isActive && step ? ((step.duration - countdown) / step.duration) * 100 : 0
  const scale = isActive ? (step?.label.includes("In") ? 1 + progress / 200 : step?.label.includes("Out") ? 1.5 - progress / 200 : 1.35) : 1

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {breathingExercises.map((ex, i) => (
          <button
            key={ex.name}
            onClick={() => { stop(); setSelectedExercise(i) }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              i === selectedExercise
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      <div className="relative flex h-44 w-44 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-primary/10 transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        />
        <div className="relative z-10 flex flex-col items-center gap-1 text-center">
          {isActive ? (
            <>
              <span className="text-3xl font-bold text-primary">{countdown}</span>
              <span className="text-sm font-medium text-foreground">{step?.label}</span>
              <span className="text-xs text-muted-foreground">Cycle {cycles + 1}</span>
            </>
          ) : (
            <>
              <Wind className="h-8 w-8 text-primary" />
              <span className="text-sm text-muted-foreground">Press start</span>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={isActive ? () => { setIsActive(false); if (intervalRef.current) clearInterval(intervalRef.current) } : start} className="gap-1">
          {isActive ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Start</>}
        </Button>
        {(isActive || cycles > 0) && (
          <Button size="sm" variant="outline" onClick={stop} className="gap-1">
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        )}
      </div>
    </div>
  )
}

export default function WellnessPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Wellness Hub
          </h1>
          <p className="mt-1 text-muted-foreground">Activities and tools for your emotional wellbeing</p>
        </div>
      </div>

      {/* Activity Cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <Link key={activity.title} href={activity.href}>
            <Card className={`group h-full cursor-pointer transition-all hover:shadow-md ${activity.borderColor}`}>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${activity.color}`}>
                  <activity.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{activity.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{activity.description}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Get Started <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Breathing Exercises */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-primary" /> Breathing Exercises
            </CardTitle>
            <CardDescription>Interactive guided exercises to calm your mind</CardDescription>
          </CardHeader>
          <CardContent>
            <BreathingTimer />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Daily Affirmation
            </CardTitle>
            <CardDescription>Start your day with a positive mindset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-primary/5 p-6 text-center">
              <p className="text-lg font-medium italic leading-relaxed text-foreground">
                {'"I am worthy of happiness and peace. Every step I take brings me closer to emotional balance."'}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Remember: You are not alone in this journey.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/luma" className="flex-1">
                <Button className="w-full gap-2">
                  <Heart className="h-4 w-4" /> Talk to Luma
                </Button>
              </Link>
              <Link href="/resources" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <BookOpen className="h-4 w-4" /> Resources
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
