---
title: "Kotlin - Kotlin's magic with let, apply, run and with"
date: '2018-02-01'
---

Kotlin's [Standard.kt](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/src/kotlin/util/Standard.kt) provides some higher-order functions implementing idiomatic patterns like let, apply, run and with.

With the help of these functions, your code can be more simple and elegant.

The only challenge of using these functions(let, apply, run and with) is that it feels they are very much similar.

Let's go through how to handle this Kotlin's magic.

## let

```kotlin
/**
 * Calls the specified function [block] with `this` value as its argument and returns its result.
 */
@kotlin.internal.InlineOnly
public inline fun <T, R> T.let(block: (T) -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return block(this)
}
```

let() passes the object, which calls it, to the block, and returns the result of the block.

```kotlin
val student = Student("David", 20)
val result = student.let { it.age * 2 }

println(result) // 40
```

This is a very simple example, but consider using let with safe calls(?.). You don't have to bother with if (obj != null) {....} anymore. Check below.

```kotlin
// without safe calls and let
var strRes: String? = null
if (context != null) {
    strRes = context.getString(R.string.app_name)
}

// with safe calls and let
var strRes:String? = context?.let { it.getString(R.string.app_name) }
```

This is quite powerful, isn't it?

<br/>

## apply

```kotlin
/**
 * Calls the specified function [block] with `this` value as its receiver and returns `this` value.
 */
@kotlin.internal.InlineOnly
public inline fun <T> T.apply(block: T.() -> Unit): T {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    block()
    return this
}
```

apply() passes the object, which calls it, to the block's receiver, and returns the object itself.

Let's check out how apply() can be used.

```kotlin
class Student(val name: String, val age: Int) {
    var major: String? = null
    var mobileNumber: String? = null
    var address: String? = null
}

val newStudent = Student("Joon", 20).apply {
    major = "Computer Science"
    mobileNumber = "+82-10-1111-1111"
    address = "Seoul"
}
```

With apply, new Student instance initialized in a convenient way.

<br />

## run

```kotlin
/**
 * Calls the specified function [block] and returns its result.
 */
@kotlin.internal.InlineOnly
public inline fun <R> run(block: () -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return block()
}

/**
 * Calls the specified function [block] with `this` value as its receiver and returns its result.
 */
@kotlin.internal.InlineOnly
public inline fun <T, R> T.run(block: T.() -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return block()
}
```

There are 2 types of run() function.

Using run() independently without object, it will be treated like anonymous function without parameters. Just like any other functions, it can return nothing, or return something.

When run() called from objects, the object will be passed to the block, and returns result of the block.

Maybe it is confused with apply(), but remember that they return different type.(apply returns an object which it is called, and run returns the result of the block.)

```kotlin
class Student(val name: String, val age: Int) {
    var major: String? = null
    var mobileNumber: String? = null
    var address: String? = null
}

val newStudent = Student("Joon", 20).apply {
    major = "Computer Science"
    mobileNumber = "+82-10-1111-1111"
    address = "Seoul"
}

val homework = newStudent.run {
    if (major === "Computer Science") {
        "Implementing LinkedList"
    } else {
        "No homework!!"
    }
}

println(homework) // "Implementing LinkedList"
```

<br/>

## with

```kotlin
/**
 * Calls the specified function [block] with the given [receiver] as its receiver and returns its result.
 */
@kotlin.internal.InlineOnly
public inline fun <T, R> with(receiver: T, block: T.() -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return receiver.block()
}
```

with() passes its parameter to the block as a receiver, and returns the result of the block.

Actually with() is almost same with run(), except where the object passed to the block is. And run() can be used with safe calls, but with() can't.

```kotlin
class Student(val name: String, val age: Int) {
    var major: String? = null
    var mobileNumber: String? = null
    var address: String? = null
}

val newStudent = Student("Joon", 20).apply {
    major = "Computer Science"
    mobileNumber = "+82-10-1111-1111"
    address = "Seoul"
}

val homework = with(newStudent) {
    if (major === "Computer Science") {
        "Implementing LinkedList"
    } else {
        "No homework!!"
    }
}
```

<br/>

There are another useful funtions in Standard.kt like also, takeIf, takeUnless and repeat. Refer to Standard.kt, and examine them with simple code. I believe it will make your kotlin code more beautiful.
