import { AuthProvider, useAuth } from "./Contexts/AuthContext";
import LandingPage from "./screens/LandingPage";
import AuthScreen from "./screens/AuthScreen";
import * as AuthSession from 'expo-auth-session';
import React from "react";
// @expo/snack-dependencies: expo-auth-session, expo-web-browser
function AuthGate() {
  const { user } = useAuth(); // pulls user from context
  return user ? <LandingPage /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
