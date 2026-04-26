"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Lightbulb, Wind, Shield } from "lucide-react"
import { ActivityWellnessTracker } from "@/components/activity-wellness-tracker"
import {
  Camera,
  Heart,
  MessageCircle,
  Clock,
  TrendingUp,
  Smile,
  Frown,
  Meh,
  ArrowRight,
  Calendar,
  Target,
} from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
}
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const weeklyData = [
  { day: "Mon", happy: 65, sad: 15, neutral: 20 },
  { day: "Tue", happy: 45, sad: 30, neutral: 25 },
  { day: "Wed", happy: 70, sad: 10, neutral: 20 },
  { day: "Thu", happy: 55, sad: 25, neutral: 20 },
  { day: "Fri", happy: 80, sad: 5, neutral: 15 },
  { day: "Sat", happy: 72, sad: 8, neutral: 20 },
  { day: "Sun", happy: 68, sad: 12, neutral: 20 },
]

const emotionDistribution = [
  { name: "Happy", value: 42, color: "#FCD34D" },
  { name: "Sad", value: 15, color: "#60A5FA" },
  { name: "Neutral", value: 20, color: "#94A3B8" },
  { name: "Surprised", value: 10, color: "#FB923C" },
  { name: "Fearful", value: 8, color: "#A78BFA" },
  { name: "Angry", value: 5, color: "#F87171" },
]

const recentSessions = [
  { emotion: "Happy", confidence: 87, time: "2 hours ago", icon: Smile, color: "text-yellow-500" },
  { emotion: "Neutral", confidence: 72, time: "5 hours ago", icon: Meh, color: "text-slate-400" },
  { emotion: "Sad", confidence: 65, time: "Yesterday", icon: Frown, color: "text-blue-400" },
  { emotion: "Happy", confidence: 91, time: "2 days ago", icon: Smile, color: "text-yellow-500" },
]

const quickActions = [
  { label: "Detect Emotion", href: "/emotion-detection", icon: Camera, color: "bg-primary text-primary-foreground" },
  { label: "Talk to Luma", href: "/luma", icon: MessageCircle, color: "bg-secondary text-secondary-foreground" },
  { label: "Wellness Hub", href: "/wellness", icon: Heart, color: "bg-accent text-accent-foreground" },
  { label: "View History", href: "/mood-history", icon: Clock, color: "bg-primary/10 text-foreground" },
  { label: "Privacy & Ethics", href: "/privacy-ethics", icon: Shield, color: "bg-blue-500/10 text-blue-600" },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome Back
          </h1>
          <p className="mt-1 text-muted-foreground">{"Here's an overview of your emotional wellness journey."}</p>
        </div>
        <Link href="/emotion-detection">
          <Button className="gap-2">
            <Camera className="h-4 w-4" /> New Detection
          </Button>
        </Link>
      </motion.div>

      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
          >
            <Link href={action.href}>
              <Card className="group cursor-pointer transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Weekly Mood Trend
                </CardTitle>
                <CardDescription>Your emotional patterns this week</CardDescription>
              </div>
              <Link href="/mood-history">
                <Button variant="ghost" size="sm" className="gap-1">
                  Details <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                    }}
                  />
                  <Area type="monotone" dataKey="happy" stackId="1" stroke="#FCD34D" fill="#FCD34D" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="neutral" stackId="1" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="sad" stackId="1" stroke="#60A5FA" fill="#60A5FA" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
            <CardDescription>Overall breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {emotionDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {emotionDistribution.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Decision Engine: Smart Suggestions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Personalized Wellness Suggestions
        </h2>
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-yellow-200/50 bg-yellow-50/50 dark:border-yellow-900/30 dark:bg-yellow-950/20">
              <CardContent className="flex items-start gap-3 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Consider stronger support</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You've been feeling stressed frequently. Booking a counselor can help develop strategies.
                  </p>
                  <Link href="/booking" className="mt-2 inline-block">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Heart className="h-3 w-3" /> Book Counselor
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-green-200/50 bg-green-50/50 dark:border-green-900/30 dark:bg-green-950/20">
              <CardContent className="flex items-start gap-3 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">You're improving!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your mood improved 15% this week. Keep journaling—it's helping.
                  </p>
                  <Link href="/wellness/gratitude-journal" className="mt-2 inline-block">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Lightbulb className="h-3 w-3" /> Continue Journaling
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-purple-200/50 bg-purple-50/50 dark:border-purple-900/30 dark:bg-purple-950/20">
              <CardContent className="flex items-start gap-3 p-4">
                <Wind className="mt-0.5 h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Evening wind-down tip</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You feel more negative in evenings. Try breathing exercises before bed.
                  </p>
                  <Link href="/wellness" className="mt-2 inline-block">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Wind className="h-3 w-3" /> Breathing Exercise
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Activity Wellness Tracker */}
      <ActivityWellnessTracker />

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> Recent Sessions
                </CardTitle>
                <CardDescription>Your latest emotion detections</CardDescription>
              </div>
              <Link href="/mood-history">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentSessions.map((session, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-3">
                    <session.icon className={`h-5 w-5 ${session.color}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{session.emotion}</p>
                      <p className="text-xs text-muted-foreground">{session.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={session.confidence} className="h-2 w-20" />
                    <span className="text-xs font-medium text-muted-foreground">{session.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wellness Goals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" /> Weekly Goals
                </CardTitle>
                <CardDescription>Track your wellness progress</CardDescription>
              </div>
              <Link href="/wellness/goals">
                <Button variant="ghost" size="sm" className="gap-1">
                  Set Goals <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[
                { label: "Emotion check-ins", current: 5, goal: 7 },
                { label: "Wellness activities", current: 3, goal: 5 },
                { label: "Gratitude entries", current: 4, goal: 7 },
                { label: "Mindfulness minutes", current: 45, goal: 60 },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.label}</span>
                    <span className="text-muted-foreground">{item.current}/{item.goal}</span>
                  </div>
                  <Progress value={(item.current / item.goal) * 100} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/wellness" className="flex-1">
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <Heart className="h-4 w-4" /> Wellness Hub
                </Button>
              </Link>
              <Link href="/mood-history" className="flex-1">
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <Calendar className="h-4 w-4" /> This Week
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
