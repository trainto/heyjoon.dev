export const generateSha256 = async (msg: string) => {
  const msgUnit8 = new TextEncoder().encode(msg);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUnit8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const Storage = (() => {
  type Key = 'isLogin';

  const which = (which: 'local' | 'session') => {
    if (which === 'session') {
      return sessionStorage;
    } else {
      return localStorage;
    }
  };

  const set = (
    key: Key,
    value: string | number | boolean | Record<string, unknown>,
    storage: 'local' | 'session' = 'local',
  ) => {
    which(storage).setItem(key, JSON.stringify(value));
  };

  const get = (key: Key, storage: 'local' | 'session' = 'local') => {
    return which(storage).getItem(key);
  };

  return {
    set,
    get,
  };
})();
