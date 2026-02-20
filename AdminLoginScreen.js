import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import API from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function AdminLoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginAdmin = async () => {
    try {
      const response = await API.post("/admin/login", {
        email,
        password
      });

      console.log("LOGIN RESPONSE:", response.data);

      if (response.data.status === "success") {
        const token = response.data.data.token;

        await AsyncStorage.setItem("adminToken", token);

        // Set token forApi 
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        navigation.replace("AdminHome");   // Go to Admin Dashboard
      } else {
        Alert.alert("Error", response.data.error);
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={loginAdmin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5
  }
});

