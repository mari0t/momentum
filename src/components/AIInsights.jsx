import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import aiService from '../services/aiService'
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ArrowRight,
  Sparkles
} from 'lucide-react'

const AIInsights = () => {
  const { state } = useApp()
  const [insights, setInsights] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [productivityScore, setProductivityScore] = useState(0)
  const [predictions, setPredictions] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    analyzeData()
  }, [state])

  const analyzeData = () => {
    setIsAnalyzing(true)
    
    // Simulate AI processing time
    setTimeout(() => {
      const userData = {
        tasks: state.tasks,
        health: state.health,
        focus: state.focus,
        streaks: state.streaks
      }

      const newInsights = aiService.analyzeUserData(userData)
      const newRecommendations = aiService.generateRecommendations()
      const newScore = aiService.calculateProductivityScore()
      const newPredictions = aiService.predictProductivity()

      setInsights(newInsights)
      setRecommendations(newRecommendations)
      setProductivityScore(newScore)
      setPredictions(newPredictions)
      setIsAnalyzing(false)
    }, 1000)
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Lightbulb className="w-5 h-5 text-purple-600" />
    }
  }

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700'
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
      default:
        return 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              AI Insights
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Intelligent analysis of your productivity patterns
            </p>
          </div>
        </div>
        
        <button
          onClick={analyzeData}
          disabled={isAnalyzing}
          className="btn-primary flex items-center gap-2 w-full justify-center"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Refresh Analysis
            </>
          )}
        </button>
      </div>

      {/* Productivity Score */}
      <div className="card text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Your Productivity Score
        </h3>
        <div className="relative inline-flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{productivityScore}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">/ 100</div>
            </div>
          </div>
          <svg className="absolute w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-primary-600"
              strokeDasharray={`${(productivityScore / 100) * 352} 352`}
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="mt-4">
          {productivityScore >= 80 && (
            <p className="text-green-600 dark:text-green-400 font-medium">Excellent! Keep up the great work!</p>
          )}
          {productivityScore >= 60 && productivityScore < 80 && (
            <p className="text-blue-600 dark:text-blue-400 font-medium">Good progress! You're on the right track.</p>
          )}
          {productivityScore < 60 && (
            <p className="text-yellow-600 dark:text-yellow-400 font-medium">Room for improvement. Check the insights below!</p>
          )}
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Smart Insights ({insights.length})
          </h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {insight.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {insight.message}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      💡 {insight.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Personalized Recommendations ({recommendations.length})
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {rec.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {rec.message}
                    </p>
                    <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                      {rec.action} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Predictions */}
      {predictions && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Predictions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Best Focus Time</div>
              <div className="font-medium text-purple-600 dark:text-purple-400">{predictions.bestTimeToFocus}</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Optimal Tasks</div>
              <div className="font-medium text-green-600 dark:text-green-400">{predictions.optimalTaskCount}</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Focus Duration</div>
              <div className="font-medium text-blue-600 dark:text-blue-400">{predictions.focusSessionLength}</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Break Duration</div>
              <div className="font-medium text-orange-600 dark:text-orange-400">{predictions.recommendedBreakDuration}</div>
            </div>
          </div>
        </div>
      )}

      {/* No Insights State */}
      {insights.length === 0 && recommendations.length === 0 && !isAnalyzing && (
        <div className="card text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Insights Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start using the app to generate personalized AI insights and recommendations.
          </p>
          <button
            onClick={analyzeData}
            className="btn-primary"
          >
            Generate First Analysis
          </button>
        </div>
      )}
    </div>
  )
}

export default AIInsights
