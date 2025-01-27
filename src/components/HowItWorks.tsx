'use client'

import React from 'react'
import { motion } from 'framer-motion'

const steps = [
  { title: "Daily Check-ins", description: "Share your thoughts via voice/text" },
  { title: "AI Analysis", description: "On-device processing of patterns" },
  { title: "Actionable Insights", description: "Personalized mental health guidance" }
]

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-blue-900">
          Your Journey to Better Mental Health
        </h2>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-1 w-full bg-gray-200"></div>
          </div>
          
          <div className="relative grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center z-10"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 