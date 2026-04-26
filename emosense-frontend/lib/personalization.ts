// Personalization Engine: Tracks user patterns and preferences
// Enables context-aware responses and adaptive recommendations

export interface UserProfile {
  emotionHistory: EmotionEntry[]
  preferences: UserPreferences
  patterns: UserPatterns
  feedbackHistory: FeedbackEntry[]
}

export interface EmotionEntry {
  emotion: string
  confidence: number
  timestamp: Date
  notes?: string
  feedbackAccurate?: boolean // Did user confirm detection was accurate?
}

export interface UserPreferences {
  preferredWellnessActivities: string[]
  avoidedActivities: string[]
  communicationStyle: "formal" | "casual" | "supportive" | "motivational"
  privacyLevel: "public" | "private" | "anonymous"
}

export interface UserPatterns {
  mostCommonEmotion: string
  emotionTrend: "improving" | "declining" | "stable"
  bestWellnessActivity: string | null
  peakStressTime: string | null
  peakHappyTime: string | null
  weeklyPattern: Record<string, number>
  improvementRate: number
}

export interface FeedbackEntry {
  emotionDetected: string
  userConfirmed: string
  accurate: boolean
  timestamp: Date
  confidence: number
}

/**
 * Generate context-aware LUMA response based on user history
 */
export function generateContextAwareLumaResponse(
  userInput: string,
  userProfile: UserProfile,
  detectedEmotion?: { emotion: string; confidence: number }
): string {
  const recentEmotions = userProfile.emotionHistory.slice(-3)
  const isRepeatEmotion = recentEmotions.filter((e) => e.emotion === detectedEmotion?.emotion).length >= 2

  let response = ""

  // Acknowledge detected emotion with history context
  if (detectedEmotion && isRepeatEmotion) {
    response += `I've noticed you've been feeling **${detectedEmotion.emotion}** lately. `
    response += "This pattern shows me you might need some extra support right now. "
  }

  // Personalized greeting based on communication style
  if (userProfile.preferences.communicationStyle === "supportive") {
    response += "I'm here for you. "
  } else if (userProfile.preferences.communicationStyle === "motivational") {
    response += "You've got this! "
  }

  // Reference past effective activities
  if (userProfile.patterns.bestWellnessActivity) {
    response += `I remember that **${userProfile.patterns.bestWellnessActivity}** helped you feel better before. `
    response += "Would you like to try that again?"
  }

  // Time-aware suggestions
  const hour = new Date().getHours()
  if (hour >= 22 || hour < 6) {
    response += "\nIt's late – have you had enough rest today? Consider a relaxation exercise before bed."
  }

  return response || "I'm here to listen and support you through whatever you're feeling. What's on your mind?"
}

/**
 * Track emotion detection accuracy
 */
export function addFeedback(feedback: FeedbackEntry, profile: UserProfile): UserProfile {
  return {
    ...profile,
    feedbackHistory: [...profile.feedbackHistory, feedback],
    emotionHistory: profile.emotionHistory.map((entry) => {
      if (entry.timestamp === feedback.timestamp) {
        return {
          ...entry,
          feedbackAccurate: feedback.accurate,
        }
      }
      return entry
    }),
  }
}

/**
 * Calculate accuracy rate from feedback
 */
export function getAccuracyRate(profile: UserProfile): { accuracy: number; samples: number } {
  const feedbackEntries = profile.feedbackHistory.filter((f) => f.accurate !== undefined)

  if (feedbackEntries.length === 0) {
    return { accuracy: 0, samples: 0 }
  }

  const accurateCount = feedbackEntries.filter((f) => f.accurate).length
  const accuracy = Math.round((accurateCount / feedbackEntries.length) * 100)

  return { accuracy, samples: feedbackEntries.length }
}

/**
 * Identify user's best wellness activity
 */
export function identifyBestWellnessActivity(
  activities: Array<{ name: string; postMoodRating: number }>,
  profile: UserProfile
): string | null {
  if (activities.length === 0) return null

  return activities.sort((a, b) => b.postMoodRating - a.postMoodRating)[0]?.name || null
}

/**
 * Generate personalized insight
 */
export function generatePersonalizedInsight(profile: UserProfile): string {
  if (profile.emotionHistory.length < 5) {
    return "Continue logging your emotions to unlock personalized insights about your patterns."
  }

  let insight = ""

  // Improvement trend
  if (profile.patterns.emotionTrend === "improving") {
    insight += `🌱 **You're improving!** Your emotional wellness has been trending positively. Keep up the great work!\n\n`
  } else if (profile.patterns.emotionTrend === "declining") {
    insight += `📉 **We've noticed a pattern.** Your mood has been declining. Let's find what helps you feel better.\n\n`
  }

  // Best activity
  if (profile.patterns.bestWellnessActivity) {
    insight += `💡 **Your go-to activity:** ${profile.patterns.bestWellnessActivity} tends to help you most.\n\n`
  }

  // Peak time
  if (profile.patterns.peakStressTime) {
    insight += `⏰ **Peak stress time:** You feel more stressed around ${profile.patterns.peakStressTime}. Try scheduling wellness activities then.\n\n`
  }

  if (profile.patterns.peakHappyTime) {
    insight += `😊 **Peak happy time:** You're usually happier during ${profile.patterns.peakHappyTime}. Embrace that energy!\n\n`
  }

  return insight || "Your pattern profile is still building. Keep logging for personalized insights!"
}

/**
 * Identify if multimodal input (text + face emotion) shows conflict
 */
export function detectEmotionConflict(
  faceEmotion: string,
  textSentiment: string,
  confidence: { face: number; text: number }
): { conflict: boolean; message: string } {
  if (faceEmotion === textSentiment) {
    return { conflict: false, message: "Emotions aligned" }
  }

  if (confidence.text > confidence.face) {
    return {
      conflict: true,
      message: `Your **words** suggest you're feeling ${textSentiment}, but your **face** looks ${faceEmotion}. Are you holding back how you really feel?`,
    }
  }

  return {
    conflict: true,
    message: `There's a mismatch between your **expression** (${faceEmotion}) and **words** (${textSentiment}). Sometimes we don't fully express our feelings – that's okay. What's really going on?`,
  }
}

/**
 * Store user activity and mood correlation
 */
export function trackActivityImpact(
  activity: string,
  preMood: { emotion: string; score: number },
  postMood: { emotion: string; score: number }
): { improvement: number; recommendation: boolean } {
  const improvement = postMood.score - preMood.score

  return {
    improvement,
    recommendation: improvement > 10, // Activity effective if score improved by >10
  }
}
