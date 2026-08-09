import assert from "node:assert/strict"
import test from "node:test"

import {
  CAMP_SKILL_FILTERS,
  RELATED_CAMP_LINKS,
  STATIC_PUBLIC_CAMP_CARDS,
  campMatchesFilters,
  shouldShowMuskokaHub,
  staticPublicCampNavItems,
} from "../lib/camp-discovery.ts"

test("defines one aggregate weekly kids card with the approved content", () => {
  const weekly = STATIC_PUBLIC_CAMP_CARDS.find(
    (camp) => camp.id === "kids-weekly-pickleball-camp-toronto",
  )

  assert.deepEqual(
    {
      title: weekly?.title,
      coach: weekly?.coach,
      date: weekly?.date,
      sortDate: weekly?.sortDate,
      endDate: weekly?.endDate,
      location: weekly?.location,
      price: weekly?.price,
      image: weekly?.image,
      skillLevel: weekly?.skillLevel,
      link: weekly?.link,
    },
    {
      title: "Kids Weekly Pickleball Camp",
      coach: "Joey Manchurek",
      date: "Weekly programs · Sep 7–Dec 21, 2026",
      sortDate: "2026-09-07",
      endDate: "2026-12-21",
      location: "The Jar Pickleball Club",
      price: "From $600",
      image: "/images/kids-weekly/kids-camp-joey.jpg",
      skillLevel: "Kids",
      link: "/pickleball-camps/kids-weekly-pickleball-camp-toronto",
    },
  )
})

test("publishes the approved captions and promotional badges for featured Toronto camps", () => {
  const featuredIds = [
    "kids-summer-pickleball-camp-toronto",
    "kids-weekly-pickleball-camp-toronto",
    "toronto-intermediate-intensive-sep-12-2026-3",
    "toronto-intermediate-intensive-oct-24-2026",
  ]
  const featured = STATIC_PUBLIC_CAMP_CARDS.filter((camp) => featuredIds.includes(camp.id))

  assert.deepEqual(
    featured.map(({ id, date, badges, availabilityLabel }) => ({
      id,
      date,
      badges,
      availabilityLabel,
    })),
    [
      {
        id: "kids-summer-pickleball-camp-toronto",
        date: "August 17 – September 4, 2026",
        badges: [{ text: "New", variant: "accent" }],
        availabilityLabel: undefined,
      },
      {
        id: "kids-weekly-pickleball-camp-toronto",
        date: "Weekly programs · Sep 7–Dec 21, 2026",
        badges: [{ text: "Just Announced", variant: "accent" }],
        availabilityLabel: undefined,
      },
      {
        id: "toronto-intermediate-intensive-sep-12-2026-3",
        date: "September 12-13, 2026",
        badges: [],
        availabilityLabel: "Only 16 Spots",
      },
      {
        id: "toronto-intermediate-intensive-oct-24-2026",
        date: "October 24-25, 2026",
        badges: [],
        availabilityLabel: "Only 16 Spots",
      },
    ],
  )
})

test("categorizes both upcoming youth programs as Kids", () => {
  const kids = STATIC_PUBLIC_CAMP_CARDS
    .filter((camp) => camp.skillLevel === "Kids")
    .map((camp) => camp.id)

  assert.deepEqual(kids, [
    "kids-summer-pickleball-camp-toronto",
    "kids-weekly-pickleball-camp-toronto",
  ])
  assert.ok(CAMP_SKILL_FILTERS.includes("Kids"))
})

test("Kids filtering returns only the two kids programs", () => {
  const result = STATIC_PUBLIC_CAMP_CARDS
    .filter((camp) =>
      campMatchesFilters(camp, {
        locations: [],
        formats: [],
        skillLevels: ["Kids"],
      }),
    )
    .map((camp) => camp.id)

  assert.deepEqual(result, [
    "kids-summer-pickleball-camp-toronto",
    "kids-weekly-pickleball-camp-toronto",
  ])
  assert.equal(
    shouldShowMuskokaHub({
      campCount: 8,
      locations: [],
      formats: [],
      skillLevels: ["Kids"],
    }),
    false,
  )
})

test("adds the weekly program to related links and active static navigation", () => {
  assert.deepEqual(
    RELATED_CAMP_LINKS.find((link) => link.href.includes("kids-weekly")),
    {
      label: "Pickleball Kids Weekly",
      homeLabel: "Pickleball Kids Weekly",
      href: "/pickleball-camps/kids-weekly-pickleball-camp-toronto",
    },
  )
  assert.equal(
    staticPublicCampNavItems("2026-08-09").some(
      (item) => item.title === "Kids Weekly Pickleball Camp",
    ),
    true,
  )
  assert.equal(
    staticPublicCampNavItems("2026-12-22").some(
      (item) => item.title === "Kids Weekly Pickleball Camp",
    ),
    false,
  )
})
