---
layout: post
title:  "解决中文拼音输入法在input监听的问题"
date:   2017-08-22 20:16
categories: front-end javascript
---

### 一、问题
![cover](/images/chinese-pinyin.gif)

在通过监听用户输入，将输入作为 Keyword 进行查询时（做了防抖）发现有如图问题，使用中文拼音输入法时，未选中所要的字词前，会自动将输入法分词过的拼音作为文本，由于实时监听输入，就存在将 ce'shi 作为 keyword 查询的问题了。
在这里，前端需要对拼音输入法的这种情况进行处理。
<!--more-->

### 二、TL;DR 解决方法

可以借鉴 `Vue.js` 的处理方法，引入 `compositionstart` 和 `compositionend` 事件来捕获 `IME(input method editor)` 的启动和关闭。
这两个事件，目前是IE9+支持，移动端 Safari < 10.2 & UIWebView 暂时无法触发，因此可以作为 PC 端产品的靠谱方案。
实现：

```javascript
var node = document.querySelector('._orgtree');
if (node) {
  var fireLock = false;
  node.addEventListener('compositionstart', function () {
      fireLock = true;
  })
  node.addEventListener('compositionend', function () {
      fireLock = false;
  })
  node.addEventListener('input', function () {
      if (!fireLock) {
          searchOrgTree();
      }
  });
}
```

### 三、怎么更放心地用

这里还是看看 Vue.js 的代码：[src/platforms/web/runtime/directives/model.js](https://github.com/vuejs/vue/blob/c90b140e80f1bd5d01c733a5bd9fa6e9cb3c2b4d/src/platforms/web/runtime/directives/model.js)

```javascript
// 只贴我们用到的
export default {
  inserted (el, binding, vnode) {
    if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd)
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart)
          el.addEventListener('compositionend', onCompositionEnd)
        }
      }
    }
  }
}

function onCompositionStart (e) {
  e.target.composing = true
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) return
  e.target.composing = false
  trigger(e.target, 'input')
}

function trigger (el, type) {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
```


> For languages that require an IME (Chinese, Japanese, Korean etc.), you’ll notice that v-model doesn’t get updated during IME composition. If you want to cater for these updates as well, use input event instead.

Vue.js 在编写 `v-model` 这一核心指令时用到了 `compositionstart` 和 `compositionend`  这两个事件，保证在输入框交互过程中的文本并不会触发 `v-model` 更新，在源码中也是针对 Safari 做了兼容处理。

