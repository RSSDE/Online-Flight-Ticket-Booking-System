import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function AdminHomeScreen({ navigation }) {

  const MenuButton = ({ title, screen }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate(screen)}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <Text style={styles.section}>📊 Bookings</Text>
      <MenuButton title="Flight Bookings" screen="AdminFlightBookings" />
      <MenuButton title="Hotel Bookings" screen="AdminHotelBookings" />

      <Text style={styles.section}>👥 Users</Text>
      <MenuButton title="View Users" screen="AdminUsers" />

      <Text style={styles.section}>✈ Manage Data</Text>
      <MenuButton title="Airlines" screen="AdminAirlines" />
      <MenuButton title="Aircraft" screen="AdminAircraft" />
      <MenuButton title="Airports" screen="AdminAirports" />
      <MenuButton title="Flights" screen="AdminFlights" />
      <MenuButton title="Flight Schedules" screen="AdminSchedules" />

      <TouchableOpacity
        style={styles.logout}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  section: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },
  logout: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    marginTop: 30
  },
  logoutText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  }
});
