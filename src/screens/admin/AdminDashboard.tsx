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

type SortOption = 'price' | 'availability' | 'alphabetical' | 'dateAdded';

const AdminDashboard = ({ navigation }) => {
  const { user, setUser } = useUser();
  const { theme, toggleTheme, isDark } = useTheme();
  const styles = createStyles(theme);
  const { equipmentList, deleteEquipment, borrowedEquipment } = useEquipment();

  const [search, setSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption | null>(null);

  useEffect(() => {
    console.log('Logged in user:', user);
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Equipment', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteEquipment(id),
      },
    ]);
  };

  // Filter and Sort
  let filtered = equipmentList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy === 'price') {
    filtered = filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'availability') {
    filtered = filtered.sort((a, b) => (b.available === a.available ? 0 : b.available ? 1 : -1));
  } else if (sortBy === 'alphabetical') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'dateAdded') {
    filtered = filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  }

  const sortLabels = {
    price: 'Price (Low to High)',
    availability: 'Availability',
    alphabetical: 'A-Z',
    dateAdded: 'Date Added (Newest First)',
  };

  return (
    <View style={[styles.container, local.container, { backgroundColor: theme.background }]}>
      <View style={local.topBar}>
        <Text style={[styles.title, { marginBottom: 0 }]}>Dashboard</Text>
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

      <Text style={[styles.title, local.welcomeText]}>
        Welcome, {user && user.name ? user.name : 'Admin'}!
      </Text>

      <TextInput
        style={[
          styles.search,
          {
            width: '90%',
            marginBottom: 10,
            backgroundColor: isDark ? '#222' : '#fff',
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#555' : '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 40,
            shadowColor: 'transparent',
            elevation: 0,
          },
        ]}
        placeholder="Search equipment..."
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        value={search}
        onChangeText={setSearch}
      />

      {/* Sort Button */}
      <TouchableOpacity
        style={[
          local.sortBtn,
          {
            borderColor: theme.primary,
            shadowColor: 'transparent',
            elevation: 0,
          },
        ]}
        onPress={() => setSortVisible(true)}
      >
        <Text style={{ color: theme.primary, fontWeight: '600' }}>
          Sort By: {sortBy ? sortLabels[sortBy] : 'None'}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={theme.primary}
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {/* Equipment List or No Match Message */}
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
          style={{ width: '100%', marginTop: 20 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: isDark ? '#333' : '#fff', elevation: 0, shadowColor: 'transparent' },
              ]}
            >
              {item.photoUri && (
                <Image
                  source={{ uri: item.photoUri }}
                  style={local.equipmentImage}
                  resizeMode="cover"
                />
              )}

              <Text style={[styles.cardTitle, { color: theme.text, fontSize: 20 }]}>{item.name}</Text>

              <Text style={[styles.info, { fontSize: 16 }]}>{item.description}</Text>
              <Text style={[styles.info, { fontSize: 16 }]}>₱{item.price}</Text>
              <Text style={[styles.info, { fontSize: 16 }]}>Available: {item.available ? 'Yes' : 'No'}</Text>
              <Text style={[styles.info, { fontSize: 16 }]}>
                Date Added: {new Date(item.dateAdded).toLocaleDateString()}
              </Text>

              <View style={local.cardActions}>
                <TouchableOpacity
                  style={local.iconBtn}
                  onPress={() => navigation.navigate('EditEquipment', { equipment: item })}
                >
                  <MaterialCommunityIcons name="pencil" size={22} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={local.iconBtn} onPress={() => handleDelete(item.id)}>
                  <MaterialCommunityIcons name="delete" size={22} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[
          local.fab,
          { backgroundColor: theme.primary, shadowColor: 'transparent', elevation: 0 },
        ]}
        onPress={() => navigation.navigate('AddEquipment')}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Sort Modal */}
      <Modal
        visible={sortVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSortVisible(false)}
      >
        <TouchableOpacity
          style={local.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setSortVisible(false)}
        >
          <View style={[local.modalContent, { backgroundColor: theme.surface }]}>
            {(['price', 'availability', 'alphabetical', 'dateAdded'] as SortOption[]).map(
              (option) => (
                <TouchableOpacity
                  key={option}
                  style={local.menuItem}
                  onPress={() => {
                    setSortBy(option);
                    setSortVisible(false);
                  }}
                >
                  <Text style={[local.menuText, { color: theme.text }]}>
                    {sortLabels[option]}
                  </Text>
                  {sortBy === option && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={theme.primary}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </TouchableOpacity>
              )
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Main Menu Modal */}
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
            {/* Notifications menu item */}
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('NotificationsScreen');
              }}
              style={local.menuItem}
            >
              <MaterialCommunityIcons name="bell" size={20} color={theme.primary} />
              <Text style={[local.menuText, { color: theme.text }]}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}
              style={local.menuItem}
            >
              <MaterialCommunityIcons name="logout" size={20} color="red" />
              <Text style={[local.menuText, { color: 'red' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default AdminDashboard;

const local = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  iconsRight: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: 15,
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 12,
  },
  equipmentImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 6,
    alignSelf: 'center',
    marginBottom: 8,
  },
  noEquipmentText: {
    fontSize: 16,
    marginTop: 30,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 260,
    borderRadius: 10,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
  },
});
