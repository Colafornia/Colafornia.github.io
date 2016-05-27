---
layout: post
title:  "javascript面向对象的程序设计"
date:   2015-08-20 7:43:50
categories: front-end javascript
---
参考《JavaScript高级程序设计》第三版

阮一峰[Javascript 面向对象编程](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_encapsulation.html)

## 一.创建对象

#### 1.字面量

```
var cat1 = {

cat1.name = "kitty";

cat1.color = "white";

};

var cat2 = {

cat2.name = "greg";

cat2.color = "black";

};
```

有两个缺点，一是如果多生成几个实例，写起来就非常麻烦；二是实例与原型之间，没有任何办法，可以看出有什么联系。

#### 2.工厂模式

```
function creatCat(name,color){

var o = new Object();

0.name = name;

0.color = color;

return 0 ;

}

var cat1 = createCat("kitty",white);

var cat2 = createCat("greg",black);
```


解决了多个相似对象的问题，但没有解决对象类型识别的问题。

#### 3.构造函数模式

```
function Cat(name,color){

this.name=name;

this.color=color;

}

var cat1 = new  Cat("kitty","white");

var cat2 = new  Cat("greg","black");

alert(cat1.name); // kitty

alert(cat1.color); // white
```

即没有return调用，将属性，方法赋给了_this_对象，函数名始终以大写字母开头

任何函数只要通过new调用，就可以作为构造函数

这时cat1和cat2会自动含有一个_constructor_属性，指向它们的构造函数。

```
alert(cat1.constructor == Cat); //true
alert(cat2.constructor == Cat); //true
```

Javascript还提供了一个instanceof运算符，验证原型对象与实例对象之间的关系。

```
alert(cat1 instanceof Cat); //true
alert(cat2 instanceof Cat); //true
```

**构造函数模式的问题：**

构造函数方法很好用，但是存在一个浪费内存的问题。

请看，我们现在为Cat对象添加一个不变的属性"type"（种类），再添加一个方法eat（吃老鼠）。那么，原型对象Cat就变成了下面这样：

```
 function Cat(name,color){
   this.name = name;
   this.color = color;
   this.type = "猫科动物";
   this.eat = function(){alert("吃老鼠");};
 }
 ```

还是采用同样的方法，生成实例：

```
 var cat1 = new Cat("kitty","white");
 var cat2 = new Cat ("greg","black");
 alert(cat1.type); // 猫科动物
 cat1.eat(); // 吃老鼠
```

表面上好像没什么问题，但是实际上这样做，有一个很大的弊端。那就是对于每一个实例对象，type属性和eat()方法都是一模一样的内容，每一次生成一个实例，都必须为重复的内容，多占用一些内存。这样既不环保，也缺乏效率。
 `alert(cat1.eat == cat2.eat); //false`
能不能让type属性和eat()方法在内存中只生成一次，然后所有实例都指向那个内存地址呢？回答是可以的。

#### 3.原型模式（Prototype模式）

每个函数都有一个prototype属性，这个属性是一个指针，指向一个对象。这个对象的所有属性和方法，都会被构造函数的实例继承。

原型对象可以让所有对象实例共享它所包含的属性和方法。

我们可以把那些不变的属性和方法，直接定义在prototype对象上。

```
function Cat(name,color){

this.name = name;

this.color = color;

}

Cat.prototype.type = "猫科动物";

Cat.prototype.eat = function(){alert("吃老鼠")};
```

然后，生成实例。

```
var cat1 = new Cat("kitty","white");
var cat2 = new Cat("greg","black");
alert(cat1.type); // 猫科动物
cat1.eat(); // 吃老鼠
```

这时所有实例的type属性和eat()方法，其实都是同一个内存地址，指向prototype对象，因此就提高了运行效率。
`alert(cat1.eat == cat2.eat); //true`

**二、 Prototype模式的验证方法**

为了配合prototype属性，Javascript定义了一些辅助方法，帮助我们使用它。，

**1 isPrototypeOf()**

这个方法用来判断，某个proptotype对象和某个实例之间的关系。

```
alert(Cat.prototype.isPrototypeOf(cat1)); //true
alert(Cat.prototype.isPrototypeOf(cat2)); //true
```

**2 hasOwnProperty()**

每个实例对象都有一个hasOwnProperty()方法，用来判断某一个属性到底是本地属性，还是继承自prototype对象的属性。本地属性为true，由prototype对象继承为false

```
alert(cat1.hasOwnProperty("name")); // true
alert(cat1.hasOwnProperty("type")); // false
```

**3 in运算符**

in运算符可以用来判断，某个实例是否含有某个属性，不管是不是本地属性。

```
alert("name" in cat1); // true
alert("type" in cat1); // true
```

in运算符还可以用来遍历某个对象的所有属性。
`for(var prop in cat1) { alert("cat1["+prop+"]="+cat1[prop]); }`