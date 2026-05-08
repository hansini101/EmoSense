"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface EmotionData {
  emotion: string
  count: number
  percentage: number
}

interface DailyUsage {
  date: string
  detections: number
  active_users: number
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [emotionData, setEmotionData] = useState<EmotionData[]>([])
  const [dailyData, setDailyData] = useState<DailyUsage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const token = localStorage.getItem('auth_token')

      // Fetch emotion distribution
      const emotionRes = await fetch('http://localhost:8000/api/admin/emotion-distribution/', {
        headers: { 'Authorization': `Token ${token}` }
      })
      if (!emotionRes.ok) throw new Error('Unauthorized')
      setEmotionData(await emotionRes.json())

      // Fetch daily usage
      const dailyRes = await fetch('http://localhost:8000/api/admin/daily-usage/?days=30', {
        headers: { 'Authorization': `Token ${token}` }
      })
      if (!dailyRes.ok) throw new Error('Unauthorized')
      setDailyData(await dailyRes.json())
    } catch (error) {
      toast.error('Failed to fetch analytics')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  const emotionColors = {
    happy: '#22c55e',
    sad: '#3b82f6',
    angry: '#ef4444',
    fearful: '#f59e0b',
    neutral: '#8b5cf6',
    surprised: '#ec4899',
    disgusted: '#6b7280'
  }

  const maxDetections = Math.max(...dailyData.map(d => d.detections), 1)
  const maxUsers = Math.max(...dailyData.map(d => d.active_users), 1)

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emotion Analytics</h1>
          <p className="text-muted-foreground">System-wide emotion detection analysis</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading analytics...</div>
      ) : (
        <>
          {/* Emotion Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Emotion Distribution</CardTitle>
                <CardDescription>Breakdown of all detected emotions</CardDescription>
              </CardHeader>
              <CardContent>
                {emotionData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No data available</div>
                ) : (
                  <div className="space-y-4">
                    {emotionData.map((item) => (
                      <div key={item.emotion}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium capitalize">{item.emotion}</span>
                          <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: emotionColors[item.emotion as keyof typeof emotionColors] || '#8b5cf6'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emotion Pie Chart Alternative */}
            <Card>
              <CardHeader>
                <CardTitle>Emotion Summary</CardTitle>
                <CardDescription>Total detections by emotion type</CardDescription>
              </CardHeader>
              <CardContent>
                {emotionData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No data available</div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {emotionData.map((item) => (
                      <div
                        key={item.emotion}
                        className="p-3 rounded-lg border"
                        style={{ borderColor: emotionColors[item.emotion as keyof typeof emotionColors] || '#8b5cf6' }}
                      >
                        <div
                          className="text-sm font-medium mb-1 px-2 py-1 rounded w-fit"
                          style={{
                            backgroundColor: emotionColors[item.emotion as keyof typeof emotionColors] || '#8b5cf6',
                            color: 'white'
                          }}
                        >
                          {item.emotion}
                        </div>
                        <div className="text-2xl font-bold">{item.count}</div>
                        <div className="text-xs text-muted-foreground">{item.percentage}% of total</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Daily Usage Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Usage Trends (Last 30 Days)</CardTitle>
              <CardDescription>Detections and active users per day</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No data available</div>
              ) : (
                <div className="space-y-4">
                  {/* Line Chart Alternative - Simple Bar Chart */}
                  <div className="h-80 flex items-flex-end gap-1 justify-start overflow-x-auto pb-4">
                    {dailyData.map((item, index) => {
                      const date = new Date(item.date)
                      const detectionHeight = (item.detections / maxDetections) * 100 || 2
                      return (
                        <div key={index} className="flex flex-col items-center gap-1 min-w-fit">
                          <div
                            className="w-8 rounded-t transition-all hover:opacity-80"
                            style={{
                              height: `${detectionHeight}%`,
                              backgroundColor: '#3b82f6',
                              minHeight: '2px'
                            }}
                            title={`${item.detections} detections`}
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Statistics Table */}
                  <div className="mt-8">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left py-2 px-3 font-semibold">Date</th>
                          <th className="text-right py-2 px-3 font-semibold">Detections</th>
                          <th className="text-right py-2 px-3 font-semibold">Active Users</th>
                          <th className="text-right py-2 px-3 font-semibold">Avg per User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyData.slice(-7).reverse().map((item) => (
                          <tr key={item.date} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-3">
                              {new Date(item.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                            <td className="text-right py-2 px-3 font-medium">{item.detections}</td>
                            <td className="text-right py-2 px-3">{item.active_users}</td>
                            <td className="text-right py-2 px-3 text-muted-foreground">
                              {item.active_users > 0
                                ? (item.detections / item.active_users).toFixed(1)
                                : '0'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Most Detected</p>
                  <p className="text-2xl font-bold capitalize">
                    {emotionData[0]?.emotion || '-'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {emotionData[0]?.percentage}% of detections
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Detections</p>
                  <p className="text-2xl font-bold">
                    {emotionData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Last 24h Avg</p>
                  <p className="text-2xl font-bold">
                    {dailyData.length > 0
                      ? (dailyData.slice(-1)[0]?.detections || 0).toLocaleString()
                      : '0'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Detections</p>
                </div>
                <div className="p-4 bg-orange-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">System Health</p>
                  <p className="text-2xl font-bold">✓ Good</p>
                  <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
