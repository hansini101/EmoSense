import Link from "next/link"
import { Brain, Heart } from "lucide-react"

const footerLinks = {
  Features: [
    { href: "/emotion-detection", label: "Emotion Detection" },
    { href: "/wellness", label: "Wellness Hub" },
    { href: "/luma", label: "AI Therapist Luma" },
    { href: "/mood-history", label: "Mood History" },
    { href: "/booking", label: "Book a Counselor" },
  ],
  Support: [
    { href: "/resources", label: "Resources" },
    { href: "/contact", label: "Contact Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy & Data" },
    { href: "/about", label: "Terms of Use" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                EmoSense
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              AI-powered emotion wellness platform designed for university students. 
              Understand your emotions, get personalized support, and thrive.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{category}</h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            EmoSense is not a replacement for professional mental health services. 
            If you are in crisis, please contact emergency services.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="h-3 w-3 text-secondary" /> for student wellbeing
          </p>
        </div>
      </div>
    </footer>
  )
}
