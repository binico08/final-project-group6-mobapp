import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../styles/ThemeContext';
import createStyles from '../../styles/AllStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const { setUser } = useUser();
  const { theme, toggleTheme, isDark } = useTheme();
  const styles = createStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (role: 'admin' | 'user') => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const name = email.split('@')[0] || 'User';
    setUser({ name, role });

    navigation.reset({
      index: 0,
      routes: [{ name: role === 'admin' ? 'AdminDashboard' : 'UserDashboard' }],
    });
  };

  return (
    <View style={[styles.container, centerStyles.container]}>
      <Text style={styles.title}>Login</Text>

      <TouchableOpacity onPress={toggleTheme} style={centerStyles.themeToggle}>
        <MaterialCommunityIcons
          name={isDark ? 'weather-sunny' : 'weather-night'}
          size={28}
          color={theme.primary}
        />
      </TouchableOpacity>

      <TextInput
        style={[
          styles.input,
          centerStyles.input,
          {
            backgroundColor: isDark ? '#222' : '#fff',  // dark mode: dark gray, light mode: white
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#555' : '#ccc',
          },
        ]}
        placeholder="Email"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[
          styles.input,
          centerStyles.input,
          {
            backgroundColor: isDark ? '#222' : '#fff',
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#555' : '#ccc',
          },
        ]}
        placeholder="Password"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={centerStyles.buttonContainer}>
        <Button
          title="Login as User"
          onPress={() => handleLogin('user')}
          color={theme.primary}
        />
      </View>

      <View style={centerStyles.buttonContainer}>
        <Button
          title="Login as Admin"
          onPress={() => handleLogin('admin')}
          color={theme.primary}
        />
      </View>
    </View>
  );
};

const centerStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    width: 300,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  buttonContainer: {
    width: 300,
    marginVertical: 8,
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 30,
  },
});

export default LoginScreen;
