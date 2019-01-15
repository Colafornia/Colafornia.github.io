---
layout: post
title:  "装饰者模式 => AOP => ES7 decorator => React 高阶组件"
date:   2018-5-19 16:56
categories: javascript react
---

![](https://cdn-images-1.medium.com/max/1600/1*o6Q0MpSmQni2Q_sB5y9jig.png)

五月是学习的好时节啊，翻翻书继续学习一下设计模式吧。

该到`装饰者模式`了。来，学习一下。

书里的 `AOP` 是啥？学习一下。

新时代了再看看 ES7 规范的 `decorator` 吧，学习一下。。

啊还有 `React 高阶组件`的事儿呢，都学到这了，不差这一会儿。。。

<!--more-->

### 一、装饰者模式是什么

先看一下最为精确的英文维基定义：

> In object-oriented programming, the decorator pattern is a design pattern that allows behavior to be added to an individual object, either statically or dynamically, without affecting the behavior of other objects from the same class.

对于传统的 OOP 语言来说，给对象(object)添加功能通常使用继承的方式，这不仅导致了超类与子类间的强耦合，也违反了[单一职责原则](https://en.wikipedia.org/wiki/Single_responsibility_principle)。

装饰者模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责。

### 二、装饰者模式的典型应用：AOP

AOP 全称为 `Aspect-oriented programming`，即`面向切面编程`。主要适用于需要有横切逻辑的场景，比如数据上报，错误处理，鉴权，请求拦截等。

理解这个概念之后，实际操作就并不复杂。可以通过在原型上设置 `Function.prototype.before` 方法和 `Function.prototype.after` 方法，实现 `AOP 装饰函数`。

```javascript
Function.prototype.before = function(beforefn){
  var __self = this;
  return function() {
    beforefn.apply(this, arguments);
    return __self.apply(this, arguments);
   }
}

Function.prototype.after = function(afterfn){
  var __self = this;
  return function() {
    var ret = __self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
    }
};
```
这两个装饰函数都接收函数作为参数，只是所接收参数的执行顺序不同。

同理，我们也可以给 service 编写装饰函数，作为接口拦截器。如 [axios](https://github.com/axios/axios) 中的 `Interceptors`：

```javascript
// 给请求添加拦截器
axios.interceptors.request.use(function (config) {
    // 在发起请求前 do something
    return config;
  }, function (error) {
    // 处理错误
    return Promise.reject(error);
  });

// 给返回添加拦截器
axios.interceptors.response.use(function (response) {
    // 处理返回数据
    return response;
  }, function (error) {
    // 处理错误
    return Promise.reject(error);
  });
```

这样，我们就可以在拦截器中统一处理错误与数据，不再需要在每一个 Promise 中都写一遍了，也便于统一项目中的处理方式。

关于 AOP 简单介绍到这里。

### 三、ES7 Decorator

ES7 的 decorator 装饰器借鉴于 Python 的思想，由 Yehuda Katz 提出，这里有[提案的细节设计与语法糖在 ES6/ES5 中的转换](https://github.com/wycats/javascript-decorators)。

定义非常简短：

> Decorators make it possible to annotate and modify classes and properties at design time.

”装饰器可以让我们在设计时对类和类的属性进行注解和修改“

有点抽象，我们先全盘了解这些讯息再来研究到底是怎么回事。

想理解 `decorator` 的用法，离不开 [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)，ES7 也正是利用 `Object.defineProperty` 实现装饰器特性。

#### 1. 前置知识：Object.defineProperty

如果了解过 Vue 双向绑定的实现原理，对 `Object.defineProperty` 就一定不陌生。

> `Object.defineProperty(obj, prop, descriptor)`

> 可以在对象上定义新属性，或修改已有属性，并将对象返回

> 参数 `obj`：要在其上添加或修改属性的对象
>
> 参数 `prop`：属性名
>
> 参数 `descriptor`：属性描述符，可以设置属性的数据属性与访问器属性


其中 `descriptor` 可设置的属性有：

通用描述符：

- enumerable：Boolean，属性可否枚举
- configurable：Boolean，若为 false，任何尝试删除目标属性或修改属性以下特性（writable, configurable, enumerable）的行为将被无效化

数据描述符 data descriptor：

- value：属性值
- writable：Boolean，是否可写

访问器描述符 accessor descriptor：

- get： 一旦目标属性被访问就会调回此方法，并将此方法的运算结果返回用户。
- set：一旦目标属性被赋值，就会调回此方法。

（Vue 就是在 get 和 set 函数中进行了拦截，判断数据是否变化，发送通知到订阅器中，详情可参考[《观察者模式以及在 Vue 源码中的实践》](https://blog.colafornia.me/2017/03/14/observer-pattern-in-vue/)）

#### 2. ES7 Decorator 的用法

ES7 Decorator 的使用场景不少，我们先看最简单典型的一个示例：

```javascript
function readonly(target, name, descriptor) {
  descriptor.writable = false
  return descriptor
}

class Cat {
    @readonly
    say() {
        console.log('喵');
    }
}

let tom = new Cat();
tom.say = function() {
    console.log('汪');
}
tom.say()    // 喵
```

readonly 就是一个 decorator 装饰器，它通过设置修饰符的 `writable` 属性，使得被装饰的 `say()` 只读。

装饰器本身是一个函数，接受三个参数，target，name 和 descriptor。

写一个 log 装饰器来看看这仨参数都是啥：

```javascript
function log(target, name, descriptor) {
    console.log(target);
    console.log(target.hasOwnProperty('constructor'));
    console.log(target.constructor);
    console.log(name);
    console.log(descriptor);
}

class Foo {
    @log
    bar() {}
}

const test = new Foo();
test.bar();
```

输出结果：

![](/images/decorator1.jpg)

由此可以看出，target 就是被装饰的类本身，name 为被装饰的属性名，descriptor 与前述 Object.defineProperty 方法的属性描述符完全一样。

这仅仅是作为类属性的装饰器而言。实际上 decorator 有两种使用方法：

- 装饰 Class，作为类装饰器
- 装饰类的属性

作为类装饰器时，由于类本身是一个函数，因此 decorator 仅有 `target` 这一个参数。

需要注意的是，**decorator 不能用于函数，因为存在函数提升**。

#### 3. decorator 的使用场景

如前面所提到的 AOP 的用途，我们可以通过 decorator 实现横切逻辑，如日志上报，鉴权等。

[core-decorators](https://github.com/jayphelps/core-decorators/tree/master/src) 中实现了一系列基础常用的装饰器，可以参考一下其中的实现。

平时开发中难免遇到需要使用定时器的场景，于是：

```javascript
setTimeout(() => {
  doSomething();
}, 2000);
```

遇到一个就得写一个，函数被包裹来包裹去，并不是很美观。可以编写一个简单的 `timeout` 装饰器来重构：

```javascript
function timeout(milliseconds = 0) {
  return function( target, key, descriptor ) {
    const fn = descriptor.value;
    descriptor.value = function (...args) {
      setTimeout(() => {
        fn.apply(this, args);
       }, milliseconds);
    };
    return descriptor;
  }
}

class Demo {
  constructor() {}
  @timeout()
  doSomething() {}
  @timmeout(2000)
  doAnotherThing() {}
}
```

代码结构清晰多了，装饰器也起到了注释的作用。

#### 4. decorator 在什么时候运行？

尝试一下：

```javascript
function log(message) {
    return function() {
        console.log(message);
    }
}

console.log('before class');

@log('class Bar')
class Bar {
    @log('class method bar')
    bar() {}

    @log('class property foo')
    foo = 1;
}

console.log('after class')

let bar = {
    @log('object method bar')
    bar() {}
};

```
输出结果：
![](/images/decorator2.jpg)

由此我们可以看出：
> 装饰器是在声明期就起效的，并不需要类进行实例化。
>
> 类实例化并不会致使装饰器多次执行，因此不会对实例化带来额外的开销。
>
> 按编码时的声明顺序执行，并不会将属性、方法、访问器进行重排序。
>
> 因为以上这 2 个规则，我们需要特别注意一点，在装饰器运行时，你所能得到的环境是空的，在 Bar.prototype 或者 Bar 上的属性是获取不到的，也就是说整个 target 里其实只有 constructor 这一个属性。
>
> 换句话说，装饰器运行时所有的属性和方法均未定义。




### 四、React 高阶组件

之所以会有`高阶组件 higher-order component(HOC)`这个东西，主要是为了实现**组件的抽象**。

#### 1. Mixin

想了解 HOC 干了啥，以及为啥需要它。依然要用 Vue 举例，Vue 的 `mixins` 混入方法实现了组件的混入，借此我们可以将组件粒度切细，使得项目高度配置化。

官网示例：

```javascript
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```

Vue 中的 mixin 数据对象在内部会进行浅合并 (一层属性深度)，在和组件的数据发生冲突时**以组件数据优先**。这也是实现 mixin 的重点逻辑。

看看 `core-decorators` 中 mixin 的核心实现：

```javascript
import { getOwnPropertyDescriptors } from './private/utils';

const { defineProperty } = Object;

function handleClass(target, mixins) {
  if (!mixins.length) {
    throw new SyntaxError(`@mixin() class ${target.name} requires at least one mixin as an argument`);
  }

  for (let i = 0, l = mixins.length; i < l; i++) {
    const descs = getOwnPropertyDescriptors(mixins[i]);
    const keys = getOwnKeys(descs);

    for (let j = 0, k = keys.length; j < k; j++) {
      const key = keys[j];

      if (!(hasProperty(key, target.prototype))) {
        defineProperty(target.prototype, key, descs[key]);
      }
    }
  }
}

export default function mixin(...mixins) {
  if (typeof mixins[0] === 'function') {
    return handleClass(mixins[0], []);
  } else {
    return target => {
      return handleClass(target, mixins);
    };
  }
}
```

其中把待 mixin 对象的每个方法都叠加到了 target 对象的原型上。其中通过 `defineProperty` 这个方法避免了覆盖 target 的原有属性。

但是 mixin 有很多弊病，这也是为什么最后我们选择了高阶组件来实现组件的 compose。主要问题有：

- **破坏组件原有封装**：被 mixin 进来的组件都有自己的 props 和 state，导致在引入的时候需要千般小心，去维护那些我们不可见的状态。
- **命名冲突**：mixin 是一个平面结构，不同 mixin 中的命名不可知，譬如 `handleChange` 这种常见名就很容易冲突，无形中增加了开发和维护成本。

因此高阶组件应运而生。

#### 2. 高阶组件

`高阶组件（higher-order component）`的概念类似于`高阶函数`，它接受 React 组件作为输入，输出一个新的 React 组件：

```javascript
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

先看一个最简单的例子：

```javascript
import React, { Component } from 'react';
import simpleHoc from './simple-hoc';

class Normal extends Component {
  // 可以做很多自定义逻辑
  render() {
    console.log(this.props, 'props');
    return (
      <div>
        Usual
      </div>
    )
  }
}
export default simpleHoc(Normal);
```

```javascript
import React, { Component } from 'react';

const simpleHoc = WrappedComponent => {
  console.log('im a hoc!');
  return class extends Component {
    render() {
      return <WrappedComponent {...this.props}/>
    }
  }
}
export default simpleHoc;
```

我们所定义的 Normal 组件通过 simpleHoc 的包裹后输出的新组件后，在 Normal 本身的功能上可以多打一个 Log，并继承了 simpleHoc 的 props。这是最简单的一个例子啦，高阶组件做的事情也比较逊。我们继续看看~

实现高阶组件的方法有两种：

1. 属性代理（`props proxy`）：高阶组件通过 WrappedComponent 来操作 props
2. 反向代理（`inheritance inversion`）：高阶组件继承于 WrappedComponent

这两种方法的使用场景也各不相同。

### 五、实现高阶组件的两种方法与使用场景

#### 1. 属性代理

这是较为常见的一种方法，上面的 `simpleHoc` 的实现其实就属于属性代理。**通过高阶组件传递 props 的方法就是属性代理**。

使用场景：

- 操作 `props`
- 通过 `Refs` 访问到组件实例
- 提取 `state`
- 用其他元素包裹 `WrappedComponent`

我们主要介绍一下最常见的，操作 props。其它三种应用在网上也能找到具体例子，不赘述了（文章到这里感觉已经非常长了……）

我们可以通过属性代理，来读取，编辑，增加或是删除 WrappedComponent 的 props。但应该注意小心编辑、删除重要的 props，尽量通过**对高阶组件的 props 作新的命名来避免混淆**。

```javascript
function myHOC (WrappedComponent) {
  return class myHoc extends React.Component {
    render() {
      const newProps = {
        user: currentLoggedInUser
      }
      return <WrappedComponent {...this.props} {...newProps}/>
    }
  }
}
```

这样，输出的新组件就可以通过 `this.props.user` 来获得当前登录人的信息。

使用的时候可以通过 decorator 来简化：

```javascript
@myHoc
class MyComponent extends React.Component {
  render() {}
}
export default MyComponent;
```

#### 2. 反向继承

先看例子：

```javascript
function myHOC(WrappedComponent) {
  return class myHoc extends WrappedComponent {
    render() {
      return super.render()
    }
  }
}
```

高阶组件返回的组件继承于 WrappedComponent，因此被称为 `Inheritance Inversion` 反向继承。

**反向继承模式下的高阶组件可以通过 this 访问到 WrappedComponent 的 state、props、组件生命周期方法和 render 方法**。

使用场景：

- 渲染劫持（`Render Highjacking`）
- 操作 `state`

渲染劫持是指高阶组件可以控制 WrappedComponent 的渲染过程并修改渲染结果，这意味着可以：

- 在由 render **输出**的任何 React 元素中读取、添加、编辑、删除 props
- 读取和修改由 render 输出的 React 元素树
- 有条件地渲染元素树
- 把样式包裹进元素树（就像在 `Props Proxy` 中的那样）

```javascript
function myHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      if (this.props.show) {
        return super.render()
      } else {
        return null
      }
    }
  }
}
```

前面提到了高阶组件可以通过 this 访问到 WrappedComponent 的 state，可以对其进行编辑、删除，但这会使得 WrappedComponent 的内部状态混乱，难以维护，应避免这样使用。

最后，我们来看下高阶组件与 Mixin 的区别：

![](/images/decorator3.jpg)

高阶组件更符合函数式编程思想，原组件不会感知到高阶组件的存在，最后我们所使用的都是一个新组件，从而避免了 Mixin 的那些弊病。

### 五、参考内容

- [《深入React技术栈》](https://book.douban.com/subject/26918038/)
- [ES Decorators简介](http://efe.baidu.com/blog/introduction-to-es-decorator/)
- [深入理解 React 高阶组件](https://zhuanlan.zhihu.com/p/24776678)



