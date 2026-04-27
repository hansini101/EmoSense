"use client"

import Image from "next/image"
import { Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type BrandLogoProps = {
  size?: number
  className?: string
  imageClassName?: string
  priority?: boolean
  alt?: string
}

export function BrandLogo({
  size = 40,
  className,
  imageClassName,
  priority = false,
  alt = "EmoSense logo",
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className={cn("flex items-center justify-center rounded-lg bg-primary", className)}>
        <Brain className="text-primary-foreground" style={{ width: size * 0.6, height: size * 0.6 }} />
      </div>
    )
  }

  return (
    <Image
      src={`/placeholder-logo.png?t=${Date.now()}`}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      onError={() => setImageError(true)}
      className={cn(className, imageClassName)}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  )
}