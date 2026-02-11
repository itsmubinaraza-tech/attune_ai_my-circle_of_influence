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
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react-native';
import { triggerHaptic } from '../../src/utils/haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../src/contexts/AuthContext';
import Svg, { Path } from 'react-native-svg';

// Google Logo SVG Component
function GoogleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export default function SignUpScreen() {
  const { signUp, signInWithGoogle, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    triggerHaptic.medium();
    setError('');

    const { error } = await signUp(email.trim(), password, fullName.trim());

    if (error) {
      triggerHaptic.error();
      setError(error.message);
    } else {
      triggerHaptic.success();
      setSuccess(true);
    }
  };

  const handleGoogleSignIn = async () => {
    triggerHaptic.medium();
    setError('');
    setGoogleLoading(true);

    const { error } = await signInWithGoogle();

    setGoogleLoading(false);

    if (error) {
      triggerHaptic.error();
      if (error.message !== 'Sign in was cancelled') {
        setError(error.message);
      }
    } else {
      triggerHaptic.success();
      router.replace('/(tabs)');
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
            <View className="w-20 h-20 rounded-full bg-green-500/20 items-center justify-center mb-6">
              <Text className="text-4xl">✓</Text>
            </View>
            <Text className="text-2xl font-bold text-white mb-4">Check Your Email</Text>
            <Text className="text-white/60 text-center mb-8">
              We've sent a confirmation link to {email}. Please check your inbox and confirm your email address.
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
              <Image
                source={require('../../assets/icon.png')}
                className="w-16 h-16 rounded-2xl mb-4"
              />
              <Text className="text-3xl font-bold text-white">Create Account</Text>
              <Text className="text-white/60 mt-2">Start your relationship journey</Text>
            </Animated.View>

            {/* Error Message */}
            {error ? (
              <Animated.View entering={FadeInDown} className="mb-4">
                <View className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                  <Text className="text-red-400 text-center">{error}</Text>
                </View>
              </Animated.View>
            ) : null}

            {/* Full Name Input */}
            <Animated.View entering={FadeInDown.delay(200)} className="mb-4">
              <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <User size={20} color="rgba(255,255,255,0.5)" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full name"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  autoCapitalize="words"
                  autoComplete="name"
                  className="flex-1 ml-3 text-white"
                />
              </View>
            </Animated.View>

            {/* Email Input */}
            <Animated.View entering={FadeInDown.delay(300)} className="mb-4">
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

            {/* Password Input */}
            <Animated.View entering={FadeInDown.delay(400)} className="mb-4">
              <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <Lock size={20} color="rgba(255,255,255,0.5)" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  className="flex-1 ml-3 text-white"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color="rgba(255,255,255,0.5)" />
                  ) : (
                    <Eye size={20} color="rgba(255,255,255,0.5)" />
                  )}
                </Pressable>
              </View>
            </Animated.View>

            {/* Confirm Password Input */}
            <Animated.View entering={FadeInDown.delay(500)} className="mb-6">
              <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <Lock size={20} color="rgba(255,255,255,0.5)" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  className="flex-1 ml-3 text-white"
                />
              </View>
            </Animated.View>

            {/* Sign Up Button */}
            <Animated.View entering={FadeInDown.delay(600)}>
              <Pressable
                onPress={handleSignUp}
                disabled={loading || googleLoading}
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
                    <Text className="text-white font-semibold text-lg">Create Account</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </Animated.View>

            {/* Divider */}
            <Animated.View entering={FadeInDown.delay(650)} className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-white/20" />
              <Text className="text-white/40 mx-4">or</Text>
              <View className="flex-1 h-px bg-white/20" />
            </Animated.View>

            {/* Google Sign In */}
            <Animated.View entering={FadeInDown.delay(700)}>
              <Pressable
                onPress={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="flex-row items-center justify-center bg-white rounded-xl py-4"
              >
                {googleLoading ? (
                  <ActivityIndicator color="#4285F4" />
                ) : (
                  <>
                    <GoogleLogo />
                    <Text className="text-gray-800 font-semibold ml-3">
                      Continue with Google
                    </Text>
                  </>
                )}
              </Pressable>
            </Animated.View>

            {/* Terms */}
            <Animated.View entering={FadeInDown.delay(750)} className="mt-6">
              <Text className="text-white/40 text-center text-sm">
                By signing up, you agree to our{' '}
                <Text className="text-primary-400">Terms of Service</Text> and{' '}
                <Text className="text-primary-400">Privacy Policy</Text>
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
