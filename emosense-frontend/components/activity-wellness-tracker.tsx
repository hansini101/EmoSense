"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Activity, TrendingUp, Heart } from "lucide-react"

interface ActivityData {
  name: string
  effectivenessScore: number // 0-100
  timesUsed: number
  avgMoodImprovement: number // percentage
  icon: typeof Heart
}

const userActivities: ActivityData[] = [
  {
    name: "Meditation",
    effectivenessScore: 92,
    timesUsed: 24,
    avgMoodImprovement: 23,
    icon: Heart,
  },
  {
    name: "Outdoor Walk",
    effectivenessScore: 87,
    timesUsed: 18,
    avgMoodImprovement: 19,
    icon: Activity,
  },
  {
    name: "Journaling",
    effectivenessScore: 81,
    timesUsed: 31,
    avgMoodImprovement: 16,
    icon: Activity,
  },
  {
    name: "Breathing Exercise",
    effectivenessScore: 79,
    timesUsed: 14,
    avgMoodImprovement: 14,
    icon: Heart,
  },
  {
    name: "Music Listening",
    effectivenessScore: 75,
    timesUsed: 42,
    avgMoodImprovement: 12,
    icon: Activity,
  },
]

export function ActivityWellnessTracker() {
  const topActivity = userActivities[0]
  const avgEffectiveness =
    Math.round(userActivities.reduce((sum, a) => sum + a.effectivenessScore, 0) / userActivities.length)

  return (
    <Card className="col-span-full border-accent/20 bg-gradient-to-br from-accent/5 via-transparent to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Your Wellness Activities</CardTitle>
              <CardDescription>
                Activities that help you feel better — ranked by effectiveness
              </CardDescription>
            </div>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {avgEffectiveness}% Avg Effectiveness
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {userActivities.map((activity, idx) => (
          <motion.div
            key={activity.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="space-y-2 rounded-lg border border-border/50 bg-muted/20 p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{activity.name}</p>
                {idx === 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    ⭐ Most Effective
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{activity.effectivenessScore}%</p>
                <p className="text-xs text-muted-foreground">+{activity.avgMoodImprovement}% mood</p>
              </div>
            </div>
            <Progress value={activity.effectivenessScore} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Used {activity.timesUsed} times</span>
              <span>Consistent improvement tracked</span>
            </div>
          </motion.div>
        ))}

        {/* Insight Box */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border border-primary/20 bg-primary/5 p-4"
        >
          <div className="flex gap-3">
            <TrendingUp className="h-5 w-5 shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">Your Go-To Wellness Strategy</p>
              <p className="text-sm text-muted-foreground">
                <strong>{topActivity.name}</strong> works best for you (92% effectiveness). When you're feeling down, this is
                your proven solution. You've used it successfully {topActivity.timesUsed} times.
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
