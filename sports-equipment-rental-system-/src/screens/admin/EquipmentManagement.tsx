import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AllStyles from '../../styles/AllStyles';

type Equipment = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  image?: string;
};

const initialData: Equipment[] = [];

const EquipmentManagement = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(initialData);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const addEquipment = () => {
    if (!name || !category || !quantity) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    const qtyNum = parseInt(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert('Validation Error', 'Quantity must be a positive number');
      return;
    }

    const newEquipment: Equipment = {
      id: (Math.random() * 10000).toFixed(0),
      name,
      category,
      quantity: qtyNum,
      image: imageUri || undefined,
    };

    setEquipmentList([...equipmentList, newEquipment]);
    setName('');
    setCategory('');
    setQuantity('');
    setImageUri(null);
  };

  const deleteEquipment = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this equipment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setEquipmentList(equipmentList.filter((eq) => eq.id !== id));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Equipment }) => (
    <View style={styles.equipmentItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.equipmentName}>{item.name}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Quantity: {item.quantity}</Text>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.imageThumb} />
        )}
      </View>
      <Button title="Delete" color="#B22222" onPress={() => deleteEquipment(item.id)} />
    </View>
  );

  return (
    <View style={AllStyles.container}>
      <Text style={AllStyles.title}>Equipment Management</Text>

      <FlatList
        data={equipmentList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ marginBottom: 20, width: '100%' }}
      />

      <Text style={{ color: '#B22222', fontWeight: 'bold', marginBottom: 5 }}>Add New Equipment</Text>
      <TextInput style={AllStyles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={AllStyles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput style={AllStyles.input} placeholder="Quantity" keyboardType="numeric" value={quantity} onChangeText={setQuantity} />

      <TouchableOpacity onPress={pickImage} style={styles.imageBtn}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{imageUri ? 'Change Image' : 'Pick an Image'}</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <Button title="Add Equipment" onPress={addEquipment} color="#B22222" />
    </View>
  );
};

export default EquipmentManagement;