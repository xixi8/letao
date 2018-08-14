$( function (){
  //登录思路: 
  //1. 给登录按钮添加点击事件
  //2. 获取用户名和密码
  //3. 发送 ajax 请求进行登录验证
  //      登录成功:(1) 如果传了地址过来, 直接跳转到传过来的地址页面
  //              (2) 如果没有传地址, 直接跳转个人中心
  //      登录失败: 提示用户登录失败

  $('#loginBtn').click(function (){
    var username = $('#username').val();
    var password = $('#password').val();

    if ( username.trim() === ""){
      mui.toast("请输入用户名");
      return;
    }
    if ( password.trim() === ""){
      mui.toast("请输入密码");
      return;
    }
    
    //发送 ajax 请求, 进行登录
    $.ajax({
      type: "post",
      url: "/user/login",
      data: {
        username: username,
        password: password
      },
      dataType: "json",
      success: function (info){
        console.log(info);
        if (info.success){
          //判断是否传了地址
          if (location.search.indexOf("retUrl") > -1){
            var retUrl = location.search.replace("?retUrl=","");
            //截取地址,进行跳转
            location.href = retUrl;
          }else {
            location.href = "user.html";
          }

        }
        if (info.error){
          mui.toast("用户名或者密码错误");
          return;
        }
      }
    })
  });
})