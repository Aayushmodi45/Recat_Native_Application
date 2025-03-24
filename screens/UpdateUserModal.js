import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { searchUsers, updateUser } from './Database';
import Icon from 'react-native-vector-icons/FontAwesome';

const UpdateUserModal = () => {
  const [searchName, setSearchName] = useState('');
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmedName = searchName.trim();
    if (trimmedName === '') {
      Alert.alert('Invalid Search', 'Please enter a valid name.');
      return;
    }

    setLoading(true);
    searchUsers(trimmedName, (results) => {
      setLoading(false);
      if (results.length > 0) {
        const foundUser = results[0];
        setUser(foundUser);
        setName(foundUser.name);
        setAge(foundUser.age.toString());
        setMobile(foundUser.mobile);
        setEmail(foundUser.email);
        setPassword('');
        setModalVisible(true);
      } else {
        Alert.alert('User Not Found', 'No user found with this name.');
        setUser(null);
      }
    });
  };

  const handleUpdate = async () => {
    if (!name.trim() || !age.trim() || !mobile.trim()) {
      Alert.alert('Error', 'All fields except password are required.');
      return;
    }

    if (isNaN(age) || parseInt(age) <= 0) {
      Alert.alert('Invalid Age', 'Please enter a valid age.');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    await updateUser(user.id, name.trim(), parseInt(age), mobile.trim(), password.trim());
    Alert.alert('Success', 'User details updated successfully.');
    setModalVisible(false);
    setSearchName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update User</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name to Search"
        value={searchName}
        onChangeText={setSearchName}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Search User</Text>}
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Update User</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
            <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric" />
            <TextInput style={styles.input} value={mobile} onChangeText={setMobile} placeholder="Mobile" keyboardType="phone-pad" />
            <TextInput style={[styles.input, styles.disabledInput]} value={email} placeholder="Email (Can't be changed)" editable={false} />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="New Password" secureTextEntry />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Icon name="save" size={18} color="white" />
                <Text style={styles.buttonText}> Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Icon name="times" size={18} color="white" />
                <Text style={styles.buttonText}> Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f0f8ff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 8, backgroundColor: 'white' },
  disabledInput: { backgroundColor: '#e0e0e0' },
  searchButton: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  updateButton: { flexDirection: 'row', backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 1, marginRight: 5 },
  cancelButton: { flexDirection: 'row', backgroundColor: '#F44336', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 1, marginLeft: 5 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '90%', elevation: 5 },
  buttonContainer: { flexDirection: 'row', marginTop: 10 },
});

export default UpdateUserModal;
