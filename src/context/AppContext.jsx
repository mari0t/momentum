import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state
const initialState = {
  tasks: [],
  health: {
    caloriesConsumed: 0,
    caloriesTarget: 2000,
    sobrietyData: {
      startDate: null,
      showDetailedTime: false
    },
    dailyFoodLog: [],
    calorieGoal: 2000
  },
  focus: {
    sessions: [],
    doNotDisturb: false
  },
  streaks: {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null
  },
  theme: {
    darkMode: true,
    colorScheme: 'purple',
    customThemes: []
  },
  profile: {
    name: 'Użytkownik',
    longTermGoals: []
  },
  routines: {
    morning: [
      { id: 'base-morning-1', title: 'Drink water', time: '6:00', period: 'morning', completed: false, createdAt: new Date().toISOString(), isBase: true },
      { id: 'base-morning-2', title: 'Morning exercise', time: '6:30', period: 'morning', completed: false, createdAt: new Date().toISOString(), isBase: true },
      { id: 'base-morning-3', title: 'Breakfast', time: '7:00', period: 'morning', completed: false, createdAt: new Date().toISOString(), isBase: true }
    ],
    afternoon: [
      { id: 'base-afternoon-1', title: 'Lunch break', time: '12:00', period: 'afternoon', completed: false, createdAt: new Date().toISOString(), isBase: true },
      { id: 'base-afternoon-2', title: 'Short walk', time: '14:00', period: 'afternoon', completed: false, createdAt: new Date().toISOString(), isBase: true },
      { id: 'base-afternoon-3', title: 'Tea break', time: '16:00', period: 'afternoon', completed: false, createdAt: new Date().toISOString(), isBase: true }
    ],
    evening: [
      { id: 'base-evening-1', title: 'Dinner', time: '19:00', period: 'evening', completed: false, createdAt: new Date().toISOString(), isBase: true },
      { id: 'base-evening-2', title: 'Reading time', time: '20:00', period: 'evening', completed: false, createdAt: new Date().toISOString(), isBase: true },
      { id: 'base-evening-3', title: 'Prepare for bed', time: '22:00', period: 'evening', completed: false, createdAt: new Date().toISOString(), isBase: true }
    ]
  },
  metadata: {
    lastTaskResetDate: null,
    lastRoutineResetDate: null,
    lastTaskCheckDate: null
  },
  profileImage: localStorage.getItem('profileImage') || null,
  language: localStorage.getItem('language') || 'polish'
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      }
    
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        )
      }
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      }
    
    case 'UPDATE_HEALTH':
      return {
        ...state,
        health: { ...state.health, ...action.payload }
      }
    
    case 'ADD_FOCUS_SESSION':
      return {
        ...state,
        focus: {
          ...state.focus,
          sessions: [...state.focus.sessions, action.payload]
        }
      }
    
    case 'DELETE_FOCUS_SESSION':
      return {
        ...state,
        focus: {
          ...state.focus,
          sessions: state.focus.sessions.filter(session => session.id !== action.payload)
        }
      }
    
    case 'UPDATE_FOCUS':
      return {
        ...state,
        focus: { ...state.focus, ...action.payload }
      }
    
    case 'UPDATE_STREAKS':
      return {
        ...state,
        streaks: { ...state.streaks, ...action.payload }
      }
    
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        theme: { ...state.theme, darkMode: !state.theme.darkMode }
      }
    
    case 'SET_COLOR_SCHEME':
      return {
        ...state,
        theme: { ...state.theme, colorScheme: action.payload }
      }
    
    case 'SET_PROFILE_IMAGE':
      return {
        ...state,
        profileImage: action.payload
      }
    
    case 'REMOVE_PROFILE_IMAGE':
      return {
        ...state,
        profileImage: null
      }
    
    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.payload
      }
    
    case 'REORDER_TASKS':
      return {
        ...state,
        tasks: action.payload
      }
    
    case 'SET_THEME':
      return {
        ...state,
        theme: { ...state.theme, ...action.payload }
      }
    
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      }
    
    case 'UNCHECK_ALL_TASKS':
      return {
        ...state,
        tasks: state.tasks.map(task => ({ ...task, completed: false }))
      }
    
    case 'RESET_DAILY_DATA':
      return {
        ...state,
        tasks: state.tasks.map(task => ({ ...task, completed: false })),
        focus: {
          ...state.focus,
          sessions: [] // Clear all focus sessions
        },
        health: {
          ...state.health,
          dailyFoodLog: [], // Clear daily food log
          caloriesConsumed: 0 // Reset calories consumed
        }
      }
    
    case 'UPDATE_ROUTINES':
      return {
        ...state,
        routines: { ...state.routines, ...action.payload }
      }
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload }
      }
    
    case 'UPDATE_METADATA':
      return {
        ...state,
        metadata: { ...state.metadata, ...action.payload }
      }
    
    default:
      return state
  }
}

// Context
const AppContext = createContext()

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('momentum-data')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // Update state with saved data
        Object.keys(parsedData).forEach(key => {
          if (key === 'tasks' && Array.isArray(parsedData[key])) {
            dispatch({ type: 'LOAD_TASKS', payload: parsedData[key] })
          }
          if (key === 'health') {
            dispatch({ type: 'UPDATE_HEALTH', payload: parsedData[key] })
          }
          if (key === 'focus') {
            dispatch({ type: 'UPDATE_FOCUS', payload: parsedData[key] })
          }
          if (key === 'streaks') {
            dispatch({ type: 'UPDATE_STREAKS', payload: parsedData[key] })
          }
          if (key === 'theme') {
            dispatch({ type: 'SET_THEME', payload: parsedData[key] })
          }
          if (key === 'profileImage') {
            dispatch({ type: 'SET_PROFILE_IMAGE', payload: parsedData[key] })
          }
          if (key === 'language') {
            dispatch({ type: 'SET_LANGUAGE', payload: parsedData[key] })
          }
          if (key === 'routines') {
            dispatch({ type: 'UPDATE_ROUTINES', payload: parsedData[key] })
          }
          if (key === 'profile') {
            dispatch({ type: 'UPDATE_PROFILE', payload: parsedData[key] })
          }
          if (key === 'metadata') {
            dispatch({ type: 'UPDATE_METADATA', payload: parsedData[key] })
          }
        })
      }

      // Migrate data from old localStorage keys
      const migrateData = () => {
        let needsMigration = false
        const migrationUpdates = {}

        // Migrate routines
        const dailyRoutines = localStorage.getItem('dailyRoutines')
        if (dailyRoutines) {
          try {
            migrationUpdates.routines = JSON.parse(dailyRoutines)
            needsMigration = true
            localStorage.removeItem('dailyRoutines')
          } catch (e) {
            console.log('Error migrating routines:', e)
          }
        }

        // Migrate profile data
        const profileName = localStorage.getItem('profileName')
        const longTermGoals = localStorage.getItem('longTermGoals')
        if (profileName || longTermGoals) {
          migrationUpdates.profile = {}
          if (profileName) {
            migrationUpdates.profile.name = profileName
            localStorage.removeItem('profileName')
          }
          if (longTermGoals) {
            try {
              migrationUpdates.profile.longTermGoals = JSON.parse(longTermGoals)
              localStorage.removeItem('longTermGoals')
              localStorage.removeItem('longTermGoals_backup')
            } catch (e) {
              console.log('Error migrating goals:', e)
            }
          }
          needsMigration = true
        }

        // Migrate health data
        const dailyFoodLog = localStorage.getItem('dailyFoodLog')
        const calorieGoal = localStorage.getItem('calorieGoal')
        if (dailyFoodLog || calorieGoal) {
          migrationUpdates.health = { ...state.health }
          if (dailyFoodLog) {
            try {
              migrationUpdates.health.dailyFoodLog = JSON.parse(dailyFoodLog)
              localStorage.removeItem('dailyFoodLog')
            } catch (e) {
              console.log('Error migrating food log:', e)
            }
          }
          if (calorieGoal) {
            try {
              migrationUpdates.health.calorieGoal = parseInt(calorieGoal)
              localStorage.removeItem('calorieGoal')
            } catch (e) {
              console.log('Error migrating calorie goal:', e)
            }
          }
          needsMigration = true
        }

        // Migrate custom themes
        const customThemes = localStorage.getItem('custom-themes')
        if (customThemes) {
          try {
            migrationUpdates.theme = { ...state.theme, customThemes: JSON.parse(customThemes) }
            localStorage.removeItem('custom-themes')
            needsMigration = true
          } catch (e) {
            console.log('Error migrating themes:', e)
          }
        }

        // Migrate metadata
        const lastTaskResetDate = localStorage.getItem('lastTaskResetDate')
        const lastRoutineResetDate = localStorage.getItem('lastRoutineResetDate')
        const lastTaskCheckDate = localStorage.getItem('lastTaskCheckDate')
        if (lastTaskResetDate || lastRoutineResetDate || lastTaskCheckDate) {
          migrationUpdates.metadata = {}
          if (lastTaskResetDate) {
            migrationUpdates.metadata.lastTaskResetDate = lastTaskResetDate
            localStorage.removeItem('lastTaskResetDate')
          }
          if (lastRoutineResetDate) {
            migrationUpdates.metadata.lastRoutineResetDate = lastRoutineResetDate
            localStorage.removeItem('lastRoutineResetDate')
          }
          if (lastTaskCheckDate) {
            migrationUpdates.metadata.lastTaskCheckDate = lastTaskCheckDate
            localStorage.removeItem('lastTaskCheckDate')
          }
          needsMigration = true
        }

        // Apply migrations
        if (needsMigration) {
          console.log('Migrating data from old localStorage keys...')
          Object.keys(migrationUpdates).forEach(key => {
            if (key === 'routines') {
              dispatch({ type: 'UPDATE_ROUTINES', payload: migrationUpdates[key] })
            } else if (key === 'profile') {
              dispatch({ type: 'UPDATE_PROFILE', payload: migrationUpdates[key] })
            } else if (key === 'health') {
              dispatch({ type: 'UPDATE_HEALTH', payload: migrationUpdates[key] })
            } else if (key === 'theme') {
              dispatch({ type: 'SET_THEME', payload: migrationUpdates[key] })
            } else if (key === 'metadata') {
              dispatch({ type: 'UPDATE_METADATA', payload: migrationUpdates[key] })
            }
          })
        }
      }

      migrateData()
      
      // Check if it's a new day and reset tasks if needed
      const today = new Date().toDateString()
      const lastResetDate = state.metadata?.lastTaskResetDate || localStorage.getItem('lastTaskResetDate')
      
      if (lastResetDate !== today) {
        // It's a new day, reset all daily data
        dispatch({ type: 'RESET_DAILY_DATA' })
        dispatch({ type: 'UPDATE_METADATA', payload: { lastTaskResetDate: today } })
        console.log('New day detected - all daily data has been reset (tasks, focus sessions, meals, calories)')
      }
    } catch (error) {
      console.log('Error loading saved data:', error)
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('momentum-data', JSON.stringify(state))
  }, [state])

  // Apply dark mode class to document
  useEffect(() => {
    if (state.theme.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.theme.darkMode])

  // Context value
  const value = {
    state,
    dispatch,
    addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
    toggleTask: (taskId) => dispatch({ type: 'TOGGLE_TASK', payload: taskId }),
    deleteTask: (taskId) => dispatch({ type: 'DELETE_TASK', payload: taskId }),
    reorderTasks: (tasks) => dispatch({ type: 'REORDER_TASKS', payload: tasks }),
    updateHealth: (data) => dispatch({ type: 'UPDATE_HEALTH', payload: data }),
    addFocusSession: (session) => dispatch({ type: 'ADD_FOCUS_SESSION', payload: session }),
    deleteFocusSession: (sessionId) => dispatch({ type: 'DELETE_FOCUS_SESSION', payload: sessionId }),
    updateFocus: (data) => dispatch({ type: 'UPDATE_FOCUS', payload: data }),
    updateStreaks: (data) => dispatch({ type: 'UPDATE_STREAKS', payload: data }),
    toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
    setColorScheme: (scheme) => dispatch({ type: 'SET_COLOR_SCHEME', payload: scheme }),
    setLanguage: (language) => dispatch({ type: 'SET_LANGUAGE', payload: language }),
    uncheckAllTasks: () => dispatch({ type: 'UNCHECK_ALL_TASKS' }),
    resetDailyData: () => dispatch({ type: 'RESET_DAILY_DATA' }),
    updateRoutines: (data) => dispatch({ type: 'UPDATE_ROUTINES', payload: data }),
    updateProfile: (data) => dispatch({ type: 'UPDATE_PROFILE', payload: data }),
    updateMetadata: (data) => dispatch({ type: 'UPDATE_METADATA', payload: data })
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
