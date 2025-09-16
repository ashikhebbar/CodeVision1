import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Upload, Camera, Zap, Globe, Target, CheckCircle, Eye, Mic, User, LogOut, Languages, EyeOff, Mail, Lock, ArrowLeft, X } from 'lucide-react'
import ImageUpload from './components/ImageUpload.jsx'
import VoiceInput from './components/VoiceInput.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import './App.css'
import { AspectRatio } from '@/components/ui/aspect-ratio.jsx'
import { signInWithPopup, signOut, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

// Import assets
import girHeroImage from './assets/qZdlKVQr3iSs.jpg'
import girCarouselImage from './assets/gir_cow_carousel_optimized.png'
import sahiwalCarouselImage from './assets/sahiwal_cow_carousel_optimized.png'
import redSindhiCarouselImage from './assets/red_sindhi_cow_carousel_optimized.png'
import kankrejCarouselImage from './assets/kankrej_cow_carousel_optimized.png'
import cowSilhouetteRunning from './assets/cow_silhouette_running.png'
import cowSilhouetteTarget from './assets/cow_silhouette_target.png'
import cowSilhouetteSpeech from './assets/cow_silhouette_speech_bubbles.png'
import cow3DModel from './assets/3d_cow_model.png'

// Translations object
const translations = {
  'en-US': {
    heroTitle: 'BreedVision AI',
    heroSubtitle: 'Ultra-Realistic Cattle Recognition with 4K Precision',
    heroButton: 'Experience the Future',
    uploadTitle: 'Try BreedVision AI',
    uploadSubtitle: 'Capture or upload a cattle image to experience cutting-edge AI breed recognition',
    startCamera: 'Start Camera',
    stopCamera: 'Stop Camera',
    capture: 'Capture',
    uploadImage: 'Upload Image',
    clearImage: 'Clear Image',
    breedsTitle: 'Indian Cattle Breeds',
    breedsSubtitle: 'Discover the magnificent diversity of Indian cattle through our ultra-realistic 4K imagery',
    aiDemoTitle: 'AI Recognition Demo',
    aiDemoSubtitle: 'Watch our advanced AI analyze cattle breeds in real-time with unprecedented accuracy',
    featuresTitle: 'Why Choose BreedVision AI?',
    featuresSubtitle: 'Advanced technology designed specifically for Indian farmers and livestock professionals',
    login: 'Login',
    signup: 'Signup',
    signOut: 'Sign Out',
    language: 'Language',
    profile: 'Profile',
    createAccount: 'Create Account',
    loginTitle: 'Sign In',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
    alreadyHaveAccount: 'Already have an account? Sign in here',
    needAccount: 'Need an account? Sign up here',
    loginWithGoogle: 'Sign in with Google',
    signupWithGoogle: 'Sign up with Google',
    back: 'Back'
  },
  'hi-IN': {
    heroTitle: 'ब्रीडविज़न एआई',
    heroSubtitle: '4K प्रिसिजन के साथ अल्ट्रा-रियलिस्टिक पशु पहचान',
    heroButton: 'भविष्य का अनुभव करें',
    uploadTitle: 'ब्रीडविज़न एआई आज़माएं',
    uploadSubtitle: 'पशु की छवि कैप्चर या अपलोड करें और अत्याधुनिक एआई नस्ल पहचान का अनुभव करें',
    startCamera: 'कैमरा शुरू करें',
    stopCamera: 'कैमरा बंद करें',
    capture: 'कैप्चर करें',
    uploadImage: 'छवि अपलोड करें',
    clearImage: 'छवि हटाएं',
    breedsTitle: 'भारतीय पशु नस्लें',
    breedsSubtitle: 'हमारी अल्ट्रा-रियलिस्टिक 4K इमेजरी के माध्यम से भारतीय पशुओं की शानदार विविधता की खोज करें',
    aiDemoTitle: 'एआई पहचान डेमो',
    aiDemoSubtitle: 'हमारे उन्नत एआई को वास्तविक समय में पशु नस्लों का विश्लेषण करते हुए देखें',
    featuresTitle: 'ब्रीडविज़न एआई क्यों चुनें?',
    featuresSubtitle: 'भारतीय किसानों और पशु पेशेवरों के लिए विशेष रूप से डिज़ाइन की गई उन्नत तकनीक',
    login: 'लॉगिन',
    signup: 'साइन अप',
    signOut: 'साइन आउट',
    language: 'भाषा',
    profile: 'प्रोफ़ाइल',
    createAccount: 'खाता बनाएं',
    loginTitle: 'साइन इन करें',
    firstName: 'पहला नाम',
    lastName: 'अंतिम नाम',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    agreeToTerms: 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूँ',
    alreadyHaveAccount: 'पहले से खाता है? यहाँ साइन इन करें',
    needAccount: 'खाता चाहिए? यहाँ साइन अप करें',
    loginWithGoogle: 'Google के साथ साइन इन करें',
    signupWithGoogle: 'Google के साथ साइन अप करें',
    back: 'वापस'
  },
  'ta-IN': {
    heroTitle: 'ப்ரீட்விஷன் AI',
    heroSubtitle: '4K துல்லியத்துடன் அல்ட்ரா-உண்மையான மாடு அடையாளம்',
    heroButton: 'எதிர்காலத்தை அனுபவிக்கவும்',
    uploadTitle: 'ப்ரீட்விஷன் AI ஐ முயற்சிக்கவும்',
    uploadSubtitle: 'மாட்டின் படத்தை பிடிக்கவும் அல்லது பதிவேற்றவும் மற்றும் முன்னணி AI இனவழி அடையாளத்தை அனுபவிக்கவும்',
    startCamera: 'கேமராவை தொடங்கவும்',
    stopCamera: 'கேமராவை நிறுத்தவும்',
    capture: 'பிடிக்கவும்',
    uploadImage: 'படத்தை பதிவேற்றவும்',
    clearImage: 'படத்தை அழிக்கவும்',
    breedsTitle: 'இந்திய மாடு இனங்கள்',
    breedsSubtitle: 'எங்கள் அல்ட்ரா-உண்மையான 4K படங்கள் மூலம் இந்திய மாடுகளின் அழகியல் பன்மை கண்டுபிடிக்கவும்',
    aiDemoTitle: 'AI அடையாளம் டெமோ',
    aiDemoSubtitle: 'எங்கள் மேம்பட்ட AI ஐ உண்மையான நேரத்தில் மாடு இனங்களை பகுப்பாய்வு செய்வதை பார்க்கவும்',
    featuresTitle: 'ப்ரீட்விஷன் AI ஐ ஏன் தேர்ந்தெடுக்க வேண்டும்?',
    featuresSubtitle: 'இந்திய விவசாயிகள் மற்றும் பெஸ்ட்ரி தொழில்முறைகளுக்காக சிறப்பாக வடிவமைக்கப்பட்ட மேம்பட்ட தொழில்நுட்பம்',
    login: 'உள்நுழை',
    signup: 'பதிவு செய்',
    signOut: 'வெளியேறு',
    language: 'மொழி',
    profile: 'சுயவிவரம்',
    createAccount: 'கணக்கு உருவாக்கவும்',
    loginTitle: 'உள்நுழைக',
    firstName: 'முதல் பெயர்',
    lastName: 'கடைசி பெயர்',
    email: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    agreeToTerms: 'நான் சேவை விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்கிறேன்',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா? இங்கே உள்நுழைக',
    needAccount: 'கணக்கு தேவையா? இங்கே பதிவு செய்',
    loginWithGoogle: 'Google உடன் உள்நுழைக',
    signupWithGoogle: 'Google உடன் பதிவு செய்',
    back: 'பின்னோக்கி'
  },
  'te-IN': {
    heroTitle: 'బ్రీడ్‌విజన్ AI',
    heroSubtitle: '4K ఖచ్చితత్వంతో అల్ట్రా-రియలిస్టిక్ గొర్రెల గుర్తింపు',
    heroButton: 'భవిష్యత్తును అనుభవించండి',
    uploadTitle: 'బ్రీడ్‌విజన్ AI ని ప్రయత్నించండి',
    uploadSubtitle: 'గొర్రె చిత్రాన్ని క్యాప్చర్ చేయండి లేదా అప్‌లోడ్ చేయండి మరియు అత్యాధునిక AI ఇన్ గుర్తింపును అనుభవించండి',
    startCamera: 'కెమెరాను ప్రారంభించండి',
    stopCamera: 'కెమెరాను ఆపండి',
    capture: 'క్యాప్చర్ చేయండి',
    uploadImage: 'చిత్రాన్ని అప్‌లోడ్ చేయండి',
    clearImage: 'చిత్రాన్ని తొలగించండి',
    breedsTitle: 'భారతీయ గొర్రెల జాతులు',
    breedsSubtitle: 'మా అల్ట్రా-రియలిస్టిక్ 4K చిత్రాల ద్వారా భారతీయ గొర్రెల వైవిధ్యాన్ని కనుగొనండి',
    aiDemoTitle: 'AI గుర్తింపు డెమో',
    aiDemoSubtitle: 'మా అధునాతన AI ను రియల్-టైమ్‌లో గొర్రెల జాతులను విశ్లేషించడానికి చూడండి',
    featuresTitle: 'బ్రీడ్‌విజన్ AI ని ఎందుకు ఎంచుకోవాలి?',
    featuresSubtitle: 'భారతీయ రైతులు మరియు పశువుల ప్రొఫెషనల్స్ కోసం ప్రత్యేకంగా రూపొందించిన అధునాతన సాంకేతికత',
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    signOut: 'సైన్ అవుట్',
    language: 'భాష',
    profile: 'ప్రొఫైల్',
    createAccount: 'ఖాతా సృష్టించండి',
    loginTitle: 'సైన్ ఇన్',
    firstName: 'మొదటి పేరు',
    lastName: 'చివరి పేరు',
    email: 'ఇమెయిల్ చిరునామా',
    password: 'పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్‌ను నిర్ధారించండి',
    agreeToTerms: 'నేను సేవా నిబంధనలు మరియు గోప్యతా విధానాన్ని అంగీకరిస్తున్నాను',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా? ఇక్కడ సైన్ ఇన్ చేయండి',
    needAccount: 'ఖాతా కావాలా? ఇక్కడ సైన్ అప్ చేయండి',
    loginWithGoogle: 'Googleతో సైన్ ఇన్ చేయండి',
    signupWithGoogle: 'Googleతో సైన్ అప్ చేయండి',
    back: 'వెనక్కి'
  }
}

function AuthModal({ mode, setShowAuthModal, t, signInWithGoogle }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const modalRef = useRef(null)

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAuthModal(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setShowAuthModal])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          alert(t.passwordsDoNotMatch || 'Passwords do not match')
          return
        }
        if (!formData.agreeToTerms) {
          alert(t.agreeToTermsRequired || 'You must agree to the Terms of Service and Privacy Policy')
          return
        }
        await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        console.log('Signup successful:', formData)
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
        console.log('Login successful:', formData)
      }
      setShowAuthModal(null)
    } catch (error) {
      console.error(`${mode} error:`, error)
      alert(error.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="w-full max-w-md">
        <Card className="bg-white p-6 sm:p-8">
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              className="absolute top-4 left-4"
              onClick={() => setShowAuthModal(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-green-800">{t.heroTitle}</span>
            </div>
            <h1 className="text-2xl font-bold text-green-900 mb-2">
              {mode === 'signup' ? t.createAccount : t.loginTitle}
            </h1>
            <p className="text-gray-600">{t.featuresSubtitle}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-900">{t.firstName}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      type="text"
                      name="firstName"
                      placeholder={t.firstName}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-900">{t.lastName}</label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder={t.lastName}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-900">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  type="email"
                  name="email"
                  placeholder={t.email}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-900">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={t.password}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-900">{t.confirmPassword}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder={t.confirmPassword}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
            {mode === 'signup' && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked })}
                  required
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                  {t.agreeToTerms}
                </label>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={mode === 'signup' && !formData.agreeToTerms}
            >
              {mode === 'signup' ? t.createAccount : t.loginTitle}
            </Button>
          </form>
          <div className="my-6">
            <Separator className="my-4" />
            <p className="text-center text-sm text-gray-600">{t.or || 'Or'} {mode === 'signup' ? t.signup : t.login} {t.with || 'with'}</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={signInWithGoogle}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {mode === 'signup' ? t.signupWithGoogle : t.loginWithGoogle}
          </Button>
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {mode === 'signup' ? t.alreadyHaveAccount : t.needAccount}{' '}
              <button 
                className="text-green-600 hover:text-green-700 font-medium"
                onClick={() => setShowAuthModal(mode === 'signup' ? 'login' : 'signup')}
              >
                {mode === 'signup' ? t.login : t.signup}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

function App() {
  const [scrollY, setScrollY] = useState(0)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en-US')
  const [user, setUser] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(null) // 'login' or 'signup'

  const heroRef = useRef(null)
  const carouselRef = useRef(null)
  const aiDemoRef = useRef(null)
  const featuresRef = useRef(null)
  const uploadRef = useRef(null)
  const voiceRef = useRef(null)
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)

  const t = translations[currentLanguage]

  // Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) setShowAuthModal(null)
    })
    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Google auth error:', error)
      alert(error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      alert(error.message)
    }
  }

  // Scroll event handler (simplified, removed parallax)
  useEffect(() => {
    let timeout
    const handleScroll = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        setScrollY(window.scrollY)
      }, 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsCameraActive(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Failed to access camera. Please check permissions or device availability.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
  }

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera()
    } else {
      startCamera()
    }
  }

  const captureImage = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    const imageData = canvas.toDataURL('image/jpeg')
    handleImageUpload(imageData)
    stopCamera()
  }

  const clearImage = () => {
    setUploadedImage(null)
    stopCamera()
  }

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const handleImageUpload = (fileOrDataUrl) => {
    let file
    if (typeof fileOrDataUrl === 'string') {
      fetch(fileOrDataUrl)
        .then(res => res.blob())
        .then(blob => {
          file = new File([blob], 'captured.jpg', { type: 'image/jpeg' })
          const url = URL.createObjectURL(file)
          setUploadedImage(url)
          console.log('Image captured and processed:', file)
        })
    } else {
      file = fileOrDataUrl
      const url = URL.createObjectURL(file)
      setUploadedImage(url)
      console.log('Image uploaded:', file.name)
    }
  }

  // Mock breed data
  const breeds = [
    {
      name: "Gir",
      image: girCarouselImage,
      origin: "Gujarat, India",
      milkYield: "10-15 L/day",
      characteristics: ["Heat Tolerant", "Disease Resistant", "High Milk Fat"]
    },
    {
      name: "Sahiwal",
      image: sahiwalCarouselImage,
      origin: "Punjab, Pakistan",
      milkYield: "12-18 L/day",
      characteristics: ["High Milk Yield", "Adaptable", "Docile Nature"]
    },
    {
      name: "Red Sindhi",
      image: redSindhiCarouselImage,
      origin: "Sindh, Pakistan",
      milkYield: "8-12 L/day",
      characteristics: ["Heat Resistant", "Good Grazer", "Hardy Breed"]
    },
    {
      name: "Kankrej",
      image: kankrejCarouselImage,
      origin: "Gujarat, Rajasthan",
      milkYield: "6-10 L/day",
      characteristics: ["Drought Tolerant", "Strong Build", "Dual Purpose"]
    }
  ]

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get breed identification results in seconds with our AI engine.",
      silhouette: cowSilhouetteRunning,
      animation: "cow-running"
    },
    {
      icon: Target,
      title: "99% Accuracy",
      description: "Industry-leading accuracy trained on extensive Indian breed datasets.",
      silhouette: cowSilhouetteTarget,
      animation: "pulse-glow"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Available in 10+ Indian languages for farmers across all regions.",
      silhouette: cowSilhouetteSpeech,
      animation: "floating"
    }
  ]

  const handleVoiceCommand = (commandData) => {
    const { command, language } = commandData
    switch (command.toLowerCase()) {
      case 'upload image':
      case 'फोटो अपलोड करें':
        uploadRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'take photo':
      case 'फोटो लें':
        uploadRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'show breeds':
      case 'नस्लें दिखाएं':
        carouselRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'analyze breed':
      case 'नस्ल का विश्लेषण करें':
        aiDemoRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      default:
        console.log('Voice command received:', commandData)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-green-500/30 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-green-900/50">
              <Zap className="w-6 h-6 text-green-400" />
            </Button>
            <h1 className="text-2xl font-bold text-green-400">{t.heroTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger className="w-48 bg-black/50 border-green-500/50 text-green-400 hover:bg-green-900/50">
                <Languages className="w-4 h-4 mr-2 text-green-400" />
                <SelectValue placeholder={t.language} />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-green-500/50 text-green-400">
                <SelectItem value="en-US" className="hover:bg-green-900/50">English</SelectItem>
                <SelectItem value="hi-IN" className="hover:bg-green-900/50">हिंदी</SelectItem>
                <SelectItem value="ta-IN" className="hover:bg-green-900/50">தமிழ்</SelectItem>
                <SelectItem value="te-IN" className="hover:bg-green-900/50">తెలుగు</SelectItem>
              </SelectContent>
            </Select>
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-sm text-green-400 hover:bg-green-900/50">
                  <User className="w-4 h-4 mr-1 text-green-400" />
                  {t.profile} ({user.email?.split('@')[0]})
                </Button>
                <Button variant="destructive" size="sm" onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white">
                  <LogOut className="w-4 h-4 mr-1" />
                  {t.signOut}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setShowAuthModal('login')} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t.login}
                </Button>
                <Button 
                  onClick={() => setShowAuthModal('signup')} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t.signup}
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          mode={showAuthModal} 
          setShowAuthModal={setShowAuthModal} 
          t={t} 
          signInWithGoogle={signInWithGoogle}
        />
      )}

      {/* Floating Voice Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowVoiceInput(!showVoiceInput)}
          className={`w-16 h-16 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 ${
            showVoiceInput 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
          }`}
        >
          <Mic className="w-8 h-8 text-white" />
        </Button>
      </div>

      {/* Voice Input Panel */}
      {showVoiceInput && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]">
          <VoiceInput 
            onVoiceCommand={handleVoiceCommand}
            language={currentLanguage}
          />
        </div>
      )}

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="hero-section pt-20 pb-24 min-h-screen bg-cover bg-center bg-no-repeat relative z-10"
        style={{
          backgroundImage: `url(${girHeroImage})`
        }}
      >
        <div className="hero-overlay absolute inset-0 bg-black/50"></div>
        <div className="hero-content relative z-20 flex items-center justify-center min-h-screen">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1
              className="text-6xl md:text-8xl font-black mb-6 tracking-tight animate-on-scroll"
            >
              {t.heroTitle}
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 opacity-90 animate-on-scroll"
            >
              {t.heroSubtitle}
            </p>
            <Button
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 animate-on-scroll"
              onClick={() => uploadRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.heroButton}
            </Button>
          </div>
        </div>
      </section>

      {/* Improved Upload Section */}
      <section ref={uploadRef} className="py-16 md:py-24 bg-gradient-to-br from-gray-800 to-gray-900 relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black text-green-400 mb-6">{t.uploadTitle}</h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              {t.uploadSubtitle}
            </p>
          </div>
          <div 
            className={`max-w-6xl mx-auto transition-all duration-300 ${
              dragActive ? 'border-green-500 bg-green-900/30' : 'border-gray-600 bg-gray-800/50'
            } rounded-xl`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Card className="border-2 border-gradient-to-r from-green-500 to-yellow-500 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden animate-on-scroll bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative">
                    <AspectRatio ratio={16 / 9} className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-500">
                      {uploadedImage ? (
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded Preview" 
                          className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                        />
                      ) : isCameraActive ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                          <Upload className="w-16 h-16 text-green-400 mb-4 animate-bounce" />
                          <p className="text-gray-300 mb-2 font-medium">Drag & drop your image here</p>
                          <p className="text-sm text-gray-400">or click to upload</p>
                        </div>
                      )}
                    </AspectRatio>
                    {dragActive && (
                      <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center rounded-xl">
                        <p className="text-green-400 font-semibold">Drop to upload!</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                      <Button
                        variant={isCameraActive ? "destructive" : "default"}
                        size="lg"
                        onClick={toggleCamera}
                        className={`flex items-center gap-2 w-full justify-center text-lg font-semibold transition-all duration-300 ${
                          isCameraActive 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {isCameraActive ? (
                          <>
                            <Camera className="w-6 h-6" />
                            {t.stopCamera}
                          </>
                        ) : (
                          <>
                            <Camera className="w-6 h-6" />
                            {t.startCamera}
                          </>
                        )}
                      </Button>
                      {isCameraActive && (
                        <Button
                          variant="default"
                          size="lg"
                          onClick={captureImage}
                          className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Camera className="w-6 h-6" />
                          {t.capture}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 w-full justify-center bg-transparent border-2 border-green-500 text-green-400 hover:bg-green-500/10 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
                      >
                        <Upload className="w-6 h-6" />
                        {t.uploadImage}
                      </Button>
                      {uploadedImage && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={clearImage}
                          className="flex items-center gap-2 w-full justify-center bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500/10 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
                        >
                          <X className="w-6 h-6" />
                          {t.clearImage}
                        </Button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleImageUpload(e.target.files[0])
                          }
                        }}
                      />
                    </div>
                    {uploadedImage && (
                      <Badge className="bg-green-900/50 text-green-300 w-full justify-center py-2 text-base border border-green-500/50">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Image ready for analysis!
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Breed Carousel Section */}
      <section ref={carouselRef} className="py-24 bg-gradient-to-br from-green-50 to-yellow-50 relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-5xl font-black text-green-800 mb-6">{t.breedsTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.breedsSubtitle}
            </p>
          </div>
          <div className="breed-carousel grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-on-scroll">
            {breeds.map((breed, index) => (
              <Card key={index} className="breed-card bg-white shadow-xl border-2 border-green-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img
                    src={breed.image}
                    alt={breed.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl md:text-2xl font-bold">{breed.name}</h3>
                    <p className="text-xs md:text-sm opacity-90">{breed.origin}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Milk Yield</span>
                      <span className="text-lg font-bold text-green-600">{breed.milkYield}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {breed.characteristics.map((char, idx) => (
                      <Badge key={idx} className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {char}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section ref={aiDemoRef} className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-5xl font-black mb-6 text-green-400">{t.aiDemoTitle}</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {t.aiDemoSubtitle}
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center animate-on-scroll">
            <div className="relative group">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-green-500/50 hover:border-green-500 transition-all duration-300">
                <div className="relative aspect-video bg-gray-700 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={girCarouselImage} 
                    alt="Scanning cow"
                    className="w-full h-full object-cover"
                  />
                  <div className="scanning-line absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent animate-scan"></div>
                  <div className="absolute top-4 left-4 text-green-400 font-mono text-sm bg-black/30 px-2 py-1 rounded">
                    SCANNING... 00:12
                  </div>
                  <div className="absolute bottom-4 right-4 text-green-400 bg-black/30 p-2 rounded-full">
                    <Eye className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-green-500/50 text-white hover:border-green-500 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-green-400 text-2xl">Breed Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-3xl font-bold text-green-400 mb-2">GIR CATTLE</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-gray-400">CONFIDENCE</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div className="confidence-fill bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full animate-pulse" style={{ width: '98%' }}></div>
                        </div>
                        <span className="text-green-400 font-bold">98%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-green-400">Characteristics</h4>
                      <ul className="space-y-1 text-gray-300">
                        <li>• Red to yellow with white patches</li>
                        <li>• Heat tolerant and disease resistant</li>
                        <li>• High milk fat content</li>
                        <li>• Curved backward horns</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-gradient-to-br from-white to-green-50 relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-5xl font-black text-green-800 mb-6">{t.featuresTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.featuresSubtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="animate-on-scroll bg-white/80 backdrop-blur-sm shadow-xl border-2 border-green-100/50 hover:border-green-300 transition-all duration-300 transform hover:scale-105 hover:bg-green-50">
                <CardHeader className="text-center pb-4">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow">
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <img 
                      src={feature.silhouette} 
                      alt={`${feature.title} illustration`}
                      className={`absolute -top-2 -right-2 w-16 h-16 ${feature.animation} transition-all duration-300`}
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-green-800 to-yellow-600 text-white py-12 relative z-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">{t.heroTitle}</h3>
          <p className="text-white/80 mb-4">
            Revolutionizing Indian agriculture with cutting-edge AI technology
          </p>
          <p className="text-white/60">
            Built with ❤️ for Indian farmers and livestock community
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App