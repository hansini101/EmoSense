"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Camera, MessageCircle, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_50%)] opacity-[0.08]" />
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  AI-Powered Emotional Wellness
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Understand Your Emotions, Transform Your Wellbeing
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
              >
                EmoSense uses AI to detect your emotions and connects you with personalized wellness tools,
                an AI therapist named Luma, and campus mental health resources — all in one place.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Link href="/emotion-detection">
                  <Button size="lg" className="gap-2 px-8">
                    <Camera className="h-5 w-5" />
                    Analyze My Emotion
                  </Button>
                </Link>
                <Link href="/luma">
                  <Button variant="outline" size="lg" className="gap-2 px-8">
                    <MessageCircle className="h-5 w-5" />
                    Talk to Luma
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
