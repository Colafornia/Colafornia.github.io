---
layout: post
title:  "由匿名函数展开的一系列知识点"
date:   2016-11-23 22:00
categories: front-end javascript
---

![cover](http://o7ts2uaks.bkt.clouddn.com/iife.png)

### 起因
最近在进行 [underscore.js 源码分析](https://github.com/MechanicianW/underscore-analysis)，也顺便看了些别的库的大致封装方式
underscore:

```javascript
(function() {
  var root = this;
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };
  // blabla
}());
```

<!--more-->

早期的 jQuery:

```javascript
(function( window, undefined ) {
var jQuery = (function() {console.log('hello');});
window.jQuery = window.$ = jQuery;
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
    define( "jquery", [], function () { return jQuery; } );
}
// blabla
})( window );
```

这个封装和调用方式一看就是匿名函数嘛，可是匿名函数，然后呢？
于是趁着下午比较闲翻开高程从匿名函数这个地方开始看，发现了一系列的知识点......
大概脉络是: 函数定义方式 → 匿名函数的创建 → 匿名函数自执行还是IIFE？ → IIFE 的应用

### 函数定义方式

1. 函数声明     
  ```
  function foo () {}
  ```
  **函数声明提升** ：可以把函数声明放在调用它的语句后面

2. 函数表达式
  ```
  var foo = function () {}
  ```
  也属于匿名函数

3. 使用Function构造函数
  ```
  var foo = new Function ()
  ```

### 匿名函数的创建

1. 上述 使用函数表达式创建

2. `(function (x, y) {alert(x + y)})(2, 3)`
  在第一个括号内创建匿名函数，第二个括号用于调用该匿名函数，并传入参数
   - `function (x,y) {alert(x + y)}`部分为所声明的函数
   - 然后用括号把函数声明包起来 `(function (x,y) {alert(x + y)})`
   - 最后调用此函数 `(function (x, y) {alert(x + y)})(2, 3)`

> 在这里我们也可以看到，创建匿名函数的方式有两种，第二种方式才会声明后立即执行，即不是所有的匿名函数都是可以立即执行的

### “匿名函数自执行” vs  IIFE

自执行，有的地方会写为自调用，是一个经常会听到的的概念，我们再深究一下它吧。所谓的“匿名函数自执行”指的是 `Self-executing anonymous function` ，经常与 `IIFE` 混淆， `Immediately-Invoked Function Expression` 即 **立即调用的函数表达式** ，含义上的辨析 [先戳一下中文wiki](https://zh.wikipedia.org/wiki/%E7%AB%8B%E5%8D%B3%E8%B0%83%E7%94%A8%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F) 吧。

IIFE 的具体的例子：

```
// 第一个例子
(function (x) { return x + 1;}(2)) // => 3
// 第二个例子
var result = function (x) { return x + 1; }(2); // => result 的值为3
```

把第一个例子敲到控制台中，我们可以看到这个 `()` 中的代码立即执行了，返回3。对于第二个例子，它实际上执行的是：

```
var foo = function (x) {return x + 1;}
var result = foo(2)
```

这里有一个知识点： **对于函数类对象，不论是一个现场定义的匿名函数，还是一个之前定义的有名字的函数，它们在不加括号的时候都代表了这个函数对象本身，而加了括号就代表调用这个函数，也就是这个函数 return 的对象。**

再回到匿名函数自执行与 IIFE 的辨析上，匿名函数自执行(Self-executing anonymous function)是一个不够准确的概念：

```
// 它是一个自执行的匿名函数，它必须用 arguments.callee() 来递归地调用自己
var foo = function() { arguments.callee(); };
// 它是一个立即执行的匿名函数，只是立即执行了一段 code ，并不是调用自己
(function () { /* code */ } ());
```

因此 `自执行` 意味着调用自己， `立即调用，立即执行` 强调的是定义函数的时候就直接执行了函数，与函数体内是否调用自身无关。只能说这是两个看起来有些类似的概念，但实际上所强调的内容完全不一样。IIFE 也可以调用自己，匿名函数可以立即执行。

### IIFE 的应用

立即调用的函数表达式的根本作用是 **创建一个独立的作用域**。

1. 模拟块级作用域，在ES6之前 JavaScript 是没有块级作用域的。
  在实际应用场景中，项目引用了很多不同的库 ，库与库之间是如何保证变量不被覆盖呢？

  ```javascript
  // libA.js
  (function(){
    var num = 1;
  	// blabla
  })();


  // libB.js
  (function(){
  	var num = 2;
  	// blabla
  })();
  ```

  这样的话，就如同我们在前面看到的 jquery underscore 那样，使自身作用域独立，不会互相覆盖。

2. 解决闭包的坑： **闭包只能取得包含函数中任何变量的最后一个值**
  这次改造一下《高程三》中提到的例子作为参照吧：

  ```javascript
  function test () {
    var result = new Array();
    var foo = null;
    for (var i = 0; i < 10; i++) {
  	  foo = function () {
        console.log(i)
      }
      result.push(foo)
    };
    return result
  }

  var res = test()
  for (var i =0,len = res.length; i < len; i++){
    res[i]()
  }
  // 控制台中打出来的是10个10，而不是1，2，3...
  // i 是贯穿整个作用域的，而不是给每个 foo 分配了一个 i
  // test()执行完毕后才调用 console.log() 一定是发生在for循环已循环结束后，此时i值为10
  ```

  在线例子可以戳 [JSFiddle](https://jsfiddle.net/46x5s72a/)
  这个坑该怎么处理呢？引入IIFE！下面代码是可用的，把 i 的值作为索引锁住了

  ```javascript
  // 解决思路是给每个foo函数创建一个独立的作用域
  function test () {
    var result = new Array();
    var foo = null;
    for (var i = 0; i < 10; i++) {
      // 添加一个IIFE
  	  (function(index) {
  	    foo = function() {console.log(index);};
        result.push(foo)
  	   })(i);
      };
      return result
    }

    var res = test()
    for (var i =0,len = res.length; i < len; i++){
      res[i]()
    }
  ```

  ### 参考内容
  * [汤姆大叔的博客:深入理解JavaScript系列（4）: 立即调用的函数表达式](http://www.cnblogs.com/TomXu/archive/2011/12/31/2289423.html)
  * [stackoverflow: What is the purpose of a self executing function in javascript](http://stackoverflow.com/questions/592396/what-is-the-purpose-of-a-self-executing-function-in-javascript)
  * [weizhifeng.net: JavaScript中的立即执行函数表达式](http://weizhifeng.net/immediately-invoked-function-expression.html)
