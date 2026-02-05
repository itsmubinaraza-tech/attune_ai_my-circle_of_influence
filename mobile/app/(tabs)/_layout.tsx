import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Users, MessageCircle, User } from 'lucide-react-native';

interface TabIconProps {
  focused: boolean;
  color: string;
  icon: React.ReactNode;
  label: string;
}

function TabIcon({ focused, color, icon, label }: TabIconProps) {
  return (
    <View className="items-center justify-center pt-2">
      {icon}
      <Text
        className={`text-xs mt-1 ${focused ? 'text-primary-500' : 'text-gray-500'}`}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#0f0a1a',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          ) : null,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              icon={<Home size={24} color={color} />}
              label="Today"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'Circle',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              icon={<Users size={24} color={color} />}
              label="Circle"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Talk',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              icon={<MessageCircle size={24} color={color} />}
              label="Talk"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Me',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              icon={<User size={24} color={color} />}
              label="Me"
            />
          ),
        }}
      />
    </Tabs>
  );
}
