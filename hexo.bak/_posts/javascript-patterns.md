---
layout: post
title:  "Before learning the functional programming and design patterns"
date:   2016-11-17 21:15
categories: front-end javascript
---

![cover](images/JavaScript-for-Kids.png)

## 基础知识

### OOP In JavaScript

#### Duck Typing 鸭子类型

JavaScript 是一门动态类型语言，与静态类型语言相比，在进行变量赋值时并不需要考虑它的类型。在动态类型语言的面向对象设计中， `鸭子类型` 的概念非常重要：

> [鸭子类型 (duck typing)](https://zh.wikipedia.org/wiki/%E9%B8%AD%E5%AD%90%E7%B1%BB%E5%9E%8B) 的通俗说法是““当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。”” 鸭子类型指导我们只关注对象的行为，而不专注对象本身，即关注 HAS-A,而不是IS-A。

#### 多态
多态的含义是“同一操作作用于不同对象上面，可以产生不同的解释和执行结果”，背后的思想是把“不变的事物”与“可能改变的事物”分离开来，把不变的部分隔离出来，把可变的部分封装起来，使得代码变得可扩展，修改代码也变得更加安全。 **不必再向对象询问“你是什么类型”再根据得到的答案调用对象的某个行为，直接调用就是了** 。JavaScript 的多态性与生俱来，它在编译时没有类型检查的过程。

<!--more-->

多态最根本的作用在于通过 **把过程化的条件分支语句转化为对象的多态性** 。将行为分布在各个对象中，由对象负责自己的行为，避免代码中充斥着错综复杂的if-else判断。

一个实际开发中的例子，“引用了不同地图应用的API，使其在页面中渲染地图”

```javascript
var googleMap = {
  show: function () {
    console.log('开始渲染google地图')
  }
}

var baiduMap = {
  show: function () {
    console.log('开始渲染baidu地图')
  }
}

// 不具有多态性的代码

var renderMap = function (type) {
  if (type === 'google') {
    googleMap.show()
  } else if (type === 'baidu') {
    baiduMap.show()
  }
}

renderMap('google')
renderMap('baidu')

// 具有多态性的代码
var renderMap = function (map) {
  if (map.show instanceof Function) {
    map.show()
  }
}
renderMap(googleMap)
renderMap(googleMap)
```

#### 封装

封装为的是使信息隐藏，使得对象内部的变化对其它对象是不可见的。

在 JavaScript 中依赖变量的作用域来实现封装特性 ，以及 ES6 提供的新的变量声明命令 `let` 和 新的数据类型 `Symbol`:

```javascript
var myObject = (function (){
  var _name = 'encapsulation'
  return {
    getName: function () {
      return _name
    }
  }
})()

console.log(myObject._name) //undefined
console.log(myObject.getName()) // encapsulation
```

从 [在 JavaScript 中依赖变量的作用域来实现封装特性](http://efe.baidu.com/blog/javascript-private-implement/) 可以发现， `Symbol + 类WeakMap 的整合方案` 是一个较好的实现方式。

未完待续
