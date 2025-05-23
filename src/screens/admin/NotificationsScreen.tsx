import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useEquipment } from '../../context/EquipmentContext';
import { useTheme } from '../../styles/ThemeContext';
import createStyles from '../../styles/AllStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NotificationsScreen = ({ navigation }) => {
  const { borrowedEquipment } = useEquipment();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Sort notifications by borrow date descending (newest first)
  const sortedNotifications = [...borrowedEquipment].sort(
    (a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
  );

  const renderItem = ({ item }) => (
    <View style={[local.notificationCard, { backgroundColor: theme.surface }]}>
      <View style={local.headerRow}>
        <MaterialCommunityIcons
          name="bell"
          size={24}
          color={theme.primary}
          style={{ marginRight: 8 }}
        />
        <Text style={[local.title, { color: theme.primary }]}>Borrowed Equipment</Text>
      </View>

      <Text style={[local.text, { color: theme.text }]}>
        User <Text style={{ fontWeight: 'bold' }}>{item.borrowerName}</Text> borrowed{' '}
        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>.
      </Text>
      <Text style={[local.text, { color: theme.text }]}>
        Quantity: <Text style={{ fontWeight: 'bold' }}>{item.quantity}</Text>
      </Text>
      <Text style={[local.text, { color: theme.text }]}>
        Borrow Date:{' '}
        <Text style={{ fontWeight: 'bold' }}>
          {new Date(item.borrowDate).toLocaleDateString()}
        </Text>
      </Text>
      {item.returnDate && (
        <Text style={[local.text, { color: theme.text }]}>
          Return Date:{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {new Date(item.returnDate).toLocaleDateString()}
          </Text>
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={local.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={local.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { marginLeft: 10 }]}>Notifications</Text>
      </View>

      {sortedNotifications.length === 0 ? (
        <View style={local.noNotifContainer}>
          <MaterialCommunityIcons name="bell-off" size={80} color={theme.disabled} />
          <Text style={[local.noNotifText, { color: theme.disabled }]}>No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={sortedNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
};

const local = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  backBtn: {
    padding: 6,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  noNotifContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotifText: {
    fontSize: 22,
    marginTop: 10,
  },
});

export default NotificationsScreen;
