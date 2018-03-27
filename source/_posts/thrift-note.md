---
layout: post
title:  "Thrift 速记"
date:   2018-3-27 11:11
categories: thrift
---

### 基本概念

`Apache Thrift` 是一款 `RPC` (跨语言的服务)框架，传输数据采用二进制格式，相对 XML 和 JSON 体积更小，对于高并发、大数据量和多语言的环境更有优势。

![](https://bulldog2011.github.io/images/luxun/communication_components.png)

### RPC 是什么

`Remote Procedure Call` 即远程过程调用。

> RPC 是一个 `计算机通信协议`。该协议允许运行于一台计算机的程序调用另一台计算机的子程序，而程序员无需额外地为这个交互作用编程。 —— 中文维基

<!--more-->

远程过程调用总是由客户端对服务器发出一个执行若干过程请求，并用客户端提供的参数。执行结果将返回给客户端。

标准化的 RPC 大部分采用接口描述语言（Interface Description Language，IDL），方便跨平台的远程过程调用。

相比于 [RESTful](http://www.ruanyifeng.com/blog/2011/09/restful)，RPC 的优势在于：

- 采用二进制的传输格式，相比于 RESTful 采用的 JSON 格式体积更小速度更快
- 支持多种传输协议与传输格式
- 支持同步和异步通信

### Thrift 文件概览
以 `.thrift` 为后缀的文件，是服务消费方（Consumer）与服务提供方（Provider）之间用来进行接口描述（IDL）的文件。

#### 1.代码示例：

```java
// thrift 文件一般包含两部分的内容
// 1) 类型说明，类似于前后端所约定的请求对象有哪些字段值
// 2) 接口服务 Service 说明，包含一系列的方法，类似于前后端之间约定的请求方法
// IDL 中可以定义以下一些类型：基本数据类型，结构体，容器，异常、服务
// 以下 IDL 定义了一个叫 Sample 的服务，其有一个叫 getOrderById 的方法

struct Order {
  1:i64 id;
  2:i32 status;
}
service Sample
{
  Order getOrderById(1:i64 id);
}
```

#### 2.基本类型：

- `bool`: 布尔类型

- `byte`: 有符号字节

- `i16/i32/i64`: 16/32/64位有符号整型

- `double`: 64位浮点数

- `string`: 未知编码或者二进制的字符串

#### 3.容器：

- `list<t1>`: 排序数组，可以重复

- `set<t1>`: 集合，每个元素唯一

- `map<t1, t2>`: key/value 键值对（key 的类型是 t1且 key 唯一，value 类型是 t2）

#### 4.通过 IDL 文件生成代码

通过 IDL 一般生成两种类型的文件，1）类型文件 2）接口文件

形如 `xxx_types.js` 即是将 IDL 文件中的类型说明输出为类型文件。

形如 `xxxService.js` 即是接口文件，服务消费方通过接口文件来创建和 Provider 的连接。

在通信的过程中，thrift 会对数据进行序列化后传递给另一方，在接收方则对数据进行反序列化后映射成对应的语言对象。于是，我们就可以不关心数据格式和类型转换，直接调用远程服务了。


### Node Thrift 应用

#### 1.安装

除了[官网下载](http://thrift.apache.org/docs/install/os_x)，Mac 下比较方便的安装方式是使用 homebrew：

`brew install thrift`

#### 2.生成代码

语法为 `thrift --gen <language> <Thrift filename>`

生成 Node.js 代码的话：

`thrift --gen js:node Service.thrift`

在实际项目中一般会封装多个 shell 脚本来做这件事，方便维护与使用。

#### 3.使用

Apache 已经推出了 [官方的 Node.js 库](http://thrift.apache.org/tutorial/nodejs)

Client:

```javascript
// 此示例代码大致浏览即可
var thrift = require('thrift');
var Calculator = require('./gen-nodejs/Calculator');
var ttypes = require('./gen-nodejs/tutorial_types');
const assert = require('assert');

var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection("localhost", 9090, {
  transport : transport,
  protocol : protocol
});

connection.on('error', function(err) {
  assert(false, err);
});

// Create a Calculator client with the connection
var client = thrift.createClient(Calculator, connection);


client.ping(function(err, response) {
  console.log('ping()');
});


client.add(1,1, function(err, response) {
  console.log("1+1=" + response);
});
```

这样，就可以调用其它语言编写的服务了。

公司内部有一个封装好了连接过程的 thrift 包，使用起来更简单些，把端口号，ip 等信息传进去即可使用。

更多语言和使用示例可参考 [thrift-tutorial](http://thrift-tutorial.readthedocs.io/en/latest/usage-example.html)

### 微服务概览

一直以来都是使用 HTTP 协议进行接口调用，只知道有一些“后端之间的服务调用”是使用 Thrift 接口，没有想过前端项目中也会直接调用。

之所以会用到 Thrift，是因为公司采用的是“面向服务的架构”，我们所开发的 Web 应用也是一个服务，其中还会依赖其它服务。

`SOA（Service-Oriented Architecture，面向服务的架构）`是一种设计方法，其中包含多个服务，而服务之间通过配合最终会提供一系列功能。一个服务通常以独立的形式存在于操作系统进程中。服务之间通过网络调用，而非采用进程内调用的方式进行通信。

微服务架构是 SOA 的一种特定方法。

![microservices](/images/2018-3-microservices.png)

更多内容参考[《微服务设计》](https://book.douban.com/subject/26772677/)
