import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Zap,
  Crown,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

function SettingItem({ icon, label, value, onPress, showChevron = true }: SettingItemProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      className="flex-row items-center py-4 border-b border-white/5"
    >
      <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center mr-4">
        {icon}
      </View>
      <Text className="flex-1 text-white text-base">{label}</Text>
      {value && <Text className="text-white/50 mr-2">{value}</Text>}
      {showChevron && <ChevronRight size={20} color="rgba(255,255,255,0.3)" />}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const handleSignOut = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    // TODO: Implement sign out
  };

  return (
    <LinearGradient
      colors={['#0f0a1a', '#1a0a2e', '#0f0a1a']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-4 pt-4 pb-6">
            <Text className="text-2xl font-bold text-white mb-6">Settings</Text>

            {/* Profile Card */}
            <Animated.View entering={FadeInDown.delay(100)}>
              <Pressable className="flex-row items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <View className="w-16 h-16 rounded-full bg-primary-500/20 items-center justify-center mr-4">
                  <User size={32} color="#8B5CF6" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-lg">User Name</Text>
                  <Text className="text-white/50">user@email.com</Text>
                </View>
                <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
              </Pressable>
            </Animated.View>
          </View>

          {/* Credits Card */}
          <Animated.View entering={FadeInDown.delay(200)} className="px-4 mb-6">
            <LinearGradient
              colors={['#8B5CF6', '#D946EF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-4 rounded-2xl"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white/80 text-sm">Monthly Credits</Text>
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-white font-bold text-3xl">45</Text>
                    <Text className="text-white/60">/ 50</Text>
                  </View>
                </View>
                <Zap size={40} color="white" />
              </View>
              <View className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                <View className="h-full bg-white rounded-full" style={{ width: '90%' }} />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Upgrade Card */}
          <Animated.View entering={FadeInDown.delay(300)} className="px-4 mb-6">
            <Pressable className="flex-row items-center p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <Crown size={24} color="#F59E0B" />
              <View className="flex-1 ml-3">
                <Text className="text-white font-semibold">Upgrade to Premium</Text>
                <Text className="text-white/50 text-sm">Unlimited messages & more</Text>
              </View>
              <Text className="text-amber-500 font-semibold">$9.99/mo</Text>
            </Pressable>
          </Animated.View>

          {/* Settings List */}
          <Animated.View entering={FadeInDown.delay(400)} className="px-4">
            <Text className="text-white/50 text-sm mb-2 uppercase tracking-wider">
              Preferences
            </Text>
            <View className="bg-white/5 rounded-2xl px-4 mb-6">
              <SettingItem
                icon={<Bell size={20} color="#8B5CF6" />}
                label="Notifications"
                value="On"
              />
              <SettingItem
                icon={<Shield size={20} color="#8B5CF6" />}
                label="Privacy"
              />
              <SettingItem
                icon={<HelpCircle size={20} color="#8B5CF6" />}
                label="Help & Support"
              />
            </View>

            <Pressable
              onPress={handleSignOut}
              className="flex-row items-center justify-center py-4 bg-red-500/10 border border-red-500/30 rounded-2xl mb-8"
            >
              <LogOut size={20} color="#EF4444" />
              <Text className="text-red-400 font-semibold ml-2">Sign Out</Text>
            </Pressable>

            <Text className="text-center text-white/30 text-sm mb-8">
              Attune v1.0.0
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
