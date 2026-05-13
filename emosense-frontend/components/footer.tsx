"use client"

import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { Heart } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const footerLinks = {
  Features: [
    { href: "/emotion-detection", labelKey: "nav.detect" },
    { href: "/wellness", labelKey: "nav.wellness" },
    { href: "/luma", labelKey: "nav.luma" },
    { href: "/mood-history", labelKey: "nav.history" },
    { href: "/booking", labelKey: "nav.book" },
  ],
  Support: [
    { href: "/resources", labelKey: "nav.resources" },
    { href: "/contact", labelKey: "nav.contact" },
    { href: "/faq", labelKey: "nav.faq" },
    { href: "/about", labelKey: "nav.about" },
  ],
  Legal: [
    { href: "/privacy", labelKey: "nav.privacy" },
    { href: "/about", labelKey: "footer.terms" },
  ],
}

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo className="h-9 w-9" imageClassName="object-contain" />
              <span className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                EmoSense
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{t(`footer.${category.toLowerCase()}`)}</h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {t('footer.disclaimer')}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            {t('footer.made_with')} <Heart className="h-3 w-3 text-secondary" /> {t('footer.for')}
          </p>
        </div>
      </div>
    </footer>
  )
}
