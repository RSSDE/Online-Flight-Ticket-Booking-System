import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,ImageBackground, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, setToken } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(email, password);
      //const res = await axios.post(`${BASE_URL}/users/login`, { email, password });

      console.log('LOGIN RESPONSE:', res.data);

      if (res.data.status === 'success') {
        const token = res.data.data.token;
        setToken(token); // for future API calls
        await AsyncStorage.setItem('token', token);

        // Alert.alert('Success', 'Login successful');
        navigation.replace('Home');
      } else {
        Alert.alert('Login Failed', res.data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.log('LOGIN ERROR:', err.response?.data || err.message);
      Alert.alert('Login Failed', err.response?.data?.error || err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
    source={require('../../assets/images/plane2-bg.jpg')} 
    style={styles.background} 
    resizeMode="cover" 
  >
  
      <View style={styles.overlay}>
        <View style={styles.card}>
      <Text style={styles.title}>Flight Booking Login</Text>


      <View style={styles.inputWrapper}>
        <Icon name="email" size={20} color="#1976d2" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>  



      <View style={styles.inputWrapper}>
        <Icon name="lock" size={20} color="#1976d2" style={styles.icon} />
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>  

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 10 }} />
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("AdminLogin")}
      >
  <Text style={{ color: "green", textAlign: "center", fontWeight: "bold" }}>
    Login as Admin
  </Text>
</TouchableOpacity>


      <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
        Don't have an account? <Text style={{ fontWeight: 'bold' }}>Register</Text>
      </Text>
    </View>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({ 
  background: { flex: 1 }, 
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(255,255,255,0.2)', // More transparent for vivid background 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  card: { width: '90%', 
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 5, 
  },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#1976d2' },
    inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    marginBottom: 15, 
    backgroundColor: '#f9f9f9', 
  },
  icon: { marginRight: 8 }, 
  input: { flex: 1, paddingVertical: 10 }, 
  btn: { backgroundColor: '#1976d2', paddingVertical: 15, borderRadius: 10, marginTop: 10 }, 
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }, 
  registerText: { marginTop: 20, color: '#1976d2', textAlign: 'center', fontSize: 14 },

});
