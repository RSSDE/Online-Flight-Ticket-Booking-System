// import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
// import { useState } from "react";
// import API from "../services/api";
// import axios from 'axios';


// export default function PassengerScreen({ route, navigation }) {
//   const { booking_id } = route.params;

//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [gender, setGender] = useState("");
//   //const [seatId, setSeatId] = useState("");

//   const [passengers, setPassengers] = useState([]);

//   const addPassenger = async () => {
//     if (!name || !age || !gender ) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }

//     try {
//       const res = await API.post("/passengers", {
//         booking_id,
//         passenger_name: name,
//         age: parseInt(age),
//         gender,
//       });

//       if (res.data.status === "success") {
//         setPassengers([
//           ...passengers,
//           { passenger_name: name, age: parseInt(age), gender},
//         ]);

//         setName("");
//         setAge("");
//         setGender("");
//         //setSeatId("");

//         Alert.alert("Success", "Passenger added");
//       } else {
//         Alert.alert("Error", res.data.error || "Unknown error");
//       }
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Server not reachable");
//     }
//   };

//   const proceedToPayment = () => {
//     if (passengers.length === 0) {
//       Alert.alert("Error", "Add at least one passenger");
//       return;
//     }
//     navigation.replace("Payment", { booking_id });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Add Passenger</Text>

//       <TextInput
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//         style={styles.input}
//       />

//       <TextInput
//         placeholder="Age"
//         value={age}
//         onChangeText={setAge}
//         keyboardType="number-pad"
//         style={styles.input}
//       />

//       <TextInput
//         placeholder="Gender (Male/Female)"
//         value={gender}
//         onChangeText={setGender}
//         style={styles.input}
//       />

//       <Button title="Add Passenger" onPress={addPassenger} />

//       <FlatList
//         data={passengers}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <Text style={styles.listItem}>
//             {item.passenger_name} | {item.age} | {item.gender}
//           </Text>
//         )}
//         style={{ marginVertical: 20 }}
//       />

//       <Button
//         title="Proceed to Payment"
//         onPress={proceedToPayment}
//         disabled={passengers.length === 0}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
//   listItem: { padding: 5, fontSize: 16 },
// });



import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  StyleSheet, 
  ImageBackground 
} from "react-native";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function PassengerScreen({ route, navigation }) {
  const { booking_id, aircraft_id } = route.params;

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [passengers, setPassengers] = useState([]);

  const addPassenger = async () => {
    if (!name || !age || !gender) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/passengers", {
        booking_id,
        passenger_name: name,
        age: parseInt(age),
        gender,
      });

      if (res.data.status === "success") {
        setPassengers([...passengers, { passenger_name: name, age: parseInt(age), gender }]);
        setName("");
        setAge("");
        setGender("");
        Alert.alert("Success", "Passenger added");
      } else {
        Alert.alert("Error", res.data.error || "Unknown error");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Server not reachable");
    }
  };

  const proceedToPayment = () => {
    if (passengers.length === 0) {
      Alert.alert("Error", "Add at least one passenger");
      return;
    }
    navigation.replace("Payment", { 
      booking_id,
      aircraft_id,
      passengers,
     });
  };

  return (
    <ImageBackground
      source={require("../../assets/images/plane-bg.jpg")} // replace with your background image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Add Passenger</Text>

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            style={styles.input}
          />

          <TextInput
            placeholder="Gender (Male/Female)"
            value={gender}
            onChangeText={setGender}
            style={styles.input}
          />

          <TouchableOpacity style={styles.btn} onPress={addPassenger}>
            <Text style={styles.btnText}>Add Passenger</Text>
          </TouchableOpacity>

          <FlatList
            data={passengers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listText}>
                  {item.passenger_name} | {item.age} | {item.gender}
                </Text>
              </View>
            )}
            style={{ marginVertical: 20 }}
          />

          <TouchableOpacity
            style={[styles.proceedBtn, passengers.length === 0 && styles.btnDisabled]}
            onPress={proceedToPayment}
            disabled={passengers.length === 0}
          >
            <Text style={styles.proceedText}>Continue to Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  card: {
    width: "95%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#1976d2",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  btn: {
    backgroundColor: "#1976d2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listItem: {
    backgroundColor: "#e5e7eb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  listText: {
    fontSize: 16,
    color: "#111827",
  },
  proceedBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  proceedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  btnDisabled: {
    backgroundColor: "#9ca3af",
  },
});
