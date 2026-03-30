import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | Breakaway Pickleball Camps",
  description: "Privacy policy for Breakaway Pickleball Camps Inc. Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-[700px] px-6 py-12 md:py-16">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Effective: March 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <p>
              Breakaway Pickleball Camps Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. 
              This policy explains what information we collect, how we use it, and your rights regarding your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">What We Collect</h2>
            <p>We collect the following personal information when you register for a camp or contact us:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>WhatsApp messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Deliver camp services and process registrations</li>
              <li>Send updates about your camp booking</li>
              <li>Respond to inquiries via WhatsApp and email</li>
              <li>Notify you about upcoming camps (if you opt in)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Third Parties</h2>
            <p>
              We work with trusted third parties to operate our services:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Meta</strong> (WhatsApp Business API) for messaging</li>
              <li><strong>Stripe</strong> for payment processing</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information to anyone.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Data Retention</h2>
            <p>
              We retain your information while you are an active customer. 
              If you request deletion, we will remove your data within 30 days, 
              except where we are required by law to retain it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. 
              To make a request, email us at{" "}
              <a 
                href="mailto:breakawaypickleball@gmail.com" 
                className="text-gray-900 underline underline-offset-2 hover:text-gray-600"
              >
                breakawaypickleball@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Governing Law</h2>
            <p>
              This policy is governed by the laws of the Province of Ontario, Canada.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Contact us at{" "}
              <a 
                href="mailto:breakawaypickleball@gmail.com" 
                className="text-gray-700 underline underline-offset-2 hover:text-gray-500"
              >
                breakawaypickleball@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
