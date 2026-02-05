import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Mic, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Attune, your relationship coach. Who would you like to talk about today, and what's on your mind?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response (TODO: Connect to real API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're thinking about this. Let me help you with some specific guidance:\n\n**What to Say:**\nStart with something like: "I've been meaning to talk to you about..."\n\n**How to Say It:**\nUse a warm, open tone. Maintain eye contact and relaxed body language.\n\n**What to Expect:**\nThey may need a moment to process. Be patient and listen actively.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const handleVoiceInput = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement voice input
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.role === 'user';

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50)}
        className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}
      >
        <View
          className={`max-w-[85%] px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-primary-500 rounded-br-md'
              : 'bg-white/10 rounded-bl-md'
          }`}
        >
          <Text className="text-white">{item.content}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#0f0a1a', '#1a0a2e', '#0f0a1a']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-white/10">
          <Text className="text-xl font-bold text-white">Talk to Me</Text>
          <View className="flex-row items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
            <Zap size={16} color="#8B5CF6" />
            <Text className="text-white/70 text-sm">45</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListFooterComponent={
            isLoading ? (
              <View className="items-start mb-4">
                <View className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                  <Text className="text-white/50">Thinking...</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={90}
        >
          <View className="px-4 py-3 border-t border-white/10 bg-background/80">
            <View className="flex-row items-end gap-2">
              <View className="flex-1 flex-row items-end bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type your message..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  multiline
                  maxLength={500}
                  className="flex-1 text-white max-h-24"
                  style={{ paddingTop: 8, paddingBottom: 8 }}
                />
                <Pressable
                  onPress={handleVoiceInput}
                  className="p-2 ml-2"
                >
                  <Mic size={20} color="rgba(255,255,255,0.5)" />
                </Pressable>
              </View>
              <Pressable
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  inputText.trim() && !isLoading ? 'bg-primary-500' : 'bg-white/10'
                }`}
              >
                <Send
                  size={20}
                  color={inputText.trim() && !isLoading ? 'white' : 'rgba(255,255,255,0.3)'}
                />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
