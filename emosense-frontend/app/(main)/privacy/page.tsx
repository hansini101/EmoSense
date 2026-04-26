"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Download,
  Trash2,
  Database,
  FileText,
  MessageCircle,
  Camera,
  Heart,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react"
import { toast } from "sonner"

const dataCategories = [
  {
    icon: Camera,
    title: "Emotion Detection Data",
    description: "Emotion types, confidence scores, and detection timestamps. No photos are stored.",
    records: 47,
    lastUpdated: "2 hours ago",
    storedLocally: false,
    canDelete: true,
  },
  {
    icon: MessageCircle,
    title: "Luma Chat History",
    description: "Conversations with the Luma AI therapist. All messages are encrypted end-to-end.",
    records: 23,
    lastUpdated: "1 day ago",
    storedLocally: false,
    canDelete: true,
  },
  {
    icon: Heart,
    title: "Wellness Activity Logs",
    description: "Journal entries, breathing exercises, playlist interactions, outdoor activities, and goals.",
    records: 68,
    lastUpdated: "5 hours ago",
    storedLocally: false,
    canDelete: true,
  },
  {
    icon: BarChart3,
    title: "Mood History & Analytics",
    description: "Daily mood logs, weekly summaries, and emotional trend data.",
    records: 32,
    lastUpdated: "2 days ago",
    storedLocally: false,
    canDelete: true,
  },
]

const securityFeatures = [
  { icon: Lock, title: "End-to-End Encryption", description: "All sensitive data is encrypted in transit and at rest" },
  { icon: Shield, title: "No Photo Storage", description: "Webcam images are processed locally and never stored on servers" },
  { icon: Eye, title: "Anonymous Analytics", description: "Only anonymized, aggregated data is used for platform improvement" },
  { icon: Database, title: "Data Residency", description: "All data is stored in compliance with local data protection regulations" },
]

export default function PrivacyPage() {
  const [consents, setConsents] = useState({
    anonymousAnalytics: true,
    improvementSurveys: false,
    universitySharing: false,
    marketingEmails: false,
  })

  const toggleConsent = (key: keyof typeof consents) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.success("Privacy preference updated")
  }

  const handleExportData = () => {
    toast.success("Your data export is being prepared. You will receive it via email.")
  }

  const handleDeleteCategory = (category: string) => {
    toast.success(`${category} data has been queued for deletion.`)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Privacy & Data
          </h1>
          <p className="mt-1 text-muted-foreground">
            Control your data and understand how EmoSense protects your privacy
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Security Overview */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Your Privacy is Protected</h2>
                <p className="text-sm text-muted-foreground">EmoSense is built with privacy-by-design principles</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {securityFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3 rounded-lg bg-card p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Storage Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" /> Your Data
            </CardTitle>
            <CardDescription>Overview of all data stored by EmoSense for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Total Records</p>
                <p className="text-xs text-muted-foreground">Across all categories</p>
              </div>
              <Badge variant="secondary" className="text-lg font-bold">
                {dataCategories.reduce((sum, c) => sum + c.records, 0)}
              </Badge>
            </div>

            <div className="flex flex-col gap-4">
              {dataCategories.map((category) => (
                <div key={category.title} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <category.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{category.title}</h3>
                        <p className="text-xs leading-relaxed text-muted-foreground">{category.description}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <Badge variant="outline" className="gap-1 text-xs">
                            <FileText className="h-3 w-3" /> {category.records} records
                          </Badge>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {category.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    {category.canDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="shrink-0 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {category.title}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all {category.records} records in this category. 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteCategory(category.title)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Consent Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" /> Consent Preferences
            </CardTitle>
            <CardDescription>Choose how your data is used beyond core functionality</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              {
                key: "anonymousAnalytics" as const,
                label: "Anonymous Usage Analytics",
                desc: "Help improve EmoSense by sharing anonymized usage patterns. No personal data is included.",
              },
              {
                key: "improvementSurveys" as const,
                label: "Improvement Surveys",
                desc: "Occasional surveys to help us understand your needs better.",
              },
              {
                key: "universitySharing" as const,
                label: "University Aggregate Sharing",
                desc: "Allow anonymized, aggregated data to help your university counseling center improve services.",
              },
              {
                key: "marketingEmails" as const,
                label: "Wellness Tips & Updates",
                desc: "Receive occasional emails with mental wellness tips and new feature announcements.",
              },
            ].map((item, i) => (
              <div key={item.key}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label className="text-sm font-medium">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={consents[item.key]}
                    onCheckedChange={() => toggleConsent(item.key)}
                  />
                </div>
                {i < 3 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Data Actions
            </CardTitle>
            <CardDescription>Export or delete your data</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleExportData}>
              <Download className="h-4 w-4" /> Export All My Data
            </Button>
            <p className="text-xs text-muted-foreground">
              Download a copy of all your data in JSON format. This includes emotion logs, 
              chat history, journal entries, and mood analytics.
            </p>
            <Separator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start gap-2">
                  <Trash2 className="h-4 w-4" /> Delete All My Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" /> Delete All Data
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete ALL your data from EmoSense, including emotion detection history, 
                    Luma conversations, journal entries, mood analytics, wellness logs, and profile information. 
                    This action is irreversible. Your account will remain active but all data will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => toast.success("All data deletion has been initiated. This may take up to 30 days.")}
                  >
                    Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-muted-foreground">
              Permanently delete all stored data. Your account will remain active but empty. 
              Data deletion may take up to 30 days to complete across all systems.
            </p>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <Info className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">About EmoSense Privacy</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              EmoSense is committed to protecting your privacy. We comply with applicable data protection regulations 
              and follow industry best practices for data security. We never sell your personal data to third parties. 
              For questions or concerns about your privacy, contact us at{" "}
              <Link href="/contact" className="text-primary hover:underline">privacy@emosense.app</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
