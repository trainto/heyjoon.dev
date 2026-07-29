---
title: 'React - state management (Sante)'
date: '2025-04-20'
description: 'React state management with Context, SWR, Zustand and Sante'
---

I've never used Redux before. That's because I really disliked all the verbose boilerplate code. Instead, a long time ago, I used to wrap Context to suit my needs and use it that way.

Since libraries like React Query and SWR started becoming popular, I mainly used SWR. As a result, I also leveraged SWR for managing not just server state, but local state when needed. SWR is primarily designed for handling server state—data fetched from APIs, with built-in features for caching, synchronization, and error handling. However, many developers have adopted it for broader state management needs, sometimes even using their caching and mutation mechanisms to manage local (client-side) state, especially when that state is closely tied to server data or needs to be shared across components.

Personally, I used it in the following way.

```tsx
import useSWR, { MutatorCallback, mutate } from 'swr';

type Store = {
  name: string;
  email: string;
  hobbies: string[];
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
    return mutate(key, newValue);
  };

  return { useStore, dispatch };
};

const { useStore, dispatch } = createStore();

export { useStore as default, dispatch };
```

This worked quite well, but it had one drawback. It didn’t support selectors, and it was also tricky to implement them. So sometimes code look ugly like this.

```tsx
const Comp = () => {
  const { data: user, dispatch: dispatchUser } = useStore('user');
  const { data: score, dispatch: dispatchScore } = useStore('score');
  const { data: followers, dispatch: dispatchFollowers } = useStore('followers');

  return (
    <div>
      ...
      ...
    </div>
  )
};
```

So I started use [Zustand](https://github.com/pmndrs/zustand) separately for managing local state. However, after using it for a while, I started to have a few complaints about it as well(It's totally my personal preference and opinion. I know that Zustand is a really good and that many people find it useful.). For instance, set functions are stored together with the state object, or in order to avoid the 'Maximum update depth exceeded' error, I had to repeatedly nest useShallow every time I used it.

Then I thought, why don't I just create a state management that suits my personal preferences?

Here are some requirements that I wanted:
- Want to reference multiple states simply by listing their keys, without needing additional selectors.
- Want to be able to dispatch values from anywhere, even outside of React components, without having to reference the store.
- Wnat to be able to check values easily whenever needed, without using a hook like useStore.

As a result of these considerations, I developed a solution called [Sante](https://github.com/trainto/sante) and published it on npm. ([https://www.npmjs.com/package/@trainto/sante](https://www.npmjs.com/package/@trainto/sante)) And also I applied it to this site first.

Sante (상태) means state in Korean.

A simple usage example is as follows.
```tsx
import { createSante } from '@trainto/sante';

const initial = {
  name: '';
  hobbies: [] as string[];
  tels: {
    mobile: '';
    work: '';
  }
};

const { useSante, dispatch } = createSante(initial);

const dispatchMobile = (mobile: string) => {
  dispatch((prev) => {
    return { ...prev, mobile };
  });
};

export { useSaten, disaptch, dispatchMobile };

// in a component
const Comp = () => {
  // To reference partial of states, we can just list the keys
  const { name, tels } = useSante(['name, tels']);

  const onMobileChanged = () => {
    // dispatch can be used in anywhere, even not in React component
    dispatch('tels', (prev) => ({ ...prev, mobile: newMobileNumber }));
  };

  return (
    <div>...</div>
  )
};
```

It doesn’t support complex or advanced features, but when combined with SWR, it’s the perfect solution for my needs when it comes to managing simple local state.
