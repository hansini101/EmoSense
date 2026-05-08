"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BrandLogo } from "@/components/brand-logo"
import { useLanguage } from "@/lib/language-context"
import { Eye, EyeOff, AlertCircle, Lock, Shield } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

export default function AdminLoginPage() {
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { adminLogin } = useAuth()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      // Use adminLogin which will reject non-admin credentials
      await adminLogin(username, password)
      
      toast.success("Admin login successful! Redirecting to admin panel...")
      setTimeout(() => {
        router.push('/admin')
      }, 500)
    } catch (error: any) {
      toast.error(error.message || "Login failed")
      setUsername("")
      setPassword("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="mb-4 flex items-center gap-2">
            <BrandLogo className="h-10 w-10" imageClassName="object-contain" priority />
            <span className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>EmoSense</span>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-red-600 tracking-wider uppercase">Admin Access</span>
            </div>
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <CardDescription>Restricted access for administrators only</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Security Warning Box */}
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-300 flex gap-3">
              <Lock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900 text-sm">🔐 Restricted Access</p>
                <p className="text-xs text-red-800 mt-1">
                  Only authorized administrators can access this panel. Unauthorized access attempts are logged.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Enter admin username" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white" 
                disabled={loading}
              >
                {loading ? "Verifying Admin Credentials..." : "🔐 Access Admin Panel"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Not an admin? {" "}
              <Link href="/login" className="font-medium text-primary hover:underline">Sign in as user</Link>
            </p>

            <div className="mt-6 border-t pt-4">
              <p className="text-center text-xs text-muted-foreground">
                <span className="block font-semibold mb-2 text-slate-600">Security Notice:</span>
                ✓ Protected access area<br/>
                ✓ Access attempts monitored<br/>
                ✓ Only authorized admins can proceed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
