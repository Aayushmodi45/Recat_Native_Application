import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import DrawerNavigator from './screens/DrawerNavigator';
import Toast from 'react-native-toast-message';
import SplashScreen from './screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
        try {
            setLoading(true);
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error retrieving user session:", error);
        }
    };

    checkUserSession();

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authenticatedUser) => {
        if (authenticatedUser) {
            setUser(authenticatedUser);
            await AsyncStorage.setItem('user', JSON.stringify(authenticatedUser));
        } else {
            setUser(null);
            await AsyncStorage.removeItem('user');
        }
    });

    // Keep SplashScreen visible for at least 5 seconds
    const splashTimeout = setTimeout(() => {
        setLoading(false);
    }, 5000);

    return () => {
        unsubscribe();
        clearTimeout(splashTimeout);
    };
}, []);


  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <DrawerNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          
        </Stack.Navigator>
      )}
      <Toast />
    </NavigationContainer>
  );
}
