"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Brain,
  Menu,
  Home,
  BarChart3,
  Camera,
  Heart,
  MessageCircle,
  Clock,
  User,
  HelpCircle,
  BookOpen,
  Phone,
} from "lucide-react"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/emotion-detection", label: "Detect", icon: Camera },
  { href: "/wellness", label: "Wellness", icon: Heart },
  { href: "/luma", label: "Luma AI", icon: MessageCircle },
  { href: "/mood-history", label: "History", icon: Clock },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
]

const moreLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/emotion-detection", label: "Emotion Detection", icon: Camera },
  { href: "/wellness", label: "Wellness", icon: Heart },
  { href: "/luma", label: "Talk to Luma", icon: MessageCircle },
  { href: "/mood-history", label: "Mood History", icon: Clock },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/booking", label: "Book Counselor", icon: Phone },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: HelpCircle },
  { href: "/privacy", label: "Privacy & Data", icon: Brain },
  { href: "/contact", label: "Contact Us", icon: Phone },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/about", label: "About", icon: Brain },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <BrandLogo className="h-9 w-9" imageClassName="object-contain" priority />
          <span className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            EmoSense
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="gap-1.5"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden md:flex md:items-center md:gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-1 pt-6">
                {moreLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </Button>
                    </Link>
                  )
                })}
                <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
