$(function (){
  //发送 ajax 请求, 动态渲染
  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: getSearch("productId")
    },
    dataType: "json",
    success: function (info){
      console.log(info);
      var htmlStr = template("productTpl", info);
      $('.lt_main .mui-scroll').html(htmlStr);

      //数字输入框,在动态生成时需要手动初始化
      mui('.mui-numbox').numbox();

      //轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
      });
    }


  });

  //2. 给尺码添加选中功能
  $('.lt_main').on("click", ".lt_size span", function (){
    //给自己加上 current 类名, 移除其他元素的 current 类名
    $(this).addClass("current").siblings().removeClass("current");
  });

  //3. 加入购物车功能
  //  (1) 给加入购物车按钮添加点击事件
  //  (2) 获取用户选中的尺码和数量
  //  (3) 发送 ajax 请求, 进行加入购物车操作
  $('#addCart').click(function (){
    var size = $('.lt_size span.current').text(); //尺码
    var num = $('.mui-numbox-input').val(); //数量

    //需要对 size 进行校验,必须选择尺码之后才能进行下面的操作
    // 如果未选择尺码, size = null, 取反 后为true, 进入下面的 if
    // 如果选择了尺码, size = 某个值, 取反 后为null,false, 不进入下面的 if中
    if (!size){
      mui.toast("请选择尺码");
      return;
    }
    //发送 ajax 请求, 进行加入购物车
    $.ajax({
      type: "post",
      url: "/cart/addCart",
      data: {
        productId: getSearch("productId"),
        num: num,
        size: size
      },
      dataType: "json",
      success: function (info){
        console.log(info); //打印的应该是数组
        if (info.success){
          mui.confirm("添加成功", "温馨提示", ["去购物车","继续浏览"], function (e){
            if (e.index === 0){
              //去购物车
              location.href = "cart.html";
            }
          });
        }
        if (info.error === 400){
          //跳转到登录页, 将来登录成功需要跳转回来
          //需要将 当前页面的地址传递给登录页, 将来登录成功后跳转回来
          location.href = "login.html?retUrl=" + location.href;
        }
      }
    });
  });

})