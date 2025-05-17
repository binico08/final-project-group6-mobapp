import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useEquipment } from '../../context/EquipmentContext';
import { useTheme } from '../../styles/ThemeContext';
import createStyles from '../../styles/AllStyles';

const EditEquipment = () => {
  const route = useRoute<RouteProp<any>>();
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const { updateEquipment } = useEquipment();

  const item = route.params?.equipment;

  // Parse the existing date or default to now
  const initialDate = item?.addedDate ? new Date(item.addedDate) : new Date();

  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [price, setPrice] = useState(String(item?.price || ''));
  const [available, setAvailable] = useState(item?.available ?? true);
  const [date, setDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text }}>
          Edit Equipment
        </Text>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddEquipment')}
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: theme.primary, fontSize: 16 }}>Add</Text>
        </TouchableOpacity>
      ),
      headerTitleAlign: 'left',
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
    });
  }, [navigation, theme]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // keep picker open on iOS
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formattedDate = date.toISOString().slice(0, 10);

  const handleUpdate = () => {
    if (!name.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Error', 'Please enter a valid positive price');
      return;
    }

    const updated = {
      ...item,
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      available,
      addedDate: date.toISOString(),
    };

    updateEquipment(updated);

    Alert.alert('Success', 'Equipment updated successfully', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('AdminDashboard'),
      },
    ]);
  };

  return (
    <View style={[styles.container, local.container, { backgroundColor: theme.background }]}>
      {/* Title moved to header */}
      <TextInput
        style={[
          styles.input,
          local.input,
          {
            borderColor: isDark ? '#555' : '#ccc',
            color: theme.text,
            backgroundColor: isDark ? '#222' : '#fff',
          },
        ]}
        placeholder="Name"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[
          styles.input,
          local.input,
          {
            borderColor: isDark ? '#555' : '#ccc',
            color: theme.text,
            backgroundColor: isDark ? '#222' : '#fff',
            height: 100,
          },
        ]}
        placeholder="Description"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={[
          styles.input,
          local.input,
          {
            borderColor: isDark ? '#555' : '#ccc',
            color: theme.text,
            backgroundColor: isDark ? '#222' : '#fff',
          },
        ]}
        placeholder="Price"
        keyboardType="numeric"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        value={price}
        onChangeText={setPrice}
      />

      <View style={local.switchRow}>
        <Text style={[styles.label, { color: theme.text }]}>Available:</Text>
        <Switch
          value={available}
          onValueChange={setAvailable}
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor={available ? theme.primary : '#f4f3f4'}
        />
        <Text style={[styles.label, { color: theme.text, marginLeft: 10 }]}>
          {available ? 'Yes' : 'No'}
        </Text>
      </View>

      {/* Date picker section */}
      <View style={local.dateRow}>
        <Text style={[styles.label, { color: theme.text }]}>Added Date:</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            local.dateButton,
            {
              borderColor: theme.primary,
              backgroundColor: isDark ? '#333' : '#fff',
            },
          ]}
        >
          <Text style={{ color: theme.text }}>{formattedDate}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      <TouchableOpacity
        style={[local.saveBtn, { backgroundColor: theme.primary }]}
        onPress={handleUpdate}
      >
        <Text style={local.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const local = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    flex: 1,
  },
  input: {
    marginBottom: 16,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'flex-start',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dateButton: {
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  saveBtn: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditEquipment;
