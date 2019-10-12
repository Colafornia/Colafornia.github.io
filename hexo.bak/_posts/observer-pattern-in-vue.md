---
layout: post
title:  "观察者模式以及在 Vue 源码中的实践"
date:   2017-03-14 18:30
categories: front-end javascript pattern
---

![vue](/images/vue-reactive.jpg)

在 ES6 把 Promise 写进语言标准前，为实现异步编程，经常会采用 **观察者模式（发布-订阅模式）** 作为替代传递回调函数的方案。

它定义了一种一对多的关系，让多个观察者订阅同一主题对象，当主题状态发生改变则立即发布，通知所有的订阅者。发布者和订阅者之间完全解耦，仅仅是共享同一自定义事件的名称。当新的订阅者出现，发布者无需做任何修改，反之亦然。

<!--more-->

## 常见的需要观察者模式的场景：

在任意一个需要登录的网站中，header，navbar，消息列表，购物车等模块的渲染，都需要登陆后拿到用户信息。但是ajax登录请求完成的时间无法确定，如果在ajax回调中调用各模块的方法来更新用户信息的话，耦合性太强，新增/修改模块的成本太高，业务模块更复杂的时候很难维护。这个时候需要的就是观察者模式。

Vue 在实现数据绑定时也采用的观察者模式来实现数据的订阅，订阅者维护每一次更新之前的数据，当数据发生变化，订阅者将执行自身设定的回调逻辑，并更新所维护数据的值。

## 实现观察者模式：

>1. 指定发布者
>2. 给发布者添加一个缓存列表，用于存放回调函数以通知订阅者
>3. 发布消息时，遍历缓存列表，触发每一个订阅者回调函数

并且除了缓存列表之外，还需要订阅，发布，取消订阅这三个方法。

```javascript
var event = {
  // 缓存列表
  clientList: [],
  // 订阅
  listen: function(key, fn){
    if (!this.clientList[key]) {
      // 订阅列表中没有这个 key 则把初始化这个 key 的队列为空
      this.clientList[key] = []
    }
    this.clientList[key].push(fn)
  },

  trigger: function () {
    var key = Array.prototype.shift.call(arguments)
    var fns = this.clientList[key]
    if (!fns || fns.length === 0) return false
    // 遍历缓存列表，挨个触发回调
    for (var i = 0, fn; fn = fns[ i++ ];){
      fn.apply(this, arguments)
    }
  },

  remove: function (key, fn) {
    var fns = this.clientList[key]
    if (!fns){
      return false;
    }
    if (!fn){
      fns && (fns.length = 0)
    } else {
      for (var l = fns.length - 1; l >=0; l--){
        var _fn = fns[l]
        if (_fn === fn){
          fns.splice(l, 1)
        }
      }
    }
  }
}
```
这就是观察者模式的一个通用实现。

在实际场景中，有可能需要多个发布者对象，需要多个类似上面 event 对象的绑定，非常麻烦，发布订阅也并没有完全解耦，需要知道这个对象的名字。因此也可以采用 **全局的 Event 对象** 来实现。
同时，也有可能为了避免命名冲突，需要 **创建命名空间** ，或者是由于为了实现可以先发布再订阅，**创建离线堆栈** 等等，可定制高级版的观察者模式。

## 采用观察者模式需要注意的问题：

- 实现观察者模式本身需要耗费内存，如果发布并不常发生，而订阅却始终存在于内存中，造成了一定程度的浪费
- 由于模块之间的联系由具体的耦合转为抽象，因此过多使用观察者模式的话，模块关系很难追溯，代码也很难维护

## Vue源码中的使用：
Vue 实现数据绑定依靠的是 **Object.defineProperty() 的自定义getter/setter** 来进行的。

```javascript
// 管理，通知订阅者
// 定义缓存列表，为外部提供 添加订阅/通知订阅者 的接口
export default class Dep{
    constructor(){
        // 缓存列表
        this.subs = []
    }
    addSub(sub){
        // 添加订阅，即向缓存列表中添加新项
        this.subs.push(sub)
    }
    notify(){
        // 通知所有的订阅者(Watcher)，触发订阅者的相应回调
        this.subs.forEach((sub) => sub.update())
    }
}
```

```javascript
// 引入订阅管理模块
import Dep from 'Dep'
// 定义订阅
export default class Watcher{
    // 接受三个参数，实例，所订阅数据，指定的回调
    constructor(vm, expOrFn, cb){
        this.vm = vm // 取到 Vue 实例，从而拿到实例上的 data
        this.cb = cb // 数据更新时触发的回调函数
        this.expOrFn = expOrFn // 被订阅的数据
        this.val = this.get() // 赋值为定义订阅时的数据，即更新前的值
    }
    // 对外暴露的接口，数据更新时发布者将调用这个接口
    update(){
        this.run()
    }
    run(){
        // 订阅数据发生变化时，更新 val ，触发回调
        // val 为当前值， this.val 为更新前的值
        const val = this.get()
        if(val !== this.val){
            this.val = val;
            this.cb.call(this.vm)
        }
    }
    get(){
        // 读取所订阅数据的最新值
        Dep.target = this
        const val = this.vm._data[this.expOrFn]
        // 指针置空
        Dep.target = null
        return val;
    }
}
```

```javascript
// 定义 Observer 数据监听器
// 引入 Dep 订阅管理模块
import Dep from 'Dep'
// 定义 Observer 类，将所监听数据遍历每一项传入到 defineReactive 以加入 get/set 方法
export default class Observer{
    constructor(value){
        this.value = value
        this.walk(value)
    }
    walk(value){
        // 遍历所监听对象、数组的每一项
        Object.keys(value).forEach(key => this.convert(key, value[key]))
    }
    convert(key, val){
        defineReactive(this.value, key, val)
    }
}
export function defineReactive(obj, key, val){
    // 创建新的订阅
    var dep = new Dep()
    // 给当前属性的值添加监听
    var chlidOb = observe(val)
    // 加上 get/set
    Object.defineProperty(obj, key, {
        // 设置为属性可遍历
        enumerable: true,
        // 属性可删除，可修改其 emumerable/writable 等属性
        configurable: true,
        get: ()=> {
            console.log('get value')
            // Dep.target 为 watcher 实例
            // 如果存在这个 watcher 则将其加入到 sub 队列
            // Watcher实例在实例化过程中，会触发当前get方法
            if(Dep.target){
                dep.addSub(Dep.target)
            }
            return val
        },
        set: (newVal) => {
            // 如果数据被修改则会触发这段 set 函数
            console.log('new value seted')
            if(val === newVal) return
            val = newVal
            // 监听新值
            chlidOb = observe(newVal)
            // 通知所有订阅者，数值被改变了
            dep.notify()
        }
    })
}
// 创建监听，在调用Observer类的外面加了层判断
export function observe(value){
    // 当值不存在，或者不是对象，就不监听了
    if(!value || typeof value !== 'object'){
        return
    }
    return new Observer(value)
}
```

在有些文章中，观察者模式与发布/订阅模式还有些差别，可以观摩这篇 [ObserverPattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript)去学习一下