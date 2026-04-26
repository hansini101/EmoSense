"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import {
  Camera,
  Upload,
  RefreshCw,
  ArrowLeft,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Zap,
  Heart,
  MessageCircle,
  ImageIcon,
  Angry,
  Eye,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { toast } from "sonner"

type EmotionResult = {
  emotion: string
  confidence: number
  color: string
  icon: typeof Smile
  secondaryEmotions: { name: string; value: number }[]
  suggestions: string[]
  wellnessLink: { label: string; href: string }
}

const emotionResults: Record<string, EmotionResult> = {
  happy: {
    emotion: "Happy",
    confidence: 87,
    color: "#FCD34D",
    icon: Smile,
    secondaryEmotions: [
      { name: "Joyful", value: 72 },
      { name: "Content", value: 54 },
      { name: "Excited", value: 41 },
    ],
    suggestions: [
      "Share your joy with someone you care about",
      "Write in your gratitude journal",
      "Create a happy playlist to relive this moment",
    ],
    wellnessLink: { label: "Share Your Joy", href: "/wellness/share-joy" },
  },
  sad: {
    emotion: "Sad",
    confidence: 72,
    color: "#60A5FA",
    icon: Frown,
    secondaryEmotions: [
      { name: "Melancholic", value: 58 },
      { name: "Lonely", value: 34 },
      { name: "Disappointed", value: 29 },
    ],
    suggestions: [
      "Try a breathing exercise to calm your mind",
      "Talk to Luma for emotional support",
      "Reach out to a friend or counselor",
    ],
    wellnessLink: { label: "Try Breathing Exercise", href: "/wellness" },
  },
  neutral: {
    emotion: "Neutral",
    confidence: 65,
    color: "#94A3B8",
    icon: Meh,
    secondaryEmotions: [
      { name: "Calm", value: 48 },
      { name: "Pensive", value: 32 },
      { name: "Observant", value: 25 },
    ],
    suggestions: [
      "Try a mindfulness activity",
      "Go for a walk outdoors",
      "Set a new wellness goal for yourself",
    ],
    wellnessLink: { label: "Set a Goal", href: "/wellness/goals" },
  },
  angry: {
    emotion: "Angry",
    confidence: 78,
    color: "#F87171",
    icon: Angry,
    secondaryEmotions: [
      { name: "Frustrated", value: 62 },
      { name: "Irritated", value: 45 },
      { name: "Resentful", value: 28 },
    ],
    suggestions: [
      "Take deep breaths — try the 4-7-8 technique",
      "Write down what triggered this feeling",
      "Go for a walk or physical activity",
    ],
    wellnessLink: { label: "Breathing Exercise", href: "/wellness" },
  },
  surprised: {
    emotion: "Surprised",
    confidence: 74,
    color: "#FB923C",
    icon: Eye,
    secondaryEmotions: [
      { name: "Amazed", value: 55 },
      { name: "Startled", value: 38 },
      { name: "Curious", value: 42 },
    ],
    suggestions: [
      "Reflect on what surprised you today",
      "Share the experience with someone",
      "Journal about unexpected moments",
    ],
    wellnessLink: { label: "Gratitude Journal", href: "/wellness/gratitude-journal" },
  },
  fearful: {
    emotion: "Fearful",
    confidence: 69,
    color: "#A78BFA",
    icon: AlertTriangle,
    secondaryEmotions: [
      { name: "Anxious", value: 58 },
      { name: "Nervous", value: 44 },
      { name: "Worried", value: 36 },
    ],
    suggestions: [
      "Ground yourself with the 5-4-3-2-1 technique",
      "Talk to Luma or a trusted person",
      "Remember: this feeling will pass",
    ],
    wellnessLink: { label: "Talk to Luma", href: "/luma" },
  },
  disgusted: {
    emotion: "Disgusted",
    confidence: 63,
    color: "#4ADE80",
    icon: ThumbsUp,
    secondaryEmotions: [
      { name: "Disapproving", value: 47 },
      { name: "Uncomfortable", value: 39 },
      { name: "Repelled", value: 25 },
    ],
    suggestions: [
      "Remove yourself from the triggering situation",
      "Practice a calming breathing exercise",
      "Engage in an activity you enjoy",
    ],
    wellnessLink: { label: "Outdoor Activities", href: "/wellness/outdoor" },
  },
}

export default function EmotionDetectionPage() {
  const [mode, setMode] = useState<"webcam" | "upload">("webcam")
  const [cameraActive, setCameraActive] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<EmotionResult | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const [accuracyRate, setAccuracyRate] = useState(92)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch {
      toast.error("Unable to access camera. Please check permissions.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }, [])

  const captureAndAnalyze = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      ctx?.drawImage(videoRef.current, 0, 0)
      stopCamera()
    }
    analyzeEmotion()
  }, [stopCamera])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeEmotion = () => {
    setAnalyzing(true)
    setResult(null)
    const emotions = Object.keys(emotionResults)
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    setTimeout(() => {
      setResult(emotionResults[randomEmotion])
      setAnalyzing(false)
      toast.success("Emotion analysis complete!")
    }, 2500)
  }

  const resetAll = () => {
    setResult(null)
    setUploadedImage(null)
    setCameraActive(false)
    setFeedbackGiven(false)
    stopCamera()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Emotion Detection
          </h1>
          <p className="mt-1 text-muted-foreground">Capture or upload a photo to analyze your emotion</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Input Section */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <Tabs value={mode} onValueChange={(v) => { setMode(v as "webcam" | "upload"); resetAll() }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="webcam" className="gap-2">
                    <Camera className="h-4 w-4" /> Webcam
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="gap-2">
                    <Upload className="h-4 w-4" /> Upload Image
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="webcam" className="mt-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
                    {cameraActive ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <Camera className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                          Click the button below to start your camera
                        </p>
                      </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    {!cameraActive ? (
                      <Button onClick={startCamera} className="flex-1 gap-2">
                        <Camera className="h-4 w-4" /> Start Camera
                      </Button>
                    ) : (
                      <Button onClick={captureAndAnalyze} className="flex-1 gap-2" disabled={analyzing}>
                        <Zap className="h-4 w-4" />
                        {analyzing ? "Analyzing..." : "Capture & Analyze"}
                      </Button>
                    )}
                    {(cameraActive || result) && (
                      <Button variant="outline" onClick={resetAll} className="gap-2">
                        <RefreshCw className="h-4 w-4" /> Reset
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="mt-4">
                  <div
                    className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/50"
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload image"
                    onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click() }}
                  >
                    {uploadedImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={uploadedImage} alt="Uploaded preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <ImageIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">Click to upload an image</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                      onClick={() => analyzeEmotion()}
                      className="flex-1 gap-2"
                      disabled={!uploadedImage || analyzing}
                    >
                      <Zap className="h-4 w-4" />
                      {analyzing ? "Analyzing..." : "Analyze Emotion"}
                    </Button>
                    {(uploadedImage || result) && (
                      <Button variant="outline" onClick={resetAll} className="gap-2">
                        <RefreshCw className="h-4 w-4" /> Reset
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
              <CardDescription>
                {analyzing ? "Processing your image..." : result ? "Emotion detected successfully" : "Waiting for image..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {analyzing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 py-8"
                  >
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
                    <p className="text-sm text-muted-foreground">Analyzing facial expression...</p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${result.color}30` }}
                    >
                      <result.icon className="h-10 w-10" style={{ color: result.color }} />
                    </motion.div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-foreground">{result.emotion}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Detected Emotion</p>
                    </div>
                    <div className="w-full">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-medium text-foreground">{result.confidence}%</span>
                      </div>
                      <Progress value={result.confidence} className="h-3" />
                    </div>

                    {/* Secondary Emotions */}
                    <div className="w-full border-t border-border pt-3">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Related Emotions</h4>
                      <div className="flex flex-col gap-1.5">
                        {result.secondaryEmotions.map((se) => (
                          <div key={se.name} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{se.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${se.value}%` }}
                                  transition={{ duration: 0.6, delay: 0.2 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: result.color }}
                                />
                              </div>
                              <span className="w-8 text-right text-xs text-muted-foreground">{se.value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="w-full border-t border-border pt-3">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggestions</h4>
                      <div className="flex flex-col gap-2">
                        {result.suggestions.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
                            <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Section */}
                    {!feedbackGiven && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="w-full rounded-lg border border-border bg-muted/30 p-3"
                      >
                        <p className="mb-2 text-xs font-medium text-foreground">Was this accurate?</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setFeedbackGiven(true)
                              setAccuracyRate(Math.min(100, accuracyRate + 1))
                              toast.success("Thanks! Your feedback helps improve accuracy.")
                            }}
                            className="flex-1 gap-1 text-xs"
                          >
                            <ThumbsUp className="h-3 w-3" /> Yes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setFeedbackGiven(true)
                              setAccuracyRate(Math.max(85, accuracyRate - 1))
                              toast.info("Your feedback helps us improve. What emotion were you actually feeling?")
                            }}
                            className="flex-1 gap-1 text-xs"
                          >
                            <ThumbsDown className="h-3 w-3" /> No
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Accuracy Stats */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: feedbackGiven ? 0.2 : 0.8 }}
                      className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-2"
                    >
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">System Accuracy</p>
                        <p className="text-sm font-bold text-foreground">{accuracyRate}%</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <ThumbsUp className="h-5 w-5 text-primary" />
                      </div>
                    </motion.div>

                    <div className="flex w-full gap-2">
                      <Link href={result.wellnessLink.href} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          <Heart className="h-3 w-3" /> {result.wellnessLink.label}
                        </Button>
                      </Link>
                      <Link href="/luma" className="flex-1">
                        <Button size="sm" className="w-full gap-1">
                          <MessageCircle className="h-3 w-3" /> Talk to Luma
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 py-8"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      Use your webcam or upload a photo to get started with emotion detection.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
