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
  const { equipmentList, deleteEquipment } = useEquipment();

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

  // Filter based on search
  let filtered = equipmentList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort based on sortBy
  if (sortBy === 'price') {
    filtered = filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'availability') {
    filtered = filtered.sort((a, b) => (b.available === a.available ? 0 : b.available ? 1 : -1));
  } else if (sortBy === 'alphabetical') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'dateAdded') {
    // Sort newest first - assuming dateAdded is a Date or ISO string
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      return dateB - dateA;
    });
  }

  const sortLabels = {
    price: 'Price (Low to High)',
    availability: 'Availability',
    alphabetical: 'Alphabetical',
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
          },
        ]}
        placeholder="Search equipment..."
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        value={search}
        onChangeText={setSearch}
      />

      {/* Sort button */}
      <TouchableOpacity
        style={[local.sortBtn, { borderColor: theme.primary }]}
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

      {filtered.length === 0 ? (
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: theme.text }}>
            There are currently no items available.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          style={{ width: '100%', marginTop: 20 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: isDark ? '#333' : '#fff' }]}>
              {item.photoUri ? (
                <Image
                  source={{ uri: item.photoUri }}
                  style={local.equipmentImage}
                  resizeMode="cover"
                />
              ) : null}

              <Text style={[styles.cardTitle, { color: theme.text }]}>{item.name}</Text>

              <Text style={styles.info}>{item.description}</Text>
              <Text style={styles.info}>₱{item.price}</Text>
              <Text style={styles.info}>Available: {item.available ? 'Yes' : 'No'}</Text>
              <Text style={styles.info}>
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

      <TouchableOpacity
        style={[local.fab, { backgroundColor: theme.primary }]}
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
            {(['price', 'availability', 'alphabetical', 'dateAdded'] as SortOption[]).map((option) => (
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
            ))}
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
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}
              style={local.menuItem}
            >
              <MaterialCommunityIcons name="logout" size={20} color={theme.primary} />
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    width: 220,
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  equipmentImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
});

export default AdminDashboard;
