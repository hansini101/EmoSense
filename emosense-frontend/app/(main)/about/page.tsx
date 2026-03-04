import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

const values = [
  {
    icon: Heart,
    title: "Empathy First",
    description: "Every feature is designed with empathy and care, ensuring students feel supported and understood.",
  },
  {
    icon: Shield,
    title: "Privacy by Design",
    description: "Your data is encrypted and never shared. We believe your emotional data belongs to you alone.",
  },
  {
    icon: Users,
    title: "Student-Centered",
    description: "Built specifically for university students aged 16-30, addressing the unique challenges of student life.",
  },
  {
    icon: Target,
    title: "Evidence-Based",
    description: "Our wellness recommendations are grounded in psychological research and proven therapeutic techniques.",
  },
]

const features = [
  { icon: Camera, title: "Emotion Detection", description: "AI-powered facial expression analysis with real-time results" },
  { icon: MessageCircle, title: "Luma AI Therapist", description: "24/7 AI companion for personalized emotional support" },
  { icon: BarChart3, title: "Mood Tracking", description: "Visualize and understand your emotional patterns over time" },
  { icon: Heart, title: "Wellness Hub", description: "Breathing exercises, journaling, playlists, and outdoor activities" },
]

export default function AboutPage() {
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
            About EmoSense
          </h1>
          <p className="mt-1 text-muted-foreground">Our mission, values, and what makes us different</p>
        </div>
      </div>

      {/* Mission */}
      <div className="mb-12 rounded-2xl bg-primary/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Our Mission
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          EmoSense empowers university students to understand, track, and improve their emotional wellbeing 
          through AI-powered emotion detection, personalized wellness tools, and accessible mental health resources 
          — all within a safe, private, and supportive platform.
        </p>
      </div>

      {/* Values */}
      <h2 className="mb-6 text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Our Values</h2>
      <div className="mb-12 grid gap-4 sm:grid-cols-2">
        {values.map((value) => (
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
      <h2 className="mb-6 text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Key Features</h2>
      <div className="mb-12 grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
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
            <h3 className="font-semibold text-foreground">Important Disclaimer</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              EmoSense is an educational and wellness support tool, NOT a substitute for professional mental health services. 
              The AI emotion detection and Luma AI therapist are designed to provide general wellness support and should not be 
              relied upon for clinical diagnosis or treatment. If you are experiencing a mental health crisis, please contact 
              emergency services or call the national helpline at 1926.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Link href="/register">
          <Button size="lg" className="gap-2">
            Get Started with EmoSense <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
