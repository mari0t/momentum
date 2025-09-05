# Momentum - Productivity App 🚀

A mobile-first productivity application focused on wellness, focus, and personal growth. Built with React, Tailwind CSS, and modern web technologies.

## ✨ Features

### 🏠 **HOME (Main Dashboard)**
- Daily Streak Counter with motivational tracking
- Welcome message and daily motivational quotes
- Health snapshots (sleep quality, calories)
- Last 7 days progress visualization
- Today's task progress overview
- Interactive calendar widget
- Quick access Focus button

### ❤️ **HEALTH**
- Sleep quality tracking (1-10 scale) with ML analysis
- Calorie counter with daily input and food tracking
- AI-powered food recognition from photos
- Barcode scanner for product analysis
- Calorie calculator with BMR/TDEE formulas
- Sleep pattern analysis and recommendations
- Weather-based sleep optimization
- Comprehensive health statistics and progress bars

### 🎯 **FOCUS**
- Pomodoro-style focus timer (25/5/15 min cycles)
- Do Not Disturb mode toggle
- Advanced app blocking and notification control
- Social media and entertainment app restrictions
- iOS/Android specific focus mode features
- Focus session tracking and history
- AI-powered productivity coaching
- Comprehensive focus statistics and progress

### 📅 **TODAY (Task Management)**
- Add new tasks with priority levels
- Optional time slots for scheduling
- Task completion tracking
- Task categorization system
- Daily task overview and progress

### 👤 **PROFILE**
- User statistics and achievements
- App settings and preferences
- Dark mode toggle
- Data export and backup
- PWA installation guide

## 🛠️ Technical Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with dark mode
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **State Management**: React Context API with useReducer
- **Data Storage**: Local Storage (localStorage)
- **Routing**: React Router DOM
- **PWA**: Progressive Web App support

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd momentum-productivity-app
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📱 PWA Installation (Mobile App)

Momentum is a Progressive Web App (PWA) that can be installed on your phone for a native app experience!

### **Android Installation:**
1. Open Chrome browser on your Android device
2. Navigate to your Momentum app
3. Tap the **three dots menu** (⋮) in Chrome
4. Select **"Add to Home screen"**
5. Tap **"Add"** to install

### **iOS Installation:**
1. Open Safari browser on your iPhone/iPad
2. Navigate to your Momentum app
3. Tap the **Share button** (square with arrow)
4. Select **"Add to Home Screen"**
5. Tap **"Add"** to install

### **Benefits of PWA Installation:**
- ✅ **Native app feel** - Looks and works like a real app
- ✅ **Offline support** - Works without internet connection
- ✅ **Home screen access** - Quick launch from phone home screen
- ✅ **Full screen mode** - No browser UI distractions
- ✅ **Push notifications** - Get reminders and updates
- ✅ **Auto-updates** - Always has the latest version

## 🗄️ Data Models

### Task
```javascript
{
  id: string,
  title: string,
  completed: boolean,
  priority: 'low' | 'medium' | 'high',
  category: string,
  timeSlot: string,
  date: string
}
```

### Health
```javascript
{
  sleepQuality: number, // 1-10
  calories: number,
  lastUpdated: string
}
```

### Focus Session
```javascript
{
  id: string,
  startTime: string,
  endTime: string,
  duration: number,
  type: 'pomodoro' | 'break' | 'long-break'
}
```

### Streaks
```javascript
{
  current: number,
  longest: number,
  lastUpdated: string
}
```

## 🎨 Design Principles

- **Mobile-first responsive design**
- **Minimalist interface** with clean aesthetics
- **Quick access** to core features
- **Visual progress indicators** for motivation
- **Consistent color scheme** with dark mode support
- **Card-based layout** for easy scanning
- **Bottom navigation** for thumb-friendly access

## 🔄 User Journey

1. **Daily Check-in**: View streak, motivational quote, and daily goals
2. **Task Management**: Add, complete, and track daily tasks
3. **Health Tracking**: Monitor sleep and nutrition habits
4. **Focus Sessions**: Use Pomodoro timer for deep work
5. **Progress Review**: Track weekly progress and achievements
6. **Profile Management**: Export data, adjust settings, view stats

## 🎯 MVP Features

- ✅ Local data storage with persistence
- ✅ Basic state management
- ✅ Simple form inputs
- ✅ Timer functionality
- ✅ Progress tracking
- ✅ Responsive design
- ✅ Dark mode support
- ✅ PWA installation
- ✅ Offline capability

## 🚀 Future Enhancements

- **Cloud Sync**: Multi-device data synchronization
- **Social Features**: Share achievements with friends
- **Advanced Analytics**: Detailed progress insights
- **Customization**: Themes, layouts, and preferences
- **Integration**: Calendar, fitness apps, and productivity tools
- **AI Assistant**: Smart task suggestions and reminders

## 🎨 Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- **Primary**: Blue shades for main actions
- **Success**: Green for completed tasks
- **Warning**: Yellow for important items
- **Danger**: Red for destructive actions

### Dark Mode
Toggle between light and dark themes using:
- Header toggle button
- Bottom navigation theme button
- Profile settings

## 📱 PWA Features

- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: App-like installation experience
- **Responsive Design**: Works on all device sizes
- **Touch Optimized**: Mobile-first interaction design
- **Fast Loading**: Optimized performance and caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons
- **Vite** for the fast build tool
- **PWA Community** for progressive web app standards

---

**Built with ❤️ for productivity and wellness**
