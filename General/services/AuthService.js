// services/AuthService
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import GOOGLE from '../config/google.json';

WebBrowser.maybeCompleteAuthSession(); // needed for web/Snack

// Build the Google auth URL for the implicit flow (device-only, no backend yet)
function buildAuthUrl(redirectUri) {
  const params = new URLSearchParams({
    client_id: GOOGLE.clientId,
    redirect_uri: redirectUri,
    response_type: 'token', // gets access_token directly (no server exchange yet)
    scope: GOOGLE.scopes.join(' '),
    include_granted_scopes: 'true',
    prompt: 'select_account consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function startGoogleAuth() {
  // On Snack/Expo Go, always use the proxy redirect
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const authUrl = buildAuthUrl(redirectUri);

  const result = await AuthSession.startAsync({ authUrl, returnUrl: redirectUri });

  if (result.type !== 'success' || !result.params?.access_token) {
    // user cancelled or something failed; normalize the response
    const reason = result.type === 'dismiss' ? 'cancelled' : (result.error || 'auth_failed');
    throw new Error(reason);
  }

  const accessToken = result.params.access_token;
  const expiresInSec = Number(result.params.expires_in || 3600);
  const expiresAt = Date.now() + expiresInSec * 1000;

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
