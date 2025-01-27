'use client'

import React from 'react'
import { motion } from 'framer-motion'

const features = [
  {
    title: "Edge AI Processing",
    description: "All analysis happens directly on your device - no data leaves your phone",
    icon: "🔒"
  },
  {
    title: "Multilingual Support",
    description: "Analyze mental health patterns in 20+ languages",
    icon: "🌐"
  },
  {
    title: "Clinical Integration",
    description: "Export professional-grade reports for healthcare providers",
    icon: "📊"
  }
]

export default function FeaturesGrid() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-blue-900">
          Why Professionals Choose TACTIC
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 