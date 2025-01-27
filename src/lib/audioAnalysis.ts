// Audio Analysis Utilities

export interface AudioFeatures {
  basic: {
    avgAmplitude: number
    maxAmplitude: number
    zeroCrossingRate: number
    variance: number
  }
  spectral: {
    centroid: number
    rolloff: number
    flatness: number
    spread: number
  }
  pitch: {
    fundamental: number
    harmonics: number[]
  }
  rhythm: {
    tempo: number
    beatStrength: number
  }
  formants: number[]
  mfcc: number[]
  energyDistribution: {
    lowBand: number
    midBand: number
    highBand: number
    entropy: number
  }
}

export async function extractAdvancedFeatures(audioBuffer: AudioBuffer): Promise<AudioFeatures> {
  const channelData = audioBuffer.getChannelData(0)
  const sampleRate = audioBuffer.sampleRate
  const bufferLength = channelData.length

  // Basic features
  const basic = await extractBasicFeatures(channelData)
  
  // Spectral features
  const spectral = await computeSpectralFeatures(channelData, sampleRate)
  
  // Pitch detection
  const pitch = await detectPitch(channelData, sampleRate)
  
  // Rhythm analysis
  const rhythm = await analyzeRhythm(channelData, sampleRate)
  
  // Formant analysis
  const formants = await detectFormants(channelData, sampleRate)
  
  // MFCC computation
  const mfcc = await computeMFCC(channelData, sampleRate)
  
  // Energy distribution
  const energyDistribution = await analyzeEnergyDistribution(channelData)

  return {
    basic,
    spectral,
    pitch,
    rhythm,
    formants,
    mfcc,
    energyDistribution
  }
}

async function extractBasicFeatures(channelData: Float32Array) {
  let sum = 0
  let max = 0
  let crossings = 0
  let lastVal = 0
  let varianceSum = 0
  let mean = 0

  // First pass - mean
  for (let i = 0; i < channelData.length; i++) {
    mean += Math.abs(channelData[i])
  }
  mean /= channelData.length

  // Second pass - other metrics
  for (let i = 0; i < channelData.length; i++) {
    const amplitude = Math.abs(channelData[i])
    sum += amplitude
    max = Math.max(max, amplitude)
    varianceSum += (amplitude - mean) ** 2
    
    if (lastVal < 0 && channelData[i] > 0 || lastVal > 0 && channelData[i] < 0) {
      crossings++
    }
    lastVal = channelData[i]
  }

  return {
    avgAmplitude: sum / channelData.length,
    maxAmplitude: max,
    zeroCrossingRate: crossings / channelData.length,
    variance: varianceSum / channelData.length
  }
}

async function computeSpectralFeatures(channelData: Float32Array, sampleRate: number) {
  // Implement FFT and spectral analysis
  return {
    centroid: 0,
    rolloff: 0,
    flatness: 0,
    spread: 0
  }
}

async function detectPitch(channelData: Float32Array, sampleRate: number) {
  // Implement autocorrelation-based pitch detection
  return {
    fundamental: 440, // placeholder
    harmonics: [880, 1320, 1760] // placeholder
  }
}

async function analyzeRhythm(channelData: Float32Array, sampleRate: number) {
  // Implement onset detection and tempo analysis
  return {
    tempo: 120, // placeholder
    beatStrength: 0.5 // placeholder
  }
}

async function detectFormants(channelData: Float32Array, sampleRate: number) {
  // Implement LPC analysis for formant detection
  return [500, 1500, 2500] // placeholder
}

async function computeMFCC(channelData: Float32Array, sampleRate: number) {
  // Implement MFCC computation
  return Array(13).fill(0) // placeholder
}

async function analyzeEnergyDistribution(channelData: Float32Array) {
  // Implement energy band analysis
  return {
    lowBand: 0.3,
    midBand: 0.4,
    highBand: 0.3,
    entropy: 0.5
  }
}

// Retry logic for API calls
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      console.warn(`Attempt ${attempt} failed:`, error)
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed')
} 