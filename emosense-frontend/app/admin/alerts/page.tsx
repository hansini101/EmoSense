"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface RiskAlert {
  id: number
  username: string
  risk_level: string
  reason: string
  emotion_pattern: string[]
  status: string
  reviewed_by_name: string
  admin_notes: string
  action_taken: string
  created_at: string
  resolved_at: string
}

export default function AdminAlertsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<RiskAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'critical'>('new')
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [actionTaken, setActionTaken] = useState("")

  useEffect(() => {
    fetchAlerts()
  }, [filter])

  async function fetchAlerts() {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://localhost:8000/api/admin/alerts/', {
        headers: { 'Authorization': `Token ${token}` }
      })
      if (!response.ok) throw new Error('Unauthorized')
      const data = await response.json()
      
      // Filter by status
      let filtered = data.results || data
      if (filter !== 'all') {
        filtered = filtered.filter((a: any) => 
          filter === 'new' ? a.status === 'new' :
          filter === 'critical' ? a.risk_level === 'critical' :
          a.status === filter
        )
      }
      setAlerts(filtered.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ))
    } catch (error) {
      toast.error('Failed to fetch alerts')
    } finally {
      setLoading(false)
    }
  }

  async function reviewAlert() {
    if (!selectedAlert) return
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(
        `http://localhost:8000/api/admin/alerts/${selectedAlert.id}/review_alert/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            notes: adminNotes,
            action: actionTaken
          })
        }
      )
      if (!response.ok) throw new Error('Failed')
      toast.success('Alert reviewed successfully')
      setAdminNotes("")
      setActionTaken("")
      setSelectedAlert(null)
      fetchAlerts()
    } catch (error) {
      toast.error('Failed to review alert')
    }
  }

  const riskColors = {
    critical: 'destructive',
    high: 'destructive',
    medium: 'secondary',
    low: 'outline'
  }

  const statusBadgeVariants = {
    new: 'default',
    reviewed: 'secondary',
    contacted: 'outline',
    resolved: 'secondary'
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
          <h1 className="text-3xl font-bold text-foreground">Risk Alerts</h1>
          <p className="text-muted-foreground">Monitor high-risk emotional patterns</p>
        </div>
      </div>

      {/* Alert Box */}
      <Card className="mb-6 bg-red-500/5 border-red-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">ⓘ Important Disclaimer</p>
              <p className="text-sm text-red-800 mt-1">
                This system is NOT a medical diagnostic tool. All alerts require professional mental health review and intervention. In case of emergency, always contact emergency services or a crisis hotline.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Alerts
            </Button>
            <Button
              variant={filter === 'new' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('new')}
            >
              New
            </Button>
            <Button
              variant={filter === 'critical' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setFilter('critical')}
            >
              Critical
            </Button>
            <Button
              variant={filter === 'reviewed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('reviewed')}
            >
              Reviewed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                No alerts found
              </div>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className={`
              ${alert.risk_level === 'critical' ? 'border-red-500 bg-red-50/50' : ''}
              ${alert.risk_level === 'high' ? 'border-orange-500 bg-orange-50/50' : ''}
            `}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{alert.username}</h3>
                      <Badge variant={riskColors[alert.risk_level as keyof typeof riskColors]}>
                        {alert.risk_level.toUpperCase()}
                      </Badge>
                      <Badge variant={statusBadgeVariants[alert.status as keyof typeof statusBadgeVariants]}>
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(alert.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedAlert(alert)
                          setAdminNotes(alert.admin_notes)
                          setActionTaken(alert.action_taken)
                        }}
                      >
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Review High-Risk Alert</DialogTitle>
                        <DialogDescription>
                          User: {alert.username} | Risk Level: {alert.risk_level.toUpperCase()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="font-semibold text-sm">Reason for Alert</label>
                          <p className="text-sm text-muted-foreground mt-1">{alert.reason}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-sm">Emotion Pattern</label>
                          <div className="flex gap-2 mt-2">
                            {alert.emotion_pattern.map((emotion, i) => (
                              <Badge key={i} variant="outline">{emotion}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="font-semibold text-sm">Admin Notes</label>
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Document your observations and assessment..."
                            className="mt-2"
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-sm">Action Taken</label>
                          <Textarea
                            value={actionTaken}
                            onChange={(e) => setActionTaken(e.target.value)}
                            placeholder="What action did you take? (e.g., contacted counselor, sent resources, etc.)"
                            className="mt-2"
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={reviewAlert}>Mark as Reviewed</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Alert Details</p>
                    <p className="text-sm text-muted-foreground mt-1">{alert.reason}</p>
                  </div>
                  {alert.admin_notes && (
                    <div>
                      <p className="text-sm font-medium">Admin Notes</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.admin_notes}</p>
                    </div>
                  )}
                  {alert.action_taken && (
                    <div>
                      <p className="text-sm font-medium">Action Taken</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.action_taken}</p>
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
