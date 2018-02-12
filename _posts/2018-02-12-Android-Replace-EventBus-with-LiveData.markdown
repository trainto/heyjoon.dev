---
layout: post
title: "Android - Replace EventBus with LiveData"
tags:
- android
- livedata
- eventbus
- kotlin
---
Google announced a new set of [architecture libraries](https://developer.android.com/topic/libraries/architecture/index.html). One of the new compoenents is [LiveData](https://developer.android.com/topic/libraries/architecture/livedata.html), which  can be used to manage propagating data to the views, while respecting the view's lifecycles. It means you don't have to care about view's lifecycles anymore.

Using this LiveData, an event bus can be implemented without any 3rd party libraries like [Otto](http://square.github.io/otto/). It also can be achieved using Rx, but with Rx, it can easily lead to memory leaks unless subscriptions managed carefully. With LiveData, we don't have to worry about memory leaks or view's lifecycles.

Let's start with implementation. (Kotlin will be used)

To use LiveData in your application, dependencies should be applied to your gradle configuration.

~~~groovy
// This includes LiveDdata and ViewModel
// If you want to add just LiveData, then use 
// "android.arch.lifecycle:livedata:x.x.x"
implementation "android.arch.lifecycle:extensions:1.1.0"
~~~

Ok, everything's set to start.

We need a class holds livedata(event) first.

~~~kotlin
object EventProvider {

    private val liveDataEvent = MutableLiveData<Event>()

    fun post(event: Any) {
        this.liveDataEvent.postValue(Event(event))
    }

    fun getEventLiveData(): MutableLiveData<Event> {
        return liveDataEvent
    }


    class Event(private val value:Any) {
        private var isConsumed = false

        fun setConsumed() {
            isConsumed = true
        }

        fun isConsumed(): Boolean {
            return isConsumed
        }

        fun getValue(): Any {
            return this.value
        }
    }
}
~~~

This class is singleton and holds MutalbeLiveData<Event>. The Event class's value field has Any type so that any type of data can be sent through this EvnetProvider. And Event can be submmited through post function. Also note that the Event class has isConsumed field. This is due to the behaviour of LiveData which it sends out when new observer is registered. This is totally fine if it is for propagating values, but here LiveData is used for Event Bus, so we don't want to receive events every time activities created and registered.

Ok, now we prepared event bus. Now let's subscribe this event bus from the view(activity).

~~~kotlin
abstract class BaseActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        EventProvider.getEventLiveData().observe(this, Observer {
            it?.let { 
                if (!it.isConsumed()) handleEventBus(it.getValue())
                it.setConsumed()
            }
        })
    }
    
    protected fun handleEventBus(value: Any) {
        when (value) {
            is String -> Log.d("Event", value)
        }
    }
}
~~~

I mentioned that with LiveData, we don't have to care about view's lifecycles. To take this advantage, activity should extend android.support.vy.app.AppCompatActivity.(For fragment, it should extends android.support.v4.app.Fragment) Because these support libraries are already integrated with LifecycleOwners.

This BaseActivity subscribes the event bus through call observe(LifecyclerOwner, Observer) of the LiveData inside of EventProvider on its onCreate() lifecycle. When event occurred, Observer checks if this event consumed before, if it's not, then call handleEventBus function. 

Now you can create activities extends this BaseActivity, and override  the handleEventBus to make the activity has its own behaviour to the specific event.