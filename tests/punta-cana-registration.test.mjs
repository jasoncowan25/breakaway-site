import assert from "node:assert/strict"
import test from "node:test"

import { POST } from "../app/api/punta-cana-register/route.ts"

test("registration webhook omits retired room preference while preserving traveller details", async () => {
  const originalFetch = globalThis.fetch
  let forwardedPayload

  globalThis.fetch = async (_url, init) => {
    forwardedPayload = JSON.parse(init.body)
    return new Response(null, { status: 200 })
  }

  try {
    const request = new Request("http://localhost/api/punta-cana-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomPreference: "Garden View — Double ($2,201 CAD)",
        numTravellers: 1,
        travellers: [
          {
            fullName: "Jamie Smith",
            dob: "01/02/1990",
            email: "jamie@example.com",
            phone: "416-555-0123",
            willPlayPickleball: true,
          },
        ],
        comments: "Please send current trip details.",
      }),
    })

    const response = await POST(request)

    assert.equal(response.status, 200)
    assert.equal(Object.hasOwn(forwardedPayload, "room_preference"), false)
    assert.deepEqual(forwardedPayload, {
      num_travellers: 1,
      pickleball_participants: "Jamie Smith",
      comments: "Please send current trip details.",
      traveller_1_name: "Jamie Smith",
      traveller_1_dob: "01/02/1990",
      traveller_1_email: "jamie@example.com",
      traveller_1_phone: "416-555-0123",
      traveller_1_pickleball: "Yes",
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})
