import { MapPin, Users, Activity } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

export default function WaiverU18Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-950 mb-3">
            Breakaway Pickleball Camps – U18 Waiver (Parent/Guardian)
          </h1>

          <Alert className="border-amber-200 bg-amber-50 text-amber-900">
            <AlertDescription className="text-sm">
              Please read carefully. By agreeing to this waiver, you and your child will waive certain legal rights,
              including the right to sue.
            </AlertDescription>
          </Alert>
        </div>

        {/* Event Details Card */}
        <Card className="mb-8 border-blue-100">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-blue-950 mb-4">Event Details</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-950 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-950">Program</div>
                  <div>Breakaway Pickleball Camps (Youth Programs)</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-blue-950 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-950">Activities</div>
                  <div>Pickleball camps, clinics, training sessions, instruction, drills, and gameplay</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-950 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-950">Venue(s)</div>
                  <div>Various partner facilities (including The Jar Pickleball Club, Toronto)</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-950 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-950">Participants</div>
                  <div>Minors (under 18 years of age)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Waiver Content */}
        <Card className="border-gray-200">
          <CardContent className="pt-8 pb-8 prose prose-sm max-w-none">
            <h1 className="text-2xl font-bold text-blue-950 mb-4">
              RELEASE OF LIABILITY, WAIVER OF CLAIMS & ASSUMPTION OF RISK (U18 – PARENT/GUARDIAN)
            </h1>

            <p className="font-semibold text-red-700 mb-6">
              PLEASE READ CAREFULLY — BY AGREEING TO THIS DOCUMENT YOU WILL WAIVE CERTAIN LEGAL RIGHTS, INCLUDING THE
              RIGHT TO SUE.
            </p>

            <p className="text-gray-700 mb-6">
              This Release of Liability, Waiver of Claims and Assumption of Risk (the <strong>"Agreement"</strong>) is
              entered into by the undersigned parent or legal guardian (the <strong>"Parent/Guardian"</strong>, "I", or
              "me") on behalf of the minor participant identified below (the <strong>"Minor"</strong>) in favour of{" "}
              <strong>Breakaway Pickleball Camps Inc.</strong>, an Ontario corporation (the <strong>"Company"</strong>).
            </p>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">1. EVENT DETAILS</h2>
            <p className="text-gray-700 mb-4">
              I acknowledge and agree that this Agreement applies to the Minor's participation in any pickleball camps,
              clinics, training sessions, instructional programs, events, or related activities organized or operated by
              Breakaway Pickleball Camps Inc. (collectively, the <strong>"Programs"</strong>).
            </p>
            <p className="text-gray-700 mb-6">
              The Programs may take place from time to time at various facilities and locations and may include, without
              limitation, instruction, coaching, drills, demonstrations, supervised and unsupervised gameplay, warm-ups,
              conditioning, physical exertion, and related activities (collectively, the <strong>"Activities"</strong>).
            </p>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">2. ASSUMPTION OF RISK</h2>
            <p className="text-gray-700 mb-4">
              I acknowledge and understand that participation in the Activities involves{" "}
              <strong>inherent risks, dangers, and hazards</strong>, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
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
            <p className="text-gray-700 mb-6">
              I freely and voluntarily <strong>assume all risks</strong> associated with the Minor's participation in
              the Activities, whether such risks are known or unknown, foreseeable or unforeseeable, and whether arising
              from negligence or otherwise, to the fullest extent permitted by law.
            </p>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">
              3. RELEASE AND WAIVER OF CLAIMS (ON BEHALF OF THE MINOR)
            </h2>
            <p className="text-gray-700 mb-4">
              In consideration of the Minor being permitted to participate in the Activities, I hereby{" "}
              <strong>waive, release, and forever discharge</strong> the Company and all of the following parties
              (collectively, the <strong>"Releasees"</strong>):
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
              <li>Breakaway Pickleball Camps Inc.;</li>
              <li>its directors, officers, shareholders, employees, and representatives;</li>
              <li>the event's professional owner-coach;</li>
              <li>independent contractors and assistant coaches;</li>
              <li>unpaid volunteers acting under the direction of the Company;</li>
              <li>successors and assigns;</li>
            </ul>
            <p className="text-gray-700 mb-6">
              from any and all claims, demands, actions, causes of action, damages, losses, costs, or expenses of any
              kind arising out of or related to the Minor's participation in the Activities,{" "}
              <strong>including claims arising from the negligence of any of the Releasees</strong>, to the fullest
              extent permitted by the laws of Ontario.
            </p>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">4. PARENT/GUARDIAN INDEMNITY</h2>
            <p className="text-gray-700 mb-6">
              I agree to <strong>defend, indemnify, and hold harmless</strong> the Releasees from and against any
              claims, actions, damages, losses, or expenses (including legal fees) brought by or on behalf of the Minor,
              or by any other person, arising out of or related to the Minor's participation in the Activities or any
              breach of this Agreement.
            </p>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">
              5. NO RELIANCE ON INSURANCE OR MEDICAL COVERAGE
            </h2>
            <p className="text-gray-700 mb-4">I acknowledge and agree that:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
              <li>
                any insurance maintained by the Company is <strong>limited in scope</strong> and may not cover all
                injuries, losses, or damages;
              </li>
              <li>
                no representation has been made regarding the availability of insurance coverage for the Minor's
                benefit;
              </li>
              <li>
                I am solely responsible for the Minor's medical, dental, disability, or accident insurance coverage.
              </li>
            </ul>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">6. MINOR FITNESS, CONDUCT & SAFETY</h2>
            <p className="text-gray-700 mb-4">I confirm that, to the best of my knowledge:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
              <li>the Minor is physically and mentally capable of participating safely;</li>
              <li>
                I will disclose any relevant medical conditions, allergies, or restrictions to the Company prior to
                participation;
              </li>
              <li>
                the Minor will follow all rules, instructions, and safety directions provided by the Company and venue
                staff;
              </li>
              <li>
                the Minor will stop participating if feeling unwell, injured, or unsafe and will notify a coach
                immediately.
              </li>
            </ul>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">7. EMERGENCY MEDICAL CARE AUTHORIZATION</h2>
            <p className="text-gray-700 mb-6">
              In the event of an emergency, I authorize the Company to obtain emergency medical treatment for the Minor
              at my cost, including transportation by ambulance if required. I release the Releasees from any liability
              arising from such emergency care or the failure to obtain it.
            </p>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">8. MEDIA RELEASE (MINOR)</h2>
            <p className="text-gray-700 mb-4">
              I grant the Company the <strong>irrevocable right and permission</strong> to photograph, record, and use
              the Minor's name, likeness, image, voice, and appearance in photographs, video, audio, or other media
              captured during the Programs for{" "}
              <strong>marketing, promotional, educational, and commercial purposes</strong>, in any medium, without
              compensation or further approval.
            </p>
            <p className="text-gray-700 mb-6">
              If I do not consent to media use, I understand I must notify the Company in writing before the Programs
              begin.
            </p>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">9. GOVERNING LAW & JURISDICTION</h2>
            <p className="text-gray-700 mb-6">
              This Agreement shall be governed by and construed in accordance with the{" "}
              <strong>laws of the Province of Ontario and the federal laws of Canada applicable therein</strong>. Any
              legal proceeding arising from this Agreement shall be brought exclusively in the courts of Ontario.
            </p>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">10. GENERAL PROVISIONS</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>
                This Agreement constitutes the <strong>entire agreement</strong> between the parties with respect to the
                subject matter herein.
              </li>
              <li>
                If any provision is held to be invalid or unenforceable, the remaining provisions shall continue in full
                force and effect.
              </li>
              <li>This Agreement is binding upon my heirs, executors, administrators, and assigns.</li>
            </ul>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">11. ACKNOWLEDGEMENT</h2>
            <p className="text-gray-700 mb-6">
              By agreeing to this waiver, I acknowledge that I have read and understood this Agreement, that I am
              agreeing voluntarily, and that I understand I am waiving substantial legal rights.
            </p>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-blue-950 mt-8 mb-4">
              SIGNATURE SECTION (FOR OFFLINE / ESIGN USE)
            </h2>
            <div className="space-y-3 text-gray-700 mb-6">
              <p>
                <strong>Minor Participant Full Name:</strong> ________________________________
              </p>
              <p>
                <strong>Minor Date of Birth:</strong> _______________________________________
              </p>
              <p className="pt-2">
                <strong>Parent/Guardian Full Name:</strong> _________________________________
              </p>
              <p>
                <strong>Relationship to Minor:</strong> _____________________________________
              </p>
              <p className="pt-2">
                <strong>Parent/Guardian Signature:</strong> _________________________________
              </p>
              <p>
                <strong>Date:</strong> _____________________________________________________
              </p>
              <p className="pt-2">
                <strong>Phone (for emergency):</strong> _____________________________________
              </p>
              <p>
                <strong>Email:</strong> _____________________________________________________
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          This page is provided for review purposes only. Waiver acceptance is captured during registration or via a
          separate signing process.
        </p>
      </div>
    </div>
  )
}
