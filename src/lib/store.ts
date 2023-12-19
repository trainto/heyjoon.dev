import useSWR, { MutatorCallback, mutate } from 'swr';

type Store = {
  userInfo: UserInfo | null;
};

const createStore = () => {
  const useStore = <K extends keyof Store>(key: K) => {
    const { data, mutate } = useSWR<Store[K]>(key);

    return { value: data, dispatch: mutate };
  };

  const dispatch = <K extends keyof Store>(
    key: K,
    newValue: Store[K] | Promise<Store[K]> | MutatorCallback<Store[K]>,
  ) => {
    mutate(key, newValue);
  };

  return { useStore, dispatch };
};

const { useStore, dispatch } = createStore();

export { useStore as default, dispatch };
