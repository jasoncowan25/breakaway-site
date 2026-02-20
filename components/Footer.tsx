"use client"
import Link from "next/link"
import { FooterNotifySignup } from "./FooterNotifySignup"

export function Footer({ hideNotifySignup = false }: { hideNotifySignup?: boolean }) {
  return (
    <footer className="relative overflow-hidden border-t border-[#E5E7EB]">
      {!hideNotifySignup && <FooterNotifySignup />}

      <div className="bg-[#F3F4F6] bg-[url('/images/footerbg.svg')] bg-cover bg-center">
        <div className="relative max-w-4xl mx-auto px-6 py-12 text-center">
          {/* Mini Nav */}
          <nav className="flex flex-col md:flex-row md:justify-center md:gap-8 gap-3 text-sm font-medium">
            <Link href="/pickleball-camps" className="text-[#111827]/70 hover:text-[#1e3a8a] transition-colors">
              Camps
            </Link>
            <Link href="/pickleball-coaches" className="text-[#111827]/70 hover:text-[#1e3a8a] transition-colors">
              Coaches
            </Link>
            <Link href="/pickleball-camp-experience" className="text-[#111827]/70 hover:text-[#1e3a8a] transition-colors">
              The Experience
            </Link>
          </nav>

          <p className="mt-6 text-sm text-[#111827]/70">
            Contact: <span className="text-[#111827]">breakawaypickleball@gmail.com</span>
          </p>

          <p className="mt-3 text-xs text-[#111827]/60">© 2026 Breakaway Pickleball Camps. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
