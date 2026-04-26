"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Lock,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Shield,
  Database,
  UserCheck,
} from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45 },
  }),
}

export default function PrivacyEthicsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Privacy & Ethical AI
          </h1>
          <p className="mt-1 text-muted-foreground">Your data, your control, responsible AI</p>
        </div>
      </div>

      {/* Important Disclaimer */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        <Card className="border-yellow-200/50 bg-yellow-50/50 dark:border-yellow-900/30 dark:bg-yellow-950/20">
          <CardContent className="flex items-start gap-4 p-6">
            <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="font-bold text-foreground">Not a Medical Tool</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                EmoSense is a <strong>wellness and reflection tool</strong>, not a medical device or substitute for professional mental health care. If you're experiencing mental health concerns, please contact a healthcare professional or therapist. In emergencies, always call emergency services.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy Features */}
      <div className="mt-8">
        <h2 className="mb-6 text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Your Privacy, Protected
        </h2>
        <div className="space-y-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeUp}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <CardTitle>End-to-End Encryption</CardTitle>
                </div>
                <CardDescription>Your emotions and data are encrypted in transit and at rest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• All data transmitted over HTTPS with TLS 1.3 encryption</p>
                <p>• Your conversation with Luma is private and not shared with third parties</p>
                <p>• Emotion detection happens locally on your device when possible</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            variants={fadeUp}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>Data Minimization</CardTitle>
                </div>
                <CardDescription>We only collect what's necessary for your wellness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• We don't store photos or video feeds—only emotion classifications</p>
                <p>• No tracking of your location, device ID, or browsing behavior</p>
                <p>• No third-party cookies or analytics scripts</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            variants={fadeUp}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-primary" />
                  <CardTitle>You Control Your Data</CardTitle>
                </div>
                <CardDescription>Delete everything whenever you want</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Download all your data as JSON anytime</p>
                <p>• Delete individual emotion entries instantly</p>
                <p>• Request complete account deletion (all data permanently removed)</p>
                <Link href="/settings/data-export" className="mt-2 inline-block">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Database className="h-3 w-3" /> Export Your Data
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Ethical AI Practices */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Ethical AI Practices
        </h2>
        <div className="space-y-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            variants={fadeUp}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-primary" />
                  <CardTitle>Explainable AI</CardTitle>
                </div>
                <CardDescription>Understand why the system made a decision</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Every emotion detection shows confidence scores</p>
                <p>• We explain: "Based on facial expression patterns"</p>
                <p>• Smart suggestions include their reasoning</p>
                <p>• Feedback mechanism helps you train the system</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={5}
            variants={fadeUp}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <CardTitle>Bias Awareness</CardTitle>
                </div>
                <CardDescription>We acknowledge AI limitations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• AI emotion detection can be influenced by lighting, angles, and expressions</p>
                <p>• Different cultural expressions of emotion may not be perfectly recognized</p>
                <p>• Your feedback helps us improve fairness across diverse groups</p>
                <p>• We continuously test for bias and work to reduce it</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={6}
            variants={fadeUp}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>No Harmful Use</CardTitle>
                </div>
                <CardDescription>EmoSense is designed for wellness, not surveillance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Your emotion data is never sold to third parties</p>
                <p>• We don't use your data for advertising or manipulation</p>
                <p>• No integration with surveillance or law enforcement systems</p>
                <p>• Your consent is required for any new data uses</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={7}
            variants={fadeUp}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle>Continuous Improvement</CardTitle>
                </div>
                <CardDescription>We're committed to doing better</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Regular security audits and penetration testing</p>
                <p>• Your feedback directly improves system accuracy</p>
                <p>• Transparent changelog of algorithm updates</p>
                <p>• Third-party bias audits (coming soon)</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6">
        <h3 className="mb-4 text-lg font-bold text-foreground">Questions About Privacy?</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          We take your privacy seriously. If you have concerns about your data or how we use AI, please reach out.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="gap-2">
            <MailIcon /> Email: privacy@emosense.app
          </Button>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function MailIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}
