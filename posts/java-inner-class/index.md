---
title: 'Java - Inner Class'
date: '2017-01-10'
---

Recently I'm focusing on eliminating findbugs' warnings of my current project at work, and I found a lot of this kind of warning details:

"This class is an inner class, but does not use its embedded reference to the object which created it. This reference makes the instances of the class larger, and may keep the reference to the creator object alive longer than necessary. If possible, the class should be made static."

It means simply if the inner class does not have references to outer class, consider to make it static.

**Then why??**

[Joshua Bloch](https://en.wikipedia.org/wiki/Joshua_Bloch) talks about various nested class through his book 'Effective Java 2E' - Item 22: Favor static member classes over nonstatic. You can just refer to the book, or google it(millons of pages) for the details.

Here, I'd point out why we should consider static inner class.

- If it is not a static class, it will have the outer class instance's reference. it consumes time and memory which not necessary, and blocks garbage collection of the outer class so it is kept in memory.
- Inner class cannot be allocated in memory without an instance of outer class. Because an instance of nonstatic member class requires an instance of outer class.

Thus when inner class is needed, consider static member first rather than nonstatic member.
