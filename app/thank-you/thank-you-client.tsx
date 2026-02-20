"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function ThankYouClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4">
      <Card className="max-w-2xl w-full shadow-lg border border-gray-200 rounded-2xl">
        <CardContent className="p-8 md:p-12 space-y-6 text-center">
          {mounted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="bg-accent rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Thank You for Registering!</h1>

            <p className="text-xl md:text-2xl text-gray-700 font-medium">
              You're officially registered for your Breakaway Pickleball Camp.
            </p>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
              We will email you the camp details prior to the camp, including your schedule, what to bring, and parking information. If you have any questions, just reply to your confirmation email.
            </p>
          </div>

          <div className="pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-blue-700 text-white px-8 py-6 text-lg">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Email{" "}
              <a href="mailto:breakawaypickleball@gmail.com" className="text-primary hover:text-accent hover:underline">
                breakawaypickleball@gmail.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <img src="/breakaway-logo.png" alt="Breakaway Pickleball Camps" className="h-12 w-auto mx-auto opacity-50" />
      </div>
    </div>
  )
}
