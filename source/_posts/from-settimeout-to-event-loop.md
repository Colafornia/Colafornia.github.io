---
layout: post
title:  "You Don't Know setTimeout"
date:   2017-06-04 21:15
categories: front-end javascript
---

![cover](/images/jstips-animation.gif)

### 几个可能不知道的定时器⏲特性
首先，**setTimeout()/setInterval()** 方法不是 ECMAScript 规范定义的内容，而是属于 BOM 提供的功能，也就是说定时器作为 BOM 对象和方法的一部分才能在浏览器中使用。

需要注意的是 **setTimeout() 与 setInterval() 在触发周期的定义上完全不一样**，在下面例子 setTimeout() 代码中，要在前一个 callback 回调执行结束并延迟 10ms 以后才能再次执行 setTimeout()，即延迟是要求运行时(runtime) 处理请求所需的最小时间，但不是有所保证的时间。而 setInterval() 则是每隔 10ms 就执行一次 callback 回调，不会关注 callback 何时执行结束。

<!--more-->

```javascript
// 由于触发周期定义不同，以下两个定时器有非常大的区别

// 定义一个 timeout 定时器，每10毫秒重新调用自己
setTimeout(function repeatMe() {
  // do something
  setTimeout(repeatMe, 10);
}, 10);

// 定义一个 interval 定时器，每10毫秒触发一次
setInterval(function() {
  // do something
}, 10)
```

除此之外，在 [HTML spec](https://html.spec.whatwg.org/multipage/webappapis.html#timers) 中定义 **setTimeout 的最小延迟时间是4ms**，但通常认为浏览器可实现的定时器的最小延迟时间是10ms，即 setTimeout(fn, 0) 也是会延迟至少10ms，如果想实现 0 delay 的话可以通过 [window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) 实现。

定时器还有一个小特性，在开发移动公告的滚动动画时发现，从动画所在的 tab 页切换到别的 tab 之后再切回，动画会完全乱掉，并不会按代码中所设置的延迟时间进行。这是为了减少背景 tab 页面的代码运行消耗（电量），**背景 tab 页面中定时器的间隔会增加到1000ms**，如果遇到需要解决这个问题的场景，可以通过 [HTML5 Web Workers](https://robertnyman.com/2010/03/25/using-html5-web-workers-to-have-background-computational-power/) 或者用 [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) 代替定时器来解决。

最后，由于 webkit 中 timer 类的实现原理决定：**预期延时时间最小的任务最先被执行，同时，预期延时时间相同的两个任务，其执行顺序是按照注册的先后顺序执行。**

```javascript
var start = new Date;
setTimeout(function(){
  console.log('fn1');
}, 20);
setTimeout(function(){
  console.log('fn2');
}, 30);
setTimeout(function(){
  console.log('another fn2');
}, 30);
setTimeout(function(){
  console.log('fn3');
}, 10);
console.log('start while');
while (new Date - start < 1000) {};
console.log('end while');

// 打印结果如下
// start while
// end while
// fn3
// fn1
// fn2
// another fn2
```

### Event Loop 相关概念
浏览器让一个单线程共用于解释和执行 JavaScript，我们可以将它称为是“主线程”。其它的处理AJAX请求的线程、处理DOM事件的线程、定时器线程等等可以称为是“工作线程”。

JavaScript 的单线程意味着只有一个 call stack，也意味着同一时间是能做一件事。

![Event Loop](http://o7ts2uaks.bkt.clouddn.com/v2-25076e938167ad11c6a2a9ec099e0973_b.png)

- 调用栈(call stack): 后进先出，函数被调用时会被加入到调用栈顶部，等执行结束再从顶部移除。

- 堆(heap): 内存分配区

- 消息队列(quene): 也叫任务队列。先进先出，一旦调用栈中的所有任务执行完毕，栈清空，就会读取消息队列。**消息/任务就是注册异步任务时添加的回调函数**。

- 同步任务: 在主线程的调用栈排队执行的任务。

- 异步任务: 主线程发起执行异步函数的请求，对应的工作线程（浏览器事件触发线程、异步http请求线程等）接收请求并告知主线程已收到(异步函数返回)；主线程可以继续执行后面的代码，同时工作线程执行异步任务；工作线程完成工作后，将完成消息放到消息队列，主线程通过事件循环过程去取消息，然后执行回调。

- 事件循环(event loop): 事件循环是指主线程重复从消息队列中取消息、执行的过程。**
取一个消息并执行的过程叫做一次循环**。

- Web APIs: 如 AJAX，定时器，DOM事件这些异步事务并不在 V8(JavaScript)运行环境中，是由浏览器提供的 Web API

相关概念就是这些，http://latentflip.com/loupe/ 是一个可视化调用栈的网站，可以把自己的代码敲到里面运行来看 event loop 的具体动态。

### 定时器和线程是如何工作的

![timer](https://johnresig.com/files/Timers.png)

以此图为例，来理解 JavaScript 中异步事件的执行。

> 0ms: 启动即执行第一段 JavaScript 代码块，启动一个10ms延迟定时器(timeout)和10ms间隔定时器(interval)，延迟定时器是先于间隔定时器声明启动的。

> 5ms: 鼠标单击，但是由于现在正在执行第一个代码块，调用栈不为空，单击事件的处理函数不能立即执行，只能在消息队列中进行排队

> 10ms: 延迟定时器触发，间隔定时器触发，同理也都进行排队

> 18ms: 第一段代码块执行结束，调用栈为空，此时有三个代码块在排队执行(click 事件处理函数，延迟定时器处理函数，间隔定时器第一次触发的处理函数)，按顺序此时主线程中执行 click 事件回调。消息队列中此时还有两个回调。

> 20ms: 间隔定时器又触发了，由于间隔定时器第一次触发的处理函数仍在排队，浏览器不会对同一 interval 处理函数的多个实例同时进行排队，于是此次调用作废，消息队列不变，仍然还是那两个回调。

> 28ms: click 事件回调函数执行完毕，按顺序，此时主线程中将执行延时定时器处理函数。消息队列中只有间隔定时器的第一次触发回调在排队。

> 30ms: 间隔定时器再一次触发了，仍然因为第一次触发的回调仍在排队，此次调用作废。

> 34ms: 延时定时器回调函数执行完毕。开始执行间隔定时器第一次触发的回调函数。此时消息队列为空。

> 40ms: 间隔定时器再一次触发了，导致新的 interval 回调函数进入消息队列中排队。

> 42ms: 间隔定时器第一次回调函数执行完毕，正在排队的回调开始执行。消息队列再次为空。

> 47ms: 回调执行完毕，此时还没有到触发 interval 的时间，因此下一个 interval 回调可以等到触发事件立即执行。

由此，我们可以知道：
- 如果无法立即执行定时器，该定时器会被推迟到下一个可用的执行时间点上(验证了实际延迟时间必然会比指定的延迟时间更长)
- 同一个 interval 执行程序的多个实例不能同时进行排队
- 延迟时间足够长的话，很有可能会有两个 interval 回调会无延迟连续执行

### setTimeout(fn, 0)

由上述内容可知，setTimeout(fn, 0) 中的代码并不是为了 fn 立即执行，而是将 fn 插入到消息队列，使得待调用栈为空时将立即调用执行 fn，保证了 fn 的后执行。因此我们可以通过这一特性，**用 setTimeout(fn, 0) 调整事件的发生顺序**。

```javascript
var input = document.getElementsByTagName('input[type=button]')[0];
input.onclick = function () {
  setTimeout(function () {
    input.value +=' input';
  }, 0)
};
document.body.onclick = function () {
  input.value += ' body'
};
// 模拟事件捕获，实现父元素的事件回调函数先发生
```

在《高性能JavaScript》中认为 **单个 JavaScript 操作花费的总时间不应该超过100毫秒**。否则用户会感到与界面失去联系。实际上，如果一段 js 代码的运行时间超过 500ms，Firefox 和 Opera 浏览器将弹出警告对话框，Safari 会默认终止运行时间超过500 ms 的脚本。因此我们需要定时器将计算量大耗时长的任务分割成不会让浏览器挂掉的碎片。

```javascript

var div = document.getElementsByTagName('div')[0];
// 会造成浏览器阻塞
for(var i=0xA00000;i<0xFFFFFF;i++) {
  div.style.backgroundColor = '#'+i.toString(16);
}
// 分割成小的任务
var timer;
var i=0x100000;
function func() {
  timer = setTimeout(func, 0);
  div.style.backgroundColor = '#'+i.toString(16);
  if (i++ == 0xFFFFFF) clearInterval(timer);
}
timer = setTimeout(func, 0);
```

### 定时器的其它应用

这里就是说函数节流(throttle)与函数防抖(debounce)

以 Underscore.js 中 debounce 的实现为例：

```javascript
/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回调用函数
 */
_.debounce = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    // 设置 last 为当前时间与上次触发的时间间隔
    var last = _.now() - timestamp;

    if (last < wait && last > 0) {
      // 如果时间间隔小于所传入的 wait
      // 还没到触发时间，继续设置定时器
      timeout = setTimeout(later, wait - last);
    } else {
      // 到了触发时间，清空计时器，避免影响下次触发
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        // 执行 func
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    // 每次触发之后 更新时间戳为此次触发时间
    timestamp = _.now();
    // 判断是否符合立即触发的条件
    var callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      // 立即触发
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
};
```

需要注意的是，**管理多个定时器会产生许多问题，同时创建大量的定时器将会在浏览器中增加垃圾回收任务发生的可能性**。

定时器是一个特殊的垃圾回收问题，这是由于它们是在 JavaScript 主线程之外的浏览器线程进行管理的。不同浏览器垃圾回收的周期不同，这也是通过定时器处理动画时，动画在有的浏览器上很流畅，有的浏览器上特别卡的原因之一。因此应该注意减少同时使用的定时器的数量或者使用中央定时器来管理多个回调。

### 几个后续值得探究的问题

- HTML5 Web Workers: HTML5标准的一部分，这一规范定义了一套 API，它允许一段JavaScript程序运行在主线程之外的另外一个线程中
- requestAnimationFrame: 更适合动画使用的“定时循环器”
- setImmediate: 一个比较新的定时器，setTimeout(0)的替代版
- Node.js 中的 Event Loop

### 参考内容

- [Philip Roberts: What the heck is the event loop anyway](https://www.youtube.com/watch?v=8aGhZQkoFbQ&t=669s)

- [John Resig: How JavaScript Timers Work](https://johnresig.com/blog/how-javascript-timers-work/)

- [AlloyTeam: 从 setTimeout 说起事件循环](http://www.alloyteam.com/2015/10/turning-to-javascript-series-from-settimeout-said-the-event-loop-model/)

- [阮一峰: JavaScript 运行机制详解——再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop)

