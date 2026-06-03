import type { Metadata } from "next"
import { CampAlertsForm } from "@/components/CampAlertsForm"
import styles from "./camp-alerts.module.css"

export const metadata: Metadata = {
  title: "Get Notified — Breakaway Pickleball Camps",
  description:
    "Our camps fill fast. Get first notice when a camp matching your level goes live — no spam.",
  alternates: { canonical: "/camp-alerts" },
}

export default function CampAlertsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Breakaway Pickleball</span>
        <h1 className={styles.headline}>Our Camps Fill Fast — Get First Notice</h1>
        <p className={styles.subtitle}>
          We&apos;ll only email you when a camp matching your level goes live. No spam.
        </p>
        <CampAlertsForm />
      </div>
    </main>
  )
}
