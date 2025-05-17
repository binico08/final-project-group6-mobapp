import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
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

  const handleLogout = () => {
    setUser(null);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const filtered = equipmentList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, local.container]}>
      {/* Top Bar */}
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
        Welcome, {user?.name}!
      </Text>

      <TextInput
        style={[
          styles.search,
          {
            width: '90%',
            marginBottom: 20,
            backgroundColor: isDark ? '#222' : '#fff',  // dark mode dark bg, light mode white bg
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.info}>{item.description}</Text>
            <Text style={styles.info}>₱{item.price}</Text>
            <Text style={styles.info}>
              Available: {item.available ? 'Yes' : 'No'}
            </Text>
          </View>
        )}
      />

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
    width: 160,
    borderRadius: 10,
    padding: 16,
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
});

export default UserDashboard;
