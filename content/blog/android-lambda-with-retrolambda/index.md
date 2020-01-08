---
title: 'Android - Lambda with Retrolambda'
date: '2017-03-03'
---

Since Java 8 release Java programmers can take advantages of lambda expression. However it can't be applied directly to Android development.

There are two options to use lambda expression for Android development.

- Use Jack tool-chain - [Use Java 8 Language Features](https://developer.android.com/guide/platform/j8-jack.html)
- Apply [Retrolambda](https://github.com/orfjackal/retrolambda)

Using Jack tool-chain supports more features of Java 8 than using Retrolambda, but I recommend Retrolambda here. Because Jack has a few disadvantages.

- Does not support Lint
- Does not support Instant Run
- Does not support full features for every API level

<br/>
Let's dive into lambda expression with Retrolambda.

First, add the following to your build.gradle

```groovy
buildscript {
  repositories {
    mavenCentral()
  }

  dependencies {
    classpath 'me.tatarka:gradle-retrolambda:3.5.0'
  }
}

repositories {
  mavenCentral()
}

apply plugin: 'com.android.application'
apply plugin: 'me.tatarka.retrolambda'
```

alternatively, new plugin syntax for gradle 2.1+ can be used

```groovy
plugins {
  id "me.tatarka.retrolambda" version "3.5.0"
}
```

Click gradle sync button in AndroidStudio.

Now coding with lambda expression on android is available.

```java
// Traditional
button.setOnClickListener(new View.OnClickListener() {
  @Override
  public void onClick(View v) {
    log("Clicked");
  }
});

// With lambda expression
button.setOnClickListener(v -> log("Clicked"));


// Traditional
Handler handler = new Handler(Looper.getMainLooper());
handler.post(new Runnable() {
  @Override
  public void run() {
    handlePushEvent(pushEvent);
  }
});

// With lambda expression
Handler handler = new Handler(Looper.getMainLooper());
handler.post(() -> handlePushEvent(pushEvent));
```

How simple and beautiful(?) it is!!

Not only lambda expression, but also method reference is available.

```java
button.setOnClickListener(this::printHello);

private void printHello() {
  log("Hello");
}
```
