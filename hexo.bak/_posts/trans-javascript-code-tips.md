---
layout: post
title:  "[译]JavaScript最佳实践：提高代码质量的技巧和建议"
date:   2016-03-13 16:24
categories: javascript
---

原文地址：https://www.codementor.io/javascript/tutorial/javascript-best-practices

![image](https://www.filepicker.io/api/file/e4jxgEgHRzS1zQU6aJLR)
每天学习新知识可以让我们变成一个更优秀更理性的人。作为一名开发者，持续学习也是我们工作的一部分，无论如何，这些新知识的学习过程都是积极有益的经验积累。

在这篇教程中，我会提出一些JavaScript的最佳实践，你就不会觉得学习起来很困难了。准备好了就来一起升级你的代码吧！

### 1.避免污染全局作用域

声明变量的过程中有很多有趣的地方。有的时候，你可能在不知情的情况下却声明了一个`全局变量`。在现代浏览器中，全局变量会被储存在`window`对象中，因此会有很多内容运行在其中，你不知情声明的全局变量可能会覆盖掉一些默认值。

<!--more-->

我们假设你有一个包含`<script>`标签的HTML文件（或者是其中引入了JavaScript文件）：
```
var foo = 42;
console.log(foo);
```
很明显，控制台会打印出`42`，但是如果这段代码不是执行在函数中的话，这一段执行上下文就会变成全局的。因此，这个变量`foo`也会被绑定在`window`对象上，意味着`window.foo`也是`42`。这样是很危险的，你可能覆盖掉了已经存在的全局变量。
```
function print () {
   // do something
}
print();
```
当执行`windos.print`（或者`print`）时，由于我们已经覆盖了原生的print函数，浏览器就不会弹出打印窗口了。

解决方法很简单；我们需要一个叫做`立即执行函数`的包装函数，如下：
```
// Declare an anonymous function
(function () {
   var foo = 42;
   console.log(window.foo);
   // → undefined
   console.log(foo);
   // → 42
})();
//^ and call it immediately
```
除了这种解决方法，你也可以选择把`window`和其它全局对象（如`document`）作为参数传递给函数（这样可能会提升性能）：
```
(function (global, doc) {
  global.setTimeout(function () {
     doc.body.innerHTML = "Hello!";
  }, 1000);
})(window, document);
```
因此，你要用包裹函数避免创建全局变量。注意一点，我不会在代码段中使用包裹函数，因为我们是要专注于代码本身。

Tip: [模块打包工具browserify](http://browserify.org/)是避免创建全局变量的又一种方法。它以与Node.js同样的方式使用`require`函数。

多说一点，Node.js通过函数来自动包裹你的文件。它们看起来就像这样：
```
(function (exports, require, module, __filename, __dirname) {
// ...
```
可能你觉得`require`函数也是全局的，然而它并不是。它只不过是一个函数参数。

#### Did you know?

尽管`window`对象其中包含着全局变量，它本身也是个全局变量，`window`内部指向的是它本身：

```
window.window.window
// => Window{...}
```
这是因为`window`是一个循环对象。想要创建一个循环对象的话可以参考：
```
// 创建一个对象
var foo = {};

//给对象本身赋值一个属性
foo.bar = foo;

// foo就变成了一个循环对象
foo.bar.bar.bar.bar
// → foo
```
所以你可以这样表白你对JavaScripte无限的爱了：
![circle](https://www.filepicker.io/api/file/ZMNjGIiQ52IKsseTjqno)
你就可以像这样无限扩展这个Object（直到浏览器崩溃）

### 2.使用'use strict'的好处

严格使用`use strict`！没有什么方法比把这行代码添在JavaScript里可以让你的代码更magic了。

举个例子：
```
//  糟糕的写法，会让你在不知情的情况下创建了全局变量
(function () {
   a = 42;
   console.log(a);
   // → 42
})();
console.log(a);
// → 42
```

设置严格模式，你就会得到报错信息：
```
(function () {
   "use strict";
   a = 42;
   // Error: Uncaught ReferenceError: a is not defined
})();
```
你可能想知道为什么你不能把`"use strict"`写在包裹函数外面。事实上，可以写在外面，严格模式就会在全局应用。这么什么不好的，但是要注意如果代码引入了第三方库，或是要打包到一个文件的时候，全局应用可能会造成影响。

### 3.严格等于 ===

如果你想用`==`来比较a和b的话，在JavaScript中你可能会发现它的结果有点奇怪：如果你比较的是字符串和数字，它们也会是相等的（`==`）：
```
"42" == 42
// true
```
显然，用严格等于（`===`）更好
```
"42" === 42
// false
```

### 4.用`&&`和`||`魔法

在日常工作中，你可以发现用逻辑操作符缩短你的代码

默认
```
"" || "foo"   // → "foo"

undefined || 42   // → 42

//注意一下，如果你想通过这种方式来处理0的话，你要检查它是0还是未赋值
var a = 0;
a || 42
// → 42

// 三元表达式看起来就像是一行结构的if-else语句
var b = typeof a === "number" ? a : 42;
// → 0
```
不需要用if表达式来判断布尔值，你可以简单地这样处理：
```
expr && doSomething();

// Instead of:
if (expr) {
   doSomething();
}
```
在上例中如果我们需要`doSomething()`来返回结果的话，使用逻辑操作符会看起来更带感：
```
function doSomething () {
   return { foo: "bar" };
}
var expr = true;
var res = expr && doSomething();
res && console.log(res);
// → { foo: "bar" }
```
在这个问题上你可能会有异议，但使用逻辑操作符确实是更理想的方式。可能你认为用这种方法是“丑化”代码，但那些代码压缩器却真的在这样做。

尽管代码变短了，它的可读性却依然很好。

### 5.改变变量类型

取决于实际场景，有很多改变变量类型的方法，如下是最常用的方法：
```
// anything =》 number

var foo = "42";
var myNumber = +foo; // shortcut for Number(foo)
// → 42

// Tip: 可以直接把它变成负数
var negativeFoo = -foo; // or -Number(foo)
// → -42

// object => array
// Tip: `arguments` 是一个对象但通常被用作为数组
var args = { 0: "foo", 1: "bar", length: 2 };
Array.prototype.slice.call(args)
// → [ 'foo', 'bar' ]

// Anything =》 boolean
// 两次取非可以使它变成布尔值
var t = 1;
var f = 0;
!!t
// → true
!!f
// → false

// 一次取非
!t
// → false
!f
// → true

// Anything =》 string
var foo = 42;
"" + foo // 转变为字符串的简短方法
// → "42"

foo = { hello: "world" };
JSON.stringify(foo);
// → '{ "hello":"world" }'

JSON.stringify(foo, null, 4); // 美化代码
// →
// '{
//    "hello": "world"
// }'

// 注意一点，不可以 JSON.stringify 环形结构的对象
JSON.stringify(window);
// ⚠ TypeError: JSON.stringify cannot serialize cyclic structures.
```

### 6.代码风格指南

新项目中在不同文件里应该遵循同样的代码风格，对于老项目，就沿用旧的代码风格，除非你下定决心去整体改掉陈旧代码的风格（要和同事讨论之后再决定）。只要你确定了代码风格，就要一直遵循它。

这是一些可参考的代码风格

* [Google JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml)
* [aribnb/javascript](https://github.com/airbnb/javascript)
* [my code-style](https://github.com/IonicaBizau/code-style)

### 额外提示

在其它一些JavaScript最佳实践中可以发现有一些有助于编码的工具：

- [js-beautify](https://github.com/beautify-web/js-beautify):美化代码
- [UglifyJS(2)](https://github.com/mishoo/UglifyJS2):压缩代码
- [jshint](https://github.com/jshint/jshint):检测代码中的错误
- [jscs](http://jscs.info/):可扩展的风格检测

最后一件事，好好[debug](https://www.codementor.io/learn-programming/what-to-do-when-your-website-is-broken),而不是用`console.log`

祝编码愉快！

### 参考内容
* [初学者指南：学习JavaScript的最佳方法](https://www.codementor.io/javascript/tutorial/how-to-learn-javascript-properly)
* [关于JavaScript初学者必知的十件事](https://www.codementor.io/javascript/tutorial/top-ten-things-beginners-must-know-javascript)
* [在2016年JavaScript开发者需要学习的技巧](https://www.codementor.io/learn-programming/javascript-trends-skills-developers-should-learn)
* [4种开始使用ES2015的方法](https://www.codementor.io/javascript/tutorial/4-easy-ways-to-start-using-es2015)
* [最重要的21道面试题](https://www.codementor.io/javascript/tutorial/21-essential-javascript-tech-interview-practice-questions-answers)
