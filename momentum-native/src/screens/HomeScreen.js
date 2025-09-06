import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const shortcuts = [
    { id: 1, title: 'Add Task', icon: '📝', color: '#3b82f6' },
    { id: 2, title: 'Focus Session', icon: '🧠', color: '#8b5cf6' },
    { id: 3, title: 'Add a Meal', icon: '🥗', color: '#10b981' },
    { id: 4, title: 'Goals', icon: '🎯', color: '#f59e0b' },
    { id: 5, title: 'Sobriety', icon: '🍃', color: '#06b6d4' },
    { id: 6, title: 'Achievements', icon: '🏆', color: '#ef4444' },
  ];

  const stats = [
    { label: 'Tasks Today', value: '8/12', color: '#3b82f6' },
    { label: 'Focus Time', value: '2.5h', color: '#8b5cf6' },
    { label: 'Streak', value: '15 days', color: '#10b981' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Evening! 🌙</Text>
        <Text style={styles.subtitle}>Ready to be productive?</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.shortcutsGrid}>
          {shortcuts.map((shortcut) => (
            <TouchableOpacity
              key={shortcut.id}
              style={[styles.shortcutCard, { backgroundColor: shortcut.color + '15' }]}
              activeOpacity={0.7}
            >
              <Text style={styles.shortcutIcon}>{shortcut.icon}</Text>
              <Text style={[styles.shortcutTitle, { color: shortcut.color }]}>
                {shortcut.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Today's Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Daily Goals</Text>
            <Text style={styles.progressPercentage}>67%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '67%' }]} />
          </View>
          <Text style={styles.progressSubtext}>8 of 12 tasks completed</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.activityText}>Completed "Morning workout"</Text>
            <Text style={styles.activityTime}>10m ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="timer" size={20} color="#8b5cf6" />
            <Text style={styles.activityText}>Finished 25min focus session</Text>
            <Text style={styles.activityTime}>1h ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="restaurant" size={20} color="#10b981" />
            <Text style={styles.activityText}>Logged lunch</Text>
            <Text style={styles.activityTime}>2h ago</Text>
          </View>
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    borderLeftWidth: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shortcutCard: {
    width: (width - 60) / 2,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  shortcutIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  activityCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
