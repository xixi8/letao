$(function (){
  //search_list
  //1. 解析地址栏参数, 将参数赋值到 input 框中
  var key = getSearch("key");
  $('.search_input').val(key);
  render();

  //1. 获取 input 框中的值, 请求数据, 进行渲染
  function render(){
    $('lt_product').html('<div class="loading"></div>');

    //这里需要传 5 个参数: proName, page, pageSize, price, num
    //三个必传的参数
    var params = {};
    params.proName = $('.search_input').val();
    params.page = 1;
    params.pageSize = 100;
    //两个可选的参数 price --> 使用价格排序（1升序，2降序; num --> 产品库存排序（1升序，2降序）
    //通过判断有没有高亮的 a 标签, 来决定需不需要传递排序的参数
    var $current = $('.lt_sort a.current');
    if ( $current.length > 0){
      //当前有 a 标签有current 类,需要进行排序
      //按照什么进行排序
      // var sortName = $('.lt_sort a.current').data("type") === "num" ? "num" : "price";
      var sortName = $current.data("type");
      //升序还是降序, 可以通过判断箭头的方向决定(1 升序, 2 降序)
      var sortValue = $('.lt_sort a.current').find("i").hasClass("fa-angle-down") ? 2 : 1;
      //如果需要排序,需要将参数添加在 params 中
      params[sortName] = sortValue;
    }

    setTimeout( function (){
      //发送ajax请求, 获取搜索到的商品, 通过模板引擎渲染
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function (info){
          console.log(info);
          var htmlStr = template("listTpl", info);
          $('.lt_product').html(htmlStr);
        }
      });
    },1000);
  }

  //2. 点击搜索按钮, 实现搜索功能
  $('.search_btn').click(function (){
    //获取搜索框的值
    var key = $('.search_input').val();
    //获取数组
    // var arr = localStorage.getItem("search_list"); //现在这个为字符串,需要转换为数组
    var jsonStr = localStorage.getItem("search_list");
    var arr = JSON.parse(jsonStr);

    //1. 不能重复
    var index = arr.indexOf(key);
    if (index > -1){
      // arr = arr.slice(index, 1); 这里不能使用 slice(start, end) 方法
      arr.splice(index, 1);//用splice() 方法来进行删除操作
    }
    //2. 不能超过 10 个
    if (arr.length >= 10){
      arr.pop();
    }
    //将搜索关键字添加到arr 最前面
    arr.unshift(key);
    //转存到本地存储中
    localStorage.setItem("search_list", JSON.stringify(arr));
    //重新渲染
    render();
  });

  //3. 点击价格或者库存, 切换 current, 实现排序
  //绑定点击事件
  $('.lt_sort a[data-type]').click(function (){
    if ( $(this).hasClass("current")){
      //切换 current 类名(1) 点击的 a 标签没有current类, 直接加上current,并移除其他 a 上的类
      //                (2) 点击的 a 标签有current类, 切换箭头方向
      $(this).find("i").toggleClass("fa fa-angle-down").toggleClass("fa fa-angle-up");

    }else {
      $(this).addClass("current").siblings().removeClass("current");
    }
    //调用 render () 重新渲染
    render();

  });



})