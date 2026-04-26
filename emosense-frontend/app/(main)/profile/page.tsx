"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  User,
  Mail,
  GraduationCap,
  Calendar,
  Edit3,
  Save,
  Camera,
  Heart,
  Brain,
  Clock,
  BarChart3,
  Settings,
  Shield,
  Award,
  Flame,
} from "lucide-react"
import { toast } from "sonner"

const stats = [
  { label: "Emotion Scans", value: "47", icon: Camera, color: "text-primary" },
  { label: "Luma Chats", value: "23", icon: Brain, color: "text-primary" },
  { label: "Journal Entries", value: "18", icon: Edit3, color: "text-primary" },
  { label: "Wellness Days", value: "32", icon: Heart, color: "text-primary" },
]

const achievements = [
  { title: "First Scan", description: "Completed your first emotion detection", icon: Camera, earned: true },
  { title: "Journaling Streak", description: "7 consecutive days of journaling", icon: Flame, earned: true },
  { title: "Mood Master", description: "Logged moods for 30 days", icon: BarChart3, earned: true },
  { title: "Wellness Explorer", description: "Tried all 5 wellness activities", icon: Heart, earned: false },
  { title: "Luma Regular", description: "50 conversations with Luma", icon: Brain, earned: false },
  { title: "Goal Getter", description: "Completed 10 wellness goals", icon: Award, earned: false },
]

const recentActivity = [
  { action: "Emotion detected: Happy (92%)", time: "2 hours ago", icon: Camera },
  { action: "Gratitude journal entry added", time: "5 hours ago", icon: Edit3 },
  { action: "Chat with Luma", time: "1 day ago", icon: Brain },
  { action: "Completed breathing exercise", time: "1 day ago", icon: Heart },
  { action: "Mood logged: Calm", time: "2 days ago", icon: Clock },
]

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Perera",
    email: "alex.perera@university.edu",
    university: "University of Colombo",
    faculty: "Science",
    year: "3rd Year",
    ageRange: "20-24",
    bio: "Computer science student passionate about mental health technology. I use EmoSense to track my emotional patterns during exam season.",
  })

  const handleSave = () => {
    setEditing(false)
    toast.success("Profile updated successfully!")
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              My Profile
            </h1>
            <p className="mt-1 text-muted-foreground">Manage your account and view your progress</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/settings">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Settings className="h-4 w-4" /> Settings
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Shield className="h-4 w-4" /> Privacy
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                    {profile.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <GraduationCap className="h-3 w-3" /> {profile.university}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" /> {profile.year}
                </Badge>
              </div>
              <p className="text-center text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>

              {/* Stats Grid */}
              <div className="grid w-full grid-cols-2 gap-3 pt-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                    <stat.icon className={`mb-1 h-4 w-4 ${stat.color}`} />
                    <span className="text-lg font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Edit Profile */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </div>
              {editing ? (
                <Button size="sm" className="gap-1.5" onClick={handleSave}>
                  <Save className="h-4 w-4" /> Save
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setEditing(true)}>
                  <Edit3 className="h-4 w-4" /> Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!editing}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile.email} disabled className="text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>University</Label>
                  <Input
                    value={profile.university}
                    onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                    disabled={!editing}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Faculty</Label>
                  <Input
                    value={profile.faculty}
                    onChange={(e) => setProfile({ ...profile, faculty: e.target.value })}
                    disabled={!editing}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Year of Study</Label>
                  <Select
                    value={profile.year}
                    onValueChange={(v) => setProfile({ ...profile, year: v })}
                    disabled={!editing}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"].map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Age Range</Label>
                  <Select
                    value={profile.ageRange}
                    onValueChange={(v) => setProfile({ ...profile, ageRange: v })}
                    disabled={!editing}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["16-19", "20-24", "25-30"].map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!editing}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> Achievements
              </CardTitle>
              <CardDescription>Your milestones on the wellness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((a) => (
                  <div
                    key={a.title}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${
                      a.earned ? "border-primary/20 bg-primary/5" : "border-border opacity-50"
                    }`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      a.earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      <a.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
