"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Clock,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  TrendingUp,
  Calendar as CalendarIcon,
  BarChart3,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const monthlyData = [
  { week: "Week 1", happy: 15, sad: 5, neutral: 8, angry: 2, surprised: 3 },
  { week: "Week 2", happy: 18, sad: 3, neutral: 6, angry: 1, surprised: 4 },
  { week: "Week 3", happy: 12, sad: 8, neutral: 7, angry: 3, surprised: 2 },
  { week: "Week 4", happy: 20, sad: 2, neutral: 5, angry: 1, surprised: 5 },
]

const trendData = [
  { date: "Feb 1", score: 68 },
  { date: "Feb 4", score: 72 },
  { date: "Feb 7", score: 65 },
  { date: "Feb 10", score: 78 },
  { date: "Feb 13", score: 82 },
  { date: "Feb 16", score: 75 },
  { date: "Feb 19", score: 85 },
]

const sessionLog = [
  { id: 1, emotion: "Happy", confidence: 91, date: "Feb 19, 2026", time: "10:30 AM", icon: Smile, color: "text-yellow-500", bgColor: "bg-yellow-50" },
  { id: 2, emotion: "Neutral", confidence: 72, date: "Feb 19, 2026", time: "8:15 AM", icon: Meh, color: "text-slate-400", bgColor: "bg-slate-50" },
  { id: 3, emotion: "Happy", confidence: 87, date: "Feb 18, 2026", time: "3:45 PM", icon: Smile, color: "text-yellow-500", bgColor: "bg-yellow-50" },
  { id: 4, emotion: "Sad", confidence: 65, date: "Feb 18, 2026", time: "9:00 AM", icon: Frown, color: "text-blue-400", bgColor: "bg-blue-50" },
  { id: 5, emotion: "Surprised", confidence: 78, date: "Feb 17, 2026", time: "2:20 PM", icon: AlertTriangle, color: "text-orange-400", bgColor: "bg-orange-50" },
  { id: 6, emotion: "Happy", confidence: 94, date: "Feb 17, 2026", time: "11:00 AM", icon: Smile, color: "text-yellow-500", bgColor: "bg-yellow-50" },
  { id: 7, emotion: "Neutral", confidence: 68, date: "Feb 16, 2026", time: "4:30 PM", icon: Meh, color: "text-slate-400", bgColor: "bg-slate-50" },
  { id: 8, emotion: "Happy", confidence: 82, date: "Feb 16, 2026", time: "10:00 AM", icon: Smile, color: "text-yellow-500", bgColor: "bg-yellow-50" },
]

const emotionSummary = [
  { label: "Happy", count: 42, percent: 52, color: "#FCD34D" },
  { label: "Neutral", count: 18, percent: 22, color: "#94A3B8" },
  { label: "Sad", count: 10, percent: 12, color: "#60A5FA" },
  { label: "Surprised", count: 6, percent: 8, color: "#FB923C" },
  { label: "Angry", count: 3, percent: 4, color: "#F87171" },
  { label: "Fearful", count: 2, percent: 2, color: "#A78BFA" },
]

export default function MoodHistoryPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

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
            Mood History
          </h1>
          <p className="mt-1 text-muted-foreground">Track and understand your emotional patterns over time</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" /> Calendar
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Clock className="h-4 w-4" /> All Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Monthly Emotions
                </CardTitle>
                <CardDescription>Emotion distribution by week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="week" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                      <Bar dataKey="happy" fill="#FCD34D" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="sad" fill="#60A5FA" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="neutral" fill="#94A3B8" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="angry" fill="#F87171" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="surprised" fill="#FB923C" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Wellness Score Trend
                </CardTitle>
                <CardDescription>Your overall emotional wellness over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <YAxis domain={[50, 100]} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} />
                      <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emotion Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Emotion Summary</CardTitle>
              <CardDescription>All-time breakdown of your detected emotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {emotionSummary.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                        <span className="text-xs text-muted-foreground">{item.count} times</span>
                      </div>
                      <Progress value={item.percent} className="mt-1 h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sessions for {date?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {sessionLog.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${session.bgColor}`}>
                          <session.icon className={`h-5 w-5 ${session.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{session.emotion}</p>
                          <p className="text-xs text-muted-foreground">{session.time}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{session.confidence}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>All Detection Sessions</CardTitle>
              <CardDescription>Complete log of your emotion detection history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {sessionLog.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${session.bgColor}`}>
                        <session.icon className={`h-5 w-5 ${session.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{session.emotion}</p>
                        <p className="text-sm text-muted-foreground">{session.date} at {session.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{session.confidence}%</p>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                      <Progress value={session.confidence} className="h-2 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
