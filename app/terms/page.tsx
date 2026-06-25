import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | Breakaway Pickleball Camps",
  description:
    "Terms of Service for Breakaway Pickleball Camps Inc. — registration, payment, cancellations, conduct, and participation terms.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
}

export default function TermsPage() {
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

        <h1 className="text-3xl font-semibold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Effective: June 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of the Breakaway Pickleball Camps Inc.
              (&quot;Breakaway,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) website and your registration for and
              participation in our camps and programs. By registering for a camp or using this site, you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Registration &amp; Eligibility</h2>
            <p>
              Camp spots are limited and confirmed on a first-paid, first-served basis. You agree to provide accurate
              registration information. Participants under 18 must be registered by a parent or legal guardian, who must
              complete the applicable waiver.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Payment</h2>
            <p>
              Prices are listed in Canadian dollars (CAD) and shown at the time of registration. Payments are processed
              securely by <strong>Stripe</strong>; we do not store your full payment-card details. A registration is not
              confirmed until payment is received.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Cancellations &amp; Transfers</h2>
            <p>
              Registrations are <strong>non-refundable but fully transferable</strong>. If your plans change, you can
              move your spot to another Breakaway camp, or transfer it to another player, up to{" "}
              <strong>7 days before the camp starts</strong>. To arrange a transfer, email{" "}
              <a
                href="mailto:hello@breakawaypickleball.ca"
                className="text-gray-900 underline underline-offset-2 hover:text-gray-600"
              >
                hello@breakawaypickleball.ca
              </a>
              . If Breakaway cancels or reschedules a camp, we&apos;ll work with you to rebook into another camp.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Participation, Conduct &amp; Safety</h2>
            <p>
              Participants are expected to follow coach instructions, facility rules, and reasonable safety guidance.
              We may remove any participant whose conduct endangers others or disrupts a camp, without refund. Pickleball
              is a physical activity carrying inherent risks — every participant (or their guardian) must review and
              accept our{" "}
              <Link href="/waiver" className="text-gray-900 underline underline-offset-2 hover:text-gray-600">
                participant waiver
              </Link>
              {" "}(or the{" "}
              <Link href="/waiver-u18" className="text-gray-900 underline underline-offset-2 hover:text-gray-600">
                under-18 waiver
              </Link>
              {" "}for minors) before taking part.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Photos &amp; Media</h2>
            <p>
              We may capture photos and video at camps for coaching feedback and promotional use. If you prefer not to
              appear in promotional material, let us know at{" "}
              <a
                href="mailto:hello@breakawaypickleball.ca"
                className="text-gray-900 underline underline-offset-2 hover:text-gray-600"
              >
                hello@breakawaypickleball.ca
              </a>{" "}
              and we will accommodate the request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Changes to Camps</h2>
            <p>
              Schedules, coaches, venues, and program details may change. We will make reasonable efforts to notify
              registered participants of material changes ahead of a camp.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Breakaway&apos;s liability arising from your participation is
              limited to the amount you paid for the affected camp. Nothing in these Terms limits liability that cannot
              be limited under applicable law. This section is in addition to, and does not replace, the participant
              waiver.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Governing Law</h2>
            <p>These Terms are governed by the laws of the Province of Ontario, Canada.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Privacy</h2>
            <p>
              Our handling of your personal information is described in our{" "}
              <Link href="/privacy-policy" className="text-gray-900 underline underline-offset-2 hover:text-gray-600">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Contact us at{" "}
              <a
                href="mailto:hello@breakawaypickleball.ca"
                className="text-gray-700 underline underline-offset-2 hover:text-gray-500"
              >
                hello@breakawaypickleball.ca
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
