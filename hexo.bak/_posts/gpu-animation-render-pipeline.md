---
layout: post
title:  "浏览器 GPU 动画优化与 Render Pipeline"
date:   2018-5-28 18:17
categories: render animation
---

![cover](/images/render-pipeline-cover.jpg)

上周在组里做了一个小的技术分享，本文是对这次分享内容的一个文字化梳理。

<!--more-->

### 一、前言

![](https://p0.meituan.net/scarlett/e328aa2a7280812a89eced601d302f3418041.jpg)

一个 Web 页面由代码最终转化为屏幕上的像素点，大致遵循图中的步骤：

> JS/CSS > 样式 > 布局 > 绘制 > 合成

① 指由 JavaScript 和 CSS 编写的动画代码

② 浏览器根据 CSS 选择器匹配计算（计算权重等）每个元素的最终样式

③ 浏览器计算元素所占的空间大小及其在屏幕上的位置（由于元素会互相影响，计算布局这一步骤会经常发生）

④ 在多个层上填充像素进行绘制，绘制每个元素的可视部分

⑤ 合成，将上一步中绘制出的多个层，正确合成到页面上

在之前的知识中，我们都知道，要正确使用、访问 CSS 属性，尽量少触发浏览器的 `重排重绘`，从而提升动画性能。

重排重绘指的是上述的③④步骤，本文主要探讨的是步骤⑤中的**合成**相关的概念与优化手段。

### 二、渲染基础概念

在研究浏览器的 Composite 步骤前，有几个渲染相关的概念必须了解。

本文主要基于 Chrome 的内核 `Blink` 的渲染概念描述。

#### 1.Blink

![](https://p1.meituan.net/scarlett/dc2500cbb537de8934117c2579ecad3227964.jpg)

在此之前我一直以为 Chrome 的内核依然是 `Webkit`，真是村通网。

实际上 `Webkit` 内核是苹果团队的开源作品，Chrome 在 2013 年之前一直基于其作为浏览器内核。直至 `Webkit2` 与 `Chromium` 的沙箱设计存在冲突，两方团队才决定分道扬镳。

Google 团队从 Webkit 中 fork 出一份代码，将在 `WebKit` 代码的基础上研发更加快速和简约的渲染引擎，并逐步脱离 `WebKit` 的影响，创造一个完全独立的 `Blink`（据说删掉了 Webkit 中 880W 行代码）。

由于此缘故，Blink 与 Webkit 对于渲染过程中的一些流程，术语并不完全相同，本文以 Blink 为准。

#### 2.RenderObject 与 RenderLayer

![](https://p1.meituan.net/scarlett/aabc7b208641fdf392dfe9b855a109b576936.jpg)

浏览器解析 HTML 文件生成 `DOM 树`，然而 `DOM 树`是不可以直接被用于排版的，内核还会再生成 `RenderObject 树`。每一个可见的 DOM 节点都会生成相应的 RenderObject 节点。

排版引擎经过 DOM 树与 CSS 定义对 Render 树进行排版，Render 树作为排版引擎的输出，渲染引擎的输入。

拥有相同坐标空间的 RenderObject 属于同一渲染层（RenderLayer），RenderLayer 最初被用来实现`层叠上下文（stacking context）`，以保证页面元素以正确顺序合成。

生成 RenderLayer 与具备层叠上下文的条件是一样的：

![](https://p0.meituan.net/scarlett/85b3d7376bc7c693e872ca668bef980b232822.jpg)


#### 3.GraphicsLayer

![](https://p0.meituan.net/scarlett/d48ec20953d86e41c8fb62bb6267690d38392.jpg)

某些特殊的 `RenderLayer` 渲染层会被认为是`合成层（Compositing Layers）`，合成层拥有单独的 GraphicsLayer。这其实是浏览器为了提升动画性能做出的设计。

为了在动画的每一帧的过程中不必每次都重新绘制整个页面。在特定方式下可以触发生成一个合成层，合成层拥有单独的 `GraphicsLayer`。

需要进行动画的元素包含在这个合成层之下，这样动画的每一帧只需要去重新绘制这个 `GraphicsLayer` 即可，从而达到提升动画性能的目的。

生成 GraphicsLayer 的条件：

![](https://p1.meituan.net/scarlett/5855a920418f70e0e50f1b0438601e42168085.jpg)

### 三、Render Pipeline 渲染流水线

在了解了以上渲染概念后，我们可以来看看一个极简版的渲染流水线示意图：

![](https://p0.meituan.net/scarlett/ff9a521cfb9093806a408fa2ba2a51c26992.png)

Blink 内核运行在主线程上，负责 JavaScript 的解析执行，HTML/CSS 解析，DOM 操作，排版，图层树的构建和更新等任务。

Layer Compositor（图层合成器）运行在 Compositor 线程上，接收 Blink 的输入，负责图层树的管理。

Display Compositor 接收 Layer Compositor 的输入，负责输出最终的 OpenGL 绘制指令，将网页内容通过 GL 绘制到显示屏上。

将渲染流水线的内容按照线程做一下区分：

![](https://p0.meituan.net/scarlett/f7537a196f23b0f1f6b7ed9d893fedea39673.jpg)

由此，Web 动画可以分为两大类：

- 合成器动画：大多数基于 CSS 的动画，`transforms` 和 `opacity` 等都可以在合成线程中处理。
- 非合成器动画：引起了绘制、布局的动画，`Timer` 或者 `requestAnimationFrame` 等由 JavaScript 驱动的动画。

**如果浏览器在主线程上运行一些耗时的任务，合成器动画可以继续运行而不会中断**。

### 四、Web 动画优化建议

![](https://www.html5rocks.com/zh/tutorials/speed/high-performance-animations/cheap-operations.jpg)

现代浏览器在完成以上四种属性的动画时，消耗成本较低。根本原因是这四种属性生成了自己的图形层（GraphicsLayer），开启了 `GPU 硬件加速`。

开启 GPU 硬件加速的方法主要有两种：

- will-change
- transform: translateZ(0)

第二种我们应该都不陌生，第一种是 CSS3 的属性，它会通知浏览器你打算更改元素的属性。浏览器会在你进行更改之前做最合适的优化。

然而通过生成图形层（GraphicsLayer）的方式来进行性能优化却有个深坑 —— `隐式合成`。


![](https://p1.meituan.net/scarlett/4651555d9265a7d0280b038d501d31ac60552.jpg)

如图所示，a, b两个元素都具有 absolute 和 z-index 属性，其中 a 元素的 z-index 大于 b，因此 a 位于 b 图层之上。

如果我们将 a 元素使用 left 属性，做一个移动动画，那么 a元素就有了一个合成层，动画得到了性能提升。

那么，如果 a 静止不动，我们让 b 元素做动画呢？b 元素将拥有一个独立合成层；然后它们将被 GPU 合成。但是因为 a 元素要在 b 元素的上面（因为 a 元素的 z-index 比 b 元素高），那么浏览器会做什么？**浏览器会将 a 元素也单独做一个合成层！**

所以我们现在有三个合成层 a 元素所在的复合层、b 元素所在的合成层、其他内容及背景层。

没有自己合成层的元素要出现在有合成层元素的上方，它就会拥有自己的复合层；这种情况被称为**隐式合成**。

> GraphicsLayer 虽好，但不是越多越好，每一帧的渲染内核都会去遍历计算当前所有的 GraphicsLayer ，并计算他们下一帧的重绘区域，所以过量的 GraphicsLayer 计算也会给渲染造成性能影响。

因此我们的最终结论是：

1. 尽量保持让需要进行 CSS 动画的元素的 z-index 保持在页面最上
2. 有节制地优化，不要过早优化（不要滥用 will-change 等 GPU 加速手段）
3. 根据 Chrome Devtool 查看 GraphicsLayer 每层占用的内存


### 五、参考内容

- [CSS GPU Animation: Doing It Right](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
- [无线性能优化：Composite](http://taobaofed.org/blog/2016/04/25/performance-composite/)
- [浏览器渲染流水线解析与网页动画性能优化](https://zhuanlan.zhihu.com/p/30534023)


