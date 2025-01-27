import { config } from 'dotenv'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync, writeFileSync } from 'fs'

try {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const rootDir = join(__dirname, '..', '..')
  const envPath = join(rootDir, '.env.local')

  console.log('\n🔍 Checking environment setup...')
  
  // Create a fresh .env.local file if it doesn't exist
  if (!existsSync(envPath)) {
    const envContent = 
`# Add your API keys here (do not commit this file)
OPENAI_API_KEY=your_openai_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
NODE_ENV=development`

    // Write the file with UTF8 encoding without BOM
    writeFileSync(envPath, envContent, { encoding: 'utf8' })
    console.log('Created fresh .env.local file')
  }

  // Load environment variables
  const result = config({ path: envPath })
  
  // Check required variables
  const required = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY
  }

  console.log('\nEnvironment variables:')
  Object.entries(required).forEach(([key, value]) => {
    console.log(`${key}: ${value ? '✅ Set' : '❌ Not set'}`)
  })

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required variables: ${missing.join(', ')}`)
  }

  console.log('\n✅ Environment loaded successfully')

} catch (error) {
  console.error('❌ Environment setup error:', error instanceof Error ? error.message : 'Unknown error')
  process.exit(1)
} 