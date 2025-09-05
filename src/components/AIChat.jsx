import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Brain, X } from 'lucide-react'

const AIChat = ({ isOpen, onClose, userData }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when chat opens
      setMessages([
        {
          id: 1,
          type: 'ai',
          content: "Hi! I'm your AI productivity assistant. I'm here to help you stay focused and productive. What would you like to know?",
          timestamp: new Date()
        }
      ])
    }
  }, [isOpen])

  const generateAIResponse = async (userMessage) => {
    setIsTyping(true)
    
    // Simulate AI processing time
    setTimeout(() => {
      let response = ""
      
      // Simple AI logic based on user input and context
      const lowerMessage = userMessage.toLowerCase()
      
      if (lowerMessage.includes('focus') || lowerMessage.includes('concentrate')) {
        response = "To improve focus, try the Pomodoro technique: 25 minutes of work followed by a 5-minute break. Also, eliminate distractions by putting your phone in another room and using noise-canceling headphones."
      } else if (lowerMessage.includes('motivation') || lowerMessage.includes('motivated')) {
        response = "Remember why you started! Break your big goals into smaller, achievable tasks. Celebrate each small win. You're building momentum - every focused minute counts towards your success."
      } else if (lowerMessage.includes('tired') || lowerMessage.includes('energy')) {
        response = "Take a short break! Stand up, stretch, or take a quick walk. Hydrate with water. If you're really tired, a 20-minute power nap can work wonders for your energy and focus."
      } else if (lowerMessage.includes('task') || lowerMessage.includes('overwhelm')) {
        response = "Don't try to do everything at once! Pick your top 3 priorities for today. Use the '2-minute rule' - if something takes less than 2 minutes, do it immediately. Break complex tasks into smaller steps."
      } else if (lowerMessage.includes('break') || lowerMessage.includes('rest')) {
        response = "Great idea! Taking breaks actually improves productivity. Try the 52/17 rule: 52 minutes of focused work, then 17 minutes of rest. Use breaks to move, hydrate, or just breathe deeply."
      } else if (lowerMessage.includes('goal') || lowerMessage.includes('plan')) {
        response = "Start with your big vision, then break it down. What's your goal for this week? This month? This year? Write it down and review it daily. Remember: progress over perfection!"
      } else if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
        response = "Take a deep breath. You're doing great! Focus on what you can control right now. Break overwhelming tasks into tiny steps. Remember: one step at a time is still progress."
      } else if (lowerMessage.includes('habit') || lowerMessage.includes('routine')) {
        response = "Building habits takes time - be patient with yourself! Start small: just 5 minutes a day. Stack new habits onto existing ones. Track your progress and celebrate consistency, not perfection."
      } else {
        // Default responses based on context
        const responses = [
          "I'm here to help you stay productive! Try asking me about focus techniques, motivation, task management, or productivity tips.",
          "Great question! Remember that productivity is about working smarter, not harder. What specific area would you like to improve?",
          "I can help you with focus strategies, time management, goal setting, and more. What's on your mind right now?",
          "Let's make this focus session count! What's your biggest productivity challenge right now?"
        ]
        response = responses[Math.floor(Math.random() * responses.length)]
      }
      
      // Add context-aware suggestions
      if (userData?.focus?.sessions?.length > 0) {
        const recentSessions = userData.focus.sessions.slice(-3)
        const avgDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length
        
        if (avgDuration < 1200) { // Less than 20 minutes
          response += "\n\n💡 Tip: I notice your focus sessions are quite short. Try gradually increasing them by 5 minutes each day!"
        }
      }
      
      if (userData?.tasks?.length > 0) {
        const completionRate = userData.tasks.filter(t => t.completed).length / userData.tasks.length
        if (completionRate < 0.5) {
          response += "\n\n💡 Tip: You're completing less than half your tasks. Try the 'eat the frog' method - tackle your hardest task first thing!"
        }
      }
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return
    
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    
    // Generate AI response
    generateAIResponse(inputMessage)
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Productivity Coach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about productivity..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AIChat
