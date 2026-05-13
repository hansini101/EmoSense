"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
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
  LogOut,
  Globe,
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: BarChart3 },
  { href: "/emotion-detection", labelKey: "nav.detect", icon: Camera },
  { href: "/wellness", labelKey: "nav.wellness", icon: Heart },
  { href: "/luma", labelKey: "nav.luma", icon: MessageCircle },
  { href: "/mood-history", labelKey: "nav.history", icon: Clock },
  { href: "/resources", labelKey: "nav.resources", icon: BookOpen },
  { href: "/profile", labelKey: "nav.profile", icon: User },
]

const moreLinks = [
  { href: "/", labelKey: "nav.home", icon: Home },
  { href: "/dashboard", labelKey: "nav.dashboard", icon: BarChart3 },
  { href: "/emotion-detection", labelKey: "nav.detect", icon: Camera },
  { href: "/wellness", labelKey: "nav.wellness", icon: Heart },
  { href: "/luma", labelKey: "nav.luma", icon: MessageCircle },
  { href: "/mood-history", labelKey: "nav.history", icon: Clock },
  { href: "/resources", labelKey: "nav.resources", icon: BookOpen },
  { href: "/booking", labelKey: "nav.book", icon: Phone },
  { href: "/profile", labelKey: "nav.profile", icon: User },
  { href: "/settings", labelKey: "nav.settings", icon: HelpCircle },
  { href: "/privacy", labelKey: "nav.privacy", icon: Brain },
  { href: "/contact", labelKey: "nav.contact", icon: Phone },
  { href: "/faq", labelKey: "nav.faq", icon: HelpCircle },
  { href: "/about", labelKey: "nav.about", icon: Brain },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { isAuthenticated, logout, user, isAdmin } = useAuth()
  const { language, setLanguage, t } = useLanguage()

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
                  {t(link.labelKey)}
                </Button>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden md:flex md:items-center md:gap-2">
            {isAuthenticated ? (
              <>
                {/* Language Switcher */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Globe className="h-4 w-4" />
                      {language === 'en' ? 'EN' : 'SI'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent' : ''}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('si')} className={language === 'si' ? 'bg-accent' : ''}>
                      Sinhala (සිංහල)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <User className="h-4 w-4" />
                      {user?.first_name || user?.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">{t('nav.profile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">{t('nav.settings')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t('nav.signup')}</Button>
                </Link>
              </>
            )}
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
                {isAuthenticated ? (
                  <>
                    {moreLinks.map((link) => {
                      const isActive = pathname === link.href
                      return (
                        <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start gap-2"
                          >
                            <link.icon className="h-4 w-4" />
                            {t(link.labelKey)}
                          </Button>
                        </Link>
                      )
                    })}
                    <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                      {/* Language Switcher Mobile */}
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setLanguage(language === 'en' ? 'si' : 'en')}
                      >
                        <Globe className="h-4 w-4" />
                        {language === 'en' ? t('nav.switch_sinhala') : t('nav.switch_english')}
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          logout()
                          setOpen(false)
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        {t('nav.logout')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {moreLinks.map((link) => {
                      const isActive = pathname === link.href
                      return (
                        <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start gap-2"
                          >
                            <link.icon className="h-4 w-4" />
                            {t(link.labelKey)}
                          </Button>
                        </Link>
                      )
                    })}
                    <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full">{t('nav.login')}</Button>
                      </Link>
                      <Link href="/register" onClick={() => setOpen(false)}>
                        <Button className="w-full">{t('nav.signup')}</Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
