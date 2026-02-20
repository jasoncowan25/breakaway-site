import type { Metadata } from "next"
import { AlertTriangle, Calendar, MapPin, Users, Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Waiver | Breakaway Pickleball Camps",
  description: "Review the Breakaway Pickleball Camps participant waiver and assumption of risk.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function WaiverPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[800px] px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-blue-950 sm:text-4xl">
            Breakaway Pickleball Camps – Terms & Waiver
          </h1>
          <div className="flex gap-3 rounded-lg border-2 border-red-200 bg-red-50 p-4">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-600" />
            <p className="text-sm font-medium text-red-900">
              Please read carefully. By agreeing to this waiver, you will waive certain legal rights, including the
              right to sue.
            </p>
          </div>
          <div className="mt-3 flex gap-3 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
            <Info className="h-6 w-6 flex-shrink-0 text-yellow-600" />
            <p className="text-sm font-medium text-yellow-900">
              Registration Policy: Due to limited capacity, staffing, and advance venue commitments, registration fees
              are generally non-refundable. Any exception is at the sole discretion of Breakaway Pickleball Camps.
            </p>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-blue-950">Event Details</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Program</p>
                <p className="text-sm text-gray-600">Breakaway Pickleball Camps</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Activities</p>
                <p className="text-sm text-gray-600">
                  Pickleball camps, clinics, training sessions, instruction, drills, and gameplay
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Venue(s)</p>
                <p className="text-sm text-gray-600">
                  Various partner facilities (including The Jar Pickleball Club, Toronto)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Participants</p>
                <p className="text-sm text-gray-600">Adults only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Callout */}

        {/* Waiver Content */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 sm:p-8">
          <div className="prose prose-sm sm:prose max-w-none">
            <h2 className="text-xl font-bold text-blue-950">
              RELEASE OF LIABILITY, WAIVER OF CLAIMS & ASSUMPTION OF RISK
            </h2>

            <p className="font-semibold text-red-900">
              PLEASE READ CAREFULLY — BY AGREEING TO THIS DOCUMENT YOU WILL WAIVE CERTAIN LEGAL RIGHTS, INCLUDING THE
              RIGHT TO SUE.
            </p>

            <p className="text-gray-700">
              This Release of Liability, Waiver of Claims and Assumption of Risk (the "Agreement") is entered into by
              the undersigned participant ("Participant", "I", or "me") in favour of Breakaway Pickleball Camps Inc., an
              Ontario corporation (the "Company").
            </p>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-lg font-semibold text-blue-950">1. EVENT DETAILS</h3>
            <p className="text-gray-700">
              I acknowledge and agree that this Agreement applies to my participation in any pickleball camps, clinics,
              training sessions, instructional programs, events, or related activities organized or operated by
              Breakaway Pickleball Camps Inc. (collectively, the "Programs").
            </p>
            <p className="text-gray-700">
              The Programs may take place from time to time at various facilities and locations and may include, without
              limitation, instruction, coaching, drills, demonstrations, supervised and unsupervised gameplay, warm-ups,
              conditioning, physical exertion, and related activities (collectively, the "Activities").
            </p>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-lg font-semibold text-blue-950">2. ASSUMPTION OF RISK</h3>
            <p className="text-gray-700">
              I acknowledge and understand that participation in the Activities involves inherent risks, dangers, and
              hazards, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>physical exertion, fatigue, dehydration, overuse or repetitive-use injuries;</li>
              <li>
                collisions or contact with other participants, coaches, volunteers, balls, paddles, nets, walls, or
                other objects;
              </li>
              <li>slips, trips, falls, loss of balance, or loss of coordination;</li>
              <li>
                muscle strains, sprains, tears, fractures, bruises, abrasions, concussions, head injuries, spinal
                injuries, or other serious injury;
              </li>
              <li>equipment failure or misuse;</li>
              <li>negligent acts or omissions of other participants; and</li>
              <li>
                negligent instruction, supervision, or decision-making by the Company or persons acting on its behalf.
              </li>
            </ul>
            <p className="text-gray-700">
              I freely and voluntarily assume all risks associated with the Activities, whether such risks are known or
              unknown, foreseeable or unforeseeable, and whether arising from negligence or otherwise, to the fullest
              extent permitted by law.
            </p>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-lg font-semibold text-blue-950">3. RELEASE AND WAIVER OF CLAIMS</h3>
            <p className="text-gray-700">
              In consideration of being permitted to participate in the Activities, I hereby waive, release, and forever
              discharge the Company and all of the following parties (collectively, the "Releasees"):
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Breakaway Pickleball Camps Inc.;</li>
              <li>its directors, officers, shareholders, employees, and representatives;</li>
              <li>the event's professional owner-coach;</li>
              <li>independent contractors and assistant coaches;</li>
              <li>unpaid volunteers acting under the direction of the Company;</li>
              <li>successors and assigns;</li>
            </ul>
            <p className="text-gray-700">
              from any and all claims, demands, actions, causes of action, damages, losses, costs, or expenses of any
              kind arising out of or related to my participation in the Activities, including claims arising from the
              negligence of any of the Releasees, to the fullest extent permitted by the laws of Ontario.
            </p>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-lg font-semibold text-blue-950">4. NO RELIANCE ON INSURANCE OR MEDICAL COVERAGE</h3>
            <p className="text-gray-700">I acknowledge and agree that:</p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                any insurance maintained by the Company is limited in scope and may not cover all injuries, losses, or
                damages;
              </li>
              <li>no representation has been made regarding the availability of insurance coverage for my benefit;</li>
              <li>I am solely responsible for my own medical, dental, disability, or accident insurance coverage.</li>
            </ul>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-lg font-semibold text-blue-950">5. MEDICAL FITNESS & EMERGENCY CARE</h3>
            <p className="text-gray-700">I confirm that:</p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>I am eighteen (18) years of age or older;</li>
              <li>I am in good physical and mental condition and capable of participating safely;</li>
              <li>I will immediately stop participating if I feel unwell, injured, or unsafe.</li>
            </ul>
            <p className="text-gray-700">
              In the event of a medical emergency, I authorize the Company to obtain emergency medical treatment for me
              at my cost. I release the Releasees from any liability arising from such emergency care or the failure to
              obtain it.
            </p>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-lg font-semibold text-blue-950">6. MEDIA RELEASE</h3>
            <p className="text-gray-700">
              I grant the Company the irrevocable right and permission to photograph, record, and use my name, likeness,
              image, voice, and appearance in photographs, video, audio, or other media captured during the Event for
              marketing, promotional, educational, and commercial purposes, in any medium, without compensation or
              further approval.
            </p>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-lg font-semibold text-blue-950">7. INDEMNITY</h3>
            <p className="text-gray-700">
              I agree to defend, indemnify, and hold harmless the Releasees from and against any claims, actions,
              damages, losses, or expenses (including legal fees) arising out of my participation in the Activities or
              my breach of this Agreement.
            </p>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-lg font-semibold text-blue-950">8. GOVERNING LAW & JURISDICTION</h3>
            <p className="text-gray-700">
              This Agreement shall be governed by and construed in accordance with the laws of the Province of Ontario
              and the federal laws of Canada applicable therein. Any legal proceeding shall be brought exclusively in
              the courts of Ontario.
            </p>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-lg font-semibold text-blue-950">9. GENERAL PROVISIONS</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>This Agreement constitutes the entire agreement between the parties.</li>
              <li>
                If any provision is held unenforceable, the remaining provisions shall remain in full force and effect.
              </li>
              <li>This Agreement is binding upon my heirs, executors, administrators, and assigns.</li>
            </ul>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-lg font-semibold text-blue-950">10. ACKNOWLEDGEMENT</h3>
            <p className="text-gray-700">
              By accepting this waiver, I acknowledge that I have read and understood this Agreement, that I am agreeing
              voluntarily, and that I understand I am waiving substantial legal rights.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            This page is provided for review purposes only. Waiver acceptance is captured during checkout or via the
            waiver-sign page.
          </p>
        </div>
      </div>
    </div>
  )
}
