// /screens/AuthScreen
import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useAuth } from "../Contexts/AuthContext";

export default function AuthScreen() {
  const { signIn } = useAuth(); // access mock login function from context

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Image
        source={{ uri: "https://placekitten.com/120/120" }}
        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 24 }}
      />
      <Text style={{ color: "#f8fafc", fontSize: 24, fontWeight: "700", marginBottom: 12 }}>
        Welcome to FocusSprint
      </Text>
      <Text style={{ color: "#cbd5f5", textAlign: "center", marginBottom: 32 }}>
        Stay accountable, one focus sprint at a time.
      </Text>

      <Pressable
        onPress={signIn}
        style={{
          backgroundColor: "#4285F4",
          paddingVertical: 14,
          paddingHorizontal: 32,
          borderRadius: 8,
          width: "80%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
          Continue with Google
        </Text>
      </Pressable>

      <Text style={{ color: "#64748b", fontSize: 12, marginTop: 16 }}>
        (Mock login for now — real OAuth coming soon)
      </Text>
    </View>
  );
}
