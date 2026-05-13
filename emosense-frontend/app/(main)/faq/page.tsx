"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, HelpCircle, MessageCircle, Mail } from "lucide-react"
import { useLanguage, type Language } from "@/lib/language-context"

type FAQPageCopy = {
  title: string
  subtitle: string
  categories: Array<{
    category: string
    questions: Array<{ q: string; a: string }>
  }>
  stillQuestionsTitle: string
  stillQuestionsBody: string
  contactUs: string
  askLuma: string
}

const copy: Record<Language, FAQPageCopy> = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about EmoSense",
    categories: [
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
    ],
    stillQuestionsTitle: "Still Have Questions?",
    stillQuestionsBody: "Can't find what you're looking for? Reach out to us directly.",
    contactUs: "Contact Us",
    askLuma: "Ask Luma",
  },
  si: {
    title: "නිතර අසන ප්‍රශ්න",
    subtitle: "EmoSense ගැන සාමාන්‍ය ප්‍රශ්නවලට පිළිතුරු සොයාගන්න",
    categories: [
      {
        category: "සාමාන්‍ය",
        questions: [
          {
            q: "EmoSense කියන්නේ මොකක්ද?",
            a: "EmoSense යනු විශ්වවිද්‍යාල සිසුන් සඳහා විශේෂයෙන්ම නිර්මාණය කළ AI-මඟින් සක්‍රිය වූ චිත්තවේගීය සුවතා වේදිකාවක්. එය මුහුණු හඳුනාගැනීමේ තාක්ෂණය භාවිතා කර හැඟීම් හඳුනාගනී, පුද්ගලික සුවතා නිර්දේශ ලබාදේ, සහ Luma නම් AI therapist කෙනෙකු සහ කැම්පස් මානසික සෞඛ්‍ය සම්පත් සමඟ ඔබව සම්බන්ධ කරයි.",
          },
          {
            q: "EmoSense වෘත්තීය චිකිත්සාවට ආදේශකයක්ද?",
            a: "නැහැ. EmoSense යනු ඔබගේ චිත්තවේගීය සුවතා ගමනට සහාය වීමට නිර්මාණය කළ අමතර මෙවලමකි. Luma ප්‍රයෝජනවත් යෝජනා සහ coping ක්‍රම ලබාදෙන නමුත් එය licensed therapist කෙනෙකු නොවේ. බරපතල මානසික සෞඛ්‍ය ගැටලු සඳහා අපි හැමවිටම වෘත්තීය උපදේශකයෙකු හමුවීමට නිර්දේශ කරනවා. ඔබට ඒ සඳහා අපගේ වේදිකාව හරහාම වෙන්කරවා ගන්න පුළුවන්.",
          },
          {
            q: "EmoSense භාවිතා කළ හැක්කේ කාටද?",
            a: "EmoSense නිර්මාණය කර ඇත්තේ වයස 16-30 අතර විශ්වවිද්‍යාල සිසුන් සඳහායි. සහකාර ආයතනවල ලියාපදිංචි සිසුන්ට එය නොමිලේ ලබාගත හැක. සිසුන්ට තම විශ්වවිද්‍යාලයේ ඉ-තැපැල් ලිපිනය භාවිතයෙන් ලියාපදිංචි විය හැක.",
          },
        ],
      },
      {
        category: "හැඟීම් හඳුනාගැනීම",
        questions: [
          {
            q: "හැඟීම් හඳුනාගැනීම ක්‍රියා කරන්නේ කොහොමද?",
            a: "EmoSense ඔබගේ webcam feed හෝ උඩුගත කළ පින්තූරවලින් හැඟීම් හඳුනාගැනීමට AI-මඟින් සක්‍රිය වූ මුහුණු විශ්ලේෂණය භාවිතා කරනවා. මෙම පද්ධතිය මුහුණේ ප්‍රකාශ විශ්ලේෂණය කර Happy, Sad, Angry, Fearful, Surprised, Disgusted, සහ Neutral යන මූලික හැඟීම් හතකට සිතියම්ගත කරයි. සෑම හඳුනාගැනීමකදීම confidence score එකක් ද ලැබේ.",
          },
          {
            q: "මෙය කොතරම් නිවැරදිද?",
            a: "අපගේ AI model එක සාමාන්‍ය emotion recognition benchmarks වලදී ආසන්න වශයෙන් 95%ක නිවැරදිතාවක් ලබාගනී. එහෙත් ආලෝක තත්ත්වය, පින්තූරයේ ගුණාත්මකභාවය, සහ තනි පුද්ගල මුහුණු ලක්ෂණ අනුව නිවැරදිතාව වෙනස් විය හැක. confidence score එකෙන් model එකේ විශ්වාසය පෙන්වයි.",
          },
          {
            q: "මගේ පින්තූර ගබඩා කරනවාද?",
            a: "නැහැ. webcam හරහා හෝ විශ්ලේෂණයට උඩුගත කරන පින්තූර real-time ක්‍රමයට process කරයි සහ අපගේ servers වල ගබඩා කරන්නේ නැහැ. mood history එකට සුරැකෙන්නේ emotion type, confidence score, සහ timestamp පමණි.",
          },
        ],
      },
      {
        category: "Luma AI Therapist",
        questions: [
          {
            q: "Luma කියන්නේ කවුද?",
            a: "Luma යනු EmoSense හි AI wellness සහකාරියකි. Luma chat interface එක හරහා පුද්ගලික යෝජනා, coping ක්‍රම, හුස්ම ව්‍යායාම, සහ චිත්තවේගීය සහාය ලබාදේ. Luma සංවේදී, සහාය දෙන, සහ විනිශ්චයකින් තොර ලෙස ක්‍රියා කරන ලෙස පුහුණු කර ඇත.",
          },
          {
            q: "Luma සමඟ මගේ සංවාදය පෞද්ගලිකද?",
            a: "ඔව්. Luma සමඟ ඔබේ සංවාද private සහ encrypted වේ. අපි ඔබගේ chat data තෙවැනි පාර්ශව සමඟ බෙදා නොගනිමු. ඔබට ඕනෑම වේලාවක Privacy & Data settings හරහා chat history මකා දැමිය හැක.",
          },
        ],
      },
      {
        category: "පුද්ගලිකත්වය සහ දත්ත",
        questions: [
          {
            q: "EmoSense එකතු කරන දත්ත මොනවාද?",
            a: "EmoSense ඔබගේ profile තොරතුරු (නම, ඉ-තැපෑල, වයස් පරාසය), emotion detection ප්‍රතිඵල, wellness activity logs, සහ Luma සමඟ chat interactions එකතු කරනවා. හඳුනාගැනීම සඳහා භාවිතා කරන facial images අපි එකතු කරන්නේ හෝ ගබඩා කරන්නේ නැහැ.",
          },
          {
            q: "මට මගේ දත්ත මකා දැමිය හැකිද?",
            a: "ඔව්. ඔබට ඔබගේ profile settings වල Privacy & Data පිටුවෙන් ඕනෑම වේලාවක ඔබගේ සියලු පෞද්ගලික දත්ත බලන්න, export කරන්න, හෝ මකා දැමිය හැක. දත්ත මකාදැමීම ස්ථිරයි සහ නැවත හැරවිය නොහැක.",
          },
          {
            q: "මගේ දත්ත විශ්වවිද්‍යාලය සමඟ බෙදාගන්නවාද?",
            a: "සේවාවන් වැඩිදියුණු කිරීමට විශ්වවිද්‍යාල උපදේශන මධ්‍යස්ථාන සමඟ සංයුක්ත, නිර්නාමික analytics පමණක් බෙදාගත හැක. ඔබගේ පුද්ගලික දත්ත ඔබගේ පැහැදිලි අවසරය නොමැතිව කිසිවිටෙක බෙදා නොගනී.",
          },
        ],
      },
    ],
    stillQuestionsTitle: "තවමත් ප්‍රශ්න තිබේද?",
    stillQuestionsBody: "ඔබ සොයන දේ හමු නොවුණාද? අපව කෙලින්ම සම්බන්ධ කරගන්න.",
    contactUs: "අප අමතන්න",
    askLuma: "Lumaගෙන් අහන්න",
  },
}

export default function FAQPage() {
  const { language } = useLanguage()
  const page = copy[language]

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
            {page.title}
          </h1>
          <p className="mt-1 text-muted-foreground">{page.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {page.categories.map((section) => (
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

      <Card className="mt-10">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground">{page.stillQuestionsTitle}</h3>
          <p className="text-sm text-muted-foreground">{page.stillQuestionsBody}</p>
          <div className="flex gap-3">
            <Link href="/contact">
              <Button className="gap-2">
                <Mail className="h-4 w-4" /> {page.contactUs}
              </Button>
            </Link>
            <Link href="/luma">
              <Button variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" /> {page.askLuma}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
