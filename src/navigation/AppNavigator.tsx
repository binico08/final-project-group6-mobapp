import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserDashboard from '../screens/user/UserDashboard';
import BorrowForm from '../screens/user/BorrowForm';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserDashboard">
        <Stack.Screen
          name="UserDashboard"
          component={UserDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BorrowForm"
          component={BorrowForm}
          options={{ title: 'Borrow Equipment' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
