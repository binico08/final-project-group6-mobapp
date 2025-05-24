import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../styles/ThemeContext';
import createStyles from '../../styles/AllStyles';
import { useNotification } from '../../context/NotificationsContext';

const BorrowForm = ({ navigation, route }) => {
  const { equipment, onBorrowSuccess } = route.params;
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { addNotification } = useNotification();

  const [borrowerName, setBorrowerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [borrowDate, setBorrowDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showBorrowPicker, setShowBorrowPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const formatDate = (date) => {
    // Format date as 'YYYY-MM-DD HH:mm'
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const onBorrowDateChange = (event, selectedDate) => {
    setShowBorrowPicker(false);
    if (selectedDate) {
      setBorrowDate(selectedDate);
      // If returnDate is before borrowDate, reset returnDate to borrowDate
      if (returnDate < selectedDate) {
        setReturnDate(selectedDate);
      }
    }
  };

  const onReturnDateChange = (event, selectedDate) => {
    setShowReturnPicker(false);
    if (selectedDate) {
      // Only set returnDate if it is after or equal to borrowDate
      if (selectedDate >= borrowDate) {
        setReturnDate(selectedDate);
      } else {
        alert('Return date cannot be before borrow date.');
      }
    }
  };

  const handleSubmit = () => {
    if (!borrowerName || !contactNumber || !borrowDate || !returnDate) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }

    const borrowDetails = `Equipment: ${equipment.name}\nBorrower: ${borrowerName}\nContact: ${contactNumber}\nBorrow Date: ${formatDate(borrowDate)}\nReturn Date: ${formatDate(returnDate)}`;

    addNotification({
      to: 'admin',
      message: `New equipment borrowed.\n${borrowDetails}`,
    });

    addNotification({
      to: 'user',
      message: `You successfully borrowed "${equipment.name}".\nBorrow Date: ${formatDate(borrowDate)}\nReturn Date: ${formatDate(returnDate)}`,
    });

    Alert.alert('Success', `You borrowed "${equipment.name}"!`);
    onBorrowSuccess && onBorrowSuccess();
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, local.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={[styles.title, { marginBottom: 20 }]}>
          Borrow "{equipment.name}"
        </Text>

        <TextInput
          placeholder="Your Name"
          style={[local.input, { backgroundColor: theme.card, borderColor: theme.primary, color: theme.text }]}
          placeholderTextColor={theme.text + '99'}
          value={borrowerName}
          onChangeText={setBorrowerName}
        />

        <TextInput
          placeholder="Contact Number"
          keyboardType="phone-pad"
          style={[local.input, { backgroundColor: theme.card, borderColor: theme.primary, color: theme.text }]}
          placeholderTextColor={theme.text + '99'}
          value={contactNumber}
          onChangeText={setContactNumber}
        />

        <TouchableOpacity onPress={() => setShowBorrowPicker(true)} style={[local.input, { backgroundColor: theme.card, borderColor: theme.primary }]}>
          <Text style={{ color: theme.text }}>
            Borrow Date: {formatDate(borrowDate)}
          </Text>
        </TouchableOpacity>
        {showBorrowPicker && (
          <DateTimePicker
            value={borrowDate}
            mode="datetime"
            display="default"
            onChange={onBorrowDateChange}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity onPress={() => setShowReturnPicker(true)} style={[local.input, { backgroundColor: theme.card, borderColor: theme.primary }]}>
          <Text style={{ color: theme.text }}>
            Return Date: {formatDate(returnDate)}
          </Text>
        </TouchableOpacity>
        {showReturnPicker && (
          <DateTimePicker
            value={returnDate}
            mode="datetime"
            display="default"
            onChange={onReturnDateChange}
            minimumDate={borrowDate}
          />
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          style={[local.submitBtn, { backgroundColor: theme.primary }]}
        >
          <Text style={local.submitBtnText}>Confirm Borrow</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const local = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
  submitBtn: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default BorrowForm;
