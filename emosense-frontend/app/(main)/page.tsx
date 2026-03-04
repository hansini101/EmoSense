"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  Brain,
  Camera,
  Heart,
  MessageCircle,
  BarChart3,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  BookOpen,
  Phone,
} from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const features = [
  {
    icon: Camera,
    title: "Emotion Detection",
    description: "Use your webcam or upload a photo to detect emotions in real-time with AI-powered analysis and confidence scores.",
    href: "/emotion-detection",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MessageCircle,
    title: "Talk to Luma",
    description: "Chat with Luma, your AI wellness companion, for personalized suggestions, coping strategies, and emotional support.",
    href: "/luma",
    color: "bg-secondary/20 text-foreground",
  },
  {
    icon: Heart,
    title: "Wellness Hub",
    description: "Access breathing exercises, gratitude journaling, curated playlists, and outdoor activity recommendations.",
    href: "/wellness",
    color: "bg-accent/20 text-foreground",
  },
  {
    icon: BarChart3,
    title: "Mood Tracking",
    description: "Visualize your emotional patterns over time with detailed charts and insights on your mood history.",
    href: "/mood-history",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    title: "Resources",
    description: "Find campus counseling, crisis helplines, peer support groups, and professional mental health services.",
    href: "/resources",
    color: "bg-accent/20 text-foreground",
  },
  {
    icon: Phone,
    title: "Book a Counselor",
    description: "Schedule online sessions with verified counselors and psychologists directly through EmoSense.",
    href: "/booking",
    color: "bg-secondary/20 text-foreground",
  },
]

const stats = [
  { value: "10K+", label: "Students Helped" },
  { value: "95%", label: "Detection Accuracy" },
  { value: "24/7", label: "AI Support" },
  { value: "50+", label: "Counselors" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 lg:px-8 lg:pb-32 lg:pt-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_50%)] opacity-[0.08]" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">AI-Powered Emotional Wellness</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Understand Your Emotions, Transform Your Wellbeing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              EmoSense uses AI to detect your emotions and connects you with personalized wellness tools,
              an AI therapist named Luma, and campus mental health resources — all in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
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

          {/* Stats */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center"
              >
                <span className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</span>
                <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
              Everything You Need for Emotional Wellness
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From emotion detection to professional support, EmoSense is your complete mental health companion.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, i) => (
              <motion.div key={feature.title} variants={fadeUp} custom={i}>
                <Link href={feature.href}>
                  <Card className="group h-full transition-all hover:border-primary/40 hover:shadow-lg">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                      </div>
                      <div className="mt-auto flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Explore <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Safe, Private, and Built for Students
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Your emotional data is yours. EmoSense is designed with privacy at its core,
                ensuring your personal information stays protected.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                {[
                  { icon: Shield, text: "End-to-end encrypted data" },
                  { icon: Users, text: "Designed for students aged 16-30" },
                  { icon: Brain, text: "AI analysis — not a replacement for professional help" },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 * i, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { emoji: "Happy", color: "bg-primary/10 border-primary/20", value: "87%" },
                { emoji: "Calm", color: "bg-accent/20 border-accent/30", value: "92%" },
                { emoji: "Focused", color: "bg-muted border-border", value: "78%" },
                { emoji: "Grateful", color: "bg-secondary/20 border-secondary/30", value: "95%" },
              ].map((item, i) => (
                <motion.div
                  key={item.emoji}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  whileHover={{ scale: 1.04 }}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-8 ${item.color}`}
                >
                  <span className="text-3xl font-bold text-foreground">{item.value}</span>
                  <span className="mt-1 text-sm font-medium text-muted-foreground">{item.emoji}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary/5 px-4 py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Start Your Wellness Journey Today
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of students who are already using EmoSense to understand their emotions and improve their mental wellbeing.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
