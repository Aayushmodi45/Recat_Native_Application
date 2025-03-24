import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

// Import Screens
import PdfGenerator from './PdfGenerator';
import AboutMeScreen from './AboutMeScreen';
import TabNavigation from './TabNavigation';
import SwipeableTabs from './SwipeableTabs';
import UserManagementStack from './UserManagementStack';
import CameraPage from './CameraPage';
import WebFlatList from './WebFlatList';
import StaticUsers from './StaticUsers';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          setIsLoading(true);
          const firstName = await AsyncStorage.getItem('firstName');
          const lastName = await AsyncStorage.getItem('lastName');
          const email = await AsyncStorage.getItem('email');
          
          setUser({
            firstName: firstName || '',
            lastName: lastName || '',
            email: email || '',
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }, [])
  );

  return (
    <Drawer.Navigator
    screenOptions={({ route }) => ({
      headerRight: () => (
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={() => navigation.dispatch(DrawerActions.jumpTo('About Me'))}
        >
          <Text style={styles.profileText}>AM</Text>
        </TouchableOpacity>
      ),
    })}
    
    >
      <Drawer.Screen name="Capture your image" component={CameraPage} />
      <Drawer.Screen name="Generate your own pdf" component={PdfGenerator} />
      <Drawer.Screen name="WebFlatList" component={WebFlatList} />
      <Drawer.Screen name="StaticUsers" component={StaticUsers} />
      <Drawer.Screen name="Tab-Navigation System" component={TabNavigation} />
      <Drawer.Screen name="SwipeableTabs" component={SwipeableTabs} />
      <Drawer.Screen name="User Management" component={UserManagementStack} />
      <Drawer.Screen name="About Me" component={AboutMeScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6A11CB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
