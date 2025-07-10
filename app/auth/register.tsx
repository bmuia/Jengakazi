import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useState } from "react";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post("http://10.0.87.42:8000/api/register/job-seeker/", {
        phone_number: `+254${phone}`,
        otp,
      });

      router.push("/auth/Login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check your OTP or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Please enter your phone number and the OTP that was sent to you
      </Text>

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

      <Text style={styles.label}>OTP Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/Login")}>
  <Text style={styles.loginLink}>
    Already have an account? <Text style={styles.loginLinkBold}>Log in</Text>
  </Text>
</TouchableOpacity>

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
  error: {
    color: "#dc2626",
    marginBottom: 12,
    fontSize: 14,
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
  loginLink: {
  marginTop: 20,
  textAlign: "center",
  color: "#444",
  fontSize: 14,
},
loginLinkBold: {
  color: "#2563EB",
  fontWeight: "600",
},

});
