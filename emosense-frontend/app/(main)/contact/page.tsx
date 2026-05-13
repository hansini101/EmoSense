"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeft, Send, Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useLanguage, type Language } from "@/lib/language-context"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

type ContactCopy = {
  title: string
  subtitle: string
  contactInfo: Array<{ icon: typeof Mail; label: string; value: string; href: string }>
  formTitle: string
  formDescription: string
  sentTitle: string
  sentBody: string
  sentButton: string
  name: string
  namePlaceholder: string
  email: string
  emailPlaceholder: string
  subject: string
  subjectPlaceholder: string
  message: string
  messagePlaceholder: string
  send: string
  sending: string
  subjectOptions: Array<{ value: string; label: string }>
}

const copy: Record<Language, ContactCopy> = {
  en: {
    title: "Contact Us",
    subtitle: "Have a question or feedback? We'd love to hear from you.",
    contactInfo: [
      { icon: Mail, label: "Email", value: "support@emosense.app", href: "mailto:support@emosense.app" },
      { icon: Phone, label: "Phone", value: "+94 11 234 5678", href: "tel:+94112345678" },
      { icon: MapPin, label: "Address", value: "Student Wellness Center, University Campus, Colombo", href: "#" },
      { icon: Clock, label: "Hours", value: "Mon-Fri: 8 AM - 6 PM", href: "#" },
    ],
    formTitle: "Send us a Message",
    formDescription: "Fill out the form below and we will get back to you within 24 hours.",
    sentTitle: "Message Sent!",
    sentBody: "Thank you for reaching out. Our team will review your message and respond within 24 hours.",
    sentButton: "Send Another Message",
    name: "Full Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@university.edu",
    subject: "Subject",
    subjectPlaceholder: "Select a subject",
    message: "Message",
    messagePlaceholder: "How can we help you?",
    send: "Send Message",
    sending: "Sending...",
    subjectOptions: [
      { value: "general", label: "General Inquiry" },
      { value: "technical", label: "Technical Support" },
      { value: "feedback", label: "Feedback" },
      { value: "counseling", label: "Counseling Services" },
      { value: "privacy", label: "Privacy Concerns" },
      { value: "other", label: "Other" },
    ],
  },
  si: {
    title: "අප අමතන්න",
    subtitle: "ප්‍රශ්නයක් හෝ ප්‍රතිචාරයක් තිබේද? අපට අසන්න කැමතියි.",
    contactInfo: [
      { icon: Mail, label: "ඉ-තැපෑල", value: "support@emosense.app", href: "mailto:support@emosense.app" },
      { icon: Phone, label: "දුරකථනය", value: "+94 11 234 5678", href: "tel:+94112345678" },
      { icon: MapPin, label: "ලිපිනය", value: "Student Wellness Center, University Campus, Colombo", href: "#" },
      { icon: Clock, label: "වේලාවන්", value: "සඳුදා-සිකුරාදා: උදේ 8 - සවස 6", href: "#" },
    ],
    formTitle: "අපට පණිවිඩයක් යවන්න",
    formDescription: "පහත පෝරමය පුරවා යවන්න, පැය 24ක් ඇතුළත අපි පිළිතුරු දෙන්නෙමු.",
    sentTitle: "පණිවිඩය යවන ලදී!",
    sentBody: "සම්බන්ධ වීම සඳහා ස්තූතියි. අපගේ කණ්ඩායම ඔබගේ පණිවිඩය සමාලෝචනය කර පැය 24ක් ඇතුළත පිළිතුරු දෙනු ඇත.",
    sentButton: "තවත් පණිවිඩයක් යවන්න",
    name: "සම්පූර්ණ නම",
    namePlaceholder: "ඔබගේ නම",
    email: "ඉ-තැපෑල",
    emailPlaceholder: "you@university.edu",
    subject: "මාතෘකාව",
    subjectPlaceholder: "මාතෘකාවක් තෝරන්න",
    message: "පණිවිඩය",
    messagePlaceholder: "අපි ඔබට උදව් කරන්නේ කොහොමද?",
    send: "පණිවිඩය යවන්න",
    sending: "යවමින්...",
    subjectOptions: [
      { value: "general", label: "සාමාන්‍ය විමසීම" },
      { value: "technical", label: "තාක්ෂණික සහාය" },
      { value: "feedback", label: "ප්‍රතිචාර" },
      { value: "counseling", label: "උපදේශන සේවා" },
      { value: "privacy", label: "පුද්ගලිකත්වය පිළිබඳ කරුණු" },
      { value: "other", label: "වෙනත්" },
    ],
  },
}

export default function ContactPage() {
  const { language } = useLanguage()
  const page = copy[language]
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  })

  function onSubmit(data: ContactFormValues) {
    setLoading(true)
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false)
        if (result.success) {
          setSubmitted(true)
          form.reset()
          toast.success(language === "en" ? "Message sent successfully! We'll be in touch soon." : "පණිවිඩය සාර්ථකව යවන ලදී! අපි ඉක්මනින්ම ඔබට සම්බන්ධ වන්නෙමු.")
        } else {
          toast.error(result.error || (language === "en" ? "Failed to send message. Please try again." : "පණිවිඩය යැවීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න."))
        }
      })
      .catch(() => {
        setLoading(false)
        toast.error(language === "en" ? "An error occurred. Please try again later." : "දෝෂයක් සිදුවිය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.")
      })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {page.title}
          </h1>
          <p className="mt-1 text-muted-foreground">{page.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          {page.contactInfo.map((item) => (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  {item.href !== "#" ? (
                    <a href={item.href} className="text-sm text-primary hover:underline">{item.value}</a>
                  ) : (
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{page.formTitle}</CardTitle>
            <CardDescription>{page.formDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/30">
                  <CheckCircle className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{page.sentTitle}</h3>
                <p className="text-center text-sm text-muted-foreground">{page.sentBody}</p>
                <Button onClick={() => { setSubmitted(false); form.reset() }} variant="outline">
                  {page.sentButton}
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{page.name}</FormLabel>
                          <FormControl>
                            <Input placeholder={page.namePlaceholder} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{page.email}</FormLabel>
                          <FormControl>
                            <Input placeholder={page.emailPlaceholder} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{page.subject}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={page.subjectPlaceholder} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {page.subjectOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{page.message}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={page.messagePlaceholder} rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="gap-2" disabled={loading}>
                    <Send className="h-4 w-4" />
                    {loading ? page.sending : page.send}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
