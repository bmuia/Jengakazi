import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";

export default function SendOtp() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOTP = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post("http://10.0.87.42:8000/api/send-otp/", {
  phone_number: `+254${phone}`,

});


      router.push("/auth/register");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome New Member</Text>

      <Text style={styles.description}>
        Before registering, we'll send you a one-time passcode (OTP) to verify your number.
      </Text>

      <Text style={styles.label}>Phone Number</Text>

      <View style={styles.phoneInputContainer}>
        <View style={styles.countryCodeBox}>
          <Text style={styles.countryCode}>+254</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder="712345678"
          keyboardType="phone-pad"
          maxLength={9}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleOTP} disabled={loading || !phone}>
        <Text style={styles.buttonText}>{loading ? "Sending..." : "Send OTP"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 24,
    justifyContent: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  description: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  countryCodeBox: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#e5e7eb",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  countryCode: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  error: {
    color: "#dc2626",
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
