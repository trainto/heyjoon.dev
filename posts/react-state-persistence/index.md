---
title: 'React - custom hook for persisting state (usePersistedState)'
date: '2021-04-07'
---

From time to time, we need to preserve the state in our React app. This post will show you how to acheive it using just simple React custom hook.

Let's start with the code first. (Typescript)


```typescript
import React, { useCallback, useEffect, useState } from 'react';

export type PersistType = 'local' | 'session'

const persist = (key: string, value: unknown, type: PersistType = 'local') => {
  const storage = type === 'session' ? sessionStorage : localStorage;
  if (value === undefined) {
    const loaded = storage.getItem(key);
    if (loaded) {
      return JSON.parse(loaded);
    }

    return loaded;
  }

  storage.setItem(key, JSON.stringify(value));
};

const usePersistedState = <S extends unknown>(
  value: S,
  key: string,
  type: PersistType = 'local'
): [S, (newValue: S) => void] => {
  const [state, setState] = useState(value);

  useEffect(() => {
    const saved = persist(key, undefined, type);
    if (saved !== null) {
      setState(saved);
    }
  }, [key, type]);

  const setPersistedState = useCallback(
    (newValue: React.SetStateAction<S>) => {
      setState(newValue);
      persist(key, newValue, type);
    },
    [key, type]
  );

  return [state, setPersistedState];
};

export default usePersistedState;
```

### Helper function to save/load data from storage
First a function called *`persist`* created. This function takes 3 parameters like *key*, *value* and *type*(sessionStorage or localStorage). If given *value* parameter is undefined, it will load saved data using given key, and returns object parsed.

### Custom hook
Next a custom hook called *`useStatedPersist`* defined. In this custom hook, just common React state will be declared, and *useEffect* hook will fetch the data saved in local storage or session storage depends on the given *type* parameter.

And *setPersistedState* function, which is wrapped by *useCallback*, is for changing state and persisting from components using this custom hook.

Finally this custom hook will return [state, setPersistedState].

### Example

```typescript
import React, { useState } from 'react';
import usePersistedState from 'somewhere usePersistedState defined';

const Name = () => {
  // You can use it just like normal useState just except more parameters
  const [name, setName] = usePersistedState('', 'name');
  // This state will be persisted only during the session
  const [countNameChanged, setCountNameChanged] = usePersistedState(
    0,
    'coutNameChanged',
    'session'
  );

  return (
    <div>
      <h1>Name</h1>
      <small>Test for state persistence.</small>
      <h3>Hello, {name}.</h3>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setCountNameChanged((prev) => prev + 1);
          }
        />
      </div>
    </div>
  );
};

export default Name;

```

You might think this example is a bit weired. 😅 But it will be enough to show how it works. The *name* will be stored in localStorage, and *countNameChanged* will be persisted in sessionStorage(I don't want to explain difference between localStroage and sessionStorage here).

Thanks!!
