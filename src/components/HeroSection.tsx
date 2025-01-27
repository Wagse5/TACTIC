'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="pt-32 pb-24 container-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Connect, Share, and Heal with{' '}
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                AI-Powered Mental Health
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              HIPAA-compliant diagnostics running securely on your device
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <a href="#waitlist" className="btn-primary text-lg">
                Get Early Access
              </a>
            </motion.div>
          </motion.div>

          {/* Image/Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] lg:h-[500px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl">
              {/* Add your hero image or animation here */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 