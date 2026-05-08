"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    aiConfidenceThreshold: 0.7,
    modelVersion: '1.0.0',
    enableEmergencyAlerts: true,
    enableLumaChat: true,
    enableEmotionDetection: true,
    enableWellnessRecommendations: true,
    emailNotificationsEnabled: true,
  })

  function handleSave() {
    toast.success('Settings saved successfully')
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings</p>
        </div>
      </div>

      {/* AI Model Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Model Settings</CardTitle>
          <CardDescription>Configure emotion detection model parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-semibold">Confidence Threshold</Label>
            <p className="text-sm text-muted-foreground mb-2">Minimum confidence score to report emotion (0-1)</p>
            <div className="flex gap-4 items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.aiConfidenceThreshold}
                onChange={(e) => setSettings({...settings, aiConfidenceThreshold: parseFloat(e.target.value)})}
                className="flex-1"
              />
              <span className="text-sm font-mono w-12 text-right">
                {settings.aiConfidenceThreshold.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <Label className="font-semibold">Model Version</Label>
            <Input
              value={settings.modelVersion}
              onChange={(e) => setSettings({...settings, modelVersion: e.target.value})}
              disabled
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Current deployed model version</p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>Enable or disable features system-wide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-semibold">Emotion Detection</Label>
              <p className="text-sm text-muted-foreground">Allow users to detect emotions</p>
            </div>
            <Switch
              checked={settings.enableEmotionDetection}
              onCheckedChange={(checked) => setSettings({...settings, enableEmotionDetection: checked})}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <Label className="font-semibold">Luma AI Chat</Label>
              <p className="text-sm text-muted-foreground">Enable AI wellness companion</p>
            </div>
            <Switch
              checked={settings.enableLumaChat}
              onCheckedChange={(checked) => setSettings({...settings, enableLumaChat: checked})}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <Label className="font-semibold">Wellness Recommendations</Label>
              <p className="text-sm text-muted-foreground">Show AI-powered recommendations</p>
            </div>
            <Switch
              checked={settings.enableWellnessRecommendations}
              onCheckedChange={(checked) => setSettings({...settings, enableWellnessRecommendations: checked})}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <Label className="font-semibold">Emergency Alerts</Label>
              <p className="text-sm text-muted-foreground">Flag high-risk emotional patterns</p>
            </div>
            <Switch
              checked={settings.enableEmergencyAlerts}
              onCheckedChange={(checked) => setSettings({...settings, enableEmergencyAlerts: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Communication Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Communication Settings</CardTitle>
          <CardDescription>Configure notifications and emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-semibold">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send system notifications via email</p>
            </div>
            <Switch
              checked={settings.emailNotificationsEnabled}
              onCheckedChange={(checked) => setSettings({...settings, emailNotificationsEnabled: checked})}
            />
          </div>

          <div className="border-t pt-4">
            <Label className="font-semibold">From Email Address</Label>
            <Input
              type="email"
              value="noreply@emosense.com"
              disabled
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">System email address for notifications</p>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">System Status</span>
            <span className="font-semibold">✓ Healthy</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">API Version</span>
            <span className="font-semibold">v1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Database Status</span>
            <span className="font-semibold">✓ Connected</span>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="mb-6 border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <p className="text-sm text-yellow-900">
            <strong>⚠️ Important Disclaimer:</strong> This system is not a medical diagnostic tool. It is designed to assist with wellness and emotional awareness. Always encourage users to seek professional mental health support when needed. In emergencies, direct users to appropriate crisis resources.
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/admin">
          <Button variant="outline">Back</Button>
        </Link>
        <Button onClick={handleSave} className="gap-2">
          ✓ Save Settings
        </Button>
      </div>
    </div>
  )
}
