// AI Service for Momentum App with Internet Access & Machine Learning
// This service provides intelligent insights and recommendations

class AIService {
  constructor() {
    this.userData = null
    this.insights = []
    this.apiKey = 'demo-key'
    this.baseUrl = 'https://api.openai.com/v1'
    this.foodDatabaseUrl = 'https://api.edamam.com/api/food-database/v2'
    this.weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'
    this.weatherApiKey = 'demo-key'
  }

  // Check internet connectivity
  async checkInternetConnection() {
    try {
      const response = await fetch('https://www.google.com', { mode: 'no-cors' })
      return true
    } catch {
      return false
    }
  }

  // Fetch real-time food data from external API
  async fetchFoodData(foodName) {
    try {
      const hasInternet = await this.checkInternetConnection()
      if (!hasInternet) {
        return this.getLocalFoodData(foodName)
      }

      // Try to fetch from external food database
      const response = await fetch(`${this.foodDatabaseUrl}/parser?app_id=demo&app_key=demo&ingr=${encodeURIComponent(foodName)}`)
      if (response.ok) {
        const data = await response.json()
        return this.processExternalFoodData(data)
      }
    } catch (error) {
      console.log('External API failed, using local data:', error)
    }
    
    return this.getLocalFoodData(foodName)
  }

  // Process external food API data
  processExternalFoodData(data) {
    if (data.hints && data.hints.length > 0) {
      const food = data.hints[0].food
      return {
        name: food.label,
        calories: Math.round(food.nutrients.ENERC_KCAL || 0),
        health: this.calculateHealthScore(food.nutrients),
        description: `Zewnętrzne dane: ${food.category}`,
        source: 'external'
      }
    }
    return null
  }

  // Get local food data as fallback
  getLocalFoodData(foodName) {
    const localFoods = {
      'jabłko': { name: 'Jabłko', calories: 52, health: 9, description: 'Świetne źródło witamin i przeciwutleniaczy' },
      'chleb': { name: 'Chleb pełnoziarnisty', calories: 265, health: 8, description: 'Bogaty w błonnik i składniki odżywcze' },
      'banan': { name: 'Banan', calories: 89, health: 8, description: 'Dobre źródło potasu i energii' },
      'kurczak': { name: 'Pierś z kurczaka', calories: 165, health: 9, description: 'Chude białko, idealne dla mięśni' },
      'ryż': { name: 'Ryż brązowy', calories: 111, health: 7, description: 'Zdrowe węglowodany złożone' },
      'salata': { name: 'Sałata', calories: 15, health: 9, description: 'Niskokaloryczne, bogate w witaminy' },
      'pomidor': { name: 'Pomidor', calories: 18, health: 9, description: 'Źródło likopenu i witaminy C' },
      'ogórek': { name: 'Ogórek', calories: 16, health: 9, description: 'Niskokaloryczne, nawadniające' },
      'jajko': { name: 'Jajko', calories: 70, health: 8, description: 'Kompletne białko i zdrowe tłuszcze' },
      'mleko': { name: 'Mleko 2%', calories: 50, health: 7, description: 'Dobre źródło wapnia i białka' },
      'ser': { name: 'Ser żółty', calories: 113, health: 6, description: 'Białko i wapń, ale dużo tłuszczu' },
      'makaron': { name: 'Makaron pełnoziarnisty', calories: 124, health: 7, description: 'Węglowodany złożone z błonnikiem' },
      'łosoś': { name: 'Łosoś', calories: 208, health: 9, description: 'Omega-3 i wysokiej jakości białko' },
      'awokado': { name: 'Awokado', calories: 160, health: 9, description: 'Zdrowe tłuszcze i błonnik' },
      'orzechy': { name: 'Orzechy włoskie', calories: 185, health: 8, description: 'Omega-3 i białko roślinne' }
    }

    const normalizedName = foodName.toLowerCase().trim()
    for (const [key, food] of Object.entries(localFoods)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return { ...food, source: 'local' }
      }
    }
    return null
  }

  // Calculate health score based on nutrients
  calculateHealthScore(nutrients) {
    let score = 5 // Base score
    
    // Protein (higher is better)
    if (nutrients.PROCNT) {
      score += Math.min(nutrients.PROCNT / 10, 2)
    }
    
    // Fiber (higher is better)
    if (nutrients.FIBTG) {
      score += Math.min(nutrients.FIBTG / 5, 2)
    }
    
    // Sugar (lower is better)
    if (nutrients.SUGAR) {
      score -= Math.min(nutrients.SUGAR / 20, 2)
    }
    
    // Fat (moderate is better)
    if (nutrients.FAT) {
      const fatScore = nutrients.FAT > 30 ? -1 : (nutrients.FAT > 10 ? 0 : 1)
      score += fatScore
    }
    
    return Math.max(1, Math.min(10, Math.round(score)))
  }

  // Fetch weather data for sleep recommendations
  async fetchWeatherData(city = 'Warszawa') {
    try {
      const hasInternet = await this.checkInternetConnection()
      if (!hasInternet) {
        return this.getDefaultWeatherData()
      }

      const response = await fetch(`${this.weatherApiUrl}?q=${city}&appid=${this.weatherApiKey}&units=metric&lang=pl`)
      if (response.ok) {
        const data = await response.json()
        return {
          temperature: data.main.temp,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          source: 'external'
        }
      }
    } catch (error) {
      console.log('Weather API failed, using default data:', error)
    }
    
    return this.getDefaultWeatherData()
  }

  getDefaultWeatherData() {
    return {
      temperature: 20,
      humidity: 60,
      description: 'Słonecznie',
      icon: '01d',
      source: 'default'
    }
  }

  // Machine Learning: Analyze sleep patterns
  analyzeSleepPatterns(sleepData) {
    if (!sleepData || sleepData.length < 3) {
      return { insights: [], recommendations: [] }
    }

    const insights = []
    const recommendations = []
    
    // Calculate average sleep duration
    const avgDuration = sleepData.reduce((sum, day) => sum + day.duration, 0) / sleepData.length
    const avgQuality = sleepData.reduce((sum, day) => sum + day.quality, 0) / sleepData.length
    
    // Pattern analysis
    if (avgDuration < 7) {
      insights.push({
        type: 'warning',
        title: 'Niewystarczający sen',
        message: `Średnio śpisz ${avgDuration.toFixed(1)}h, zalecane 7-9h`,
        priority: 'high'
      })
      recommendations.push({
        action: 'Zwiększ czas snu o 1-2h',
        impact: 'high',
        difficulty: 'medium'
      })
    }
    
    if (avgQuality < 6) {
      insights.push({
        type: 'warning',
        title: 'Niska jakość snu',
        message: `Jakość snu: ${avgQuality.toFixed(1)}/10`,
        priority: 'high'
      })
      recommendations.push({
        action: 'Stwórz rutynę przed snem',
        impact: 'high',
        difficulty: 'low'
      })
    }
    
    // Weekend vs weekday analysis
    const weekdaySleep = sleepData.filter(day => day.isWeekend === false)
    const weekendSleep = sleepData.filter(day => day.isWeekend === true)
    
    if (weekdaySleep.length > 0 && weekendSleep.length > 0) {
      const weekdayAvg = weekdaySleep.reduce((sum, day) => sum + day.duration, 0) / weekdaySleep.length
      const weekendAvg = weekendSleep.reduce((sum, day) => sum + day.duration, 0) / weekendSleep.length
      
      if (Math.abs(weekdayAvg - weekendAvg) > 2) {
        insights.push({
          type: 'info',
          title: 'Nieregularny rytm snu',
          message: 'Duża różnica między snem w tygodniu a weekendem',
          priority: 'medium'
        })
        recommendations.push({
          action: 'Utrzymuj stałą porę snu',
          impact: 'medium',
          difficulty: 'medium'
        })
      }
    }
    
    return { insights, recommendations }
  }

  // Machine Learning: Predict optimal sleep time
  predictOptimalSleepTime(sleepData, weatherData) {
    if (!sleepData || sleepData.length < 5) {
      return { recommendedBedtime: '22:00', recommendedWakeTime: '07:00', confidence: 0.5 }
    }
    
    // Analyze historical patterns
    const successfulSleeps = sleepData.filter(day => day.quality >= 7)
    if (successfulSleeps.length === 0) {
      return { recommendedBedtime: '22:00', recommendedWakeTime: '07:00', confidence: 0.5 }
    }
    
    // Calculate average bedtime and wake time for good sleep
    const avgBedtime = successfulSleeps.reduce((sum, day) => sum + day.bedtime, 0) / successfulSleeps.length
    const avgWakeTime = successfulSleeps.reduce((sum, day) => sum + day.wakeTime, 0) / successfulSleeps.length
    
    // Adjust based on weather
    let adjustment = 0
    if (weatherData.temperature > 25) {
      adjustment = -30 // Go to bed 30 min earlier in hot weather
    } else if (weatherData.temperature < 10) {
      adjustment = 15 // Go to bed 15 min later in cold weather
    }
    
    const recommendedBedtime = this.adjustTime(avgBedtime, adjustment)
    const recommendedWakeTime = this.adjustTime(avgWakeTime, adjustment)
    
    const confidence = Math.min(successfulSleeps.length / 10, 0.9)
    
    return {
      recommendedBedtime,
      recommendedWakeTime,
      confidence,
      reasoning: `Bazuje na ${successfulSleeps.length} udanych nocach snu`
    }
  }

  // Helper: Adjust time by minutes
  adjustTime(time, minutes) {
    const [hours, mins] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
  }

  // Machine Learning: Analyze productivity correlation with sleep
  analyzeProductivitySleepCorrelation(sleepData, productivityData) {
    if (!sleepData || !productivityData || sleepData.length < 5) {
      return { correlation: 0, insights: [] }
    }
    
    const insights = []
    let positiveCorrelation = 0
    let totalDays = 0
    
    // Simple correlation analysis
    for (let i = 0; i < Math.min(sleepData.length, productivityData.length); i++) {
      const sleepQuality = sleepData[i].quality
      const productivity = productivityData[i].score || 0
      
      if (sleepQuality >= 7 && productivity >= 70) {
        positiveCorrelation++
      }
      totalDays++
    }
    
    const correlation = totalDays > 0 ? positiveCorrelation / totalDays : 0
    
    if (correlation > 0.7) {
      insights.push({
        type: 'success',
        title: 'Silna korelacja snu i produktywności',
        message: 'Twój sen ma duży wpływ na produktywność',
        priority: 'low'
      })
    } else if (correlation < 0.3) {
      insights.push({
        type: 'warning',
        title: 'Słaba korelacja snu i produktywności',
        message: 'Sen może nie być głównym czynnikiem produktywności',
        priority: 'medium'
      })
    }
    
    return { correlation, insights }
  }

  // Enhanced food analysis with external data
  async analyzeFoodWithAI(foodName, imageData = null) {
    try {
      const hasInternet = await this.checkInternetConnection()
      
      if (hasInternet && this.apiKey !== 'demo-key') {
        // Use OpenAI API for advanced analysis
        return await this.analyzeWithOpenAI(foodName, imageData)
      } else {
        // Fallback to local analysis
        return await this.analyzeLocally(foodName, imageData)
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
      return await this.analyzeLocally(foodName, imageData)
    }
  }

  // OpenAI-powered food analysis
  async analyzeWithOpenAI(foodName, imageData) {
    try {
      const prompt = `Analizuj to jedzenie: "${foodName}". 
      Zwróć JSON z: nazwa (po polsku), kalorie, ocena_zdrowotnosci (1-10), 
      opis (po polsku), składniki_odżywcze, zalecenia.`
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0].message.content
        
        try {
          return JSON.parse(content)
        } catch {
          return this.parseAIResponse(content)
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
    }
    
    return null
  }

  // Parse AI response when JSON parsing fails
  parseAIResponse(response) {
    // Simple parsing for common AI response formats
    const nameMatch = response.match(/nazwa[:\s]+([^\n,]+)/i)
    const caloriesMatch = response.match(/kalorie[:\s]+(\d+)/i)
    const healthMatch = response.match(/ocena[:\s]+(\d+)/i)
    
    return {
      name: nameMatch ? nameMatch[1].trim() : 'Nieznane jedzenie',
      calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 100,
      health: healthMatch ? parseInt(healthMatch[1]) : 5,
      description: response.substring(0, 100) + '...',
      source: 'ai'
    }
  }

  // Local food analysis fallback
  async analyzeLocally(foodName, imageData) {
    const foodData = await this.fetchFoodData(foodName)
    if (foodData) {
      return foodData
    }
    
    // Generate generic food data
    return {
      name: foodName,
      calories: Math.floor(Math.random() * 200) + 50,
      health: Math.floor(Math.random() * 5) + 5,
      description: 'Analiza lokalna - sprawdź etykietę produktu',
      source: 'local'
    }
  }

  // Analyze user data and generate insights
  analyzeUserData(userData) {
    this.userData = userData
    const insights = []

    // Task completion analysis
    if (userData.tasks && userData.tasks.length > 0) {
      const totalTasks = userData.tasks.length
      const completedTasks = userData.tasks.filter(task => task.completed).length
      const completionRate = (completedTasks / totalTasks) * 100

      if (completionRate < 50) {
        insights.push({
          type: 'warning',
          title: 'Task Completion Rate Low',
          message: `You're completing only ${Math.round(completionRate)}% of your tasks. Consider breaking down larger tasks into smaller, manageable pieces.`,
          suggestion: 'Try the "2-minute rule" - if a task takes less than 2 minutes, do it immediately.',
          priority: 'high'
        })
      } else if (completionRate > 80) {
        insights.push({
          type: 'success',
          title: 'Excellent Task Management!',
          message: `You're completing ${Math.round(completionRate)}% of your tasks. Keep up the great work!!`,
          suggestion: 'Consider adding more challenging tasks to push your productivity further.',
          priority: 'low'
        })
      }
    }

    // Focus session analysis
    if (userData.focus && userData.focus.sessions) {
      const recentSessions = userData.focus.sessions.slice(-7) // Last 7 sessions
      if (recentSessions.length > 0) {
        const avgDuration = recentSessions.reduce((sum, session) => sum + session.duration, 0) / recentSessions.length
        const totalFocusTime = recentSessions.reduce((sum, session) => sum + session.duration, 0)

        if (avgDuration < 1200) { // Less than 20 minutes
          insights.push({
            type: 'info',
            title: 'Short Focus Sessions',
            message: `Your average focus session is ${Math.round(avgDuration / 60)} minutes.`,
            suggestion: 'Try extending your focus sessions gradually. Start with 25 minutes, then take a 5-minute break.',
            priority: 'medium'
          })
        }

        if (totalFocusTime < 3600) { // Less than 1 hour total
          insights.push({
            type: 'info',
            title: 'Limited Focus Time',
            message: `You've focused for ${Math.round(totalFocusTime / 60)} minutes this week.`,
            suggestion: 'Aim for at least 2-3 hours of focused work per day for optimal productivity.',
            priority: 'medium'
          })
        }
      }
    }

    // Health analysis
    if (userData.health) {
      if (userData.health.sleepQuality < 7) {
        insights.push({
          type: 'warning',
          title: 'Sleep Quality Alert',
          message: 'Your sleep quality is below optimal levels.',
          suggestion: 'Try to maintain a consistent sleep schedule and avoid screens 1 hour before bedtime.',
          priority: 'high'
        })
      }

      if (userData.health.calories < 1500) {
        insights.push({
          type: 'warning',
          title: 'Calorie Intake Low',
          message: 'Your daily calorie intake might be insufficient.',
          suggestion: 'Consider adding healthy snacks between meals and staying hydrated.',
          priority: 'medium'
        })
      }
    }

    // Streak analysis
    if (userData.streaks && userData.streaks.current > 0) {
      if (userData.streaks.current >= 7) {
        insights.push({
          type: 'success',
          title: 'Amazing Streak!',
          message: `You've maintained a ${userData.streaks.current}-day streak!`,
          suggestion: 'Keep the momentum going! Consistency is key to building lasting habits.',
          priority: 'low'
        })
      } else if (userData.streaks.current >= 3) {
        insights.push({
          type: 'info',
          title: 'Building Momentum',
          message: `You're on a ${userData.streaks.current}-day streak. Great start!`,
          suggestion: 'Focus on maintaining this rhythm. Every day counts!',
          priority: 'medium'
        })
      }
    }

    this.insights = insights
    return insights
  }

  // Generate personalized recommendations
  generateRecommendations() {
    if (!this.userData) return []

    const recommendations = []

    // Time-based recommendations
    const hour = new Date().getHours()
    if (hour >= 6 && hour <= 9) {
      recommendations.push({
        type: 'morning',
        title: 'Morning Routine',
        message: 'Start your day with a 10-minute focus session to set the tone.',
        action: 'Go to Focus'
      })
    } else if (hour >= 12 && hour <= 14) {
      recommendations.push({
        type: 'afternoon',
        title: 'Afternoon Boost',
        message: 'Take a short break and review your morning progress.',
        action: 'Check Today'
      })
    } else if (hour >= 18 && hour <= 20) {
      recommendations.push({
        type: 'evening',
        title: 'Evening Reflection',
        message: 'Review your day and plan tomorrow\'s priorities.',
        action: 'Plan Tomorrow'
      })
    }

    // Task-based recommendations
    const pendingTasks = this.userData.tasks?.filter(task => !task.completed) || []
    if (pendingTasks.length > 5) {
      recommendations.push({
        type: 'task-management',
        title: 'Task Overload',
        message: `You have ${pendingTasks.length} pending tasks. Consider prioritizing the top 3.`,
        action: 'Prioritize Tasks'
      })
    }

    // Focus recommendations
    if (this.userData.focus && !this.userData.focus.isActive) {
      recommendations.push({
        type: 'focus',
        title: 'Ready to Focus?',
        message: 'You haven\'t had a focus session today. Start one now!',
        action: 'Start Focus Session'
      })
    }

    return recommendations
  }

  // Generate motivational quotes based on user's current state
  getMotivationalQuote() {
    const quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "passion"
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: "perseverance"
      },
      {
        text: "The future depends on what you do today.",
        author: "Mahatma Gandhi",
        category: "action"
      },
      {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson",
        category: "persistence"
      },
      {
        text: "The only limit to our realization of tomorrow will be our doubts of today.",
        author: "Franklin D. Roosevelt",
        category: "belief"
      }
    ]

    // Select quote based on user's current productivity state
    if (this.userData?.tasks) {
      const completionRate = this.userData.tasks.filter(task => task.completed).length / this.userData.tasks.length
      if (completionRate < 0.5) {
        return quotes.find(q => q.category === 'persistence') || quotes[0]
      } else if (completionRate > 0.8) {
        return quotes.find(q => q.category === 'passion') || quotes[0]
      }
    }

    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  // Predict productivity patterns
  predictProductivity() {
    if (!this.userData) return null

    const predictions = {
      bestTimeToFocus: '9:00 AM - 11:00 AM',
      recommendedBreakDuration: '5 minutes',
      optimalTaskCount: 5,
      focusSessionLength: '25 minutes'
    }

    // Analyze user's historical data for better predictions
    if (this.userData.focus?.sessions?.length > 0) {
      const sessions = this.userData.focus.sessions
      const morningSessions = sessions.filter(s => {
        const hour = new Date(s.startTime).getHours()
        return hour >= 6 && hour <= 12
      })
      
      if (morningSessions.length > sessions.length * 0.6) {
        predictions.bestTimeToFocus = '6:00 AM - 10:00 AM'
      }
    }

    return predictions
  }

  // Get AI-powered insights summary
  getInsightsSummary() {
    const summary = {
      totalInsights: this.insights.length,
      highPriority: this.insights.filter(i => i.priority === 'high').length,
      recommendations: this.generateRecommendations().length,
      productivityScore: this.calculateProductivityScore()
    }

    return summary
  }

  // Calculate overall productivity score
  calculateProductivityScore() {
    if (!this.userData) return 0

    let score = 0
    let maxScore = 100

    // Task completion (40 points)
    if (this.userData.tasks && this.userData.tasks.length > 0) {
      const completionRate = this.userData.tasks.filter(task => task.completed).length / this.userData.tasks.length
      score += completionRate * 40
    }

    // Focus sessions (30 points)
    if (this.userData.focus?.sessions) {
      const weeklySessions = this.userData.focus.sessions.slice(-7)
      const sessionScore = Math.min(weeklySessions.length * 5, 30)
      score += sessionScore
    }

    // Streak (20 points)
    if (this.userData.streaks?.current) {
      const streakScore = Math.min(this.userData.streaks.current * 2, 20)
      score += streakScore
    }

    // Health (10 points)
    if (this.userData.health) {
      const healthScore = Math.min((this.userData.health.sleepQuality / 10) * 10, 10)
      score += healthScore
    }

    return Math.round(score)
  }
}

export default new AIService()
