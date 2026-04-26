"use client"

// Simple emotion history tracker (stores last 5 emotions)
export type EmotionRecord = {
  emotion: string
  confidence: number
  timestamp: Date
}

export class EmotionHistory {
  private static readonly STORAGE_KEY = "emosense_emotion_history"
  private static readonly MAX_RECORDS = 5

  static addEmotion(emotion: string, confidence: number): void {
    if (typeof window === "undefined") return

    const history = this.getHistory()
    history.unshift({
      emotion,
      confidence,
      timestamp: new Date(),
    })

    // Keep only last 5
    if (history.length > this.MAX_RECORDS) {
      history.pop()
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history))
    } catch (e) {
      console.log("[emosense] Could not save emotion history")
    }
  }

  static getHistory(): EmotionRecord[] {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (e) {
      return []
    }
  }

  static getMostCommonEmotion(): string | null {
    const history = this.getHistory()
    if (history.length === 0) return null

    const emotionCounts: Record<string, number> = {}
    history.forEach((record) => {
      emotionCounts[record.emotion] = (emotionCounts[record.emotion] || 0) + 1
    })

    return Object.entries(emotionCounts).sort(([, a], [, b]) => b - a)[0][0]
  }

  static hasRepeatedPattern(emotion: string, count: number = 2): boolean {
    const history = this.getHistory()
    let consecutiveCount = 0

    for (const record of history) {
      if (record.emotion === emotion) {
        consecutiveCount++
        if (consecutiveCount >= count) return true
      } else {
        consecutiveCount = 0
      }
    }

    return false
  }

  static clear(): void {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (e) {
      console.log("[emosense] Could not clear emotion history")
    }
  }
}
