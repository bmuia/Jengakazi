import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";



export default function Login() {
  const [isEmployer, setIsEmployer] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  const data = isEmployer
    ? { email, password }
    : { phone_number: `+254${phone}` }; 

  try {
    const response = await fetch("http://10.0.87.42:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      Alert.alert("Success", result.message);
      console.log("Access token:", result.tokens.access);
      await AsyncStorage.setItem("accessToken", result.tokens.access);
  await AsyncStorage.setItem("refreshToken", result.tokens.refresh);

  router.replace('/(tabs)');
  
    } else {
      Alert.alert("Error", result.error || "Login failed");
    }
  } catch (error) {
    Alert.alert("Error", "Something went wrong");
    console.error(error);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login dear member so you can enjoy our app
      </Text>

      <TouchableOpacity
        onPress={() => setIsEmployer(!isEmployer)}
        style={styles.toggle}
      >
        <Text style={styles.toggleText}>
          {isEmployer ? "Switch to Job Seeker Login" : "Switch to Employer Login"}
        </Text>
      </TouchableOpacity>

// Only change inside the Login component
{!isEmployer && (
  <>
    <Text style={styles.label}>Phone Number</Text>
    <View style={styles.phoneInputWrapper}>
      <View style={styles.prefixContainer}>
        <Text style={styles.prefixText}>+254</Text>
      </View>
      <TextInput
        style={styles.phoneInput}
        placeholder="712345678"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={9}
      />
    </View>

    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>Login as Job Seeker</Text>
    </TouchableOpacity>
  </>
)}


      {isEmployer && (
        <View style={styles.employerSection}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Employer Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  toggle: {
    alignSelf: "center",
    marginBottom: 20,
  },
  toggleText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#444",
  },
  phoneInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  prefixContainer: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: "center",
  },
  prefixText: {
    fontSize: 16,
    color: "#555",
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  employerSection: {
    marginTop: 20,
  },
});
