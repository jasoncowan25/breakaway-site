import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import test from "node:test"

import {
  COMPLETED_CAMP_CARDS,
  HOME_COMPLETED_CAMP_CARDS,
} from "../lib/camp-discovery.ts"
import { MUSKOKA_RECAP } from "../lib/muskoka-recap.ts"

test("puts the Muskoka season first in completed discovery", () => {
  const muskoka = COMPLETED_CAMP_CARDS[0]

  assert.deepEqual(
    {
      id: muskoka.id,
      title: muskoka.title,
      date: muskoka.date,
      image: muskoka.image,
      link: muskoka.link,
      buttonText: muskoka.buttonText,
    },
    {
      id: "muskoka-summer-2026",
      title: "Muskoka Summer Pickleball Camps",
      date: "July 10 – August 6, 2026",
      image: "/muskoka-photos/muskoka-2026.png",
      link: "/pickleball-camps/muskoka/recap",
      buttonText: "View Recap",
    },
  )
  assert.equal(HOME_COMPLETED_CAMP_CARDS[0].id, "muskoka-summer-2026")
})

test("models the full-period Muskoka story and connected curriculum", () => {
  assert.equal(MUSKOKA_RECAP.title, "Our First Summer in Muskoka")
  assert.equal(MUSKOKA_RECAP.dateLabel, "July 10 – August 6, 2026")
  assert.match(MUSKOKA_RECAP.intro, /great people/)
  assert.match(MUSKOKA_RECAP.intro, /cottage country/)
  assert.deepEqual(
    MUSKOKA_RECAP.trainingDays.map((day) => day.title),
    [
      "Day 1 — Owning the Net",
      "Day 2 — Earning the Kitchen Line",
      "Day 3 — Offense, Defense, and Putting It Together",
    ],
  )
  assert.match(MUSKOKA_RECAP.trainingDays[0].description, /speed-ups/)
  assert.match(MUSKOKA_RECAP.trainingDays[0].description, /resets/)
  assert.match(MUSKOKA_RECAP.trainingDays[1].description, /third-shot drives and drops/)
  assert.match(MUSKOKA_RECAP.trainingDays[1].description, /fifth-shot drops/)
  assert.match(MUSKOKA_RECAP.trainingDays[2].description, /returning smashes/)
  assert.match(MUSKOKA_RECAP.facility, /new indoor facility/)
  assert.equal(MUSKOKA_RECAP.joeyHeading, "Joey’s Recap")
  assert.match(MUSKOKA_RECAP.joeyRecap, /12 days of nonstop action/)
  assert.match(MUSKOKA_RECAP.closing, /more Muskoka programming next year/)
})

test("publishes the supplied Muskoka image at the recap asset path", () => {
  assert.equal(MUSKOKA_RECAP.heroImage, "/muskoka-photos/muskoka-2026.png")
  assert.equal(
    existsSync(new URL("../public/muskoka-photos/muskoka-2026.png", import.meta.url)),
    true,
  )
})
