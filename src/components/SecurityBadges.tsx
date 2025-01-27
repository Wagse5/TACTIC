'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'

const badges = [
  {
    name: 'HIPAA Compliant',
    description: 'Meets all HIPAA security and privacy requirements',
    image: '/hipaa-badge.svg'
  },
  {
    name: 'SOC2 Certified',
    description: 'Adheres to SOC2 security and availability standards',
    image: '/soc2-badge.svg'
  },
  {
    name: 'GDPR Compliant',
    description: 'Follows EU data protection and privacy regulations',
    image: '/gdpr-badge.svg'
  },
  {
    name: 'WCAG 2.1 AA',
    description: 'Meets web content accessibility guidelines',
    image: '/a11y-badge.svg'
  }
]

export default function SecurityBadges() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Enterprise-Grade Security & Compliance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Your data is protected by industry-leading security standards
          </motion.p>
        </div>

        <Tooltip.Provider>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {badges.map((badge, index) => (
              <Tooltip.Root key={badge.name}>
                <Tooltip.Trigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative w-32 h-20 cursor-help"
                  >
                    <Image
                      src={badge.image}
                      alt={badge.name}
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                </Tooltip.Trigger>

                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm max-w-xs"
                    sideOffset={5}
                  >
                    <div className="font-medium mb-1">{badge.name}</div>
                    <div className="text-gray-300">{badge.description}</div>
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>
        </Tooltip.Provider>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          All data is encrypted at rest and in transit using industry-standard protocols
        </motion.div>
      </div>
    </section>
  )
} 