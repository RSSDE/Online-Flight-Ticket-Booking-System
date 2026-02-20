// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ImageBackground,
//   ScrollView,
//   Platform,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from "@react-native-community/datetimepicker";

// export default function HomeScreen({ navigation }) {

//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [airline, setAirline] = useState("");


//   //Date must be Date object
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   //Handle Date Change
//   const onChangeDate = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setDate(selectedDate);
//     }
//   };

//   const handleSearch = () => {
//     if (!from || !to || !date) {
//       alert("Please fill all fields");
//       return;
//     }

//     console.log("SENDING DATA:", from, to, airline, date.toISOString().split("T")[0]);


//     navigation.navigate("Flights", {
//       from:from.trim(),
//       to: to.trim(),
//       date: date.toISOString().split("T")[0], // send YYYY-MM-DD
//       airline: airline ? airline.trim() : "",
//     });
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem("token");
//     navigation.replace("Login");
//   };

//   return (
//     <ImageBackground
//       source={require("../../assets/images/plane-bg.jpg")}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <ScrollView contentContainerStyle={styles.overlay}>
//         <Text style={styles.title}>Welcome To ETERNFLY</Text>
//         <Text style={styles.subtitle}>Book your next journey</Text>

//         <View style={styles.card}>

//           <TextInput
//             placeholder="From (e.g. Mumbai)"
//             value={from}
//             onChangeText={setFrom}
//             style={styles.input}
//           />

//           <TextInput
//             placeholder="To (e.g. Delhi)"
//             value={to}
//             onChangeText={setTo}
//             style={styles.input}
//           />

//           <TextInput
//               placeholder="Airline (e.g. Indigo)"
//               value={airline}
//               onChangeText={setAirline}
//               style={styles.input}
//           />


//           {/*Calendar Button */}
//           <TouchableOpacity
//             style={styles.input}
//             onPress={() => setShowDatePicker(true)}
//           >
//             <Text style={{ color: "#333" }}>
//               {date.toLocaleDateString("en-IN", {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </Text>
//           </TouchableOpacity>

//           {/* Date Picker Component */}
//           {showDatePicker && (
//             <DateTimePicker
//               value={date}
//               mode="date"
//               display={Platform.OS === "ios" ? "spinner" : "default"}
//               minimumDate={new Date()}
//               onChange={onChangeDate}
//             />
//           )}

//           <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
//             <Text style={styles.btnText}>Search Flights</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={styles.secondaryBtn}
//           onPress={() => navigation.navigate("MyBookings")}
//         >
//           <Text style={styles.secondaryText}>My Bookings</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.searchBtn}
//           onPress={() => navigation.navigate("Hotels")}
//         >
//         <Text style={styles.btnText}>Search Hotels</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.secondaryBtn}
//           onPress={() => navigation.navigate("MyHotelBookings")}
//         >
//         <Text style={styles.secondaryText}>My Hotel Bookings</Text>
//         </TouchableOpacity>


//       </ScrollView>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: { flex: 1 },
//   overlay: { flexGrow: 1, padding: 20, justifyContent: "center" },
//   title: { fontSize: 26, fontWeight: "bold", color: "#fff" },
//   subtitle: { color: "#fff", marginBottom: 30 },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 20,
//     elevation: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 15,
//   },
//   searchBtn: {
//     backgroundColor: "#1976d2",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   btnText: { color: "#fff", fontWeight: "bold" },
//   secondaryBtn: { marginTop: 20, alignItems: "center" },
//   secondaryText: { color: "#fff", fontWeight: "bold" },
//   logoutBtn: { marginTop: 15, alignItems: "center" },
//   logoutText: { color: "red", fontWeight: "bold" },
// });



import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [airline, setAirline] = useState("");
  const [date, setDate] = useState(""); // now a string input

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Please fill all fields");
      return;
    }

    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert("Invalid Date", "Please enter date in YYYY-MM-DD format");
      return;
    }

    console.log("SENDING DATA:", from, to, airline, date);

    navigation.navigate("Flights", {
      from: from.trim(),
      to: to.trim(),
      date: date.trim(),
      airline: airline ? airline.trim() : "",
    });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/plane-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <Text style={styles.title}>Welcome To ETERNFLY</Text>
        <Text style={styles.subtitle}>Book your next journey</Text>

        <View style={styles.card}>
          <TextInput
            placeholder="From (e.g. Mumbai)"
            value={from}
            onChangeText={setFrom}
            style={styles.input}
          />

          <TextInput
            placeholder="To (e.g. Delhi)"
            value={to}
            onChangeText={setTo}
            style={styles.input}
          />

          <TextInput
            placeholder="Airline (e.g. Indigo)"
            value={airline}
            onChangeText={setAirline}
            style={styles.input}
          />

          {/* Manual Date Input */}
          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.btnText}>Search Flights</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("MyBookings")}
        >
          <Text style={styles.secondaryText}>My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => navigation.navigate("Hotels")}
        >
          <Text style={styles.btnText}>Search Hotels</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("MyHotelBookings")}
        >
          <Text style={styles.secondaryText}>My Hotel Bookings</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flexGrow: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  subtitle: { color: "#fff", marginBottom: 30 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  searchBtn: {
    backgroundColor: "#1976d2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  secondaryBtn: { marginTop: 20, alignItems: "center" },
  secondaryText: { color: "#fff", fontWeight: "bold" },
  logoutBtn: { marginTop: 15, alignItems: "center" },
  logoutText: { color: "red", fontWeight: "bold" },
});
