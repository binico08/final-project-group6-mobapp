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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    let valid = true;
    setUsernameError('');
    setPasswordError('');
    setGeneralError('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      setUsernameError('Username is required');
      console.log('Username error set:', 'Username is required');
      valid = false;
    } else if (trimmedUsername.length < 6) {
      setUsernameError('Username must be min 6 characters');
      console.log('Username error set:', 'Username must be min 6 characters');
      valid = false;
    }

    if (!trimmedPassword) {
      setPasswordError('Password is required');
      console.log('Password error set:', 'Password is required');
      valid = false;
    } else {
      const hasUpperCase = /[A-Z]/.test(trimmedPassword);
      const hasNumber = /\d/.test(trimmedPassword);

      if (!hasUpperCase || !hasNumber) {
        setPasswordError('Password must include an uppercase letter and a number');
        console.log('Password error set:', 'Password must include uppercase & number');
        valid = false;
      }
    }

    return valid;
  };

  const handleLogin = (role) => {
    if (!validate()) return;

    const name = username.trim() || 'User';
    setUser({ name, role });

    navigation.reset({
      index: 0,
      routes: [{ name: role === 'admin' ? 'AdminDashboard' : 'UserDashboard' }],
    });
  };

  return (
    <View style={[styles.container, centerStyles.container]}>
      <Text style={[styles.title, centerStyles.title]}>Login</Text>

      <TouchableOpacity onPress={toggleTheme} style={centerStyles.themeToggle}>
        <MaterialCommunityIcons
          name={isDark ? 'weather-sunny' : 'weather-night'}
          size={28}
          color={theme.primary}
        />
      </TouchableOpacity>

      {/* Username Input and Error */}
      <View style={centerStyles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#222' : '#fff',
              color: isDark ? '#fff' : '#000',
              borderColor: usernameError ? 'red' : isDark ? '#555' : '#ccc',
            },
          ]}
          placeholder="Username"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          autoCapitalize="none"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            if (usernameError) setUsernameError('');
          }}
        />
        {/* Show error or space to keep layout */}
        <Text style={centerStyles.errorText}>
          {usernameError || ' '}
        </Text>
      </View>

      {/* Password Input and Error */}
      <View style={centerStyles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#222' : '#fff',
              color: isDark ? '#fff' : '#000',
              borderColor: passwordError ? 'red' : isDark ? '#555' : '#ccc',
            },
          ]}
          placeholder="Password"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError('');
          }}
        />
        <Text style={centerStyles.errorText}>
          {passwordError || ' '}
        </Text>
      </View>

      {generalError ? (
        <Text style={centerStyles.errorText}>{generalError}</Text>
      ) : null}

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
  inputWrapper: {
    width: 300,
    marginBottom: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
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
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    minHeight: 18, // reserve some space so layout is stable
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
});

export default LoginScreen;
