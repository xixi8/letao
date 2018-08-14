$(function (){
  var currentPage = 1; //当前页
  var pageSize = 2; //每页显示的数据条数
  //search_list

  //1. 获取 input 框中的值, 请求数据, 进行渲染
  function render( ){
    // $('lt_product').html('<div class="loading"></div>');

    //这里需要传 5 个参数: proName, page, pageSize, price, num
    //三个必传的参数
    var params = {};
    params.proName = $('.search_input').val();
    params.page = currentPage;
    params.pageSize = pageSize;
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
          //下拉刷新和上拉加载拿到数据执行的操作不一样
          // 将拿到数据后要做的事情 通过函数传递进来调用即可
          // callback && callback(info); // 有callback函数传进来才调用

          var htmlStr = template("listTpl", info);
          $('.lt_product').html(htmlStr);
        }
      });
    },1000);
  }


  //1. 解析地址栏参数, 将参数赋值到 input 框中
  var key = getSearch("key");
  $('.search_input').val(key);
  // render();

  // 下拉刷新与上拉加载需要执行的渲染是不一样的
  // 下拉刷新: 重新刷新, 利用 html 方法 覆盖显示 第一页的数据
  // 上拉加载: 加载更多, 利用 append 方法, 在原有数据基础上追加
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      //配置下拉刷新
      down : {
        // height:50,//可选,默认50.触发下拉刷新拖动距离,
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        // contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        // contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        // contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback : function (){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          console.log("下拉刷新");
          //下拉刷新, 通过调用render() 方法, 请求数据进行渲染

          //重置currentPage
          //对于 currentPage 的任意修改都应该在渲染 render() 之前,否则不起效果
          currentPage = 1;

          render();


            
            //需要手动在数据回来后, 结束下拉刷新
            // mui('.mui-scroll-wrapper').pullRefresh().endPulldown();//文档没有更新, endPulldown() 不是一个函数,具体函数可通过原型查找
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

            //重置上拉加载
            // mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();            

        }
      },

      //配置上拉加载
      // up : {
      //   // height:50,//可选.默认50.触发上拉加载拖动距离
      //   auto:true,//可选,默认false.自动上拉加载一次
      //   // contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
      //   // contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
      //   callback :function (){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      //     console.log("上拉加载");
      //     //上拉加载, 加载下一页的数据, 这里 currentPage 必须在外面就改变
      //     currentPage++;

      //     //上拉加载, 通过调用 render() 方法实现数据渲染
      //     render( function (info){
      //       var htmlStr = template("listTpl", info);
      //       $('.lt_product').append(htmlStr);
            
      //       //需要手动在数据回来后, 结束上拉加载
      //       // mui('.mui-scroll-wrapper').pullRefresh().endPulldown();//文档没有更新, endPulldown() 不是一个函数,具体函数可通过原型查找

      //       //endPullupToRefresh(boolean)
      //       // 1. false 还有更多的数据
      //       // 2. true 没有更多的数据了
      //       if ( info.data.length === 0){
      //         mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
      //       }else{
      //         mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
      //       }
      //     });
      //   } 
      // }

    }
  });


  // //2. 点击搜索按钮, 实现搜索功能
  // $('.search_btn').click(function (){
  //   //获取搜索框的值
  //   var key = $('.search_input').val();
  //   //获取数组
  //   // var arr = localStorage.getItem("search_list"); //现在这个为字符串,需要转换为数组
  //   var jsonStr = localStorage.getItem("search_list");
  //   var arr = JSON.parse(jsonStr);

  //   //1. 不能重复
  //   var index = arr.indexOf(key);
  //   if (index > -1){
  //     // arr = arr.slice(index, 1); 这里不能使用 slice(start, end) 方法
  //     arr.splice(index, 1);//用splice() 方法来进行删除操作
  //   }
  //   //2. 不能超过 10 个
  //   if (arr.length >= 10){
  //     arr.pop();
  //   }
  //   //将搜索关键字添加到arr 最前面
  //   arr.unshift(key);
  //   //转存到本地存储中
  //   localStorage.setItem("search_list", JSON.stringify(arr));
  //   //重新渲染
  //   render();
  // });

  // //3. 点击价格或者库存, 切换 current, 实现排序
  // //绑定点击事件
  // $('.lt_sort a[data-type]').click(function (){
  //   if ( $(this).hasClass("current")){
  //     //切换 current 类名(1) 点击的 a 标签没有current类, 直接加上current,并移除其他 a 上的类
  //     //                (2) 点击的 a 标签有current类, 切换箭头方向
  //     $(this).find("i").toggleClass("fa fa-angle-down").toggleClass("fa fa-angle-up");

  //   }else {
  //     $(this).addClass("current").siblings().removeClass("current");
  //   }
  //   //调用 render () 重新渲染
  //   render();

  // });



})