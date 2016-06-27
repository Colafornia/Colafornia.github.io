---
layout: post
title:  "BFC学习笔记"
date:   2015-08-20 10:54:24
categories: css
---
### 一.概念

在进行盒子元素布局的时候，BFC提供了一个环境，在这个环境中按照一定规则进行布局不会影响到其它环境中的布局。比如浮动元素会形成BFC，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的。

### 二.产生BFC条件：

当一个HTML元素满足下面条件的任何一点，都可以产生Block Formatting Context：

*   float的值不为none。
*   overflow的值不为visible。
*   display的值为table-cell, table-caption, inline-block中的任何一个。
*   position的值不为relative和static。

<!--more-->

### 三.应用

1)包含浮动元素BFC会根据子元素的情况自适应高度，这个特性是对父元素使overflow:hidden/auto/scroll、float:left/right样式可以闭合浮动的原理。

2)不被浮动元素覆盖浮动元素：为元素创建BFC后可避免其被浮动的兄弟元素覆盖

3）解决上下相邻两个元素重叠
> 外边距折叠的规则：仅当两个块级元素毗邻并且在同一个块级格式化上下文时，它们垂直方向之间的外边距才会叠加。也就是说，即便两个块级元素相邻，但当它们不在同一个块级格式化上下文时它们的边距也不会折叠。

4）清除元素内部浮动

只要把父元素设为BFC就可以清理子元素的浮动了，最常见的用法就是在父元素上设置overflow: hidden样式，对于IE6加上zoom:1就可以了(IE Haslayout)。