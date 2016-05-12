---
---
$(function() {
  $.vegas('slideshow', {
    backgrounds: [
      { src: '/assets/images/slider/slider01.jpg', fade:1000},
      { src: '/assets/images/slider/slider02.jpg', fade:1000},
      { src: '/assets/images/slider/slider03.jpg', fade:1000},
      { src: '/assets/images/slider/slider04.jpg', fade:1000}
    ]
  })('overlay', {
    src:'/assets/images/slider/vegas.png'
  })
  createCourseList()
  $('#loading').delay(500).fadeOut();
	$('.loader').delay(1000).fadeOut('slow');
});

$('#s-next').click (function (){
  $.vegas('next');
});

$('#s-prev').click (function (){
  $.vegas('previous');
});

// 平滑滚动
$('.goto').click(function(){
	var t = $(this).attr('href')
	$('html, body').animate({scrollTop: $(t).offset().top - 75}, 400)
})

// 导航
function pageScroll(){
  let body = document.body
  if((body.scrollTop + 75) > body.clientHeight ) {
    body.className = 'body-white';
  } else {
    body.className = '';
  }
}

//hover mask
function leave(arg){
  arg.children('.img-mask').removeClass('show').addClass('hide');
  arg.children('.text-show').removeClass('text-show').addClass('text-hide');
}

function hover(arg) {
  arg.children('.img-mask').removeClass('hide').addClass('show');
  arg.children('.text-hide').removeClass('text-hide').addClass('text-show');
}

// 课程
let courseData = [
  {
    title: '艺术',
    src: '/assets/images/slider/slider01.jpg',
    content: '<h4>艺术 - title</h4><hr><p>艺术 - 沟通能力包含着表达能力、争辩能力</br>倾听能力和设计能力</br>（形象设计、动作设计、环境设计）</br>沟通能力看起来是外在的东西，而实际上是个人素质的重要体现它关系着一个人的知识</p>'
  }, {
    title: '沟通',
    src: '/assets/images/slider/slider01.jpg',
    content: '<h4>沟通 - title</h4><hr><p>沟通 - 沟通能力包含着表达能力、争辩能力</br>倾听能力和设计能力</br>（形象设计、动作设计、环境设计）</br>沟通能力看起来是外在的东西，而实际上是个人素质的重要体现它关系着一个人的知识</p>'
  }, {
    title: '商务',
    src: '/assets/images/slider/slider01.jpg',
    content: '<h4>商务 - title</h4><hr><p>商务 - 沟通能力包含着表达能力、争辩能力</br>倾听能力和设计能力</br>（形象设计、动作设计、环境设计）</br>沟通能力看起来是外在的东西，而实际上是个人素质的重要体现它关系着一个人的知识</p>'
  }, {
    title: '科学',
    src: '/assets/images/slider/slider02.jpg',
    content: '<h4>科学 - title</h4><hr><p>科学 - 沟通能力包含着表达能力、争辩能力</br>倾听能力和设计能力</br>（形象设计、动作设计、环境设计）</br>沟通能力看起来是外在的东西，而实际上是个人素质的重要体现它关系着一个人的知识</p>'
  }, {
    title: '工程',
    src: '/assets/images/slider/slider03.jpg',
    content: '<h4>工程 - title</h4><hr><p>工程 - 沟通能力包含着表达能力、争辩能力</br>倾听能力和设计能力</br>（形象设计、动作设计、环境设计）</br>沟通能力看起来是外在的东西，而实际上是个人素质的重要体现它关系着一个人的知识</p>'
  }, {
    title: '艺术',
    src: '/assets/images/slider/slider04.jpg',
    content: '<h4>艺术 - title</h4><hr><p>艺术 - 沟通能力包含着表达能力、争辩能力</br>倾听能力和设计能力</br>（形象设计、动作设计、环境设计）</br>沟通能力看起来是外在的东西，而实际上是个人素质的重要体现它关系着一个人的知识</p>'
  }, {
    title: '设计',
    src: '/assets/images/slider/slider01.jpg',
    content: '<h4>设计 - title</h4><hr><p>设计 - 沟通能力包含着表达能力、争辩能力</br>倾听能力和设计能力</br>（形象设计、动作设计、环境设计）</br>沟通能力看起来是外在的东西，而实际上是个人素质的重要体现它关系着一个人的知识</p>'
  }, {
    title: '经济',
    src: '/assets/images/slider/slider02.jpg',
    content: '<h4>经济 - title</h4><hr><p>经济 - 沟通能力包含着表达能力、争辩能力</br>倾听能力和设计能力</br>（形象设计、动作设计、环境设计）</br>沟通能力看起来是外在的东西，而实际上是个人素质的重要体现它关系着一个人的知识</p>'
  }
]

function createCourseList(){
  let parent = document.getElementById('courses-list')
  let img = document.getElementById('courses-img')
  let content = document.getElementById('course-info')

  content.innerHTML = courseData[0].content
  img.src = courseData[0].src
  img.alt = courseData[0].title

  for (let course of courseData) {
    let n = document.createElement('li')
    n.innerHTML = course.title
    n.onclick = function() {
      img.src = course.src
      $('#courses-list li').attr('class','')
      n.className = 'red-border'
      content.innerHTML = course.content
    }
    parent.appendChild(n)
  }
}
