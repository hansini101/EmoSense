'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Crop, RefreshCw } from 'lucide-react'

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedImage: string) => void
  onCancel: () => void
}

export function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 })
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 })

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget
    const rect = img.getBoundingClientRect()
    const displayedW = rect.width
    const displayedH = rect.height
    setImgDimensions({ width: displayedW, height: displayedH })
    // Set initial crop to a centered square, but not larger than the image
    const defaultSize = Math.min(200, displayedW, displayedH)
    setCrop({
      x: Math.max(0, (displayedW - defaultSize) / 2),
      y: Math.max(0, (displayedH - defaultSize) / 2),
      width: defaultSize,
      height: defaultSize,
    })
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCrop((prev) => {
      const newX = Math.max(0, Math.min(rect.width - prev.width, x - prev.width / 2))
      const newY = Math.max(0, Math.min(rect.height - prev.height, y - prev.height / 2))
      return { ...prev, x: newX, y: newY }
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCrop = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Map displayed coordinates to the image's natural pixel coordinates using the element's bounding rect
    const rect = img.getBoundingClientRect()
    const scaleX = img.naturalWidth / rect.width
    const scaleY = img.naturalHeight / rect.height
    let sx = Math.max(0, Math.round(crop.x * scaleX))
    let sy = Math.max(0, Math.round(crop.y * scaleY))
    let sWidth = Math.max(1, Math.round(crop.width * scaleX))
    let sHeight = Math.max(1, Math.round(crop.height * scaleY))

    // Clamp to natural image bounds
    if (sx + sWidth > img.naturalWidth) sWidth = img.naturalWidth - sx
    if (sy + sHeight > img.naturalHeight) sHeight = img.naturalHeight - sy

    // Export at natural-pixel size for accuracy
    canvas.width = sWidth
    canvas.height = sHeight
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

    const croppedImage = canvas.toDataURL('image/jpeg')
    onCropComplete(croppedImage)
  }, [crop, onCropComplete])

  const resetCrop = useCallback(() => {
    if (imageRef.current) {
      const defaultSize = Math.min(200, imgDimensions.width || 200, imgDimensions.height || 200)
      setCrop({
        x: Math.max(0, ((imgDimensions.width || defaultSize) - defaultSize) / 2),
        y: Math.max(0, ((imgDimensions.height || defaultSize) - defaultSize) / 2),
        width: defaultSize,
        height: defaultSize,
      })
    }
  }, [imgDimensions])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative inline-block">
        <div
          className="relative overflow-hidden rounded-lg border border-border"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={image}
            alt="Crop preview"
            className="max-w-full"
            onLoad={handleImageLoad}
          />
          {/* Crop overlay */}
          <div
            className="absolute border-2 border-primary cursor-move bg-primary/10"
            style={{
              left: `${crop.x}px`,
              top: `${crop.y}px`,
              width: `${crop.width}px`,
              height: `${crop.height}px`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Crop className="h-6 w-6 text-primary opacity-50" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleCrop} className="flex-1 gap-2">
          <Crop className="h-4 w-4" /> Apply Crop
        </Button>
        <Button variant="outline" onClick={resetCrop} className="gap-2">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
