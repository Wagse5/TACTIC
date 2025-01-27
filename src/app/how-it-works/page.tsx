'use client'

import { motion } from 'framer-motion'
import { Mic, Brain, MessageSquare, Volume2 } from 'lucide-react'

const steps = [
  {
    icon: Mic,
    title: 'Record Your Voice',
    description: 'Simply click the record button and speak naturally about your thoughts and feelings. Our system will capture your voice for analysis.'
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our dual AI system analyzes both the acoustic patterns in your voice and the content of your speech to understand your emotional state.'
  },
  {
    icon: MessageSquare,
    title: 'Receive Insights',
    description: 'Within seconds, our AI therapist formulates a personalized, empathetic response based on your emotional state and concerns.'
  },
  {
    icon: Volume2,
    title: 'Listen to Response',
    description: 'Hear a natural, human-like therapeutic response that acknowledges your feelings and provides supportive guidance.'
  }
]

export default function HowItWorksPage() {
  return (
    <div className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-gray-900 mb-6"
          >
            How It Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Experience emotional support through the power of AI voice analysis
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-purple-200 -translate-y-1/2 hidden lg:block" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <step.icon className="w-8 h-8 text-purple-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 text-center">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-8">
            Ready to experience AI-powered emotional support?
          </p>
          <a
            href="/demo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 
                     text-white rounded-lg transition-colors text-lg font-medium shadow-md hover:shadow-lg"
          >
            Try Demo
            <Mic className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </div>
  )
} 