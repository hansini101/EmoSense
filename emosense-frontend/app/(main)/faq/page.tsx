import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, HelpCircle, MessageCircle, Mail } from "lucide-react"

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is EmoSense?",
        a: "EmoSense is an AI-powered emotion wellness platform designed specifically for university students aged 16-30. It uses facial recognition technology to detect emotions, provides personalized wellness recommendations, and connects you with an AI therapist named Luma and campus mental health resources.",
      },
      {
        q: "Is EmoSense a replacement for professional therapy?",
        a: "No. EmoSense is a supplementary tool designed to support your emotional wellness journey. While Luma provides helpful suggestions and coping strategies, it is not a licensed therapist. For serious mental health concerns, we always recommend consulting with a professional counselor. You can book one directly through our platform.",
      },
      {
        q: "Who can use EmoSense?",
        a: "EmoSense is designed for university students aged 16-30. It's available for free to all enrolled students at partnering institutions. Students can sign up using their university email address.",
      },
    ],
  },
  {
    category: "Emotion Detection",
    questions: [
      {
        q: "How does emotion detection work?",
        a: "EmoSense uses AI-powered facial analysis to detect emotions from your webcam feed or uploaded photos. The system analyzes facial expressions and maps them to seven core emotions: Happy, Sad, Angry, Fearful, Surprised, Disgusted, and Neutral. Each detection comes with a confidence score.",
      },
      {
        q: "How accurate is the emotion detection?",
        a: "Our AI model achieves approximately 95% accuracy on standard emotion recognition benchmarks. However, accuracy may vary based on lighting conditions, image quality, and individual facial characteristics. The confidence score helps indicate how certain the model is about its prediction.",
      },
      {
        q: "Are my photos stored?",
        a: "No. Photos captured through the webcam or uploaded for analysis are processed in real-time and are NOT stored on our servers. Only the emotion detection results (emotion type, confidence score, and timestamp) are saved to your mood history.",
      },
    ],
  },
  {
    category: "Luma AI Therapist",
    questions: [
      {
        q: "Who is Luma?",
        a: "Luma is EmoSense's AI wellness companion. Luma provides personalized suggestions, coping strategies, breathing exercises, and emotional support through a chat interface. Luma is trained to be empathetic, supportive, and non-judgmental.",
      },
      {
        q: "Is my conversation with Luma private?",
        a: "Yes. Your conversations with Luma are private and encrypted. We do not share your chat data with third parties. You can delete your chat history at any time from your Privacy & Data settings.",
      },
    ],
  },
  {
    category: "Privacy & Data",
    questions: [
      {
        q: "What data does EmoSense collect?",
        a: "EmoSense collects: your profile information (name, email, age range), emotion detection results, wellness activity logs, and chat interactions with Luma. We do NOT collect or store facial images used for detection.",
      },
      {
        q: "Can I delete my data?",
        a: "Yes. You can view, export, or delete all your personal data at any time from the Privacy & Data page in your profile settings. Data deletion is permanent and cannot be undone.",
      },
      {
        q: "Is my data shared with my university?",
        a: "Only aggregated, anonymized analytics may be shared with university counseling centers to improve their services. Your individual data is never shared without your explicit consent.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions
          </h1>
          <p className="mt-1 text-muted-foreground">Find answers to common questions about EmoSense</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
              <HelpCircle className="h-5 w-5 text-primary" /> {section.category}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {section.questions.map((faq, i) => (
                <AccordionItem key={i} value={`${section.category}-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Still have questions */}
      <Card className="mt-10">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground">Still Have Questions?</h3>
          <p className="text-sm text-muted-foreground">
            {"Can't find what you're looking for? Reach out to us directly."}
          </p>
          <div className="flex gap-3">
            <Link href="/contact">
              <Button className="gap-2">
                <Mail className="h-4 w-4" /> Contact Us
              </Button>
            </Link>
            <Link href="/luma">
              <Button variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" /> Ask Luma
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
