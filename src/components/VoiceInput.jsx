import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Mic, MicOff, Volume2, Languages, Play, Pause } from 'lucide-react'

const VoiceInput = ({ onVoiceCommand, language = 'en-US' }) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [confidence, setConfidence] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  // Supported languages for Indian farmers
  const supportedLanguages = [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'te-IN', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml-IN', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa-IN', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ]

  // Voice commands and responses
  const voiceCommands = {
    'en-US': {
      commands: {
        'upload image': 'Opening image upload interface',
        'take photo': 'Activating camera for photo capture',
        'analyze breed': 'Starting breed analysis',
        'show breeds': 'Displaying cattle breed information',
        'help': 'Available commands: upload image, take photo, analyze breed, show breeds'
      },
      responses: {
        welcome: 'Welcome to BreedVision AI. Say "help" to see available commands.',
        listening: 'Listening for your command...',
        processing: 'Processing your request...',
        error: 'Sorry, I did not understand that command.'
      }
    },
    'hi-IN': {
      commands: {
        'फोटो अपलोड करें': 'फोटो अपलोड इंटरफेस खोल रहे हैं',
        'फोटो लें': 'फोटो लेने के लिए कैमरा चालू कर रहे हैं',
        'नस्ल का विश्लेषण करें': 'नस्ल विश्लेषण शुरू कर रहे हैं',
        'नस्लें दिखाएं': 'गाय की नस्लों की जानकारी दिखा रहे हैं',
        'मदद': 'उपलब्ध कमांड: फोटो अपलोड करें, फोटो लें, नस्ल का विश्लेषण करें'
      },
      responses: {
        welcome: 'BreedVision AI में आपका स्वागत है। उपलब्ध कमांड देखने के लिए "मदद" कहें।',
        listening: 'आपके कमांड का इंतजार कर रहे हैं...',
        processing: 'आपके अनुरोध को प्रोसेस कर रहे हैं...',
        error: 'माफ करें, मैं उस कमांड को समझ नहीं पाया।'
      }
    }
  }

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = selectedLanguage
      
      recognitionRef.current.onstart = () => {
        setIsListening(true)
        speak(getCurrentLanguageData().responses.listening)
      }
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          const confidence = event.results[i][0].confidence
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript
            setConfidence(confidence || 0.8)
          } else {
            interimTranscript += transcript
          }
        }
        
        setTranscript(finalTranscript || interimTranscript)
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript.toLowerCase().trim())
        }
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        speak(getCurrentLanguageData().responses.error)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [selectedLanguage])

  const getCurrentLanguageData = () => {
    return voiceCommands[selectedLanguage] || voiceCommands['en-US']
  }

  const speak = (text) => {
    if (synthRef.current && text) {
      synthRef.current.cancel() // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage
      utterance.rate = 0.9
      utterance.pitch = 1
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synthRef.current.speak(utterance)
    }
  }

  const processVoiceCommand = (command) => {
    const languageData = getCurrentLanguageData()
    const commands = languageData.commands
    
    speak(languageData.responses.processing)
    
    // Find matching command
    const matchedCommand = Object.keys(commands).find(cmd => 
      command.includes(cmd.toLowerCase())
    )
    
    if (matchedCommand) {
      const response = commands[matchedCommand]
      speak(response)
      
      // Execute the command
      if (onVoiceCommand) {
        onVoiceCommand({
          command: matchedCommand,
          response,
          language: selectedLanguage,
          confidence
        })
      }
    } else {
      speak(languageData.responses.error)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setConfidence(0)
      recognitionRef.current.lang = selectedLanguage
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode)
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    
    // Welcome message in new language
    setTimeout(() => {
      const newLanguageData = voiceCommands[langCode] || voiceCommands['en-US']
      speak(newLanguageData.responses.welcome)
    }, 500)
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  if (!isSupported) {
    return (
      <Card className="bg-gray-100 border-gray-300">
        <CardContent className="p-6 text-center">
          <MicOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Voice input is not supported in your browser. Please use a modern browser like Chrome or Edge.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Languages className="w-6 h-6" />
          Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Language Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Select Language:</h4>
          <div className="flex flex-wrap gap-2">
            {supportedLanguages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                className={`text-xs px-3 py-1 ${
                  selectedLanguage === lang.code 
                    ? 'bg-blue-600 text-white' 
                    : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
              >
                <span className="mr-1">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Controls */}
        <div className="text-center mb-6">
          <div className="flex justify-center gap-4 mb-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`w-16 h-16 rounded-full ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white shadow-lg transform hover:scale-105 transition-all duration-300`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>
            
            {isSpeaking && (
              <Button
                onClick={stopSpeaking}
                className="w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Pause className="w-8 h-8" />
              </Button>
            )}
          </div>
          
          <p className="text-sm text-gray-600">
            {isListening ? 'Listening...' : 'Click the microphone to start voice input'}
          </p>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Transcript:</span>
              {confidence > 0 && (
                <Badge className="bg-blue-100 text-blue-800">
                  {Math.round(confidence * 100)}% confidence
                </Badge>
              )}
            </div>
            <p className="text-gray-800">{transcript}</p>
          </div>
        )}

        {/* Available Commands */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-700 mb-3 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Available Voice Commands:
          </h4>
          <div className="space-y-2 text-sm">
            {Object.keys(getCurrentLanguageData().commands).map((command, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                  "{command}"
                </Badge>
                <span className="text-gray-600 text-xs">
                  {getCurrentLanguageData().commands[command]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center gap-4 mt-4">
          {isListening && (
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Recording</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center gap-2 text-orange-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Speaking</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default VoiceInput

