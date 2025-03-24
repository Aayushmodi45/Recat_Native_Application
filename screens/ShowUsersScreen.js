import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { getUsers } from './Database';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ShowUsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
    const unsubscribe = navigation.addListener('focus', fetchUsers);
    return unsubscribe;
  }, [navigation]);

  const fetchUsers = () => {
    getUsers(setUsers);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {users.length === 0 ? (
        <View style={styles.noUsersContainer}>
          <Icon name="users" size={50} color="#bbb" />
          <Text style={styles.noUsersText}>No users registered yet!</Text>
          <Text style={styles.subText}>Start adding users to see them here.</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userDetail}><Icon name="user" size={16} /> Age: {item.age}</Text>
              <Text style={styles.userDetail}><Icon name="phone" size={16} /> {item.mobile}</Text>
              <Text style={styles.userDetail}><Icon name="envelope" size={16} /> {item.email}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  noUsersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noUsersText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 10,
  },
  subText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userDetail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 3,
  },
});

