import React, { useState, useEffect, useRef } from 'react'
import { User, Settings, Download, Trash2, Palette, Brain, Trophy, Moon, Sun, Plus, X, Save, Eye, Bell, Shield, Database, Smartphone, Globe, Lock, HelpCircle, Star, Target, Zap, Heart, Calendar, BarChart3, Camera, Edit3, CheckCircle, Flag } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'
import { useLocation } from 'react-router-dom'

export default function Profile() {
  const { state, dispatch, setLanguage } = useApp()
  const { t } = useTranslation()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('overview')
  const [showThemeCreator, setShowThemeCreator] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [profileName, setProfileName] = useState(localStorage.getItem('profileName') || 'Użytkownik')
  const profileImage = state.profileImage
  const fileInputRef = useRef(null)
  
  // Long-term goals state with improved loading
  const [longTermGoals, setLongTermGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('longTermGoals')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Validate that it's an array
        if (Array.isArray(parsed)) {
          console.log('Loaded goals from localStorage:', parsed.length, 'goals')
          return parsed
        }
      }
    } catch (error) {
      console.error('Error loading goals from localStorage:', error)
    }
    console.log('No goals found in localStorage, starting with empty array')
    return []
  })
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    isFinancial: false,
    targetAmount: '',
    currentAmount: 0
  })
  const [customTheme, setCustomTheme] = useState({
    name: 'Custom Theme',
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#c084fc',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#e2e8f0',
    textMuted: '#94a3b8',
    border: '#334155',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  })

  // Preset themes
  const presetThemes = [
    {
      id: 'purple',
      name: 'Purple Dream',
      colors: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#c084fc',
        background: '#0f0f23',
        surface: '#1a1a2e',
        text: '#ffffff',
        textSecondary: '#e2e8f0',
        textMuted: '#94a3b8',
        border: '#334155',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      colors: {
        primary: '#3b82f6',
        secondary: '#60a5fa',
        accent: '#93c5fd',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#ffffff',
        textSecondary: '#e2e8f0',
        textMuted: '#94a3b8',
        border: '#334155',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    },
    {
      id: 'forest',
      name: 'Forest Green',
      colors: {
        primary: '#10b981',
        secondary: '#34d399',
        accent: '#6ee7b7',
        background: '#064e3b',
        surface: '#065f46',
        text: '#ffffff',
        textSecondary: '#e2e8f0',
        textMuted: '#94a3b8',
        border: '#334155',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    },
    {
      id: 'sunset',
      name: 'Sunset Orange',
      colors: {
        primary: '#f97316',
        secondary: '#fb923c',
        accent: '#fdba74',
        background: '#451a03',
        surface: '#7c2d12',
        text: '#ffffff',
        textSecondary: '#e2e8f0',
        textMuted: '#94a3b8',
        border: '#334155',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    },
    {
      id: 'midnight',
      name: 'Midnight Black',
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
        background: '#000000',
        surface: '#111111',
        text: '#ffffff',
        textSecondary: '#e2e8f0',
        textMuted: '#94a3b8',
        border: '#1f1f1f',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    }
  ]

  // Apply theme to document
  const applyTheme = (theme) => {
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
    
    // Update context
    dispatch({ type: 'SET_COLOR_SCHEME', payload: theme.id })
  }

  // Create custom theme
  const createCustomTheme = () => {
    const newTheme = {
      id: `custom-${Date.now()}`,
      name: customTheme.name,
      colors: { ...customTheme }
    }
    
    // Save to localStorage
    const savedThemes = JSON.parse(localStorage.getItem('custom-themes') || '[]')
    savedThemes.push(newTheme)
    localStorage.setItem('custom-themes', JSON.stringify(savedThemes))
    
    // Apply theme
    applyTheme(newTheme)
    setShowThemeCreator(false)
  }

  // Delete custom theme
  const deleteCustomTheme = (themeId) => {
    const savedThemes = JSON.parse(localStorage.getItem('custom-themes') || '[]')
    const filteredThemes = savedThemes.filter(theme => theme.id !== themeId)
    localStorage.setItem('custom-themes', JSON.stringify(filteredThemes))
    
    // If deleted theme was active, switch to default
    if (state.theme.colorScheme === themeId) {
      applyTheme(presetThemes[0])
    }
  }

  // Get custom themes from localStorage
  const getCustomThemes = () => {
    return JSON.parse(localStorage.getItem('custom-themes') || '[]')
  }

  // Export theme
  const exportTheme = (theme) => {
    const dataStr = JSON.stringify(theme, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${theme.name}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Import theme
  const importTheme = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const theme = JSON.parse(e.target.result)
          if (theme.colors && theme.name) {
            setCustomTheme(theme.colors)
            setCustomTheme(prev => ({ ...prev, name: theme.name }))
            setShowThemeCreator(true)
          }
        } catch (error) {
          alert('Invalid theme file')
        }
      }
      reader.readAsText(file)
    }
  }

  // Export all data
  const exportAllData = () => {
    const data = {
      tasks: state.tasks,
      health: state.health,
      focus: state.focus,
      streaks: state.streaks,
      theme: state.theme,
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', 'momentum-data.json')
    linkElement.click()
    
    setShowExportModal(false)
  }

  // Clear all data
  const clearAllData = () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie dane? Tej operacji nie można cofnąć!')) {
      localStorage.clear()
      window.location.reload()
    }
    setShowDeleteModal(false)
  }

  // Live preview of custom theme
  useEffect(() => {
    if (showThemeCreator) {
      const root = document.documentElement
      Object.entries(customTheme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value)
      })
    }
  }, [customTheme, showThemeCreator])

  // Handle profile image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        dispatch({ type: 'SET_PROFILE_IMAGE', payload: imageData })
        localStorage.setItem('profileImage', imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove profile image
  const removeProfileImage = () => {
    dispatch({ type: 'REMOVE_PROFILE_IMAGE' })
    localStorage.removeItem('profileImage')
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Save profile changes
  const saveProfileChanges = () => {
    localStorage.setItem('profileName', profileName)
    setShowEditProfile(false)
  }

  // Helper function to safely save goals to localStorage
  const saveGoalsToStorage = (goals) => {
    try {
      localStorage.setItem('longTermGoals', JSON.stringify(goals))
      console.log('Goals saved to localStorage:', goals.length, 'goals')
    } catch (error) {
      console.error('Error saving goals to localStorage:', error)
      // Try to save to a backup key if main storage fails
      try {
        localStorage.setItem('longTermGoals_backup', JSON.stringify(goals))
        console.log('Goals saved to backup storage')
      } catch (backupError) {
        console.error('Error saving to backup storage:', backupError)
      }
    }
  }

  // Goals management functions
  const addGoal = () => {
    if (!newGoal.title.trim()) return
    
    const goal = {
      id: Date.now().toString(),
      ...newGoal,
      createdAt: new Date().toISOString(),
      completed: false,
      progress: 0
    }
    
    const updatedGoals = [...longTermGoals, goal]
    setLongTermGoals(updatedGoals)
    saveGoalsToStorage(updatedGoals)
    
    // Reset form
    setNewGoal({
      title: '',
      description: '',
      targetDate: '',
      isFinancial: false,
      targetAmount: '',
      currentAmount: 0
    })
    setShowGoalForm(false)
  }

  const deleteGoal = (goalId) => {
    const updatedGoals = longTermGoals.filter(goal => goal.id !== goalId)
    setLongTermGoals(updatedGoals)
    saveGoalsToStorage(updatedGoals)
  }

  const toggleGoalComplete = (goalId) => {
    const updatedGoals = longTermGoals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    )
    setLongTermGoals(updatedGoals)
    saveGoalsToStorage(updatedGoals)
  }

  const updateGoalProgress = (goalId, progress) => {
    const updatedGoals = longTermGoals.map(goal =>
      goal.id === goalId ? { ...goal, progress: Math.min(100, Math.max(0, progress)) } : goal
    )
    setLongTermGoals(updatedGoals)
    saveGoalsToStorage(updatedGoals)
  }

  const updateFinancialAmount = (goalId, newAmount) => {
    const updatedGoals = longTermGoals.map(goal => {
      if (goal.id === goalId && goal.isFinancial) {
        const currentAmount = Math.max(0, newAmount)
        const progress = goal.targetAmount > 0 ? Math.min(100, (currentAmount / goal.targetAmount) * 100) : 0
        return { ...goal, currentAmount, progress }
      }
      return goal
    })
    setLongTermGoals(updatedGoals)
    saveGoalsToStorage(updatedGoals)
  }

  // Effect to ensure goals are saved when component unmounts or page is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (longTermGoals.length > 0) {
        saveGoalsToStorage(longTermGoals)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Also save periodically (every 30 seconds) as a backup
    const interval = setInterval(() => {
      if (longTermGoals.length > 0) {
        saveGoalsToStorage(longTermGoals)
      }
    }, 30000)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearInterval(interval)
      // Final save when component unmounts
      if (longTermGoals.length > 0) {
        saveGoalsToStorage(longTermGoals)
      }
    }
  }, [longTermGoals])

  // Effect to try loading from backup if main storage is empty
  useEffect(() => {
    if (longTermGoals.length === 0) {
      try {
        const backup = localStorage.getItem('longTermGoals_backup')
        if (backup) {
          const parsed = JSON.parse(backup)
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('Restored goals from backup storage:', parsed.length, 'goals')
            setLongTermGoals(parsed)
            saveGoalsToStorage(parsed) // Save to main storage
          }
        }
      } catch (error) {
        console.error('Error loading backup goals:', error)
      }
    }
  }, [])

  // Check URL parameters to auto-switch to specific tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tabParam = searchParams.get('tab')
    if (tabParam === 'achievements') {
      setActiveTab('achievements')
    } else if (tabParam === 'goals') {
      setActiveTab('goals')
    }
  }, [location.search])

  return (
    <div className="space-y-4 sm:space-y-8 p-4 sm:p-8 lg:p-12 max-w-[2532px] mx-auto min-h-[1170px] pb-20">
      {/* Header */}
      <div className="text-center relative">
        {/* Edit Button - Top Right */}
        <button
          onClick={() => setShowEditProfile(true)}
          className="absolute top-0 right-0 p-3 sm:p-2 bg-primary-600 hover:bg-primary-700 rounded-full text-white transition-colors shadow-lg touch-manipulation"
        >
          <Edit3 className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>
        
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
          {/* Profile Image or Default Avatar */}
          {profileImage ? (
            <div className="relative group">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-primary-600 shadow-lg"
              />
              {/* Hover overlay with edit button */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  onClick={triggerFileInput}
                  className="p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              {/* Hover overlay with camera button */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  onClick={triggerFileInput}
                  className="p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        
                 <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">{profileName}</h1>
         <p className="text-sm sm:text-base text-gray-400">{t('profile.subtitle')}</p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="card text-center hover-lift">
                     <div className="text-2xl font-bold text-primary-600 mb-2">
             {state.streaks?.currentStreak || 0}
           </div>
           <div className="text-sm text-gray-400">{t('profile.currentStreak')}</div>
         </div>
         <div className="card text-center hover-lift">
           <div className="text-2xl font-bold text-primary-600 mb-2">
             {state.streaks?.longestStreak || 0}
           </div>
           <div className="text-sm text-gray-400">{t('profile.bestStreak')}</div>
        </div>
      </div>

      {/* Tab Navigation - Mobile Optimized */}
      <div className="w-full">
        {/* Mobile: Horizontal Scroll */}
        <div className="sm:flex sm:justify-center">
          <div className="bg-gray-800 rounded-xl p-1 flex overflow-x-auto sm:inline-flex scrollbar-hide">
            {[
              { id: 'overview', label: t('navigation.overview'), icon: Eye },
              { id: 'goals', label: 'Cele', icon: Flag },
              { id: 'themes', label: t('navigation.themes'), icon: Palette },
              { id: 'settings', label: t('navigation.settings'), icon: Settings },
              { id: 'data', label: t('navigation.data'), icon: Database },
              { id: 'achievements', label: t('navigation.achievements'), icon: Trophy }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap touch-manipulation ${
                  activeTab === id 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative overflow-hidden">
      {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeInUp">
          {/* Progress Overview */}
          <div className="card">
                         <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
               <BarChart3 className="w-5 h-5 text-primary-500" />
               {t('overview.yourProgress')}
             </h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-gray-300">{t('overview.completedTasks')}</span>
                <span className="text-primary-500 font-semibold">
                  {state.tasks?.filter(t => t.completed).length || 0} / {state.tasks?.length || 0}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${state.tasks?.length > 0 ? (state.tasks.filter(t => t.completed).length / state.tasks.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
                         <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
               <Calendar className="w-5 h-5 text-primary-500" />
               {t('overview.recentActivity')}
             </h3>
             <div className="space-y-3">
               <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                 <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                 <span className="text-gray-300 text-sm">{t('overview.tasksCompletedToday')}</span>
               </div>
               <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 <span className="text-gray-300 text-sm">{t('overview.streakContinued')}</span>
               </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button 
              onClick={() => setActiveTab('themes')}
              className="card text-center hover-lift hover-glow cursor-pointer p-4"
            >
              <Palette className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                             <h4 className="font-semibold text-gray-100">{t('navigation.themes')}</h4>
               <p className="text-sm text-gray-400">{t('overview.customizeAppearance')}</p>
             </button>
             
             <button 
               onClick={() => setActiveTab('settings')}
               className="card text-center hover-lift hover-glow cursor-pointer p-4"
             >
               <Settings className="w-8 h-8 text-primary-500 mx-auto mb-2" />
               <h4 className="font-semibold text-gray-100">{t('navigation.settings')}</h4>
               <p className="text-sm text-gray-400">{t('overview.configureApp')}</p>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
          <div className="space-y-6 animate-fadeInUp">
          {/* Goals Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-100">Długoterminowe cele</h2>
            <button
              onClick={() => setShowGoalForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Dodaj cel
            </button>
          </div>

          {/* Goals Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">
                {longTermGoals.length}
              </div>
              <div className="text-sm text-gray-400">Wszystkie cele</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">
                {longTermGoals.filter(g => g.completed).length}
              </div>
              <div className="text-sm text-gray-400">Ukończone</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-yellow-500 mb-1">
                {longTermGoals.filter(g => !g.completed).length}
              </div>
              <div className="text-sm text-gray-400">W trakcie</div>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            {longTermGoals.length === 0 ? (
              <div className="card text-center py-12">
                <Flag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Brak celów</h3>
                <p className="text-gray-400 mb-4">Dodaj swój pierwszy długoterminowy cel</p>
                <button
                  onClick={() => setShowGoalForm(true)}
                  className="btn-primary"
                >
                  Dodaj cel
                </button>
              </div>
            ) : (
              longTermGoals.map(goal => (
                <div key={goal.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => toggleGoalComplete(goal.id)}
                          className={`transition-colors ${
                            goal.completed 
                              ? 'text-green-500 hover:text-green-400' 
                              : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          {goal.completed ? <CheckCircle size={20} /> : <Target size={20} />}
                        </button>
                        <h3 className={`font-semibold text-lg ${
                          goal.completed ? 'line-through text-gray-500' : 'text-gray-100'
                        }`}>
                          {goal.title}
                        </h3>
                        {goal.isFinancial && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                            💰 Finansowy
                          </span>
                        )}
                      </div>
                      
                      {goal.description && (
                        <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
                      )}
                      
                      {goal.targetDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>Cel: {new Date(goal.targetDate).toLocaleDateString('pl-PL')}</span>
                        </div>
                      )}
                      
                      {!goal.completed && (
                        <div className="space-y-2">
                          {goal.isFinancial ? (
                            // Financial Goal Progress
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Postęp finansowy</span>
                                <span className="text-green-500 font-medium">
                                  {goal.currentAmount?.toLocaleString('pl-PL')} zł / {goal.targetAmount?.toLocaleString('pl-PL')} zł
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${goal.progress || 0}%` }}
                                ></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  placeholder="Dodaj kwotę"
                                  className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                                  id={`amount-input-${goal.id}`}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      const amount = parseFloat(e.target.value) || 0
                                      updateFinancialAmount(goal.id, (goal.currentAmount || 0) + amount)
                                      e.target.value = ''
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    const input = document.getElementById(`amount-input-${goal.id}`)
                                    const amount = parseFloat(input.value) || 0
                                    updateFinancialAmount(goal.id, (goal.currentAmount || 0) + amount)
                                    input.value = ''
                                  }}
                                  className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                >
                                  + Dodaj
                                </button>
                                <button
                                  onClick={() => {
                                    const input = document.getElementById(`amount-input-${goal.id}`)
                                    const amount = parseFloat(input.value) || 0
                                    updateFinancialAmount(goal.id, Math.max(0, (goal.currentAmount || 0) - amount))
                                    input.value = ''
                                  }}
                                  className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                >
                                  - Usuń
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Regular Goal Progress
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Postęp</span>
                                <span className="text-primary-500 font-medium">{goal.progress || 0}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${goal.progress || 0}%` }}
                                ></div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateGoalProgress(goal.id, (goal.progress || 0) - 10)}
                                  className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                                  disabled={(goal.progress || 0) <= 0}
                                >
                                  -10%
                                </button>
                                <button
                                  onClick={() => updateGoalProgress(goal.id, (goal.progress || 0) + 10)}
                                  className="text-xs px-2 py-1 bg-primary-600 hover:bg-primary-700 rounded transition-colors"
                                  disabled={(goal.progress || 0) >= 100}
                                >
                                  +10%
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-400 hover:text-red-600 transition-colors ml-4"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'themes' && (
          <div className="space-y-6 animate-fadeInUp">
          {/* Theme Creator Button */}
          <div className="text-center">
                         <button
               onClick={() => setShowThemeCreator(true)}
               className="btn-primary flex items-center gap-2 mx-auto"
             >
               <Plus className="w-5 h-5" />
               {t('themes.createCustomTheme')}
             </button>
          </div>

          {/* Preset Themes */}
          <div>
                         <h3 className="text-lg font-semibold text-gray-100 mb-4">{t('themes.readyThemes')}</h3>
            <div className="space-y-3">
              {presetThemes.map((theme) => (
                <div
                  key={theme.id}
                  className="card p-4 cursor-pointer hover:bg-gray-750 transition-all duration-200"
                  onClick={() => applyTheme(theme)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white"
                          style={{ backgroundColor: theme.colors.primary }}
                        ></div>
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white"
                          style={{ backgroundColor: theme.colors.secondary }}
                        ></div>
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white"
                          style={{ backgroundColor: theme.colors.accent }}
                        ></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-100">{theme.name}</h4>
                        <p className="text-sm text-gray-400">Kliknij aby zastosować</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          exportTheme(theme)
                        }}
                        className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Themes */}
          {getCustomThemes().length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Twoje motywy</h3>
              <div className="space-y-3">
                {getCustomThemes().map((theme) => (
                  <div
                    key={theme.id}
                    className="card p-4 cursor-pointer hover:bg-gray-750 transition-all duration-200"
                    onClick={() => applyTheme(theme)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white"
                            style={{ backgroundColor: theme.colors.primary }}
                          ></div>
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white"
                            style={{ backgroundColor: theme.colors.secondary }}
                          ></div>
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white"
                            style={{ backgroundColor: theme.colors.accent }}
                          ></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-100">{theme.name}</h4>
                          <p className="text-sm text-gray-400">Kliknij aby zastosować</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            exportTheme(theme)
                          }}
                          className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteCustomTheme(theme.id)
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Theme */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Importuj motyw</h3>
            <div className="space-y-4">
              <input
                type="file"
                accept=".json"
                onChange={importTheme}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700"
              />
              <p className="text-sm text-gray-400">
                Wybierz plik .json z motywem aby go zaimportować
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeInUp">
          {/* Dark Mode Toggle */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {state.theme.darkMode ? <Moon className="w-5 h-5 text-primary-500" /> : <Sun className="w-5 h-5 text-primary-500" />}
                                 <div>
                   <h3 className="font-medium text-gray-100">{t('settings.darkMode')}</h3>
                   <p className="text-sm text-gray-400">{t('settings.darkModeDesc')}</p>
                 </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.theme.darkMode ? 'bg-primary-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.theme.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* App Settings */}
          <div className="card">
                         <h3 className="text-lg font-semibold text-gray-100 mb-4">{t('settings.appSettings')}</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Bell className="w-5 h-5 text-primary-500" />
                   <span className="text-gray-300">{t('settings.notifications')}</span>
                 </div>
                 <button className="w-12 h-6 bg-primary-600 rounded-full relative">
                   <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                 </button>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Zap className="w-5 h-5 text-primary-500" />
                   <span className="text-gray-300">{t('settings.sounds')}</span>
                 </div>
                 <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                   <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                 </button>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Shield className="w-5 h-5 text-primary-500" />
                   <span className="text-gray-300">{t('settings.privateMode')}</span>
                 </div>
                 <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                   <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                 </button>
               </div>
             </div>
          </div>

          {/* Language & Region */}
          <div className="card">
                         <h3 className="text-lg font-semibold text-gray-100 mb-4">{t('settings.languageRegion')}</h3>
            <div className="space-y-4">
                             <div>
                 <label className="block text-sm font-medium text-gray-400 mb-2">{t('settings.language')}</label>
                 <select 
                   className="input-field"
                   value={state.language}
                   onChange={(e) => setLanguage(e.target.value)}
                 >
                   <option value="polish">Polski</option>
                   <option value="english">English</option>
                 </select>
               </div>
                             <div>
                 <label className="block text-sm font-medium text-gray-400 mb-2">{t('settings.timezone')}</label>
                 <select className="input-field">
                   <option>{t('settings.timezoneWarsaw')}</option>
                   <option>{t('settings.timezoneLondon')}</option>
                   <option>{t('settings.timezoneNewYork')}</option>
                 </select>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
          <div className="space-y-6 animate-fadeInUp">
          {/* Data Overview */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary-500" />
              Przegląd danych
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-300">Zadania</span>
                <span className="text-primary-500 font-semibold">{state.tasks?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-300">Sesje focus</span>
                <span className="text-primary-500 font-semibold">{state.focus?.sessions?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-300">Dane zdrowia</span>
                <span className="text-primary-500 font-semibold">Aktywne</span>
              </div>
            </div>
          </div>

          {/* Data Actions */}
          <div className="space-y-4">
            <button
              onClick={() => setShowExportModal(true)}
              className="card w-full text-left hover-lift cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 text-primary-500" />
                <div>
                  <h4 className="font-semibold text-gray-100">Eksportuj wszystkie dane</h4>
                  <p className="text-sm text-gray-400">Pobierz kopię zapasową</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="card w-full text-left hover-lift cursor-pointer border-red-500/20 hover:border-red-500/40"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-6 h-6 text-red-500" />
                <div>
                  <h4 className="font-semibold text-red-400">Wyczyść wszystkie dane</h4>
                  <p className="text-sm text-red-400/70">Uwaga: tej operacji nie można cofnąć!</p>
                </div>
              </div>
            </button>
          </div>

          {/* Storage Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Przestrzeń dyskowa</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Użyte</span>
                <span className="text-primary-500">2.4 MB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <p className="text-sm text-gray-400">Z 16 MB dostępnych</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeInUp">
          {/* Achievement Hero Section */}
          <div className="card text-center bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30 p-4 sm:p-6">
            <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">🏆</div>
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-1 sm:mb-2">Achievement Center</h2>
            <p className="text-sm sm:text-base text-gray-300">Track your progress and unlock rewards</p>
          </div>

          {/* Achievement Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div className="card text-center p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-yellow-500 mb-1">
                {state.streaks?.longestStreak >= 7 ? '🔥' : '⭐'}
              </div>
              <div className="text-base sm:text-lg font-bold text-gray-100">{state.streaks?.longestStreak || 0}</div>
              <div className="text-xs text-gray-400">Best Streak</div>
            </div>
            <div className="card text-center p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-blue-500 mb-1">
                {state.focus?.sessions?.length >= 10 ? '⚡' : '🎯'}
              </div>
              <div className="text-base sm:text-lg font-bold text-gray-100">{state.focus?.sessions?.length || 0}</div>
              <div className="text-xs text-gray-400">Focus Sessions</div>
            </div>
            <div className="card text-center p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-green-500 mb-1">
                {state.tasks?.filter(t => t.completed).length >= 50 ? '🏆' : '✅'}
              </div>
              <div className="text-base sm:text-lg font-bold text-gray-100">{state.tasks?.filter(t => t.completed).length || 0}</div>
              <div className="text-xs text-gray-400">Tasks Done</div>
            </div>
            <div className="card text-center p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-purple-500 mb-1">
                {(state.health?.dailyFoodLog?.length || 0) >= 20 ? '🍎' : '🥗'}
              </div>
              <div className="text-base sm:text-lg font-bold text-gray-100">{state.health?.dailyFoodLog?.length || 0}</div>
              <div className="text-xs text-gray-400">Meals Logged</div>
            </div>
          </div>

          {/* Achievement Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Productivity Achievements */}
            <div className="card p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="text-sm sm:text-base">Productivity Master</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {/* Streak Achievements */}
                {state.streaks?.longestStreak >= 3 && (
                  <div className="flex items-center p-2 sm:p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30 touch-manipulation">
                    <div className="text-xl sm:text-2xl mr-2 sm:mr-3">🔥</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-orange-400 truncate">Streak Starter</div>
                      <div className="text-xs text-orange-400/70">Complete 3 days in a row</div>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">{state.streaks?.longestStreak}/3</div>
                  </div>
                )}
                
                {state.streaks?.longestStreak >= 7 && (
                  <div className="flex items-center p-2 sm:p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30 touch-manipulation">
                    <div className="text-xl sm:text-2xl mr-2 sm:mr-3">🔥</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-yellow-400 truncate">Streak Master</div>
                      <div className="text-xs text-yellow-400/70">Complete 7 days in a row</div>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">{state.streaks?.longestStreak}/7</div>
                  </div>
                )}

                {state.streaks?.longestStreak >= 30 && (
                  <div className="flex items-center p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 touch-manipulation">
                    <div className="text-xl sm:text-2xl mr-2 sm:mr-3">👑</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-purple-400 truncate">Streak Legend</div>
                      <div className="text-xs text-purple-400/70">Complete 30 days in a row</div>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">{state.streaks?.longestStreak}/30</div>
                  </div>
                )}

                {/* Task Achievements */}
                {state.tasks?.filter(t => t.completed).length >= 10 && (
                  <div className="flex items-center p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                    <div className="text-2xl mr-3">✅</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-400">Task Completer</div>
                      <div className="text-xs text-green-400/70">Complete 10 tasks</div>
                    </div>
                    <div className="text-xs text-gray-400">{state.tasks?.filter(t => t.completed).length}/10</div>
                  </div>
                )}

                {state.tasks?.filter(t => t.completed).length >= 50 && (
                  <div className="flex items-center p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30">
                    <div className="text-2xl mr-3">🏆</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-emerald-400">Task Master</div>
                      <div className="text-xs text-emerald-400/70">Complete 50 tasks</div>
                    </div>
                    <div className="text-xs text-gray-400">{state.tasks?.filter(t => t.completed).length}/50</div>
                  </div>
                )}

                {state.tasks?.filter(t => t.completed).length >= 100 && (
                  <div className="flex items-center p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                    <div className="text-2xl mr-3">💎</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-cyan-400">Task Legend</div>
                      <div className="text-xs text-cyan-400/70">Complete 100 tasks</div>
                    </div>
                    <div className="text-xs text-gray-400">{state.tasks?.filter(t => t.completed).length}/100</div>
                  </div>
                )}
              </div>
            </div>

            {/* Focus & Wellness Achievements */}
            <div className="card p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                <span className="text-sm sm:text-base">Focus & Wellness</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {state.focus?.sessions?.length >= 5 && (
                  <div className="flex items-center p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg border border-blue-500/30">
                    <div className="text-2xl mr-3">🎯</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-400">Focus Beginner</div>
                      <div className="text-xs text-blue-400/70">Complete 5 focus sessions</div>
                    </div>
                    <div className="text-xs text-gray-400">{state.focus?.sessions?.length}/5</div>
                  </div>
                )}

                {state.focus?.sessions?.length >= 25 && (
                  <div className="flex items-center p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30">
                    <div className="text-2xl mr-3">⚡</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-indigo-400">Focus Master</div>
                      <div className="text-xs text-indigo-400/70">Complete 25 focus sessions</div>
                    </div>
                    <div className="text-xs text-gray-400">{state.focus?.sessions?.length}/25</div>
                  </div>
                )}

                {state.focus?.sessions?.length >= 50 && (
                  <div className="flex items-center p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                    <div className="text-2xl mr-3">🧠</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-purple-400">Focus Legend</div>
                      <div className="text-xs text-purple-400/70">Complete 50 focus sessions</div>
                    </div>
                    <div className="text-xs text-gray-400">{state.focus?.sessions?.length}/50</div>
                  </div>
                )}

                {/* Health Achievements */}
                {(state.health?.dailyFoodLog?.length || 0) >= 10 && (
                  <div className="flex items-center p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                    <div className="text-2xl mr-3">🥗</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-400">Nutrition Tracker</div>
                      <div className="text-xs text-green-400/70">Log 10 meals</div>
                    </div>
                    <div className="text-xs text-gray-400">{state.health?.dailyFoodLog?.length}/10</div>
                  </div>
                )}

                {(state.health?.dailyFoodLog?.length || 0) >= 50 && (
                  <div className="flex items-center p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30">
                    <div className="text-2xl mr-3">🍎</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-emerald-400">Health Enthusiast</div>
                      <div className="text-xs text-emerald-400/70">Log 50 meals</div>
                    </div>
                    <div className="text-xs text-gray-400">{state.health?.dailyFoodLog?.length}/50</div>
                  </div>
                )}

                {/* Profile & Customization */}
                {state.profileImage && (
                  <div className="flex items-center p-3 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg border border-pink-500/30">
                    <div className="text-2xl mr-3">📸</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-pink-400">Profile Picture</div>
                      <div className="text-xs text-pink-400/70">Add a profile photo</div>
                    </div>
                    <div className="text-xs text-gray-400">✓</div>
                  </div>
                )}

                {getCustomThemes().length >= 1 && (
                  <div className="flex items-center p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg border border-violet-500/30">
                    <div className="text-2xl mr-3">🎨</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-violet-400">Theme Creator</div>
                      <div className="text-xs text-violet-400/70">Create a custom theme</div>
                    </div>
                    <div className="text-xs text-gray-400">{getCustomThemes().length}/1</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Achievements */}
          <div className="card p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="text-sm sm:text-base">Progress Tracking</span>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {/* Streak Goals */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20 touch-manipulation">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-medium text-gray-100 truncate">Streak Warrior</h4>
                    <p className="text-xs sm:text-sm text-gray-400">Utrzymaj streak przez 14 dni</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs sm:text-sm text-orange-400">
                      {Math.min(state.streaks?.currentStreak || 0, 14)}/14
                    </div>
                    <div className="w-16 sm:w-20 bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(((state.streaks?.currentStreak || 0) / 14) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Focus Goals */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-500/20 touch-manipulation">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-medium text-gray-100 truncate">Focus Master</h4>
                    <p className="text-xs sm:text-sm text-gray-400">Ukończ 25 sesji focus</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs sm:text-sm text-blue-400">
                      {Math.min(state.focus?.sessions?.length || 0, 25)}/25
                    </div>
                    <div className="w-16 sm:w-20 bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(((state.focus?.sessions?.length || 0) / 25) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Task Goals */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20 touch-manipulation">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-medium text-gray-100 truncate">Task Legend</h4>
                    <p className="text-xs sm:text-sm text-gray-400">Ukończ 100 zadań</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs sm:text-sm text-green-400">
                      {Math.min(state.tasks?.filter(t => t.completed).length || 0, 100)}/100
                    </div>
                    <div className="w-16 sm:w-20 bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(((state.tasks?.filter(t => t.completed).length || 0) / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Goals */}
              <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-100">Health Champion</h4>
                    <p className="text-sm text-gray-400">Śledź zdrowie przez 30 dni</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-cyan-400">
                      {state.health?.lastExerciseDate ? Math.min(15, 30) : 0}/30
                    </div>
                    <div className="w-20 bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${state.health?.lastExerciseDate ? 50 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Goals */}
              <div className="p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-100">Theme Artist</h4>
                    <p className="text-sm text-gray-400">Stwórz 5 własnych motywów</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-violet-400">
                      {Math.min(getCustomThemes().length, 5)}/5
                    </div>
                    <div className="w-20 bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(getCustomThemes().length / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Categories */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Kategorie osiągnięć</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                <div className="text-center">
                  <div className="text-2xl mb-2">🔥</div>
                  <h4 className="font-medium text-gray-100 mb-1">Streak</h4>
                  <div className="text-sm text-orange-400">
                    {state.streaks?.longestStreak || 0} dni
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-500/20">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-medium text-gray-100 mb-1">Focus</h4>
                  <div className="text-sm text-blue-400">
                    {state.focus?.sessions?.length || 0} sesji
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                <div className="text-center">
                  <div className="text-2xl mb-2">✅</div>
                  <h4 className="font-medium text-gray-100 mb-1">Tasks</h4>
                  <div className="text-sm text-green-400">
                    {state.tasks?.filter(t => t.completed).length || 0} ukończonych
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <h4 className="font-medium text-gray-100 mb-1">Customization</h4>
                  <div className="text-sm text-purple-400">
                    {getCustomThemes().length} motywów
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Summary */}
          <div className="card bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border-yellow-500/20">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Achievement Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-1">
                  {(() => {
                    const achievements = []
                    if (state.streaks?.longestStreak >= 3) achievements.push('Streak Starter')
                    if (state.streaks?.longestStreak >= 7) achievements.push('Streak Master')
                    if (state.streaks?.longestStreak >= 30) achievements.push('Streak Legend')
                    if (state.focus?.sessions?.length >= 5) achievements.push('Focus Beginner')
                    if (state.focus?.sessions?.length >= 25) achievements.push('Focus Master')
                    if (state.focus?.sessions?.length >= 50) achievements.push('Focus Legend')
                    if (state.tasks?.filter(t => t.completed).length >= 10) achievements.push('Task Completer')
                    if (state.tasks?.filter(t => t.completed).length >= 50) achievements.push('Task Master')
                    if (state.tasks?.filter(t => t.completed).length >= 100) achievements.push('Task Legend')
                    if ((state.health?.dailyFoodLog?.length || 0) >= 10) achievements.push('Nutrition Tracker')
                    if ((state.health?.dailyFoodLog?.length || 0) >= 50) achievements.push('Health Enthusiast')
                    if (state.profileImage) achievements.push('Profile Picture')
                    if (getCustomThemes().length >= 1) achievements.push('Theme Creator')
                    return achievements.length
                  })()}
                </div>
                <div className="text-sm text-yellow-400">Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">13</div>
                <div className="text-sm text-blue-400">Total Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-1">
                  {Math.round(((() => {
                    const achievements = []
                    if (state.streaks?.longestStreak >= 3) achievements.push('Streak Starter')
                    if (state.streaks?.longestStreak >= 7) achievements.push('Streak Master')
                    if (state.streaks?.longestStreak >= 30) achievements.push('Streak Legend')
                    if (state.focus?.sessions?.length >= 5) achievements.push('Focus Beginner')
                    if (state.focus?.sessions?.length >= 25) achievements.push('Focus Master')
                    if (state.focus?.sessions?.length >= 50) achievements.push('Focus Legend')
                    if (state.tasks?.filter(t => t.completed).length >= 10) achievements.push('Task Completer')
                    if (state.tasks?.filter(t => t.completed).length >= 50) achievements.push('Task Master')
                    if (state.tasks?.filter(t => t.completed).length >= 100) achievements.push('Task Legend')
                    if ((state.health?.dailyFoodLog?.length || 0) >= 10) achievements.push('Nutrition Tracker')
                    if ((state.health?.dailyFoodLog?.length || 0) >= 50) achievements.push('Health Enthusiast')
                    if (state.profileImage) achievements.push('Profile Picture')
                    if (getCustomThemes().length >= 1) achievements.push('Theme Creator')
                    return achievements.length
                  })() / 13) * 100)}%
                </div>
                <div className="text-sm text-green-400">Completion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-1">
                  {(() => {
                    let rank = 'Beginner'
                    const unlockedCount = (() => {
                      const achievements = []
                      if (state.streaks?.longestStreak >= 3) achievements.push('Streak Starter')
                      if (state.streaks?.longestStreak >= 7) achievements.push('Streak Master')
                      if (state.streaks?.longestStreak >= 30) achievements.push('Streak Legend')
                      if (state.focus?.sessions?.length >= 5) achievements.push('Focus Beginner')
                      if (state.focus?.sessions?.length >= 25) achievements.push('Focus Master')
                      if (state.focus?.sessions?.length >= 50) achievements.push('Focus Legend')
                      if (state.tasks?.filter(t => t.completed).length >= 10) achievements.push('Task Completer')
                      if (state.tasks?.filter(t => t.completed).length >= 50) achievements.push('Task Master')
                      if (state.tasks?.filter(t => t.completed).length >= 100) achievements.push('Task Legend')
                      if ((state.health?.dailyFoodLog?.length || 0) >= 10) achievements.push('Nutrition Tracker')
                      if ((state.health?.dailyFoodLog?.length || 0) >= 50) achievements.push('Health Enthusiast')
                      if (state.profileImage) achievements.push('Profile Picture')
                      if (getCustomThemes().length >= 1) achievements.push('Theme Creator')
                      return achievements.length
                    })()
                    
                    if (unlockedCount >= 10) rank = 'Legend'
                    else if (unlockedCount >= 7) rank = 'Expert'
                    else if (unlockedCount >= 4) rank = 'Pro'
                    else if (unlockedCount >= 2) rank = 'Novice'
                    
                    return rank
                  })()}
                </div>
                <div className="text-sm text-purple-400">Rank</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Creator Modal */}
      {showThemeCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4 sm:my-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-100">Stwórz własny motyw</h3>
                <button
                  onClick={() => setShowThemeCreator(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theme Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Nazwa motywu</label>
                <input
                  type="text"
                  value={customTheme.name}
                  onChange={(e) => setCustomTheme(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Nazwa motywu"
                />
              </div>

              {/* Color Picker */}
              <div className="space-y-4 mb-6">
                {Object.entries(customTheme).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-12 h-10 rounded border-2 border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, [key]: e.target.value }))}
                        className="input-field flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={createCustomTheme}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Zapisz motyw
                </button>
                <button
                  onClick={() => setShowThemeCreator(false)}
                  className="btn-secondary flex-1"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Data Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md p-4 sm:p-6 my-4 sm:my-0">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Eksportuj dane</h3>
            <p className="text-gray-400 mb-6">
              Pobierzesz plik JSON ze wszystkimi swoimi danymi. Możesz go użyć do tworzenia kopii zapasowej lub przeniesienia na inne urządzenie.
            </p>
            <div className="flex gap-3">
              <button
                onClick={exportAllData}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Eksportuj
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="btn-secondary flex-1"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

              {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md p-4 sm:p-6 my-4 sm:my-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-100">Edytuj profil</h3>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Nazwa profilu</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="input-field"
                  placeholder="Twoja nazwa"
                />
              </div>

              {/* Profile Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Zdjęcie profilowe</label>
                <div className="flex items-center gap-4">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary-600"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={triggerFileInput}
                      className="btn-secondary text-sm py-2 px-3 flex items-center gap-2"
                    >
                      {profileImage ? <Edit3 className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                      {profileImage ? 'Zmień' : 'Dodaj'}
                    </button>
                    {profileImage && (
                      <button
                        onClick={removeProfileImage}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        Usuń
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={saveProfileChanges}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Zapisz zmiany
                </button>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="btn-secondary flex-1"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Data Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md p-4 sm:p-6 my-4 sm:my-0">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Uwaga!</h3>
              <p className="text-gray-400 mb-6">
                Czy na pewno chcesz usunąć wszystkie dane? Ta operacja usunie wszystkie zadania, sesje focus, dane zdrowia i ustawienia. Tej operacji nie można cofnąć!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={clearAllData}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex-1"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Usuń wszystko
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-secondary flex-1"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Goal Modal */}
        {showGoalForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md p-4 sm:p-6 my-4 sm:my-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-100">Dodaj nowy cel</h3>
                <button
                  onClick={() => setShowGoalForm(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Goal Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tytuł celu</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Np. Nauczyć się nowego języka"
                  />
                </div>

                {/* Goal Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Opis (opcjonalnie)</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field"
                    rows="3"
                    placeholder="Opisz swój cel bardziej szczegółowo..."
                  />
                </div>

                {/* Financial Goal Checkbox */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newGoal.isFinancial}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, isFinancial: e.target.checked }))}
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-300">💰 Cel finansowy</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-7">Zaznacz, jeśli chcesz śledzić kwoty pieniędzy</p>
                </div>

                {/* Target Amount (only for financial goals) */}
                {newGoal.isFinancial && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Docelowa kwota (zł)</label>
                    <input
                      type="number"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) || '' }))}
                      className="input-field"
                      placeholder="Np. 10000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}

                {/* Target Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Data docelowa (opcjonalnie)</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={addGoal}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={!newGoal.title.trim()}
                >
                  <Save className="w-4 h-4" />
                  Dodaj cel
                </button>
                <button
                  onClick={() => setShowGoalForm(false)}
                  className="btn-secondary flex-1"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    )
  }
