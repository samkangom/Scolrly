// Scolrly API client — offline-first. Every call times out fast and returns
// null on failure so screens can fall back to bundled placeholder data.
// The app must remain fully usable with no server (poor connectivity is a
// design constraint for our launch market).
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const TOKEN_KEY = '@scolrly/token';
const DEVICE_KEY = '@scolrly/deviceId';

// In Expo dev, the Metro host is the machine running the API server too.
const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || (devHost ? `http://${devHost}:4000` : 'http://localhost:4000');

let token = null;

async function getDeviceId() {
  let id = await AsyncStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    await AsyncStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

async function request(method, path, body, { timeout = 4000, auth = true } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        ...(auth && token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // offline / timeout / server down — caller falls back
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get: (path, opts) => request('GET', path, null, opts),
  post: (path, body, opts) => request('POST', path, body, opts),
  put: (path, body, opts) => request('PUT', path, body, opts),

  get token() { return token; },

  // Establish (or resume) a device-bound session. Returns the server user
  // or null when unreachable. Safe to call repeatedly.
  async connect(profile) {
    const stored = await AsyncStorage.getItem(TOKEN_KEY);
    if (stored) token = stored;
    const deviceId = await getDeviceId();
    const data = await request('POST', '/api/auth/device', {
      deviceId,
      name: profile?.name,
      initials: profile?.initials,
      targetYear: profile?.targetYear,
      status: profile?.status,
      coaching: profile?.coaching,
      medium: profile?.medium,
    }, { auth: false });
    if (data?.token) {
      token = data.token;
      await AsyncStorage.setItem(TOKEN_KEY, token);
      return data.user;
    }
    return null;
  },
};
