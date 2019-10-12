---
layout: post
title:  "一些关于 fetch api 的基本设定"
date:   2016-08-22 16:24
categories: javascript
---

长久以来，我们一直都通过XMLHttpRequest(XHR)来执行异步请求，但它有很多缺陷与不便之处，W3C官方则推出了新的api `Fetch`来替换它。

### XMLHttpRequest的缺陷

先看一个典型的XHR例子：
```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.responseType = 'json';

xhr.onload = function() {
  console.log(xhr.response);
};

xhr.onerror = function() {
  console.log("Booo");
};

xhr.send();
```
可以看出，XHR是基于事件的异步模型，在设计上不符合分离原则，输入、输出和用事件来跟踪的状态混杂在一个对象里。我们必须创建实例来发送请求。相比于ES6发布的Promise，Generator，基于事件的模型是非常落后难用的。

<!--more-->

### Fetch Api的特点

fetch api是基于`Promise`设计的，定义在BOM的`window`对象之中。建议阅读资料：

* [Fetch Living Standard](https://fetch.spec.whatwg.org/)
* [MDN: GlobalFetch 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch/fetch)
* [caniuse 浏览器支持率](http://caniuse.com/#search=fetch)

![caniuse-fetch](http://o7ts2uaks.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202016-08-18%20%E4%B8%8B%E5%8D%8810.03.45.png)

截止到2016年8月，Chrome43+，Firefox47+支持fetch api，对于低版本的浏览器，github上有许多[polyfill](https://github.com/camsong/fetch-ie8)可以使其兼容。

一个典型的fetch例子：
```javascript
fetch(url).then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
}).catch(function() {
  console.log("Booo");
});
```

用ES6的箭头函数重构之后：
```javascript
fetch(url).then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.log("Booo"))
```

用还处于草案阶段的[ES7的async函数](http://es6.ruanyifeng.com/#docs/async#async函数)再重构一下：
```javascript
(async() => {
  try {
    var response = await fetch(url);
    var data = await response.json();
    console.log(data);
  } catch (e) {
    console.log("Booo")
  }
})();
```
就可以把一个异步的请求代码结构写得看起来跟同步请求差不多了。

由此可见，`Fetch`基于Promise实现，支持async/await，语法更简洁。

### How to Use

#### fetch()

语法：
```javascript
fetch(input, init).then(function(response) { ... });
```
参数：

* `input` :要获取的资源
  * 字符串，资源的url
  * 一个`Request`对象（后面会介绍Request)
* `init` :可选，是请求的配置项
  * method: 请求方式，GET/POST/PUT/DELETE等等
  * headers: 请求头，可能是` Headers 对象`或者 ByteString
  * body: 请求的Body信息
  * mode: 请求的模式，cors/no-cors/same-origin
  * credentials: 请求的credentials，omit/same-origin/include
  * cache: 请求的缓存模式， default/no-store/reload/ no-cache/force-cache/only-if-cached

返回值：返回一个`Promise对象`

Fetch引入了3个接口，它们分别是 `Headers`,`Request` 以及 `Response` 。

#### Headers()

Headers()是一个可检索的多映射名值表，也可穿多维数组或者json

```javascript
var reqHeaders = new Headers();
reqHeaders = new Headers({
  "Content-Length": content.length.toString(),
});
reqHeaders.append("Content-Type", "text/plain");
console.log(reqHeaders.has("Content-Type")); // true
console.log(reqHeaders.has("Set-Cookie")); // false
```
Headers()有一个`guard`属性来规定哪些参数是可写的。

#### Requset()

语法，参数与fetch()类似：


`var myRequest = new Request(input, init);`

其中可选的init配置项比fetch()多了几项(redirect/integrity/referrer)

#### Response()

在fetch()的回调中我们可以获得一个[Response实例](https://developer.mozilla.org/en-US/docs/Web/API/Response)。Response有很多实用的只读属性，比如Response.ok/Response.type/Response.headers等等。


### 参考内容
* [MDN: GlobalFetch 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch/fetch)
* [Jake Archibald: That's so fetch](https://jakearchibald.com/2015/thats-so-fetch/)
* [Hacks Mozilla: This API is so Fetching](https://hacks.mozilla.org/2015/03/this-api-is-so-fetching/)
* [camsong: 传统Ajax 已死，Fetch 永生](https://github.com/camsong/blog/issues/2)
