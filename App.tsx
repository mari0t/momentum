import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();

// Home Screen
function HomeScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#0f172a"
      />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>🚀 Momentum</Text>
          <Text style={styles.subtitle}>Your Productivity Companion</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 Today's Focus</Text>
            <Text style={styles.cardText}>Stay focused and productive!</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚡ Quick Actions</Text>
            <Text style={styles.cardText}>• Set daily goals</Text>
            <Text style={styles.cardText}>• Track progress</Text>
            <Text style={styles.cardText}>• Review achievements</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Today Screen
function TodayScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>📅 Today</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 Daily Goals</Text>
            <Text style={styles.cardText}>✅ Morning routine</Text>
            <Text style={styles.cardText}>⏳ Work session</Text>
            <Text style={styles.cardText}>⏳ Exercise</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Progress</Text>
            <Text style={styles.cardText}>Today: 67% complete</Text>
            <Text style={styles.cardText}>This week: 85% average</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Focus Screen
function FocusScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>🎯 Focus</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⏱️ Pomodoro Timer</Text>
            <Text style={styles.timerText}>25:00</Text>
            <Text style={styles.cardText}>Tap to start focus session</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎵 Focus Mode</Text>
            <Text style={styles.cardText}>• Block distractions</Text>
            <Text style={styles.cardText}>• Deep work session</Text>
            <Text style={styles.cardText}>• Ambient sounds</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Health Screen
function HealthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>💪 Health</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Health Overview</Text>
            <Text style={styles.cardText}>Steps: 8,542 / 10,000</Text>
            <Text style={styles.cardText}>Water: 6/8 glasses</Text>
            <Text style={styles.cardText}>Sleep: 7.5 hours</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🥗 Nutrition</Text>
            <Text style={styles.cardText}>Calories: 1,850 / 2,200</Text>
            <Text style={styles.cardText}>Protein: 85g</Text>
            <Text style={styles.cardText}>Carbs: 220g</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Profile Screen
function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>👤 Profile</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 Your Stats</Text>
            <Text style={styles.cardText}>Streak: 15 days</Text>
            <Text style={styles.cardText}>Goals completed: 127</Text>
            <Text style={styles.cardText}>Level: Productivity Master</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚙️ Settings</Text>
            <Text style={styles.cardText}>• Notifications</Text>
            <Text style={styles.cardText}>• Theme preferences</Text>
            <Text style={styles.cardText}>• Data backup</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#1e293b',
            borderTopColor: '#334155',
            height: 90,
            paddingBottom: 25,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#64748b',
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Today" 
          component={TodayScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>📅</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Focus" 
          component={FocusScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>🎯</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Health" 
          component={HealthScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>💪</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>👤</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 5,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default App;
