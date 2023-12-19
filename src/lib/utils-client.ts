export const Storage = (() => {
  type Key = 'isLogin';

  const which = (which: 'local' | 'session') => {
    if (typeof window === 'undefined') {
      return null;
    }

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
    which(storage)?.setItem(key, JSON.stringify(value));
  };

  const get = (key: Key, storage: 'local' | 'session' = 'local') => {
    return which(storage)?.getItem(key) || undefined;
  };

  return {
    set,
    get,
  };
})();
