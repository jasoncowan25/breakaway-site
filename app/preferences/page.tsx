import type { Metadata } from "next"
import { Suspense } from "react"
import { PreferencesManager } from "@/components/PreferencesManager"
import styles from "./preferences.module.css"

export const metadata: Metadata = {
  title: "Communication Preferences — Breakaway Pickleball",
  description: "Manage how Breakaway Pickleball reaches you about camps, or unsubscribe anytime.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/preferences" },
}

export default function PreferencesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Suspense fallback={<p className={styles.loading}>Loading your preferences…</p>}>
          <PreferencesManager />
        </Suspense>
      </div>
    </main>
  )
}
