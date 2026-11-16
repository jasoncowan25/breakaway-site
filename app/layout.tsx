import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Script from "next/script"
import { ScrollToTop } from "@/components/ScrollToTop"
import { ResizeObserverFix } from "@/components/ResizeObserverFix"
import { SiteChrome } from "@/components/SiteChrome"
import { getPublishedPublicCampNavItems } from "@/lib/public-camps"
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_URL, HOME_TITLE, HOME_DESCRIPTION, defaultOpenGraphImage } from "@/lib/seo"
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
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/favicon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-192x192.png",
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: defaultOpenGraphImage,
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT }],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const navCampItems = await getPublishedPublicCampNavItems().catch(() => [])

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
        <Suspense fallback={null}>
          <SiteChrome campItems={navCampItems}>{children}</SiteChrome>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
