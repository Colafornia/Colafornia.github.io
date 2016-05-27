---
layout: post
title:  "tips:编写邮件中的html文件"
date:   2015-12-03 17:31
categories: front-end css
---

最近在做的招聘模块里，有个需求是这样的，用户把中意的简历通过邮箱转发。

如果直接发送现有的简历详情页的话，在邮件里无法正常显示，查阅了一些资料，最后又写了单独一版邮件用的html文件。
目前常见的邮箱客户端有Gmail，Outlook等，[不同邮箱客户端对CSS样式的支持情况](https://www.campaignmonitor.com/css/)也不同。平时CSS样式一般写在header标签里或者外联一个CSS文件，但是在邮件中这些都会通通失效。
1.由于我们想要发送的内容是嵌套在客户端内的，所以它不会是完整的html文件，应该为<div>容器内的代码片段。并且由于邮箱自身设置了CSS样式，它可能会对我们的样式产生影响，所以我们应该尽量都使用行内样式。

```
<div style="width:600px;text-align:left;color:#000;font:normal 12px/15px arial,simsun;background:#fff;">
    内容区域
</div>
```

2.网页的布局必须使用表格

```
<div style="text-align:center;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tbody><tr><td>
        <div style="width:600px;text-align:left;font:12px/15px simsun;color:#000;background:#fff;">

            <!-- 水平居中的邮件 -->

        </div>
    </td></tr></tbody></table>
</div>
```

3.在引入图片时需要注意，有的客户端会默认不显示图片，所以要确保图片不显示的情况下，也不会影响正文的阅读

4.如果想测试自己写的html在邮件中效果，可以使用这个网站（https://litmus.com/）
这是我测试页面时的截图：

![](http://o7ts2uaks.bkt.clouddn.com/QQ%E5%9B%BE%E7%89%8720151202143934.png)