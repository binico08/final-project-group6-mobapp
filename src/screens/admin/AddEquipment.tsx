import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Switch,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import createStyles from '../../styles/AllStyles';
import { useEquipment } from '../../context/EquipmentContext';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddEquipment = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const { addEquipment } = useEquipment();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);

  const [dateAdded, setDateAdded] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleUploadPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access media library is needed.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleAdd = () => {
    if (!name.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Validation Error', 'Please fill all the fields.');
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return;
    }

    const id = uuid.v4() as string;

    addEquipment({
      id,
      name,
      description,
      price: priceNumber,
      available,
      photoUri,
      dateAdded: dateAdded.toISOString(),
    });

    Alert.alert('Success', 'Equipment added successfully!');
    navigation.goBack();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    setDateAdded(date);
    hideDatePicker();
  };

  const formattedDate = dateAdded.toLocaleDateString();

  return (
    <SafeAreaView style={[styles.container, local.safeArea]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.container, local.container]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={local.formContainer}>
            <TouchableOpacity
              style={[local.photoContainer, { borderColor: theme.primary }]}
              onPress={handleUploadPhoto}
              activeOpacity={0.7}
            >
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  style={{ width: '100%', height: '100%', borderRadius: 10 }}
                />
              ) : (
                <Text style={{ color: theme.primary, fontSize: 16 }}>
                  Tap to upload photo
                </Text>
              )}
            </TouchableOpacity>

            <TextInput
              placeholder="Name"
              placeholderTextColor={isDark ? '#aaa' : '#666'}
              style={[
                styles.input,
                local.input,
                {
                  backgroundColor: isDark ? '#333' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#555' : '#ccc',
                },
              ]}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              placeholder="Description"
              placeholderTextColor={isDark ? '#aaa' : '#666'}
              style={[
                styles.input,
                local.input,
                {
                  backgroundColor: isDark ? '#333' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#555' : '#ccc',
                  height: 120,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TextInput
              placeholder="Price"
              placeholderTextColor={isDark ? '#aaa' : '#666'}
              style={[
                styles.input,
                local.input,
                {
                  backgroundColor: isDark ? '#333' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#555' : '#ccc',
                },
              ]}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <View style={local.switchRow}>
              <Text style={[styles.label, { color: theme.text }]}>Available:</Text>
              <Switch
                value={available}
                onValueChange={setAvailable}
                thumbColor={available ? theme.primary : '#ccc'}
                trackColor={{ false: '#767577', true: theme.primary }}
                style={{ marginLeft: 10 }}
              />
              <Text style={[styles.label, { color: theme.text, marginLeft: 10 }]}>
                {available ? 'Yes' : 'No'}
              </Text>
            </View>

            <View style={local.datePickerRow}>
              <Text style={[styles.label, { color: theme.text }]}>Date Added:</Text>
              <TouchableOpacity
                onPress={showDatePicker}
                style={[local.dateDisplay, { borderColor: theme.primary }]}
              >
                <Text style={{ color: theme.primary, fontSize: 16 }}>{formattedDate}</Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                maximumDate={new Date()}
              />
            </View>
          </View>
        </ScrollView>

        {/* Add Button fixed at bottom center */}
        <View style={[local.addButtonContainer, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            onPress={handleAdd}
            style={[local.addButton, { backgroundColor: theme.primary }]}
            activeOpacity={0.8}
          >
            <Text style={local.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const local = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    paddingBottom: 100, // to avoid last input hidden behind button
  },
  photoContainer: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderRadius: 10,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 18,
    marginBottom: 16,
    height: 70,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'flex-start',
    width: '100%',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  dateDisplay: {
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  addButton: {
    width: 150,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEquipment;
