"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Star,
  User,
  Video,
  MapPin,
  CheckCircle,
  GraduationCap,
  Brain,
} from "lucide-react"
import { toast } from "sonner"

const counselors = [
  {
    id: 1,
    name: "Dr. Sarah Fernando",
    title: "Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Academic Stress"],
    rating: 4.9,
    reviews: 142,
    available: ["Mon", "Wed", "Fri"],
    mode: "Online & In-Person",
    icon: Brain,
  },
  {
    id: 2,
    name: "Mr. Kamal Perera",
    title: "Counseling Psychologist",
    specialties: ["Relationship Issues", "Self-Esteem", "Grief"],
    rating: 4.8,
    reviews: 98,
    available: ["Tue", "Thu"],
    mode: "Online",
    icon: User,
  },
  {
    id: 3,
    name: "Dr. Nisha Jayawardena",
    title: "Student Wellness Counselor",
    specialties: ["Study Skills", "Career Anxiety", "Social Anxiety"],
    rating: 4.9,
    reviews: 215,
    available: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    mode: "Online & In-Person",
    icon: GraduationCap,
  },
  {
    id: 4,
    name: "Ms. Dilani Silva",
    title: "Art Therapy Counselor",
    specialties: ["Trauma", "Expression Therapy", "Mindfulness"],
    rating: 4.7,
    reviews: 67,
    available: ["Wed", "Sat"],
    mode: "In-Person",
    icon: User,
  },
]

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
]

export default function BookingPage() {
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [sessionType, setSessionType] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [booked, setBooked] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const validate = (): string[] => {
    const errs: string[] = []
    if (!selectedCounselor) errs.push("Please select a counselor.")
    if (!date) errs.push("Please select a date.")
    if (!selectedTime) errs.push("Please select a time slot.")
    if (!sessionType) errs.push("Please select a session type.")
    return errs
  }

  const handleBookClick = () => {
    const errs = validate()
    if (errs.length > 0) {
      setErrors(errs)
      toast.error(errs[0])
      return
    }
    setErrors([])
    setShowConfirmDialog(true)
  }

  const confirmBooking = () => {
    setShowConfirmDialog(false)
    setBooked(true)
    toast.success("Appointment booked successfully!")
  }

  const resetBooking = () => {
    setBooked(false)
    setSelectedCounselor(null)
    setDate(undefined)
    setSelectedTime("")
    setSessionType("")
    setErrors([])
  }

  const counselor = counselors.find((c) => c.id === selectedCounselor)

  if (booked) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/30"
              >
                <CheckCircle className="h-8 w-8 text-foreground" />
              </motion.div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                Booking Confirmed!
              </h1>
              <p className="text-muted-foreground">Your appointment has been scheduled.</p>
              <div className="w-full rounded-lg border border-border p-4 text-left">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Counselor:</span>
                    <span className="font-medium text-foreground">{counselor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium text-foreground">
                      {date?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium text-foreground">{sessionType}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={resetBooking}>
                  Book Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/resources">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Book a Counselor
          </h1>
          <p className="mt-1 text-muted-foreground">Schedule a session with a verified counselor or psychologist</p>
        </div>
      </div>

      <Tabs defaultValue="counselors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="counselors" className="gap-2">
            <User className="h-4 w-4" /> Choose Counselor
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2" disabled={!selectedCounselor}>
            <CalendarIcon className="h-4 w-4" /> Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="counselors">
          <div className="grid gap-4 md:grid-cols-2">
            {counselors.map((counselor) => (
              <Card
                key={counselor.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedCounselor === counselor.id ? "border-primary ring-2 ring-primary/20" : ""}`}
                onClick={() => setSelectedCounselor(counselor.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <counselor.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{counselor.name}</h3>
                      <p className="text-sm text-muted-foreground">{counselor.title}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {counselor.specialties.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" className="text-yellow-500" /> {counselor.rating} ({counselor.reviews})
                        </span>
                        <span className="flex items-center gap-1">
                          {counselor.mode.includes("Online") ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                          {counselor.mode}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Available: {counselor.available.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date() || d.getDay() === 0}
                  className="rounded-md"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Select Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(slot)}
                      className="text-xs"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Session Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Session Type</Label>
                    <Select value={sessionType} onValueChange={setSessionType}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Video Call">Video Call</SelectItem>
                        <SelectItem value="In-Person">In-Person</SelectItem>
                        <SelectItem value="Phone Call">Phone Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea id="notes" placeholder="Briefly describe what you'd like to discuss..." rows={3} />
                  </div>
                  {errors.length > 0 && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2">
                      {errors.map((err, i) => (
                        <p key={i} className="text-xs text-destructive">{err}</p>
                      ))}
                    </div>
                  )}
                  <Button onClick={handleBookClick} className="gap-2" disabled={!date || !selectedTime || !sessionType}>
                    <CheckCircle className="h-4 w-4" /> Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Please review your appointment details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border p-4">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Counselor:</span>
                <span className="font-medium text-foreground">{counselor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-foreground">
                  {date?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium text-foreground">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground">{sessionType}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={confirmBooking} className="gap-2">
              <CheckCircle className="h-4 w-4" /> Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
