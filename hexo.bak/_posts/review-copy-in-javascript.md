---
layout: post
title:  "回顾一下 JavaScript 中的深浅拷贝以及内存管理"
date:   2018-01-13 09:05
categories: javascript
---

![cover](/images/review-copy-in-javascript.png)

最近在组内 code review 中遇到了一处业务代码中需要深拷贝的地方，同学简单地通过 `JSON.parse(JSON.stringify(target))` 来进行，在讨论中发现了一些好玩的东西，特此来回顾一下。

<!--more-->

### 基本类型 VS 引用类型，值传递 VS 引用传递

首先回顾一下高程中的基本概念。

ECMAScript 变量包含两种数据类型的值：基本类型值与引用类型值。基本类型指的是简单的数据段，如 `Undefined`、`Null`、`Boolean`、`Number` 和 `String`（ES6 中出现的 `Symbol` 也属于基本类型）。引用类型指的是可能由多个值构成的对象。

基本类型是按值访问的，**可以操作保存在变量中的实际的值**。

引用类型的值是保存在内存中的对象，**JavaScript 不允许直接访问内存中的位置**，因此我们在操作对象时，是在操作对象的引用而不是实际的对象。

然而访问变量有按值和按引用两种方式，而 **参数只能按值传递**。在向参数传递引用类型的值时，会把值在内存中的地址复制给另一个局部变量。

### 深入内存

以上虽然不难理解，但是不深层挖掘一下还是很难完全记住。所以来看看内存中到底发生了什么吧。

先看看内存的生命周期：

![life](https://raw.githubusercontent.com/dt-fe/weekly/master/assets/29/1.jpg)

即 内存分配 => 内存读写 => 内存释放

JavaScript 在定义变量时即完成了内存分配。**运算符= 就是创建或修改变量在内存中的指向。**

```javascript
var a = { b: 1 }; // a 为引用类型，给 a 分配内存 { b: 1 }， a 存储的即为 { b: 1 } 的地址
var c = a; // 给 c 分配内存 指向 a 存储的地址，即 { b: 1 } 的地址
a = 2; // 修改 a 的内存指向到 2
console.log(c); // c 存储的仍为 { b: 1 } 的地址，因此结果为 { b: 1 }
```
前两行代码在内存中的分布为：

变量 | 内存
:--: | :--:
a | { b: 1 } 地址
c |  { b: 1 } 地址

第三行修改了内存指向：

变量 | 内存
:--: | :--:
a | 2

变量 c 仍然指向 { b: 1 } 的地址。

再看一个例子：

```javascript
var m = { a: 10, b: 20 }
var n = m; // 复制引用类型的值，使 n 和 m 指向同一地址
n.a = 15;
console.log(m.a);
```
还是先看前两行：

变量 | 内存
:--: | :--:
m | { a: 10, b: 20 } 地址
n | { a: 10, b: 20 } 地址

第三行通过 n.a 修改了变量，但 m 和 n 仍然指向同一地址不变，因此 m.a 的值也为 15

对于参数传递过程中的内存变化不是本文重点，可以观摩 [JavaScript深入之参数按值传递](https://github.com/mqyqingfeng/Blog/issues/10) 下面精彩的评论来学习。

有很多博文还针对 JavaScript 的内存空间，栈内存与堆内存进行了讲解，但是对于这方面实在没有经验，没什么鉴别能力，暂时先不说了。

###  JavaScript 中的深浅拷贝

回顾完以上知识点后，可以发现对于对象的拷贝，其实分为两种情况（这里，将被拷贝对象称为源对象）：

- shallow clone 浅拷贝：如果对象中某个属性值是对象的话，浅拷贝的只是内存指针，当内存中的值发生变化后，拷贝对象与源对象与都会发生改变。
- deep clone 深拷贝：拷贝对象与源对象是完全单独的对象，没有属性值是指向同一内存指针的，源对象发生任何修改都不会引起拷贝对象发生变化。

需要注意一点，ES6 中 Object 的新方法 `Object.assign` 执行的就是浅拷贝，Stack Overflow 上有一个高票回答误将其答为深拷贝，我就踩了坑，避免加深错误印象，这里不放链接了。

ES6 中的 Object `rest/spread destructuring` 也是浅拷贝：

```javascript
const existing = { a: 1, b: 2, c: 3 };
const { ...clone } = existing;
```

对于深拷贝，可想而知，需要对嵌套对象进行递归遍历，但是真正实现 deep clone 没有想象的简单，主要原因在于 deep clone 的定义并不统一，以及 edge case 非常多，包含 DOM/BOM 对象如何处理，函数如何处理，原型链如何处理等问题。但是希望 “做出修改不影响其它引用” 确实是一个常见场景。

最简单的方法就是开头提到的 `JSON.parse(JSON.stringify(target))`。缺点在于无法处理 Date、Function 等类型的属性值。

因此在业务中推荐使用 lodash 的 [_.cloneDeep](https://lodash.com/docs/4.17.4#cloneDeep) 实现深拷贝，简洁可靠。

实际上，在 [immutable.js](http://facebook.github.io/immutable-js/) 出现后，实现数据结构的持久化有了更优雅的方式。

### 希望之光 Immutable

![Immutable](https://camo.githubusercontent.com/4c698f4cef2ae6b69873aa7de91f6d10f28162e1/687474703a2f2f696d672e616c6963646e2e636f6d2f7470732f69312f544231796b395f4b585858585862565846585845745848387058582d3930302d3334322e706e67)

JavaScript 中的对象一般都是可变的（mutable），虽然节省了内存，却给复杂的大型应用造成很多隐患。Immutable Data 为一旦创建，就不能再被修改的数据。通过 **Persistent Data Structure**（持久化数据结构）使得在使用旧数据创建新数据时，也保证了旧数据同时可用且不变。

前面所述的 deep clone 方法是把所有节点都复制一遍，性能损耗非常大。Immutable 使用了 **Structural Sharing**（结构共享），性能提升很多。

通过 immutable.js 实现 deep clone:

```javascript
var defaultConfig = Immutable.fromJS({});
var config = defaultConfig.merge(initConfig); // defaultConfig不会改变，返回新值给 config
var config = defaultConfig.mergeDeep(initConfig); // 深层merge
```

immutable.js 提供了7种不可变的数据结构：List, Stack, Map, OrderedMap, Set, OrderedSet, Record。

虽然 immutable.js 通常与 facebook 同厂出品的 React 一起使用，但是它其实是一个完全独立的库，无论基于什么框架都可以使用。说它是希望之光并没有言过其实。更多内容可以查看 [Immutable 详解及 React 中实践](https://github.com/camsong/blog/issues/3)。




