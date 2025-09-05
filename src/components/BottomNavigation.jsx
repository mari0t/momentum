import React, { useState, useEffect, useRef } from 'react'
import { Home, Calendar, Target, Heart, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export default function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('home')
  const [indicatorPosition, setIndicatorPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [currentDragX, setCurrentDragX] = useState(0)
  const navRef = useRef(null)
  const indicatorRef = useRef(null)

  const tabs = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'today', path: '/today', icon: Calendar, label: 'Today' },
    { id: 'focus', path: '/focus', icon: Target, label: 'Focus' },
    { id: 'health', path: '/health', icon: Heart, label: 'Health' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' }
  ]

  // Update active tab based on current location
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname)
    if (currentTab) {
      setActiveTab(currentTab.id)
    }
  }, [location.pathname])

  // Calculate indicator position
  useEffect(() => {
    if (navRef.current && indicatorRef.current) {
      const activeIndex = tabs.findIndex(tab => tab.id === activeTab)
      const navWidth = navRef.current.offsetWidth
      const tabWidth = navWidth / tabs.length
      const ballSize = 56 // w-14 = 56px
      
      // Calculate the center position for the active tab
      // Adjust positioning for each tab to ensure perfect alignment
      let offset = -10 // Default offset
      
      // Fine-tune positioning for specific tabs
      if (activeTab === 'home') {
        offset = -10
      } else if (activeTab === 'today') {
        offset = -11
      } else if (activeTab === 'focus') {
        offset = -11
      } else if (activeTab === 'health') {
        offset = -10
      } else if (activeTab === 'profile') {
        offset = -10
      }
      
      const targetPosition = (activeIndex * tabWidth) + (tabWidth / 2) - (ballSize / 2) + offset
      setIndicatorPosition(targetPosition)
    }
  }, [activeTab])

  const handleTabClick = (tabId, path) => {
    setActiveTab(tabId)
    navigate(path)
  }

  // Touch/Mouse event handlers for smooth gliding
  const handlePointerDown = (e) => {
    setIsDragging(true)
    const rect = navRef.current.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    setDragStartX(currentX)
    setCurrentDragX(currentX)
  }

  const handlePointerMove = (e) => {
    if (!isDragging) return
    
    const rect = navRef.current.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    setCurrentDragX(currentX)
    
    // Calculate which tab should be active based on drag position
    const navWidth = rect.width
    const tabWidth = navWidth / tabs.length
    const tabIndex = Math.floor(currentX / tabWidth)
    
    if (tabIndex >= 0 && tabIndex < tabs.length) {
      const newTab = tabs[tabIndex]
      if (newTab.id !== activeTab) {
        setActiveTab(newTab.id)
        navigate(newTab.path)
      }
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  // Add global event listeners for smooth dragging
  useEffect(() => {
    const handleGlobalPointerMove = (e) => {
      if (isDragging) {
        handlePointerMove(e)
      }
    }

    const handleGlobalPointerUp = () => {
      handlePointerUp()
    }

    if (isDragging) {
      document.addEventListener('pointermove', handleGlobalPointerMove, { passive: false })
      document.addEventListener('pointerup', handleGlobalPointerUp)
    }

    return () => {
      document.removeEventListener('pointermove', handleGlobalPointerMove)
      document.removeEventListener('pointerup', handleGlobalPointerUp)
    }
  }, [isDragging])

  return (
    <>
      {/* Custom CSS for smooth animations */}
      <style>{`
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.5),
                       0 0 40px rgba(147, 51, 234, 0.3),
                       0 0 60px rgba(147, 51, 234, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.7),
                       0 0 60px rgba(147, 51, 234, 0.5),
                       0 0 90px rgba(147, 51, 234, 0.3);
          }
        }

        @keyframes slimeDrip {
          0% { transform: translateY(-100%) scaleY(0); opacity: 0; }
          50% { transform: translateY(0%) scaleY(1); opacity: 1; }
          100% { transform: translateY(100%) scaleY(0); opacity: 0; }
        }

        .indicator {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slime-drip {
          position: absolute;
          width: 4px;
          height: 20px;
          background: linear-gradient(to bottom, rgba(147, 51, 234, 0.8), transparent);
          border-radius: 2px;
          animation: slimeDrip 2s ease-in-out infinite;
        }

        .slime-drip:nth-child(1) {
          left: 25%;
          animation-delay: 0s;
        }

        .slime-drip:nth-child(2) {
          left: 50%;
          animation-delay: 0.3s;
        }

        .slime-drip:nth-child(3) {
          left: 75%;
          animation-delay: 0.6s;
        }

        .nav-tab {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-tab:hover {
          transform: translateY(-2px);
        }

        .nav-tab.active-tab {
          animation: none;
        }

        .tab-icon {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tab-label {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Glide trail effects */
        .glide-trail {
          position: absolute;
          top: 2px;
          width: 2px;
          height: 44px;
          background: linear-gradient(to bottom, rgba(147, 51, 234, 0.8), transparent);
          border-radius: 1px;
          pointer-events: none;
          z-index: 5;
        }

        .glide-trail.primary {
          background: linear-gradient(to bottom, rgba(147, 51, 234, 0.9), rgba(147, 51, 234, 0.3));
          width: 3px;
        }

        .glide-trail.secondary {
          background: linear-gradient(to bottom, rgba(147, 51, 234, 0.6), rgba(147, 51, 234, 0.2));
          width: 2px;
        }

        .glide-trail.tertiary {
          background: linear-gradient(to bottom, rgba(147, 51, 234, 0.4), rgba(147, 51, 234, 0.1));
          width: 1px;
        }
      `}</style>

      {/* Bottom Navigation Container */}
      <div className="fixed bottom-4 md:bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-56 md:max-w-md mx-auto">
          {/* Navigation Bar */}
          <div 
            ref={navRef}
            className="relative bg-gray-800/90 backdrop-blur-xl rounded-full p-3 border border-gray-600/50 shadow-2xl"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ touchAction: 'none' }}
          >
            {/* Smooth Animated Indicator */}
            <div
              ref={indicatorRef}
              className="indicator absolute top-1 w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-full shadow-lg"
              style={{
                transform: `translateX(${indicatorPosition}px)`,
                animation: 'glow 2s ease-in-out infinite'
              }}
            >
              {/* Subtle inner glow */}
              <div className="absolute inset-2 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-full"></div>
              
              {/* Slimy drips */}
              <div className="slime-drip"></div>
              <div className="slime-drip"></div>
              <div className="slime-drip"></div>
            </div>

            {/* Glide Trail Effect */}
            {isDragging && (
              <>
                <div 
                  className="glide-trail primary"
                  style={{
                    left: `${Math.max(6, Math.min(currentDragX - 1.5, navRef.current?.offsetWidth - 6))}px`,
                  }}
                />
                <div 
                  className="glide-trail secondary"
                  style={{
                    left: `${Math.max(6, Math.min(currentDragX - 1, navRef.current?.offsetWidth - 6))}px`,
                  }}
                />
                <div 
                  className="glide-trail tertiary"
                  style={{
                    left: `${Math.max(6, Math.min(currentDragX - 0.5, navRef.current?.offsetWidth - 6))}px`,
                  }}
                />
              </>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between relative z-10 px-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id, tab.path)}
                    className={`nav-tab relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'text-white scale-110 active-tab' 
                        : 'text-gray-400 hover:text-gray-300 hover:scale-105'
                    }`}
                  >
                    {/* Icon with smooth transitions */}
                    <div className="tab-icon relative transition-all duration-300 flex items-center justify-center">
                                             <Icon className={`w-4 h-4 transition-all duration-300 ${
                         isActive ? 'drop-shadow-lg' : ''
                       }`} />
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
                      )}
                    </div>
                    
                    {/* Label with smooth color transitions */}
                    <span className={`tab-label text-xs mt-1 font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-purple-300' 
                        : 'text-gray-500'
                    }`}>
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
