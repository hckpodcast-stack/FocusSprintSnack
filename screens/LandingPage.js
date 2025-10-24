// screens/LandingPage.js
import React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '../Contexts/AuthContext';

const highlights = [
  'One focused check-in scheduled around your biggest free block each day.',
  'Answer with text or a quick voice note and we do the rest.',
  'Smart scoring plus gentle nudges when momentum stalls.',
  'Privacy-first: only free/busy windows and progress stats are stored.',
];

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const handleGetStarted = () => {
    onNext();
  };

  return (
    <View style={styles.background}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>FocusSprint</Text>
          </View>

          <Text style={styles.title}>Daily accountability without the overwhelm.</Text>

          <Text style={styles.subtitle}>
            FocusSprint sends one high-impact check-in at the right moment, helps you log
            what you accomplished, and nudges you back on track when life gets busy.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Here&apos;s exactly what you&apos;re signing up for:</Text>
            {highlights.map((item) => (
              <View key={item} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.details}>
            <Text style={styles.detailsTitle}>How it works</Text>
            <Text style={styles.detailsText}>
              Connect your Google Calendar so we can spot the best time to check in.
              When the push arrives, tap it, answer in a sentence or record a voice note,
              and instantly see how you&apos;re tracking. Miss a few days? We&apos;ll pause,
              recalibrate, and help you restart with smaller steps.
            </Text>
          </View>
          <Pressable style={styles.cta} onPress={signOut}>
            <Text style={styles.ctaText}>Sign Out</Text>
          </Pressable>
          <Pressable style={styles.cta} onPress={handleGetStarted}>
            <Text style={styles.ctaText}>I&apos;m in — show me the check-in</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 24,
  },
  badge: {
    marginTop: 24,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f8fafc',
    lineHeight: 38,
  },
  subtitle: {
    color: '#cbd5f5',
    fontSize: 18,
    lineHeight: 26,
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    gap: 12,
  },
  cardTitle: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    color: '#38bdf8',
    fontSize: 18,
    lineHeight: 26,
  },
  listText: {
    color: '#f1f5f9',
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  details: {
    gap: 8,
  },
  detailsTitle: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  detailsText: {
    color: '#f8fafc',
    fontSize: 16,
    lineHeight: 24,
  },
  cta: {
    backgroundColor: '#38bdf8',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  ctaText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});