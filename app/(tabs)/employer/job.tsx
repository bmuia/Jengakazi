import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function JobScreen() {
  const [openForm, setOpenForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [wage, setWage] = useState("");
  const [availabilityStart, setAvailabilityStart] = useState(new Date());
  const [availabilityEnd, setAvailabilityEnd] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const formData = {
        title,
        description,
        location,
        wage: parseInt(wage),
        availability_start: formatDate(availabilityStart),
        availability_end: formatDate(availabilityEnd),
      };

      await axios.post("http://10.0.87.42:8000/api/jobs/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setOpenForm(false);
      setTitle(""); setDescription(""); setLocation(""); setWage("");
      setAvailabilityStart(new Date()); setAvailabilityEnd(new Date());
    } catch (error) {
      console.error("Error creating job:", error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📄 Job Portal</Text>

      <TouchableOpacity onPress={() => setOpenForm(!openForm)} style={styles.blueButton}>
        <Text style={styles.buttonText}>{openForm ? "Close" : "➕ Post Job"}</Text>
      </TouchableOpacity>

      {openForm && (
        <View style={styles.form}>
          <TextInput placeholder="Job Title" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, { height: 80 }]}
          />
          <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={styles.input} />
          <TextInput
            placeholder="Wage"
            value={wage}
            onChangeText={setWage}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>Start: {formatDate(availabilityStart)}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={availabilityStart}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, date) => {
                setShowStartPicker(false);
                if (date) setAvailabilityStart(date);
              }}
            />
          )}

          <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>End: {formatDate(availabilityEnd)}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={availabilityEnd}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, date) => {
                setShowEndPicker(false);
                if (date) setAvailabilityEnd(date);
              }}
            />
          )}

          <TouchableOpacity onPress={handleSubmit} style={styles.blueButton}>
            <Text style={styles.buttonText}>🚀 Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  heading: { fontSize: 24, fontWeight: "bold", color: "#1E3A8A", marginBottom: 20 },
  form: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
  },
  blueButton: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dateButton: {
    backgroundColor: "#E5E7EB",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: {
    color: "#374151",
    fontSize: 14,
  },
});
