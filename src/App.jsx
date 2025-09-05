import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import BottomNavigation from './components/BottomNavigation'
import Home from './components/Home'
import Today from './components/Today'
import Focus from './components/Focus'
import Health from './components/Health'
import Profile from './components/Profile'

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/today" element={<Today />} />
              <Route path="/focus" element={<Focus />} />
              <Route path="/health" element={<Health />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <BottomNavigation />
        </div>
      </Router>
    </AppProvider>
  )
}

export default App