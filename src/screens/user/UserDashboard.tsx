import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../styles/ThemeContext';
import createStyles from '../../styles/AllStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEquipment } from '../../context/EquipmentContext';

const UserDashboard = ({ navigation }) => {
  const { user, setUser } = useUser();
  const { theme, toggleTheme, isDark } = useTheme();
  const styles = createStyles(theme);
  const { equipmentList } = useEquipment();

  const [search, setSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [borrowedIds, setBorrowedIds] = useState([]);

  useEffect(() => {
    console.log('Logged in user:', user);
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const confirmBorrow = (equipment) => {
    Alert.alert(
      'Confirm Borrow',
      `Do you want to borrow "${equipment.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Borrow',
          onPress: () => handleBorrow(equipment),
        },
      ]
    );
  };

  const handleBorrow = (equipment) => {
    console.log('Borrow clicked for:', equipment.name);
    navigation.navigate('BorrowForm', {
      equipment,
      onBorrowSuccess: () => {
        setBorrowedIds((prev) => [...prev, equipment.id]);
      },
    });
  };

  const handleCancelBorrow = (id) => {
    setBorrowedIds((prev) => prev.filter((bid) => bid !== id));
  };

  let filtered = equipmentList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy === 'price') {
    filtered = filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'availability') {
    filtered = filtered.sort((a, b) =>
      b.available === a.available ? 0 : b.available ? 1 : -1
    );
  } else if (sortBy === 'alphabetical') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'dateAdded') {
    filtered = filtered.sort(
      (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );
  }

  return (
    <View
      style={[
        styles.container,
        local.container,
        { backgroundColor: isDark ? '#121212' : '#f5f5f5' },
      ]}
    >
      {/* Top Bar */}
      <View style={local.topBar}>
        <Text style={[styles.title, { marginBottom: 0, color: theme.text }]}>
          Dashboard
        </Text>
        <View style={local.iconsRight}>
          <TouchableOpacity onPress={toggleTheme} style={local.iconBtn}>
            <MaterialCommunityIcons
              name={isDark ? 'weather-sunny' : 'weather-night'}
              size={26}
              color={theme.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={local.iconBtn}>
            <MaterialCommunityIcons name="menu" size={28} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.title, local.welcomeText, { color: theme.text }]}>
        Welcome, {user?.name}!
      </Text>

      <TextInput
        style={[
          styles.search,
          {
            width: '90%',
            marginBottom: 20,
            backgroundColor: isDark ? '#222' : '#fff',
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#555' : '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
          },
        ]}
        placeholder="Search equipment..."
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        value={search}
        onChangeText={setSearch}
      />

      {filtered.length === 0 && search.trim() !== '' ? (
        <Text style={[local.noEquipmentText, { color: theme.text }]}>
          No equipment found matching "{search}"
        </Text>
      ) : filtered.length === 0 ? (
        <Text style={[local.noEquipmentText, { color: theme.text }]}>
          There are currently no items available.
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const isBorrowed = borrowedIds.includes(item.id);
            return (
              <View
                style={[
                  styles.card,
                  { backgroundColor: isDark ? '#333' : '#fff' },
                ]}
              >
                {item.photoUri && (
                  <Image
                    source={{ uri: item.photoUri }}
                    style={local.equipmentImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.info, { color: theme.text }]}>
                  {item.description}
                </Text>
                <Text style={[styles.info, { color: theme.text }]}>₱{item.price}</Text>
                <Text style={[styles.info, { color: theme.text }]}>
                  Available: {item.available ? 'Yes' : 'No'}
                </Text>

                {isBorrowed ? (
                  <View style={local.borrowedContainer}>
                    <View
                      style={[local.borrowButton, { backgroundColor: '#4caf50' }]}
                    >
                      <Text style={[local.borrowButtonText, { color: '#fff' }]}>
                        Borrowed
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCancelBorrow(item.id)}
                      style={local.cancelButton}
                    >
                      <Text style={local.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => confirmBorrow(item)}
                    disabled={!item.available}
                    style={[
                      local.borrowButton,
                      {
                        backgroundColor: item.available ? theme.primary : '#999',
                      },
                    ]}
                  >
                    <Text style={[local.borrowButtonText, { color: '#fff' }]}>
                      {item.available ? 'Borrow' : 'Unavailable'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      )}

      {/* Modal menu */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={local.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={[local.modalContent, { backgroundColor: theme.surface }]}>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('NotificationsScreen');
              }}
              style={local.menuItem}
            >
              <MaterialCommunityIcons
                name="bell"
                size={20}
                color={theme.primary}
              />
              <Text style={[local.menuText, { color: theme.text }]}>
                Notifications
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}
              style={local.menuItem}
            >
              <MaterialCommunityIcons
                name="logout"
                size={20}
                color={theme.primary}
              />
              <Text style={[local.menuText, { color: theme.text }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const local = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 40,
  },
  iconsRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
  welcomeText: {
    fontSize: 20,
    marginVertical: 15,
    fontWeight: '600',
  },
  search: {
    marginBottom: 20,
  },
  noEquipmentText: {
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
  equipmentImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  borrowedContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  borrowButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  borrowButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f44336',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#f44336',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  modalContent: {
    borderRadius: 12,
    paddingVertical: 10,
    width: 180,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    gap: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserDashboard;
