import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Script from "next/script"
import { ScrollToTop } from "@/components/ScrollToTop"
import { ResizeObserverFix } from "@/components/ResizeObserverFix"
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.breakawaypickleball.ca"),
  alternates: {
    canonical: "/",
  },
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
    url: "/pickleball-camps",
    images: [
      {
        url: "/images/screenshot-202025-09-07-20at-2010.png",
        width: 1200,
        height: 630,
        alt: "Pickleball player in action at Breakaway camp",
      },
    ],
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
