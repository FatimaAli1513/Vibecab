import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MOODS = [
  { id: 'amazing', emoji: '🤩', label: 'Amazing', color: '#00d9a5', bg: '#00d9a520' },
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#5b8def', bg: '#5b8def20' },
  { id: 'okay', emoji: '😌', label: 'Okay', color: '#ffc048', bg: '#ffc04820' },
  { id: 'sad', emoji: '😔', label: 'Sad', color: '#a78bfa', bg: '#a78bfa20' },
  { id: 'angry', emoji: '😤', label: 'Angry', color: '#ff6b6b', bg: '#ff6b6b20' },
];

const QUOTES = [
  { text: "Every moment is a fresh beginning", icon: "🌅" },
  { text: "Your vibe attracts your tribe", icon: "✨" },
  { text: "Good things take time", icon: "🌱" },
  { text: "Stay patient and trust the journey", icon: "🛤️" },
  { text: "Be the sunshine in someone's day", icon: "☀️" },
  { text: "Small steps lead to big changes", icon: "👣" },
  { text: "You are stronger than you think", icon: "💪" },
  { text: "Today is full of possibilities", icon: "🎯" },
];

export default function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [vibeCount, setVibeCount] = useState(0);
  const [vibeHistory, setVibeHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for selected mood
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setVibeCount(vibeCount + 1);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    
    // Add to history with timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry = {
      id: Date.now(),
      mood: mood,
      time: timeString,
    };
    setVibeHistory([newEntry, ...vibeHistory]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: '☀️' };
    if (hour < 17) return { text: 'Good Afternoon', icon: '🌤️' };
    if (hour < 21) return { text: 'Good Evening', icon: '🌅' };
    return { text: 'Good Night', icon: '🌙' };
  };

  const greeting = getGreeting();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0a0a1a', '#12122a', '#1a1a3a']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
        }}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>✨</Text>
              <Text style={styles.logo}>
                Vibe<Text style={styles.logoAccent}>Cab</Text>
              </Text>
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingIcon}>{greeting.icon}</Text>
              <Text style={styles.greeting}>{greeting.text}</Text>
            </View>
          </View>

          {/* Quote Card */}
          <LinearGradient
            colors={['#1e1e3f', '#252550']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quoteCard}
          >
            <View style={styles.quoteIconContainer}>
              <Text style={styles.quoteIcon}>{quote.icon}</Text>
            </View>
            <Text style={styles.quoteText}>"{quote.text}"</Text>
            <View style={styles.quoteDecor}>
              <View style={styles.quoteLine} />
              <Text style={styles.quoteLabel}>Daily Inspiration</Text>
              <View style={styles.quoteLine} />
            </View>
          </LinearGradient>

          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionEmoji}>🎭</Text>
            <Text style={styles.question}>How's your vibe today?</Text>
          </View>

          {/* Mood Grid - First Row */}
          <View style={styles.moodRow}>
            {MOODS.slice(0, 3).map((mood) => (
              <TouchableOpacity
                key={mood.id}
                activeOpacity={0.7}
                onPress={() => handleMoodSelect(mood)}
                style={styles.moodCard}
              >
                <Animated.View
                  style={[
                    styles.moodCardInner,
                    selectedMood?.id === mood.id && {
                      borderColor: mood.color,
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={selectedMood?.id === mood.id 
                      ? [`${mood.color}30`, `${mood.color}10`]
                      : ['#1a1a35', '#15152a']}
                    style={styles.moodCardGradient}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={[
                      styles.moodLabel,
                      selectedMood?.id === mood.id && { color: mood.color }
                    ]}>
                      {mood.label}
                    </Text>
                    {selectedMood?.id === mood.id && (
                      <View style={[styles.checkBadge, { backgroundColor: mood.color }]}>
                        <Text style={styles.checkMark}>✓</Text>
                      </View>
                    )}
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Mood Grid - Second Row */}
          <View style={styles.moodRowCenter}>
            {MOODS.slice(3).map((mood) => (
              <TouchableOpacity
                key={mood.id}
                activeOpacity={0.7}
                onPress={() => handleMoodSelect(mood)}
                style={styles.moodCard}
              >
                <Animated.View
                  style={[
                    styles.moodCardInner,
                    selectedMood?.id === mood.id && {
                      borderColor: mood.color,
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={selectedMood?.id === mood.id 
                      ? [`${mood.color}30`, `${mood.color}10`]
                      : ['#1a1a35', '#15152a']}
                    style={styles.moodCardGradient}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={[
                      styles.moodLabel,
                      selectedMood?.id === mood.id && { color: mood.color }
                    ]}>
                      {mood.label}
                    </Text>
                    {selectedMood?.id === mood.id && (
                      <View style={[styles.checkBadge, { backgroundColor: mood.color }]}>
                        <Text style={styles.checkMark}>✓</Text>
                      </View>
                    )}
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selected Mood Display */}
          {selectedMood && (
            <Animated.View style={{ opacity: fadeAnim }}>
              <LinearGradient
                colors={[`${selectedMood.color}15`, `${selectedMood.color}05`]}
                style={[styles.resultCard, { borderColor: selectedMood.color }]}
              >
                <View style={[styles.resultEmojiContainer, { backgroundColor: `${selectedMood.color}20` }]}>
                  <Text style={styles.resultEmoji}>{selectedMood.emoji}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>
                    Feeling <Text style={{ color: selectedMood.color }}>{selectedMood.label}</Text>
                  </Text>
                  <Text style={styles.resultSubtitle}>
                    Keep tracking your daily vibes! ✨
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>📊 Your Status</Text>
            <View style={styles.statsRow}>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => vibeCount > 0 && setShowHistory(true)}
                style={{ flex: 1 }}
              >
                <LinearGradient
                  colors={['#1e1e3f', '#252550']}
                  style={styles.statCard}
                >
                  <View style={styles.statIconBg}>
                    <Text style={styles.statIcon}>🎯</Text>
                  </View>
                  <Text style={styles.statNumber}>{vibeCount}</Text>
                  <Text style={styles.statLabel}>Vibes Logged</Text>
                  {vibeCount > 0 && (
                    <Text style={styles.tapHint}>Tap to view →</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              
              <LinearGradient
                colors={['#1e1e3f', '#252550']}
                style={styles.statCard}
              >
                <View style={styles.statIconBg}>
                  <Text style={styles.statIcon}>🔥</Text>
                </View>
                <Text style={styles.statNumber}>{vibeCount > 0 ? 1 : 0}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </LinearGradient>
              
              <LinearGradient
                colors={['#1e1e3f', '#252550']}
                style={styles.statCard}
              >
                <View style={styles.statIconBg}>
                  <Text style={styles.statIcon}>⭐</Text>
                </View>
                <Text style={styles.statNumber}>{vibeCount > 0 ? 'A+' : '-'}</Text>
                <Text style={styles.statLabel}>Vibe Score</Text>
              </LinearGradient>
            </View>
          </View>


        </Animated.View>
      </ScrollView>

      {/* History Modal Screen */}
      <Modal
        visible={showHistory}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowHistory(false)}
      >
        <LinearGradient
          colors={['#0a0a1a', '#12122a', '#1a1a3a']}
          style={styles.modalContainer}
        >
          <StatusBar barStyle="light-content" />
          
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowHistory(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>📝 Vibe History</Text>
            <View style={{ width: 70 }} />
          </View>

          {/* Stats Summary */}
          <View style={styles.modalStats}>
            <View style={styles.modalStatItem}>
              <Text style={styles.modalStatNumber}>{vibeHistory.length}</Text>
              <Text style={styles.modalStatLabel}>Total Vibes</Text>
            </View>
            <View style={styles.modalStatDivider} />
            <View style={styles.modalStatItem}>
              <Text style={styles.modalStatNumber}>
                {vibeHistory.length > 0 ? vibeHistory[0].mood.emoji : '—'}
              </Text>
              <Text style={styles.modalStatLabel}>Latest Mood</Text>
            </View>
          </View>

          {/* History List */}
          <ScrollView 
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalScrollContent}
          >
            {vibeHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyText}>No vibes logged yet!</Text>
                <Text style={styles.emptySubtext}>Start tracking your mood</Text>
              </View>
            ) : (
              vibeHistory.map((entry, index) => (
                <View 
                  key={entry.id} 
                  style={[styles.historyCard, { borderLeftColor: entry.mood.color }]}
                >
                  <View style={styles.historyCardLeft}>
                    <View style={[styles.historyAvatarBg, { backgroundColor: `${entry.mood.color}20` }]}>
                      <Text style={styles.historyAvatar}>{entry.mood.emoji}</Text>
                    </View>
                  </View>
                  <View style={styles.historyCardCenter}>
                    <Text style={[styles.historyCardMood, { color: entry.mood.color }]}>
                      {entry.mood.label}
                    </Text>
                    <Text style={styles.historyCardTime}>🕐 {entry.time}</Text>
                  </View>
                  <View style={styles.historyCardRight}>
                    <Text style={styles.historyIndex}>#{vibeHistory.length - index}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Close Button */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowHistory(false)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#5b8def', '#4a7bd4']}
                style={styles.closeButtonGradient}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#5b8def',
    opacity: 0.03,
    top: -100,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#00d9a5',
    opacity: 0.03,
    bottom: 100,
    left: -50,
  },
  circle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ffc048',
    opacity: 0.03,
    top: '40%',
    right: -30,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 28,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoIcon: {
    fontSize: 32,
    marginRight: 8,
  },
  logo: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  logoAccent: {
    color: '#5b8def',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  greetingIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  greeting: {
    fontSize: 14,
    color: '#8892b0',
    fontWeight: '600',
  },
  quoteCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(91, 141, 239, 0.2)',
  },
  quoteIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(91, 141, 239, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quoteIcon: {
    fontSize: 30,
  },
  quoteText: {
    fontSize: 18,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
  },
  quoteDecor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  quoteLine: {
    height: 1,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  quoteLabel: {
    fontSize: 11,
    color: '#5b8def',
    marginHorizontal: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  questionEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  moodRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  moodCard: {
    width: (width - 60) / 3,
  },
  moodCardInner: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodCardGradient: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 38,
    marginBottom: 10,
  },
  moodLabel: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
  },
  resultEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resultEmoji: {
    fontSize: 32,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 4,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 14,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 20,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#5b8def',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#8892b0',
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 9,
    color: '#5b8def',
    marginTop: 6,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingBottom: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  textAlign: 'center',

  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(91, 141, 239, 0.1)',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
  },
  modalStatItem: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalStatNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#5b8def',
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#8892b0',
    marginTop: 4,
  },
  modalStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 8,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a35',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  historyCardLeft: {},
  historyAvatarBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  historyAvatar: {
    fontSize: 28,
  },
  historyCardCenter: {
    flex: 1,
  },
  historyCardMood: {
    fontSize: 17,
    fontWeight: '700',
  },
  historyCardTime: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 4,
  },
  historyCardRight: {},
  historyIndex: {
    fontSize: 14,
    color: '#5b8def',
    fontWeight: '700',
    backgroundColor: 'rgba(91, 141, 239, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 10,
  },
  closeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  closeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerLine: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 16,
  },
  footerText: {
    color: '#4a5568',
    fontSize: 12,
    marginBottom: 4,
  },
  footerHeart: {
    color: '#5b8def',
    fontSize: 12,
  },
});
