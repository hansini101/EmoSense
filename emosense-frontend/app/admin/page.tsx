"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Users, Activity, TrendingUp, AlertTriangle, LogOut, Menu } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DashboardStats {
  total_users: number
  active_users_today: number
  total_detections: number
  most_common_emotion: string
  high_risk_alerts: number
}

export default function AdminDashboard() {
  const { logout, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Admin access only. Redirecting...")
      router.push('/login')
    } else if (!loading && isAdmin) {
      fetchDashboardStats()
    }
  }, [loading, isAdmin, router])

  async function fetchDashboardStats() {
    try {
      const response = await fetch('http://localhost:8000/api/admin/dashboard-stats/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token')}`
        }
      })
      if (!response.ok) throw new Error('Unauthorized')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      toast.error('Access denied. Admin only.')
      router.push('/dashboard')
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading || !isAdmin) {
    return <div className="flex items-center justify-center h-screen">Checking authorization...</div>
  }

  if (!isAdmin) {
    return null
  }

  if (statsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>
  }

  const adminMenuItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Emotion Analytics', href: '/admin/analytics', icon: '📈' },
    { name: 'Risk Alerts', href: '/admin/alerts', icon: '⚠️' },
    { name: 'Feedback', href: '/admin/feedback', icon: '💬' },
    { name: 'Recommendations', href: '/admin/recommendations', icon: '✨' },
    { name: 'Resources', href: '/admin/resources', icon: '📚' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary/5 border-r border-border p-4 transition-all`}>
        <div className="mb-8 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center w-full'}`}>
            {sidebarOpen && (
              <>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">A</div>
                <span className="font-bold text-foreground">Admin</span>
              </>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <nav className="space-y-2">
          {adminMenuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="ml-2">{item.name}</span>}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
            onClick={() => {
              logout()
              router.push('/login')
            }}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">System overview and key metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.total_users || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">All registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  Active Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.active_users_today || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Users detected emotions today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Total Detections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.total_detections || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Emotion predictions made</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Risk Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{stats?.high_risk_alerts || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">New high-risk alerts</p>
              </CardContent>
            </Card>
          </div>

          {/* Most Common Emotion */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Most Detected Emotion</p>
                    <p className="text-sm text-muted-foreground">Emotion most commonly detected today</p>
                  </div>
                  <div className="text-2xl font-bold capitalize bg-primary/10 px-6 py-2 rounded-lg">
                    {stats?.most_common_emotion || '-'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
                  <div>
                    <p className="font-medium">System Status</p>
                    <p className="text-sm text-muted-foreground">All systems operational</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Healthy</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-700">ⓘ Disclaimer</p>
                    <p className="text-xs text-yellow-600 mt-1">This system is not a medical diagnostic tool. All alerts require professional review.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Manage Users</span>
                  </Button>
                </Link>

                <Link href="/admin/alerts">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-sm">View Alerts</span>
                  </Button>
                </Link>

                <Link href="/admin/analytics">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">Analytics</span>
                  </Button>
                </Link>

                <Link href="/admin/feedback">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl">💬</span>
                    <span className="text-sm">Feedback</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
