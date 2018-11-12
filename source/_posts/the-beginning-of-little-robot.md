---
layout: post
title:  "兴趣驱动，写一个前端资讯推送服务"
date:   2018-9-11 12:39
categories: open-source
---

![cover](https://i.loli.net/2018/09/11/5b97628baa760.png)

去年年底开始写的一个小项目，断断续续做了些优化，在此简单的记录一下。

<!--more-->

## 源头

起源是之前一直没什么机会接触到 Node 项目，工作中接触到的也仅限于用 Node 写脚本，做一些小工具，与服务器上跑的 Node 服务相差甚远。所以想写一个在服务器上跑的 Node 小项目练手。

一直喜欢用 RSS 订阅资讯这种方式，简单高效，与其每天不定时地接收推送，打开各网站 App 来接收资讯，不如自己拿到主动权集中在同一时间段统一阅读。这样避免了每天不定时接受信息的焦虑堆积，但是又常常想不起来打开😅，过了一周打开 Reeder，发现累积的未读资讯又爆炸了，人真是很难满足。

于是决定自己搞个资讯推送服务吧，满足自己的核心诉求，**每个工作日早上 10 点微信推送 RSS 前端资讯的更新**，这样就可以在每天抵达工位的时候舒舒服服浏览一下新鲜事，挑一些有用的存起来慢慢研读。

项目仓库： https://github.com/Colafornia/little-robot

推送大概长这样：

<img src="https://i.loli.net/2018/09/11/5b9778172df20.jpeg" width="600">

扫码获取推送服务：

<img src="https://camo.githubusercontent.com/1b160b38bf5c5795240a3a661f9f74e6d66f627e/68747470733a2f2f692e6c6f6c692e6e65742f323031382f30392f30352f356238666130383264623037302e706e67" width="280">

现在推送源主要是各厂的知乎专栏，大佬们的个人博客，掘金前端热门文章，都是我自己的个人口味。

下面来讲一下开发（与自己给自己加需求）历程。

## 开始

最开始感觉这个需求是很简单的，具体操作可以分解为：

1. 写一个配置文件，把我想抓取的 RSS 源地址写在里面
2. 找一个能解析 RSS 的 npm 包，遍历配置文件里的源，解析之后处理数据
3. 仅筛出在过去 24 小时内更新的文章，把数据处理一下，汇总成一段字符串，用微信推送
4. 以上写出的脚本通过定时任务跑起来，done！

最后选择了 [rss-parser](https://github.com/bobby-brennan/rss-parser) 作为解析工具包，[PushBear](https://pushbear.ftqq.com/admin/#/) 作为推送服务，[node-schedule](https://github.com/node-schedule/node-schedule) 任务调度工具写出来了一版。

然后就发现自己知识的匮乏了，没有考虑到脚本部署到服务器上时，进程守护的问题，于是研习了一波 [pm2](https://github.com/Unitech/pm2)，完美完成任务。

## 过渡

项目写到这里其实是可以凑和用了，但是看起来很 low 很难受。主要问题有：

1. 当时 RSS 源大概有四五十个，一次性遍历解析所有的源经常会有超时或者出错的
2. RSS 源写在配置文件里，每次想添加、修改源都需要改代码，很 low
3. [PushBear](https://pushbear.ftqq.com/admin/#/) 这个推送服务只能存储三天内的推送，三天前，一周前的推送内容都看不了，这也很难受
4. 掘金的 RSS 源内容不多，也不是按照热门程度排序的（也可能是我姿势不对😅），不太符合要求

第一点稍微有点复杂，可能现在解决的方案依然很原始。出现第一个问题一是需要控制请求的并发数量，二是 RSS 源本身有一定的不稳定性。目前的解决方案是：

1. 把抓取任务和推送任务分开，预留出可以循环抓取三次的时间，后面两次只抓取之前失败的源
2. 用 [async](https://github.com/caolan/async) 的 `mapLimit` 和 `timeout` 方法设置最大并发数量和超时时间

大致代码如下（有一些细节处理没贴上来）：

```javascript
// 抓取定时器 ID
let fetchInterval = null;
// 抓取次数
let fetchTimes = 0;
function setPushSchedule () {
    schedule.scheduleJob('00 30 09 * * *', () => {
        // 抓取任务
        log.info('rss schedule fetching fire at ' + new Date());
        activateFetchTask();
    });

    schedule.scheduleJob('00 00 10 * * *', () => {
        // 发送任务
        log.info('rss schedule delivery fire at ' + new Date());
        let message = makeUpMessage();
        log.info(message);
        sendToWeChat(message);
    });
}
function activateFetchTask() {
  fetchInterval = setInterval(fetchRSSUpdate, 120000);
  fetchRSSUpdate();
}
function fetchRSSUpdate() {
    fetchTimes++;
    if (toFetchList.length && fetchTimes < 4) {
        // 若抓取次数少于三次，且仍存在未成功抓取的源
        log.info(`第${fetchTimes}次抓取，有 ${toFetchList.length} 篇`);
        // 最大并发数为15，超时时间设置为 8000ms
        return mapLimit(toFetchList, 15, (source, callback) => {
            timeout(parseRSS(source, callback), 8000);
        })
    }
    log.info('fetching is done');
    clearInterval(fetchInterval);
    return fetchDataCb();
}
```

这样基本解决了 90% 以上的抓取问题，保证了脚本的稳定性。

针对 RSS 源写在配置文件里，每次想添加、修改源都需要改代码的问题，解决方法很简单，把源配置写到 MongoDB 里也就好了，有一些 GUI 软件可以直接在图形界面来添加、修改数据。

为了解决推送服务只能存储三天内的推送，决定新增一个每周五的周抓取任务，抓取一周内的新文章，把内容作为 issue 发到仓库。也还算是一个解决方案。

<img src="https://i.loli.net/2018/09/11/5b972ffa920a5.jpeg" width="480">

针对掘金的 RSS 源问题，最后决定直接调用掘金的接口来取数据，这就可以随心所欲按自己的需求来了，每天只抓取❤️点赞数在 70 以上的文章。

顺便给抓取的文章时间范围加了一个偏移值，避免筛掉质量好但是由于刚刚发布点赞较少的文章。感觉自己棒棒哒~

```javascript
function filterArticlesByDateAndCollection () {
    const threshold = 70;
    // articles 是已按❤️数由高到低排序的文章列表
    let results = articles.filter((article) => {
        // 偏移值五小时，避免筛掉质量好但是由于刚刚发布点赞较少的文章
        return moment(article.createdAt).isAfter(moment(startTime).subtract(5, 'hours'))
            && moment(article.createdAt).isBefore(moment(endTime).subtract(5, 'hours'))
            && article.collectionCount > threshold;
    });
    // 掘金文章最多收录 8 篇，避免信息爆炸
    return results.slice(0, 8);
}
```

在这个期间也充分感受到了日志的重要性，在数据库里新增了一个表用来存每天的推送内容。

另外在 [PushBear](https://pushbear.ftqq.com/admin/#/) 上新添加了一个 Channel 来给自己推送日志，每天在抓取任务完成后，先给我发送一下抓取到的内容，如果发现有任何问题，我可以自己登服务器紧急修复一下（这么想来还是很 low 😅）。

## 升级

做完以上改动之后，脚本稳定地跑了快半年，这期间我也一直在忙着搬砖，没什么精力再来改造它。

一直没做推广，但某天突然发现已经有了三十多个用户在订阅这个服务，于是良心发现，本着对用户负责（也是自己有了新的想练习的技术👻）,就又做了一次改造。

此时项目的问题有：

1. 没有文章去重，如果文章在知乎专栏发了，掘金也发了，作者个人博客也发了的话，就相当于会重复出现几次
2. 推送的时间间隔不精确，都是当前时间的过去 24 小时来筛的
3. 脚本直连数据库进行存取操作也不太好，感觉这个形式做成 server，对外暴露 api 更合理（等哪天想写个 RSS 阅读器也就用上了）
4. 每次代码有更新，依赖有更新，都 ssh 上服务器然后 `npm install` 感觉也不太专业，有提升空间（其实就是想用 `docker` 了）

1，2 问题很好解决，每次抓取之前先查一下日志，上次推送的具体时间。每抓到新文章时，再与最近 7 天日志里的文章比对一下，重复的不放到抓取结果中，也就解决了。

对于问题 3，于是决定搭建 Koa Server，先把从 MongoDB 读取推送源，存取推送日志变成 api。

目录结构如下，添加 `Model` 与 `Controller`。把 RSS 抓取脚本与掘金爬虫放到 task 文件。

<img src="https://i.loli.net/2018/09/11/5b97386469e47.jpeg" width="400">

没什么难点，就可以调用 api 来获取 RSS 源了：

<img src="https://i.loli.net/2018/09/11/5b9739468cad0.jpeg" width="500">

此时想到了一个重要问题，**身份验证**。肯定不能把所有 api 都随意暴露出去，让外界可以任意调用，这也就相当于把数据库都暴露出去了。

最终决定用 `JSON Web Token（缩写 JWT）` 作为认证方案，主要原因是 JWT 适合一次性、短时间的命令认证，目前我的服务仅限于服务器端的 api 调用，每天的使用时间也不长，无需签发有效期很长的令牌。

Koa 有一个 [jwt](https://github.com/koajs/jwt) 的中间件

```javascript
// index.js
app.use(jwtKoa({ secret: config.secretKey }).unless({
    path: [/^\/api\/source/, /^\/api\/login/]
}))
```

加上中间件后，除了 `/api/source` 与 `/api/login` 接口就都需要经过 jwt 认证才能访问了。

因此写了一个 `/api/login` 接口，用于签发令牌，拿到令牌之后，把令牌设置到请求头里就可以通过认证了：

```javascript
// api/base.js
// 用于封装 axios
// http request 拦截器
import axios from 'axios';
const config = require('../config');
const Instance = axios.create({
    baseURL: `http://localhost:${config.port}/api`,
    timeout: 3000,
    headers: {
        post: {
            'Content-Type': 'application/json',
        }
    }
});
Instance.interceptors.request.use(
    (config) => {
        // jwt 验证
        const token = config.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
```

如果请求头里没有正确的 token，则会返回 `Authentication Error`。

至于问题 4，现在服务比较简单，也只在一个机器上部署，手动登机器 npm install 问题还不大，如果机器很多，依赖项也复杂的话，很容易出问题，具体参见[科普文：为什么不能在服务器上 npm install ？](https://zhuanlan.zhihu.com/p/39209596)。

于是决定基于 `Docker` 做构建部署。

```dockerfile
FROM daocloud.io/node:8.4.0-onbuild
COPY package*.json ./
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install
RUN echo "Asia/Shanghai" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata
COPY . .
EXPOSE 3001
CMD [ "npm", "start", "$value1", "$value2", "$value3"]
```

用的比较简单，主要就是负责安装依赖，启动服务。需要注意的主要有两点：

1. 国内拉去外网的镜像很慢，像 Node 官方的镜像我都拉了好久都没拉下来，这样的话推荐使用国内的镜像，比如我用的 DaoCloud，还有阿里云镜像等等
2. 由于推送服务是对时间敏感的，基础镜像的时区并不是国内时区，要手动设置一下

本次优化大概就到这里了。接下来要做的可能是提供一个推送历史查看页面，优先级不是很高，有时间再做吧（顺便练习一下 Nginx）。

现在的实现方案可能还是有很不合理的地方，欢迎提出建议。
