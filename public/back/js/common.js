/*5. 判断用户是否登录,实现登录拦截
    前端不知道当前用户是否登录, 但是后台知道, 需要访问后台接口,获取该用户登录状态
    (1) 用户已登录, 让其继续访问
    (2) 如果用户没登录, 拦截到登录页
  一进入页面,发送 ajax 请求,获取当前用户登录状态
  如果是登录页,不需要登录就可以访问,不需要判断登录状态

*/ 
// indexOf() 是 js 中的方法, 判断在某个字符串中是否存在一个字符
            // 返回的是指定的子串在另一个字符串中的位置,如果没有找到子串,则返回 -1
if (location.href.indexOf("login.html") === -1){
  //不是 login.html ,进行登录拦截判断
  $.ajax({
    //type, url, data, dataType, timeout
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function (info){
      // alert(1);
      // console.log(info);
      if (info.error === 400){
        location.href = "login.html"
      }
      // location.href = "login.html";
      if(info.success){
        console.log("已登录");
      }
    }
  })
}


  //进度条
  
  //jQuery中 ajax 的全局事件
  //1. ajaxComplete()  每个ajax请求完成时调用(不管成功还是失败)
  //2. ajaxError()     每个ajax请求失败时调用
  //3. ajaxSend()      每个ajax发送前调用
  //4. ajaxStart()     第一个ajax请求被发送时调用
  //5. ajaxStop()      全部的ajax请求完成时调用
  //6. ajaxSuccess()   每个ajax成功时调用

  //在发送第一个ajax请求时, ajaxStart , 开启进度条
  $(document).ajaxStart(function (){
    NProgress.start();
  });

  //在最后一个ajax请求回来时,关闭进度条
  $(document).ajaxStop(function (){
    // NProgress.done();
    //这里模拟网络延迟
    setTimeout(function (){
      NProgress.done();
    },500);
  });


$(function (){
  //公共的功能实现
  //1. 左侧二级菜单切换
  $('.lt_aside .category').click(function (){
    // alert(1);
    $('.lt_aside .child').stop().slideToggle();
  })

  // 2. 点击切换侧边栏
  $('.icon_menu').click(function (){
    $('.lt_aside').toggleClass("hiddenmenu");
    $('.lt_main').toggleClass("hiddenmenu");
    $('.lt_topbar').toggleClass("hiddenmenu");
  })

  // 3. 点击退出菜单, 显示退出模态框 
  $('.icon_logout').click(function (){
    //显示模态框
    $('#logoutModal').modal("show");
  });

  // 4. 点击退出按钮, 实现用户退出
  $('#logoutBtn').click(function (){
      // 退出需要发送ajax请求, 让服务器端退出, 销毁该用户的登陆状态
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function (info){
        if (info.success){
          //退出成功,跳转到登录页
          location.href = "login.html";
        }
      }
    })
  })
});