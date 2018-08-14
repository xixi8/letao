$( function (){
  //1- 一进入页面, 发送请求, 渲染用户信息
  $.ajax({
    type: "get",
    url: "/user/queryUserMessage",
    dataType: "json",
    success: function (info){
      console.log(info);
      if (info.error === 400){
        location.href = "login.html";
        //需要跳出循环
        return;
      }
      //已登录, 通过模板引擎进行渲染
      var htmlStr = template("userTpl", info);
      $('#userInfo').html(htmlStr);
    }
  });

  //2- 点击退出按钮,退出操作
  //      1. 用户端清空浏览器缓存(就是将cookie中的 sessionId 清除)
  //      2. 调用后台提供的退出接口, 让后台销毁当前用户 session 存储空间, 清空用户信息
  $('#logout').click(function (){
    $.ajax({
      type: "get",
      url: "/user/logout",
      // data: {
      //   success:
      //   error:
      // },
      dataType: "json",
      success: function (info){
        console.log(info);
        if (info.success){
          location.href = "login.html";
        }
      }
    })
  });
})