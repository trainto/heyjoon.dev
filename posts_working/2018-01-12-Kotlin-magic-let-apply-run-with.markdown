---
layout: post
title: "Kotlin - Kotlin's magic with let, apply, run and with"
tags:
- kotlin
- run
- apply
- run
- with
---
Kotlin's [Standard.kt](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/src/kotlin/util/Standard.kt) provides some higher-order functions implementing idiomatic patterns like let, apply, run and with.

With the help of these functions, your code can be more simple and elegant.

The only challenge of using these functions(let, apply, run and with) is that it feels they are very much similar.

Let's go through how to handle this Kotlin's magic.

## let
let() passes the object, which calls it, to the block, and returns the result of the block.

<br/>

~~~kotlin
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
~~~

<br />

