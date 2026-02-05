import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mic, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

type Mood = 'calm' | 'anxious' | 'frustrated' | 'hopeful' | 'tired' | 'motivated' | 'uncertain' | 'confident';

const moods: { id: Mood; label: string; emoji: string }[] = [
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'frustrated', label: 'Frustrated', emoji: '😤' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌟' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'motivated', label: 'Motivated', emoji: '💪' },
  { id: 'uncertain', label: 'Uncertain', emoji: '🤔' },
  { id: 'confident', label: 'Confident', emoji: '😎' },
];

const outcomes = [
  { id: 'resolve', label: 'Resolve conflict', icon: '🤝' },
  { id: 'connect', label: 'Deepen connection', icon: '❤️' },
  { id: 'understand', label: 'Understand better', icon: '💡' },
  { id: 'express', label: 'Express myself', icon: '🗣️' },
  { id: 'support', label: 'Show support', icon: '🤗' },
  { id: 'boundaries', label: 'Set boundaries', icon: '🛡️' },
];

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);

  const handleMoodSelect = (mood: Mood) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMood(mood);
  };

  const handleOutcomeSelect = (outcome: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOutcome(outcome);
  };

  const handleQuickTalk = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Open Quick Talk modal
  };

  const handleConnect = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/chat');
  };

  return (
    <LinearGradient
      colors={['#0f0a1a', '#1a0a2e', '#0f0a1a']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)} className="flex-row items-center justify-between mt-4 mb-6">
            <View className="flex-row items-center gap-3">
              <Image
                source={require('../../assets/icon.png')}
                className="w-10 h-10 rounded-xl"
              />
              <Text className="text-2xl font-bold text-white">Attune</Text>
            </View>
          </Animated.View>

          {/* Mood Selector */}
          <Animated.View entering={FadeInDown.delay(200)} className="mb-6">
            <Text className="text-white/70 text-sm mb-3">How are you feeling?</Text>
            <View className="flex-row flex-wrap gap-2">
              {moods.map((mood) => (
                <Pressable
                  key={mood.id}
                  onPress={() => handleMoodSelect(mood.id)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedMood === mood.id
                      ? 'bg-primary-500/30 border-primary-500'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <Text className="text-white">
                    {mood.emoji} {mood.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Person Search */}
          <Animated.View entering={FadeInDown.delay(300)} className="mb-6">
            <Text className="text-white/70 text-sm mb-3">Who do you want to connect with?</Text>
            <Pressable
              onPress={() => router.push('/circle')}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <Text className="text-white/50">Search your circle...</Text>
            </Pressable>
          </Animated.View>

          {/* Outcome Selector */}
          <Animated.View entering={FadeInDown.delay(400)} className="mb-6">
            <Text className="text-white/70 text-sm mb-3">What's your goal?</Text>
            <View className="flex-row flex-wrap gap-2">
              {outcomes.map((outcome) => (
                <Pressable
                  key={outcome.id}
                  onPress={() => handleOutcomeSelect(outcome.id)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedOutcome === outcome.id
                      ? 'bg-secondary-500/30 border-secondary-500'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <Text className="text-white">
                    {outcome.icon} {outcome.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInUp.delay(500)} className="gap-3 mb-8">
            {/* Let's Connect Button */}
            <Pressable
              onPress={handleConnect}
              className="overflow-hidden rounded-xl"
            >
              <LinearGradient
                colors={['#8B5CF6', '#D946EF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row items-center justify-center gap-2 py-4"
              >
                <Text className="text-white font-semibold text-lg">Let's Connect</Text>
                <ArrowRight size={20} color="white" />
              </LinearGradient>
            </Pressable>

            {/* Quick Talk Button */}
            <Pressable
              onPress={handleQuickTalk}
              className="flex-row items-center justify-center gap-2 py-4 bg-white/10 rounded-xl border border-white/20"
            >
              <Mic size={20} color="#8B5CF6" />
              <Text className="text-white font-semibold">Quick Talk</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
