---
layout: post
title:  "Angular  ui-router"
date:   2015-11-23 20:17
categories: front-end javascript
---
UI-Router是Angular-UI提供的客户端路由框架，解决了原生ng-route的不足之处，它们的工作原理类似，区别的是ui-router只关注状态。
####原生ng-route的不足之处：
- 视图不能嵌套。这意味着$scope会发生不必要的重新载入。
- 路由配置只有一个模板，无法配置多个，同一URL下不支持多个视图。
####显而易见，ui-router的优势为：
- 提出了"$state"的概念，通过改变\$state来进行URL的跳转和路由
- 将web界面的设计分块，在整个用户界面和导航中，一个状态对应于一个页面位置
> 关于ui-router最重要的参考资料是 [ui-router的官方文档](http://angular-ui.github.io/ui-router/site/#/api/ui.router)（http://angular-ui.github.io/ui-router/site/#/api/ui.router）内容十分详尽。

####代码实现
1.引入文件：在index.html中除了angular.js之外，还要引入ui-router的文件ui-router.js
```
 <script src="js/angular.js"></script>
  <!-- Include the ui-router script -->
  <script src="js/angular-ui-router.min.js"></script>
  ```
  2.在模块中引入依赖
```
  var app = angular.module('routerApp', ['ui.router']);
```
3.在html文件中使用ui-view指令，用来告诉$state该在哪插入template
4.添加触发器ui-sref（ui-sref=$state），你可以把它放在a标签内，button标签内，触发之后它就会在ui-view的位置更新对应的视图，选择不同的html文件来填充进包含ui-view的标签内。
5.最后我们来新建一个js文件用来配置路由。
####配置路由
示例：
```
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/page1");
	$stateProvider
        .state('page1', {
                     url: '/page1',
                     templateUrl:'viewpage1.html',
    }).state('page2', {
                     url: '/page2',
                     templateUrl:'view/page2.html',
        })
        })
```
在这个示例路由中，我们先定义了默认页，就是url为空或者是没有在路由配置中查询到相应状态名的情况下，默认展示的页面。
- state的第一个参数（如page1,page2）是状态名，可以将它放在触发器中用来触发视图更新。
- 第二个参数url就是，当我们在浏览器地址栏中输入xx.com/index.html/url时，页面显示的是我们配置的相应的template。
-第三个参数是用来设置模板，有两种方法。第一种使用"template"，指定一段Html字符串。第二种方法是像示例路由中那样，使用"templateUrl"来指定模板文件。在这种方法中，我们也可以由函数来返回。（我们可以用这种方法来传递参数，后文再讲）
```
$stateProvider.state('contacts', {
  templateUrl: function (stateParams){
    return '/partials/contacts.' + stateParams + '.html';
  }
})
```
####触发激活
路由配置完了，我们现在回到触发器上。上文讲到我们可以用ui-sref来作触发器。
比如，用\<a href="" ui-sref="page1">进入page1\</a>表示一个链接。点击它的话，我们的视图就会更新为view/page1.html的内容了。（在工程中最好把用以更新的视图的文件与index.html分开存储便于管理，在我的招聘项目中是把这些页面都存在view文件夹中，像index.html,login.html这些文件存在外面）
除了上面这种方法，我们还有两种方法来更新视图。
- 调用$state.go()方法：这是ui-router特有的方法，可以用在js文件中手动更新视图。
```
$state.go('page1');  // 指定状态名
$state.go('page1l', {pageId: 15});  //含参， 相当于跳转到 /page1/42
```       
- 在浏览器地址栏中直接输入url，这是最直接的方法。

####传递参数
先给个应用场景好了，在一个简历列表页中，我想点击不同的简历名，就跳转到相应的简历详情。在这一过程中必然要传递参数，这样才能在简历详情页中看到自己想要浏览的那份简历。
从头开始看，我们有一个简历详情页面view/openResume.html，还有以一个简历列表页view/resumeList.html
在view/resemeList.html中，我们写入如下一行：
```
<a href="" ui-sref="openResume({resumeId:7})">王大锤的简历</a>
```
然后，配置路由是这样的：
```
state('openResume', {
        url: '/openResume/{resumeId}',
        templateUrl:function($stateParams){
            console.log($stateParams);
            return 'view/openResume.html'
        }
    })
```
我们点击链接“王大锤的简历”，发现视图更新了，浏览器地址栏变成了：

![](http://h.picphotos.baidu.com/album/s%3D1100%3Bq%3D90/sign=94456190d658ccbf1fbcb13b29e8874f/10dfa9ec8a136327454b0a11968fa0ec08fac76a.jpg)


在控制台中我们看到了console出的语句


![控制台](http://g.picphotos.baidu.com/album/s%3D1100%3Bq%3D90/sign=2efe6530750e0cf3a4f74afa3a76c96e/71cf3bc79f3df8dc6fac47b3ca11728b4710287b.jpg)


说明如果想在路由中传递参数，就是加一个括号，里面放一个我们要传递的对象即可。当然了我们可以通过很多方法完成动态传参的需求~
####嵌套视图
接下来我们来了解一下ui-router区别于ng-router最强大的功能，**嵌套视图**。
在示例路由的基础上，我们新建一个文件page1-main.html
现在，在index.html中：\<a href="" ui-sref="page1">进入page1</a>
在page1.html中，：\<a href="" ui-sref="page1.main">进入page1-main</a>
路由变成：
```
.state('page1',{
                       url : '/page1',
                       templateUrl : 'view/page1.html'
               })
               .state('page1.main',{
                       url : '/main',
                       templateUrl : 'view/page1-main.html'
               })
```
这样我们就完成了嵌套视图，在ui-router中我们可以进行任意层级的嵌套，在page1-main的同级，子级我们依然可以再嵌套别的视图。
####多个视图
ui-router的另一优越性在于，一个$state下可以有多个视图，它们有各自的模板和控制器。
```
<div ui-view></div>
<div ui-view="chart"></div> 
<div ui-view="data"></div>
```
路由：
```
$stateProvider.state("home", {
  views: {
    "": {
      template: "<h1>HELLO!</h1>"
    },
    "chart": {
      template: "<chart_thing/>"
    },
    "data": {
      template: "<data_thing/>"
    }
  }    
})
```