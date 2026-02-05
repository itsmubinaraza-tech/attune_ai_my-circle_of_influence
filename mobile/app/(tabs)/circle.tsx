import { useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Plus, Briefcase, Heart, Users, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Group = 'all' | 'work' | 'family' | 'friends' | 'acquaintances';

interface Person {
  id: string;
  name: string;
  group: 'work' | 'family' | 'friends' | 'acquaintances';
  role?: string;
  health: number;
}

// Demo data
const demoPeople: Person[] = [
  { id: '1', name: 'Sarah Chen', group: 'work', role: 'Manager', health: 85 },
  { id: '2', name: 'Mom', group: 'family', role: 'Parent', health: 90 },
  { id: '3', name: 'Alex Rivera', group: 'friends', role: 'Close friend', health: 75 },
  { id: '4', name: 'Dr. Amanda', group: 'acquaintances', role: 'Doctor', health: 60 },
  { id: '5', name: 'Marcus Johnson', group: 'work', role: 'Colleague', health: 70 },
  { id: '6', name: 'Dad', group: 'family', role: 'Parent', health: 95 },
];

const groupConfig = {
  work: { icon: Briefcase, color: '#6366F1', label: 'Work' },
  family: { icon: Heart, color: '#EC4899', label: 'Family' },
  friends: { icon: Users, color: '#10B981', label: 'Friends' },
  acquaintances: { icon: User, color: '#F59E0B', label: 'Acquaintances' },
};

const filters: { id: Group; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'work', label: 'Work' },
  { id: 'family', label: 'Family' },
  { id: 'friends', label: 'Friends' },
  { id: 'acquaintances', label: 'Other' },
];

export default function CircleScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Group>('all');

  const filteredPeople = demoPeople.filter((person) => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || person.group === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleFilterSelect = (filter: Group) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFilter(filter);
  };

  const handlePersonPress = (personId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/person/${personId}`);
  };

  const renderPerson = ({ item, index }: { item: Person; index: number }) => {
    const config = groupConfig[item.group];
    const Icon = config.icon;

    return (
      <Animated.View entering={FadeInDown.delay(index * 50)}>
        <Pressable
          onPress={() => handlePersonPress(item.id)}
          className="flex-row items-center p-4 bg-white/5 rounded-xl border border-white/10 mb-3"
        >
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-4"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon size={24} color={config.color} />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-lg">{item.name}</Text>
            <Text className="text-white/50 text-sm">{item.role}</Text>
          </View>
          <View className="items-end">
            <View
              className="w-10 h-2 rounded-full overflow-hidden bg-white/10"
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: `${item.health}%`,
                  backgroundColor: item.health > 70 ? '#10B981' : item.health > 40 ? '#F59E0B' : '#EF4444',
                }}
              />
            </View>
            <Text className="text-white/40 text-xs mt-1">{item.health}%</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#0f0a1a', '#1a0a2e', '#0f0a1a']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-white">My Circle</Text>
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center"
            >
              <Plus size={24} color="white" />
            </Pressable>
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4">
            <Search size={20} color="rgba(255,255,255,0.5)" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search your circle..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              className="flex-1 ml-3 text-white"
            />
          </View>

          {/* Filters */}
          <View className="flex-row gap-2 mb-4">
            {filters.map((filter) => (
              <Pressable
                key={filter.id}
                onPress={() => handleFilterSelect(filter.id)}
                className={`px-4 py-2 rounded-full ${
                  selectedFilter === filter.id
                    ? 'bg-primary-500'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <Text
                  className={
                    selectedFilter === filter.id ? 'text-white font-medium' : 'text-white/70'
                  }
                >
                  {filter.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* People List */}
        <FlatList
          data={filteredPeople}
          renderItem={renderPerson}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-white/50 text-lg">No people found</Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
