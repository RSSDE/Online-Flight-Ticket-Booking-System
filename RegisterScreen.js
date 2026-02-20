// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,ImageBackground, } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { registerUser } from '../services/api';
// //import axios from 'axios';


// export default function RegisterScreen({ navigation }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     if (!name || !email || !password) {
//       Alert.alert('Error', 'Name, email and password are required');
//       return;
//     }

//     const emailRegex = /\S+@\S+\.\S+/;
//     if (!emailRegex.test(email)) {
//       Alert.alert('Error', 'Please enter a valid email');
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await registerUser(name, email, phone, password);
//       console.log('REGISTER RESPONSE:', res.data);

//       if (res.data.status === 'success') {
//         Alert.alert('Success', 'Registration successful. Please login.');
//         navigation.replace('Login');
//       } else {
//         Alert.alert('Registration Failed', res.data.error || 'Unknown error');
//       }
//     } catch (err) {
//       console.log('REGISTER ERROR:', err.response?.data || err.message);
//       Alert.alert('Error', err.response?.data?.error || err.message || 'Server not reachable');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
  
//     <View style={styles.container}>
//       <Text style={styles.title}>Register</Text>

//       <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
//       <TextInput
//         placeholder="Email"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         placeholder="Phone"
//         style={styles.input}
//         value={phone}
//         onChangeText={setPhone}
//         keyboardType="phone-pad"
//       />
//       <TextInput
//         placeholder="Password"
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 10 }} />
//       ) : (
//         <TouchableOpacity style={styles.btn} onPress={handleRegister}>
//           <Text style={styles.btnText}>Register</Text>
//         </TouchableOpacity>
//       )}

//       <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
//         Already have an account? Login
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
//   btn: { backgroundColor: '#1976d2', padding: 15, borderRadius: 8 },
//   btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
//   loginText: { marginTop: 15, color: 'blue', textAlign: 'center' },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { registerUser } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
  if (!name || !email || !password) {
    Alert.alert('Error', 'Name, email and password are required');
    return;
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    Alert.alert('Error', 'Please enter a valid email');
    return;
  }

  if (password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters');
    return;
  }

  setLoading(true);

  try {
    const res = await registerUser(name, email, phone, password);

    if (res.data.status === 'success') {
      Alert.alert('Success', 'Registration successful. Please login.');
      navigation.replace('Login');
    } else {
      Alert.alert('Registration Failed', res.data.error || 'Unknown error');
    }

  } catch (err) {
    Alert.alert(
      'Error',
      err.response?.data?.error || err.message || 'Server not reachable'
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <ImageBackground
      source={require('../../assets/images/plane-bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Register</Text>

          <View style={styles.inputWrapper}>
            <Icon name="person" size={20} color="#1976d2" style={styles.icon} />
            <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="email" size={20} color="#1976d2" style={styles.icon} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="phone" size={20} color="#1976d2" style={styles.icon} />
            <TextInput
              placeholder="Phone"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
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
            <ActivityIndicator size="large" color="#1976d2" style={{ marginVertical: 10 }} />
          ) : (
            <TouchableOpacity style={styles.btn} onPress={handleRegister}>
              <Text style={styles.btnText}>Register</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
            Already have an account? <Text style={{ fontWeight: 'bold' }}>Login</Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1 ,
    justifyContent:'center',
    alignItems:'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255,0.85)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#1976d2' },
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
  btn: {
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  loginText: { marginTop: 20, color: '#1976d2', textAlign: 'center', fontSize: 14 },
});
