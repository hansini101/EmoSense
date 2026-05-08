"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Recommendation {
  id: number
  emotion: string
  title: string
  description: string
  recommendation_type: string
  is_active: boolean
  created_by_name: string
  created_at: string
}

export default function AdminRecommendationsPage() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [newRec, setNewRec] = useState({
    emotion: 'happy',
    title: '',
    description: '',
    recommendation_type: 'breathing',
    content: {}
  })

  useEffect(() => {
    fetchRecommendations()
  }, [])

  async function fetchRecommendations() {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://localhost:8000/api/admin/recommendations/', {
        headers: { 'Authorization': `Token ${token}` }
      })
      if (!response.ok) throw new Error('Unauthorized')
      const data = await response.json()
      setRecommendations(data.results || data)
    } catch (error) {
      toast.error('Failed to fetch recommendations')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  async function addRecommendation() {
    if (!newRec.title || !newRec.description) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://localhost:8000/api/admin/recommendations/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRec)
      })
      if (!response.ok) throw new Error('Failed')
      toast.success('Recommendation added')
      setNewRec({ emotion: 'happy', title: '', description: '', recommendation_type: 'breathing', content: {} })
      fetchRecommendations()
    } catch (error) {
      toast.error('Failed to add recommendation')
    }
  }

  async function deleteRecommendation(id: number) {
    if (!confirm('Delete this recommendation?')) return
    try {
      const token = localStorage.getItem('auth_token')
      await fetch(`http://localhost:8000/api/admin/recommendations/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      })
      toast.success('Recommendation deleted')
      fetchRecommendations()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const emotionColor = {
    happy: 'bg-yellow-500/10',
    sad: 'bg-blue-500/10',
    angry: 'bg-red-500/10',
    fearful: 'bg-orange-500/10',
    neutral: 'bg-gray-500/10',
    surprised: 'bg-pink-500/10',
    disgusted: 'bg-green-500/10'
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Wellness Recommendations</h1>
            <p className="text-muted-foreground">Manage AI recommendations for each emotion</p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Recommendation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Recommendation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-sm">Emotion</label>
                <Select value={newRec.emotion} onValueChange={(v) => setNewRec({...newRec, emotion: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['happy', 'sad', 'angry', 'fearful', 'neutral', 'surprised', 'disgusted'].map(e => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-semibold text-sm">Title</label>
                <Input
                  value={newRec.title}
                  onChange={(e) => setNewRec({...newRec, title: e.target.value})}
                  placeholder="e.g., Guided Breathing"
                />
              </div>
              <div>
                <label className="font-semibold text-sm">Type</label>
                <Select value={newRec.recommendation_type} onValueChange={(v) => setNewRec({...newRec, recommendation_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['breathing', 'meditation', 'music', 'activity', 'quote', 'resource'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-semibold text-sm">Description</label>
                <Textarea
                  value={newRec.description}
                  onChange={(e) => setNewRec({...newRec, description: e.target.value})}
                  placeholder="Describe this recommendation..."
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={addRecommendation}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recommendations by Emotion */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-6">
          {['happy', 'sad', 'angry', 'fearful', 'neutral', 'surprised', 'disgusted'].map(emotion => (
            <Card key={emotion}>
              <CardHeader>
                <CardTitle className="capitalize">{emotion} Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations.filter(r => r.emotion === emotion).length === 0 ? (
                  <p className="text-muted-foreground">No recommendations yet</p>
                ) : (
                  <div className="space-y-3">
                    {recommendations.filter(r => r.emotion === emotion).map(rec => (
                      <div key={rec.id} className={`p-4 rounded-lg border ${emotionColor[emotion as keyof typeof emotionColor]}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{rec.title}</h4>
                              <Badge variant="outline" className="text-xs">{rec.recommendation_type}</Badge>
                              {rec.is_active ? (
                                <Badge className="text-xs">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">Inactive</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">By {rec.created_by_name}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteRecommendation(rec.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
