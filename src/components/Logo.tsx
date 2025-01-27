'use client'

import * as React from 'react'
import Image from 'next/image'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const sizes = {
  small: { width: 80, height: 24 },
  medium: { width: 120, height: 36 },
  large: { width: 160, height: 48 }
}

export default function Logo({ variant = 'dark', size = 'medium', className = '' }: LogoProps) {
  const { width, height } = sizes[size]
  const logoPath = variant === 'light' ? '/logo/logo-light.svg' : '/logo/logo.svg'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width, height }}>
        <Image
          src={logoPath}
          alt="TACTIC Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span 
        className={`font-bold text-2xl ${
          variant === 'light' ? 'text-white' : 'text-gray-900'
        } hidden md:block`}
      >
        TACTIC
      </span>
    </div>
  )
} 