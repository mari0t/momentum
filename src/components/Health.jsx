import React, { useState, useEffect, useRef } from 'react'
import { Heart, Calculator, Camera, Award, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'
import { useLocation } from 'react-router-dom'

export default function Health() {
  const { state, dispatch, updateHealth } = useApp()
  const { t } = useTranslation()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('overview')
  const [showCalorieGoalModal, setShowCalorieGoalModal] = useState(false)
  
  // Use centralized health data from context
  const dailyFoodLog = state.health?.dailyFoodLog || []
  const calorieGoal = state.health?.calorieGoal || 2000

  // Calculator states
   const [bmiData, setBmiData] = useState({ weight: '', height: '' })
   const [calorieData, setCalorieData] = useState({
    age: '',
    gender: 'male',
    weight: '',
     height: '',
     activity: 'moderate',
     goal: 'maintain'
   })
   const [dailyCalories, setDailyCalories] = useState(0)
   
   // Additional calculator states
   const [bodyFatData, setBodyFatData] = useState({ weight: '', waist: '', neck: '', height: '', gender: 'male' })
   const [idealWeightData, setIdealWeightData] = useState({ height: '', gender: 'male', frame: 'medium' })
   const [waterIntakeData, setWaterIntakeData] = useState({ weight: '', activity: 'moderate', climate: 'temperate' })
   const [proteinData, setProteinData] = useState({ weight: '', activity: 'moderate', goal: 'maintain' })
  
  // Food log states
  const [newFood, setNewFood] = useState({ name: '', calories: 0, time: '12:00' })
  
  // Camera scanning states
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [cameraError, setCameraError] = useState('')
  
  // Refs for camera
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Check URL parameters to auto-switch to food tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tabParam = searchParams.get('tab')
    if (tabParam === 'food') {
      setActiveTab('food')
    }
  }, [location.search])
  
  
     // Sobriety states - using App Context for persistence
   const [sobrietyData, setSobrietyData] = useState({
     startDate: state.health.sobrietyData?.startDate || null,
     showDetailedTime: state.health.sobrietyData?.showDetailedTime || false
   })
  
  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  
  // Sobriety dropdown state
  const [showSobrietyDropdown, setShowSobrietyDropdown] = useState(false)
  
  // Ref to prevent update loops
  const isUpdatingRef = useRef(false)
  
  // Sobriety data
  const sobrietyMilestones = [
    { days: 1, title: 'Pierwszy dzień', icon: '🌱' },
    { days: 7, title: 'Tydzień', icon: '🌿' },
    { days: 30, title: 'Miesiąc', icon: '🌳' },
    { days: 90, title: '3 miesiące', icon: '🏆' },
    { days: 180, title: '6 miesięcy', icon: '💎' },
    { days: 365, title: 'Rok', icon: '👑' }
  ]
  
  const healthBenefits = [
    { days: 1, title: 'Lepszy sen', description: 'Poprawa jakości snu', icon: '😴' },
    { days: 3, title: 'Więcej energii', description: 'Zwiększenie poziomu energii', icon: '⚡' },
    { days: 7, title: 'Lepsze trawienie', description: 'Poprawa funkcji wątroby', icon: '🫁' },
    { days: 30, title: 'Lepsze zdrowie', description: 'Obniżenie ciśnienia krwi', icon: '❤️' },
    { days: 90, title: 'Młodszy wygląd', description: 'Poprawa stanu skóry', icon: '✨' },
    { days: 365, title: 'Długoterminowe korzyści', description: 'Znaczne zmniejszenie ryzyka chorób', icon: '🏥' }
  ]
  

  // Helper function to add food to log
  const addFoodToLog = (foodItem) => {
    const newFoodLog = [...dailyFoodLog, { ...foodItem, id: Date.now() }]
    updateHealth({ dailyFoodLog: newFoodLog })
  }

  // Helper function to remove food from log
  const removeFoodFromLog = (foodId) => {
    const newFoodLog = dailyFoodLog.filter(item => item.id !== foodId)
    updateHealth({ dailyFoodLog: newFoodLog })
  }

  // Helper function to update calorie goal
  const updateCalorieGoal = (newGoal) => {
    updateHealth({ calorieGoal: newGoal })
  }

  // Initialize calorie goal from context
  const [localCalorieGoal, setLocalCalorieGoal] = useState(calorieGoal)

  // Migrate old sobriety data and sync with App Context
  useEffect(() => {
    // One-time migration from old localStorage format
    const oldSobrietyData = localStorage.getItem('sobrietyData')
    if (oldSobrietyData && !state.health.sobrietyData?.startDate) {
      try {
        const parsed = JSON.parse(oldSobrietyData)
        if (parsed.startDate) {
          dispatch({ 
            type: 'UPDATE_HEALTH', 
            payload: { 
              sobrietyData: {
                startDate: parsed.startDate,
                showDetailedTime: parsed.showDetailedTime || false
              }
            }
          })
          // Remove old data
          localStorage.removeItem('sobrietyData')
        }
      } catch (error) {
        console.error('Error migrating sobriety data:', error)
      }
    }
    
    // Sync with current App Context data (only if different)
    if (state.health.sobrietyData && !isUpdatingRef.current) {
      const contextData = state.health.sobrietyData
      const needsUpdate = 
        sobrietyData.startDate !== contextData.startDate ||
        sobrietyData.showDetailedTime !== contextData.showDetailedTime
        
      if (needsUpdate) {
        isUpdatingRef.current = true
        setSobrietyData({
          startDate: contextData.startDate || null,
          showDetailedTime: contextData.showDetailedTime || false
        })
        setTimeout(() => { isUpdatingRef.current = false }, 100)
      }
    }
  }, [state.health.sobrietyData?.startDate, state.health.sobrietyData?.showDetailedTime, dispatch])

  // Update daily calories when calculation data changes
  useEffect(() => {
    if (bmiData.weight && bmiData.height && calorieData.age) {
      const calculatedCalories = calculateDailyCalories()
      if (calculatedCalories > 0) {
        setDailyCalories(calculatedCalories)
      }
    }
  }, [bmiData.weight, bmiData.height, calorieData.age, calorieData.gender, calorieData.activity, calorieData.goal])

     // Save sobriety data to App Context (only when it actually changes)
   useEffect(() => {
     if (isUpdatingRef.current) return
     
     const currentContextData = state.health.sobrietyData
     const hasChanged = 
       currentContextData?.startDate !== sobrietyData.startDate ||
       currentContextData?.showDetailedTime !== sobrietyData.showDetailedTime
     
     if (hasChanged) {
       isUpdatingRef.current = true
       dispatch({ 
         type: 'UPDATE_HEALTH', 
         payload: { 
           sobrietyData: {
             startDate: sobrietyData.startDate,
             showDetailedTime: sobrietyData.showDetailedTime
           }
         }
       })
       setTimeout(() => { isUpdatingRef.current = false }, 100)
     }
   }, [sobrietyData.startDate, sobrietyData.showDetailedTime, state.health.sobrietyData, dispatch])

   // Real-time update for detailed time display
   const [currentTime, setCurrentTime] = useState(new Date())
   
   useEffect(() => {
     if (sobrietyData.showDetailedTime && sobrietyData.startDate) {
       const interval = setInterval(() => {
         setCurrentTime(new Date())
       }, 1000)
       return () => clearInterval(interval)
     }
   }, [sobrietyData.showDetailedTime, sobrietyData.startDate])

  const saveCalorieGoal = (newGoal) => {
    updateCalorieGoal(newGoal)
    setLocalCalorieGoal(newGoal)
    setShowCalorieGoalModal(false)
  }

  // Calculator functions
  const calculateBMI = () => {
    if (bmiData.weight <= 0 || bmiData.height <= 0) return 0
    const heightInMeters = bmiData.height / 100
    return bmiData.weight / (heightInMeters * heightInMeters)
  }

  const getBMICategory = () => {
    const bmi = calculateBMI()
    if (bmi < 18.5) return { label: t('health.underweight'), color: 'text-blue-400' }
    if (bmi < 25) return { label: t('health.normalWeight'), color: 'text-green-400' }
    if (bmi < 30) return { label: t('health.overweight'), color: 'text-yellow-400' }
    return { label: t('health.obese'), color: 'text-red-400' }
  }

     const calculateDailyCalories = () => {
     const age = parseFloat(calorieData.age) || 0
     const weight = parseFloat(bmiData.weight) || 0
     const height = parseFloat(bmiData.height) || 0
     
     if (age <= 0 || weight <= 0 || height <= 0) return 0
     
     // BMR calculation using Mifflin-St Jeor Equation
     let bmr = 0
     if (calorieData.gender === 'male') {
       bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
       bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    
    // Activity multipliers
    const activityMultipliers = {
       sedentary: 1.2,
       light: 1.375,
       moderate: 1.55,
       active: 1.725,
       very_active: 1.9
     }
     
     let tdee = bmr * activityMultipliers[calorieData.activity]
     
     // Goal adjustments
     if (calorieData.goal === 'lose') tdee -= 500
     if (calorieData.goal === 'gain') tdee += 500
     
     return Math.round(tdee)
   }

   // Body Fat Calculator (US Navy Method)
  const calculateBodyFat = () => {
     if (bodyFatData.weight <= 0 || bodyFatData.waist <= 0 || bodyFatData.neck <= 0 || bodyFatData.height <= 0) return 0
     
     let bodyFat = 0
     if (bodyFatData.gender === 'male') {
       bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(bodyFatData.waist - bodyFatData.neck) + 0.15456 * Math.log10(bodyFatData.height)) - 450
    } else {
       // For females, we'd need hip measurement too, but keeping it simple for now
       bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(bodyFatData.waist + bodyFatData.neck - bodyFatData.height) + 0.22100 * Math.log10(bodyFatData.height)) - 450
     }
     
     return Math.max(0, Math.min(100, bodyFat))
   }

   const getBodyFatCategory = () => {
     const bodyFat = calculateBodyFat()
     if (bodyFatData.gender === 'male') {
       if (bodyFat < 6) return { label: 'Niezbędna tkanka tłuszczowa', color: 'text-blue-400' }
       if (bodyFat < 14) return { label: 'Sportowiec', color: 'text-green-400' }
       if (bodyFat < 18) return { label: 'Sprawność fizyczna', color: 'text-green-400' }
       if (bodyFat < 25) return { label: 'Przeciętna', color: 'text-yellow-400' }
       return { label: 'Otyłość', color: 'text-red-400' }
    } else {
       if (bodyFat < 14) return { label: 'Niezbędna tkanka tłuszczowa', color: 'text-blue-400' }
       if (bodyFat < 21) return { label: 'Sportowiec', color: 'text-green-400' }
       if (bodyFat < 25) return { label: 'Sprawność fizyczna', color: 'text-green-400' }
       if (bodyFat < 32) return { label: 'Przeciętna', color: 'text-yellow-400' }
       return { label: 'Otyłość', color: 'text-red-400' }
     }
   }

   // Ideal Weight Calculator
  const calculateIdealWeight = () => {
     if (idealWeightData.height <= 0) return 0
     
     let idealWeight = 0
     if (idealWeightData.gender === 'male') {
       idealWeight = 50 + 2.3 * ((idealWeightData.height - 152.4) / 2.54)
    } else {
       idealWeight = 45.5 + 2.3 * ((idealWeightData.height - 152.4) / 2.54)
     }
     
     // Frame adjustments
     const frameMultipliers = { small: 0.9, medium: 1.0, large: 1.1 }
     idealWeight *= frameMultipliers[idealWeightData.frame]
     
     return Math.round(idealWeight)
   }

   // Water Intake Calculator
  const calculateWaterIntake = () => {
     const weight = parseFloat(bmiData.weight) || 0
     if (weight <= 0) return 0
    
     let baseIntake = weight * 0.033 // 33ml per kg
    
     // Activity adjustments
    const activityMultipliers = {
      sedentary: 1.0,
      light: 1.1,
      moderate: 1.2,
      active: 1.3,
      very_active: 1.5
    }
    
     baseIntake *= activityMultipliers[calorieData.activity] || 1.0
     
     // Climate adjustments
     const climateMultipliers = {
       temperate: 1.0,
       hot: 1.2,
       humid: 1.15,
       cold: 0.9
     }
     
     baseIntake *= climateMultipliers[waterIntakeData.climate] || 1.0
     
     return Math.round(baseIntake)
   }

   // Protein Calculator
   const calculateProteinNeeds = () => {
     const weight = parseFloat(bmiData.weight) || 0
     if (weight <= 0) return 0
     
     let proteinMultiplier = 0.8 // Default sedentary
     
     // Activity adjustments
     if (calorieData.activity === 'light') proteinMultiplier = 1.0
     if (calorieData.activity === 'moderate') proteinMultiplier = 1.2
     if (calorieData.activity === 'active') proteinMultiplier = 1.4
     if (calorieData.activity === 'very_active') proteinMultiplier = 1.6
     
     // Goal adjustments
     if (calorieData.goal === 'lose') proteinMultiplier += 0.2
     if (calorieData.goal === 'gain') proteinMultiplier += 0.3
     
     return Math.round(weight * proteinMultiplier)
   }

  // Camera and food scanning functions
  const startCamera = async () => {
    try {
      setCameraError('')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      setCameraError('Camera access denied or not available. Please allow camera access.')
      console.error('Camera error:', error)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return null
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  // Mock food recognition - in a real app, this would use AI/ML services
  const recognizeFood = async (imageData) => {
    setIsScanning(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock food database with common foods
    const mockFoods = [
      { name: '🍎 Jabłko', calories: 95, confidence: 92 },
      { name: '🍌 Banan', calories: 105, confidence: 88 },
      { name: '🥪 Kanapka', calories: 350, confidence: 85 },
      { name: '🍕 Pizza (kawałek)', calories: 285, confidence: 90 },
      { name: '🍔 Hamburger', calories: 540, confidence: 87 },
      { name: '🥗 Sałatka', calories: 150, confidence: 83 },
      { name: '🍝 Spaghetti', calories: 220, confidence: 89 },
      { name: '🍗 Kurczak grillowany', calories: 180, confidence: 91 },
      { name: '🥙 Kebab', calories: 450, confidence: 86 },
      { name: '🍞 Chleb (kromka)', calories: 80, confidence: 84 },
      { name: '🥐 Croissant', calories: 230, confidence: 88 },
      { name: '🍳 Jajecznica', calories: 200, confidence: 89 },
      { name: '🥛 Mleko (szklanka)', calories: 150, confidence: 85 },
      { name: '☕ Kawa z mlekiem', calories: 50, confidence: 82 },
      { name: '🧀 Ser żółty (plasterek)', calories: 110, confidence: 87 }
    ]
    
    // Randomly select a food item (in real app, this would be AI recognition)
    const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)]
    
    setIsScanning(false)
    return randomFood
  }

  const handleFoodScan = async () => {
    const imageData = capturePhoto()
    if (!imageData) return
    
    try {
      const result = await recognizeFood(imageData)
      setScanResult({
        ...result,
        image: imageData,
        time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
      })
    } catch (error) {
      setCameraError('Failed to analyze food. Please try again.')
      console.error('Food recognition error:', error)
    }
  }

  const addScannedFood = () => {
    if (!scanResult) return
    
    const foodItem = {
      name: scanResult.name,
      calories: scanResult.calories,
      time: scanResult.time,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      scanned: true,
      confidence: scanResult.confidence
    }
    
    addFoodToLog(foodItem)
    
    // Update health state
    const currentCalories = state.health?.caloriesConsumed || 0
    updateHealth({ caloriesConsumed: currentCalories + scanResult.calories })
    
    // Close modal and reset
    setShowCameraModal(false)
    setScanResult(null)
    stopCamera()
  }

  const closeCameraModal = () => {
    setShowCameraModal(false)
    setScanResult(null)
    setCameraError('')
    stopCamera()
  }

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Food log functions
  const addFoodItem = () => {
    if (!newFood.name || newFood.calories <= 0) return
    
    const foodItem = {
      ...newFood,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }
    
    addFoodToLog(foodItem)
    setNewFood({ name: '', calories: 0, time: '12:00' })
    
    // Update health state
    const currentCalories = state.health?.caloriesConsumed || 0
    updateHealth({ caloriesConsumed: currentCalories + newFood.calories })
  }

  const removeFoodItem = (index) => {
    const removedFood = dailyFoodLog[index]
    removeFoodFromLog(removedFood.id)
    
    // Update health state
    const currentCalories = state.health?.caloriesConsumed || 0
    updateHealth({ caloriesConsumed: Math.max(0, currentCalories - removedFood.calories) })
  }


     // Sobriety functions
   const calculateSobrietyDays = () => {
     if (!sobrietyData.startDate) return 0
     const startDate = new Date(sobrietyData.startDate)
     const today = new Date()
     const diffTime = Math.abs(today - startDate)
     return Math.floor(diffTime / (1000 * 60 * 60 * 24))
   }

   const calculateDetailedTime = () => {
     if (!sobrietyData.startDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
     const startDate = new Date(sobrietyData.startDate)
     const diffTime = Math.abs(currentTime - startDate)
     
     const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
     const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
     const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
     const seconds = Math.floor((diffTime % (1000 * 60)) / 1000)
     
     return { days, hours, minutes, seconds }
   }

  const sobrietyDays = calculateSobrietyDays()

  const startSobrietyJourney = () => {
    const today = new Date().toISOString()
    setSobrietyData({ ...sobrietyData, startDate: today })
  }

  const updateSobrietyData = (updates) => {
    setSobrietyData({ ...sobrietyData, ...updates })
  }

     const resetSobrietyJourney = () => {
     setSobrietyData({ startDate: null, showDetailedTime: false })
     setShowResetConfirm(false)
   }

     const toggleDetailedTime = () => {
    setSobrietyData({ ...sobrietyData, showDetailedTime: !sobrietyData.showDetailedTime })
  }

  // Health database for accurate calculations
  const healthDatabase = {
    bmiCategories: {
      underweight: { min: 0, max: 18.4, label: 'Niedowaga', color: 'text-blue-400', risk: 'Niskie ryzyko chorób, ale możliwy niedobór składników odżywczych', recommendation: 'Skonsultuj się z dietetykiem w celu zwiększenia masy ciała' },
      normal: { min: 18.5, max: 24.9, label: 'Prawidłowa waga', color: 'text-green-400', risk: 'Optymalne zdrowie', recommendation: 'Utrzymuj obecny styl życia i dietę' },
      overweight: { min: 25, max: 29.9, label: 'Nadwaga', color: 'text-yellow-400', risk: 'Zwiększone ryzyko chorób sercowo-naczyniowych', recommendation: 'Zwiększ aktywność fizyczną i zmniejsz spożycie kalorii' },
      obese: { min: 30, max: 100, label: 'Otyłość', color: 'text-red-400', risk: 'Wysokie ryzyko chorób przewlekłych', recommendation: 'Skonsultuj się z lekarzem w celu opracowania planu odchudzania' }
    },
    bodyFatRanges: {
      male: {
        essential: { min: 0, max: 5, label: 'Niezbędna tkanka tłuszczowa', color: 'text-blue-400', health: 'Minimalna ilość tłuszczu potrzebna do funkcjonowania organizmu' },
        athlete: { min: 6, max: 13, label: 'Sportowiec', color: 'text-green-400', health: 'Optymalny poziom dla sportowców wytrzymałościowych' },
        fitness: { min: 14, max: 17, label: 'Sprawność fizyczna', color: 'text-green-400', health: 'Dobry poziom dla ogólnej sprawności' },
        average: { min: 18, max: 24, label: 'Przeciętna', color: 'text-yellow-400', health: 'Akceptowalny poziom, ale można poprawić' },
        obese: { min: 25, max: 100, label: 'Otyłość', color: 'text-red-400', health: 'Zwiększone ryzyko chorób metabolicznych' }
      },
      female: {
        essential: { min: 0, max: 13, label: 'Niezbędna tkanka tłuszczowa', color: 'text-blue-400', health: 'Minimalna ilość tłuszczu potrzebna do funkcjonowania organizmu' },
        athlete: { min: 14, max: 20, label: 'Sportowiec', color: 'text-green-400', health: 'Optymalny poziom dla sportowców wytrzymałościowych' },
        fitness: { min: 21, max: 24, label: 'Sprawność fizyczna', color: 'text-green-400', health: 'Dobry poziom dla ogólnej sprawności' },
        average: { min: 25, max: 31, label: 'Przeciętna', color: 'text-yellow-400', health: 'Akceptowalny poziom, ale można poprawić' },
        obese: { min: 32, max: 100, label: 'Otyłość', color: 'text-red-400', health: 'Zwiększone ryzyko chorób metabolicznych' }
      }
    },
    activityLevels: {
      sedentary: { multiplier: 1.2, description: 'Brak aktywności fizycznej, praca siedząca', calories: 'BMR × 1.2' },
      light: { multiplier: 1.375, description: 'Lekkie ćwiczenia 1-3 dni w tygodniu', calories: 'BMR × 1.375' },
      moderate: { multiplier: 1.55, description: 'Umiarkowane ćwiczenia 3-5 dni w tygodniu', calories: 'BMR × 1.55' },
      active: { multiplier: 1.725, description: 'Intensywne ćwiczenia 6-7 dni w tygodniu', calories: 'BMR × 1.725' },
      very_active: { multiplier: 1.9, description: 'Bardzo intensywne ćwiczenia, praca fizyczna', calories: 'BMR × 1.9' }
    },
    proteinNeeds: {
      sedentary: { multiplier: 0.8, description: 'Minimalne zapotrzebowanie' },
      light: { multiplier: 1.0, description: 'Lekka aktywność' },
      moderate: { multiplier: 1.2, description: 'Umiarkowana aktywność' },
      active: { multiplier: 1.4, description: 'Aktywny tryb życia' },
      very_active: { multiplier: 1.6, description: 'Bardzo aktywny tryb życia' }
    },
    waterIntakeFactors: {
      activity: {
        sedentary: 1.0,
        light: 1.1,
        moderate: 1.2,
        active: 1.3,
        very_active: 1.5
      },
      climate: {
        temperate: 1.0,
        hot: 1.2,
        humid: 1.15,
        cold: 0.9
      }
    }
  }

  return (
    <div className="space-y-8 p-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Zdrowie i Odżywianie</h1>
        <p className="text-gray-400">Monitoruj swoje zdrowie i styl życia</p>
      </div>

      {/* Health Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-4 text-center hover:scale-105 transition-all duration-300">
          <div className="text-2xl mb-2">🔥</div>
          <div className="text-xl font-bold text-blue-400">{state.health?.caloriesConsumed || 0} / {calorieGoal}</div>
          <div className="text-sm text-gray-300">Kalorie</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-4 text-center hover:scale-105 transition-all duration-300">
          <div className="text-2xl mb-2">🍎</div>
          <div className="text-xl font-bold text-green-400">{dailyFoodLog.length}</div>
          <div className="text-sm text-gray-300">Posiłki dzisiaj</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-800 rounded-xl p-1 inline-flex flex-wrap justify-center max-w-full">
                               {[
            { id: 'overview', label: t('health.overview'), icon: Heart },
            { id: 'calculator', label: t('health.calculator'), icon: Calculator },
            { id: 'food', label: t('health.todayFood'), icon: Camera },
            { id: 'sobriety', label: t('health.sobriety'), icon: Award }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === id 
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative overflow-hidden">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeInUp">
            {/* Daily Health Summary */}
            <div className="card text-center">
             <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center justify-center gap-2">
               <Heart className="w-5 h-5 text-red-500" />
               {t('health.dailySummary')}
             </h3>
             
             <div className="space-y-4">
               <div className="grid grid-cols-3 gap-4">
                 <div className="text-center">
                   <div className="text-2xl font-bold text-blue-400">{dailyFoodLog.length}</div>
                   <div className="text-sm text-gray-400">Posiłki</div>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-green-400">
                    {Math.round(((state.health?.caloriesConsumed || 0) / calorieGoal) * 100)}%
                   </div>
                   <div className="text-sm text-gray-400">Kalorie</div>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-orange-400">
                     {Math.round(((state.health?.weeklyExerciseMinutes || 0) / 150) * 100)}%
                   </div>
                   <div className="text-sm text-gray-400">Ćwiczenia</div>
                 </div>
               </div>
               
               <div className="text-xs text-gray-500">
                 {dailyFoodLog.length === 0 && "Dodaj pierwszy posiłek"}
                 {dailyFoodLog.length > 0 && dailyFoodLog.length < 3 && "Dodaj więcej posiłków"}
                 {dailyFoodLog.length >= 3 && "Świetnie! Regularne posiłki"}
               </div>
             </div>
           </div>

          {/* Health Summary Widget */}
          <div className="card bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30">
            <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              📈 Podsumowanie zdrowia
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-400">
                  {Math.round(((state.health?.caloriesConsumed || 0) / calorieGoal) * 100)}%
                       </div>
                <div className="text-xs text-gray-400">Cel kaloryczny</div>
                     </div>
              
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {dailyFoodLog.length}
                   </div>
                <div className="text-xs text-gray-400">Posiłki dzisiaj</div>
               </div>
              
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">
                  {Math.round(((state.health?.weeklyExerciseMinutes || 0) / 150) * 100)}%
                 </div>
                <div className="text-xs text-gray-400">Ćwiczenia</div>
                  </div>
              
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {state.health?.waterIntake || 0}/8
                   </div>
                <div className="text-xs text-gray-400">Szklanki wody</div>
              </div>
               </div>
               </div>
               
          {/* Nutrition Tips */}
          <div className="card bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              💡 Wskazówki żywieniowe
            </h3>
               <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <p className="text-gray-400 text-sm">Jedz regularnie 3-5 posiłków dziennie dla lepszego metabolizmu</p>
                 </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <p className="text-gray-400 text-sm">Pij minimum 2L wody dziennie dla lepszego trawienia</p>
                   </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <p className="text-gray-400 text-sm">Dodaj warzywa do każdego posiłku dla witamin i błonnika</p>
               </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <p className="text-gray-400 text-sm">Wybieraj pełnoziarniste produkty zamiast rafinowanych</p>
             </div>
           </div>
          </div>

        </div>
      )}

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="space-y-6 animate-fadeInUp">
            {/* Simple Unified Data Input */}
          <div className="card bg-gradient-to-r from-violet-900/20 to-purple-900/20 border border-violet-500/30">
            <h3 className="text-lg font-semibold text-violet-400 mb-4 flex items-center gap-2">
              👤 {t('health.enterYourData')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('health.weight')} (kg)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-violet-500"
                  placeholder="70"
                  value={bmiData.weight}
                  onChange={(e) => {
                    const weight = e.target.value
                    setBmiData({...bmiData, weight})
                    setCalorieData({...calorieData, weight})
                    setBodyFatData({...bodyFatData, weight})
                    setWaterIntakeData({...waterIntakeData, weight})
                    setProteinData({...proteinData, weight})
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('health.height')} (cm)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-violet-500"
                  placeholder="170"
                  value={bmiData.height}
                  onChange={(e) => {
                    const height = e.target.value
                    setBmiData({...bmiData, height})
                    setCalorieData({...calorieData, height})
                    setBodyFatData({...bodyFatData, height})
                    setIdealWeightData({...idealWeightData, height})
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('health.age')}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-violet-500"
                  placeholder="25"
                  value={calorieData.age}
                  onChange={(e) => setCalorieData({...calorieData, age: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Płeć</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-violet-500"
                  value={calorieData.gender}
                  onChange={(e) => {
                    const gender = e.target.value
                    setCalorieData({...calorieData, gender})
                    setBodyFatData({...bodyFatData, gender})
                    setIdealWeightData({...idealWeightData, gender})
                  }}
                >
                  <option value="male">{t('health.male')}</option>
                  <option value="female">{t('health.female')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Aktywność</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-violet-500"
                  value={calorieData.activity}
                  onChange={(e) => {
                    const activity = e.target.value
                    setCalorieData({...calorieData, activity})
                    setWaterIntakeData({...waterIntakeData, activity})
                    setProteinData({...proteinData, activity})
                  }}
                >
                  <option value="sedentary">{t('health.sedentary')}</option>
                  <option value="light">{t('health.light')}</option>
                  <option value="moderate">{t('health.moderate')}</option>
                  <option value="active">{t('health.active')}</option>
                  <option value="very_active">{t('health.veryActive')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('health.goal')}</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-violet-500"
                  value={calorieData.goal}
                  onChange={(e) => {
                    const goal = e.target.value
                    setCalorieData({...calorieData, goal})
                    setProteinData({...proteinData, goal})
                  }}
                >
                  <option value="maintain">Utrzymanie wagi</option>
                  <option value="lose">Utrata wagi</option>
                  <option value="gain">Przyrost wagi</option>
                </select>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
              <div className="text-sm text-gray-300 mb-2">
                <strong>💡 Wskazówka:</strong> Wprowadź swoje dane raz, a wszystkie kalkulatory automatycznie pokażą wyniki!
              </div>
              <div className="text-sm text-gray-400">
                Wszystkie kalkulatory używają tych samych danych.
              </div>
            </div>
          </div>

          {/* Calorie Goal Setting */}
          <div className="card bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/30">
            <h3 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center gap-2">
              🎯 Ustaw cel kaloryczny
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Aktualny cel</label>
                  <div className="text-2xl font-bold text-indigo-400">{calorieGoal} kcal</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Dzisiejsze spożycie</label>
                  <div className="text-2xl font-bold text-green-400">{state.health?.caloriesConsumed || 0} kcal</div>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(((state.health?.caloriesConsumed || 0) / calorieGoal) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCalorieGoalModal(true)}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Zmień cel
                </button>
                <button
                  onClick={() => {
                    const calculatedCalories = calculateDailyCalories()
                    if (calculatedCalories > 0) {
                      updateCalorieGoal(calculatedCalories)
                      setLocalCalorieGoal(calculatedCalories)
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Użyj z kalkulatora
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          {bmiData.weight && bmiData.height && calorieData.age && (
            <div className="space-y-6">
              {/* BMI Results */}
              <div className="card bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  📊 BMI
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {(parseFloat(bmiData.weight) / ((parseFloat(bmiData.height) / 100) * (parseFloat(bmiData.height) / 100))).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-400">Wskaźnik masy ciała</div>
                </div>
              </div>

              {/* Calorie Results */}
              <div className="card bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30">
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                  🔥 Dzienne zapotrzebowanie kaloryczne
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {calculateDailyCalories()} kcal
                  </div>
                  <div className="text-sm text-gray-400">TDEE (Total Daily Energy Expenditure)</div>
                </div>
              </div>

              {/* Water Intake Results */}
              <div className="card bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  💧 Dzienne zapotrzebowanie na wodę
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">
                    {calculateWaterIntake()} L
                  </div>
                  <div className="text-sm text-gray-400">Zalecane dzienne spożycie</div>
                </div>
              </div>

              {/* Protein Results */}
              <div className="card bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30">
                <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                  🥩 Dzienne zapotrzebowanie na białko
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {calculateProteinNeeds()} g
                  </div>
                  <div className="text-sm text-gray-400">Zalecane dzienne spożycie</div>
                </div>
              </div>

              {/* Personalized Insights & Recommendations */}
              <div className="card bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
                <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                  💡 Spersonalizowane wskazówki i zalecenia
                </h3>
                <div className="space-y-4">
                  {/* BMI Analysis */}
                  {(() => {
                    const bmi = parseFloat(bmiData.weight) / ((parseFloat(bmiData.height) / 100) * (parseFloat(bmiData.height) / 100))
                    if (isNaN(bmi)) return null
                    
                    const category = Object.entries(healthDatabase.bmiCategories).find(([key, range]) => 
                      bmi >= range.min && bmi <= range.max
                    )
                    
                    if (category) {
                      const [key, data] = category
                      return (
                        <div className="p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">📊</span>
                            <span className="font-semibold text-purple-300">Analiza BMI</span>
                          </div>
                          <div className="text-sm text-gray-300 mb-2">
                            <strong>Twój BMI:</strong> {bmi.toFixed(1)} - {data.label}
                          </div>
                          <div className="text-sm text-gray-400 mb-2">
                            <strong>Ryzyko zdrowotne:</strong> {data.risk}
                          </div>
                          <div className="text-sm text-gray-400">
                            <strong>Zalecenie:</strong> {data.recommendation}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}

                  {/* Activity Level Insights */}
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🏃‍♂️</span>
                      <span className="font-semibold text-purple-300">Poziom aktywności</span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      <strong>Twój poziom:</strong> {healthDatabase.activityLevels[calorieData.activity]?.description || 'Nieznany'}
                    </div>
                    <div className="text-sm text-gray-400">
                      <strong>Wskazówka:</strong> {(() => {
                        switch(calorieData.activity) {
                          case 'sedentary': return 'Rozważ zwiększenie aktywności fizycznej do 150 minut tygodniowo'
                          case 'light': return 'Świetnie! Możesz dodać 2-3 treningi siłowe tygodniowo'
                          case 'moderate': return 'Doskonały poziom aktywności! Utrzymuj obecny tryb życia'
                          case 'active': return 'Bardzo aktywny styl życia! Pamiętaj o odpowiedniej regeneracji'
                          case 'very_active': return 'Ekstremalnie aktywny! Upewnij się, że dostarczasz wystarczającą ilość kalorii'
                          default: return 'Wybierz odpowiedni poziom aktywności dla dokładniejszych obliczeń'
                        }
                      })()}
                    </div>
                  </div>

                  {/* Goal-Specific Recommendations */}
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🎯</span>
                      <span className="font-semibold text-purple-300">Zalecenia dla Twojego celu</span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      <strong>Twój cel:</strong> {(() => {
                        switch(calorieData.goal) {
                          case 'maintain': return 'Utrzymanie wagi'
                          case 'lose': return 'Utrata wagi'
                          case 'gain': return 'Przyrost wagi'
                          default: return 'Nieznany'
                        }
                      })()}
                    </div>
                    <div className="text-sm text-gray-400">
                      <strong>Strategia:</strong> {(() => {
                        switch(calorieData.goal) {
                          case 'maintain': return 'Utrzymuj zrównoważoną dietę i regularną aktywność fizyczną'
                          case 'lose': return 'Stwórz deficyt kaloryczny 300-500 kcal dziennie, skup się na białku'
                          case 'gain': return 'Dodaj 300-500 kcal dziennie, zwiększ spożycie białka i węglowodanów'
                          default: return 'Wybierz cel dla spersonalizowanych zaleceń'
                        }
                      })()}
                    </div>
                  </div>

                  {/* Water Intake Tips */}
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💧</span>
                      <span className="font-semibold text-purple-300">Wskazówki dotyczące nawodnienia</span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>• Pij wodę regularnie przez cały dzień</div>
                      <div>• Dodaj szklankę wody na każdą godzinę aktywności</div>
                      <div>• Monitoruj kolor moczu - powinien być jasnożółty</div>
                      <div>• Pij więcej w gorące dni i podczas ćwiczeń</div>
                    </div>
                  </div>

                  {/* Protein Sources */}
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🥩</span>
                      <span className="font-semibold text-purple-300">Dobre źródła białka</span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>• Mięso: kurczak, indyk, wołowina, wieprzowina</div>
                      <div>• Ryby: łosoś, tuńczyk, makrela, sardynki</div>
                      <div>• Nabiał: jaja, jogurt, twaróg, ser</div>
                      <div>• Roślinne: fasola, soczewica, tofu, orzechy</div>
                    </div>
                  </div>

                  {/* General Health Tips */}
                  <div className="p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">❤️</span>
                      <span className="font-semibold text-purple-300">Ogólne wskazówki zdrowotne</span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>• Śpij 7-9 godzin dziennie</div>
                      <div>• Jedz regularnie co 3-4 godziny</div>
                      <div>• Włącz do diety warzywa i owoce</div>
                      <div>• Ogranicz przetworzoną żywność</div>
                      <div>• Regularnie ćwicz i ruszaj się</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
        {/* Food Log Tab */}
        {activeTab === 'food' && (
          <div className="space-y-6 animate-fadeInUp">
            {/* Add Food Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera Scan Option */}
            <div className="card bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                📷 Skanuj jedzenie
              </h3>
              <div className="text-center space-y-4">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400 text-sm mb-4">
                  Skieruj kamerę na jedzenie, a automatycznie rozpoznamy kalorie
                </p>
                <button
                  onClick={() => {
                    setShowCameraModal(true)
                    startCamera()
                  }}
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Camera className="w-5 h-5" />
                  Rozpocznij skanowanie
                </button>
                <div className="text-xs text-gray-500">
                  💡 Wskaż kamerę na jedzenie i naciśnij przycisk skanowania
                </div>
              </div>
            </div>

            {/* Manual Add Option */}
            <div className="card bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                ✍️ Dodaj ręcznie
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nazwa posiłku</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-green-500"
                    placeholder="np. Śniadanie - Owsianka z bananem"
                    value={newFood.name}
                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Kalorie</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-green-500"
                      placeholder="350"
                      value={newFood.calories}
                      onChange={(e) => setNewFood({...newFood, calories: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Czas</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-green-500"
                      value={newFood.time}
                      onChange={(e) => setNewFood({...newFood, time: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  onClick={addFoodItem}
                  disabled={!newFood.name || newFood.calories <= 0}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Dodaj posiłek
                </button>
              </div>
            </div>
          </div>

          {/* Today's Food Log */}
          <div className="card bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              📅 Dzisiejsze posiłki
            </h3>
            {dailyFoodLog.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🍽️</div>
                <p className="text-gray-400">Brak posiłków na dziś</p>
                <p className="text-gray-500 text-sm">Dodaj swój pierwszy posiłek!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dailyFoodLog.map((food, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    food.scanned ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-gray-800/50'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-100">{food.name}</div>
                        {food.scanned && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                            📷 Skanowane
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{food.time}</span>
                        {food.scanned && food.confidence && (
                          <span className="text-purple-400">
                            • Pewność: {food.confidence}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-green-400">{food.calories} kcal</div>
                      </div>
                      <button
                        onClick={() => removeFoodItem(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
           </div>

          {/* Daily Summary */}
          {dailyFoodLog.length > 0 && (
            <div className="card bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                📊 Podsumowanie dnia
             </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{dailyFoodLog.length}</div>
                  <div className="text-sm text-gray-400">Posiłki</div>
                 </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {dailyFoodLog.reduce((sum, food) => sum + food.calories, 0)}
               </div>
                  <div className="text-sm text-gray-400">Kalorie</div>
                </div>
                <div className="text-center">
                 <div className="text-2xl font-bold text-blue-400">
                    {Math.round((dailyFoodLog.reduce((sum, food) => sum + food.calories, 0) / calorieGoal) * 100)}%
                 </div>
                  <div className="text-sm text-gray-400">Cel</div>
               </div>
              </div>
            </div>
          )}
        </div>
      )}


        {/* Sobriety Tab */}
        {activeTab === 'sobriety' && (
          <div className="space-y-6 animate-fadeInUp">
            {/* Sobriety Tracker */}
           <div className="card bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 relative">
             <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
               🎯 Licznik trzeźwości
             </h3>
             {sobrietyData.startDate && (
               <div className="absolute top-4 right-4">
                 <button
                   onClick={() => setShowSobrietyDropdown(!showSobrietyDropdown)}
                   className="p-2 text-green-400 hover:text-green-300 transition-colors"
                 >
                   <ChevronDown className={`w-5 h-5 transition-transform ${showSobrietyDropdown ? 'rotate-180' : ''}`} />
                 </button>
                                   {showSobrietyDropdown && (
                    <div className="absolute top-10 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[140px]">
                      <button
                        onClick={toggleDetailedTime}
                        className="w-full px-4 py-2 text-left text-blue-400 hover:bg-gray-700 rounded-t-lg transition-colors border-b border-gray-600"
                      >
                        {sobrietyData.showDetailedTime ? 'Pokaż dni' : 'Szczegółowy czas'}
                      </button>
                      <button
                        onClick={() => {
                          setShowResetConfirm(true)
                          setShowSobrietyDropdown(false)
                        }}
                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 rounded-b-lg transition-colors"
                      >
                        Resetuj
                      </button>
                    </div>
                  )}
               </div>
             )}
             <div className="text-center space-y-4">
               {sobrietyData.showDetailedTime ? (
                 <div>
                   <div className="text-2xl font-bold text-green-400 mb-2">
                     {(() => {
                       const detailed = calculateDetailedTime()
                       return `${detailed.days}d ${detailed.hours}h ${detailed.minutes}m ${detailed.seconds}s`
                     })()}
                   </div>
                   <div className="text-sm text-gray-400">Szczegółowy czas</div>
                 </div>
               ) : (
                 <div>
                   <div className="text-4xl font-bold text-green-400">
                     {calculateSobrietyDays()} dni
                   </div>
                   <div className="text-sm text-gray-400">Dni trzeźwości</div>
                 </div>
               )}
               <div className="text-gray-400">
                 {sobrietyData.startDate ? 
                   `Od ${new Date(sobrietyData.startDate).toLocaleDateString('pl-PL')}` : 
                   'Nie ustawiono daty rozpoczęcia'
                 }
               </div>
               {!sobrietyData.startDate && (
                 <button
                   onClick={startSobrietyJourney}
                   className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                 >
                   Rozpocznij podróż
                 </button>
               )}
             </div>
           </div>

          {/* Milestones */}
          <div className="card bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              🏆 Kamienie milowe
             </h3>
             <div className="space-y-3">
              {sobrietyMilestones.map((milestone, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  sobrietyDays >= milestone.days ? 'bg-green-900/30 border border-green-500/50' : 'bg-gray-800/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl ${sobrietyDays >= milestone.days ? 'text-green-400' : 'text-gray-500'}`}>
                      {milestone.icon}
               </div>
                    <div>
                      <div className={`font-medium ${sobrietyDays >= milestone.days ? 'text-green-300' : 'text-gray-400'}`}>
                        {milestone.title}
               </div>
                      <div className="text-sm text-gray-500">{milestone.days} dni</div>
               </div>
               </div>
                  <div className={`text-right ${sobrietyDays >= milestone.days ? 'text-green-400' : 'text-gray-500'}`}>
                    {sobrietyDays >= milestone.days ? '✅' : '⏳'}
                  </div>
                </div>
              ))}
            </div>
                     </div>

           {/* Health Benefits */}
          <div className="card bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30">
            <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
              ❤️ Korzyści zdrowotne
            </h3>
            <div className="space-y-3">
              {healthBenefits.map((benefit, index) => (
                <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                  sobrietyDays >= benefit.days ? 'bg-orange-900/30 border border-orange-500/50' : 'bg-gray-800/50'
                }`}>
                  <div className={`text-lg ${sobrietyDays >= benefit.days ? 'text-orange-400' : 'text-gray-500'}`}>
                    {benefit.icon}
                  </div>
                  <div>
                    <div className={`font-medium ${sobrietyDays >= benefit.days ? 'text-orange-300' : 'text-gray-400'}`}>
                      {benefit.title}
                    </div>
                    <div className="text-sm text-gray-500">{benefit.description}</div>
                  </div>
                </div>
              ))}
             </div>
           </div>
        </div>
      )}

       {/* Reset Confirmation Modal */}
       {showResetConfirm && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6">
             <h3 className="text-lg font-semibold text-gray-100 mb-4">Potwierdź reset</h3>
             <p className="text-gray-400 mb-6">
               Czy na pewno chcesz zresetować licznik trzeźwości? Ta akcja nie może być cofnięta.
             </p>
             <div className="flex gap-3">
               <button
                 onClick={resetSobrietyJourney}
                 className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
               >
                 Tak, resetuj
               </button>
               <button
                 onClick={() => setShowResetConfirm(false)}
                 className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
               >
                 Anuluj
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Calorie Goal Modal */}
       {showCalorieGoalModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6">
             <h3 className="text-lg font-semibold text-gray-100 mb-4">Ustaw cel kaloryczny</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-400 mb-2">
                   Ile kalorii chcesz spożywać dziennie?
                 </label>
                 <input
                   type="number"
                   min="1000"
                   max="5000"
                   step="50"
                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                   placeholder="2000"
                   value={localCalorieGoal}
                   onChange={(e) => setLocalCalorieGoal(parseInt(e.target.value) || 2000)}
                 />
                 <p className="text-xs text-gray-500 mt-2">
                   Zakres: 1000-5000 kcal dziennie
                 </p>
               </div>
              
              {/* Quick Goal Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Szybkie cele:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setLocalCalorieGoal(1500)}
                    className="p-2 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                  >
                    1500 kcal
                  </button>
                  <button
                    onClick={() => setLocalCalorieGoal(2000)}
                    className="p-2 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                  >
                    2000 kcal
                  </button>
                  <button
                    onClick={() => setLocalCalorieGoal(2500)}
                    className="p-2 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                  >
                    2500 kcal
                  </button>
                </div>
              </div>
              
               <div className="flex gap-3">
                 <button
                  onClick={() => saveCalorieGoal(localCalorieGoal)}
                   className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                 >
                   Zapisz cel
                 </button>
                 <button
                   onClick={() => setShowCalorieGoalModal(false)}
                   className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                 >
                   Anuluj
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Camera Scanning Modal */}
       {showCameraModal && (
         <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
           <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
             {/* Modal Header */}
             <div className="flex items-center justify-between p-4 border-b border-gray-700">
               <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                 <Camera className="w-5 h-5 text-purple-400" />
                 Skanuj jedzenie
               </h3>
               <button
                 onClick={closeCameraModal}
                 className="text-gray-400 hover:text-gray-200 text-xl"
               >
                 ✕
               </button>
             </div>

             {/* Camera Content */}
             <div className="p-4 space-y-4">
               {cameraError ? (
                 <div className="text-center space-y-4">
                   <div className="text-4xl">❌</div>
                   <div className="text-red-400 text-sm">{cameraError}</div>
                   <button
                     onClick={startCamera}
                     className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                   >
                     Spróbuj ponownie
                   </button>
                 </div>
               ) : scanResult ? (
                 <div className="text-center space-y-4">
                   {/* Scan Result */}
                   <div className="space-y-4">
                     <div className="text-4xl">✅</div>
                     <div>
                       <h4 className="text-lg font-semibold text-purple-400 mb-2">Rozpoznano jedzenie!</h4>
                       <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                         <div className="text-xl font-bold text-gray-100">{scanResult.name}</div>
                         <div className="text-lg text-green-400">{scanResult.calories} kcal</div>
                         <div className="text-sm text-purple-400">Pewność: {scanResult.confidence}%</div>
                         <div className="text-sm text-gray-400">Czas: {scanResult.time}</div>
                       </div>
                     </div>
                     {scanResult.image && (
                       <div className="w-full max-w-xs mx-auto">
                         <img 
                           src={scanResult.image} 
                           alt="Scanned food" 
                           className="w-full h-32 object-cover rounded-lg border border-gray-600"
                         />
                       </div>
                     )}
                     <div className="flex gap-3">
                       <button
                         onClick={addScannedFood}
                         className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                       >
                         Dodaj do dziennika
                       </button>
                       <button
                         onClick={() => {
                           setScanResult(null)
                           setCameraError('')
                         }}
                         className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                       >
                         Skanuj ponownie
                       </button>
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="text-center space-y-4">
                   {/* Camera View */}
                   <div className="relative">
                     <video
                       ref={videoRef}
                       autoPlay
                       playsInline
                       muted
                       className="w-full h-64 object-cover rounded-lg bg-gray-700"
                       style={{ transform: 'scaleX(-1)' }} // Mirror effect
                     />
                     <canvas
                       ref={canvasRef}
                       className="hidden"
                     />
                     
                     {/* Camera overlay */}
                     <div className="absolute inset-0 border-2 border-purple-500/30 rounded-lg">
                       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                         <div className="w-32 h-32 border-2 border-purple-400 rounded-lg"></div>
                       </div>
                     </div>
                   </div>

                   {/* Instructions */}
                   <div className="text-sm text-gray-400 space-y-2">
                     <div>📱 Skieruj kamerę na jedzenie</div>
                     <div>🎯 Umieść jedzenie w ramce</div>
                     <div>📸 Naciśnij przycisk skanowania</div>
                   </div>

                   {/* Scan Button */}
                   <button
                     onClick={handleFoodScan}
                     disabled={isScanning || !cameraStream}
                     className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                   >
                     {isScanning ? (
                       <>
                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                         Analizuję jedzenie...
                       </>
                     ) : (
                       <>
                         <Camera className="w-5 h-5" />
                         Skanuj jedzenie
                       </>
                     )}
                   </button>

                   {/* Tips */}
                   <div className="text-xs text-gray-500 bg-gray-700/50 p-3 rounded-lg">
                     💡 <strong>Wskazówki:</strong> Upewnij się, że jedzenie jest dobrze oświetlone i widoczne. 
                     Aplikacja automatycznie rozpozna rodzaj jedzenia i obliczy kalorie.
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>
       )}
      </div>
     </div>
   )
 }


