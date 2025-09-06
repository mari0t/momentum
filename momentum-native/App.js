import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import HomeScreen from './src/screens/HomeScreen';
import TodayScreen from './src/screens/TodayScreen';
import FocusScreen from './src/screens/FocusScreen';
import HealthScreen from './src/screens/HealthScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#0f172a" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Today') {
                iconName = focused ? 'today' : 'today-outline';
              } else if (route.name === 'Focus') {
                iconName = focused ? 'timer' : 'timer-outline';
              } else if (route.name === 'Health') {
                iconName = focused ? 'fitness' : 'fitness-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#64748b',
            tabBarStyle: {
              backgroundColor: '#1e293b',
              borderTopColor: '#334155',
              paddingTop: 5,
              paddingBottom: 5,
              height: 60,
            },
            headerStyle: {
              backgroundColor: '#0f172a',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Overview' }}
          />
          <Tab.Screen 
            name="Today" 
            component={TodayScreen}
            options={{ title: 'Today' }}
          />
          <Tab.Screen 
            name="Focus" 
            component={FocusScreen}
            options={{ title: 'Focus' }}
          />
          <Tab.Screen 
            name="Health" 
            component={HealthScreen}
            options={{ title: 'Health' }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});