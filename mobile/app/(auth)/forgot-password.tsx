import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, ArrowLeft, Lock } from 'lucide-react-native';
import { triggerHaptic } from '../../src/utils/haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ForgotPasswordScreen() {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    triggerHaptic.medium();
    setError('');

    const { error } = await resetPassword(email.trim());

    if (error) {
      triggerHaptic.error();
      setError(error.message);
    } else {
      triggerHaptic.success();
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <LinearGradient
        colors={['#0f0a1a', '#1a0a2e', '#0f0a1a']}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 justify-center px-6">
          <Animated.View entering={FadeInDown} className="items-center">
            <View className="w-20 h-20 rounded-full bg-primary-500/20 items-center justify-center mb-6">
              <Mail size={40} color="#8B5CF6" />
            </View>
            <Text className="text-2xl font-bold text-white mb-4">Check Your Email</Text>
            <Text className="text-white/60 text-center mb-8">
              We've sent password reset instructions to {email}. Please check your inbox.
            </Text>
            <Pressable
              onPress={() => router.replace('/(auth)/sign-in')}
              className="overflow-hidden rounded-xl w-full"
            >
              <LinearGradient
                colors={['#8B5CF6', '#D946EF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 items-center justify-center"
              >
                <Text className="text-white font-semibold text-lg">Back to Sign In</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0f0a1a', '#1a0a2e', '#0f0a1a']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center px-4 py-2"
          >
            <ArrowLeft size={24} color="white" />
            <Text className="text-white ml-2">Back</Text>
          </Pressable>

          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          >
            {/* Header */}
            <Animated.View entering={FadeInDown.delay(100)} className="items-center mb-8">
              <View className="w-20 h-20 rounded-full bg-primary-500/20 items-center justify-center mb-4">
                <Lock size={40} color="#8B5CF6" />
              </View>
              <Text className="text-3xl font-bold text-white">Reset Password</Text>
              <Text className="text-white/60 mt-2 text-center">
                Enter your email and we'll send you instructions to reset your password
              </Text>
            </Animated.View>

            {/* Error Message */}
            {error ? (
              <Animated.View entering={FadeInDown} className="mb-4">
                <View className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                  <Text className="text-red-400 text-center">{error}</Text>
                </View>
              </Animated.View>
            ) : null}

            {/* Email Input */}
            <Animated.View entering={FadeInDown.delay(200)} className="mb-6">
              <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <Mail size={20} color="rgba(255,255,255,0.5)" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="flex-1 ml-3 text-white"
                />
              </View>
            </Animated.View>

            {/* Reset Button */}
            <Animated.View entering={FadeInDown.delay(300)}>
              <Pressable
                onPress={handleResetPassword}
                disabled={loading}
                className="overflow-hidden rounded-xl"
              >
                <LinearGradient
                  colors={['#8B5CF6', '#D946EF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="py-4 items-center justify-center"
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-lg">Send Reset Link</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

