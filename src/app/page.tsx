'use client'

import * as React from 'react'
import Navbar from '@/components/Navbar'
import AiDemo from '@/components/AiDemo'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import HealthQuiz from '@/components/HealthQuiz'
import SecurityBadges from '@/components/SecurityBadges'
import Footer from '@/components/Footer'
import WaitlistForm from '@/components/WaitlistForm'

export default function Home() {
  const [showWaitlist, setShowWaitlist] = React.useState(false)

  return (
    <>
      <Navbar onWaitlist={() => setShowWaitlist(true)} />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                AI-Powered Mental Health Support
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                TACTIC uses advanced AI to help therapists provide better mental health care while maintaining the highest standards of privacy and security.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="#demo"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Try Demo
                </a>
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Demo Section */}
        <section id="demo">
          <AiDemo />
        </section>

        {/* Health Quiz Section */}
        <section id="assessment">
          <HealthQuiz />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <TestimonialCarousel />
        </section>

        {/* Security Badges Section */}
        <section id="security">
          <SecurityBadges />
        </section>

        {/* Waitlist Modal */}
        {showWaitlist && (
          <WaitlistForm onClose={() => setShowWaitlist(false)} />
        )}
      </main>

      <Footer onWaitlist={() => setShowWaitlist(true)} />
    </>
  )
} 