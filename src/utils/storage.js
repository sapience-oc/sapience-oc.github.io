const KEYS = {
  TOKEN: 'sapience.token',
  USER: 'sapience.user',
  HAS_ONBOARDED: 'sapience.hasOnboarded',
};

function safeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    console.warn('[storage] getItem falhou', err);
    return null;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (err) {
    console.warn('[storage] setItem falhou', err);
  }
}

function safeRemove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn('[storage] removeItem falhou', err);
  }
}

export const storage = {
  KEYS,

  getToken: () => safeGet(KEYS.TOKEN),
  setToken: (token) => safeSet(KEYS.TOKEN, token),
  clearToken: () => safeRemove(KEYS.TOKEN),

  getUser: () => {
    const raw = safeGet(KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user) => safeSet(KEYS.USER, JSON.stringify(user)),
  clearUser: () => safeRemove(KEYS.USER),

  hasOnboarded: () => safeGet(KEYS.HAS_ONBOARDED) === '1',
  setOnboarded: () => safeSet(KEYS.HAS_ONBOARDED, '1'),
};
