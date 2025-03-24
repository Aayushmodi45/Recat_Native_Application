import React, { useEffect, useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signInWithEmailAndPassword, updatePassword, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { onAuthStateChanged } from 'firebase/auth';


const AboutMeScreen = ({ navigation }) => {
    const [user, setUser] = useState({ firstName: '', email: '' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const auth = FIREBASE_AUTH;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedFirstName = await AsyncStorage.getItem('firstName');
                const currentUser = FIREBASE_AUTH.currentUser;
    
                if (currentUser) {
                    setUser({ firstName: storedFirstName || 'Guest', email: currentUser.email });
                } else {
                    setUser({ firstName: 'Guest', email: 'No Email' });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
    
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authenticatedUser) => {
            if (authenticatedUser) {
                const storedFirstName = await AsyncStorage.getItem('firstName');
                setUser({ firstName: storedFirstName || 'Guest', email: authenticatedUser.email });
            } else {
                setUser({ firstName: 'Guest', email: 'No Email' });
            }
        });
    
        fetchUserData();
    
        return () => unsubscribe(); // Cleanup on unmount
    }, []);
    
    const handleLogout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            await AsyncStorage.clear(); // ✅ Clears all stored user data
    
            setUser({ firstName: 'Guest', email: 'No Email' }); // ✅ Reset user state
    
            navigation.reset({
                index: 0,
                routes: [{ name: 'RegisterScreen' }], // Ensure navigation resets
            });
        } catch (error) {
            console.error('Logout Error:', error.message);
            Alert.alert('Error', `Failed to log out: ${error.message}`);
        }
    };
    
    
    

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            Alert.alert('Error', 'Please enter both current and new passwords.');
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters long.');
            return;
        }

        try {
            const user = auth.currentUser;
            await signInWithEmailAndPassword(auth, user.email, currentPassword);
            await updatePassword(user, newPassword);

            Alert.alert('Success', 'Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            Alert.alert('Error', 'Current password is incorrect. Try again.');
        }
    };

    // const handleLogout = async () => {
    //     try {
    //         await signOut(FIREBASE_AUTH);
    //         await AsyncStorage.removeItem('firstName'); // Clear stored user data
    //         await AsyncStorage.removeItem('user'); // Remove session data
    //         setUser({ firstName: 'Guest', email: 'No Email' }); // Reset user state
    //         navigation.reset({
    //             index: 0,
    //             routes: [{ name: 'RegisterScreen' }], // Ensure navigation resets
    //         });
    //     } catch (error) {
    //         console.error('Logout Error:', error.message);
    //         Alert.alert('Error', `Failed to log out: ${error.message}`);
    //     }
    // };
    
    
    return (
        <View style={styles.container}>
            {/* Custom Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.card}>
                <Text style={styles.title}>About Me</Text>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Username:</Text>
                    <Text style={styles.value}>{user.firstName}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Email ID:</Text>
                    <Text style={styles.value}>{user.email}</Text>
                </View>

                {/* Password Inputs with Visibility Toggle */}
                <View style={styles.passwordContainer}>
                    <Text style={styles.label}>Current Password:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter current password"
                            secureTextEntry={!showCurrentPassword}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                        <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                            <Icon name={showCurrentPassword ? 'visibility' : 'visibility-off'} size={24} color="#888" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.passwordContainer}>
                    <Text style={styles.label}>New Password:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new password"
                            secureTextEntry={!showNewPassword}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                            <Icon name={showNewPassword ? 'visibility' : 'visibility-off'} size={24} color="#888" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3F2FD', // Light Blue Background
        padding: 24,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#1976D2',
        padding: 8,
        borderRadius: 20,
        elevation: 5,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1A237E',
        marginBottom: 20,
    },
    infoContainer: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#424242',
    },
    value: {
        fontSize: 16,
        color: '#616161',
        marginTop: 3,
    },
    passwordContainer: {
        marginBottom: 15,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BDBDBD',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#FAFAFA',
        marginTop: 5,
    },
    input: {
        flex: 1,
        height: 50,
    },
    button: {
        backgroundColor: '#1976D2',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#D32F2F',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AboutMeScreen;
