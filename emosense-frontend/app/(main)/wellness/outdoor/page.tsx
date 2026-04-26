"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  TreePine,
  Sun,
  Footprints,
  Bike,
  Mountain,
  Waves,
  Clock,
  MapPin,
  Zap,
} from "lucide-react"

const activities = [
  {
    title: "Campus Nature Walk",
    description: "Take a 20-minute stroll through the campus garden. Observe the trees, flowers, and feel the fresh air. Perfect for clearing your mind between classes.",
    duration: "20 min",
    difficulty: "Easy",
    mood: "All moods",
    icon: Footprints,
    color: "bg-accent/20 text-foreground",
    location: "Campus Garden",
  },
  {
    title: "Sunrise Yoga",
    description: "Find a quiet outdoor spot and practice gentle yoga stretches. Even 10 minutes of morning yoga can significantly reduce anxiety and improve focus.",
    duration: "15-30 min",
    difficulty: "Easy",
    mood: "Anxious / Stressed",
    icon: Sun,
    color: "bg-secondary/20 text-foreground",
    location: "Open Ground",
  },
  {
    title: "Cycling Adventure",
    description: "Explore nearby trails on a bicycle. Cycling releases endorphins, improves cardiovascular health, and gives you a sense of freedom.",
    duration: "30-60 min",
    difficulty: "Moderate",
    mood: "Sad / Low Energy",
    icon: Bike,
    color: "bg-primary/10 text-primary",
    location: "Cycling Trail",
  },
  {
    title: "Hill Hiking",
    description: "Challenge yourself with a short hike to a nearby viewpoint. The physical effort combined with nature exposure is excellent for building resilience.",
    duration: "1-2 hours",
    difficulty: "Challenging",
    mood: "Angry / Frustrated",
    icon: Mountain,
    color: "bg-primary/10 text-foreground",
    location: "Nearby Hills",
  },
  {
    title: "Lake Meditation",
    description: "Sit by a body of water and practice mindful breathing. Water has natural calming effects that help reset your emotional state.",
    duration: "15-20 min",
    difficulty: "Easy",
    mood: "Overwhelmed",
    icon: Waves,
    color: "bg-accent/20 text-foreground",
    location: "Campus Lake",
  },
  {
    title: "Outdoor Group Games",
    description: "Organize a frisbee, badminton, or football game with friends. Social outdoor activities boost serotonin and strengthen friendships.",
    duration: "30-45 min",
    difficulty: "Moderate",
    mood: "Lonely / Neutral",
    icon: TreePine,
    color: "bg-secondary/20 text-foreground",
    location: "Sports Field",
  },
]

export default function OutdoorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/wellness">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Outdoor Activities
          </h1>
          <p className="mt-1 text-muted-foreground">Nature-based activities to boost your mood</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-accent/10 p-4 text-center">
        <p className="text-sm text-foreground">
          <strong>Tip:</strong> Spending just 20 minutes outdoors can reduce stress hormones by up to 20%. Try one activity today!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activities.map((activity) => (
          <Card key={activity.title} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${activity.color}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{activity.title}</CardTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Clock className="h-3 w-3" /> {activity.duration}
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Zap className="h-3 w-3" /> {activity.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{activity.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {activity.location}
                </div>
                <Badge variant="outline" className="text-xs">{activity.mood}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
