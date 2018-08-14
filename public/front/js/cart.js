$(function (){
  //1- 进入页面, 发送ajax 请求, 获取购物车列表,进行渲染
  function render(){
    setTimeout(function (){
      $.ajax({
        type: "get",
        url: "/cart/queryCart",
        dataType: "json",
        success: function (info){
          console.log(info);
          //需要进行登录校验, 如果没有登录, 需要返回 login 页面
          // (这里还需要在地址栏拼接当前地址,方便用户返回)
          if (info.error === 400){
            location.href = "login.html?retUrl=" + location.href;
            return;
          }
          //这里返回的 info 是个数组,而模板引擎需要的数据是对象, 所以要进行包装
          var htmlStr = template("cartTpl", {arr: info});
          $('.lt_main .mui-table-view').html(htmlStr);
    
          //数据渲染完成, 结束下拉刷新
          mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
        }
      });
    },500);
  }

  //下拉刷新
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback :function (){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          console.log("发送 ajax 请求, 进行页面刷新");
          render();     
        } 
      }
    }
  });

  //2- 删除功能
  //   (1) 点击事件(通过事件委托进行绑定), 注意需要绑定 tap 事件
  //   (2) 获取当前购物车id
  //   (3) 发送 ajax 请求进行删除
  //   (4) 页面重新渲染
  $('.lt_main').on("tap", ".btn_delete", function (){
    var id = $(this).data("id");
    $.ajax({
      type: "get",
      url: "/cart/deleteCart",
      data: {
        //注意后面会进行批量删除操作, 所以这里传入的数据应该为 数组
        id: [id]
      },
      dataType: "json",
      success: function (info){
        console.log(info);
        if (info.success){
          //触发一次下拉刷新
          mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        }
      }
    });
  });

  //3- 编辑功能
  //   点击编辑按钮, 显示确认框
  $('.lt_main').on("tap", ".btn_edit", function (){
    //模板引擎需要渲染的数据
    //  通过 自定义属性 dataset 将存在 btn_edit 按钮上的所有 data 属性一次性获取过来 ==> DOM 对象
    var obj = this.dataset;

    //从自定义属性中获取购物车 id
    var id = obj.id;

    //模板引擎生成确认框内部结构
    var htmlStr = template("editTpl", obj);
    //这里如果模板不进行处理的话, 会进行换行( \n )
    //-- mui 会将所有的 \n 解析成 br标签进行换行
    //我们需要在传递给 确认框前, 将所有的 \n 去掉 replace() 方法
    //  replace("\n", "")  这样写只能替换一个 \n ,要想替换所有的必须使用正则表达式 g,全局
    htmlStr = htmlStr.replace(/\n/g, "");


    //显示确认框
    mui.confirm(htmlStr, "编辑商品", ["确认", "取消"], function(e){
      if (e.index === 0){
        //确认编辑
        var size = $('.lt_size span.current').text();
        var num = $('.mui-numbox-input').val();
        $.ajax({
          type: "post",
          url: "/cart/updateCart",
          data: {
            id: id,
            size: size,
            num: num
          },
          dataType: "json",
          success: function (info){
            console.log(info);
            if (info.success){
              //编辑成功,页面重新渲染(下拉刷新)
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        });
      }
    })

    //手动初始化模态框
    mui(".mui-numbox").numbox();
  });

  //给 编辑模态框的尺码添加选中功能
  //    使用事件委托注册点击事件
  //    由于这里的模态框采用 fix 相对与body进行定位, 父元素即为 body
  $('body').on("click", ".lt_size span", function (){
    $(this).addClass("current").siblings().removeClass("current");
  });


  //4- 计算所有价格的功能
  //   (1) 给所有复选框添加点击事件
  //   (2) 被点击时开始计算价格, 获取所有被选中的复选框, 计算价格
  //   (3) 计算完成赋值给 total 文本
  //each( )  方法遍历jq对象, forEach() 方法遍历数组,是 js 中的方法
  $('.lt_main').on("click", ".ck", function (){
    var totalPrice = 0;

    $('.ck:checked').each(function (index, ele){
      var price = $(this).data("price");
      var num = $(this).data("num");
      totalPrice += price * num;
    });
    //保留两位小数
    totalPrice = totalPrice.toFixed(2);
    // alert(totalPrice);
    //设置给 total
    $('#total').text( totalPrice );

  })


})