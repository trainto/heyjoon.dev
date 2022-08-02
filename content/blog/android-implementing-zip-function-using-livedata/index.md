---
title: 'Android - Implementing Zip function using LiveData'
date: '2018-04-02'
description: "Let's implement zip function like Rx using LiveData"
---

The last post, [Replace EventBus with LiveData](/android-replace-eventbus-with-livedata) was introduced.

This time, Implementing Zip function(Like Rx) using LiveData will be introduced. To acheive this, MediatorLiveData, which extends LiveData, will be applied.

MediatorLiveData is a LiveData subclass, can observe other LiveData objects and react on LiveData objects' changes. Basic usage can be found [here](https://developer.android.com/reference/android/arch/lifecycle/MediatorLiveData.html).

If you're reading this post, I'm sure that you already know well the concept of Zip function of Rx. Just in case, refer this [page](http://reactivex.io/documentation/operators/zip.html) for
basic concept of Zip function.

As always, start with dependencies configuration.

```groovy
// This includes LiveDdata and ViewModel
// If you want to add just LiveData, then use
// "android.arch.lifecycle:livedata:x.x.x"
implementation "android.arch.lifecycle:extensions:1.1.1"
```

<br>
Let's assume that there is MainViewModel which calls two async retrofit calls.

```kotlin
class MainViewModel : ViewModel() {
    private val name: MutableLiveData<String> = MutableLiveData()
    private val age: MutableLiveData<Int> = MutableLiveData()

    fun getZippedLiveData(): LiveData {
        return zip2(name, age) { name: String, age: Int -> "name: $name, age: $age" }
    }

    fun start() {
        // Async calls
        // Asume there is RemoteApi class which implement Retrofit async call
        RemoteApi.getName() {
            it?.let { this.name.value = it }
        }

        RemoteApi.getAge() {
            it?.let { this.age.value = it }
        }
    }
}
```

This ViewModel calls 2 async remote calls from start(), and result(name, age) will be saved to each MutableLiveData. And View(activity) will observe zipped LiveData, and zipped LiveData will be passed to the View by calling getZippedLiveData().

The View(activity) code will look like below.

```kotlin
class MainActivity : AppCompatActivity() {
    private val vm = ViewModelProviders.of(this).get(MainViewModel::class.java)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // If both name and age are received from the remote calls,
        // then show them in the TextView
        vm.getZippedLiveData().observe(this, Observer {
            it?.let {
                textView.text = it
            }
        })

        vm.start()
    }
}
```

So far this is typical android MVVM architecture using LiveData and ViewModel. The main point is how the zipped LiveData object can be created at getZippedLiveData() function of MainViewModel.

Now let's figure out how zipped LiveData can be created.

```kotlin
fun <T1, T2, R> zip2(src1: LiveData<T1>, src2: LiveData<T2>,
                     zipper: (T1, T2) -> R): LiveData<R> {

    return MediatorLiveData<R>().apply {
        var src1Version = 0
        var src2Version = 0

        var lastSrc1: T1? = null
        var lastSrc2: T2? = null

        fun updateValueIfNeeded() {
            if (src1Version > 0 && src2Version > 0 &&
                lastSrc1 != null && lastSrc2 != null) {
                value = zipper(lastSrc1!!, lastSrc2!!)
                src1Version = 0
                src2Version = 0
            }
        }

        addSource(src1) {
            lastSrc1 = it
            src1Version++
            updateValueIfNeeded()
        }

        addSource(src2) {
            lastSrc2 = it
            src2Version++
            updateValueIfNeeded()
        }
    }
}
```

Above zip2 function takes two LiveData, src1 and src2. These are used as input source for MediatorLiveData to create. And also it takes zipper function(Imagine if this was Java... would be much more complicated!) as its last parameter, and it should describe how the data would be zipped into one object R(See getZippedLiveData() function of MainViewModel). In the updateValueIfNeeded() function, it checks version and null, and then set MediatorLiveData's value.

Simply The MediatorLiveData created issues(changing value) events only if all input source(src1, src2) are ready.

This example is very simple case, but if you edit zip2 function you like, it can be applied various case. For example src1, src2 parameters can be replaced with vararg.

Maybe you noticed this implementation does not behave exactly same with Rx's zip. In this implementation, MediatorLiveData only takes the latest pair of input source. To make exactly same with Rx's zip, input source's history should be managed in the MediatorLiveData.
