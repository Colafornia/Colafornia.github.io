---
layout: post
title:  "避免脏pr：使用git rebase避免无谓的merge"
date:   2016-06-09 11:51
categories: git
---

### 问题复现与解决

在团队开发中，由于git使用的不够合理规范，开pr之后就会发现其中掺杂着若干merge的commit:

![commit history](http://o7ts2uaks.bkt.clouddn.com/git-merge.jpg)

事实上我们本地的branch和远端的branch会同步地非常频繁，这两个分支几乎完全同步，所以以上的merge动作是没有必要的。并且如果一个pr中存在merge，那么pr的files changed中就会看到merge目标的代码。这会给代码 Review 的工作代码困扰。因为代码reviewm时通常是看一个pr修改了哪些代码，现在pr中满是merge目标的代码，是没办法review的。

想要解决这个问题的关键是永远不要merge主分支，而是rebase主分支。

<!--more-->

```
git fetch origin master
# git merge origin/master # 不要这么干
git rebase origin/master
```

```
# git pull origin master # 不要这么干
git pull --rebase
```

主要是因为`git pull`这一git命令实际执行了`git fetch`和`git merge FETCH_HEAD`两条指令。因此不要直接使用`git pull`来更新代码。`git pull --rebase `指令的意思是：

1. 把本地repo自从上次pull之后的变更暂存起来
2. 回到上次pull时的情况
3. 套用远端的变更
4. 套用第一步中暂存的本地变更

### 关于git rebase
`git rebase`和`git merge`做的事是一样的，都是把一个分支合并到另一个分支，只是方式不同，我们应该在不同情况下做出更合理的选择。我们做一下对比。
假设合并前是这样：

>D---E master
     /
A---B---C---F origin/master

使用merge合并后：

>D--------E  
     /          \
A---B---C---F----G   master, origin/master

适应rebase合并后：

>A---B---C---F---D'---E'   master, origin/master

由此可见，使用rebase其实是重写了提交记录，并使我们的项目历史会非常整洁，它不想git merge那样引入不必要的合并提交，rebase使得项目历史呈线性，便于通过git log查看项目历史。

### A rebase-based workflow
1.新建分支

> git checkout master
  git pull    #更新master
  git checkout master -b test   #从master创建feature分支
  git push -u origin test:test
  \#把分支push到远程，本地分支名在前，-u是–set-upstream-to 的简写，设置追踪分支

2.更新分支

从master更新

> git pull --rebase origin master #此方法不会更新本地master分支

从test更新

> git pull --rebase #需先设置追踪分支

3.完成后回到主分支

> git checkout master
  git pull     #这里不会导致出现merge commit
  git rebase test     #把commits拉取到主分支
  git push

### 处理脏pr
这里只介绍一个比较好理解的方法，从主分支上新建一个干净的分支，然后把需要搞干净的pr中所有非merge的commit都cherry-pick到新分支。

> git fetch origin master:new-feature
  git checkout new-feature
  git cherry-pick COMMIT_HASH_1
  git cherry-pick COMMIT_HASH_2
  ...
  git cherry-pick COMMIT_HASH_N
  
cherry-pick命令"复制"一个提交节点并在当前分支做一次完全一样的新提交。
注意cherry-pick的顺序应是commit **从旧到新** 的顺序，否则会一直出现无数冲突。

### 参考内容
* [RandyFay:A Rebase Workflow for Git](https://randyfay.com/node/91)
* [stackoverflow:When do you use git rebase instead of git merge?](http://stackoverflow.com/questions/804115/when-do-you-use-git-rebase-instead-of-git-merge)
* [stackoverflow:git workflow and rebase vs merge questions](http://stackoverflow.com/questions/457927/git-workflow-and-rebase-vs-merge-questions)
* [git-recipes:代码合并:Merge、Rebase的选择](https://github.com/geeeeeeeeek/git-recipes/wiki/5.1-%E4%BB%A3%E7%A0%81%E5%90%88%E5%B9%B6%EF%BC%9AMerge%E3%80%81Rebase%E7%9A%84%E9%80%89%E6%8B%A9)
* [WEB研究所:git 实践之避免 merge](https://www.web-tinker.com/article/21112.html)







