// Decision Engine: Rule-based AI for intelligent suggestions
// Analyzes emotion history, context, and patterns to provide smart recommendations

export type Emotion = "happy" | "sad" | "neutral" | "angry" | "surprised" | "fearful" | "disgusted"

export interface EmotionSession {
  emotion: Emotion
  confidence: number
  timestamp: Date
  notes?: string
}

export interface UserContext {
  sessions: EmotionSession[]
  timeOfDay: "morning" | "afternoon" | "evening" | "night"
  dayOfWeek: number // 0 = Sunday, 6 = Saturday
  consecutiveNegativeDays: number
}

export interface Suggestion {
  priority: "high" | "medium" | "low"
  title: string
  description: string
  action: string
  actionLink: string
  reasoning: string
}

/**
 * Analyzes emotion history and returns intelligent suggestions
 */
export function decideSuggestions(context: UserContext): Suggestion[] {
  const suggestions: Suggestion[] = []

  if (context.sessions.length === 0) {
    return [
      {
        priority: "low",
        title: "Start tracking your emotions",
        description: "Begin your wellness journey by detecting your emotions",
        action: "Detect Emotion",
        actionLink: "/emotion-detection",
        reasoning: "No emotion history to analyze yet",
      },
    ]
  }

  const recentEmotions = context.sessions.slice(-7) // Last 7 sessions
  const emotionCounts = countEmotions(recentEmotions)
  const mostCommonEmotion = Object.entries(emotionCounts).sort(([, a], [, b]) => b - a)[0]?.[0]
  const sadCount = emotionCounts["sad"] || 0
  const angryCount = emotionCounts["angry"] || 0

  // Rule 1: Persistent sadness (3+ days)
  if (context.consecutiveNegativeDays >= 3) {
    suggestions.push({
      priority: "high",
      title: "You might need stronger support",
      description: "I've noticed you've been feeling low for a few days. Consider reaching out to someone or booking a counselor session.",
      action: "Book a Counselor",
      actionLink: "/booking",
      reasoning: `Detected ${context.consecutiveNegativeDays} consecutive days of negative emotions`,
    })
  }

  // Rule 2: Stressed + Night Time
  if (mostCommonEmotion === "angry" && (context.timeOfDay === "night" || context.timeOfDay === "evening")) {
    suggestions.push({
      priority: "high",
      title: "Evening stress detected",
      description: "Try a relaxation exercise or breathing technique to unwind before sleep.",
      action: "Breathing Exercise",
      actionLink: "/wellness",
      reasoning: "Stress detected during evening hours",
    })
  }

  // Rule 3: Happy frequently - reinforce positive
  if (emotionCounts["happy"] && emotionCounts["happy"] > recentEmotions.length / 2) {
    suggestions.push({
      priority: "medium",
      title: "You're doing well!",
      description: "Keep maintaining these positive habits. Share your joy or explore gratitude journaling.",
      action: "Share Your Joy",
      actionLink: "/wellness/share-joy",
      reasoning: "Consistently positive emotional patterns detected",
    })
  }

  // Rule 4: Morning optimization
  if (context.timeOfDay === "morning" && mostCommonEmotion === "neutral") {
    suggestions.push({
      priority: "medium",
      title: "Start your day with intention",
      description: "Set a wellness goal for today. Even small actions can boost your mood throughout the day.",
      action: "Set Goals",
      actionLink: "/wellness/goals",
      reasoning: "Neutral mood in morning - opportunity to set positive intention",
    })
  }

  // Rule 5: Weekend patterns
  if ([5, 6].includes(context.dayOfWeek)) {
    suggestions.push({
      priority: "low",
      title: "Enjoy your weekend",
      description: "Try outdoor activities or mindfulness exercises to recharge.",
      action: "Outdoor Activities",
      actionLink: "/wellness/outdoor",
      reasoning: "Weekend day - opportunity for restorative activities",
    })
  }

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Count emotions in recent sessions
 */
function countEmotions(sessions: EmotionSession[]): Record<Emotion, number> {
  const counts: Record<Emotion, number> = {
    happy: 0,
    sad: 0,
    neutral: 0,
    angry: 0,
    surprised: 0,
    fearful: 0,
    disgusted: 0,
  }

  sessions.forEach((session) => {
    counts[session.emotion] = (counts[session.emotion] || 0) + 1
  })

  return counts
}

/**
 * Calculate mood improvement percentage
 */
export function calculateMoodImprovement(sessions: EmotionSession[]): {
  improvement: number
  trend: "improving" | "declining" | "stable"
} {
  if (sessions.length < 2) {
    return { improvement: 0, trend: "stable" }
  }

  const midpoint = Math.floor(sessions.length / 2)
  const firstHalf = sessions.slice(0, midpoint)
  const secondHalf = sessions.slice(midpoint)

  const firstScore = calculateMoodScore(firstHalf)
  const secondScore = calculateMoodScore(secondHalf)

  const improvement = Math.round(((secondScore - firstScore) / firstScore) * 100)

  return {
    improvement: Math.abs(improvement),
    trend: improvement > 5 ? "improving" : improvement < -5 ? "declining" : "stable",
  }
}

/**
 * Calculate emotional wellness score (0-100)
 */
function calculateMoodScore(sessions: EmotionSession[]): number {
  if (sessions.length === 0) return 50

  const emotionScores: Record<Emotion, number> = {
    happy: 100,
    surprised: 80,
    neutral: 50,
    fearful: 20,
    sad: 15,
    angry: 10,
    disgusted: 5,
  }

  const total = sessions.reduce((sum, session) => {
    const baseScore = emotionScores[session.emotion]
    const confidenceAdjustment = (session.confidence / 100) * baseScore
    return sum + confidenceAdjustment
  }, 0)

  return Math.round(total / sessions.length)
}

/**
 * Get insight text based on patterns
 */
export function getEmotionInsight(sessions: EmotionSession[]): string {
  if (sessions.length === 0) return "No emotion data yet. Start detecting to build insights."

  const emotionCounts = countEmotions(sessions)
  const mostCommon = Object.entries(emotionCounts).sort(([, a], [, b]) => b - a)[0]

  if (!mostCommon) return "Building your emotional profile..."

  const [emotion, count] = mostCommon
  const percent = Math.round((count / sessions.length) * 100)

  return `Your most common mood is **${emotion}** (${percent}% of sessions). This pattern reflects your emotional baseline and can guide personalized wellness recommendations.`
}

/**
 * Get time-based insights
 */
export function getTimeBasedInsight(sessions: EmotionSession[]): string {
  if (sessions.length < 3) return ""

  const byHour: Record<number, Emotion[]> = {}

  sessions.forEach((session) => {
    const hour = session.timestamp.getHours()
    if (!byHour[hour]) byHour[hour] = []
    byHour[hour].push(session.emotion)
  })

  // Find most negative time period
  let negativeHour: number | null = null
  let negativeCount = 0

  Object.entries(byHour).forEach(([hour, emotions]) => {
    const negative = emotions.filter((e) => ["sad", "angry", "fearful"].includes(e)).length
    if (negative > negativeCount) {
      negativeCount = negative
      negativeHour = parseInt(hour)
    }
  })

  if (negativeHour !== null && negativeCount > 0) {
    const timeLabel = negativeHour < 12 ? "morning" : negativeHour < 17 ? "afternoon" : "evening"
    return `You tend to feel more negative during **${timeLabel}** hours. Consider scheduling relaxation activities during this time.`
  }

  return ""
}
