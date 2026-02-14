import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Send, Mic, Zap, AlertCircle } from 'lucide-react-native';
import { triggerHaptic } from '../../src/utils/haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useCreditsInfo, useUseCredits } from '../../src/hooks/useCredits';
import { useCreateSession, useUpdateSession } from '../../src/hooks/useChat';
import { sendChatMessage, generateFallbackResponse } from '../../src/services/ai';
import type { ChatMessage } from '../../src/services/chat';

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const params = useLocalSearchParams<{ mood?: string; outcome?: string; personId?: string }>();
  const { remaining, isEmpty, isLoading: creditsLoading } = useCreditsInfo();
  const useCredits = useUseCredits();
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();

  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Attune, your relationship coach. Who would you like to talk about today, and what's on your mind?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Create session on first message
  useEffect(() => {
    const initSession = async () => {
      if (messages.length === 1 && !sessionId) {
        try {
          const session = await createSession.mutateAsync({
            messages: [],
            mood: params.mood || null,
            outcome_goal: params.outcome || null,
            person_id: params.personId || null,
          });
          setSessionId(session.id);
        } catch (error) {
          console.error('Failed to create session:', error);
        }
      }
    };
    initSession();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    // Check credits
    if (isEmpty) {
      Alert.alert(
        'No Credits',
        'You have no credits remaining. Credits reset at the beginning of each month.',
        [{ text: 'OK' }]
      );
      return;
    }

    triggerHaptic.light();

    const userMessage: DisplayMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Use a credit
      await useCredits.mutateAsync(1);

      // Convert messages to API format
      const apiMessages: ChatMessage[] = newMessages
        .filter(m => m.role !== 'assistant' || m.id !== '1') // Exclude initial greeting
        .map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        }));

      // Try to send to AI
      let responseContent: string;
      try {
        const response = await sendChatMessage({
          messages: apiMessages,
          mood: params.mood || null,
          outcomeGoal: params.outcome || null,
          personContext: null, // TODO: Add person context if personId is provided
        });
        responseContent = response.message;
      } catch (aiError) {
        // Fallback to local response
        console.warn('AI API error, using fallback:', aiError);
        responseContent = generateFallbackResponse(apiMessages, null, params.mood || null);
      }

      const aiResponse: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, aiResponse];
      setMessages(updatedMessages);

      // Update session in database
      if (sessionId) {
        const sessionMessages: ChatMessage[] = updatedMessages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        }));
        await updateSession.mutateAsync({
          sessionId,
          updates: { messages: sessionMessages },
        });
      }

      triggerHaptic.success();
    } catch (error) {
      console.error('Failed to send message:', error);
      triggerHaptic.error();
      Alert.alert('Error', 'Failed to send message. Please try again.');
      // Remove the user message on failure
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    triggerHaptic.medium();
    Alert.alert('Coming Soon', 'Voice input will be available in a future update.');
  };

  const renderMessage = ({ item, index }: { item: DisplayMessage; index: number }) => {
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
          <View className={`flex-row items-center gap-2 px-3 py-1.5 rounded-full ${
            isEmpty ? 'bg-red-500/20' : 'bg-white/5'
          }`}>
            <Zap size={16} color={isEmpty ? '#EF4444' : '#8B5CF6'} />
            {creditsLoading ? (
              <ActivityIndicator size="small" color="#8B5CF6" />
            ) : (
              <Text className={`text-sm ${isEmpty ? 'text-red-400' : 'text-white/70'}`}>
                {remaining}
              </Text>
            )}
          </View>
        </View>

        {/* No Credits Warning */}
        {isEmpty && (
          <View className="mx-4 mt-2 flex-row items-center p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
            <AlertCircle size={20} color="#EF4444" />
            <Text className="text-red-400 ml-2 flex-1">
              No credits remaining. Credits reset monthly.
            </Text>
          </View>
        )}

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
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#8B5CF6" />
                    <Text className="text-white/50">Thinking...</Text>
                  </View>
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
                  placeholder={isEmpty ? "No credits remaining..." : "Type your message..."}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  multiline
                  maxLength={500}
                  editable={!isEmpty}
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
                disabled={!inputText.trim() || isLoading || isEmpty}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  inputText.trim() && !isLoading && !isEmpty ? 'bg-primary-500' : 'bg-white/10'
                }`}
              >
                <Send
                  size={20}
                  color={inputText.trim() && !isLoading && !isEmpty ? 'white' : 'rgba(255,255,255,0.3)'}
                />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
