"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Feedback {
  id: number
  username: string
  feedback_type: string
  title: string
  description: string
  status: string
  priority: string
  admin_response: string
  admin_name: string
  created_at: string
  updated_at: string
  resolved_at: string
}

export default function AdminFeedbackPage() {
  const router = useRouter()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('open')
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [response, setResponse] = useState("")

  useEffect(() => {
    fetchFeedback()
  }, [filter])

  async function fetchFeedback() {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://localhost:8000/api/admin/feedback/', {
        headers: { 'Authorization': `Token ${token}` }
      })
      if (!response.ok) throw new Error('Unauthorized')
      const data = await response.json()
      
      let filtered = data.results || data
      if (filter !== 'all') {
        filtered = filtered.filter((f: any) => f.status === filter)
      }
      setFeedbacks(filtered)
    } catch (error) {
      toast.error('Failed to fetch feedback')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  async function resolveFeedback() {
    if (!selectedFeedback) return
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(
        `http://localhost:8000/api/admin/feedback/${selectedFeedback.id}/resolve/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ response })
        }
      )
      if (!res.ok) throw new Error('Failed')
      toast.success('Feedback resolved')
      setResponse("")
      setSelectedFeedback(null)
      fetchFeedback()
    } catch (error) {
      toast.error('Failed to resolve feedback')
    }
  }

  const priorityColors = {
    urgent: 'destructive',
    high: 'destructive',
    medium: 'secondary',
    low: 'outline'
  }

  const typeColors = {
    bug_report: 'destructive',
    feature_request: 'default',
    review: 'secondary',
    support_request: 'outline',
    suggestion: 'default'
  }

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
          <h1 className="text-3xl font-bold text-foreground">User Feedback</h1>
          <p className="text-muted-foreground">Manage feedback, support requests, and bug reports</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'open' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('open')}
            >
              Open
            </Button>
            <Button
              variant={filter === 'resolved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('resolved')}
            >
              Resolved
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading feedback...</div>
        ) : feedbacks.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                No feedback found
              </div>
            </CardContent>
          </Card>
        ) : (
          feedbacks.map((fb) => (
            <Card key={fb.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{fb.title}</h3>
                      <Badge variant={typeColors[fb.feedback_type as keyof typeof typeColors]}>
                        {fb.feedback_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant={priorityColors[fb.priority as keyof typeof priorityColors]}>
                        {fb.priority}
                      </Badge>
                      <Badge variant={fb.status === 'resolved' ? 'secondary' : 'default'}>
                        {fb.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      From {fb.username} • {new Date(fb.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {fb.status !== 'resolved' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedFeedback(fb)
                            setResponse(fb.admin_response)
                          }}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{fb.title}</DialogTitle>
                          <DialogDescription>
                            From {fb.username} • Priority: {fb.priority}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="font-semibold text-sm">User Message</label>
                            <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded">
                              {fb.description}
                            </p>
                          </div>
                          <div>
                            <label className="font-semibold text-sm">Your Response</label>
                            <Textarea
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              placeholder="Type your response here..."
                              className="mt-2"
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={resolveFeedback}>Send Response</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Message</p>
                    <p className="text-sm text-muted-foreground mt-1">{fb.description}</p>
                  </div>
                  {fb.admin_response && (
                    <div className="p-3 bg-blue-500/10 rounded">
                      <p className="text-sm font-medium">Admin Response</p>
                      <p className="text-sm text-muted-foreground mt-1">{fb.admin_response}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
