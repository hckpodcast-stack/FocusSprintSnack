// services/AuthService
import { startAsync, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import GOOGLE from '../config/google.json';

WebBrowser.maybeCompleteAuthSession(); // needed for web/Snack

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
};

export async function startGoogleAuth() {
  const isWeb = Platform.OS === 'web';

  const redirectUri = 'https://auth.expo.io/@hckpodcast/great-red-pastry';
  console.log('Redirect URI:', redirectUri);

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
  isWeb ? GOOGLE.webClientId : GOOGLE.clientId
}&response_type=token&scope=${encodeURIComponent(GOOGLE.scopes.join(' '))}&redirect_uri=${encodeURIComponent(redirectUri)}&include_granted_scopes=true&prompt=select_account`;

  const result = await startAsync({ authUrl, returnUrl: redirectUri });

  if (result.type !== 'success' || !result.authentication?.accessToken) {
    // user cancelled or something failed; normalize the response
    const reason =
      result.type === 'dismiss'
        ? 'cancelled'
        :
          result.error?.message ||
          result.error?.code ||
          result.params?.error_description ||
          result.params?.error ||
          'auth_failed';
    // Common pitfall on web: redirect URI must be registered in Google console
    if (isWeb && reason === 'access_denied') {
      throw new Error('redirect_uri_not_configured');
    }
    throw new Error(reason);
  }

  const accessToken = result.authentication.accessToken;
  const issuedAtSec = result.authentication.issuedAt ?? Math.floor(Date.now() / 1000);
  const expiresInSec = result.authentication.expiresIn ?? 3600;
  const expiresAt = (issuedAtSec + expiresInSec) * 1000;

  // Fetch basic profile
  const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) throw new Error('profile_fetch_failed');
  const profile = await resp.json();

  const userProfile = {
    sub: profile.sub,
    name: profile.name,
    email: profile.email,
    photoUrl: profile.picture,
  };

  return { accessToken, expiresAt, userProfile };
}

// Future: call this during real sign-out if you want to revoke the token
export async function revokeGoogleToken(token) {
  try {
    await fetch('https://oauth2.googleapis.com/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${encodeURIComponent(token)}`,
    });
  } catch {
    // non-fatal
  }
}
