import React, { useState, useEffect } from 'react'
import { Target, Calendar, Zap, Heart, Shield, Star, Moon, Sun, Palette, CheckCircle, Circle, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export default function Home() {
  const { state, dispatch, updateMetadata } = useApp()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [currentQuote, setCurrentQuote] = useState('')
  const [currentQuoteAuthor, setCurrentQuoteAuthor] = useState('')
  const [timeUntilEndOfDay, setTimeUntilEndOfDay] = useState({ hours: 0, minutes: 0, seconds: 0 })
  


  // Collection of motivational quotes
  const motivationalQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Make each day your masterpiece.", author: "John Wooden" },
    { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
    { text: "Every expert was once a beginner.", author: "Robert T. Kiyosaki" },
    { text: "The only way to achieve the impossible is to believe it is possible.", author: "Charles Kingsleigh" },
    { text: "Your potential is limitless. Invest in yourself.", author: "Unknown" },
    { text: "Today's accomplishments were yesterday's impossibilities.", author: "Robert H. Schuller" },
    { text: "The best revenge is massive success.", author: "Frank Sinatra" },
    { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
    { text: "The only person you should try to be better than is the person you were yesterday.", author: "Unknown" },
    { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
    { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
    { text: "The only limit is your mind.", author: "Unknown" },
    { text: "Every day is a new beginning.", author: "Unknown" },
    { text: "You are capable of amazing things.", author: "Unknown" },
    { text: "The power of imagination makes us infinite.", author: "John Muir" },
    { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
    { text: "The only way to have a good day is to start it with a good attitude.", author: "Unknown" },
    { text: "Your attitude determines your direction.", author: "Unknown" },
    { text: "The best project you'll ever work on is you.", author: "Unknown" },
    { text: "Make today amazing.", author: "Unknown" },
    { text: "You've got this!", author: "Unknown" },
    { text: "Today is your day!", author: "Unknown" },
    { text: "Keep going, keep growing.", author: "Unknown" },
    { text: "You are stronger than you think.", author: "Unknown" },
    { text: "Every step forward is a victory.", author: "Unknown" },
    { text: "The best is yet to come.", author: "Unknown" }
  ]

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    return motivationalQuotes[randomIndex]
  }

  // Set a new quote when component mounts or when returning to home
  useEffect(() => {
    const quote = getRandomQuote()
    setCurrentQuote(quote.text)
    setCurrentQuoteAuthor(quote.author)
  }, [])

  // Rotate quote daily
  useEffect(() => {
    const today = new Date().toDateString()
    const dayIndex = new Date(today).getTime() % motivationalQuotes.length
    // setCurrentQuoteIndex(dayIndex) // This line is removed as per the new_code, as the quote is now random.
  }, [motivationalQuotes.length])

  // Calculate time until end of day and auto-uncheck tasks
  useEffect(() => {
    const calculateTimeUntilEndOfDay = () => {
      const now = new Date()
      const endOfDay = new Date(now)
      endOfDay.setHours(23, 59, 59, 999)
      
      const diff = endOfDay - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeUntilEndOfDay({ hours, minutes, seconds })
    }

    // Check if it's a new day and uncheck all tasks
    const checkNewDay = () => {
      const lastCheckDate = state.metadata?.lastTaskCheckDate
      const today = new Date().toDateString()
      
      if (lastCheckDate !== today) {
        // It's a new day, uncheck all tasks
        if (state.tasks && state.tasks.length > 0) {
          const todayTasks = state.tasks.filter(task => {
            const taskDate = new Date(task.date || Date.now()).toDateString()
            return taskDate === today
          })
          
          todayTasks.forEach(task => {
            if (task.completed) {
              dispatch({ type: 'TOGGLE_TASK', payload: task.id })
            }
          })
        }
        updateMetadata({ lastTaskCheckDate: today })
      }
    }

    // Initial calculations
    calculateTimeUntilEndOfDay()
    checkNewDay()

    // Update timer every second
    const timer = setInterval(calculateTimeUntilEndOfDay, 1000)
    
    // Check for new day every minute
    const dayCheck = setInterval(checkNewDay, 60000)

    return () => {
      clearInterval(timer)
      clearInterval(dayCheck)
    }
  }, [state.tasks, state.metadata?.lastTaskCheckDate, dispatch, updateMetadata])

  const toggleTask = (taskId) => {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`)
    if (taskElement) {
      // Phase 1: Slight delay to show sparkle effects
      setTimeout(() => {
        taskElement.style.transition = 'opacity 0.15s ease-out'
        taskElement.style.opacity = '0'
        
        // Phase 2: Toggle state
        setTimeout(() => {
          dispatch({ type: 'TOGGLE_TASK', payload: taskId })
          
          // Phase 3: Quick fade in
          setTimeout(() => {
            const newTaskElement = document.querySelector(`[data-task-id="${taskId}"]`)
            if (newTaskElement) {
              newTaskElement.style.transition = 'opacity 0.15s ease-in'
              newTaskElement.style.opacity = '1'
            }
          }, 30)
        }, 150)
      }, 200)
    } else {
      dispatch({ type: 'TOGGLE_TASK', payload: taskId })
    }
  }

  // Helper function to check if a bonus task should show today
  const shouldShowBonusTask = (task) => {
    if (task.taskType !== 'bonus' || !task.bonusDays) return true
    const today = new Date().getDay() // 0=Sunday, 1=Monday, etc.
    return task.bonusDays.includes(today)
  }

  const getTodayTasks = () => {
    if (!state.tasks || state.tasks.length === 0) return []
    const today = new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    
    const filteredTasks = state.tasks.filter(task => {
      // For bonus tasks, check if they should show on current day (no date restriction)
      if (task.taskType === 'bonus') {
        return shouldShowBonusTask(task)
      }
      
      // Regular tasks need to match today's date
      // Handle both date formats: YYYY-MM-DD and full ISO string
      const taskDate = task.date ? 
        (task.date.includes('T') ? task.date.split('T')[0] : task.date) : 
        new Date().toISOString().split('T')[0]
      return taskDate === today
    })
    
    // Sort tasks: active tasks first, then completed tasks at the bottom
    // Within each group, respect the order set in Today tab with precise sorting
    return filteredTasks.sort((a, b) => {
      if (a.completed === b.completed) {
        // First, separate regular and bonus tasks (regular tasks come first)
        const aIsBonus = a.taskType === 'bonus'
        const bIsBonus = b.taskType === 'bonus'
        
        if (aIsBonus && !bIsBonus) return 1  // b (regular) comes before a (bonus)
        if (!aIsBonus && bIsBonus) return -1 // a (regular) comes before b (bonus)
        
        // Within the same task type, use existing ordering logic
        // If both have same completion status, sort by order (if set) or creation date
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order
        }
        // If only one has order, prioritize the one with order
        if (a.order !== undefined && b.order === undefined) {
          return -1
        }
        if (a.order === undefined && b.order !== undefined) {
          return 1
        }
        // If neither has order, sort by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      // Active tasks (false) come before completed tasks (true)
      return a.completed - b.completed
    })
  }

  const todayTasks = getTodayTasks()

  // Calendar functionality
  const [calendarEvents, setCalendarEvents] = useState([])
  const [isCalendarLoading, setIsCalendarLoading] = useState(false)
  const [showDeadlineForm, setShowDeadlineForm] = useState(false)
  const [newDeadline, setNewDeadline] = useState({
    title: '',
    date: ''
  })

  // Function to check if device supports calendar API
  const checkCalendarSupport = () => {
    return 'calendar' in navigator || 'webkitCalendar' in navigator
  }

  // Function to request calendar access and fetch today's events
  const fetchTodayEvents = async () => {
    setIsCalendarLoading(true)
    try {
      // Check if device supports calendar
      if (checkCalendarSupport()) {
        // For devices with calendar API support
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
        
        // Mock calendar events for demonstration
        // In a real app, this would use the device's calendar API
        const mockEvents = [
          {
            id: 1,
            title: 'Team Meeting',
            time: '10:00',
            type: 'meeting',
            priority: 'high'
          },
          {
            id: 2,
            title: 'Project Deadline',
            time: '17:00',
            type: 'deadline',
            date: '2024-12-25'
          },
          {
            id: 3,
            title: 'Client Call',
            time: '14:30',
            type: 'call'
          },
          {
            id: 4,
            title: 'Website Launch',
            type: 'deadline',
            date: '2024-12-20'
          },
          {
            id: 5,
            title: 'Report Submission',
            type: 'deadline',
            date: '2024-12-28'
          }
        ]
        
        setCalendarEvents(mockEvents)
      } else {
        // Fallback for devices without calendar API
        setCalendarEvents([])
      }
    } catch (error) {
      console.log('Calendar access not available:', error)
      setCalendarEvents([])
    } finally {
      setIsCalendarLoading(false)
    }
  }

  // Load calendar events when component mounts
  useEffect(() => {
    fetchTodayEvents()
  }, [])

  // Function to get event priority color
  const getEventPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400'
      case 'high':
        return 'text-orange-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-blue-400'
    }
  }

  // Function to get event type icon
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'meeting':
        return '👥'
      case 'deadline':
        return '⏰'
      case 'call':
        return '📞'
      case 'appointment':
        return '📋'
      default:
        return '📅'
    }
  }

  // Function to calculate days remaining for deadlines
  const getDaysRemaining = (dateString) => {
    const deadline = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    deadline.setHours(0, 0, 0, 0)
    
    const diffTime = deadline - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  // Function to get deadline progress percentage (shows remaining time on the right)
  const getDeadlineProgress = (dateString) => {
    const daysRemaining = getDaysRemaining(dateString)
    if (daysRemaining <= 0) return 0 // Overdue - no remaining time
    if (daysRemaining >= 30) return 100 // More than 30 days - full bar
    
    // Calculate progress: 100% = 30+ days, 0% = 0 days (deadline day)
    return Math.max(0, Math.min(100, (daysRemaining / 30) * 100))
  }

  // Function to get deadline bar color based on days remaining
  const getDeadlineBarColor = (dateString) => {
    const daysRemaining = getDaysRemaining(dateString)
    
    if (daysRemaining <= 0) return 'bg-red-500' // Overdue - Red
    if (daysRemaining <= 3) return 'bg-orange-500' // 1-3 days - Orange
    if (daysRemaining <= 7) return 'bg-yellow-500' // 4-7 days - Yellow
    if (daysRemaining <= 14) return 'bg-blue-500' // 8-14 days - Blue
    return 'bg-green-500' // 15+ days - Green
  }

  // Function to add new deadline
  const addDeadline = () => {
    if (!newDeadline.title || !newDeadline.date) return
    
    const deadline = {
      id: Date.now(),
      title: newDeadline.title,
      type: 'deadline',
      date: newDeadline.date
    }
    
    setCalendarEvents(prev => [...prev, deadline])
    setNewDeadline({ title: '', date: '' })
    setShowDeadlineForm(false)
  }

  // Get priority color based on priority level (same as Today component)
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444' // Red
      case 'high':
        return '#f97316' // Orange
      case 'medium':
        return '#fbbf24' // Yellow
      case 'low':
        return '#10b981' // Green
      default:
        return '#fbbf24' // Default yellow
    }
  }

  // No drag and drop functions needed in Home - order follows Today tab

  return (
    <div className="space-y-8 p-12 max-w-[2532px] mx-auto min-h-[1170px]">
      {/* Header with Animation */}
      <div className="animate-fadeInUp">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
                         <h1 className="text-4xl font-bold bg-gradient-to-l from-purple-400 via-violet-500 to-indigo-600 bg-clip-text text-transparent">Momentum 🚀</h1>
          </div>
          <div className="text-right max-w-xs">
            <p className="text-sm text-gray-300 italic leading-relaxed">
              "{currentQuote}"
            </p>
            <p className="text-xs text-gray-400 mt-1">— {currentQuoteAuthor}</p>
          </div>
        </div>
      </div>

      {/* Two Kafelki - Streak i Data/Pogoda */}
      <div className="grid grid-cols-2 gap-6 animate-fadeInUp animate-stagger-1">
        {/* Lewy kafelek - Streak */}
        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-500 backdrop-blur-sm">
          <div className="text-center">
                         <div 
                           className="text-4xl mb-3 cursor-pointer relative" 
                           style={{ 
                             animation: 'flameSway 2s ease-in-out infinite, flicker 1.2s ease-in-out infinite',
                             filter: 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.9))'
                           }}
                         >
                           🔥
                           <style jsx>{`
                             @keyframes flameSway {
                               0% { transform: translateX(-3px) rotate(-2deg) scale(1); }
                               25% { transform: translateX(1px) rotate(-1deg) scale(1.05); }
                               50% { transform: translateX(3px) rotate(0deg) scale(1.1); }
                               75% { transform: translateX(1px) rotate(1deg) scale(1.05); }
                               100% { transform: translateX(-3px) rotate(-2deg) scale(1); }
                             }
                             @keyframes flicker {
                               0% { opacity: 1; filter: brightness(1) drop-shadow(0 0 15px rgba(255, 165, 0, 0.9)); }
                               25% { opacity: 0.95; filter: brightness(1.1) drop-shadow(0 0 18px rgba(255, 69, 0, 0.8)); }
                               50% { opacity: 0.9; filter: brightness(1.3) drop-shadow(0 0 20px rgba(255, 0, 0, 0.9)); }
                               75% { opacity: 0.95; filter: brightness(1.1) drop-shadow(0 0 18px rgba(255, 69, 0, 0.8)); }
                               100% { opacity: 1; filter: brightness(1) drop-shadow(0 0 15px rgba(255, 165, 0, 0.9)); }
                             }
                           `}</style>
                         </div>
            <h2 className="text-2xl font-bold text-orange-400 mb-2">
              {state.streaks?.currentStreak || 0} {t('home.days')}
            </h2>
            <p className="text-gray-300 text-sm mb-3">{t('home.currentStreak')}</p>
            <div className="text-sm text-orange-400 font-medium">
              {t('home.progress')}: 30 {t('home.days')} ({Math.round(((state.streaks?.currentStreak || 0) / 30 * 100))}%)
            </div>
          </div>
        </div>
        
        {/* Prawy kafelek - Data i Pogoda */}
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-500 backdrop-blur-sm">
          <div className="text-right">
            <div className="text-4xl mb-3">☀️</div>
            <h2 className="text-2xl font-bold text-blue-400 mb-2">
              {new Date().toLocaleDateString('pl-PL', { weekday: 'long' })}
            </h2>
            <p className="text-gray-300 text-sm mb-3">
              {new Date().toLocaleDateString('pl-PL', { 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
            <div className="text-sm text-blue-400 font-medium">
              {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Progress with Animation - ABOVE Last 7 Days */}
      <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-3xl p-8 animate-fadeInUp animate-stagger-3 hover:scale-105 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
        
        {/* Timer to End of Day */}
        <div className="mb-8 p-6 bg-gray-800/50 rounded-2xl border border-green-500/20 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-3 font-medium">⏰ {t('home.timeRemaining')}:</div>
            <div className="flex justify-center items-center gap-4 text-2xl font-bold text-green-400">
              <div className="text-center">
                <div className="text-4xl font-extrabold">{timeUntilEndOfDay.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 font-medium">{t('home.hours')}</div>
              </div>
              <div className="text-3xl text-gray-500 font-bold">:</div>
              <div className="text-center">
                <div className="text-4xl font-extrabold">{timeUntilEndOfDay.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 font-medium">{t('home.minutes')}</div>
              </div>
              <div className="text-3xl text-gray-500 font-bold">:</div>
              <div className="text-center">
                <div className="text-4xl font-extrabold">{timeUntilEndOfDay.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 font-medium">{t('home.seconds')}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tasks List */}
        <div 
          className={`space-y-3 ${todayTasks.length > 3 ? 'max-h-80 overflow-y-auto pr-2' : ''}`}
          style={todayTasks.length > 3 ? {
            scrollbarWidth: 'thin',
            scrollbarColor: '#4b5563 #1f2937'
          } : {}}
        >
          {todayTasks.map((task, index) => (
                         <div 
               key={task.id} 
               data-task-id={task.id}
               className={`flex items-center gap-4 p-4 rounded-xl hover:bg-gray-750/80 transition-all duration-300 backdrop-blur-sm border border-gray-700/30 cursor-pointer`}
               style={{ 
                 backgroundColor: task.priorityColor ? `${task.priorityColor}20` : '#1f2937'
               }}
               onClick={() => toggleTask(task.id)}
            >
              <div className="flex-shrink-0 hover:scale-110 transition-transform duration-200">
                {task.completed ? (
                  <div className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 relative group">
                    <CheckCircle size={24} className="group-hover:scale-110 transition-transform duration-200" />
                    {/* Completion sparkle effect */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '0ms' }}></div>
                      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-200 rounded-full animate-ping opacity-75" style={{ animationDelay: '200ms' }}></div>
                      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '400ms' }}></div>
                      <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-amber-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-amber-300 hover:text-amber-200 transition-all duration-300 group relative">
                    <Circle size={24} className="group-hover:scale-110 transition-transform duration-200" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))' }} />
                    {/* Sparkle effect container */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0ms' }}></div>
                      <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-amber-200 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '150ms' }}></div>
                      <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 flex items-center gap-3">
                <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                  {task.title}
                </span>
                
                {/* Bonus task indicator */}
                {task.taskType === 'bonus' && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full border border-purple-500/30">
                    ⭐ Bonus
                  </span>
                )}
                
                {task.time && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                    ⏰ {task.time}
                  </span>
                )}
              </div>
              
              

            </div>
          ))}
          {todayTasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-lg font-medium">Brak zadań na dziś</p>
              <p className="text-sm text-gray-500">Dodaj zadania w sekcji "Today"</p>
            </div>
          )}
        </div>


      </div>



      {/* Quick Actions with Animation */}
      <div className="grid grid-cols-2 gap-6 animate-fadeInUp animate-stagger-5">
        <button 
          onClick={() => navigate('/focus')}
          className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-3xl p-8 text-center hover:scale-105 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm cursor-pointer group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🧠</div>
          <h3 className="font-semibold text-gray-100 text-xl mb-3">{t('focus.title')}</h3>
          <p className="text-sm text-gray-300 mb-4">{t('focus.startFocus')}</p>
          <div className="w-12 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto group-hover:w-16 transition-all duration-300"></div>
        </button>
        
        <button 
          onClick={() => navigate('/health?tab=food')}
          className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-3xl p-8 text-center hover:scale-105 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm cursor-pointer group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🥗</div>
          <h3 className="font-semibold text-gray-100 text-xl mb-3">{t('health.addMeal')}</h3>
          <p className="text-sm text-gray-300 mb-4">{t('health.trackNutrition')}</p>
          <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto group-hover:w-16 transition-all duration-300"></div>
        </button>
      </div>

      {/* Health & Wellness Quick Access */}
      <div className="grid grid-cols-3 gap-6 animate-fadeInUp animate-stagger-6">
        <button 
          onClick={() => navigate('/profile?tab=goals')}
          className="bg-gradient-to-br from-rose-600/20 to-pink-600/20 border border-rose-500/30 rounded-2xl p-6 text-center hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🎯</div>
          <h3 className="font-semibold text-gray-100 text-base md:text-base text-sm">{t('navigation.goals')}</h3>
        </button>
        
        <button 
          onClick={() => navigate('/health?tab=sobriety')}
          className="bg-gradient-to-br from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-2xl p-6 text-center hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🍃</div>
          <h3 className="font-semibold text-gray-100 text-base md:text-base text-sm">{t('health.sobriety')}</h3>
        </button>
        
        <button 
          onClick={() => navigate('/profile?tab=achievements')}
          className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🏆</div>
          <h3 className="font-semibold text-gray-100 text-base md:text-base text-sm">{t('navigation.achievements')}</h3>
        </button>
      </div>



      {/* Today's Calendar & Deadlines */}
      <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-4 animate-fadeInUp animate-stagger-7 hover:scale-105 hover:shadow-xl transition-all duration-500 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Kalendarz
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeadlineForm(!showDeadlineForm)}
              className="text-blue-400 hover:text-blue-300 transition-colors text-xs px-2 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30"
            >
              + Deadline
            </button>
            <button
              onClick={fetchTodayEvents}
              className="text-blue-400 hover:text-blue-300 transition-colors text-xs"
              disabled={isCalendarLoading}
            >
              {isCalendarLoading ? '...' : 'Odśwież'}
            </button>
          </div>
        </div>
        
        {showDeadlineForm && (
          <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-gray-100 mb-3">Dodaj nowy deadline</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nazwa deadline'u"
                value={newDeadline.title}
                onChange={(e) => setNewDeadline(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              <input
                type="date"
                value={newDeadline.date}
                onChange={(e) => setNewDeadline(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:border-blue-400"
              />

              <div className="flex gap-2">
                <button
                  onClick={addDeadline}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Dodaj
                </button>
                <button
                  onClick={() => setShowDeadlineForm(false)}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        {isCalendarLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-gray-400 mt-1 text-xs">Ładowanie...</p>
          </div>
        ) : calendarEvents.length > 0 ? (
          <div className="space-y-2">
            {calendarEvents.slice(0, 5).map((event) => (
              <div 
                key={event.id}
                className="flex items-center gap-3 p-3 bg-white/10 dark:bg-gray-800/40 rounded-lg backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <div className="text-lg">{getEventTypeIcon(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-100 text-sm truncate">{event.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    {event.time && <span>⏰ {event.time}</span>}
                    {event.time && <span>•</span>}
                    <span className="capitalize">{event.type}</span>
                    {event.date && event.type === 'deadline' && (
                      <>
                        <span>•</span>
                        <span>📅 {new Date(event.date).toLocaleDateString('pl-PL')}</span>
                      </>
                    )}
                  </div>
                  {event.date && event.type === 'deadline' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          {getDaysRemaining(event.date) > 0 
                            ? `${getDaysRemaining(event.date)} dni pozostało`
                            : getDaysRemaining(event.date) === 0
                            ? 'Dzisiaj!'
                            : `${Math.abs(getDaysRemaining(event.date))} dni po terminie`
                          }
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 relative">
                        {/* Gray background for elapsed time */}
                        <div className="absolute inset-0 bg-gray-500 rounded-full"></div>
                        {/* Colored bar for remaining time (positioned from right) */}
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getDeadlineBarColor(event.date)}`}
                          style={{ 
                            width: `${getDeadlineProgress(event.date)}%`,
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            borderTopRightRadius: '0.5rem',
                            borderBottomRightRadius: '0.5rem'
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {calendarEvents.length > 5 && (
              <div className="text-center py-2">
                <span className="text-xs text-gray-400">+{calendarEvents.length - 5} więcej wydarzeń</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-3">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Brak wydarzeń</h3>
            <button
              onClick={fetchTodayEvents}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-colors"
            >
              Sprawdź
            </button>
          </div>
        )}
        
        {/* Calendar Integration Info */}
        <div className="mt-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2">
            <div className="text-blue-400 text-sm">ℹ️</div>
            <div className="text-xs text-blue-300">
              <strong>Kalendarz:</strong> Synchronizacja z urządzeniem
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}
