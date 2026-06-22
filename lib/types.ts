/* ==========================================================================
   Breakaway Funnel — Domain types
   Strict interfaces shared across all funnel surfaces. These describe the
   shape the UI expects; the mock-data.ts adapter provides sample values and
   marks exactly where real API data should be injected.
   ========================================================================== */

/** Skill-level options offered on the Get-Notified form and Comm-Preferences. */
export type SkillLevel =
  | "Beginner (2.5–3.0)"
  | "Intermediate (3.0–3.5)"
  | "Advanced (4.0+)"
  | "Kids Camps (Ages 8–16)";

/** Region options on Communication Preferences. */
export type Region = "Toronto & GTA" | "Muskoka";

/** Cosmetic backdrop variant for the checkout/confirmation shell. */
export type Backdrop = "photo" | "clean";

/* -------------------------------------------------------------------------- */
/*  Camp                                                                       */
/* -------------------------------------------------------------------------- */

export interface Camp {
  /** Small eyebrow label above the camp title. */
  eyebrow: string;
  title: string;
  /** Lead coach display name. */
  coachLead: string;
  /** Absolute or app-relative URL to the coach headshot. */
  coachPhoto: string;
  /** Absolute or app-relative URL to the hero/summary photo. */
  photo: string;
  /** Long-form date, e.g. "Jul 10–12, 2026". */
  date: string;
  /** Date sub-line, e.g. "Fri–Sun · arrive 8:30 AM". */
  dateSub: string;
  location: string;
  locSub: string;
  /** Skill band label, e.g. "Intermediate". */
  skill: string;
  /** Skill band detail, e.g. "3.0–3.5". */
  skillSub: string;
  /** Price per player/child in CAD. */
  pricePerPlayer: number;
  /** When true the whole checkout reframes as a kids camp (guardian-led). */
  isKidsCamp: boolean;
  /** When true, collect a required T-shirt size per player/camper. */
  collectTshirtSizes?: boolean;
  /** Derived from camp breaks; controls catered lunch copy. */
  lunchType?: "catered" | "byo" | null;
  /** Max players the user may register in one checkout. */
  maxPlayers: number;
  /** Player-to-coach ratio label, e.g. "4:1". */
  coachRatio: string;
  /** Urgency badge text shown on the summary photo, e.g. "Selling fast". */
  urgencyBadge?: string;
}

/* -------------------------------------------------------------------------- */
/*  Checkout participants                                                      */
/* -------------------------------------------------------------------------- */

export interface Player {
  id: string;
  first: string;
  last: string;
  /** Used for adult players. Empty string for children. */
  email: string;
  /** Used for children. Empty string for adults. */
  age: string;
  /** Optional checkout T-shirt selection. */
  tee: string;
  isChild: boolean;
}

export interface Guardian {
  first: string;
  last: string;
  phone: string;
  email: string;
  /** Guardian authorization checkbox (kids mode). */
  authorized: boolean;
  /** Reserved waiver flag (carried through from the source model). */
  waiver: boolean;
}

export interface Agreements {
  terms: boolean;
  marketing: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Account (logged-in customer)                                               */
/* -------------------------------------------------------------------------- */

export interface SavedCard {
  brand: string;
  last4: string;
  exp: string;
}

export interface Account {
  first: string;
  last: string;
  email: string;
  savedCard: SavedCard;
}

/* -------------------------------------------------------------------------- */
/*  Checkout scenario (replaces the design-time Tweaks)                        */
/* -------------------------------------------------------------------------- */

/**
 * The four design-time "Tweaks" become real, typed inputs in production:
 *  - loggedIn   → derived from your auth/session (was Tweak "Logged in")
 *  - kidsMode   → derived from camp.isKidsCamp   (was Tweak "Children eligible")
 *  - backdrop   → cosmetic prop                   (was Tweak "Background")
 *  - initialView→ routing/flow state              (was Tweak "Screen")
 */
export interface CheckoutScenario {
  loggedIn: boolean;
  backdrop: Backdrop;
  initialView: "checkout" | "success";
}

/* -------------------------------------------------------------------------- */
/*  Marketing capture (Get Notified) + Communication Preferences               */
/* -------------------------------------------------------------------------- */

export interface NotifySignup {
  firstName: string;
  lastName: string;
  email: string;
  /** Formatted "(416) 555-0142" or empty. */
  phone: string;
  skillLevels: SkillLevel[];
}

export interface CommPreferences {
  /** The address the magic link resolved to. Locked in the UI. */
  email: string;
  emailOn: boolean;
  textOn: boolean;
  phone: string;
  skillLevels: SkillLevel[];
  regions: Region[];
}

/** Camp fields rendered into the "new camp" transactional email. */
export interface NewCampEmailModel {
  campName: string;
  level: string;
  date: string;
  location: string;
  price: string;
}
