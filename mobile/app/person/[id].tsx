import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import {
  X,
  Edit3,
  Trash2,
  Archive,
  MessageCircle,
  Phone,
  Mail,
  Briefcase,
  Heart,
  Users,
  User,
  Calendar,
  CheckCircle,
  Clock,
  Save,
} from 'lucide-react-native';
import { triggerHaptic } from '../../src/utils/haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { usePerson, useUpdatePerson, useArchivePerson, useDeletePerson, useUpdateLastContact } from '../../src/hooks/usePeople';
import { usePersonInteractions } from '../../src/hooks/useInteractions';
import type { GroupType } from '../../src/types/database';

const groupConfig = {
  work: { icon: Briefcase, color: '#6366F1', label: 'Work' },
  family: { icon: Heart, color: '#EC4899', label: 'Family' },
  friends: { icon: Users, color: '#10B981', label: 'Friends' },
  acquaintances: { icon: User, color: '#F59E0B', label: 'Acquaintances' },
};

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: person, isLoading, error } = usePerson(id || null);
  const { data: interactions, isLoading: interactionsLoading } = usePersonInteractions(id || null);

  const updatePerson = useUpdatePerson();
  const archivePerson = useArchivePerson();
  const deletePerson = useDeletePerson();
  const updateLastContact = useUpdateLastContact();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedRole, setEditedRole] = useState('');
  const [editedNotes, setEditedNotes] = useState('');

  const handleClose = () => {
    triggerHaptic.light();
    router.back();
  };

  const handleStartEdit = () => {
    if (!person) return;
    triggerHaptic.light();
    setEditedName(person.name);
    setEditedRole(person.role || '');
    setEditedNotes(person.notes || '');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!person || !editedName.trim()) return;
    triggerHaptic.medium();

    try {
      await updatePerson.mutateAsync({
        id: person.id,
        updates: {
          name: editedName.trim(),
          role: editedRole.trim() || null,
          notes: editedNotes.trim() || null,
        },
      });
      triggerHaptic.success();
      setIsEditing(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to update person');
    }
  };

  const handleCancelEdit = () => {
    triggerHaptic.light();
    setIsEditing(false);
  };

  const handleLogInteraction = () => {
    if (!person) return;
    triggerHaptic.medium();
    updateLastContact.mutate({ id: person.id });
    Alert.alert('Success', 'Contact logged!');
  };

  const handleStartChat = () => {
    if (!person) return;
    triggerHaptic.medium();
    router.push({
      pathname: '/chat',
      params: { personId: person.id },
    });
  };

  const handleArchive = () => {
    if (!person) return;
    triggerHaptic.warning();

    Alert.alert(
      'Archive Person',
      `Are you sure you want to archive ${person.name}? They will be hidden from your circle.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: async () => {
            try {
              await archivePerson.mutateAsync(person.id);
              triggerHaptic.success();
              router.back();
            } catch (err) {
              Alert.alert('Error', 'Failed to archive person');
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    if (!person) return;
    triggerHaptic.warning();

    Alert.alert(
      'Delete Person',
      `Are you sure you want to permanently delete ${person.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePerson.mutateAsync(person.id);
              triggerHaptic.success();
              router.back();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete person');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#0f0a1a', '#1a0a2e', '#0f0a1a']} className="flex-1">
        <SafeAreaView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8B5CF6" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error || !person) {
    return (
      <LinearGradient colors={['#0f0a1a', '#1a0a2e', '#0f0a1a']} className="flex-1">
        <SafeAreaView className="flex-1 items-center justify-center px-4">
          <Text className="text-white text-lg mb-4">Person not found</Text>
          <Pressable onPress={handleClose} className="px-6 py-3 bg-primary-500 rounded-xl">
            <Text className="text-white font-medium">Go Back</Text>
          </Pressable>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const config = groupConfig[person.group];
  const Icon = config.icon;
  const health = person.relationship_health || 50;
  const lastContact = person.last_contact
    ? new Date(person.last_contact).toLocaleDateString()
    : 'Never';

  return (
    <LinearGradient colors={['#0f0a1a', '#1a0a2e', '#0f0a1a']} className="flex-1">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-white/10">
          <Pressable onPress={handleClose} className="p-2">
            <X size={24} color="white" />
          </Pressable>
          <Text className="text-lg font-semibold text-white">Person Details</Text>
          <Pressable onPress={isEditing ? handleSaveEdit : handleStartEdit} className="p-2">
            {isEditing ? (
              updatePerson.isPending ? (
                <ActivityIndicator size="small" color="#8B5CF6" />
              ) : (
                <Save size={24} color="#10B981" />
              )
            ) : (
              <Edit3 size={24} color="#8B5CF6" />
            )}
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <Animated.View entering={FadeInDown.delay(100)} className="items-center py-8">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: `${config.color}30` }}
            >
              <Icon size={48} color={config.color} />
            </View>

            {isEditing ? (
              <TextInput
                value={editedName}
                onChangeText={setEditedName}
                className="text-2xl font-bold text-white text-center bg-white/10 px-4 py-2 rounded-xl mb-2"
                placeholder="Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            ) : (
              <Text className="text-2xl font-bold text-white">{person.name}</Text>
            )}

            {isEditing ? (
              <TextInput
                value={editedRole}
                onChangeText={setEditedRole}
                className="text-white/60 text-center bg-white/10 px-4 py-2 rounded-xl"
                placeholder="Role/Relationship"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            ) : (
              <Text className="text-white/60">
                {person.role || person.subgroup || config.label}
              </Text>
            )}

            {/* Relationship Health */}
            <View className="mt-4 items-center">
              <View className="w-32 h-3 rounded-full overflow-hidden bg-white/10">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${health}%`,
                    backgroundColor: health > 70 ? '#10B981' : health > 40 ? '#F59E0B' : '#EF4444',
                  }}
                />
              </View>
              <Text className="text-white/60 text-sm mt-1">{health}% Relationship Health</Text>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          {!isEditing && (
            <Animated.View entering={FadeInDown.delay(200)} className="flex-row px-4 gap-3 mb-6">
              <Pressable
                onPress={handleStartChat}
                className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-primary-500 rounded-xl"
              >
                <MessageCircle size={20} color="white" />
                <Text className="text-white font-medium">Get Advice</Text>
              </Pressable>
              <Pressable
                onPress={handleLogInteraction}
                disabled={updateLastContact.isPending}
                className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-white/10 rounded-xl"
              >
                {updateLastContact.isPending ? (
                  <ActivityIndicator size="small" color="#10B981" />
                ) : (
                  <>
                    <CheckCircle size={20} color="#10B981" />
                    <Text className="text-white font-medium">Log Contact</Text>
                  </>
                )}
              </Pressable>
            </Animated.View>
          )}

          {/* Info Cards */}
          <Animated.View entering={FadeInDown.delay(300)} className="px-4 mb-6">
            <View className="bg-white/5 rounded-2xl p-4">
              {/* Last Contact */}
              <View className="flex-row items-center mb-4">
                <Clock size={20} color="#8B5CF6" />
                <Text className="text-white/60 ml-3">Last Contact</Text>
                <Text className="text-white ml-auto">{lastContact}</Text>
              </View>

              {/* Contact Info */}
              {person.email && (
                <View className="flex-row items-center mb-4">
                  <Mail size={20} color="#8B5CF6" />
                  <Text className="text-white/60 ml-3">Email</Text>
                  <Text className="text-white ml-auto">{person.email}</Text>
                </View>
              )}
              {person.phone && (
                <View className="flex-row items-center mb-4">
                  <Phone size={20} color="#8B5CF6" />
                  <Text className="text-white/60 ml-3">Phone</Text>
                  <Text className="text-white ml-auto">{person.phone}</Text>
                </View>
              )}

              {/* Group */}
              <View className="flex-row items-center">
                <Calendar size={20} color="#8B5CF6" />
                <Text className="text-white/60 ml-3">Group</Text>
                <View className="flex-row items-center ml-auto">
                  <Icon size={16} color={config.color} />
                  <Text className="text-white ml-2">{config.label}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Notes */}
          <Animated.View entering={FadeInDown.delay(400)} className="px-4 mb-6">
            <Text className="text-white/50 text-sm mb-2 uppercase tracking-wider">Notes</Text>
            <View className="bg-white/5 rounded-2xl p-4">
              {isEditing ? (
                <TextInput
                  value={editedNotes}
                  onChangeText={setEditedNotes}
                  multiline
                  numberOfLines={4}
                  className="text-white min-h-24"
                  placeholder="Add notes about this person..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
              ) : (
                <Text className="text-white/80">
                  {person.notes || 'No notes yet. Tap edit to add some.'}
                </Text>
              )}
            </View>
          </Animated.View>

          {/* Recent Interactions */}
          {!isEditing && (
            <Animated.View entering={FadeInDown.delay(500)} className="px-4 mb-6">
              <Text className="text-white/50 text-sm mb-2 uppercase tracking-wider">
                Recent Interactions
              </Text>
              <View className="bg-white/5 rounded-2xl p-4">
                {interactionsLoading ? (
                  <ActivityIndicator size="small" color="#8B5CF6" />
                ) : interactions && interactions.length > 0 ? (
                  interactions.slice(0, 5).map((interaction, index) => (
                    <View key={interaction.id} className={`flex-row items-center ${index > 0 ? 'mt-3 pt-3 border-t border-white/10' : ''}`}>
                      <View className={`w-2 h-2 rounded-full mr-3 ${
                        interaction.outcome === 'successful' ? 'bg-green-500' :
                        interaction.outcome === 'partial' ? 'bg-amber-500' :
                        interaction.outcome === 'unsuccessful' ? 'bg-red-500' : 'bg-white/30'
                      }`} />
                      <View className="flex-1">
                        <Text className="text-white text-sm">
                          {interaction.context || 'Logged interaction'}
                        </Text>
                        <Text className="text-white/50 text-xs">
                          {new Date(interaction.interaction_date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text className="text-white/50">No interactions logged yet.</Text>
                )}
              </View>
            </Animated.View>
          )}

          {/* Edit Actions */}
          {isEditing && (
            <Animated.View entering={FadeInDown} className="px-4 mb-6">
              <Pressable
                onPress={handleCancelEdit}
                className="py-3 bg-white/10 rounded-xl"
              >
                <Text className="text-white font-medium text-center">Cancel</Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Danger Zone */}
          {!isEditing && (
            <Animated.View entering={FadeInDown.delay(600)} className="px-4 mb-8">
              <Text className="text-white/50 text-sm mb-2 uppercase tracking-wider">
                Danger Zone
              </Text>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleArchive}
                  disabled={archivePerson.isPending}
                  className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl"
                >
                  {archivePerson.isPending ? (
                    <ActivityIndicator size="small" color="#F59E0B" />
                  ) : (
                    <>
                      <Archive size={20} color="#F59E0B" />
                      <Text className="text-amber-400 font-medium">Archive</Text>
                    </>
                  )}
                </Pressable>
                <Pressable
                  onPress={handleDelete}
                  disabled={deletePerson.isPending}
                  className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/30 rounded-xl"
                >
                  {deletePerson.isPending ? (
                    <ActivityIndicator size="small" color="#EF4444" />
                  ) : (
                    <>
                      <Trash2 size={20} color="#EF4444" />
                      <Text className="text-red-400 font-medium">Delete</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
