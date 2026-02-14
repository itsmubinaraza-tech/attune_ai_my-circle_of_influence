import { useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Plus, Briefcase, Heart, Users, User, RefreshCw } from 'lucide-react-native';
import { triggerHaptic } from '../../src/utils/haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { usePeopleWithAutoSeed, useCreatePerson } from '../../src/hooks/usePeople';
import type { Person, GroupType } from '../../src/types/database';

type Group = 'all' | GroupType;

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
  const { data: people, isLoading, error, refetch } = usePeopleWithAutoSeed();
  const createPerson = useCreatePerson();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Group>('all');

  const filteredPeople = (people || []).filter((person) => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || person.group === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleFilterSelect = (filter: Group) => {
    triggerHaptic.light();
    setSelectedFilter(filter);
  };

  const handlePersonPress = (personId: string) => {
    triggerHaptic.light();
    router.push(`/person/${personId}`);
  };

  const handleAddPerson = () => {
    triggerHaptic.medium();
    // For now, show a simple alert. In production, this would open a modal
    Alert.prompt(
      'Add Person',
      'Enter the name of the person you want to add:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async (name) => {
            if (name && name.trim()) {
              try {
                await createPerson.mutateAsync({
                  name: name.trim(),
                  group: 'friends', // Default group
                });
                triggerHaptic.success();
              } catch (err) {
                Alert.alert('Error', 'Failed to add person');
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const renderPerson = ({ item, index }: { item: Person; index: number }) => {
    const config = groupConfig[item.group];
    const Icon = config.icon;
    const health = item.relationship_health || 50;

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
            <Text className="text-white/50 text-sm">{item.role || item.subgroup || config.label}</Text>
          </View>
          <View className="items-end">
            <View className="w-10 h-2 rounded-full overflow-hidden bg-white/10">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${health}%`,
                  backgroundColor: health > 70 ? '#10B981' : health > 40 ? '#F59E0B' : '#EF4444',
                }}
              />
            </View>
            <Text className="text-white/40 text-xs mt-1">{health}%</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  if (error) {
    return (
      <LinearGradient colors={['#0f0a1a', '#1a0a2e', '#0f0a1a']} className="flex-1">
        <SafeAreaView className="flex-1 items-center justify-center px-4">
          <Text className="text-white text-lg mb-4">Failed to load your circle</Text>
          <Pressable
            onPress={() => refetch()}
            className="flex-row items-center gap-2 px-6 py-3 bg-primary-500 rounded-xl"
          >
            <RefreshCw size={20} color="white" />
            <Text className="text-white font-medium">Try Again</Text>
          </Pressable>
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
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-white">My Circle</Text>
            <Pressable
              onPress={handleAddPerson}
              disabled={createPerson.isPending}
              className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center"
            >
              {createPerson.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Plus size={24} color="white" />
              )}
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
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text className="text-white/50 mt-4">Loading your circle...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPeople}
            renderItem={renderPerson}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Text className="text-white/50 text-lg">
                  {searchQuery ? 'No people found' : 'Your circle is empty'}
                </Text>
                {!searchQuery && (
                  <Pressable
                    onPress={handleAddPerson}
                    className="mt-4 px-6 py-3 bg-primary-500 rounded-xl"
                  >
                    <Text className="text-white font-medium">Add Someone</Text>
                  </Pressable>
                )}
              </View>
            }
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
