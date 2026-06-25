import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Script from "next/script"
import { ScrollToTop } from "@/components/ScrollToTop"
import { ResizeObserverFix } from "@/components/ResizeObserverFix"
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_URL, defaultOpenGraphImage } from "@/lib/seo"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Breakaway Pickleball Camps — Pro-Level Training in Toronto, GTA & Muskoka",
  description:
    "Premium pickleball training camps across Toronto, the GTA and Muskoka. Small groups, professional coaching, results-oriented programs for intermediate to advanced players.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Breakaway Pickleball Camps — Pro-Level Training in Toronto, GTA & Muskoka",
    description:
      "Premium pickleball training camps across Toronto, the GTA and Muskoka. Small groups, professional coaching, results-oriented programs for intermediate to advanced players.",
    images: defaultOpenGraphImage,
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17655187543" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17655187543');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ResizeObserverFix />
        <ScrollToTop />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
