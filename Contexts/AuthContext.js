// Contexts/AuthContext
import React, { createContext, useContext, useState } from 'react';
import { startGoogleAuth /*, revokeGoogleToken */ } from '../General/services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Keep token alongside user so we can revoke/clear it later
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  // MOCK sign-in for now (will be replaced by AuthService.startGoogleAuth())
  const signIn = async () => {
    try {
      const { accessToken, expiresAt, userProfile } = await startGoogleAuth();
      setUser({
        id: userProfile.sub,
        name: userProfile.name,
        email: userProfile.email,
        photoUrl: userProfile.photoUrl,
      });
      setAccessToken(accessToken);
      setExpiresAt(expiresAt);
      // Future: persist via SecureStore here
    } catch (err) {
      // stay on AuthScreen; optionally show a toast
      console.warn('Sign-in failed:', err.message);
    }
  };

  // Future-proof sign-out: clear user + token; add revocation later
  const signOut = async () => {
    try {
      // Future: await revokeGoogleToken(accessToken);
    } finally {
      setUser(null);
      setAccessToken(null);
      setExpiresAt(null);
      // Future: clear persisted storage
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, expiresAt, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

