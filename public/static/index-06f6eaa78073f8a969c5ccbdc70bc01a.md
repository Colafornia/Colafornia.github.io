---
title: How does data binding work in AngularJS
date: 2016-06-05T15:28:00.000Z
published: true
cover: ./angular.png
coverAuthor: Ehsan Motamedi
coverOriginalUrl: https://rangle.io
---

AngularJS 可以记住 value 值并且会把它和之前的 value 值进行比较。这就是基本的脏检查机制。如果某处的value 值发生了变化，那么 AngularJS 就会触发指定事件。

`$apply()`这个方法是用来处理AngularJS框架之外的表达式的，与它相辅相成的还有`$digest()`方法。一次digest就是一次完全的脏检查，它可以运行在所有的浏览器中。

### 关于$watch

每一次你在UI中绑定什么东西时你就会往`$watch`的队列中插入一条`$watch`，想象一下$watch就是在所监测的model中可以侦查数据变化的东西。比如说：

```javascript
User: <input type="text" ng-model="user" />
Password: <input type="password" ng-model="pass" />
```

在这里我们分别给两个input绑定了`$scope.user`和`$scope.pass`，就是说我们向`$watch`队列添加了两个`$watch`。

每一个绑定到了UI上的数据都会生成一个`$watch`，我们的模板加载完成时，也就是在linking阶段，Angular解释器会寻找每一个directive并且创造它们所需的`$watch`。

一个watcher包含了三个东西：

- 它正在监听的表达式。有可能是一个简单的属性名，也有可能是更复杂的东西

- 这个表达式目前已知的value值，它会与当前正在计算的表达式value值进行核对比较，如果监听到value值发生了改变将会触发函数并把`$scope`标记为`dirty`

- 被触发执行的函数

```javascript
$$watchers = [
    {
        eq: false, // 表明我们是否需要检查对象级别的相等
        fn: function( newValue, oldValue ) {}, // 这是我们提供的监听器函数
        last: 'Ryan', // 变量的最新值
        exp: function(){}, // 我们提供的watchExp函数
        get: function(){} // Angular's编译后的watchExp函数
    }
];
```

定义监听器的几种方法：
1.把$watch设置为`$scope`的一种属性:`$scope.$watch('person.username', validateUnique);`
2.插入angular表达式:`<p>username: {{person.username}}</p>`
3.使用类似于ng-model的指令来定义监听器:`<input ng-model="person.username />`




### 关于`$digest`和`$apply`
如果你点击一个按钮，或者在一个input框中输入，事件的回调函数会在javascript中运行，并且你可以做任意的DOM操作，当回调函数结束时，浏览器会相应地在DOM中做出改变。

当一个控制器/指令/等等东西在AngularJS中运行时，AngularJS内部会运行一个叫做`$scope.$apply`的函数。这个`$apply`函数会接收一个函数作为参数并运行它，在这之后才会在rootScope上运行`$digest`函数。

AngularJS的`$apply`函数代码如下所示：

```javascript
$apply: function(expr) {
    try {
      beginPhase('$apply');
      return this.$eval(expr);
    } catch (e) {
      $exceptionHandler(e);
    } finally {
      clearPhase();
      try {
        $rootScope.$digest();
      } catch (e) {
        $exceptionHandler(e);
        throw e;
      }
    }
}
```
由此可见，使用`$apply`可带参数。

`$digest`函数将会在`$rootScope`中被`$scope.$apply`所调用。它将会在`$rootScope`中运行digest循环，然后向下遍历每一个作用域并在每个作用域上运行循环。在简单的情形中，digest循环将会触发所有位于`$$watchers`变量中的所有watchExp函数，将它们和最新的值进行对比，如果值不相同，就会触发监听器。`$digest`函数检查`$watch`队列中的所有监听器最新的value值，一次`$digest`循环是被指令触发的。如果表达式新的value值与之前不同，就会调用监听器的函数，这个函数可能是重新编译部分的DOM，重新计算`$scope`的值，激活一个AJAX请求，或者任何你想做的事。

监听器函数可以修改`$scope`或是`父$scope`的其他属性，一旦有出发了一个监听器函数，我们就无法保证其它的`$scope`也是干净的，所以我们会再次执行整个digest循环。

`$apply`与`$digest`作用类似，`$apply`会使ng进入`$digest cycle`, 并从`$rootScope`开始遍历(深度优先)检查数据变更。不同之处在于`$apply`可以带参数，并且会触发作用域上的所有监控，`$digest`仅仅触发当前作用域和子作用域的监控。

### build your own dirty-checking
了解以上知识后，我们可以自己写一个具有基本功能的脏检测了。
首先定义Scope，然后扩展这个函数的原型对象来复制\$digest和\$watch

```javascript
var Scope = function( ) {
    this.$$watchers = [];
};

Scope.prototype.$watch = function( ) {

};

Scope.prototype.$digest = function( ) {

};
```

设置`$watch`函数，它接收watchExp和listener这两个参数，被调用时我们会把其push到`$$watchers`数组中。因此代码扩展为：

```javascript
Scope.prototype.$watch = function( watchExp, listener ) {
    this.$$watchers.push( {
        watchExp: watchExp,
        listener: listener || function() {}
    } );
};
```

如果没有传入listener的话我们会把它设置为空函数。
$digest用来检查新值旧值是否相等，如果不相等则触发监听器，不断循环这个过程，直到新值旧值相等。

```javascript
Scope.prototype.$digest = function( ) {
    var dirty;

    do {
            dirty = false;

            for( var i = 0; i < this.$$watchers.length; i++ ) {
                var newValue = this.$$watchers[i].watchExp(),
                    oldValue = this.$$watchers[i].last;

                if( oldValue !== newValue ) {
                    this.$$watchers[i].listener(newValue, oldValue);

                    dirty = true;

                    this.$$watchers[i].last = newValue;
                }
            }
    } while(dirty);
};
```

下一步我们需要创建一个作用域的实例，并把实例赋值给$scope，然后注册监听函数，使得更新`$scope`之后运行`$digest`

```javascript
var $scope = new Scope();

$scope.name = 'Ryan';

$scope.$watch(function(){
    return $scope.name;
}, function( newValue, oldValue ) {
    console.log(newValue, oldValue);
} );

$scope.$digest();
```

我们发现在控制台输出了`Ryan undefined`，成功了！
最后我们可以把`$digest`函数绑定到事件上，比如input元素的keyup事件，即意味着我们可以实现双向数据绑定！

```javascript
var Scope = function( ) {
    this.$$watchers = [];
};

Scope.prototype.$watch = function( watchExp, listener ) {
    this.$$watchers.push( {
        watchExp: watchExp,
        listener: listener || function() {}
    } );
};

Scope.prototype.$digest = function( ) {
    var dirty;

    do {
            dirty = false;

            for( var i = 0; i < this.$$watchers.length; i++ ) {
                var newValue = this.$$watchers[i].watchExp(),
                    oldValue = this.$$watchers[i].last;

                if( oldValue !== newValue ) {
                    this.$$watchers[i].listener(newValue, oldValue);

                    dirty = true;

                    this.$$watchers[i].last = newValue;
                }
            }
    } while(dirty);
};


var $scope = new Scope();

$scope.name = 'Ryan';

var element = document.querySelectorAll('input');

element[0].onkeyup = function() {
    $scope.name = element[0].value;

    $scope.$digest();
};

$scope.$watch(function(){
    return $scope.name;
}, function( newValue, oldValue ) {
    console.log('Input value updated - it is now ' + newValue);

    element[0].value = $scope.name;
} );

var updateScopeValue = function updateScopeValue( ) {
    $scope.name = 'Bob';
    $scope.$digest();
};
```

### 参考内容

* [RyanClark:How AngularJS implements dirty checking and how to replicate it ourselves](https://ryanclark.me/how-angularjs-implements-dirty-checking)
* [stackoverflow:How does data binding work in AngularJS?](http://stackoverflow.com/questions/9682092/how-does-data-binding-work-in-angularjs)
* [徐飞:Angular沉思录（一）](https://github.com/xufei/blog/issues/10)
* [angular-tips:$watch How the $apply Runs a $digest](http://angular-tips.com/blog/2013/08/watch-how-the-apply-runs-a-digest/)
* [IBM developerWorks:AngularJS 作用域与数据绑定机制](https://www.ibm.com/developerworks/cn/opensource/os-cn-AngularJS/)




