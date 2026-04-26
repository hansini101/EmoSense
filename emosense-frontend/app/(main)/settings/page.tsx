"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Bell,
  Eye,
  Globe,
  Lock,
  Moon,
  Palette,
  Shield,
  Smartphone,
  Volume2,
  Vibrate,
  Camera,
  MessageCircle,
  BarChart3,
  LogOut,
  Trash2,
  AlertTriangle,
} from "lucide-react"
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
import { useTheme } from "next-themes"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    notifications: true,
    emailReminders: true,
    moodReminders: true,
    soundEffects: true,
    vibration: true,
    cameraAutoDetect: false,
    lumaTypingIndicator: true,
    shareAnonymousData: true,
    showOnlineStatus: false,
    language: "en",
    weeklyReport: true,
    dailyCheckIn: true,
  })

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.success("Setting updated")
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Settings
          </h1>
          <p className="mt-1 text-muted-foreground">Customize your EmoSense experience</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-primary" /> Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of EmoSense</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
                </div>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Language</Label>
                  <p className="text-xs text-muted-foreground">Select interface language</p>
                </div>
              </div>
              <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="si">Sinhala</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-primary" /> Notifications
            </CardTitle>
            <CardDescription>Manage how EmoSense communicates with you</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              { key: "notifications" as const, icon: Bell, label: "Push Notifications", desc: "Receive push notifications on your device" },
              { key: "emailReminders" as const, icon: Smartphone, label: "Email Reminders", desc: "Weekly wellness report and tips via email" },
              { key: "moodReminders" as const, icon: BarChart3, label: "Mood Check-in Reminders", desc: "Gentle reminders to log your mood" },
              { key: "dailyCheckIn" as const, icon: Camera, label: "Daily Check-in", desc: "Morning reminder for emotion scanning" },
              { key: "weeklyReport" as const, icon: BarChart3, label: "Weekly Report", desc: "Receive your weekly mood summary" },
            ].map((item, i) => (
              <div key={item.key}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[item.key] as boolean}
                    onCheckedChange={() => toggle(item.key)}
                  />
                </div>
                {i < 4 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Audio & Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Volume2 className="h-5 w-5 text-primary" /> Sound & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Sound Effects</Label>
                  <p className="text-xs text-muted-foreground">Play sounds for actions and notifications</p>
                </div>
              </div>
              <Switch checked={settings.soundEffects} onCheckedChange={() => toggle("soundEffects")} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Haptic Feedback</Label>
                  <p className="text-xs text-muted-foreground">Vibrate on interactions</p>
                </div>
              </div>
              <Switch checked={settings.vibration} onCheckedChange={() => toggle("vibration")} />
            </div>
          </CardContent>
        </Card>

        {/* Emotion Detection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Camera className="h-5 w-5 text-primary" /> Emotion Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Auto-Detect on Camera Open</Label>
                  <p className="text-xs text-muted-foreground">Start scanning automatically when camera is enabled</p>
                </div>
              </div>
              <Switch checked={settings.cameraAutoDetect} onCheckedChange={() => toggle("cameraAutoDetect")} />
            </div>
          </CardContent>
        </Card>

        {/* Luma AI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-primary" /> Luma AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Typing Indicator</Label>
                  <p className="text-xs text-muted-foreground">{"Show Luma's typing animation"}</p>
                </div>
              </div>
              <Switch checked={settings.lumaTypingIndicator} onCheckedChange={() => toggle("lumaTypingIndicator")} />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" /> Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Anonymous Analytics</Label>
                  <p className="text-xs text-muted-foreground">Help improve EmoSense with anonymous usage data</p>
                </div>
              </div>
              <Switch checked={settings.shareAnonymousData} onCheckedChange={() => toggle("shareAnonymousData")} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Online Status</Label>
                  <p className="text-xs text-muted-foreground">Show when you are active on the platform</p>
                </div>
              </div>
              <Switch checked={settings.showOnlineStatus} onCheckedChange={() => toggle("showOnlineStatus")} />
            </div>
            <Separator />
            <Link href="/privacy">
              <Button variant="outline" className="w-full gap-2">
                <Lock className="h-4 w-4" /> Manage Data & Privacy
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" /> Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/login">
              <Button variant="outline" className="w-full gap-2">
                <LogOut className="h-4 w-4" /> Log Out
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2">
                  <Trash2 className="h-4 w-4" /> Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All your data, including mood history, 
                    journal entries, Luma conversations, and wellness activity logs will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => toast.success("Account deletion request submitted.")}
                  >
                    Delete Forever
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
