import { StatusBar } from 'expo-status-bar';
import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    Text,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useState } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from './FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for eye icon

const RegisterScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const auth = FIREBASE_AUTH;
    const navigation = useNavigation();

    const signUp = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'All fields are mandatory!',
            });
            return;
        }
    
        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password Mismatch',
                text2: 'Passwords do not match!',
            });
            return;
        }
    
        if (!/^\d{10}$/.test(phone)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Phone Number',
                text2: 'Phone number must be exactly 10 digits!',
            });
            return;
        }
    
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            Toast.show({
                type: 'error',
                text1: 'Weak Password',
                text2: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
            });
            return;
        }
    
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = response.user;
    
            if (user) {
                // Save user data in Firestore
                await setDoc(doc(FIREBASE_DB, 'User', user.uid), {
                    email: user.email,
                    firstName: firstName,  // Ensure correct field name
                    lastName: lastName,
                    phoneNumber: phone,
                });
    
                // ✅ Store user info in AsyncStorage
                await AsyncStorage.setItem('firstName', firstName);
                await AsyncStorage.setItem('user', JSON.stringify(user));
    
                Toast.show({
                    type: 'success',
                    text1: `Welcome, ${firstName}!`,
                    text2: 'Your account has been created successfully.',
                });
    
                // ✅ Navigate to DrawerNavigator
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'DrawerNavigator' }],
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    };
    
    
    return (
        <LinearGradient colors={['#6A11CB', '#2575FC']} style={styles.gradient}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80} style={styles.container}>
                    <SafeAreaView style={styles.innerContainer}>
                        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                            <StatusBar style="light" />

                            <Text style={styles.title}>Create an Account</Text>
                            <Text style={styles.subtitle}>Sign up to get started</Text>

                            <View style={styles.card}>
                                <TextInput style={styles.input} value={firstName} placeholder="First Name" onChangeText={setFirstName} />
                                <TextInput style={styles.input} value={lastName} placeholder="Last Name" onChangeText={setLastName} />
                                <TextInput style={styles.input} value={email} placeholder="Email" autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} />
                                <TextInput style={styles.input} value={phone} placeholder="Phone Number" keyboardType="phone-pad" onChangeText={setPhone} />

                                {/* Password Field with Eye Icon */}
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={password}
                                        placeholder="Password"
                                        secureTextEntry={!showPassword}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="gray" />
                                    </TouchableOpacity>
                                </View>

                                {/* Confirm Password Field with Eye Icon */}
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={confirmPassword}
                                        placeholder="Confirm Password"
                                        secureTextEntry={!showConfirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <MaterialIcons name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={24} color="gray" />
                                    </TouchableOpacity>
                                </View>

                                {loading ? (
                                    <ActivityIndicator size="large" color="#6A11CB" />
                                ) : (
                                    <>
                                        <TouchableOpacity style={styles.createButton} onPress={signUp}>
                                            <LinearGradient colors={['#6A11CB', '#2575FC']} style={styles.createButtonGradient}>
                                      <Text style={styles.buttonText}>Sign Up</Text>
                                            </LinearGradient>
                                       </TouchableOpacity>

                                         <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginScreen')}>
                                               <Text style={styles.loginText}>Already have an account? <Text style={styles.loginTextBold}>Login</Text></Text>
                                         </TouchableOpacity>

                                    </>
                                )}
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    innerContainer: {
        width: '90%',
        maxWidth: 400,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        marginTop: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#ECF0F1',
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        elevation: 5,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#F5F5F5',
        borderColor: '#D6DBDF',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D6DBDF',
        paddingHorizontal: 12,
        marginVertical: 8,
    },
    passwordInput: {
        flex: 1,
        height: 50,
    },
    createButton: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 15,
    },
    createButtonGradient: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        color: '#555',
    },
    loginTextBold: {
        fontSize: 16,
        color: '#2575FC',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;