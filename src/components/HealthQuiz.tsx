'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

interface Question {
  id: number
  text: string
  category: string
  options: {
    text: string
    score: number
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "Over the last 2 weeks, how often have you felt down, depressed, or hopeless?",
    category: "Depression",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 2,
    text: "Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?",
    category: "Anxiety",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    id: 3,
    text: "How often do you have trouble falling or staying asleep?",
    category: "Sleep",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  }
]

export default function HealthQuiz() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<number, number>>({})
  const [showResults, setShowResults] = React.useState(false)

  const handleAnswer = (score: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: score }))
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateResults = () => {
    const categories = questions.reduce((acc, q) => {
      if (!acc[q.category]) {
        acc[q.category] = []
      }
      acc[q.category].push(answers[q.id] || 0)
      return acc
    }, {} as Record<string, number[]>)

    return Object.entries(categories).map(([category, scores]) => {
      const total = scores.reduce((sum, score) => sum + score, 0)
      const max = scores.length * 3
      const percentage = (total / max) * 100
      
      let severity = "Minimal"
      if (percentage >= 75) severity = "Severe"
      else if (percentage >= 50) severity = "Moderate"
      else if (percentage >= 25) severity = "Mild"

      return { category, severity, percentage }
    })
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Mental Health Assessment
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Take our quick assessment based on DSM-5 criteria
          </motion.p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!showResults ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <p className="text-center mt-2 text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-900 mb-6">
                {questions[currentQuestion].text}
              </h3>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.score)}
                    className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Assessment Results</h3>
              
              <div className="space-y-4">
                {calculateResults().map((result, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{result.category}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                        result.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        result.severity === 'Mild' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {result.severity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          result.severity === 'Severe' ? 'bg-red-500' :
                          result.severity === 'Moderate' ? 'bg-yellow-500' :
                          result.severity === 'Mild' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Take Assessment Again
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
} 