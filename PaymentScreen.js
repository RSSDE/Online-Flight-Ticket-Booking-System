// import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
// import { useState } from "react";
// import API from "../services/api";
// import axios from 'axios';


// export default function PaymentScreen({ route, navigation }) {
//   const { booking_id } = route.params;   // coming from PassengerScreen

//   const [amount, setAmount] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("UPI");

//   const makePayment = async () => {
//     if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
//       Alert.alert("Error", "Enter a valid amount");
//       return;
//     }

//     try {
//       const res = await API.post("/payments", {
//         booking_id,
//         amount: parseFloat(amount),
//         payment_method: paymentMethod,
//       });

//       if (res.data.status === "success") {
//         Alert.alert("Success", "Payment successful");
//         navigation.replace("MyBookings");
//       } else {
//         Alert.alert("Error", res.data.error || "Unknown error");
//       }
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Payment failed");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Payment</Text>
//       <Text style={styles.label}>Booking ID: {booking_id}</Text>

//       <TextInput
//         placeholder="Enter Amount"
//         value={amount}
//         onChangeText={setAmount}
//         keyboardType="numeric"
//         style={styles.input}
//       />

//       <TextInput
//         placeholder="Payment Method (UPI / Card)"
//         value={paymentMethod}
//         onChangeText={setPaymentMethod}
//         style={styles.input}
//       />

//       <Button title="Pay Now" onPress={makePayment} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center" },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
//   label: { fontSize: 16, marginBottom: 10, textAlign: "center" },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
// });



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   ImageBackground,
// } from "react-native";
// import API from "../services/api";
// import DateTimePicker from '@react-native-community/datetimepicker';


// export default function PaymentScreen({ route, navigation }) {
//   const { booking_id } = route.params;

//   const [method, setMethod] = useState("card"); // default method
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiryDate, setExpiryDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);
//   const [cvv, setCvv] = useState("");
//   const [upiId, setUpiId] = useState("");

//   const handlePayment = async () => {
//     if (method === "card" && (!cardNumber || !expiryDate || !cvv)) {
//       Alert.alert("Error", "Please fill all card fields");
//       return;
//     }
//     if (method === "upi" && !upiId) {
//       Alert.alert("Error", "Please enter UPI ID");
//       return;
//     }

//     try {
//       const payload = { booking_id };
//       if (method === "card") {
//         payload.card_number = cardNumber;
//         payload.expiry = `${expiryDate.getMonth() + 1}/${expiryDate
//           .getFullYear()
//           .toString()
//           .slice(-2)}`;
//         payload.cvv = cvv;
//       } else {
//         payload.upi_id = upiId;
//       }

//       const res = await API.post("/payment", payload);

//       if (res.data.status === "success") {
//         Alert.alert("Success", "Payment completed successfully");
//         navigation.replace("MyBookings");
//       } else {
//         Alert.alert("Error", res.data.error || "Payment failed");
//       }
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Server not reachable");
//     }
//   };

//   const onValueChange = (event, newDate) => {
//     setShowPicker(false);
//     if (newDate) setExpiryDate(newDate);
//   };

//   return (
//     <ImageBackground
//       source={require("../../assets/images/payment-bg.avif")} // ensure this path is correct
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <View style={styles.overlay}>
//         <View style={styles.card}>
//           <Text style={styles.title}>Payment Details</Text>

//           {/* Payment Method Toggle */}
//           <View style={styles.toggleContainer}>
//             <TouchableOpacity
//               style={[styles.toggleBtn, method === "card" && styles.activeToggle]}
//               onPress={() => setMethod("card")}
//             >
//               <Text
//                 style={[styles.toggleText, method === "card" && styles.activeText]}
//               >
//                 Card
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.toggleBtn, method === "upi" && styles.activeToggle]}
//               onPress={() => setMethod("upi")}
//             >
//               <Text
//                 style={[styles.toggleText, method === "upi" && styles.activeText]}
//               >
//                 UPI
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Card Payment Fields */}
//           {method === "card" && (
//             <>
//               <TextInput
//                 placeholder="Card Number"
//                 value={cardNumber}
//                 onChangeText={setCardNumber}
//                 keyboardType="number-pad"
//                 style={styles.input}
//               />

//               {/* Expiry Picker */}
//               <TouchableOpacity
//                 style={styles.input}
//                 onPress={() => setShowPicker(true)}
//               >
//                 <Text>
//                   {expiryDate
//                     ? `${expiryDate.getMonth() + 1}/${expiryDate
//                         .getFullYear()
//                         .toString()
//                         .slice(-2)}`
//                     : "Select Expiry (MM/YY)"}
//                 </Text>
//               </TouchableOpacity>

//               {showPicker &&(
//                 <DateTimePicker
//                   onChange={onValueChange}
//                   value={expiryDate}
//                   minimumDate={new Date()}
//                   maximumDate={new Date(2050, 11)}
//                 />
//               )}

//               <TextInput
//                 placeholder="CVV"
//                 value={cvv}
//                 onChangeText={setCvv}
//                 keyboardType="number-pad"
//                 secureTextEntry
//                 style={styles.input}
//               />
//             </>
//           )}

//           {/* UPI Payment Field */}
//           {method === "upi" && (
//             <TextInput
//               placeholder="UPI ID (e.g. name@bank)"
//               value={upiId}
//               onChangeText={setUpiId}
//               style={styles.input}
//             />
//           )}

//           <TouchableOpacity style={styles.btn} onPress={handlePayment}>
//             <Text style={styles.btnText}>Pay Now</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: { flex: 1 },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.4)",
//     padding: 20,
//   },
//   card: {
//     width: "95%",
//     backgroundColor: "rgba(255,255,255,0.95)",
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#2563EB",
//   },
//   toggleContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   toggleBtn: {
//     flex: 1,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: "#2563EB",
//     borderRadius: 8,
//     marginHorizontal: 5,
//     alignItems: "center",
//   },
//   toggleText: {
//     fontSize: 16,
//     color: "#2563EB",
//     fontWeight: "600",
//   },
//   activeToggle: {
//     backgroundColor: "#2563EB",
//   },
//   activeText: {
//     color: "#fff",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//     backgroundColor: "#f9f9f9",
//   },
//   btn: {
//     backgroundColor: "#2563EB",
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   btnText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },
// });


// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   ImageBackground,
// } from "react-native";
// import { useState } from "react";
// import API from "../services/api";
// import DateTimePicker from "@react-native-community/datetimepicker";

// export default function PaymentScreen({ route, navigation }) {
//   const { booking_id , seat_id} = route.params;

//   const [amount, setAmount] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("UPI");

//   // Card fields
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiryDate, setExpiryDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);
//   const [cvv, setCvv] = useState("");

//   // UPI field
//   const [upiId, setUpiId] = useState("");

//   const makePayment = async () => {
//     if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
//       Alert.alert("Error", "Enter a valid amount");
//       return;
//     }

//     if (paymentMethod === "Card" && (!cardNumber || !expiryDate || !cvv)) {
//       Alert.alert("Error", "Please fill all card details");
//       return;
//     }

//     if (paymentMethod === "UPI" && !upiId) {
//       Alert.alert("Error", "Please enter UPI ID");
//       return;
//     }

//     try {
//       const payload = {
//         booking_id,
//         amount: parseFloat(amount),
//         payment_method: paymentMethod.toLowerCase(), // backend expects "upi" or "card"
//       };

//       if (paymentMethod === "Card") {
//         payload.card_number = cardNumber;
//         payload.expiry = `${expiryDate.getMonth() + 1}/${expiryDate
//           .getFullYear()
//           .toString()
//           .slice(-2)}`;
//         payload.cvv = cvv;
//       } else {
//         payload.upi_id = upiId;
//       }

//       const res = await API.post("/payments", payload);

//       if (res.data.status === "success") {
//         Alert.alert("Success", "Payment successful",[
//           { text: "OK", onPress: () =>navigation.navigate("MyBookings") },
//         ]);
//       } else {
//         Alert.alert("Error", res.data.error || "Unknown error");
//       }
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Payment failed");
//     }
//   };

//   const onValueChange = (event, newDate) => {
//     setShowPicker(false);
//     if (newDate) setExpiryDate(newDate);
//   };

//   return (
//     <ImageBackground
//       source={require("../../assets/images/payment-bg.avif")} // scenic airplane window image
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <View style={styles.overlay}>
//         <View style={styles.card}>
//           <Text style={styles.title}>Payment</Text>
//           <Text style={styles.label}>Booking ID: {booking_id}</Text>

//           {/* Toggle FIRST */}
//           <View style={styles.toggleContainer}>
//             <TouchableOpacity
//               style={[styles.toggleBtn, paymentMethod === "UPI" && styles.activeToggle]}
//               onPress={() => setPaymentMethod("UPI")}
//             >
//               <Text style={[styles.toggleText, paymentMethod === "UPI" && styles.activeText]}>UPI</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.toggleBtn, paymentMethod === "Card" && styles.activeToggle]}
//               onPress={() => setPaymentMethod("Card")}
//             >
//               <Text style={[styles.toggleText, paymentMethod === "Card" && styles.activeText]}>Card</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Amount AFTER toggle */}
//           <TextInput
//             placeholder="Enter Amount"
//             value={amount}
//             onChangeText={setAmount}
//             keyboardType="numeric"
//             style={styles.input}
//           />

//           {/* UPI Input */}
//           {paymentMethod === "UPI" && (
//             <TextInput
//               placeholder="UPI ID (name@bank)"
//               value={upiId}
//               onChangeText={setUpiId}
//               style={styles.input}
//             />
//           )}

//           {/* Card Inputs */}
//           {paymentMethod === "Card" && (
//             <>
//               <TextInput
//                 placeholder="Card Number"
//                 value={cardNumber}
//                 onChangeText={setCardNumber}
//                 keyboardType="number-pad"
//                 style={styles.input}
//               />

//               <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
//                 <Text>
//                   {`${expiryDate.getMonth() + 1}/${expiryDate
//                     .getFullYear()
//                     .toString()
//                     .slice(-2)}`}
//                 </Text>
//               </TouchableOpacity>

//               {showPicker && (
//                 <DateTimePicker
//                   value={expiryDate}
//                   mode="date"
//                   display="spinner"
//                   onChange={onValueChange}
//                   minimumDate={new Date()}
//                 />
//               )}

//               <TextInput
//                 placeholder="CVV"
//                 value={cvv}
//                 onChangeText={setCvv}
//                 keyboardType="number-pad"
//                 secureTextEntry
//                 style={styles.input}
//               />
//             </>
//           )}

//           <TouchableOpacity style={styles.btn} onPress={makePayment}>
//             <Text style={styles.btnText}>PAY NOW</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: { flex: 1 },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.4)",
//     padding: 20,
//   },
//   card: {
//     width: "95%",
//     backgroundColor: "rgba(255,255,255,0.95)",
//     borderRadius: 16,
//     padding: 20,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 10,
//     color: "#2563EB",
//   },
//   label: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//     backgroundColor: "#f9f9f9",
//   },
//   toggleContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   toggleBtn: {
//     flex: 1,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: "#2563EB",
//     borderRadius: 8,
//     marginHorizontal: 5,
//     alignItems: "center",
//   },
//   toggleText: {
//     fontSize: 16,
//     color: "#2563EB",
//     fontWeight: "600",
//   },
//   activeToggle: { backgroundColor: "#2563EB" },
//   activeText: { color: "#fff" },
//   btn: {
//     backgroundColor: "#2563EB",
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   btnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
// });


//upi linking


import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Platform,
  Linking,
} from "react-native";
import { useState } from "react";
import API from "../services/api";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function PaymentScreen({ route, navigation }) {
  const { booking_id, seat_id } = route.params;

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [cvv, setCvv] = useState("");

  // UPI field
  const [upiId, setUpiId] = useState("");

  const makePayment = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Enter a valid amount");
      return;
    }

    // ---------------- UPI Payment ----------------
    if (paymentMethod === "UPI") {
      if (!upiId) {
        Alert.alert("Error", "Please enter UPI ID");
        return;
      }

      // Generate a unique transaction ID
      const txnId = "TXN" + new Date().getTime();

      // UPI deep link
      const url = `upi://pay?pa=${upiId}&pn=FlightBooking&tr=${txnId}&tn=Flight+Ticket+Payment&am=${amount}&cu=INR`;

      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);

          // Store payment as Pending in backend
          await API.post("/payments", {
            booking_id,
            amount: parseFloat(amount),
            payment_method: "upi",
            transaction_id: txnId,
            status: "Pending",
          });

          Alert.alert(
            "UPI Payment",
            "Please complete payment in your UPI app. Status will update once verified.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        } else {
          Alert.alert("Error", "No UPI app found on your device!");
        }
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Failed to open UPI app");
      }
      return; // Prevents card logic from running
    }

    // ---------------- Card Payment ----------------
    if (paymentMethod === "Card" && (!cardNumber || !expiryDate || !cvv)) {
      Alert.alert("Error", "Please fill all card details");
      return;
    }

    try {
      const payload = {
        booking_id,
        amount: parseFloat(amount),
        payment_method: paymentMethod.toLowerCase(), // backend expects "upi" or "card"
      };

      if (paymentMethod === "Card") {
        payload.card_number = cardNumber;
        payload.expiry = `${expiryDate.getMonth() + 1}/${expiryDate
          .getFullYear()
          .toString()
          .slice(-2)}`;
        payload.cvv = cvv;
      }

      const res = await API.post("/payments", payload);

      if (res.data.status === "success") {
        Alert.alert("Success", "Payment successful", [
          { text: "OK", onPress: () => navigation.navigate("MyBookings") },
        ]);
      } else {
        Alert.alert("Error", res.data.error || "Unknown error");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Payment failed");
    }
  };

  const onValueChange = (event, newDate) => {
    setShowPicker(false);
    if (newDate) setExpiryDate(newDate);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/payment-bg.avif")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Payment</Text>
          <Text style={styles.label}>Booking ID: {booking_id}</Text>

          {/* Payment Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, paymentMethod === "UPI" && styles.activeToggle]}
              onPress={() => setPaymentMethod("UPI")}
            >
              <Text
                style={[styles.toggleText, paymentMethod === "UPI" && styles.activeText]}
              >
                UPI
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, paymentMethod === "Card" && styles.activeToggle]}
              onPress={() => setPaymentMethod("Card")}
            >
              <Text
                style={[styles.toggleText, paymentMethod === "Card" && styles.activeText]}
              >
                Card
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <TextInput
            placeholder="Enter Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* UPI Input */}
          {paymentMethod === "UPI" && (
            <TextInput
              placeholder="UPI ID (name@bank)"
              value={upiId}
              onChangeText={setUpiId}
              style={styles.input}
            />
          )}

          {/* Card Inputs */}
          {paymentMethod === "Card" && (
            <>
              <TextInput
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
                style={styles.input}
              />

              <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
                <Text>
                  {`${expiryDate.getMonth() + 1}/${expiryDate
                    .getFullYear()
                    .toString()
                    .slice(-2)}`}
                </Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={expiryDate}
                  mode="date"
                  display="spinner"
                  onChange={onValueChange}
                  minimumDate={new Date()}
                />
              )}

              <TextInput
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="number-pad"
                secureTextEntry
                style={styles.input}
              />
            </>
          )}

          <TouchableOpacity style={styles.btn} onPress={makePayment}>
            <Text style={styles.btnText}>PAY NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
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
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#2563EB",
  },
  label: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
  },
  activeToggle: { backgroundColor: "#2563EB" },
  activeText: { color: "#fff" },
  btn: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
