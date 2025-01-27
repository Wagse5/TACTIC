'use client'

import { motion } from 'framer-motion'
import { Mic, Brain, MessageSquare, Lock, Sparkles, LineChart } from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: 'Voice Recording & Analysis',
    description: 'Record your voice and get instant emotional analysis using advanced audio processing techniques.'
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Dual AI analysis combining TensorFlow for voice patterns and DeepSeek for therapeutic insights.'
  },
  {
    icon: MessageSquare,
    title: 'Therapeutic Response',
    description: 'Receive empathetic, professional therapeutic responses tailored to your emotional state.'
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data is processed securely and never stored. All analysis happens in real-time.'
  },
  {
    icon: Sparkles,
    title: 'Natural Interaction',
    description: 'Speak naturally and receive human-like responses that understand the nuances of your emotions.'
  },
  {
    icon: LineChart,
    title: 'Emotional Tracking',
    description: 'Track your emotional patterns over time with detailed analytics and insights.'
  }
]

export default function FeaturesPage() {
  return (
    <div className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-gray-900 mb-6"
          >
            Features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover how our AI-powered voice analysis can help you understand and process your emotions
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 
                     text-white rounded-lg transition-colors text-lg font-medium shadow-md hover:shadow-lg"
          >
            Join the Waitlist
            <Sparkles className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </div>
  )
} 