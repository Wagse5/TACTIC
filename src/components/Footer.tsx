'use client'

import * as React from 'react'
import Link from 'next/link'

interface FooterProps {
  onWaitlist: () => void
}

export default function Footer({ onWaitlist }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About TACTIC</h3>
            <p className="text-gray-400">
              AI-powered mental health platform helping therapists provide better care.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-gray-400 hover:text-white">Features</Link></li>
              <li><Link href="#demo" className="text-gray-400 hover:text-white">Demo</Link></li>
              <li><Link href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</Link></li>
              <li>
                <button 
                  onClick={onWaitlist}
                  className="text-gray-400 hover:text-white"
                >
                  Join Waitlist
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">
              Questions? Reach out to us at<br />
              <a href="mailto:contact@tactic-ai.com" className="hover:text-white">
                contact@tactic-ai.com
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TACTIC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 