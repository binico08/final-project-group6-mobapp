import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../../styles/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/AllStyles';

type Equipment = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  description?: string;
};

const mockEquipment: Equipment[] = [
  {
    id: uuidv4(),
    name: 'Basketball',
    category: 'Ball Sports',
    quantity: 5,
    description: 'Standard outdoor basketball.'
  },
  {
    id: uuidv4(),
    name: 'Tennis Racket',
    category: 'Racket Sports',
    quantity: 2,
    description: 'Lightweight and durable tennis racket.'
  },
  {
    id: uuidv4(),
    name: 'Football',
    category: 'Ball Sports',
    quantity: 0,
    description: 'Full-size leather football.'
  }
];

const UserEquipmentScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filtered, setFiltered] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSaved = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('savedEquipment');
      if (saved) {
        const savedList = JSON.parse(saved);
        setSavedIds(savedList.map((e: Equipment) => e.id));
      }
    } catch (err) {
      console.error('Error loading saved equipment:', err);
    }
  }, []);

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate fetching
      const withIds = mockEquipment.map(e => ({ ...e, id: e.id || uuidv4() }));
      setEquipment(withIds);
      setFiltered(withIds);
    } catch (err) {
      Alert.alert('Error', 'Failed to load equipment.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
    loadSaved();
  }, [fetchEquipment, loadSaved]);

  useEffect(() => {
    if (!searchQuery.trim()) return setFiltered(equipment);
    const filteredResults = equipment.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(filteredResults);
  }, [searchQuery, equipment]);

  const saveEquipment = async (item: Equipment) => {
    if (savedIds.includes(item.id)) return;

    try {
      const existing = await AsyncStorage.getItem('savedEquipment');
      const savedList = existing ? JSON.parse(existing) : [];
      savedList.push(item);
      await AsyncStorage.setItem('savedEquipment', JSON.stringify(savedList));
      setSavedIds(prev => [...prev, item.id]);
      Alert.alert('Saved!', `${item.name} saved successfully.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRent = (item: Equipment) => {
    Alert.alert('Rent Equipment', `You are renting ${item.name}`);
    // You could navigate to a form screen here
    // navigation.navigate('RentalForm', { item });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEquipment();
  }, [fetchEquipment]);

  const renderItem = ({ item }: { item: Equipment }) => {
    const isSaved = savedIds.includes(item.id);

    return (
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>{item.name}</Text>
        <Text style={{ color: theme.text }}>Category: {item.category}</Text>
        <Text style={{ color: theme.text }}>
          Available: {item.quantity > 0 ? item.quantity : 'Out of Stock'}
        </Text>
        <Text style={{ color: theme.text }} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isSaved ? '#888' : theme.primary
              }
            ]}
            onPress={() => saveEquipment(item)}
            disabled={isSaved}
          >
            <Text style={styles.buttonText}>{isSaved ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => handleRent(item)}
            disabled={item.quantity < 1}
          >
            <Text style={styles.buttonText}>Rent</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.primary }]}>Browse Equipment</Text>
        <TextInput
          placeholder="Search equipment..."
          placeholderTextColor="#aaa"
          style={[
            styles.search,
            {
              backgroundColor: theme.surfaceLight,
              color: theme.text,
              borderColor: theme.primary
            }
          ]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
            }
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserEquipmentScreen;
