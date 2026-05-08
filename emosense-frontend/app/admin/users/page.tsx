"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Trash2, Ban, Lock, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  date_joined: string
  total_detections: number
  emotion_trend: string
  last_active: string
  is_suspended: boolean
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    fetchUsers()
  }, [search, filter, page])

  async function fetchUsers() {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filter !== 'all') params.append('filter', filter)
      params.append('page', page.toString())
      params.append('page_size', pageSize.toString())

      const response = await fetch(
        `http://localhost:8000/api/admin/users/?${params}`,
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem('auth_token')}`
          }
        }
      )
      if (!response.ok) throw new Error('Unauthorized')
      const data = await response.json()
      setUsers(data.results)
      setTotal(data.total)
    } catch (error) {
      toast.error('Failed to fetch users')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  async function suspendUser(userId: number) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/suspend/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reason: 'policy_violation',
            description: 'Suspended by admin'
          })
        }
      )
      if (!response.ok) throw new Error('Failed')
      toast.success('User suspended successfully')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to suspend user')
    }
  }

  async function deleteUser(userId: number) {
    if (!confirm('Are you sure? This cannot be undone.')) return

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/delete/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('auth_token')}`
          }
        }
      )
      if (!response.ok) throw new Error('Failed')
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const totalPages = Math.ceil(total / pageSize)

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
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search by username, email, or name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="gap-2"
                prefix={<Search className="h-4 w-4" />}
              />
            </div>
            <Select value={filter} onValueChange={(v) => {
              setFilter(v)
              setPage(1)
            }}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="high_risk">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({total})</CardTitle>
          <CardDescription>Page {page} of {totalPages}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Username</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Detections</th>
                    <th className="text-left py-3 px-4 font-semibold">Trend</th>
                    <th className="text-left py-3 px-4 font-semibold">Last Active</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{user.username}</td>
                      <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4">{user.total_detections}</td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          user.emotion_trend === 'improving' ? 'default' :
                          user.emotion_trend === 'declining' ? 'destructive' :
                          'secondary'
                        }>
                          {user.emotion_trend}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-3 px-4">
                        {user.is_suspended ? (
                          <Badge variant="destructive">Suspended</Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        {!user.is_suspended && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Ban className="h-3 w-3" />
                                Suspend
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Suspend User</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to suspend {user.username}? They will not be able to access the system.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    // Close dialog
                                    document.querySelector('[data-state="open"]')?.closest('[role="dialog"]')?.remove()
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    suspendUser(user.id)
                                    // Close dialog
                                    document.querySelector('[data-state="open"]')?.closest('[role="dialog"]')?.remove()
                                  }}
                                >
                                  Suspend
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="gap-1">
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete User</DialogTitle>
                              <DialogDescription>
                                Permanently delete {user.username} and all their data? This cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  // Close dialog
                                  document.querySelector('[data-state="open"]')?.closest('[role="dialog"]')?.remove()
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  deleteUser(user.id)
                                  // Close dialog
                                  document.querySelector('[data-state="open"]')?.closest('[role="dialog"]')?.remove()
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
