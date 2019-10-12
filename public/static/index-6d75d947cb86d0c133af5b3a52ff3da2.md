---
title: 2019.3 Webpack 升级改造小记
description: Current time front-end project build package optimization strategy
date: 2019-03-31T18:00:00.000Z
published: true
cover: ./2019-3-webpack.png
coverAuthor: Unknown
coverOriginalUrl: https://www.google.com
---

> 时间：2019.3

> Webpack 稳定版本为4, 正在 5 的 roadmap 中

> 记录一下当前时间对前端项目构建打包优化的策略

## 当前项目问题

我们的前端项目基本都是使用的是 [create-react-app](https://github.com/facebook/create-react-app) 的配置，冗余项太多，升级难。

在这个前提下，有个“极限项目”每次代码改动之后的 hot reload 都需要 30s，实在坐不住了，就动手做了打包升级。

![before](https://s2.ax1x.com/2019/06/01/V1dq29.png)

这次是从代码依赖相对简单，后续测试回滚负担小的后台管理系统下手的。

总结下当前的痛点为：

1. 项目启动慢
2. Hot reload 慢
3. Build 慢（上线前在后端项目里 build 时尤其明显）
4. 没分包，文件体积太大

## 解决手段

首先把 Webpack 版本从 3 升到 4，起码先享受上工具本身升级后带来的优越性

### 1.分离配置文件（与性能无关，与开发维护体验有关）

分成 base、dev、prod 三个 config 文件

把通用配置放到 base 中，dev 与 prod 中只放与这两种模式强相关的配置

### 2.HappyPack

![HappyPack](https://s2.ax1x.com/2019/06/01/V1db8J.png)

治疗各种编译慢

本地启动 server 编译时间： 30s => 10s

### 3.splitChunks 分包

![splitChunks](https://s2.ax1x.com/2019/06/01/V1dXK1.png)

这一功能在之前版本中是通过 [CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin/) 来进行的。

初步分成三个包，减小 main 包体积。

根据业务特点，其实可以做懒加载，但是注意不能分太多，增加 http 请求数得不偿失。后台管理项目体积目前不大，各模块也没什么业务上的明显区分，就没啥做懒加载的必要。

结果：包体积：6M => 3M

### 4.将第三方巨型包打入 externals

经过以上分包后，用 [BundleAnalyzerPlugin](https://github.com/webpack-contrib/webpack-bundle-analyzer) 看了下结果

发现有个非常显眼的巨型包 `echarts`

把它的 min.js 扔到公司 cdn 上，在 html 中直接引入：

```javascript
  externals: {
    echarts: 'echarts'
  }
```

效果也很明显，当时没截图，就不贴对比图了

### 5.gzip

![after](https://s2.ax1x.com/2019/06/01/V1dLvR.png)

通过引入 CompressionWebpackPlugin 插件，打出来 .js.gz 资源，在服务器已支持 gzip 的情况下，所加载资源体积（直接到了 1.3M）和时间提升非常明显

### 6.常规操作
还有很多升到 webpack@4 之后的常规操作：

> MiniCssExtractPlugin

> TerserPlugin

> OptimizeCSSAssetsPlugin

> 等等

随便搜搜，或者按图索骥去最新版的 create-react-app 源码里看看用了啥就行
