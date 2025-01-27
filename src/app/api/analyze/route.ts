import { NextResponse } from 'next/server'
import axios from 'axios'

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/beta/chat/completions'

export async function POST(request: Request) {
  console.log('\n🔍 Starting DeepSeek Analysis...')
  
  try {
    // Step 1: Check environment
    console.log('Step 1: Checking environment...')
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('❌ DEEPSEEK_API_KEY is not configured')
      throw new Error('DEEPSEEK_API_KEY is not configured')
    }
    console.log('✅ DEEPSEEK_API_KEY found')

    // Step 2: Parse request with validation
    console.log('\nStep 2: Parsing request...')
    const body = await request.json()
    
    if (!body.audioFeatures) {
      console.error('❌ Missing required field: audioFeatures')
      throw new Error('Missing required field: audioFeatures')
    }
    
    const transcription = body.transcription || 'No speech detected'
    const { audioFeatures } = body
    
    // Log complete analysis data
    console.log('\n🎤 Complete Analysis Data:')
    console.log('------------------------')
    console.log('Transcribed Speech:', transcription)
    console.log('\nAudio Features:', JSON.stringify(audioFeatures, null, 2))
    console.log('------------------------')

    // Log payload being sent to DeepSeek
    console.log('\n📤 Sending payload to DeepSeek:')
    console.log(JSON.stringify({
      transcription,
      audioFeatures
    }, null, 2))

    // Step 3: Prepare API request
    console.log('\nStep 3: Preparing API request...')
    const systemMessage = `You are a highly skilled, empathetic therapist with years of experience in one-on-one therapy sessions. Your role is to create a safe, understanding space while subtly integrating both verbal content and emotional context from voice patterns.

Client's Words: "${transcription}"

Voice Analysis Context (for informing your response tone, not to mention directly):
${JSON.stringify(audioFeatures, null, 2)}

Respond naturally as if in a therapy session by:

1. Deep Listening & Reflection
   - Notice underlying emotions, metaphors, and recurring themes
   - Consider both what is said and how it's said (pace, energy, tension)
   - Let the voice analysis subtly inform your understanding without mentioning it

2. Therapeutic Presence
   - Start with a gentle acknowledgment of their experience
   - Use natural, conversational language
   - Allow space for complexity and ambivalence
   - Match your response tone to their emotional state

3. Organic Exploration
   - Weave between reflection, validation, and gentle questioning
   - Follow their narrative while noticing opportunities for deeper understanding
   - Use their exact phrases when appropriate
   - Offer perspective shifts when helpful

4. Response Structure (maintain natural flow between):
   - Emotional attunement ("I hear how challenging this feels...")
   - Gentle exploration ("What comes up for you when you say...?")
   - Perspective offering ("Sometimes when we experience...")
   - Space holding ("Let's sit with that feeling for a moment...")

Remember:
- Stay conversational and authentic
- Let the audio context inform your tone but don't mention voice analysis
- Focus on creating a safe space for exploration
- Allow for silence and reflection when appropriate
- Use their exact words mindfully
- Maintain professional boundaries while being warm and present

Shape your response as a natural conversation, not a clinical analysis.`

    const userPrompt = `As their therapist, respond naturally to what they've shared: "${transcription}"

Let the emotional context from their voice inform your response tone:
${JSON.stringify(audioFeatures, null, 2)}

Focus on creating a genuine therapeutic connection while maintaining professional depth.`

    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    }
    console.log('✅ Request body prepared')

    // Step 4: Make API call
    console.log('\nStep 4: Making API call to DeepSeek...')
    
    const response = await axios.post(DEEPSEEK_API_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    })

    // Step 5: Process response
    console.log('\nStep 5: Processing response...')
    console.log('Response status:', response.status)
    
    const data = response.data
    console.log('✅ DeepSeek API response:', JSON.stringify(data, null, 2))

    // Step 6: Format response
    console.log('\nStep 6: Formatting response...')
    const therapeuticInsight = data.choices[0]?.message?.content || ''
    
    const formattedResponse = {
      analysis: {
        therapeuticInsight,
        fullAnalysis: therapeuticInsight,
        primaryEmotion: "Empathetic",
        secondaryEmotion: "Supportive",
        confidence: 90
      }
    }
    
    console.log('✅ Analysis complete')
    console.log('Formatted response:', formattedResponse)
    return NextResponse.json(formattedResponse)
    
  } catch (error: any) {
    console.error('\n❌ DeepSeek analysis error:', error.message || error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    }
    
    return NextResponse.json({
      error: 'Failed to analyze with DeepSeek',
      details: error.message || 'Unknown error',
      status: error.response?.status || 500,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(7)
    }, { status: 500 })
  }
}       