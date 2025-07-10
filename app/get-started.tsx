import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function GetStarted() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Text className="text-3xl font-bold text-blue-600 mb-4">
        Welcome to BlueCollar HR
      </Text>
      <Text className="text-center text-gray-600 mb-8">
        Helping you manage and connect with skilled workers fast and easy.
      </Text>

      <TouchableOpacity
        className="bg-blue-600 py-3 px-6 rounded-xl"
        // onPress={() => router.push("/auth/send-otp")}
      >
        <Text className="text-white font-semibold text-lg">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
