# TACTIC - AI-Powered Therapeutic Voice Analysis

TACTIC (Therapist Assisted Continuous Talk Integrated Companion) is an innovative mental health platform that combines AI-powered voice analysis with therapeutic responses, providing a unique and empathetic interaction experience.

## 🌟 Features

### Core Functionality
- **Voice Recording & Analysis**: Real-time voice recording with advanced audio feature extraction
- **AI-Powered Processing**: 
  - Whisper API for accurate speech-to-text
  - Custom audio analysis for emotional context
  - DeepSeek AI for therapeutic response generation
- **Natural Voice Response**: OpenAI TTS for human-like audio responses
- **Privacy-First Design**: Edge processing for sensitive data

### Technical Features
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion animations
- Real-time audio processing
- API integration with OpenAI and DeepSeek

## 🏗️ Architecture

### Frontend Components
- `VoiceRecorder`: Handles audio recording and streaming
- `AiDemo`: Orchestrates the analysis pipeline
- `TherapistAnalysis`: Manages response playback
- `LoadingSkeleton`: Loading state management
- `PageTransition`: Smooth page transitions

### API Routes
- `/api/transcribe`: Whisper API integration for speech-to-text
- `/api/analyze`: DeepSeek API integration for therapeutic analysis
- `/api/tts`: OpenAI Text-to-Speech conversion

### Core Libraries
- TensorFlow.js for audio processing
- Framer Motion for animations
- Axios for API requests
- Radix UI for accessible components

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn
- OpenAI API key
- DeepSeek API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tactic.git
cd tactic
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Required for Whisper and TTS
- `DEEPSEEK_API_KEY`: Required for therapeutic analysis
- `NODE_ENV`: Development/production environment
- `NEXT_PUBLIC_API_BASE_URL`: API endpoint (optional)

### API Configuration
- Whisper API: Speech-to-text conversion
- DeepSeek API: Therapeutic response generation
- OpenAI TTS API: Voice response synthesis

## 📦 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Set environment variables in Netlify dashboard
4. Enable automatic deployments

### Environment Setup
1. Add environment variables in Netlify:
   - OPENAI_API_KEY
   - DEEPSEEK_API_KEY
2. Configure build settings:
   - Node version: 18.x
   - NPM version: 9.x

## 🔐 Security

### Data Privacy
- All voice processing happens on the edge
- No audio data is stored
- HIPAA-compliant data handling
- End-to-end encryption for API calls

### API Security
- Rate limiting implemented
- API key rotation
- Request validation
- Error handling

## 🧪 Testing

Run the test suite:
```bash
npm run test
# or
yarn test
```

## 📝 Project Structure
```
/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   ├── transcribe/
│   │   │   └── tts/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── VoiceRecorder.tsx
│   │   ├── AiDemo.tsx
│   │   └── TherapistAnalysis.tsx
│   └── lib/
│       └── audioAnalysis.ts
├── public/
├── tests/
└── types/
```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- OpenAI for Whisper and TTS APIs
- DeepSeek for therapeutic analysis
- TensorFlow.js team
- Next.js team

## 📊 Project Status
Current Version: 0.1.0
Status: Active Development
