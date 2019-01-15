---
layout: post
title:  "8102年末，前端路由基本思路"
date:   2018-11-12 20:00
categories: route javascript
---

![cover](/images/router/cover.jpg)

最近看了一些相关资料，特地来整理一下，当前前端主流路由 `react-router`、`vue-router` 的实现思路，内容不多也并不复杂，作为知识体系的补全。

<!--more-->

## 两种模式

此处默认你已经至少使用过主流框架 Router 中的一种，那就肯定知道路由配置时肯定会有个配置项是关于，使用 `hash` 模式还是 `history` 模式。

![](/images/router/01.jpg)
<div style="text-align:center">vue-router 通过给实例传入 `mode` 字段来设置</div>

![](/images/router/02.jpg)

<div style="text-align:center">react-router 则通过直接使用不同的路由组件进行区分</div>

这两种模式便是目前我们在浏览器环境中为单页应用实现“**无需重载页面即可更新视图**”的原理。

接下来我们分别进行分析。

### hash 模式

url 中使用了 hash 符号 `#` 后的内容便属于 `fragment`。

![](/images/router/03.jpg)

有别于 url 中的 `?` 符号，`fragment` 设计之初便是为了`锚点`这一特性，通过 `fragment` 指定网页中的位置，浏览器会匹配到 id 或 name 为 `fragment` 值的 a 标签，将其滚动到可视区域的顶部。

除此之外，`fragment` 还具备以下三个特性：

1. 修改#后的 `fragment` 值不会导致页面重新加载，但是会改变浏览器的历史记录
2. 作为 url 发起 HTTP 请求时，`fragment` 部分不会被包含在请求头中，也就不会被发送到服务器
3. `fragment` 一般不会被搜索引擎收录（虽然 Google 也出了相应对策作为补救，但整体上这种模式对 SEO 依然算不上不友好）

那 hash 模式是如何进行路由的呢？

通过监听 [onhashchange](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onhashchange) 事件即可捕获 hash 值的改变然后执行后续的更新视图逻辑（具体实现后面再解释）。

### history 模式（又名 browser 模式、HTML5 模式）

这一模式的实现基于 [Web API 中的 History](https://developer.mozilla.org/en-US/docs/Web/API/History)，浏览器工具栏的前进与后退实际上也是在操作 `History`。

其中，`History.pushState()` 与 `History.replaceState()` 让我们可以实现路由：

```javascript
window.history.pushState(stateObject, title, URL);
window.history.replaceState(stateObject, title, URL);
```
两者用法类似，**URL 必须为与当前页面属于同域**。这两个方法执行之后都会使得浏览器地址栏更新，但不跳转，同时 `History.state` 对象也将更新为传入的 URL 值，这就为前端路由的实现提供可能。

每当 `History` 对象发生变化，都会触发 `popstate` 事件，同理，我们可以通过监听这一事件，在回调中执行路由匹配逻辑。

## 源码

`vue-router` 的源码更为易读，几个版本下来 API 变化也不是很大，此处以 `vue-router` 源码作为示例。

先看[目录结构](https://github.com/vuejs/vue-router/tree/dev/src)：

![](/images/router/04.jpg)

components 文件夹中便是涉及到视图更新的 `Link` 与 `RouterView` 组件，history 文件中涉及到我们刚刚提到的浏览器中两种路由模式。

先看入口文件https://github.com/vuejs/vue-router/blob/dev/src/index.js

在构造器中进行了 `mode` 读取，可以得知 vue-router 默认使用 `hash 模式`：

![](/images/router/05.jpg)

在 switch 函数中分别调用各自模式对路由的 history 对象进行加工。随后调用 [install.js](https://github.com/vuejs/vue-router/blob/701d02b810da200b9ee7bac757d62b628327c6dd/src/install.js) 将 vue-router 混入 Vue 实例中：

![](/images/router/06.jpg)

通过全局的 Mixin 对象，在 Vue 实例的 `beforeCreate` 钩子函数中将其混入，并将两个组件进行挂载。

那两个针对不同模式下 histroy 的包装方法呢？

以 [hash.js](https://github.com/vuejs/vue-router/blob/701d02b810da200b9ee7bac757d62b628327c6dd/src/history/hash.js)为例：

![](/images/router/07.jpg)
先是设置了事件监听，然后声明了 go、push、replace 等方法。

其中 `supportsPushState` 是工具方法，通过 `window.navigator.userAgent` 读取设备信息判断移动端设备是否支持。

从 go、push、replace 等方法的实现可以看出，基本都是通过在history 基础上改写的 [pushState](https://github.com/vuejs/vue-router/blob/701d02b810da200b9ee7bac757d62b628327c6dd/src/util/push-state.js) 方法实现的。

hash.js 还有一些针对 hash 模式特有的方法如 `ensureSlash()`，其余实现思路基本与 [html5.js](https://github.com/vuejs/vue-router/blob/701d02b810da200b9ee7bac757d62b628327c6dd/src/history/html5.js) 相同。

## 最后

所以在不借助框架的情况下如何实现一个极简版的前端路由也不是什么难题了，[Wheels/Router](https://github.com/Colafornia/Wheels/blob/master/Router/index.js) 轻松写两种~

关于实际工程中使用的路由其实还有很多边界情况需要处理，`react-router` 与 `vue-router` 结合各自框架实例与上下文，实现了非常简洁高效的路由机制，推荐大家阅读源码好好挖掘一下。




