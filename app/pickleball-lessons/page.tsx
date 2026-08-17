import type { Metadata } from "next"

import { JsonLd } from "@/components/JsonLd"
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo"

import { LessonsPageClient } from "./lessons-page-client"
import "./lessons.css"

export const metadata: Metadata = {
  title: "Private Pickleball Lessons in Toronto & Muskoka | Breakaway",
  description:
    "Request a private pickleball lesson with Breakaway in Toronto year-round or Muskoka in summer. Choose your coach, dates and group size.",
  keywords: [
    "private pickleball lessons Toronto",
    "private pickleball coaching Toronto",
    "private pickleball lessons Muskoka",
  ],
  alternates: { canonical: "/pickleball-lessons" },
  openGraph: { url: "/pickleball-lessons" },
}

const FAQ = [
  { question: "How do I book a lesson?", answer: "Choose a coach and submit your preferred dates and times. We will confirm the coach and court before sending you a secure payment link." },
  { question: "Can I book a lesson with a friend?", answer: "Yes. A private lesson can include up to three players, including you. Each additional player adds $20 per hour to the lesson rate. We send one payment link to the person who submitted the request — they pay the full lesson total, and the other players can repay them separately." },
  { question: "When do I pay?", answer: "Lessons are prepaid, but no payment is required when you submit a lesson request. After your lesson is confirmed, we will send you a secure credit-card payment link." },
  { question: "How quickly will I hear back?", answer: "We usually respond to lesson requests within 24 hours." },
  { question: "Where are lessons offered?", answer: "Lessons are offered in Toronto throughout the year. Muskoka lessons are offered during June, July and August." },
  { question: "What happens if I need to cancel?", answer: "You can cancel up to 72 hours before your lesson for a full refund. Lessons cancelled less than 72 hours before the start time are non-refundable, but they may be transferred to someone who can attend at the scheduled time." },
  { question: "Do I need to know my pickleball rating?", answer: "No. You do not need to submit a pickleball rating when requesting a lesson." },
  { question: "Can each player pay their own share?", answer: "Not at the moment. We send one payment link to the person who submitted the request, so that person pays the full lesson total and the other players can repay them separately." },
]

export default function PickleballLessonsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Private Lessons", path: "/pickleball-lessons" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />
      <LessonsPageClient />
    </>
  )
}
