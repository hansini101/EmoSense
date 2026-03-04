"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Phone,
  Users,
  GraduationCap,
  ExternalLink,
  Clock,
  MapPin,
  Mail,
  Heart,
  AlertTriangle,
  Calendar,
} from "lucide-react"

const supportCards = [
  {
    title: "Campus Counseling",
    description: "Free confidential counseling services available for all enrolled students. Professional counselors are ready to help with academic stress, anxiety, depression, and relationship issues.",
    icon: GraduationCap,
    color: "bg-primary/10 text-primary",
    borderColor: "border-primary/20",
    details: [
      { icon: Clock, text: "Mon-Fri: 8:00 AM - 5:00 PM" },
      { icon: MapPin, text: "Student Center, Room 204" },
      { icon: Phone, text: "+94 11 234 5678" },
      { icon: Mail, text: "counseling@university.edu" },
    ],
    actions: [
      { label: "Book Appointment", href: "/booking", variant: "default" as const },
      { label: "Learn More", href: "/about", variant: "outline" as const },
    ],
  },
  {
    title: "Crisis Helpline",
    description: "24/7 crisis support line for immediate emotional assistance. If you or someone you know is in danger, please call immediately. Trained counselors are available around the clock.",
    icon: Phone,
    color: "bg-destructive/10 text-destructive",
    borderColor: "border-destructive/20",
    details: [
      { icon: Clock, text: "Available 24/7, 365 days" },
      { icon: Phone, text: "1926 (National Mental Health Helpline)" },
      { icon: Phone, text: "+94 11 268 2535 (Sumithrayo)" },
      { icon: Mail, text: "crisis@mentalhealth.lk" },
    ],
    actions: [
      { label: "Call Now: 1926", href: "tel:1926", variant: "default" as const },
      { label: "Chat Support", href: "/luma", variant: "outline" as const },
    ],
  },
  {
    title: "Peer Support Groups",
    description: "Join fellow students in a safe, supportive environment. Share experiences, learn coping strategies, and build meaningful connections with peers who understand what you're going through.",
    icon: Users,
    color: "bg-accent/30 text-foreground",
    borderColor: "border-accent/30",
    details: [
      { icon: Clock, text: "Weekly: Wednesdays 4:00 PM" },
      { icon: MapPin, text: "Wellness Center, Room B12" },
      { icon: Users, text: "Groups of 8-12 students" },
      { icon: Mail, text: "peergroups@university.edu" },
    ],
    actions: [
      { label: "Join a Group", href: "/booking", variant: "default" as const },
      { label: "View Schedule", href: "/booking", variant: "outline" as const },
    ],
  },
]

const externalResources = [
  {
    name: "Sumithrayo Sri Lanka",
    description: "Confidential emotional support for those in distress",
    phone: "+94 11 268 2535",
    url: "https://sumithrayo.org",
  },
  {
    name: "Sri Lanka Mental Health Foundation",
    description: "National mental health resources and support",
    phone: "1926",
    url: "#",
  },
  {
    name: "CCC Line (Child & Youth)",
    description: "Counseling for children and young people",
    phone: "1929",
    url: "#",
  },
  {
    name: "WHO Mental Health Resources",
    description: "International mental health information and tools",
    phone: "",
    url: "https://www.who.int/health-topics/mental-health",
  },
]

export default function ResourcesPage() {
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
            Resources
          </h1>
          <p className="mt-1 text-muted-foreground">Professional mental health support and resources</p>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
        <div>
          <p className="text-sm font-medium text-foreground">
            In immediate danger? Call <strong>1926</strong> or go to your nearest emergency room.
          </p>
          <p className="text-xs text-muted-foreground">If you or someone you know is at risk, please seek help immediately.</p>
        </div>
        <a href="tel:1926" className="ml-auto shrink-0">
          <Button variant="destructive" size="sm" className="gap-1">
            <Phone className="h-3 w-3" /> Call 1926
          </Button>
        </a>
      </div>

      {/* Support Cards */}
      <div className="mb-10 grid gap-6 lg:grid-cols-3">
        {supportCards.map((card) => (
          <Card key={card.title} className={`border ${card.borderColor}`}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="mt-2 leading-relaxed">{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-2">
                {card.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <detail.icon className="h-4 w-4 shrink-0" />
                    <span>{detail.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {card.actions.map((action) => (
                  action.href.startsWith("tel:") ? (
                    <a key={action.label} href={action.href}>
                      <Button variant={action.variant} className="w-full gap-2">
                        <Phone className="h-4 w-4" /> {action.label}
                      </Button>
                    </a>
                  ) : (
                    <Link key={action.label} href={action.href}>
                      <Button variant={action.variant} className="w-full gap-2">
                        {action.variant === "default" ? <Calendar className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                        {action.label}
                      </Button>
                    </Link>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* External Resources */}
      <h2 className="mb-4 text-xl font-semibold text-foreground">External Resources</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {externalResources.map((resource) => (
          <Card key={resource.name}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{resource.name}</h3>
                <p className="text-xs text-muted-foreground">{resource.description}</p>
                {resource.phone && (
                  <a href={`tel:${resource.phone}`} className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <Phone className="h-3 w-3" /> {resource.phone}
                  </a>
                )}
              </div>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 rounded-xl bg-primary/5 p-6 text-center">
        <Heart className="mx-auto mb-3 h-8 w-8 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">You Are Not Alone</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Reaching out for help is a sign of strength, not weakness. Whether you need someone to talk to or professional support, we are here for you.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Link href="/luma">
            <Button className="gap-2">Talk to Luma AI</Button>
          </Link>
          <Link href="/booking">
            <Button variant="outline" className="gap-2">Book a Counselor</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
