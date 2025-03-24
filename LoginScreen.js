import React, { useState, useEffect } from 'react';
import { TouchableOpacity, TextInput, Text, View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from './FirebaseConfig';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons, AntDesign, FontAwesome,MaterialIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AuthSession from 'expo-auth-session';
import { LinearGradient } from 'expo-linear-gradient';





const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

 
  // Google Auth Request
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: '932250921973-efg4qdq3d0klruhicnjtqhjd58fm3mru.apps.googleusercontent.com',
    redirectUri: "https://auth.expo.io/@aayushmodi/Final_Assignment",
  })

  // Facebook Auth Request
  const [facebookRequest, facebookResponse, facebookPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "1265952427840263",
      redirectUri: "https://auth.expo.io/@aayushmodi/Final_Assignment",
      scopes: ['public_profile', 'email'],
    },
    { authorizationEndpoint: 'https://www.facebook.com/v13.0/dialog/oauth' }
  );


  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { idToken } = googleResponse.authentication;
      if (idToken) {
        const credential = GoogleAuthProvider.credential(idToken);
        signInWithCredential(FIREBASE_AUTH, credential)
          .then(async (userCredential) => {
            const user = userCredential.user;
            await AsyncStorage.setItem('firstName', user.displayName || '');
            await AsyncStorage.setItem('email', user.email || '');
            await AsyncStorage.setItem('profilePicture', user.photoURL || '');
            Toast.show({
              type: 'success',
              text1: `🎉 Welcome, ${user.displayName}!`,
              text2: 'Google Login Successful!',
            });
            navigation.reset({
              index: 0,
              routes: [{ name: 'DrawerNavigator' }],
            });
          })
          .catch(error => {
            console.error('Google Auth Error:', error.message);
            Toast.show({
              type: 'error',
              text1: '❌ Google Login Failed!',
              text2: error.message || 'Something went wrong.',
            });
          });
      }
    }
  }, [googleResponse]);
  

  const handleFacebookLogin = async () => {
    try {
      const result = await facebookPromptAsync();
  
      if (result.type === 'success') {
        const { access_token } = result.params;
  
        // Fetch user profile using the access token
        const profileResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${access_token}&fields=id,name,picture.type(large),email`
        );
        const profile = await profileResponse.json();
  
        // Authenticate with Firebase
        const credential = FacebookAuthProvider.credential(access_token);
        const userCredential = await signInWithCredential(FIREBASE_AUTH, credential);
        const user = userCredential.user;
  
        // Store user data in AsyncStorage
        await AsyncStorage.setItem('firstName', profile.name);
        await AsyncStorage.setItem('email', profile.email || '');
        await AsyncStorage.setItem('profilePicture', profile.picture.data.url || '');
  
        // Show success message
        Toast.show({
          type: 'success',
          text1: `🎉 Welcome, ${profile.name}!`,
          text2: 'Facebook Login Successful!',
        });
  
        // Navigate to DrawerNavigator
        navigation.reset({
          index: 0,
          routes: [{ name: 'DrawerNavigator' }],
        });
      }
    } catch (error) {
      console.error("Facebook Login Error:", error.message, error);
      Toast.show({
        type: 'error',
        text1: '❌ Facebook Login Failed!',
        text2: error.message || 'Something went wrong.',
      });
    }
  };
  
  

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
  
      // Fetch user details from Firestore
      const userDoc = await getDoc(doc(FIREBASE_DB, 'User', user.uid));
      if (userDoc.exists()) {
        const { firstname, lastname } = userDoc.data();
  
        // Store user data in AsyncStorage
        await AsyncStorage.setItem('firstName', firstname);
        await AsyncStorage.setItem('lastName', lastname);
        await AsyncStorage.setItem('email', email);
  
        // Show toast message immediately after setting user
        Toast.show({
          type: 'success',
          text1: `🎉 Welcome, ${firstname}!`,
          text2: 'Login Successful!',
        });
      }
  
      // Navigate to DrawerNavigator
      navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerNavigator' }],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '❌ Login Failed!',
        text2: 'Invalid email or password.',
      });
    }
  };
  

  return (
    <LinearGradient colors={['#6A11CB', '#2575FC']} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Toggle visibility
        />
        {/* Visibility Toggle Button */}
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={24}
            color="#888"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButtonGoogle}  onPress={() => googlePromptAsync()}>
        <AntDesign name="google" size={24} color="white" />
        <Text style={styles.socialButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButtonFacebook} onPress={handleFacebookLogin}>
        <FontAwesome name="facebook" size={24} color="white" />
        <Text style={styles.socialButtonText}>Sign in with Facebook</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 15,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: '#333',
  },
  inputIcon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#2575FC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialButtonGoogle: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
  },
  socialButtonFacebook: {
    flexDirection: 'row',
    backgroundColor: '#4267B2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 12,
    borderRadius: 30,
  },
});

export default LoginScreen;
