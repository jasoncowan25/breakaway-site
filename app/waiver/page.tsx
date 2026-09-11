import type { Metadata } from "next"
import { AlertTriangle, Calendar, MapPin, Users, Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Waiver | Breakaway Pickleball Camps",
  description: "Review the Breakaway Pickleball Camps participant and facility waivers and assumption of risk.",
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

            <hr className="my-8 border-gray-300" />

            <section aria-labelledby="facility-waiver">
              <h2 id="facility-waiver" className="text-xl font-bold text-blue-950">
                Facility Waiver
              </h2>

              <h3 className="text-lg font-semibold text-blue-950">
                Release of Liability, Waiver of Claims, and Assumption of Risks
              </h3>

              <p className="font-semibold text-red-900">
                BY SIGNING THIS DOCUMENT, YOU WILL WAIVE CERTAIN LEGAL RIGHTS, INCLUDING THE RIGHT TO SUE OR CLAIM
                COMPENSATION
              </p>

              <p className="font-semibold text-red-900">PLEASE READ CAREFULLY!</p>

              <p className="text-gray-700">
                In consideration of 1000614977 Ontario Inc. (d/b/a The Jar Pickleball Club), a company incorporated in
                the Province of Ontario (the &quot;Company&quot;) permitting the individual named below (&quot;I&quot; or
                &quot;me&quot;) to access the premises and use the facilities located at 900 Caledonia Road, Unit 5
                Toronto, ON, M6B 3Y1, Canada (the “Club”) and participate in pickleball matches, pickleball training,
                stretching, fitness activities, exercise, weight lifting, using the sauna, using the cold plunge,
                consuming food and beverages and other attractions, events, classes, sessions, activities, services or
                facilities of any kind whatsoever at the Club, including but not limited to its courts, amenities,
                lounges, kitchen, changerooms, washrooms, entryways and parking lot, or that are otherwise sponsored,
                endorsed or operated by the Company (collectively, the “Activities”), and for other good and valuable
                consideration, I agree to all the terms and conditions set forth in this agreement (this
                &quot;Agreement&quot;).
              </p>

              <p className="text-gray-700">
                The Company has adopted policies, procedures, rules, and regulations, including those posted on the
                Company’s website at{" "}
                <a
                  href="http://www.thejarpickleball.com/membership"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-900 underline underline-offset-2 hover:text-blue-700"
                >
                  www.thejarpickleball.com
                </a>
                , the Company’s mobile application or the premises of the Club or provided to me in writing
                (collectively, “Policies”) designed to provide for the safe, enjoyable, and healthy use of the Club
                facilities, services and events by me and the Club’s members and guests. I acknowledge and agree that
                the Policies are subject to change from time to time in the sole discretion of the Company and that I
                will read and comply with the then-current Policies whenever I participate in the Activities.
              </p>

              <h3 className="text-lg font-semibold text-blue-950">ASSUMPTION OF RISKS</h3>

              <p className="font-semibold text-gray-900">
                I AM AWARE AND UNDERSTAND THAT THE ACTIVITIES INVOLVE MANY RISKS, DANGERS, AND HAZARDS, INCLUDING BUT
                NOT LIMITED TO THE RISK OF SERIOUS INJURY, DISABILITY, DEATH, PROPERTY DAMAGE, LOST OR STOLEN PROPERTY,
                THE TRANSMISSION OF COMMUNICABLE DISEASES, COLLISION WITH OTHER PERSONS OR OBJECTS, BEING STRUCK BY A
                PADDLE OR BALL, STROKE, HEART ATTACK, OTHER LIFE THREATENING CONDITIONS CAUSED BY PHYSICAL EXERTION,
                STRAINS, SPRAINS, FRACTURES, TORN MUSCLES OF LIGAMENTS, ALLERGIC REACTIONS, BURNS, SCRAPES, BRUISES,
                LACERATIONS, EYE INJURY, BRAIN INJURY, SPINAL CORD INJURY, HEAT STRESS, DEHYDRATION, HEARING LOSS, LOSS
                OF BALANCE OR CONTROL, SLIPS, TRIPS, FALLS, PAIN AND SUFFERING, EMOTIONAL DISTRESS, EQUIPMENT FAILURE,
                NEGLIGENT FIRST AID, FAILURE TO PLAY SAFELY OR WITHIN ONE’S OWN ABILITY, NEGLIGENCE OF OTHER PERSONS,
                NEGLIGENCE ON THE PART OF THE RELEASEES (DEFINED BELOW), TRAVEL OR TRANSPORT TO AND FROM THE CLUB, AND
                NEGLIGENCE OF THE COMPANY INCLUDING FAILURE OF THE COMPANY TO SAFEGUARD OR PROTECT ME FROM THE RISKS,
                DANGERS AND HAZARDS OF THE ACTIVITIES. I ACKNOWLEDGE THAT I AM VOLUNTARILY PARTICIPATING IN THE
                ACTIVITIES. I FREELY ACCEPT AND FULLY ASSUME ANY AND ALL OF THE RISKS, DANGERS, AND HAZARDS INVOLVED AND
                THE POSSIBILITY OF INJURY, DEATH, DISEASE, PROPERTY DAMAGE OR LOSS, WHETHER CAUSED BY THE NEGLIGENCE OF
                THE COMPANY OR OTHERWISE.
              </p>

              <p className="text-gray-700">
                I hereby expressly waive and release any and all claims which I have or may in the future have against
                the Company, its affiliates, and their respective directors, officers, employees, agents,
                representatives, shareholders, successors, and assigns (collectively, &quot;Releasees&quot;), on account
                of injury, disability, disease, death, or property damage arising out of or attributable to the
                Activities, due to any cause whatsoever, including without limitation the negligence of the Company or
                any other Releasee (“Negligence Claims”), breach of contract, or breach of any statutory or other duty
                of care owing under occupiers liability legislation or otherwise. I covenant not to make or bring any
                such claim against the Company or any other Releasee, and forever release and discharge the Company and
                all other Releasees from liability under such claims.
              </p>

              <p className="text-gray-700">
                I understand that Negligence Claims include but are not limited to the Company’s (1) negligent design,
                construction (including renovation or alteration), repair, maintenance, operation, supervision,
                monitoring, or provision of the Activities; (2) negligent failure to warn of or remove hazardous,
                unsafe, dangerous, or defective conditions; (3) negligent failure to provide or keep premises in a
                reasonably safe condition; (4) negligent provision of or failure to provide emergency care; (5)
                negligent hiring, selection, training, instruction, certification, supervision, or retention of
                employees, independent contractors or volunteers; (6) negligent collection, use, disclosure, or storage
                of personal, sensitive, or other information (including negligent failure to implement or maintain
                information security controls); or (7) other negligent act(s) or omission(s).
              </p>

              <p className="font-semibold text-gray-900">
                I SHALL DEFEND, INDEMNIFY AND HOLD HARMLESS THE COMPANY AND ALL OTHER RELEASEES AGAINST ANY AND ALL
                LOSSES, DAMAGES, LIABILITIES, DEFICIENCIES, CLAIMS, ACTIONS, JUDGMENTS, SETTLEMENTS, INTEREST, AWARDS,
                PENALTIES, FINES, COSTS, OR EXPENSES OF WHATEVER KIND, INCLUDING REASONABLE LEGAL FEES, IN CONNECTION
                WITH ANY THIRD PARTY CLAIM, SUIT, ACTION, OR PROCEEDING ARISING OUT OF OR RESULTING FROM THE ACTIVITIES.
              </p>

              <p className="text-gray-700">
                I confirm that I am: (a) in good health, in proper physical and mental condition, and do not have any
                medical or other conditions that would impair my ability to participate in the Activities; and (b) not
                experiencing symptoms of any bacterial or viral diseases (such as cough, shortness of breath, fever or
                other symptoms), do not have a confirmed or suspected case of a bacterial or viral disease, and have
                not come in contact in the last fourteen days with a person who has been confirmed or suspected of
                having a bacterial or viral disease. I will comply with all federal, provincial and local laws, orders,
                directives and guidelines related to the Activities while participating in the Activities. I will also
                follow all instructions, recommendations, and cautions of the Company at all times during my
                participation in the Activities. If at any time I believe conditions to be unsafe, that I am no longer
                in proper physical condition to participate in the Activities, or I begin experiencing symptoms of a
                bacterial or viral disease, I will immediately discontinue further participation in the Activities. I
                have been advised by the Company to wear and will wear all protective equipment that is required by the
                rules and regulations of the governing body for my sport.
              </p>

              <p className="text-gray-700">
                This Agreement, together with any membership agreement or coaching agreement that I have entered into
                with the Company, constitutes the entire agreement of the Company and me with respect to the subject
                matter contained herein and supersedes all prior and contemporaneous understandings, agreements,
                representations, and warranties, both written and oral, with respect to such subject matter. If any term
                or provision of this Agreement is held to be invalid, illegal, or unenforceable in any jurisdiction,
                such invalidity, illegality, or unenforceability shall not affect any other term or provision of this
                Agreement or invalidate or render unenforceable such term or provision in any other jurisdiction. This
                Agreement is binding on and shall enure to the benefit of me and my heirs and next-of-kin, and the
                Company and its successors and assigns. This Agreement shall be governed by and construed in accordance
                with the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any claim or
                cause of action arising under this Agreement may be brought only in the courts of the Province of
                Ontario, and I hereby consent to the exclusive jurisdiction of such courts.
              </p>

              <p className="font-semibold text-gray-900">
                I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTOOD ALL OF THE TERMS OF THIS AGREEMENT AND THAT I AM
                VOLUNTARILY WAIVING SUBSTANTIAL LEGAL RIGHTS (ON MY BEHALF AND ON BEHALF OF MY HEIRS, EXECUTORS,
                ADMINISTRATORS, AND NEXTOF-KIN), INCLUDING THE RIGHT TO SUE THE COMPANY AND THE RELEASEES.
              </p>
            </section>
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
