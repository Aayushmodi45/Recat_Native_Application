import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddUserScreen from './AddUserScreen';
import DeleteUserScreen from './DeleteUserScreen';
import ShowUsersScreen from './ShowUsersScreen';
import SqliteDatabase from './SqliteDatabase';
import UpdateUserModal from './UpdateUserModal';

const Stack = createNativeStackNavigator();

export default function UserManagementStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sqlitedatabase" component={SqliteDatabase} />
      <Stack.Screen name="AddUserScreen" component={AddUserScreen} options={{ title: "Add User" }} />
      <Stack.Screen name="DeleteUserScreen" component={DeleteUserScreen} options={{ title: "Delete User" }} />
      <Stack.Screen name="ShowUsersScreen" component={ShowUsersScreen} options={{ title: "Show Users" }} />
      <Stack.Screen name="UpdateUserModal" component={UpdateUserModal} options={{ title: "Update User" }} />
    </Stack.Navigator>
  );
}
