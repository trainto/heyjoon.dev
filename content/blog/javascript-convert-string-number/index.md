---
title: 'Javascript - Convert String into Number'
date: '2018-05-16'
---

There are several ways to convert a String into a Number.(or vice versa)

## Simple way

```javascript
// Number to String
let t1 = 5;
t1 += '';

// String to Number
let t2 = '123';
t2 *= 1; // t2 += 0, t2 /= 1, t2 -= 0 all possible
```

This is the most simplest way.

<br>

## function Number() and String()

```javascript
// Number to String
let t1 = 5;
t1 = String(t1); // '5'

// String to Number
let t2 = '123';
t2 = Number(t2);

let t3 = '10.5';
t3 = Number(t3); // 10.5
```

<br>

## function parseInt() and parseFloat()

```javascript
let t1 = '5';
t1 = parseInt(t1);

let t2 = '10cm';
t2 = parseInt(t2); // 10

let t3 = '10.5';
t3 = parseFloat(t3); // 10.5
```

API definition of parseInt is like below.

- parseInt(string, radix)

the radix argument is an integer between 2 and 36 which represents the base in mathematical numeral systems. Have a look at below examples.

```javascript
parseInt('1101', 2); // 13
parseInt('11', 10); // 11
parseInt('11', 16); // 17
```
