import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function FocusScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Focus Sessions</Text>
        <Text style={styles.subtitle}>Pomodoro timer and focus tracking</Text>
        
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>🧠</Text>
          <Text style={styles.placeholderTitle}>Coming Soon!</Text>
          <Text style={styles.placeholderSubtext}>
            Pomodoro timer, focus sessions, and productivity tracking
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 40,
  },
  placeholder: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginTop: 50,
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
});
