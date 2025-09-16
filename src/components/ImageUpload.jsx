import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Upload, Camera, X, CheckCircle, Zap, Target, Eye } from 'lucide-react'

const ImageUpload = ({ onImageUpload, onAnalysisComplete }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [cameraStream, setCameraStream] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Mock analysis results for different breeds
  const mockResults = [
    {
      breed: "Gir Cattle",
      confidence: 95,
      origin: "Gujarat, India",
      characteristics: ["Heat Tolerant", "Disease Resistant", "High Milk Fat"],
      milkYield: "10-15 L/day",
      traits: {
        height: "130-140 cm",
        weight: "385-400 kg",
        color: "Red to yellow with white patches"
      }
    },
    {
      breed: "Sahiwal Cattle",
      confidence: 92,
      origin: "Punjab, Pakistan",
      characteristics: ["High Milk Yield", "Adaptable", "Docile Nature"],
      milkYield: "12-18 L/day",
      traits: {
        height: "120-135 cm",
        weight: "300-400 kg",
        color: "Light to dark brown"
      }
    },
    {
      breed: "Red Sindhi Cattle",
      confidence: 88,
      origin: "Sindh, Pakistan",
      characteristics: ["Heat Resistant", "Good Grazer", "Hardy Breed"],
      milkYield: "8-12 L/day",
      traits: {
        height: "115-130 cm",
        weight: "270-340 kg",
        color: "Deep red to light red"
      }
    }
  ]

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      setUploadedImage(file)
      setIsAnalyzing(true)
      setShowResult(false)
      
      if (onImageUpload) {
        onImageUpload(file)
      }
      
      // Simulate AI analysis
      setTimeout(() => {
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
        setAnalysisResult(randomResult)
        setIsAnalyzing(false)
        setShowResult(true)
        
        if (onAnalysisComplete) {
          onAnalysisComplete(randomResult)
        }
      }, 3000)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        } 
      })
      setCameraStream(stream)
      setShowCamera(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions or use file upload instead.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
        handleFile(file)
        stopCamera()
      }, 'image/jpeg', 0.9)
    }
  }

  const resetAnalysis = () => {
    setUploadedImage(null)
    setIsAnalyzing(false)
    setShowResult(false)
    setAnalysisResult(null)
    stopCamera()
  }

  if (showCamera) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-900 border-green-500 text-white overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 border-2 border-green-500 pointer-events-none">
                <div className="absolute top-4 left-4 text-green-400 font-mono text-sm">
                  CAMERA ACTIVE
                </div>
                <div className="absolute top-4 right-4 text-green-400">
                  <Eye className="w-6 h-6" />
                </div>
                {/* Scanning grid overlay */}
                <div className="absolute inset-4 border border-green-500/30 grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-green-500/20"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 flex justify-center gap-4">
              <Button
                onClick={capturePhoto}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture Photo
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 rounded-full"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    )
  }

  if (showResult && analysisResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <img 
            src={uploadedImage ? URL.createObjectURL(uploadedImage) : ''} 
            alt="Analyzed cattle"
            className="w-80 h-80 mx-auto rounded-3xl shadow-2xl object-cover border-4 border-white"
          />
        </div>
        
        <Card className="bg-gradient-to-br from-white to-green-50 shadow-2xl border-2 border-green-200">
          <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold">{analysisResult.breed}</h3>
                <p className="text-green-100 mt-2">{analysisResult.origin}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-200">{analysisResult.confidence}%</div>
                <p className="text-sm text-green-100">Confidence</p>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Physical Traits
                </h4>
                <div className="space-y-2 bg-green-50 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <span>Height:</span> 
                    <span className="font-medium">{analysisResult.traits.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight:</span> 
                    <span className="font-medium">{analysisResult.traits.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color:</span> 
                    <span className="font-medium">{analysisResult.traits.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Milk Yield:</span> 
                    <span className="font-medium">{analysisResult.milkYield}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Key Characteristics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.characteristics.map((char, idx) => (
                    <Badge key={idx} className="bg-green-100 text-green-800 hover:bg-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            onClick={resetAnalysis}
            className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
          >
            <Camera className="w-6 h-6 mr-3" />
            Analyze Another Image
          </Button>
        </div>
      </div>
    )
  }

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border-2 border-green-200">
          <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-green-800 mb-4">Analyzing Your Image...</h3>
          <p className="text-gray-600 mb-6">Our AI is processing your cattle image with 4K precision</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div 
        className={`relative border-3 border-dashed rounded-3xl p-12 text-center bg-white shadow-2xl transition-all duration-300 ${
          dragActive 
            ? 'border-green-400 bg-green-50 shadow-3xl scale-105' 
            : 'border-green-300 hover:border-green-400 hover:shadow-3xl pulse-glow'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Floating cow silhouettes */}
        <div className="floating absolute top-4 left-4 w-12 h-12 opacity-20">
          <div className="w-full h-full bg-green-500 rounded-full"></div>
        </div>
        <div className="floating absolute top-4 right-4 w-12 h-12 opacity-20" style={{ animationDelay: '1s' }}>
          <div className="w-full h-full bg-yellow-500 rounded-full"></div>
        </div>
        <div className="floating absolute bottom-4 left-4 w-12 h-12 opacity-20" style={{ animationDelay: '2s' }}>
          <div className="w-full h-full bg-green-500 rounded-full"></div>
        </div>
        <div className="floating absolute bottom-4 right-4 w-12 h-12 opacity-20" style={{ animationDelay: '0.5s' }}>
          <div className="w-full h-full bg-yellow-500 rounded-full"></div>
        </div>
        
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Upload className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-green-800 mb-4">Upload Your Cattle Image</h3>
        <p className="text-gray-600 mb-6">
          Take a clear photo of your cattle and our AI will provide instant breed identification
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Upload className="w-5 h-5 mr-2" />
            Choose File
          </Button>
          
          <Button
            onClick={startCamera}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Camera className="w-5 h-5 mr-2" />
            Use Camera
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Drag and drop an image here, or click to select a file
        </p>
      </div>
    </div>
  )
}

export default ImageUpload

