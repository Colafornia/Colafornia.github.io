---
layout: post
title:  "Make Shell/Git Better"
date:   2017-09-15 17:43
categories: shell git linux
---

## 1.起手式 oh-my-zsh
![oh-my-zsh](https://camo.githubusercontent.com/5c385f15f3eaedb72cfcfbbaf75355b700ac0757/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6f686d797a73682f6f682d6d792d7a73682d6c6f676f2e706e67)

zsh 被称作是最强大的 shell，而 oh-my-zsh 则是最流行的 zsh 配置文件，提供了丰富的主题以及大量插件，极大地扩展了 zsh 的功能。
可以无脑引入，便得到了最基本又好用的文件夹跳转，路径、命令、参数补全等便利操作。
推荐 plugin: git, [autojump](https://github.com/wting/autojump/wiki), [osx](https://github.com/robbyrussell/oh-my-zsh/tree/master/plugins/osx)

## 2.优化你的 Git
**① 美化 diff**
Git 自己的 git diff 还是蛮不好用也不好看的，文件名和 diff 内容不太好定位。
基于 [diff-so-fancy](https://github.com/so-fancy/diff-so-fancy) 我们可以做一些美化工作。

<!--more-->

```shell
npm install diff-so-fancy -g
```
然后在 `~/.gitconfig` 文件中编辑
```shell
[alias]
  d = "!f() { [ -z \"$GIT_PREFIX\" ] || cd \"$GIT_PREFIX\" && git diff --color \"$@\" | diff-so-fancy  | less --tabs=4 -    RFX; }; f"
```

可以参考 `diff-so-fancy` 中的推荐颜色做配置，然后通过 `git d` 命令就可以看到优化过的 diff 信息了
（git diff VS git d）
![diff](https://cloud.githubusercontent.com/assets/39191/13622719/7cc7c54c-e555-11e5-86c4-7045d91af041.png)

**② 美化 log**
git log 打出来的日志结构是完全扁平的，信息也不够全，依然是很难一眼找到自己想要的信息
依然是在 `~/.gitconfig` 中编辑：
```shell
[alias]
lg = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset)     %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all
```
这样信息清晰好看了很多，也可以看到每个提交所在的分支及其分化衍合的情况
(git log VS git lg)

![log](http://o7ts2uaks.bkt.clouddn.com/6E897688-D526-4DC5-A373-05FB41734A91.png)
![lg](http://o7ts2uaks.bkt.clouddn.com/84B43431-AB74-446F-8442-3DFCD8E8E8BE.png)

**③ 命令加强 [git-extras](https://github.com/tj/git-extras)**
TJ出品的 git 命令扩展集，应有尽有，要啥有啥，按需取用

## 3.终端复用神器 Tmux

Tmux 是 Linux 中一种管理窗口的程序，用 Tmux 的主要原因是它提供了一个窗体组随时存储和恢复的功能。
现在我们经常在开发时给一个项目起很多 server，webpack server 占一个 tab，mock server 占一个 tab，开的时候开半天，哪个断了还要挨个找。
或者，在用 SSH 登录远程服务器进行调试时，开了N多窗口，过了一会儿发现 `Broken Pipe` 管子裂了，又得重来。
Tmux 可以帮助我们 split 窗口以及进行终端复用保证工作现场不丢失。
[使用与安装方法](http://cenalulu.github.io/linux/tmux/)

## 4.给命令行使用的代理工具 [proxychains-ng](https://github.com/rofl0r/proxychains-ng)
用公司的 mnpm 镜像其实就基本不需要这个了。
自己搭服务器或者在家里办公有需求的话可以用。

## 5. commit message 规范工具 [commitizen](https://github.com/commitizen/cz-cli)
制定 Code Review 规范时看到了 [Egg.js 的代码贡献规范](https://eggjs.org/zh-cn/contributing.html)
其中总结了一条好的，有意义的 commit message 应该包含：

> ① type: 本次 commit 的类型(feat/fix/stype/perf....)
> ② scope: 改动范围
> ③ subject: 简要概述本次提交做了什么
> ④ body: 补充 subject, 可以不写
> ⑤ footer: 本次提交关联的 issue, task

手动按这个写还挺累挺难的，因此决定在团队中推行使用 commitizen
简单好用，立竿见影
![commitizen](https://github.com/commitizen/cz-cli/raw/master/meta/screenshots/add-commit.png)

## 6.好玩的 [thefuck](https://github.com/nvbn/thefuck)

![thefuck](https://raw.githubusercontent.com/nvbn/thefuck/master/example.gif)

一个好玩的小工具，给开发添点乐趣。
