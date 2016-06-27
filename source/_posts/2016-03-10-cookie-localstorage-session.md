---
layout: post
title:  "Cookie, LocalStorage 与 SessionStorage"
date:   2016-03-10 15:02
categories: front-end javascript
---
有关Cookie, LocalStorage 与 SessionStorage的基本概念，区别，共同点，各自的应用场景。

## 基本概念

### Cookie

Cookie 是一小段文本信息，伴随着用户请求和页面在 Web 服务器和浏览器之间传递，是随HTTP请求一起被传递的额外数据。主要用途有保存登陆信息，大多数浏览器支持最大为 4096 字节的 Cookie

### localStorage

localStorage 是 HTML5 标准中新加入的技术,大小限制在500万字符左右，各个浏览器不一致。永久有效，即不主动清空的话就不会消失，即使保存的数据超出了浏览器所规定的大小，也不会把旧数据清空而只会报错。

<!--more-->

### sessionStorage

sessionStorage是在同源的同窗口（或tab）中，始终存在的数据。sessionStorage 与 localStorage 的接口类似，但保存数据的生命周期与 localStorage 不同。当页面关闭后，sessionStorage 中的数据就会被清空。
<table>
    <tr>
        <th>特性</th>
        <th>Chorme</th>
        <th>Firefox</th>
        <th>IE</th>
        <td>Opera</td>
        <td>Safari</td>
    </tr>
    <tr>
        <td>localStorage</td>
        <td>4</td>
        <td>3.5</td>
        <td>8</td>
        <td>10.5</td>
        <td>4</td>
    </tr>
    <tr>
        <td>sessionStorage</td>
        <td>5</td>
        <td>2</td>
        <td>8</td>
        <td>10.5</td>
        <td>4</td>
    </tr>
</table>

## 共同点

- 都是保存在浏览器端，而且同源。 
- 三者都是键值对的集合。

## 区别

- cookie由服务端生成，用于标识用户身份；而两个storage用于浏览器端缓存数据
- 如果保存了cookie的话，http请求中一定会带上；而两个storage可以由脚本选择性的提交
- 存储大小限制不同，cookie数据不能超过4k，同时因为每次http请求都会携带cookie，所以cookie只适合保存很小的数据，如会话标识。sessionStorage和localStorage 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。
- 数据生命期不同。sessionStorage会在会话结束后销毁；而localStorage会永久保存直到覆盖。cookie会在过期时间之后销毁。
- 安全性方面，cookie中最好不要放置任何明文的东西。两个storage的数据提交后在服务端一定要校验。
- 作用域不同，sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面；localStorage 和cookie在所有同源窗口中都是共享的。

## 应用场景

- 每个HTTP请求都会带着cookie的信息，若cookie中包含大量数据则浪费了过多带宽。大多数情况下，cookie都用来存储身份校验，会话，广告踪迹等token。
- 由于locakStorage和sessionStorage所存储的数据是容易读取和更改的，所以它们更适合存储那些不明感的，与安全性无关的数据。