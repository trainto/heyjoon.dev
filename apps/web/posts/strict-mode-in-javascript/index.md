---
title: 'Strict mode in Javascript'
date: '2016-03-24'
---

In strict mode, javascript behaves more safely and logically, and it will gives you more warnings.

To enable strict mode, you can just put the below code.

```javascript
'use strict';

// To apply strict mode to each function,
function bar() {
    'use strict';
    ....
    ....
}
```

If the engine of javascript does not support ECMAScript 5, then it will be treated as just string.

### Variable must be declared

In strict mode, every variable must be declared explicitly. If you try to assign value to variable which is not declared, an exception(ReferenceError) will be given.

```javascript
function foo() {
  'use strict';
  value = 'hello';
}
foo(); // ReferenceError: value is not defined
```

### Function can not be declared in blocks

Function must be declared in global scope or in another function, not in blocks.

```javascript
function foo() {
    'use strict';
    {
        function bar() {    // SyntaxError
            ....
            ....
        }
    }
}
```

For workaround, function can be declared in blocks like this,

```javascript
function foo() {
    'use strict';
    {
        var bar = function() {
            ...
        };
    }
}
```

### Arguments

The properties arguments.callee and arguments.caller have been eliminated. And also 'arguments' can not be used for variable name(SyntaxError will be given).

### this

If it's not in strict mode, 'this' in function(not method) will be global object(like 'window' in browser). However in strict mode 'this' is undefined.

```javascript
function foo() {
  this === window; // true
}

function bar() {
  'use strict';
  this === undefined; // true
}
```

### Etc.

- No more 'with': 'with' statement cannot be used anymore.
- No more octal numbers: SyntaxError will be given for octal literal.

For more detail, [ECMA-262-5 in detail. Chapter 2. Strict Mode](http://dmitrysoshnikov.com/ecmascript/es5-chapter-2-strict-mode/) is worth to read.
