import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/auth/LoginScreen';
import UserDashboard from './src/screens/user/UserDashboard';
import AdminDashboard from './src/screens/admin/AdminDashboard';
import AddEquipment from './src/screens/admin/AddEquipment';
import EditEquipment from './src/screens/admin/EditEquipment';
import BorrowForm from './src/screens/user/BorrowForm';

import { UserContextProvider } from './src/context/UserContext';
import { EquipmentProvider } from './src/context/EquipmentContext';
import { NotificationProvider } from './src/context/NotificationsContext';
import { ThemeContextProvider } from './src/styles/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserContextProvider>
      <EquipmentProvider>
        <NotificationProvider>
          <ThemeContextProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="UserDashboard" component={UserDashboard} />
                <Stack.Screen name="BorrowForm" component={BorrowForm} />
                <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
                <Stack.Screen name="AddEquipment" component={AddEquipment} />
                <Stack.Screen name="EditEquipment" component={EditEquipment} />
              </Stack.Navigator>
            </NavigationContainer>
          </ThemeContextProvider>
        </NotificationProvider>
      </EquipmentProvider>
    </UserContextProvider>
  );
}
