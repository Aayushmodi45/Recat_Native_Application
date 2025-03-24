import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('myDatabase.db');

// Create Table
export const createTable = () => {
    db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER,
        mobile TEXT,
        email TEXT UNIQUE,
        password TEXT
      );
    `)
    .then(() => console.log('Table checked/created successfully'))
    .catch(error => console.log('Table creation error:', error));
  };
  
  // Call createTable() when the app starts
  createTable();

// Insert User
export const insertUser = async (name, age, mobile, email, password) => {
  try {
    await db.runAsync(
      'INSERT INTO users (name, age, mobile, email, password) VALUES (?, ?, ?, ?, ?)',
      [name, age, mobile, email, password]
    );
    console.log('User added successfully');
  } catch (error) {
    console.log('Insert error:', error);
  }
};

// Fetch Users
export const getUsers = async (callback) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM users');
    callback(result);
  } catch (error) {
    console.log('Fetch error:', error);
  }
};

// Search User by Name
export const searchUsers = async (name, callback) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM users WHERE name LIKE ?', [`%${name}%`]);
    callback(result);
  } catch (error) {
    console.log('Search error:', error);
  }
};

// Delete User
export const deleteUser = async (id) => {
  try {
    await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
    console.log('User deleted');
  } catch (error) {
    console.log('Delete error:', error);
  }
};

export const updateUser = async (id, name, age, mobile, password) => {
    try {
      await db.runAsync(
        'UPDATE users SET name = ?, age = ?, mobile = ?, password = ? WHERE id = ?',
        [name, age, mobile, password, id]
      );
      console.log('User updated successfully');
    } catch (error) {
      console.log('Update error:', error);
    }
  };

export default db;
