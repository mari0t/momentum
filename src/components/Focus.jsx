import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, MessageCircle, Shield, Bell, Clock, Smartphone, Monitor, Gamepad2, Video, Music, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'

export default function Focus() {
  const { state, dispatch, deleteFocusSession } = useApp()
  const { t } = useTranslation()
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes default
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [customMinutes, setCustomMinutes] = useState(25)
  const [showTimerPicker, setShowTimerPicker] = useState(false)
  const intervalRef = useRef(null)

  // Stopwatch method states
  const [stopwatchMode, setStopwatchMode] = useState(false)
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const [stopwatchInterval, setStopwatchInterval] = useState(null)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [lastSessionTime, setLastSessionTime] = useState(0)
  const [showSessionFeedback, setShowSessionFeedback] = useState(false)

  // Do Not Disturb and App Blocking states
  const [doNotDisturb, setDoNotDisturb] = useState(false)
  const [showAppBlocking, setShowAppBlocking] = useState(false)
  const [appBlockingActive, setAppBlockingActive] = useState(false)
  const [blockedApps, setBlockedApps] = useState({
    social: true,
    entertainment: true,
    games: false,
    news: false,
    shopping: false
  })
  const [blockingSchedule, setBlockingSchedule] = useState({
    enabled: false,
    startTime: '09:00',
    endTime: '17:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  })
  const [blockingMode, setBlockingMode] = useState('strict') // strict, gentle, custom

  // App Categories with Icons and Examples
  const appCategories = [
    {
      id: 'social',
      name: 'Social Media',
      icon: MessageCircle,
      description: 'Facebook, Instagram, Twitter, TikTok',
      apps: ['Facebook', 'Instagram', 'Twitter', 'TikTok', 'Snapchat', 'LinkedIn'],
      color: 'text-blue-400'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: Video,
      description: 'YouTube, Netflix, Spotify, Twitch',
      apps: ['YouTube', 'Netflix', 'Spotify', 'Twitch', 'Hulu', 'Disney+'],
      color: 'text-purple-400'
    },
    {
      id: 'games',
      name: 'Games',
      icon: Gamepad2,
      description: 'Mobile games, Steam, Console games',
      apps: ['Candy Crush', 'PUBG', 'Fortnite', 'Steam', 'Discord'],
      color: 'text-green-400'
    },
    {
      id: 'news',
      name: 'News & Media',
      icon: Monitor,
      description: 'News apps, RSS readers, Blogs',
      apps: ['CNN', 'BBC', 'Reddit', 'Medium', 'Flipboard'],
      color: 'text-orange-400'
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: Smartphone,
      description: 'Amazon, eBay, Online stores',
      apps: ['Amazon', 'eBay', 'Shopify', 'Wish', 'AliExpress'],
      color: 'text-red-400'
    }
  ]

  // Device App Scanning
  const [deviceApps, setDeviceApps] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  // Scan device for installed apps
  const scanDeviceApps = async () => {
    setIsScanning(true)
    setScanProgress(0)
    
    // Simulate app scanning with progress
    const simulateScan = () => {
      return new Promise((resolve) => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 20
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            resolve()
          }
          setScanProgress(Math.min(progress, 100))
        }, 100)
      })
    }

    await simulateScan()
    
    // Simulate found apps (in real implementation, this would use device APIs)
    const foundApps = [
      { id: 'facebook', name: 'Facebook', category: 'social', icon: '📘', size: '156MB' },
      { id: 'instagram', name: 'Instagram', category: 'social', icon: '📷', size: '89MB' },
      { id: 'youtube', name: 'YouTube', category: 'entertainment', icon: '📺', size: '234MB' },
      { id: 'netflix', name: 'Netflix', category: 'entertainment', icon: '🎬', size: '67MB' },
      { id: 'spotify', name: 'Spotify', category: 'entertainment', icon: '🎵', size: '123MB' },
      { id: 'tiktok', name: 'TikTok', category: 'social', icon: '🎭', size: '178MB' },
      { id: 'whatsapp', name: 'WhatsApp', category: 'social', icon: '💬', size: '45MB' },
      { id: 'telegram', name: 'Telegram', category: 'social', icon: '📡', size: '67MB' },
      { id: 'discord', name: 'Discord', category: 'games', icon: '🎮', size: '89MB' },
      { id: 'reddit', name: 'Reddit', category: 'news', icon: '🤖', size: '78MB' },
      { id: 'amazon', name: 'Amazon', category: 'shopping', icon: '📦', size: '156MB' },
      { id: 'ebay', name: 'eBay', category: 'shopping', icon: '🏪', size: '89MB' }
    ]
    
    setDeviceApps(foundApps)
    setIsScanning(false)
    setScanProgress(0)
  }

  // Get apps by category
  const getAppsByCategory = (categoryId) => {
    return deviceApps.filter(app => app.category === categoryId)
  }

  // Toggle individual app blocking
  const [blockedIndividualApps, setBlockedIndividualApps] = useState({})
  
  const toggleIndividualApp = (appId) => {
    setBlockedIndividualApps(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }))
  }

  // Get total blocked apps count
  const getTotalBlockedAppsCount = () => {
    return Object.values(blockedIndividualApps).filter(Boolean).length
  }

  // Toggle app blocking on/off
  const toggleAppBlocking = () => {
    setAppBlockingActive(!appBlockingActive)
    if (!appBlockingActive) {
      // If turning on, scan for apps if not already done
      if (deviceApps.length === 0) {
        scanDeviceApps()
      }
    }
  }

  // Open app blocking settings
  const openAppBlockingSettings = () => {
    setShowAppBlocking(true)
  }

  // Simple test to see if component renders
  console.log('Focus component rendering, state:', state)
  
  // Timer functions
  const [timerStartTime, setTimerStartTime] = useState(null)
  
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true)
      setIsPaused(false)
      setTimerStartTime(new Date())
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            // Save session only when timer completes
            const session = {
              id: Date.now(),
              duration: customMinutes * 60,
              startTime: timerStartTime?.toISOString() || new Date().toISOString(),
              endTime: new Date().toISOString(),
              completed: true,
              method: 'timer'
            }
            dispatch({ type: 'ADD_FOCUS_SESSION', payload: session })
            setTimerStartTime(null)
            return customMinutes * 60
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const pauseTimer = () => {
    if (isRunning && !isPaused) {
      // Pause the timer
      clearInterval(intervalRef.current)
      setIsPaused(true)
    } else if (isRunning && isPaused) {
      // Resume the timer
      setIsPaused(false)
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            setIsPaused(false)
            // Save session only when timer completes
            const session = {
              id: Date.now(),
              duration: customMinutes * 60,
              startTime: timerStartTime?.toISOString() || new Date().toISOString(),
              endTime: new Date().toISOString(),
              completed: true,
              method: 'timer'
            }
            dispatch({ type: 'ADD_FOCUS_SESSION', payload: session })
            setTimerStartTime(null)
            return customMinutes * 60
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const resetTimer = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(customMinutes * 60)
    setTimerStartTime(null)
  }

  const setCustomTimer = () => {
    if (customMinutes > 0 && customMinutes <= 480) { // Max 8 hours
      setTimeLeft(customMinutes * 60)
      setShowTimerPicker(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const openTimerPicker = () => {
    if (!isRunning && !stopwatchRunning) {
      setShowTimerPicker(true)
    }
  }
  
  // Stopwatch method functions
  const startStopwatch = () => {
    if (!stopwatchRunning) {
      setStopwatchRunning(true)
      setSessionStartTime(new Date())
      const interval = setInterval(() => {
        setStopwatchTime(prev => prev + 1)
      }, 1000)
      setStopwatchInterval(interval)
    }
  }
  
  const stopStopwatch = () => {
    if (stopwatchRunning) {
      clearInterval(stopwatchInterval)
      setStopwatchRunning(false)
      
      // Save the session with feedback flag
      const session = {
        id: Date.now(),
        duration: stopwatchTime,
        startTime: sessionStartTime.toISOString(),
        endTime: new Date().toISOString(),
        completed: true,
        method: 'stopwatch',
        showFeedback: true // Add flag to show feedback in chart
      }
      dispatch({ type: 'ADD_FOCUS_SESSION', payload: session })
      
      // Keep showing the completed session time
      setLastSessionTime(stopwatchTime)
      setShowSessionFeedback(true)
    }
  }
  
  const startOverStopwatch = () => {
    setStopwatchTime(0)
    setSessionStartTime(null)
    setShowSessionFeedback(false)
    setLastSessionTime(0)
  }
  
  const resetStopwatch = () => {
    clearInterval(stopwatchInterval)
    setStopwatchRunning(false)
    setStopwatchTime(0)
    setSessionStartTime(null)
  }
  
  const toggleStopwatchMode = () => {
    if (stopwatchMode) {
      // Switching back to timer mode
      resetStopwatch()
      setShowSessionFeedback(false)
      setLastSessionTime(0)
      setStopwatchMode(false)
    } else {
      // Switching to stopwatch mode
      if (isRunning) {
        clearInterval(intervalRef.current)
        setIsRunning(false)
        setIsPaused(false)
      }
      setStopwatchMode(true)
    }
  }

  // Do Not Disturb and App Blocking functions
  const toggleDoNotDisturb = () => {
    const newDndState = !doNotDisturb
    setDoNotDisturb(newDndState)
    
    if (newDndState) {
      // Play DND activation sound
      try {
        const audio = new Audio('/dnd.mp3')
        audio.play().catch(error => {
          console.log('Audio playback failed:', error)
        })
      } catch (error) {
        console.log('Audio creation failed:', error)
      }
    } else {
      // Play DND deactivation sound (different tone)
      try {
        // Create a simple beep sound for deactivation
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // Higher pitch
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } catch (error) {
        console.log('Audio creation failed:', error)
      }
    }
    
    console.log('Do Not Disturb:', newDndState)
  }

  const toggleAppCategory = (categoryId) => {
    setBlockedApps(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const toggleBlockingSchedule = () => {
    setBlockingSchedule(prev => ({
      ...prev,
      enabled: !prev.enabled
    }))
  }

  const updateBlockingSchedule = (field, value) => {
    setBlockingSchedule(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleDay = (day) => {
    setBlockingSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }))
  }

  const getBlockingStatus = () => {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5)
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' })
    
    if (!blockingSchedule.enabled) return false
    
    const isInTimeRange = currentTime >= blockingSchedule.startTime && currentTime <= blockingSchedule.endTime
    const isOnBlockedDay = blockingSchedule.days.includes(currentDay)
    
    return isInTimeRange && isOnBlockedDay
  }

  const getBlockedAppsCount = () => {
    return Object.values(blockedApps).filter(Boolean).length
  }

  const getBlockingModeDescription = () => {
    switch (blockingMode) {
      case 'strict':
        return 'Complete blocking - apps are completely inaccessible'
      case 'gentle':
        return 'Gentle reminders - shows focus prompts when opening apps'
      case 'custom':
        return 'Custom rules - set your own blocking preferences'
      default:
        return ''
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (stopwatchInterval) {
        clearInterval(stopwatchInterval)
    }
    }
  }, [stopwatchInterval])
  
  // Debug: Log stopwatchRunning state
  console.log('stopwatchRunning:', stopwatchRunning, 'stopwatchMode:', stopwatchMode)
  
  return (
      <div className="space-y-8 p-12 transition-all duration-500">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Focus Mode</h1>
        <p className="text-gray-400">Boost your productivity with focused work sessions</p>
      </div>

             {/* Timer/Stopwatch Display */}
                         <div className="bg-gray-800 rounded-lg p-6 border-2 text-center transition-all duration-300 focus-active focus-border" style={{
            borderColor: (stopwatchMode && stopwatchRunning) || (!stopwatchMode && isRunning) ? '#22c55e !important' : '#374151 !important', 
            borderWidth: '2px !important',
            boxShadow: (stopwatchMode && stopwatchRunning) || (!stopwatchMode && isRunning) ? '0 10px 25px -3px rgba(34, 197, 94, 0.2) !important' : 'none !important'
          }}>
        {/* Mode Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-700 rounded-lg p-1 flex">
                         <button
               onClick={() => toggleStopwatchMode()}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                 !stopwatchMode
                   ? 'bg-primary-600 text-white'
                   : 'text-gray-400 hover:text-gray-300'
               }`}
             >
               Timer
             </button>
             <button
               onClick={() => toggleStopwatchMode()}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                 stopwatchMode
                   ? 'bg-primary-600 text-white'
                   : 'text-gray-400 hover:text-gray-300'
               }`}
             >
               Stopwatch
             </button>
          </div>
        </div>
        
                 {/* Timer Mode */}
         {!stopwatchMode && (
           <>
                   <div 
            className={`text-6xl font-bold mb-6 font-mono cursor-pointer transition-all duration-300 select-none ${
              isRunning 
                ? 'text-green-400 animate-pulse' 
                : 'text-gray-100 hover:text-primary-400'
            }`}
          onClick={openTimerPicker}
          title={!isRunning ? "Tap to set timer" : "Timer is running"}
        >
          {formatTime(timeLeft)}
        </div>
        
                 <div className={`flex justify-center gap-4 mb-6 transition-all duration-300 ${
           isRunning ? 'scale-105' : ''
         }`}>
          {/* Start Button - Only show when not running */}
          {!isRunning && (
            <button
              onClick={startTimer}
              className="btn-primary flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          )}
          
          {/* Pause Button - Only show when running and not paused */}
          {isRunning && !isPaused && (
            <button
              onClick={pauseTimer}
              className="btn-secondary flex items-center gap-2"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          
          {/* Resume Button - Only show when paused */}
          {isRunning && isPaused && (
            <button
              onClick={pauseTimer}
              className="btn-primary flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Resume
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        <div className="text-sm text-gray-400">
                       {isRunning && !isPaused && (
              <span className="text-green-400 font-medium">
                Timer session in progress... ⏱️
              </span>
            )}
          {isPaused && 'Session paused'}
          {!isRunning && !isPaused && 'Tap timer to set duration'}
        </div>
          </>
        )}
        
        {/* Stopwatch Mode */}
        {stopwatchMode && (
          <>
                         <div className={`text-6xl font-bold mb-6 font-mono transition-all duration-300 ${
               stopwatchRunning 
                 ? 'text-green-400 animate-pulse' 
                 : showSessionFeedback 
                   ? 'text-green-300' 
                   : 'text-gray-100'
             }`}>
               {showSessionFeedback ? formatTime(lastSessionTime) : formatTime(stopwatchTime)}
      </div>
            
            <div className="flex justify-center gap-4 mb-6">
              {!stopwatchRunning && !showSessionFeedback ? (
                <button
                  onClick={startStopwatch}
                  className="btn-primary flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Focus
                </button>
              ) : stopwatchRunning ? (
                <button
                  onClick={stopStopwatch}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Stop Focus
                </button>
              ) : showSessionFeedback ? (
                <button
                  onClick={startOverStopwatch}
                  className="btn-primary flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Start Over
                </button>
              ) : null}
            </div>

            <div className="text-sm text-gray-400">
              {stopwatchRunning && 'Focus session in progress...'}
              {showSessionFeedback && (
                <span className="text-green-400 font-medium">
                  Great job! {Math.round(lastSessionTime / 60)} minute{Math.round(lastSessionTime / 60) !== 1 ? 's' : ''} focused! 🎉
                </span>
              )}
              {!stopwatchRunning && !showSessionFeedback && stopwatchTime === 0 && 'Start when you begin focusing'}
              {!stopwatchRunning && !showSessionFeedback && stopwatchTime > 0 && 'Session saved! Start new focus block'}
            </div>
          </>
        )}
      </div>
      
             {/* Stopwatch Method Explanation */}
       {stopwatchMode && (
         <div className={`border rounded-lg p-4 transition-all duration-300 ${
           stopwatchRunning 
             ? 'bg-green-900/30 border-green-500/50' 
             : 'bg-blue-900/20 border-blue-700'
         }`}>
          <div className="flex items-start gap-3">
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
               stopwatchRunning ? 'bg-green-600' : 'bg-blue-600'
             }`}>
               <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
               </svg>
             </div>
            <div>
                             <h4 className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                 stopwatchRunning ? 'text-green-300' : 'text-blue-300'
               }`}>
                 {stopwatchRunning ? '🎯 Focus Mode Active!' : 'Stopwatch Method'}
               </h4>
               <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                 stopwatchRunning ? 'text-green-200' : 'text-blue-200'
               }`}>
                 {stopwatchRunning 
                   ? 'You\'re in the zone! Keep focusing and stop when you get distracted. Every second counts! 💪'
                   : 'Start the stopwatch when you begin focusing. Stop it immediately when you lose focus or get distracted. This becomes your baseline focus time. Aim for multiple focused blocks with 5-minute breaks between them.'
                 }
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Focus Controls */}
        <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ${
          stopwatchRunning || isRunning ? 'scale-105' : ''
        }`}>
                 <div className={`bg-gray-800 rounded-lg p-6 border text-center transition-all duration-200 ${
           ((stopwatchRunning || isRunning) && !doNotDisturb)
             ? 'border-green-500/50'
             : 'border-gray-700'
         }`}>
          <button
            onClick={toggleDoNotDisturb}
            className={`w-full p-4 rounded-lg transition-all duration-200 ${
              doNotDisturb
                ? 'bg-primary-600 text-white border-2 border-primary-600'
                : 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-primary-600'
            }`}
          >
            <Bell className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">
              {doNotDisturb ? 'DND Active' : 'Do Not Disturb'}
            </div>
          </button>
        </div>

                 <div className={`bg-gray-800 rounded-lg p-6 border text-center transition-all duration-200 ${
           ((stopwatchRunning || isRunning) && !appBlockingActive)
             ? 'border-green-500/50'
             : 'border-gray-700'
         }`}>
          <button
            onClick={toggleAppBlocking}
            className={`w-full p-4 rounded-lg transition-all duration-200 ${
              appBlockingActive
                ? 'bg-primary-600 text-white border-2 border-primary-600'
                : 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-primary-600'
            }`}
          >
            <Shield className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">
              {appBlockingActive ? 'App Blocking Active' : 'App Blocking'}
              {appBlockingActive && getTotalBlockedAppsCount() > 0 && (
                <div className="text-xs mt-1 text-primary-200">
                  {getTotalBlockedAppsCount()} apps blocked
                </div>
              )}
            </div>
          </button>
          
          {/* Settings button when blocking is active */}
          {appBlockingActive && (
            <button
              onClick={openAppBlockingSettings}
              className="w-full mt-3 p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors text-sm"
            >
              ⚙️ Edit Blocked Apps
            </button>
          )}
        </div>
      </div>

                           {/* Focus Sessions Chart - Mode Specific */}
            {stopwatchMode ? (
              /* Stopwatch Sessions Chart */
              <div className={`bg-gray-800 rounded-lg p-6 border transition-all duration-300 ${
                stopwatchRunning
                  ? 'border-green-500/50 focus-active shadow-lg shadow-green-500/20' 
                  : 'border-gray-700'
              }`} style={{boxShadow: stopwatchRunning ? '0 10px 25px -3px rgba(34, 197, 94, 0.2)' : 'none'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  Stopwatch Sessions
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-400">
                    {(state.focus?.sessions || []).filter(session => {
                      const today = new Date().toDateString()
                      return new Date(session.startTime).toDateString() === today && session.method === 'stopwatch'
                    }).length || 0} sessions
                  </div>
                  {/* Clear Stopwatch Sessions Button */}
                  {(state.focus?.sessions || []).filter(session => {
                    const today = new Date().toDateString()
                    return new Date(session.startTime).toDateString() === today && session.method === 'stopwatch'
                  }).length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Clear all stopwatch sessions for today? This cannot be undone.')) {
                          const stopwatchSessions = (state.focus?.sessions || []).filter(session => {
                            const today = new Date().toDateString()
                            return new Date(session.startTime).toDateString() === today && session.method === 'stopwatch'
                          })
                          stopwatchSessions.forEach(session => deleteFocusSession(session.id))
                        }
                      }}
                      className="text-xs text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-2 py-1 rounded-lg border border-red-500/30 transition-colors"
                      title="Clear all stopwatch sessions"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
         
                                {/* Stopwatch Sessions Chart */}
               <div className="space-y-3">
                 {(state.focus?.sessions || []).filter(session => {
                   const today = new Date().toDateString()
                   return new Date(session.startTime).toDateString() === today && session.method === 'stopwatch'
                 }).slice(-5).map((session, index) => {
                  const startTime = new Date(session.startTime)
                  const duration = session.duration / 60 // Convert to minutes
                  const isStopwatch = session.method === 'stopwatch'
                  
                  // For stopwatch method, show focus blocks with different styling
                  const getFocusBlockStyle = () => {
                    if (duration < 5) return 'bg-red-500' // Very short focus
                    if (duration < 15) return 'bg-orange-500' // Short focus
                    if (duration < 30) return 'bg-yellow-500' // Medium focus
                    if (duration < 60) return 'bg-blue-500' // Good focus
                    return 'bg-green-500' // Excellent focus
                  }
                  
                  const getFocusLabel = () => {
                    if (duration < 5) return 'Quick'
                    if (duration < 15) return 'Short'
                    if (duration < 30) return 'Medium'
                    if (duration < 60) return 'Good'
                    return 'Excellent'
                  }
                  
                                                           return (
                                             <div key={session.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                         session.showFeedback 
                           ? 'bg-green-900/30 border border-green-500/50 focus-active' 
                           : (stopwatchRunning || isRunning)
                             ? 'bg-gray-700/80 border border-green-500/20' 
                             : 'bg-gray-700'
                       }`}>
                       <div className="flex-shrink-0">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                           isStopwatch ? getFocusBlockStyle() : 'bg-primary-600'
                         }`}>
                           <span className="text-xs font-bold text-white">{index + 1}</span>
                         </div>
                       </div>
                       
                       <div className="flex-1">
                         <div className="flex items-center justify-between mb-1">
                           <div className="flex items-center gap-2">
                             <span className="text-sm font-medium text-gray-100">
                               {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                             {isStopwatch && (
                               <span className={`text-xs text-white px-2 py-0.5 rounded-full ${getFocusBlockStyle()}`}>
                                 {getFocusLabel()} Focus
                               </span>
                             )}
                             {!isStopwatch && (
                               <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                                 Timer
                               </span>
                             )}
                           </div>
                           <span className="text-xs text-gray-400">
                             {Math.round(duration)} min
                           </span>
                         </div>
                         
                         {/* Focus Block Bar */}
                         <div className="w-full bg-gray-600 rounded-full h-2">
                                                       <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isStopwatch 
                                  ? getFocusBlockStyle()
                                  : 'bg-gradient-to-r from-primary-500 to-primary-600'
                              } ${(stopwatchRunning || isRunning) ? 'animate-pulse' : ''}`}
                             style={{ width: `${isStopwatch ? Math.min((duration / 60) * 100, 100) : Math.min((duration / (customMinutes || 25)) * 100, 100)}%` }}
                           ></div>
                         </div>
                         
                         {/* Feedback Message for Stopwatch Sessions */}
                         {session.showFeedback && isStopwatch && (
                           <div className="mt-2 text-xs text-green-400 font-medium focus-active">
                             🎉 Great job! {Math.round(duration)} minute{Math.round(duration) !== 1 ? 's' : ''} focused!
                           </div>
                         )}
                       </div>
                       
                       <div className="flex-shrink-0 flex items-center gap-2">
                         {session.completed ? (
                           <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                             <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                             </svg>
                           </div>
                         ) : (
                           <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                             <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                             </svg>
                           </div>
                         )}
                         
                         {/* Delete Button */}
                         <button
                           onClick={(e) => {
                             e.stopPropagation()
                             if (confirm('Delete this focus session?')) {
                               deleteFocusSession(session.id)
                             }
                           }}
                           className="w-4 h-4 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors opacity-70 hover:opacity-100"
                           title="Delete session"
                         >
                           <X className="w-2.5 h-2.5 text-white" />
                         </button>
                       </div>
                     </div>
                   )
                })}
           
                       {/* Empty State for Stopwatch */}
            {(!state.focus?.sessions || (state.focus?.sessions || []).filter(session => {
              const today = new Date().toDateString()
              return new Date(session.startTime).toDateString() === today && session.method === 'stopwatch'
            }).length === 0) && (
             <div className="text-center py-8">
               <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                 <span className="text-2xl">⏱️</span>
               </div>
               <p className="text-gray-400 text-sm">No stopwatch sessions today</p>
               <p className="text-gray-500 text-xs mt-1">Use stopwatch mode to track natural focus blocks</p>
             </div>
           )}
         </div>
         
                   {/* Stopwatch Summary Stats */}
          {state.focus?.sessions && (state.focus?.sessions || []).filter(session => {
            const today = new Date().toDateString()
            return new Date(session.startTime).toDateString() === today && session.method === 'stopwatch'
          }).length > 0 && (
           <div className="mt-4 pt-4 border-t border-gray-600">
             <div className="grid grid-cols-3 gap-4 text-center">
               <div>
                 <div className="text-lg font-bold text-primary-400">
                   {(state.focus?.sessions || []).filter(session => {
                     const today = new Date().toDateString()
                     return new Date(session.startTime).toDateString() === today && session.method === 'stopwatch'
                   }).length}
                 </div>
                 <div className="text-xs text-gray-400">Sessions</div>
               </div>
               <div>
                 <div className="text-lg font-bold text-green-400">
                   {Math.round((state.focus?.sessions || []).filter(session => {
                     const today = new Date().toDateString()
                     return new Date(session.startTime).toDateString() === today && session.method === 'stopwatch' && session.completed
                   }).reduce((total, session) => total + (session.duration / 60), 0))}
                 </div>
                 <div className="text-xs text-gray-400">Minutes</div>
               </div>
               <div>
                 <div className="text-lg font-bold text-blue-400">
                   {Math.round(((state.focus?.sessions || []).filter(session => {
                     const today = new Date().toDateString()
                     return new Date(session.startTime).toDateString() === today && session.method === 'stopwatch' && session.completed
                   }).length / Math.max((state.focus?.sessions || []).filter(session => {
                     const today = new Date().toDateString()
                     return new Date(session.startTime).toDateString() === today && session.method === 'stopwatch'
                   }).length, 1)) * 100)}%
                 </div>
                 <div className="text-xs text-gray-400">Success Rate</div>
               </div>
             </div>
           </div>
         )}
              </div>
            ) : (
              /* Timer Sessions Chart */
              <div className={`bg-gray-800 rounded-lg p-6 border transition-all duration-300 ${
                isRunning
                  ? 'border-green-500/50 focus-active shadow-lg shadow-green-500/20' 
                  : 'border-gray-700'
              }`} style={{boxShadow: isRunning ? '0 10px 25px -3px rgba(34, 197, 94, 0.2)' : 'none'}}>
         <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
             <span className="text-2xl">⏰</span>
             Timer Sessions
           </h3>
           <div className="flex items-center gap-3">
             <div className="text-sm text-gray-400">
               {(state.focus?.sessions || []).filter(session => {
                 const today = new Date().toDateString()
                 return new Date(session.startTime).toDateString() === today && session.method !== 'stopwatch'
               }).length || 0} sessions
             </div>
             {/* Clear Timer Sessions Button */}
             {(state.focus?.sessions || []).filter(session => {
               const today = new Date().toDateString()
               return new Date(session.startTime).toDateString() === today && session.method !== 'stopwatch'
             }).length > 0 && (
               <button
                 onClick={() => {
                   if (confirm('Clear all timer sessions for today? This cannot be undone.')) {
                     const timerSessions = (state.focus?.sessions || []).filter(session => {
                       const today = new Date().toDateString()
                       return new Date(session.startTime).toDateString() === today && session.method !== 'stopwatch'
                     })
                     timerSessions.forEach(session => deleteFocusSession(session.id))
                   }
                 }}
                 className="text-xs text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-2 py-1 rounded-lg border border-red-500/30 transition-colors"
                 title="Clear all timer sessions"
               >
                 Clear All
               </button>
             )}
           </div>
         </div>

         {/* Timer Sessions Chart */}
         <div className="space-y-3">
           {(state.focus?.sessions || []).filter(session => {
             const today = new Date().toDateString()
             return new Date(session.startTime).toDateString() === today && session.method !== 'stopwatch'
           }).slice(-5).map((session, index) => {
            const startTime = new Date(session.startTime)
            const duration = session.duration / 60 // Convert to minutes
            const isTimer = session.method !== 'stopwatch'
            
            return (
              <div key={session.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                session.showFeedback 
                  ? 'bg-green-900/30 border border-green-500/50 focus-active' 
                  : isRunning
                    ? 'bg-gray-700/80 border border-green-500/20' 
                    : 'bg-gray-700'
              }`}>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600">
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-100">
                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        Timer
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {Math.round(duration)} min
                    </span>
                  </div>
                  
                  {/* Timer Progress Bar */}
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                     className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-blue-600 ${isRunning ? 'animate-pulse' : ''}`}
                     style={{ width: `${Math.min((duration / (customMinutes || 25)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 flex items-center gap-2">
                  {session.completed ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Delete this timer session?')) {
                        deleteFocusSession(session.id)
                      }
                    }}
                    className="w-4 h-4 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors opacity-70 hover:opacity-100"
                    title="Delete session"
                  >
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              </div>
            )
          })}

          {/* Empty State for Timer */}
          {(!state.focus?.sessions || (state.focus?.sessions || []).filter(session => {
            const today = new Date().toDateString()
            return new Date(session.startTime).toDateString() === today && session.method !== 'stopwatch'
          }).length === 0) && (
           <div className="text-center py-8">
             <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
               <span className="text-2xl">⏰</span>
             </div>
             <p className="text-gray-400 text-sm">No timer sessions today</p>
             <p className="text-gray-500 text-xs mt-1">Use timer mode for structured focus sessions</p>
           </div>
         )}
       </div>
       
       {/* Timer Summary Stats */}
       {state.focus?.sessions && (state.focus?.sessions || []).filter(session => {
         const today = new Date().toDateString()
         return new Date(session.startTime).toDateString() === today && session.method !== 'stopwatch'
       }).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary-400">
                {(state.focus?.sessions || []).filter(session => {
                  const today = new Date().toDateString()
                  return new Date(session.startTime).toDateString() === today && session.method !== 'stopwatch'
                }).length}
              </div>
              <div className="text-xs text-gray-400">Sessions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">
                {Math.round((state.focus?.sessions || []).filter(session => {
                  const today = new Date().toDateString()
                  return new Date(session.startTime).toDateString() === today && session.method !== 'stopwatch' && session.completed
                }).reduce((total, session) => total + (session.duration / 60), 0))}
              </div>
              <div className="text-xs text-gray-400">Minutes</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">
                {Math.round(((state.focus?.sessions || []).filter(session => {
                  const today = new Date().toDateString()
                  return new Date(session.startTime).toDateString() === today && session.method !== 'stopwatch' && session.completed
                }).length / Math.max((state.focus?.sessions || []).filter(session => {
                  const today = new Date().toDateString()
                  return new Date(session.startTime).toDateString() === today && session.method !== 'stopwatch'
                }).length, 1)) * 100)}%
              </div>
              <div className="text-xs text-gray-400">Completion Rate</div>
            </div>
          </div>
        </div>
       )}
              </div>
            )}

      {/* Timer Picker Modal - Mobile Column Style */}
      {showTimerPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-sm p-6">
            <div className="text-center mb-6">
              <Clock className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-100">Set Timer</h3>
              <p className="text-gray-400 text-sm">Choose your focus duration</p>
            </div>
            
                         {/* Mobile Column Time Picker - Minutes Only */}
             <div className="mb-6">
               <div className="flex items-center justify-center mb-4">
                 <div className="text-center">
                   <label className="text-sm text-gray-400 mb-2 block">Minutes</label>
                   <div className="relative">
                     <select
                value={customMinutes}
                       onChange={(e) => setCustomMinutes(parseInt(e.target.value))}
                       className="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-6 py-3 text-xl font-semibold appearance-none cursor-pointer focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                       style={{ minWidth: '120px' }}
                     >
                       {Array.from({ length: 60 }, (_, i) => i + 1).map((min) => (
                         <option key={min} value={min}>
                           {min}
                         </option>
                       ))}
                     </select>
                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                     </div>
                   </div>
                 </div>
            </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-3 gap-2">
              {[15, 25, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setCustomMinutes(mins)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm ${
                    customMinutes === mins
                      ? 'border-primary-600 bg-primary-900/20 text-primary-600'
                      : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-primary-600'
                  }`}
                >
                  {mins} min
                </button>
              ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTimerPicker(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={setCustomTimer}
                className="btn-primary flex-1"
              >
                Set Timer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean App Blocking Modal */}
      {showAppBlocking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">App Blocking Settings</h3>
                    <p className="text-sm text-gray-400">
                      {appBlockingActive 
                        ? 'Currently blocking distracting apps' 
                        : 'Configure which apps to block'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAppBlocking(false)}
                  className="text-gray-400 hover:text-gray-300 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Status indicator */}
              <div className="mt-3 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${appBlockingActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-300">
                  {appBlockingActive ? 'Blocking Active' : 'Blocking Inactive'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Scan Device Button */}
              {deviceApps.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-100 mb-2">Scan Your Device</h4>
                  <p className="text-sm text-gray-400 mb-4">Find and block distracting apps</p>
                  <button
                    onClick={scanDeviceApps}
                    disabled={isScanning}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isScanning ? `Scanning... ${Math.round(scanProgress)}%` : 'Scan Device'}
                  </button>
                  {isScanning && (
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}

              {/* Blocking Mode */}
              {deviceApps.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Blocking Mode</h4>
                  <div className="flex gap-2">
                    {['strict', 'gentle', 'custom'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setBlockingMode(mode)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          blockingMode === mode
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* App Categories with Scanned Apps */}
              {deviceApps.length > 0 && appCategories.map((category) => {
                const categoryApps = getAppsByCategory(category.id)
                if (categoryApps.length === 0) return null
                
                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-300">{category.name}</h4>
                      <span className="text-xs text-gray-500">{categoryApps.length} apps</span>
                    </div>
                    <div className="space-y-2">
                      {categoryApps.map((app) => (
                        <div
                          key={app.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            blockedIndividualApps[app.id]
                              ? 'border-red-500 bg-red-900/20'
                              : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                          }`}
                          onClick={() => toggleIndividualApp(app.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{app.icon}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-100">{app.name}</div>
                              <div className="text-xs text-gray-400">{app.size}</div>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border transition-colors ${
                            blockedIndividualApps[app.id]
                              ? 'bg-red-500 border-red-500'
                              : 'border-gray-400'
                          }`}>
                            {blockedIndividualApps[app.id] && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-0.5"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Status Summary */}
              {deviceApps.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-primary-400">{getTotalBlockedAppsCount()}</div>
                      <div className="text-xs text-gray-400">Apps Blocked</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-400">{deviceApps.length}</div>
                      <div className="text-xs text-gray-400">Total Apps</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <button
                      onClick={scanDeviceApps}
                      className="text-xs text-primary-400 hover:text-primary-300"
                    >
                      Rescan Device
                    </button>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowAppBlocking(false)}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
