---
layout: post
title:  "Viewport-Percentage (or Viewport-Relative) Lengths"
date:   2016-03-17 19:16
categories: front-end css
---

### 什么是视区百分比长度（viewport-percentage lengths）？

先看一下W3C给出的定义：
 > The viewport-percentage lengths are relative to the size of the initial containing block. When the height or width of the initial containing block is changed, they are scaled accordingly.

意为视区百分比长度是与其包含块的尺寸有关，并且是随之变化的。
`initial containing block`意为浏览器内部的可视区域，即`window.innerWidth/window.innerHeight`大小，不包含任务栏标题栏以及底部工具栏的浏览器区域大小。

视区单位有`vh` (相对于视区高度), `vw`(相对于视区宽度), `vmin` (相对于视区高度或宽度，取决于哪个更小) and `vmax` (类似于vw但取决于哪个更大)。

### 它是如何分配浏览器高度的？

我们可以假借`vh`: `1vh`相当于1%的视区高度，忽略元素在DOM树中的位置，100vh相当于浏览器内部可视区域的高度。

### 浏览器兼容性？

![](http://d.picphotos.baidu.com/album/s%3D1600%3Bq%3D90/sign=a5059145b1003af349bad866051afd2d/b7fd5266d016092438ced357d30735fae7cd3496.jpg)
在css属性可用性查询网站[caniuse](http://caniuse.com/#search=viewport%20units)中我们查到了，目前主流浏览器对于视区单位的支持性，从中我们可以看出，**Chrome 20+, IE9+ ,FireFox19+以及Safari6** 都是支持的。

###100vh与100%的区别？

我们知道，vh是相对于视区高度的单位，所以100vh被设置的高度永远是相对于`window.innerWidth/window.innerHeight`的。而被设置成百分比高度的标签，它的实际高度要取决于其父标签（块级）
就像这个例子：
```
<body style="height:100%">
    <div style="height:200px">
        <p style="height:100%; display:block;">Hello, world!</p>
    </div>
</body>
```
虽然p标签设置了高度为100％，但是其外部div的高度为200px，因此这个p标签的实际高度只是200px

###如何用百分比实现同vh一样的效果？

某些情况下，`vw`, `vh`所产生的效果与百分比`%单位`无异，尤其对于`absolute/fixed`定位属性的元素。比如：
```
{
    position: fixed;
    top: 100%;
    top: 100vh;
    left: 5%;
    left: 5vw;
    right: 5%;
    right: 5vw;
}
```
支持vh, vw单位的浏览器就会使用视区单位（因为在后面声明）；不支持的就是要百分比%单位。

###参考内容

* [James Donnelly__stackoverflow](http://stackoverflow.com/questions/1575141/make-div-100-height-of-browser-window):视区单位布道
* [视区相关单位_张鑫旭博客](http://www.zhangxinxu.com/wordpress/2012/09/new-viewport-relative-units-vw-vh-vm-vmin/):更多相关与视区单位应用场景的尝试
* [JS,Jquery获取各种屏幕的宽度和高度](http://www.cnblogs.com/xiaopin/archive/2012/03/26/2418152.html):复习一下有关屏幕高度的知识