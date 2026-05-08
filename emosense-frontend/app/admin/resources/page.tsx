"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Resource {
  id: number
  title: string
  description: string
  resource_type: string
  contact_info: string
  url: string
  location: string
  availability: string
  is_emergency: boolean
  is_active: boolean
}

export default function AdminResourcesPage() {
  const router = useRouter()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    resource_type: 'hotline',
    contact_info: '',
    url: '',
    location: '',
    availability: '24/7',
    is_emergency: false,
    is_active: true
  })

  useEffect(() => {
    fetchResources()
  }, [])

  async function fetchResources() {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://localhost:8000/api/admin/resources/', {
        headers: { 'Authorization': `Token ${token}` }
      })
      if (!response.ok) throw new Error('Unauthorized')
      const data = await response.json()
      setResources(data.results || data)
    } catch (error) {
      toast.error('Failed to fetch resources')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  async function addResource() {
    if (!newResource.title || !newResource.description) {
      toast.error('Please fill required fields')
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://localhost:8000/api/admin/resources/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newResource)
      })
      if (!response.ok) throw new Error('Failed')
      toast.success('Resource added')
      setNewResource({
        title: '', description: '', resource_type: 'hotline',
        contact_info: '', url: '', location: '', availability: '24/7',
        is_emergency: false, is_active: true
      })
      fetchResources()
    } catch (error) {
      toast.error('Failed to add resource')
    }
  }

  async function deleteResource(id: number) {
    if (!confirm('Delete this resource?')) return
    try {
      const token = localStorage.getItem('auth_token')
      await fetch(`http://localhost:8000/api/admin/resources/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      })
      toast.success('Resource deleted')
      fetchResources()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const typeIcons = {
    hotline: '📞',
    counselor: '👨‍⚕️',
    article: '📄',
    video: '🎥',
    support_group: '👥'
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
            <h1 className="text-3xl font-bold text-foreground">Mental Health Resources</h1>
            <p className="text-muted-foreground">Manage counselors, hotlines, and support resources</p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-sm">Title</label>
                <Input
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  placeholder="e.g., Campus Counseling Service"
                />
              </div>
              <div>
                <label className="font-semibold text-sm">Type</label>
                <Select value={newResource.resource_type} onValueChange={(v) => setNewResource({...newResource, resource_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['hotline', 'counselor', 'article', 'video', 'support_group'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-semibold text-sm">Description</label>
                <Textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  placeholder="Describe this resource..."
                  rows={3}
                />
              </div>
              <div>
                <label className="font-semibold text-sm">Contact Info</label>
                <Input
                  value={newResource.contact_info}
                  onChange={(e) => setNewResource({...newResource, contact_info: e.target.value})}
                  placeholder="Phone, email, etc."
                />
              </div>
              <div>
                <label className="font-semibold text-sm">URL</label>
                <Input
                  value={newResource.url}
                  onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={addResource}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : resources.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              No resources added yet
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(resource => (
            <Card key={resource.id} className={resource.is_emergency ? 'border-red-500' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {typeIcons[resource.resource_type as keyof typeof typeIcons] || '📚'}
                    </span>
                    <div>
                      <h3 className="font-semibold">{resource.title}</h3>
                      <Badge variant={resource.is_emergency ? 'destructive' : 'secondary'} className="text-xs mt-1">
                        {resource.resource_type}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteResource(resource.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{resource.description}</p>
                {resource.contact_info && (
                  <div>
                    <p className="text-xs font-medium">Contact</p>
                    <p className="text-xs text-muted-foreground">{resource.contact_info}</p>
                  </div>
                )}
                {resource.location && (
                  <div>
                    <p className="text-xs font-medium">Location</p>
                    <p className="text-xs text-muted-foreground">{resource.location}</p>
                  </div>
                )}
                {resource.availability && (
                  <div>
                    <p className="text-xs font-medium">Availability</p>
                    <p className="text-xs text-muted-foreground">{resource.availability}</p>
                  </div>
                )}
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Visit Resource →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
