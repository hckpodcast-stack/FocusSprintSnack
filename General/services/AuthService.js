// services/AuthService
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import GOOGLE from '../config/google.json';

WebBrowser.maybeCompleteAuthSession(); // needed for web/Snack

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
};

export async function startGoogleAuth() {
  // Prefer explicit HTTPS override if provided; otherwise use the Expo proxy.
  const hardcoded = process.env.EXPO_PUBLIC_REDIRECT_URI || GOOGLE.redirectUri;
  const redirectUri = hardcoded || AuthSession.makeRedirectUri({ useProxy: true });

  console.log('Redirect URI:', redirectUri);

  const clientId = GOOGLE.clientId;
  const discovery = { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' };

  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    responseType: AuthSession.ResponseType.Token,
    scopes: GOOGLE.scopes,
    // Ask account picker to show
    prompt: 'select_account',
    // Preserve previously granted scopes
    extraParams: { include_granted_scopes: 'true' },
  });

  const result = await request.promptAsync(discovery, { useProxy: true });

  // Extract the token shape returned by AuthSession (differs by method)
  let accessToken;
  let issuedAtSec;
  let expiresInSec;

  if (result.type === 'success') {
    if (result.params?.access_token) {
      accessToken = result.params.access_token;
      issuedAtSec = Math.floor(Date.now() / 1000);
      expiresInSec = Number(result.params.expires_in ?? 3600);
    } else if (result.authentication?.accessToken) {
      accessToken = result.authentication.accessToken;
      issuedAtSec = result.authentication.issuedAt ?? Math.floor(Date.now() / 1000);
      expiresInSec = result.authentication.expiresIn ?? 3600;
    }
  }

  if (!accessToken) {
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
    throw new Error(reason);
  }
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
