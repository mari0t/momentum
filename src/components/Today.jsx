import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, CheckCircle, Circle, Trash2, BarChart3, Pencil, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Today = () => {
  const { addTask, toggleTask, deleteTask, reorderTasks, updateRoutines, updateMetadata, state } = useApp()
  const { t } = useTranslation()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(true)
  const [selectedParent, setSelectedParent] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskPriorityColor, setTaskPriorityColor] = useState('#fbbf24') // Default yellow for medium
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [customColor, setCustomColor] = useState('#fbbf24')
  const [taskCategory, setTaskCategory] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDueTime, setTaskDueTime] = useState('')
  const [taskType, setTaskType] = useState('regular') // regular, bonus
  const [bonusDays, setBonusDays] = useState([]) // Array of day numbers (0=Sunday, 1=Monday, etc.)
  const [showAllBonusTasks, setShowAllBonusTasks] = useState(false) // Toggle to show all bonus tasks
  
  // Refs
  const advancedFormRef = useRef(null)
  
  // Helper function to close modal and restore scrolling
  const closeAdvancedForm = () => {
    setShowForm(false)
    document.body.style.overflow = 'unset'
  }
  
  // Cleanup effect to restore scrolling when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])
  
  // Get routines from context
  const routines = state.routines
  const [showRoutineForm, setShowRoutineForm] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [draggedTask, setDraggedTask] = useState(null)
  const [routineFormData, setRoutineFormData] = useState({
    title: '',
    time: '',
    period: 'morning'
  })

  // Get priority color based on priority level
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
      case 'custom':
        return customColor
      default:
        return '#fbbf24' // Default yellow
    }
  }

  // Predefined color palette for quick selection
  const colorPalette = [
    { name: 'Red', value: '#ef4444', class: 'bg-red-500' },
    { name: 'Orange', value: '#f97316', class: 'bg-orange-500' },
    { name: 'Yellow', value: '#fbbf24', class: 'bg-yellow-500' },
    { name: 'Green', value: '#10b981', class: 'bg-green-500' },
    { name: 'Blue', value: '#3b82f6', class: 'bg-blue-500' },
    { name: 'Purple', value: '#8b5cf6', class: 'bg-purple-500' },
    { name: 'Pink', value: '#ec4899', class: 'bg-pink-500' },
    { name: 'Indigo', value: '#6366f1', class: 'bg-indigo-500' },
    { name: 'Teal', value: '#14b8a6', class: 'bg-teal-500' },
    { name: 'Gray', value: '#6b7280', class: 'bg-gray-500' }
  ]

  const handleCustomColorChange = (color) => {
    setCustomColor(color)
    setTaskPriorityColor(color)
    setTaskPriority('custom')
  }

  const handlePresetColorSelect = (color) => {
    setTaskPriorityColor(color)
    setCustomColor(color)
    setShowColorPicker(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTaskTitle.trim() && (taskType === 'regular' || (taskType === 'bonus' && bonusDays.length > 0))) {
      // Get current tasks for today to determine order (including bonus tasks that show today)
      const todayTasks = state.tasks?.filter(task => {
        if (task.taskType === 'bonus') {
          return shouldShowBonusTask(task)
        }
        return task.date === new Date().toISOString().split('T')[0]
      }) || []
      
      addTask({
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        priority: 'medium',
        priorityColor: taskPriorityColor,
        time: taskDueTime,
        category: taskCategory || '',
        description: '',
        parentId: selectedParent || null,
        completed: false,
        date: taskType === 'bonus' ? null : new Date().toISOString().split('T')[0], // Bonus tasks don't have specific dates
        createdAt: new Date().toISOString(),
        order: todayTasks.length, // Add to end of list
        taskType: taskType,
        bonusDays: taskType === 'bonus' ? bonusDays : null
      })
             // Reset form
       setNewTaskTitle('')
       setTaskPriority('medium')
       setTaskPriorityColor(getPriorityColor('medium'))
       setCustomColor('#fbbf24')
       setTaskCategory('')
       setTaskDueTime('')
       setSelectedParent('')
       setTaskType('regular')
       setBonusDays([])
       setShowAdvanced(false)
       closeAdvancedForm()
    }
  }

  const handleQuickSubmit = (e) => {
    e.preventDefault()
    if (newTaskTitle.trim()) {
      // Get current tasks for today to determine order
      const todayTasks = state.tasks?.filter(task => 
        task.date === new Date().toISOString().split('T')[0]
      ) || []
      
      addTask({
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        priority: 'medium',
        priorityColor: getPriorityColor('medium'),
        time: '',
        category: '',
        description: '',
        parentId: null,
        completed: false,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        order: todayTasks.length // Add to end of list
      })
      setNewTaskTitle('')
    }
  }

  // Routine Planner Functions
  const saveRoutinesToStorage = (newRoutines) => {
    updateRoutines(newRoutines)
  }

  const addRoutine = (e) => {
    e.preventDefault()
    if (routineFormData.title.trim()) {
      const newRoutine = {
        id: Date.now().toString(),
        title: routineFormData.title.trim(),
        time: routineFormData.time,
        period: routineFormData.period,
        completed: false,
        createdAt: new Date().toISOString()
      }
      
      const updatedRoutines = {
        ...routines,
        [routineFormData.period]: [...routines[routineFormData.period], newRoutine]
      }
      
      saveRoutinesToStorage(updatedRoutines)
      setRoutineFormData({ title: '', time: '', period: 'morning' })
      setShowRoutineForm(false)
    }
  }

  const toggleRoutine = (period, routineId) => {
    const updatedRoutines = {
      ...routines,
      [period]: routines[period].map(routine =>
        routine.id === routineId
          ? { ...routine, completed: !routine.completed }
          : routine
      )
    }
    saveRoutinesToStorage(updatedRoutines)
  }

  const deleteRoutine = (period, routineId) => {
    const updatedRoutines = {
      ...routines,
      [period]: routines[period].filter(routine => routine.id !== routineId)
    }
    saveRoutinesToStorage(updatedRoutines)
  }

  const editRoutine = (routine) => {
    setEditingRoutine(routine)
    setRoutineFormData({
      title: routine.title,
      time: routine.time,
      period: routine.period
    })
    setShowRoutineForm(true)
  }

  const updateRoutine = (e) => {
    e.preventDefault()
    if (routineFormData.title.trim() && editingRoutine) {
      const updatedRoutines = {
        ...routines,
        [editingRoutine.period]: routines[editingRoutine.period].map(routine =>
          routine.id === editingRoutine.id
            ? { ...routine, title: routineFormData.title.trim(), time: routineFormData.time, period: routineFormData.period }
            : routine
        )
      }
      
      // If the period changed, remove from old period and add to new period
      if (editingRoutine.period !== routineFormData.period) {
        // Remove from old period
        updatedRoutines[editingRoutine.period] = updatedRoutines[editingRoutine.period].filter(
          routine => routine.id !== editingRoutine.id
        )
        
        // Add to new period
        const updatedRoutine = {
          ...editingRoutine,
          title: routineFormData.title.trim(),
          time: routineFormData.time,
          period: routineFormData.period
        }
        updatedRoutines[routineFormData.period] = [...updatedRoutines[routineFormData.period], updatedRoutine]
      }
      
      saveRoutinesToStorage(updatedRoutines)
      setRoutineFormData({ title: '', time: '', period: 'morning' })
      setEditingRoutine(null)
      setShowRoutineForm(false)
    }
  }

  const cancelRoutineEdit = () => {
    setRoutineFormData({ title: '', time: '', period: 'morning' })
    setEditingRoutine(null)
    setShowRoutineForm(false)
  }

  // Simple drag and drop - no complex placeholders

  // Simple Drag and Drop Functions
  const handleDragStart = (e, task) => {
    e.stopPropagation()
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id)
    
    // Simple visual feedback
    e.target.style.opacity = '0.5'
  }

  // Mobile touch drag support
  const handleTouchStart = (e, task) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggedTask(task)
    
    // Visual feedback for mobile
    const target = e.currentTarget.closest('[data-task-id]')
    if (target) {
      target.style.opacity = '0.5'
      target.style.transform = 'scale(0.98)'
    }
    
    // Prevent scrolling during drag
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedTask) return
    
    // Find the element under the touch point
    const touch = e.touches[0]
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY)
    const taskElement = elementUnderTouch?.closest('[data-task-id]')
    
    if (taskElement && taskElement.dataset.taskId !== draggedTask.id) {
      // Show drop zone indicator
      taskElement.style.backgroundColor = '#1f2937'
      taskElement.style.borderRadius = '8px'
    }
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedTask) return
    
    // Find the element under the touch point
    const touch = e.changedTouches[0]
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY)
    const targetTaskElement = elementUnderTouch?.closest('[data-task-id]')
    
    if (targetTaskElement) {
      const targetTaskId = targetTaskElement.dataset.taskId
      const targetTask = state.tasks?.find(task => task.id === targetTaskId)
      
      if (targetTask && targetTask.id !== draggedTask.id) {
        // Simulate drop
        handleDrop(e, targetTask)
      }
    }
    
    // Reset visual feedback
    const draggedElement = document.querySelector(`[data-task-id="${draggedTask.id}"]`)
    if (draggedElement) {
      draggedElement.style.opacity = '1'
      draggedElement.style.transform = ''
    }
    
    // Reset all task elements
    document.querySelectorAll('[data-task-id]').forEach(el => {
      el.style.backgroundColor = ''
      el.style.borderRadius = ''
    })
    
    // Re-enable scrolling
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
    
    setDraggedTask(null)
  }

  // Mobile-friendly move up/down functions - move one position at a time
  const moveTaskUp = (taskId) => {
    const todayTasks = state.tasks?.filter(task => 
      task.date === new Date().toISOString().split('T')[0]
    ).sort((a, b) => (a.order || 0) - (b.order || 0)) || []
    
    const currentIndex = todayTasks.findIndex(task => task.id === taskId)
    if (currentIndex > 0) {
      const newTasks = [...todayTasks]
      
      // Move task one position up (swap with the task above)
      const temp = newTasks[currentIndex]
      newTasks[currentIndex] = newTasks[currentIndex - 1]
      newTasks[currentIndex - 1] = temp
      
      // Update order values to match new positions
      const updatedTasks = state.tasks?.map(task => {
        const newTask = newTasks.find(t => t.id === task.id)
        if (newTask) {
          return { ...task, order: newTasks.indexOf(newTask) }
        }
        return task
      }) || []
      
      reorderTasks(updatedTasks)
    }
  }

  const moveTaskDown = (taskId) => {
    const todayTasks = state.tasks?.filter(task => 
      task.date === new Date().toISOString().split('T')[0]
    ).sort((a, b) => (a.order || 0) - (b.order || 0)) || []
    
    const currentIndex = todayTasks.findIndex(task => task.id === taskId)
    if (currentIndex < todayTasks.length - 1) {
      const newTasks = [...todayTasks]
      
      // Move task one position down (swap with the task below)
      const temp = newTasks[currentIndex]
      newTasks[currentIndex] = newTasks[currentIndex + 1]
      newTasks[currentIndex + 1] = temp
      
      // Update order values to match new positions
      const updatedTasks = state.tasks?.map(task => {
        const newTask = newTasks.find(t => t.id === task.id)
        if (newTask) {
          return { ...task, order: newTasks.indexOf(newTask) }
        }
        return task
      }) || []
      
      reorderTasks(updatedTasks)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    // Get the target task element
    const targetElement = e.currentTarget
    const targetTaskId = targetElement.getAttribute('data-task-id')
    
    // Only show hover effect if we're dragging a different task
    if (draggedTask && draggedTask.id !== targetTaskId) {
      // Get mouse position relative to the target element
      const rect = targetElement.getBoundingClientRect()
      const mouseY = e.clientY
      const elementCenterY = rect.top + rect.height / 2
      
      // Determine if mouse is in top or bottom half of the element
      if (mouseY < elementCenterY) {
        // Mouse is in top half - show drop above
        if (!targetElement.dataset.hoverEffect || targetElement.dataset.hoverEffect !== 'above') {
          targetElement.dataset.hoverEffect = 'above'
          targetElement.style.transform = 'translateY(8px)'
          targetElement.style.transition = 'transform 0.2s ease-out'
          targetElement.style.backgroundColor = '#1f2937'
          targetElement.style.borderRadius = '8px'
        }
      } else {
        // Mouse is in bottom half - show drop below
        if (!targetElement.dataset.hoverEffect || targetElement.dataset.hoverEffect !== 'below') {
          targetElement.dataset.hoverEffect = 'below'
          targetElement.style.transform = 'translateY(-8px)'
          targetElement.style.transition = 'transform 0.2s ease-out'
          targetElement.style.backgroundColor = '#1f2937'
          targetElement.style.borderRadius = '8px'
        }
      }
    }
  }

  const handleDrop = (e, targetTask) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedTask || draggedTask.id === targetTask.id) {
      setDraggedTask(null)
      return
    }

    // Get all tasks for today
    const todayTasks = state.tasks?.filter(task => 
      task.date === new Date().toISOString().split('T')[0]
    ) || []

    // Find indices
    const draggedIndex = todayTasks.findIndex(task => task.id === draggedTask.id)
    const targetIndex = todayTasks.findIndex(task => task.id === targetTask.id)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedTask(null)
      return
    }

    // Accurate positioning - detect above/below target
    const newTasks = [...todayTasks]
    const draggedTaskData = newTasks[draggedIndex]
    
    // Determine drop position based on mouse location
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseY = e.clientY
    const elementCenterY = rect.top + rect.height / 2
    const dropAbove = mouseY < elementCenterY
    
    console.log('Moving Task:', {
      task: draggedTaskData.title,
      from: draggedIndex,
      to: targetIndex,
      dropAbove,
      'will place': dropAbove ? 'above' : 'below' + ' ' + targetTask.title
    })
    
    // Remove the task from its current position
    newTasks.splice(draggedIndex, 1)
    
    // Calculate the correct insertion index
    let insertIndex = targetIndex
    
    if (dropAbove) {
      // Dropping above the target - insert at target's position
      insertIndex = targetIndex
    } else {
      // Dropping below the target - insert after the target
      insertIndex = targetIndex + 1
    }
    
    // Adjust index if we're moving from a higher position to a lower position
    if (draggedIndex < targetIndex) {
      insertIndex = insertIndex - 1
    }
    
    // Place it at the calculated position
    newTasks.splice(insertIndex, 0, draggedTaskData)
    
    console.log('New Order:', newTasks.map(t => t.title))
    
    // Update the order values to match the new positions
    const updatedTasks = state.tasks?.map(task => {
      const newTask = newTasks.find(t => t.id === task.id)
      if (newTask) {
        return { ...task, order: newTasks.indexOf(newTask) }
      }
      return task
    }) || []

    // Update state
    reorderTasks(updatedTasks)
    setDraggedTask(null)
  }

  const handleDragLeave = (e) => {
    // Reset hover effects when leaving the target area
    const targetElement = e.currentTarget
    targetElement.style.transform = ''
    targetElement.style.backgroundColor = ''
    targetElement.style.borderRadius = ''
    delete targetElement.dataset.hoverEffect
  }

  const handleDragEnd = (e) => {
    // Reset visual feedback
    if (e.target) {
      e.target.style.opacity = '1'
    }
    setDraggedTask(null)
  }

  // Initialize order property for tasks that don't have it
  useEffect(() => {
    if (state.tasks && state.tasks.length > 0) {
      const tasksNeedingOrder = state.tasks.filter(task => task.order === undefined)
      if (tasksNeedingOrder.length > 0) {
        const updatedTasks = state.tasks.map((task, index) => {
          if (task.order === undefined) {
            return { ...task, order: index }
          }
          return task
        })
        reorderTasks(updatedTasks)
      }
    }
  }, [state.tasks])

  // Reset routines to base
  const resetToBaseRoutines = () => {
    const baseRoutines = {
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
    }
    
    if (confirm('This will reset all routines to base and remove any custom routines. Are you sure?')) {
      saveRoutinesToStorage(baseRoutines)
    }
  }

  // Get today's tasks and separate them by completion status
  // Helper function to check if a bonus task should show today
  const shouldShowBonusTask = (task) => {
    if (task.taskType !== 'bonus' || !task.bonusDays) return true
    
    // If showing all bonus tasks, show everything
    if (showAllBonusTasks) return true
    
    const today = new Date().getDay() // 0=Sunday, 1=Monday, etc.
    return task.bonusDays.includes(today)
  }

  // Sort by order (if set) or creation date, respecting the drag and drop order
  const todayTasks = state.tasks?.filter(task => {
    // For bonus tasks, check if they should show on current day (no date restriction)
    if (task.taskType === 'bonus') {
      return shouldShowBonusTask(task)
    }
    
    // Regular tasks need to match today's date
    const isToday = task.date === new Date().toISOString().split('T')[0]
    return isToday
  }).sort((a, b) => {
    // First, separate regular and bonus tasks (regular tasks come first)
    const aIsBonus = a.taskType === 'bonus'
    const bIsBonus = b.taskType === 'bonus'
    
    if (aIsBonus && !bIsBonus) return 1  // b (regular) comes before a (bonus)
    if (!aIsBonus && bIsBonus) return -1 // a (regular) comes before b (bonus)
    
    // Within the same task type, use existing ordering logic
    // If both tasks have order set, sort by order (lower number = higher position)
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
  }) || []

  // Ensure all tasks have proper order values for consistent sorting
  React.useEffect(() => {
    if (todayTasks.length > 0 && todayTasks.some(task => task.order === undefined)) {
      // Assign order values to tasks that don't have them
      const updatedTasks = state.tasks?.map(task => {
        const todayTask = todayTasks.find(t => t.id === task.id)
        if (todayTask && todayTask.order === undefined) {
          // Find the position in the sorted todayTasks array
          const position = todayTasks.findIndex(t => t.id === task.id)
          return { ...task, order: position }
        }
        return task
      }) || []
      
      if (updatedTasks.length > 0) {
        reorderTasks(updatedTasks)
      }
    }
  }, [todayTasks.length, state.tasks])

  // Reset routines daily
  React.useEffect(() => {
    const lastRoutineResetDate = state.metadata?.lastRoutineResetDate
    const today = new Date().toDateString()
    
    if (lastRoutineResetDate !== today) {
      // It's a new day, reset all routines to uncompleted
      const resetRoutines = {
        morning: routines.morning.map(routine => ({ ...routine, completed: false })),
        afternoon: routines.afternoon.map(routine => ({ ...routine, completed: false })),
        evening: routines.evening.map(routine => ({ ...routine, completed: false }))
      }
      saveRoutinesToStorage(resetRoutines)
      // Update metadata through context
      updateMetadata({ lastRoutineResetDate: today })
    }
  }, [routines.morning.length, routines.afternoon.length, routines.evening.length, state.metadata?.lastRoutineResetDate])
  
  // Separate tasks by completion status, maintaining the order
  const pendingTasks = todayTasks.filter(task => !task.completed).sort((a, b) => {
    // Sort by order property if available, otherwise by creation date
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    return new Date(a.createdAt) - new Date(b.createdAt)
  })
  const completedTasks = todayTasks.filter(task => task.completed).sort((a, b) => {
    // Sort by order property if available, otherwise by creation date
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    return new Date(a.createdAt) - new Date(b.createdAt)
  })
  
  // Separate regular and bonus tasks for display
  const pendingRegularTasks = pendingTasks.filter(task => task.taskType !== 'bonus')
  const pendingBonusTasks = pendingTasks.filter(task => task.taskType === 'bonus')

  // Get last 7 days progress (Monday to Sunday)
  const getLast7DaysProgress = () => {
    const days = []
    const today = new Date()
    
    // Find the most recent Monday (or today if it's Monday)
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Days since last Monday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - daysSinceMonday + i)
      
      const dayTasks = state.tasks?.filter(task => {
        // Handle bonus tasks - check if they should show on this day
        if (task.taskType === 'bonus' && task.bonusDays) {
          const dayOfWeek = date.getDay() // 0=Sunday, 1=Monday, etc.
          return task.bonusDays.includes(dayOfWeek)
        }
        
        // Handle regular tasks - check date match
        if (task.date) {
          const taskDate = new Date(task.date).toDateString()
          return taskDate === date.toDateString()
        }
        
        return false
      }) || []
      const completedTasks = dayTasks.filter(task => task.completed).length
      const totalTasks = dayTasks.length
      const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      
      days.push({
        date: date.toDateString(),
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        progress: Math.round(percentage),
        height: Math.max(percentage / 100, 0.05), // Convert percentage to decimal for height calculation
        isToday: date.toDateString() === today.toDateString()
      })
    }
    return days
  }

  const last7Days = getLast7DaysProgress()

  // Get available parent tasks (only active tasks can be parents)
  const availableParentTasks = pendingTasks.filter(task => !task.parentId)

  // Quick and clean toggle function
  const handleToggleTask = (taskId) => {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`)
    if (taskElement) {
      // Quick fade out
      taskElement.style.transition = 'opacity 0.2s ease-out'
      taskElement.style.opacity = '0'
      
      // Toggle state quickly
      setTimeout(() => {
        toggleTask(taskId)
        
        // Quick fade in
        setTimeout(() => {
          const newTaskElement = document.querySelector(`[data-task-id="${taskId}"]`)
          if (newTaskElement) {
            newTaskElement.style.transition = 'opacity 0.2s ease-in'
            newTaskElement.style.opacity = '1'
          }
        }, 20)
      }, 200)
    } else {
      toggleTask(taskId)
    }
  }

  return (
    <div className="pb-20 p-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('today.todayTasks')}</h1>
          <button
            onClick={() => setShowAllBonusTasks(!showAllBonusTasks)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showAllBonusTasks
                ? 'bg-purple-600 text-white shadow-lg hover:bg-purple-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title={showAllBonusTasks ? 'Show only today\'s bonus tasks' : 'Show all bonus tasks'}
          >
            {showAllBonusTasks ? '📅 All Bonus Tasks' : '⭐ Today Only'}
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {showAllBonusTasks 
            ? 'Viewing all bonus tasks (including other days)' 
            : 'Manage your daily tasks and stay productive'
          }
        </p>
      </div>

             {/* Main Content - Tasks List First, Add Task Button on Side */}
       <div className="flex gap-8 items-start">
         {/* Tasks List - MAIN CONTENT (LEFT SIDE) */}
         <div className="flex-1">
                       {/* Tasks List - COMBINED SECTION - NOW FIRST */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[400px]">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
                📋 Today's Task List
              </h3>
            </div>
            
            {/* Active Tasks - ON TOP */}
            {pendingTasks.length > 0 && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center flex items-center justify-center gap-2">
                  🚀 Active Tasks ({pendingTasks.length})
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  💡 Drag tasks to reorder by priority - #1 is most important!
                </p>
                
                {/* Regular Tasks Section */}
                {pendingRegularTasks.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px bg-gray-600 flex-1"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 px-2">🔄 {t('today.taskTypes.daily')}</span>
                      <div className="h-px bg-gray-600 flex-1"></div>
                    </div>
                    {pendingRegularTasks.map(task => (
                     <div 
                       key={task.id} 
                       data-task-id={task.id}
                       className={`card p-4 hover:shadow-lg transition-all duration-300 ease-out border border-gray-700/30 cursor-pointer ${
                         draggedTask?.id === task.id ? 'opacity-30 scale-95' : ''
                       }`}
                       style={{ 
                         backgroundColor: task.priorityColor ? `${task.priorityColor}40` : '#1f2937'
                       }}
                       onDragOver={(e) => handleDragOver(e)}
                       onDragLeave={handleDragLeave}
                       onDrop={(e) => handleDrop(e, task)}
                       onClick={(e) => {
                         // Only toggle if not dragging
                         if (!draggedTask) {
                           handleToggleTask(task.id)
                         }
                       }}
                     >
                       <div className="flex items-start gap-4">
                         {/* Check Icon */}
                         <div className="text-amber-300 hover:text-amber-200 transition-all duration-300 flex-shrink-0 mt-1 group relative">
                           <Circle size={24} className="group-hover:scale-110 transition-transform duration-200" />
                           {/* Sparkle effect container */}
                           <div className="absolute inset-0 pointer-events-none">
                             <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0ms' }}></div>
                             <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-amber-200 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '150ms' }}></div>
                             <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '300ms' }}></div>
                           </div>
                         </div>
                         
                         {/* Priority Number */}
                         <div className="flex-shrink-0 mt-1">
                           <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                             #{pendingRegularTasks.findIndex(t => t.id === task.id) + 1}
                           </span>
                         </div>
                         
                         {/* Task Content */}
                         <div className="flex-1">
                           {/* Task Title */}
                           <div className="flex items-center gap-2 mb-1">
                             {task.parentId && (
                               <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                 📎 Subtask
                               </span>
                             )}
                             {task.taskType === 'bonus' && (
                               <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                                 ⭐ Bonus
                               </span>
                             )}
                             <h4 className="font-medium text-gray-900 dark:text-gray-100 text-lg">{task.title}</h4>
                           </div>
                           
                           
                           {/* Task Details */}
                           <div className="flex items-center gap-2 flex-wrap">
                             {task.category && (
                               <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                 {task.category}
                               </span>
                             )}

                             {task.time && (
                               <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                                 ⏰ {task.time}
                               </span>
                             )}
                           </div>
                           
                           {/* Subtasks Count */}
                           {state.tasks?.filter(t => t.parentId === task.id).length > 0 && (
                             <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                               📋 {state.tasks.filter(t => t.parentId === task.id).length} subtask(s)
                             </div>
                           )}
                         </div>
                         
                         {/* Action Buttons */}
                         <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                           {/* Desktop: Drag Handle, Mobile: Up/Down Arrows */}
                           <div className="hidden md:block">
                             <div 
                               className="text-gray-400 hover:text-gray-300 cursor-grab active:cursor-grabbing transition-colors"
                               draggable
                               onDragStart={(e) => handleDragStart(e, task)}
                               onDragEnd={handleDragEnd}
                               onMouseDown={(e) => e.stopPropagation()}
                             >
                               <GripVertical size={20} />
                             </div>
                           </div>
                           
                           {/* Mobile: Up/Down Arrows */}
                           <div className="md:hidden flex flex-col gap-0">
                             {task.order > 0 && (
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation()
                                   moveTaskUp(task.id)
                                 }}
                                 className="text-gray-400 hover:text-gray-300 transition-colors p-1"
                               >
                                 <ChevronUp size={14} />
                               </button>
                                                        )}
                           {task.order < pendingRegularTasks.length - 1 && (
                             <button
                               onClick={(e) => {
                                 e.stopPropagation()
                                 moveTaskDown(task.id)
                               }}
                               className="text-gray-400 hover:text-gray-300 transition-colors p-1"
                             >
                               <ChevronDown size={14} />
                             </button>
                           )}
                           </div>
                           
                           <button
                             onClick={(e) => {
                               e.stopPropagation()
                               deleteTask(task.id)
                             }}
                             className="text-red-400 hover:text-red-600 transition-colors"
                           >
                             <Trash2 size={20} />
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                  </div>
                )}
                
                {/* Bonus Tasks Section */}
                {pendingBonusTasks.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px bg-purple-600 flex-1"></div>
                      <span className="text-sm text-purple-400 px-2">
                        {showAllBonusTasks 
                          ? '⭐ All Bonus Tasks (All Days)' 
                          : `⭐ Bonus Tasks (${new Date().toLocaleDateString('en-US', { weekday: 'long' })})`
                        }
                      </span>
                      <div className="h-px bg-purple-600 flex-1"></div>
                    </div>
                    {pendingBonusTasks.map(task => (
                     <div 
                       key={task.id} 
                       data-task-id={task.id}
                       className={`card p-4 hover:shadow-lg transition-all duration-300 ease-out border border-purple-500/30 cursor-pointer ${
                         draggedTask?.id === task.id ? 'opacity-30 scale-95' : ''
                       }`}
                       style={{ 
                         backgroundColor: task.priorityColor ? `${task.priorityColor}40` : '#7c3aed40'
                       }}
                       onDragOver={(e) => handleDragOver(e)}
                       onDragLeave={handleDragLeave}
                       onDrop={(e) => handleDrop(e, task)}
                       onClick={(e) => {
                         // Only toggle if not dragging
                         if (!draggedTask) {
                           handleToggleTask(task.id)
                         }
                       }}
                     >
                       <div className="flex items-start gap-4">
                         {/* Check Icon */}
                         <div className="text-amber-300 hover:text-amber-200 transition-all duration-300 flex-shrink-0 mt-1 group relative">
                           <Circle size={24} className="group-hover:scale-110 transition-transform duration-200" />
                           {/* Sparkle effect container */}
                           <div className="absolute inset-0 pointer-events-none">
                             <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0ms' }}></div>
                             <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-amber-200 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '150ms' }}></div>
                             <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '300ms' }}></div>
                           </div>
                         </div>
                         
                         {/* Priority Number */}
                         <div className="flex-shrink-0 mt-1">
                           <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                             ⭐{pendingBonusTasks.findIndex(t => t.id === task.id) + 1}
                           </span>
                         </div>
                         
                         {/* Task Content */}
                         <div className="flex-1">
                           {/* Task Title */}
                           <div className="flex items-center gap-2 mb-1">
                             {task.parentId && (
                               <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                 📎 Subtask
                               </span>
                             )}
                             <h4 className="font-medium text-gray-900 dark:text-gray-100 text-lg">{task.title}</h4>
                           </div>
                           
                           
                           {/* Task Details */}
                           <div className="flex items-center gap-2 flex-wrap">
                             {task.category && (
                               <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                 {task.category}
                               </span>
                             )}

                             {task.time && (
                               <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                                 ⏰ {task.time}
                               </span>
                             )}
                             
                             {/* Show scheduled days when viewing all bonus tasks */}
                             {showAllBonusTasks && task.taskType === 'bonus' && task.bonusDays && (
                               <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                                 📅 {task.bonusDays.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
                               </span>
                             )}
                           </div>
                           
                           {/* Subtasks Count */}
                           {state.tasks?.filter(t => t.parentId === task.id).length > 0 && (
                             <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                               📋 {state.tasks.filter(t => t.parentId === task.id).length} subtask(s)
                             </div>
                           )}
                         </div>
                         
                         {/* Action Buttons */}
                         <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                           {/* Desktop: Drag Handle, Mobile: Up/Down Arrows */}
                           <div className="hidden md:block">
                             <div 
                               className="text-gray-400 hover:text-gray-300 cursor-grab active:cursor-grabbing transition-colors"
                               draggable
                               onDragStart={(e) => handleDragStart(e, task)}
                               onDragEnd={handleDragEnd}
                               onMouseDown={(e) => e.stopPropagation()}
                             >
                               <GripVertical size={20} />
                             </div>
                           </div>
                           
                           <button
                             onClick={(e) => {
                               e.stopPropagation()
                               deleteTask(task.id)
                             }}
                             className="text-red-400 hover:text-red-600 transition-colors"
                           >
                             <Trash2 size={20} />
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                  </div>
                )}
              </div>
            )}

            {/* Completed Tasks - BELOW ACTIVE TASK */}
            {completedTasks.length > 0 && (
              <div className="p-4">
                <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4 text-center flex items-center justify-center gap-2">
                  ✅ Completed Tasks ({completedTasks.length})
                </h4>
                <div className="space-y-3">
                                     {completedTasks.map(task => (
                     <div 
                       key={task.id} 
                       data-task-id={task.id}
                       className={`card p-4 hover:shadow-lg transition-all duration-300 ease-out border border-gray-700/30 cursor-pointer ${
                         draggedTask?.id === task.id ? 'opacity-30 scale-95' : ''
                       }`}
                       style={{ 
                         backgroundColor: task.priorityColor ? `${task.priorityColor}30` : '#10b98130'
                       }}
                       onDragOver={(e) => handleDragOver(e)}
                       onDragLeave={handleDragLeave}
                       onDrop={(e) => handleDrop(e, task)}
                       onClick={(e) => {
                         // Only toggle if not dragging
                         if (!draggedTask) {
                           handleToggleTask(task.id)
                         }
                       }}
                     >
                       <div className="flex items-start gap-4">
                         {/* Check Icon */}
                         <div className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex-shrink-0 mt-1 relative group">
                           <CheckCircle size={24} className="group-hover:scale-110 transition-transform duration-200" />
                           {/* Completion sparkle effect */}
                           <div className="absolute inset-0 pointer-events-none">
                             <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '0ms' }}></div>
                             <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-200 rounded-full animate-ping opacity-75" style={{ animationDelay: '200ms' }}></div>
                             <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '400ms' }}></div>
                             <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-amber-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '600ms' }}></div>
                           </div>
                         </div>
                         
                         {/* Priority Number */}
                         <div className="flex-shrink-0 mt-1">
                           <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                             #{completedTasks.findIndex(t => t.id === task.id) + 1}
                           </span>
                         </div>
                         
                         {/* Task Content */}
                         <div className="flex-1">
                           {/* Task Title */}
                           <div className="flex items-center gap-2 mb-1">
                             {task.parentId && (
                               <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                 📎 Subtask
                               </span>
                             )}
                             {task.taskType === 'bonus' && (
                               <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                                 ⭐ Bonus
                               </span>
                             )}
                             <h4 className="font-medium text-gray-600 dark:text-gray-400 text-lg line-through">{task.title}</h4>
                           </div>
                           
                           
                           {/* Task Details */}
                           <div className="flex items-center gap-2 flex-wrap">
                             {task.category && (
                               <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                                 {task.category}
                               </span>
                             )}
                             {task.time && (
                               <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                                 ⏰ {task.time}
                               </span>
                             )}
                           </div>
                           
                           {/* Subtasks Count */}
                           {state.tasks?.filter(t => t.parentId === task.id).length > 0 && (
                             <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                               📋 {state.tasks.filter(t => t.parentId === task.id).length} subtask(s)
                             </div>
                           )}
                         </div>
                         
                         {/* Action Buttons */}
                         <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                           {/* Desktop: Drag Handle, Mobile: Up/Down Arrows */}
                           <div className="hidden md:block">
                             <div 
                               className="text-gray-400 hover:text-gray-300 cursor-grab active:cursor-grabbing transition-colors"
                               draggable
                               onDragStart={(e) => handleDragStart(e, task)}
                               onDragEnd={handleDragEnd}
                               onMouseDown={(e) => e.stopPropagation()}
                             >
                               <GripVertical size={20} />
                             </div>
                           </div>
                           
                           {/* Mobile: No arrows for completed tasks */}
                           
                           <button
                             onClick={(e) => {
                               e.stopPropagation()
                               deleteTask(task.id)
                             }}
                             className="text-red-400 hover:text-red-600 transition-colors"
                             
                           >
                             <Trash2 size={20} />
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* Empty State - When No Tasks */}
            {todayTasks.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No tasks yet!</h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {showAllBonusTasks 
                    ? 'No bonus tasks created yet. Create some day-specific tasks!'
                    : 'Add your first task to get started'
                  }
                </p>
              </div>
            )}
            
            {/* Info when no bonus tasks for today */}
            {!showAllBonusTasks && pendingRegularTasks.length > 0 && pendingBonusTasks.length === 0 && state.tasks?.some(t => t.taskType === 'bonus') && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="text-center">
                  <p className="text-purple-700 dark:text-purple-300 text-sm">
                    📅 You have bonus tasks, but none are scheduled for today.
                  </p>
                  <button
                    onClick={() => setShowAllBonusTasks(true)}
                    className="mt-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium underline"
                  >
                    View all bonus tasks
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

                 {/* Add New Task Button - SIDE PANEL (RIGHT SIDE) */}
         <div className="w-80 flex-shrink-0">
                       <div className="card text-center p-6 sticky top-8">
              {todayTasks.length === 0 ? (
                <>
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No tasks yet!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Add your first task to get started</p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Add New Task</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Quick add or use advanced options</p>
                </>
              )}
              
              {/* Quick Task Input */}
              <form onSubmit={handleQuickSubmit} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="input-field flex-1 text-sm"
                    placeholder={t('today.taskName')}
                    required
                  />
                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 text-sm flex-shrink-0"
                    disabled={!newTaskTitle.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  💡 Tip: Add emojis like ✨ 🚀 📚 💪 🎯
                </div>
              </form>
              
              <button
                onClick={() => {
                  setShowForm(true)
                  // On mobile, ensure the body doesn't scroll behind modal
                  document.body.style.overflow = 'hidden'
                }}
                className="btn-secondary flex items-center gap-2 mx-auto px-6 py-3 text-base w-full"
              >
                Advanced Options
              </button>
            </div>
           
                       {/* Spacer to prevent collision */}
            <div className="h-8"></div>
           
                       {/* Today's Progress - Now Under Add Task Button */}
            <div className="card text-center p-6">
             <div className="text-center">
               <div className="text-4xl font-bold text-green-500 mb-2">
                 {todayTasks.length > 0 ? Math.round((todayTasks.filter(task => task.completed).length / todayTasks.length) * 100) : 0}%
               </div>
               <div className="text-lg text-green-600 dark:text-green-400 font-semibold mb-3">
                 Today's Progress
               </div>
               <div className="text-sm text-gray-600 dark:text-gray-400">
                 {todayTasks.filter(task => task.completed).length} of {todayTasks.length} tasks completed
               </div>
               {/* Progress Bar */}
               <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4 overflow-hidden">
                 <div 
                   className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
                   style={{ 
                     width: `${todayTasks.length > 0 ? (todayTasks.filter(task => task.completed).length / todayTasks.length) * 100 : 0}%` 
                   }}
                 ></div>
               </div>
             </div>
           </div>
         </div>
         
                   {/* Small Gap on the Right */}
          <div className="w-4"></div>
       </div>

               {/* Gap between top section and routine planner */}
        <div className="h-8"></div>

        {/* Routine Planner */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <span className="text-3xl">📅</span>
                Daily Routine Planner
              </h3>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`p-2 rounded transition-colors ${
                  isEditMode 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'text-blue-500 hover:text-blue-600 hover:bg-blue-500/10'
                }`}
                title={isEditMode ? 'Exit edit mode' : 'Edit routines'}
              >
                {isEditMode ? 'Done' : <Pencil size={20} />}
              </button>
            </div>
            
            {/* Routine Time Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Morning Routine */}
              <div className="bg-white/10 dark:bg-gray-800/40 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">🌅</div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Morning</h4>
                </div>
                <div className="space-y-3">
                  {routines.morning.length > 0 ? (
                    [...routines.morning]
                      .sort((a, b) => {
                        if (!a.time || !b.time) return 0;
                        return a.time.localeCompare(b.time);
                      })
                      .map((routine) => (
                        <div key={routine.id} className={`flex items-center justify-between p-3 bg-white/20 dark:bg-gray-700/30 rounded-lg transition-all ${
                          isEditMode ? 'group hover:bg-white/30 dark:hover:bg-gray-600/40' : ''
                        }`}>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{routine.title}</span>
                          <div className="flex items-center gap-2">
                            {routine.time && (
                              <span className="text-xs text-white bg-gray-800 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {routine.time}
                              </span>
                            )}
                            {isEditMode && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => editRoutine(routine)}
                                  className="text-blue-500 hover:text-blue-600 p-1 rounded hover:bg-blue-500/10 transition-colors"
                                  title="Edit routine"
                                >
                                  ✏️
                                </button>
                                {!routine.isBase && (
                                  <button
                                    onClick={() => deleteRoutine(routine.period, routine.id)}
                                    className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-500/10 transition-colors"
                                    title="Delete routine"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                      No morning routines
                    </div>
                  )}
                </div>
                {isEditMode && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => {
                        setRoutineFormData({ title: '', time: '', period: 'morning' })
                        setEditingRoutine(null)
                        setShowRoutineForm(true)
                      }}
                      className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Plus size={16} />
                      Add Routine
                    </button>
                  </div>
                )}
              </div>

              {/* Afternoon Routine */}
              <div className="bg-white/10 dark:bg-gray-800/40 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">☀️</div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Afternoon</h4>
                </div>
                <div className="space-y-3">
                  {routines.afternoon.length > 0 ? (
                    [...routines.afternoon]
                      .sort((a, b) => {
                        if (!a.time || !b.time) return 0;
                        return a.time.localeCompare(b.time);
                      })
                      .map((routine) => (
                        <div key={routine.id} className={`flex items-center justify-between p-3 bg-white/20 dark:bg-gray-700/30 rounded-lg transition-all ${
                          isEditMode ? 'group hover:bg-white/30 dark:hover:bg-gray-600/40' : ''
                        }`}>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{routine.title}</span>
                          <div className="flex items-center gap-2">
                            {routine.time && (
                              <span className="text-xs text-white bg-gray-800 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {routine.time}
                              </span>
                            )}
                            {isEditMode && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => editRoutine(routine)}
                                  className="text-blue-500 hover:text-blue-600 p-1 rounded hover:bg-blue-500/10 transition-colors"
                                  title="Edit routine"
                                >
                                  ✏️
                                </button>
                                {!routine.isBase && (
                                  <button
                                    onClick={() => deleteRoutine(routine.period, routine.id)}
                                    className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-500/10 transition-colors"
                                    title="Delete routine"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                      No afternoon routines
                    </div>
                  )}
                </div>
                {isEditMode && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => {
                        setRoutineFormData({ title: '', time: '', period: 'afternoon' })
                        setEditingRoutine(null)
                        setShowRoutineForm(true)
                      }}
                      className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Plus size={16} />
                      Add Routine
                    </button>
                  </div>
                )}
              </div>

              {/* Evening Routine */}
              <div className="bg-white/10 dark:bg-gray-800/40 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">🌙</div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Evening</h4>
                </div>
                <div className="space-y-3">
                  {routines.evening.length > 0 ? (
                    [...routines.evening]
                      .sort((a, b) => {
                        if (!a.time || !b.time) return 0;
                        return a.time.localeCompare(b.time);
                      })
                      .map((routine) => (
                        <div key={routine.id} className={`flex items-center justify-between p-3 bg-white/20 dark:bg-gray-700/30 rounded-lg transition-all ${
                          isEditMode ? 'group hover:bg-white/30 dark:hover:bg-gray-600/40' : ''
                        }`}>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{routine.title}</span>
                          <div className="flex items-center gap-2">
                            {routine.time && (
                              <span className="text-xs text-white bg-gray-800 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {routine.time}
                              </span>
                            )}
                            {isEditMode && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => editRoutine(routine)}
                                  className="text-blue-500 hover:text-blue-600 p-1 rounded hover:bg-blue-500/10 transition-colors"
                                  title="Edit routine"
                                >
                                  ✏️
                                </button>
                                {!routine.isBase && (
                                  <button
                                    onClick={() => deleteRoutine(routine.period, routine.id)}
                                    className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-500/10 transition-colors"
                                    title="Delete routine"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                      No evening routines
                    </div>
                  )}
                </div>
                {isEditMode && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => {
                        setRoutineFormData({ title: '', time: '', period: 'evening' })
                        setEditingRoutine(null)
                        setShowRoutineForm(true)
                      }}
                      className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Plus size={16} />
                      Add Routine
                    </button>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>

        {/* Gap between routine planner and 7-day chart */}
        <div className="h-8"></div>

        {/* 7-Day Progress Chart */}
        <div className="max-w-5xl mx-auto mb-8">
         <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 rounded-2xl p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
           <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center flex items-center justify-center gap-3">
             <BarChart3 className="w-8 h-8 text-indigo-500" />
             7-Day Progress Chart
           </h3>
           
                       {/* Chart Container */}
            <div className="flex items-end justify-between gap-3 h-64 px-6 mb-6">
              {last7Days.map((day, index) => (
                 <div key={day.date} className="flex flex-col items-center flex-1 group">
                   {/* Bar */}
                   <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-t-xl overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-105 flex items-end">
                     <div 
                       className={`w-full transition-all duration-1000 ease-out ${
                         day.isToday 
                           ? 'bg-gradient-to-t from-green-500 to-emerald-500 shadow-lg' 
                           : 'bg-gradient-to-t from-indigo-500 to-blue-500 group-hover:from-indigo-400 group-hover:to-blue-400'
                       }`}
                       style={{ 
                         height: `${Math.max(day.progress, 5)}%`,
                         minHeight: '8px'
                       }}
                     ></div>
                     
                     {/* Hover Tooltip */}
                     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                       <div className="font-semibold">{day.progress}%</div>
                       <div className="text-xs text-gray-300">
                         {day.label} - {day.progress === 0 ? t('today.noTasksToday') : `${day.progress}% ${t('today.completed')}`}
                       </div>
                       <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                     </div>
                   </div>
                   
                   {/* Day Label */}
                   <div className={`text-sm font-semibold mt-3 ${
                     day.isToday 
                       ? 'text-green-600 dark:text-green-400' 
                       : 'text-gray-600 dark:text-gray-400'
                   }`}>
                     {day.label}
                   </div>
                   
                   {/* Percentage */}
                   <div className={`text-sm font-bold mt-1 ${
                     day.isToday 
                       ? 'text-green-600 dark:text-green-400' 
                       : 'text-indigo-600 dark:text-indigo-400'
                   }`}>
                     {day.progress}%
                   </div>
                   
                   {/* Today Indicator */}
                   {day.isToday && (
                     <div className="mt-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                       {t('today.title')}
                     </div>
                   )}
                 </div>
               ))}
           </div>
           
                       {/* Chart Legend and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {(() => {
                    const avgProgress = last7Days.reduce((sum, day) => sum + day.progress, 0) / 7
                    return Math.round(avgProgress)
                  })()}%
                </div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{t('today.averageCompletion')}</div>
              </div>
              
              <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {(() => {
                    const bestDay = last7Days.reduce((best, day) => day.progress > best ? day.progress : best, 0)
                    return bestDay
                  })()}%
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t('today.bestDay')}</div>
              </div>
              
              <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {(() => {
                    const todayProgress = last7Days.find(day => day.isToday)?.progress || 0
                    return todayProgress
                  })()}%
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">{t('today.title')}</div>
              </div>
            </div>
           
           {/* Chart Legend */}
           <div className="mt-6 text-center">
             <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-500/20 rounded-full">
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 bg-gradient-to-t from-indigo-500 to-blue-500 rounded"></div>
                 <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{t('today.last7Days')}</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 bg-gradient-to-t from-green-500 to-emerald-500 rounded"></div>
                 <span className="text-sm text-green-600 dark:text-green-400 font-medium">{t('today.title')}</span>
               </div>
             </div>
           </div>
                   </div>
        </div>

        


       

      {/* Add Task Form - Modal Style */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-4 z-50 overflow-y-auto">
          <div ref={advancedFormRef} className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4 sm:my-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add New Task</h3>
              <button
                onClick={closeAdvancedForm}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
                         <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Task Title *
                 </label>
                 <input
                   type="text"
                   value={newTaskTitle}
                   onChange={(e) => setNewTaskTitle(e.target.value)}
                   className="input-field w-full"
                   placeholder={t('today.taskDescription')}
                   required
                 />
               </div>

               {/* Advanced Options */}
                 <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                   

                                       {/* Color Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Task Color
                      </label>
                      
                      {/* Color Picker */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            type="color"
                            value={taskPriorityColor}
                            onChange={(e) => {
                              setTaskPriorityColor(e.target.value)
                              setCustomColor(e.target.value)
                            }}
                            className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                            title="Pick task color"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Choose a color for your task background
                          </p>
                        </div>
                      </div>
                    </div>

                   {/* Category Selection */}
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                       Category (Optional)
                     </label>
                     <select
                       value={taskCategory}
                       onChange={(e) => setTaskCategory(e.target.value)}
                       className="input-field w-full"
                     >
                                               <option value="">No category</option>
                        <option value="personal">Personal</option>
                        <option value="spiritual">Spiritual</option>
                        <option value="financial">Financial</option>
                        <option value="physical">Physical</option>
                        <option value="work">Work</option>
                     </select>
                   </div>

                   {/* Due Time */}
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                       Due Time (Optional)
                     </label>
                     <input
                       type="time"
                       value={taskDueTime}
                       onChange={(e) => setTaskDueTime(e.target.value)}
                       className="input-field w-full"
                     />
                   </div>


                   {/* Task Type Selection */}
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                       Task Type
                     </label>
                     <select
                       value={taskType}
                       onChange={(e) => {
                         setTaskType(e.target.value)
                         if (e.target.value === 'regular') {
                           setBonusDays([])
                         }
                       }}
                       className="input-field w-full"
                     >
                       <option value="regular">🔄 Regular Task</option>
                       <option value="bonus">⭐ Bonus Task (Day-Specific)</option>
                     </select>
                     {taskType === 'regular' && (
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                         Shows every day when you create it
                       </p>
                     )}
                     {taskType === 'bonus' && (
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                         Shows only on selected days of the week
                       </p>
                     )}
                   </div>

                   {/* Day Selection for Bonus Tasks */}
                   {taskType === 'bonus' && (
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Show on Days ⭐
                       </label>
                       
                       {/* Quick Presets */}
                       <div className="mb-4">
                         <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick presets:</p>
                         <div className="flex flex-wrap gap-2">
                           <button
                             type="button"
                             onClick={() => setBonusDays([1, 2, 3, 4, 5])}
                             className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                           >
                             📅 Weekdays
                           </button>
                           <button
                             type="button"
                             onClick={() => setBonusDays([0, 6])}
                             className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                           >
                             🏖️ Weekend
                           </button>
                           <button
                             type="button"
                             onClick={() => setBonusDays([1])}
                             className="px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/40 transition-colors"
                           >
                             💪 Monday
                           </button>
                           <button
                             type="button"
                             onClick={() => setBonusDays([0, 1, 2, 3, 4, 5, 6])}
                             className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
                           >
                             🌟 Every Day
                           </button>
                           <button
                             type="button"
                             onClick={() => setBonusDays([])}
                             className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                           >
                             🗑️ Clear
                           </button>
                         </div>
                       </div>
                       
                       {/* Individual Day Selection */}
                       <div className="grid grid-cols-7 gap-2">
                         {[
                           { day: 0, name: 'Sunday', label: 'S' },
                           { day: 1, name: 'Monday', label: 'M' },
                           { day: 2, name: 'Tuesday', label: 'T' },
                           { day: 3, name: 'Wednesday', label: 'W' },
                           { day: 4, name: 'Thursday', label: 'T' },
                           { day: 5, name: 'Friday', label: 'F' },
                           { day: 6, name: 'Saturday', label: 'S' }
                         ].map(({ day, name, label }) => (
                           <button
                             key={day}
                             type="button"
                             onClick={() => {
                               if (bonusDays.includes(day)) {
                                 setBonusDays(bonusDays.filter(d => d !== day))
                               } else {
                                 setBonusDays([...bonusDays, day])
                               }
                             }}
                             className={`p-3 rounded-lg text-sm font-medium transition-all ${
                               bonusDays.includes(day)
                                 ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-300'
                                 : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-md'
                             }`}
                             title={name}
                           >
                             {label}
                           </button>
                         ))}
                       </div>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                         {bonusDays.length === 0 && "Select at least one day"}
                         {bonusDays.length > 0 && `Will show on: ${bonusDays.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}`}
                       </p>
                     </div>
                   )}
                 </div>

               <div className="flex gap-3 pt-4">
                 <button
                   type="submit"
                   disabled={taskType === 'bonus' && bonusDays.length === 0}
                   className={`flex-1 flex items-center justify-center gap-2 ${
                     taskType === 'bonus' && bonusDays.length === 0 
                       ? 'btn-secondary opacity-50 cursor-not-allowed' 
                       : 'btn-primary'
                   }`}
                 >
                   <Plus size={20} />
                   {taskType === 'bonus' && bonusDays.length === 0 ? 'Select Days First' : 'Add Task'}
                 </button>
                 <button
                   type="button"
                   onClick={closeAdvancedForm}
                   className="btn-secondary px-6"
                 >
                   Cancel
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* Routine Form Modal */}
      {showRoutineForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {editingRoutine ? 'Edit Routine' : 'Add New Routine'}
              </h3>
              <button
                onClick={cancelRoutineEdit}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingRoutine ? updateRoutine : addRoutine} className="space-y-4">
              {/* Routine Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Routine Title
                </label>
                <input
                  type="text"
                  value={routineFormData.title}
                  onChange={(e) => setRoutineFormData({...routineFormData, title: e.target.value})}
                  className="input-field w-full"
                  placeholder={t('today.addFirstTask')}
                  required
                />
              </div>

              {/* Time Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Period
                </label>
                <select
                  value={routineFormData.period}
                  onChange={(e) => setRoutineFormData({...routineFormData, period: e.target.value})}
                  className="input-field w-full"
                >
                  <option value="morning">🌅 Morning</option>
                  <option value="afternoon">☀️ Afternoon</option>
                  <option value="evening">🌙 Evening</option>
                </select>
              </div>

              {/* Time (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time (Optional)
                </label>
                <input
                  type="time"
                  value={routineFormData.time}
                  onChange={(e) => setRoutineFormData({...routineFormData, time: e.target.value})}
                  className="input-field w-full"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {editingRoutine ? 'Update Routine' : 'Add Routine'}
                </button>
                <button
                  type="button"
                  onClick={cancelRoutineEdit}
                  className="btn-secondary px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Today
