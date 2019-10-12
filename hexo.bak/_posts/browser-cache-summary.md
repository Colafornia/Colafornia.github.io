---
layout: post
title:  "关于浏览器缓存"
date:   2016-07-18 21:36
categories: http
---

浏览器缓存就是将web资源保存在本地，就不用再每次都向服务器请求相同的资源。当下一个请求发起，如果是同样的url，浏览器会根据缓存机制来决定是读取本地的内容还是向服务器发送请求。显而易见，浏览器缓存可以减少带宽消耗，加快用户的访问速度同时减轻服务器压力。

浏览器的缓存机制主要分为两种，http协议定义的缓存机制和非http协议定义的缓存机制。后者主要通过在html文件中设置`meta标签`来实现。

## 与缓存相关的首部字段

![http首部字段](http://o7ts2uaks.bkt.clouddn.com/CACHE.png)

<!--more-->

![状态图](http://o7ts2uaks.bkt.clouddn.com/w704.jpg)
### Pragma与Expires
由上表可以看到，Pragma与Expires是http1.0中的内容，是早期的浏览器缓存策略，现在我们也会经常看到看到这两个字段，为的是http协议向下兼容。
Pragma属于通用首部字段，在请求和响应报文章都可以设置，一般要求Pragama指令设定在html文件中的`<meta>标签`

`<meta http-equiv="Pragma" content="no-cache">`
不过Pragma一般只有在设置于响应报文中时才会生效。

Expires是响应头字段，用来启用缓存和规定缓存失效时间。Expires的值对应一个GMT时间，比如“Mon, 22 Jul 2002 11:12:01 GMT”来告诉浏览器资源缓存过期时间，如果还没过该时间点则不发请求。

如果在meta标签中设置expires只是能设置页面在IE浏览器中是否缓存（对页面资源无效）。如果是在服务端报头返回Expires字段，则在任何浏览器中都能正确设置资源缓存的时间。需要注意的是，expires设置的缓存时间是相对服务器上时间而言的，如果客户端时间与服务器时间不一致，这个缓存也就没意义了。

另外，同时设置Expires和Pragma的话，Pragma的优先级会更高。

### Cache-Control

Cache-Control分别能在请求报文和响应报文中使用，来定义缓存有效时间，优先级高于Pragma与Expires。Cache-Control也修正了上述Expires时间差的问题。
![cache-control可设置的值](http://ww3.sinaimg.cn/mw690/6941baebgw1eukzzwcvnij20gi089jvb.jpg)

### Last-Modified

浏览器第一次请求某URL时会返回200，内容是所请求的资源。服务器将资源传递给客户端时，会将资源最后更改的时间以“Last-Modified: GMT”的形式加在实体首部上一起返回给客户端。

客户端会为资源标记上该信息，下次再次请求时，会把该信息附带在请求报文中一并带给服务器去做检查“If-Modified-Since: GMT”，若传递的时间值与服务器上该资源最终修改时间是一致的，则说明该资源没有被修改过，直接返回304状态码即可，内容为空，节省了传输数据量。

### ETag

Http1.1中定义了实体首部字段`Etag`，即在服务器响应时给请求的URL做标记一个唯一标识符，在响应头中传给客户端。在下一次发请求时，客户端会带上Etag，服务器通过比较服务器上资源的Etag与客户端传过来的Etag来判断资源有没有被修改。若没被修改，则返回304.

如果Last-Modified和ETag同时被使用，则要求它们的验证都必须通过才会返回304，若其中某个验证没通过，则服务器会按常规返回资源实体及200状态码。

## 缓存策略

### Last-Modified和Etag → 304

这两个字段经常在一起配合使用，来判断资源是否已被修改，确定读取本地缓存还是重新请求资源。ETag主要是用来解决Last-Modified无法解决的问题（文件修改频繁，服务器得到的时间不精确等等）。

这两个字段的特点及应用场景在于，本地已有缓存，但是它们需要向服务器发送请求来确定本地缓存是否是最新的，若服务器认为本地缓存是最新的，可用，则返回304

### Expires/Cache-Control → 200

区别于304状态码，200意味着不向服务器发请求，直接启用本地缓存。即Expires/Cache-Control字段通过绝对时间/相对时间判断出本地缓存是有效的。

思维导图如下（自己画的感觉很不美观 = =）

![思维导图](http://o7ts2uaks.bkt.clouddn.com/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%AF%B7%E6%B1%82%20%281%29.png)

## 用户行为与缓存

浏览器缓存也与用户行为有关，在地址栏按回车与直接F5是不一样的。

![用户行为](http://ww4.sinaimg.cn/mw690/6941baebgw1eukzzr7rc2j20hg04kjsd.jpg)

由图可知，当用户按F5进行刷新，Expires/Cache-Control会失效，浏览器将再次发送请求通过Last-Modified/ETag来判断缓存是否有效。当用户通过Ctrl+F5进行强制刷新时，所有字段都会失效，浏览器将重新请求获取资源。

### 参考内容
* [w3:HTTP1.1](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html)
* [vajoy:浅谈浏览器http的缓存机制](http://www.cnblogs.com/vajoy/p/5341664.html)
* [鸟哥:浏览器缓存机制](http://www.laruence.com/2010/03/05/1332.html)
* [eroswang:浏览器缓存详解](http://blog.csdn.net/eroswang/article/details/8302191)


