---
title: 'Javascript(ES6) - Map and Set'
date: '2018-05-03'
---

Before ES6, when we needed Map(keys, values) or Set like any other languages provides, it is a quite pain point. Because javascript does not provide Map or Set, we had to stick to object. However using objects for these purpose has many drawbacks.

ES6 brings us new data structures, Map and Set. So we don't have be struggling to implement Map and Set using objects.

## Map

```javascript
// Creating a map
const age = new Map();

// Assgin entries by using set() method
age.set('Tom', 30);
age.set('Jessica', 26);
age.set('Jone', 18);

// set() method can be chainable
age.set('Abby', 15).set('Ziva', 29);

// This is Javascript, keys and values don't have to be the same types.
age.set(0, 'what?');
```

<br>

Array of arryas can be passed to the constructor to initialize.

```javascript
const price = new Map([
  ['HHKB', 300],
  ['RealForce', 280]
]);
```

<br>

To search keys and get values:

```javascript
const age = new Map();
age
  .set('Tom', 30)
  .set('Jessica', 26)
  .set('Jone', 18);

age.has('Tom'); // True
age.get('Tom'); // 30

age.get('Joon'); // undefined

// set() on a key already in the map, the value will be replaced
age.set('Tom', 50);
age.get('Tom'); // 50
```

<br>

Map can be iterable by for...of loop

```javascript
// keys can be iterable by calling keys() method
for (let k of age.keys()) {
  console.log(k);
}

// values can be iterable by calling values() method
for (let v of age.keys()) {
  console.log(v);
}

// key and value pair can be iterable by calling entries() method
for (let pair of age.entries()) {
  console.log(`${pair[0]} : ${pair[1]}`);
}
```

The entries() method is the default iterable for a Map, so we can omit it.

For the last, deleting and clearing like below:

```javascript
const age = new Map();
age
  .set('Tom', 30)
  .set('Jessica', 26)
  .set('Jone', 18);

age.size; // 3
age.delete('Tom');
age.size; // 2

age.clear();
age.size; // 0
```

<br>

## WeakMap

A WeakMap has a few different characteristics to Map.

- Keys have to be objects.
- Cannot be cleared or iterated.
- Keys can be garbege-collected.

When the object in a WeakMap does not have any other references to it, it can be garbege-collected. A class in Javascript does not provide private keyword like any other languages(Java, C++, etc.), but using the WeakMap, we can make member invisible.

```javascript
const Engineer = (function() {
  const skills = new WeakMap();

  return class {
    setSkill(skill) {
      skills.set(this, skill);
    }

    getSkill() {
      return skills.get(this);
    }
  };
})();

const e1 = new Engineer();
const e2 = new Engineer();

e1.setSkill('java');
e2.setSkill('kotlin');

e2.getSkill(); // 'kotlin'
```

<br>

## Set

A set is a collection of data, does not allow duplication of data.

```javascript
const numbers = new Set();
numbers.add(1);
numbers.add(2);
numbers.add(3);

numbers.size; // 3

// 1 is already in the set, nothing happens
numbers.add(1);

numbers.size; // 3

// delete() for removing data
numbers.delete(3);

numbers.size; // 2
```

<br>

There is another data structure introduced by ES6, which is called WeakSet. It is pretty much same with WeakMap except it is not Map, it is Set.

We have Map and Set on our hands with ES6. Do not create objects anymore to pair keys and values, just consider using Map. And sometimes Set is also very useful data structure.
