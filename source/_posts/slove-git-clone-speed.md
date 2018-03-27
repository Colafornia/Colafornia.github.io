---
layout: post
title:  "解决 git clone 慢的问题"
date:   2018-3-9 16:20
categories: git
---

![git-cover](/images/2018-3-git.png)

年后这段时间连续遇到了两次 git clone 龟速缓慢，一天之内都 clone 不下来的问题。这里记录一下解决方法和原理。

git clone 太慢的常规原因有两种，**第一种是 git 仓库本身导致的，第二种是我们使用者的网络问题**。

<!--more-->

## 一、Git 仓库体积太大

大体积 Git 仓库一般也有两种，一是 commit 历史长，协作分支多导致的仓库自身体积变大，二是有过多的二进制文件。

#### 1. commit 历史长，协作分支多导致的仓库自身体积变大

Git 会把文件的每一个差异化版本都存储起来，随着 commit 越来越多，每一次小的修改 Git 都会存储一个新的快照，自然版本库体积也会越来越大。

##### ① 浅克隆 shallow clone

`git clone --depth n git://someserver/somerepo`

很多时候我们只对版本库的最近几次提交感兴趣，就可以通过 shallow clone 仅仅克隆最新的 n 条记录到本地，节省了非常多的时间。这种方法适用于当我们想对查看研究某远端库时使用，如果想在浅克隆的库上推送提交，会有一些限制。

> 通过浅克隆方式克隆出来的版本库，每一个提交的 SHA1 哈希值和源版本库的相同，包括提交的根节点也是如次，但是 git 通过特殊的实现，使得浅克隆的根节点提交看起来没有父提交。正因为浅克隆的提交对象的 SHA1 哈希值和源版本库一致，所以浅克隆版本库可以执行 git fetch 或者 git pull 从源版本库获取新的提交。

#### ② 只 clone 一个分支

`git clone URL --branch branch_name --single-branch [folder]`

一般可以指定只 clone master 分支到本地，同样了节省了很多时间。

#### 2. 有过多的二进制文件

Git 主要适用于对文本文件进行版本控制，并不能很好地处理二进制文件的增量提交，每次更新一个二进制文件就会把这份文件的完整内容存储一份，随着更新修改越来越多，版本库的体积也会非常大，影响代码的拉取速度（这应该也是游戏团队主要还在使用 SVN 的原因）。

这种情况较少会发生在前端项目仓库中，针对这种原因造成的 git clone 慢依然可以通过上面两种方法来节省克隆时间，除此之外在此简单介绍一下**如何解决由于二进制文件造成的版本库体积过大问题**。

#### ① 稀疏检出 sparse checkout

通过 Git 在 1.7.0 版本之后提供的稀疏检出功能，可以设置只 checkout 出自己想要的内容。此时就可以通过它来跳过二进制文件。Worktree 中就只有我们指定检出的文件了。

```
git config core.sparseCheckout true // 开启稀疏检出功能
echo "path1/" >> .git/info/sparse-checkout // 指定检出路径
```

> 原理是 git 在暂存区为每个文件提供一个名为 `skip-worktree` 标识位，如果标识位开启则无论工作区对应的文件存在与否，是否被修改，git 都认为该文件的版本是最新的，没有变化。

#### ② 大文件储存 Git LFS

Github 和 Gitlab 目前都已经使用 [Git LFS](https://git-lfs.github.com/) 来支持二进制大文件的版本控制，将二进制文件存在版本库之外，在版本库内使用文本指针来代替。

![Git LFS](https://git-lfs.github.com/images/facebook-promo.png)

## 二、网络被墙

我这两次遇到的问题其实都是网络问题。春节前后辽宁那边的网络都是这个状况，年后回来我司的网络也被 github 墙了。这里介绍一下给 Git 设置代理的方法。

git clone 有两种协议可供选择：

![git clone](/images/git-clone-shot.jpeg)

这里介绍的是针对 HTTPS 协议的代理。

首先来看一下自己的 SS 代理设置 socks5 监听端口是多少，比如我的端口就是1086：

![ss](/images/ss.jpeg)

```shell
git config --global http.https://github.com.proxy socks5://127.0.0.1:1086
git config --global https.https://github.com.proxy socks5://127.0.0.1:1086
```

这个设置只代理了 github，不会对国内仓库使用代理。

#### 参考内容

* [GotGit： 稀疏检出和浅克隆](https://www.worldhello.net/gotgit/08-git-misc/090-sparse-checkout-and-shallow-clone.html)
* [segmentfault：如何为 Git 设置代理](https://segmentfault.com/q/1010000000118837)