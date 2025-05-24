import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../context/UserContext';

import UserDashboard from '../screens/user/UserDashboard';
import BorrowForm from '../screens/user/BorrowForm';

import AdminDashboard from '../screens/admin/AdminDashboard';
import NotificationsScreen from '../screens/admin/NotificationsScreen';
import EditEquipment from '../screens/admin/EditEquipment';
import AddEquipment from '../screens/admin/AddEquipment';
import EquipmentManagement from '../screens/admin/EquipmentManagement';

const UserStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();

function UserStackScreen() {
  return (
    <UserStack.Navigator initialRouteName="UserDashboard">
      <UserStack.Screen
        name="UserDashboard"
        component={UserDashboard}
        options={{ headerShown: false }}
      />
      <UserStack.Screen
        name="BorrowForm"
        component={BorrowForm}
        options={{ title: 'Borrow Equipment' }}
      />
    </UserStack.Navigator>
  );
}

function AdminStackScreen() {
  return (
    <AdminStack.Navigator initialRouteName="AdminDashboard">
      <AdminStack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ headerShown: false }}
      />
      <AdminStack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <AdminStack.Screen
        name="EditEquipment"
        component={EditEquipment}
        options={{ title: 'Edit Equipment' }}
      />
      <AdminStack.Screen
        name="AddEquipment"
        component={AddEquipment}
        options={{ title: 'Add Equipment' }}
      />
      <AdminStack.Screen
        name="EquipmentManagement"
        component={EquipmentManagement}
        options={{ title: 'Equipment Management' }}
      />
    </AdminStack.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useUser();

  return (
    <NavigationContainer>
      {user && user.role === 'admin' ? <AdminStackScreen /> : <UserStackScreen />}
    </NavigationContainer>
  );
}
