---
layout: post
title:  "有关闭包，作用域，this对象"
date:   2016-01-02 16:51
categories: front-end javascript
---

### 首先看一下维基百科中，闭包的概念：

> 在计算机科学中，闭包（也称词法闭包或函数闭包）是指一个函数或函数的引用，与一个引用环境绑定在一起。这个引用环境是一个存储该函数每个非局部变量（也叫自由变量）的表。
> 闭包，不同于一般的函数，它允许一个函数在立即词法作用域外调用时，仍可访问非本地变量。

#### 在创建函数和调用函数时，都发生了什么

- 创建函数时
 1. 创建了预先包含全局变量对象的作用域链
 2. 该作用域链保存在内部[[scope]]属性中
- 调用函数时
 1. 创建执行环境
 2. 复制函数[[scope]]属性中的对象构建作用域链
 3. 用arguments与其它形参初始化函数的活动对象

要理解这句话：**JavaScript中的函数运行在它们被定义的作用域里，而不是它们被执行的作用域里。**

#### 再用计数器函数来看一个简单的闭包例子

```
function createCounter() {
  var counter = 0;
  function increment() {
    counter = counter + 1;
    console.log("Number of events: " + counter);
  }
  return increment;
}
var counter1 = createCounter();
var counter2 = createCounter();

counter1(); // Number of events: 1
counter1(); // Number of events: 2
counter2(); // Number of events: 1
counter1(); // Number of events: 3
```

这个函数实现了分别计数的功能。
在createCounter()的最后一句：`return increment;`我们返回了该局部函数。在这里并不是返回了increment()函数的调用结果，而是返回了该结果本身。
因此，在使用`var counter1 = createCounter();`时，实际上，**我们生成了一个新的函数**。
每个生成的函数，都会保持在 createCounter() 所创建的 counter 变量的引用。在某种意义上，被返回的函数记住了它所被创建时的环境。
**内部变量 counter 都是独立存在于每个作用域！**例如，如果我们创建两个计数器，那么它们都会在闭包体内会分配一个新的 counter 变量。

#### 闭包的内存

后台的每个执行环境都有一个表示变量的对象——变量对象。

- 全局环境的变量对象始终存在
- 像 createCounter()函数这样的局部变量，只在函数执行的过程中存在
- 作用域链本质上是一个指向变量对象的指针列表，只引用但不包含变量对象
- *一般来讲*当函数执行完毕后，局部活动对象就会被销毁，内存中仅保存全局执行环境的变量对象。

*但闭包的情况有所不同：*
内部定义的函数会把外部函数的活动对象添加到它的作用域链中。
当上述例子中createCounter()执行完毕后，它的活动对象也不会销毁，因为**匿名函数的作用域链仍然在引用这个活动对象**。也就是说这个函数执行完毕后，虽然其执行环境的作用域链会被销毁，但它的活动对象仍然留在内存中。只有当匿名函数被销毁后，createCounter()的活动对象才会被销毁。
一个简单的构造闭包以及释放内存的例子：

```
function outer () {
	var name = 'foo';
	return function () {
		console.log(name);
	}
}
var inner = outer();
inner();  // foo
inner = null;  // 解除对 outer 内部的匿名函数的引用，以便释放内存
```

并且，闭包在IE低版本中会导致特殊的问题。如果闭包作用域链中保存着一个HTML元素，那么该元素将无法销毁。
由于闭包会携带包含它的函数的作用域，因此会比其它函数占用更多的内存，过度使用闭包可能会导致内存占用过多，所以要慎重使用闭包。

#### 闭包的陷阱：循环闭包

**请牢记一点：闭包只能取得包含函数中任何变量的最后一个值。**
因此，下面这个例子只会返回同一个值。

```
function foo(){
    var result = new Array();
    for(var i=0; i<10; i++){
    result[i] = function(){
    return i;
    }
    }
    return result;
}
```

表面上看，每个函数都会返回自己的索引值，但实际上，每个函数都会返回10.因为事件处理器函数绑定了变量i本身，foo()执行完毕后，每个函数内的i的值都是10.
应改为：

```
function foo(){
var result = new Array();
for(var i=0; i<10; i++){
    result[i] = function(num){
    return function(){
    return num
    }
    }(i);
}
return result;
}
```

在这里，我们定义了一个匿名函数，把匿名函数的结果赋值给数组。
匿名函数的参数num就是最终函数要返回的值，在调用每个匿名函数时，我们都把当前i的值赋给了num，匿名函数内部的闭包又可以访问到num，因此result数组里的每个函数都有自己的num变量的副本，就可以返回不同的值了。

换个应用场景，如果想循环若干个节点，在这个for循环里绑定onclick，使每个节点被点击时都会打印其对应的索引值。
代码简化如下：

```
var arr = new Array();
for (var i = 0; i < 50; i++) {
    (function () {
        arr[i] = document.createElement('i');
        arr[i].index = i;
        arr[i].onclick = function () {
            console.log(this.index);
        };
    })(i);
};
```

`arr[i].index = i;`这一句很关键，如果省略的话，onclick函数执行时作用域里没有i这个变量，只能一直向上查找，最后打印出50

#### 闭包中的this对象

**匿名函数的执行环境具有全局性，因此其this对象通常指向window**
```
var name = "The Window";
　　var object = {
　　　　name : "My Object",
　　　　getNameFunc : function(){
　　　　　　return function(){
　　　　　　　　return this.name;
　　　　　　};
　　　　}
　　};
　　alert(object.getNameFunc()()); // “The Window”
```
内部函数在搜索`this`和`arguments`这两个变量时，只会搜索到其活动对象为止，永远不可能直接访问外部函数中的这两个变量。

### 关于this关键字

在《JavaScripts语言精粹》中，把this的出现场景分为四种：

> 有对象就指向调用对象

> 没调用对象就指向全局对象

> 用new构造就指向新对象

> 通过 apply 或 call 或 bind 来改变 this 的所指。

#### 1.全局的this===window

#### 2.作为对象方法的函数的this指向这个上级对象

```
var o ={
    prop:37;
    f:function(){return this.prop}
    }
console.log(o.f()); //37
```

#### 3.构造函数调用，this指向其生成的新对象

```
window. x = 2;
　　function test(m){
　　　　this.x = m;
　　}
　　var o = new test(5);
　　alert(x); //5
```

#### 4.apply 和 call 调用以及 bind 绑定

全局函数apply和call可以用来改变函数中this的指向，如下：

```
// 定义一个全局函数
   function foo() {
       console.log(this.fruit);
   }
 // 定义一个全局变量
   var fruit = "apple";
   // 自定义一个对象
   var pack = {
       fruit: "orange"
   };
    // 等价于window.foo();
   foo.apply(window);  // "apple",此时this等于window
   // 此时foo中的this === pack
   foo.apply(pack);    // "orange"
```