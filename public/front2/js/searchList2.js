/**
 * Created by Jepson on 2018/8/12.
 */

$(function() {
  var currentPage = 1; // 当前页
  var pageSize = 2; // 每页条数


  // 解析处理所有的参数, 将来根据参数进行请求, 获取数据, 进行渲染
  function render( callback ) {
    // 每次重新渲染前, 先初始化成加载中的效果
    //$('.lt_product').html('<div class="loading"></div>');

    // 需要给后台传递的参数对象
    var params = {};
    // 三个必传的参数
    params.proName = $('.search_input').val();
    params.page = currentPage;
    params.pageSize = pageSize;

    // 对两个可传的参数进行处理,
    // 1. 通过判断有没有current类, 决定是否是需要排序
    // 2. 通过判断箭头方向, 决定升序还是降序, 2 表示降序, 1 表示升序

    var $current = $('.lt_sort a.current');
    if ( $current.length > 0 ) {
      // 有current, 需要排序
      var sortName = $current.data('type');  // 获取键名
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
      // 追加在 params 中
      params[ sortName ] = sortValue;
    }


    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function( info ) {
          console.log( info );
          // 下拉刷新和上拉加载拿到数据执行的操作不一样
          // 将拿到数据后需要做的事情, 通过函数传递进来调用即可
          callback && callback( info );
        }
      })
    }, 1000);

  }


  // 功能1: 获取地址栏参数, 设置给 input, 并且根据 input 的值, 进行渲染一次
  var key = getSearch("key");
  $('.search_input').val( key );



  // 下拉刷新和上拉加载需要执行的渲染是不一样的
  // 下拉刷新, 重新刷新, 利用 html方法 覆盖显示 第一页的数据
  // 上拉加载, 加载更多, 利用 append 方法, 在原有数据基础上追加
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可
      // 配置下拉刷新
      down : {
        auto: true, // 一进入页面, 自动触发一次下拉刷新

        //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        callback : function() {
          console.log( "下拉刷新了");

          // 下拉刷新, 重置当前页
          currentPage = 1;

          // 下拉刷新, 通过调用render方法, 请求数据进行渲染
          render(function( info ) {
            var htmlStr = template( "tpl", info );
            $('.lt_product').html( htmlStr );

            // 需要手动在数据回来后, 结束下拉刷新
            // console.log( mui('.mui-scroll-wrapper').pullRefresh() );
            // mui('.mui-scroll-wrapper').pullRefresh().endPulldown(); // 注意: 官网文档没更新(小坑)
            // 手动调用原型上的方法, 进行下拉刷新
            mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();


            // 重新启用上拉加载
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          });
        }
      },
      // 配置上拉加载
      up: {
        callback: function() {
          console.log( "上拉加载更多" );
          // 上拉加载, 加载下一页的数据
          currentPage++;
          render(function( info ) {
            var htmlStr = template( "tpl", info );
            $('.lt_product').append( htmlStr );

            // 需要在数据回来之后关闭上拉加载
            // endPullupToRefresh(boolean)
            // 1. false 还有更多数据
            // 2. true  没有更多数据了
            if ( info.data.length === 0 ) {
              // 没有更多数据了, 默认会禁用上拉加载
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
            }
            else {
              // 还有更多数据, 可以进行加载更多
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(false);
            }
          });
        }
      }
    }
  });





  // 功能2: 点击搜索按钮, 根据input的值, 重新渲染页面, 将搜索的内容添加到历史记录中
  $('.search_btn').click(function() {
    var key = $('.search_input').val(); // 获取搜索内容
    var history = localStorage.getItem("search_list"); // jsonStr
    var arr = JSON.parse( history ); // 获取数组

    // 不能重复
    var index = arr.indexOf( key );
    if ( index > -1 ) {
      // 有了, 删除该项
      arr.splice( index, 1 );
    }
    // 不能超过 10 个
    if ( arr.length >= 10 ) {
      // 删除最后一个
      arr.pop();
    }

    arr.unshift( key ); // 追加到数组最前面

    // 将追加后的数组转存到本地存储中
    localStorage.setItem( "search_list", JSON.stringify( arr ) );

    // 触发一次下拉刷新
   mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
  })


  // 功能3: 排序功能, 有了需要多传的参数(在render进行处理)
  //        这里切换类即可

  // mui 认为 click 事件有 300ms延迟(只有在iphone4以及一些特别老的终端机里面才有),
  // click 不太好, 使用 tap 事件来代替会更好
  // 官方api说明: http://ask.dcloud.net.cn/question/8646
  $('.lt_sort a[data-type]').on('tap', function() {

    if ( $(this).hasClass("current") ) {
      // 自己有 current类, 直接切换箭头方向
      $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
    }
    else {
      // 自己没有 current 类, 加上 current 并排他
      $(this).addClass("current").siblings().removeClass("current");
    }

    // 在 render 中已经进行所有的参数处理
    // 重新渲染, 触发一次下拉刷新即可
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();

  })





});
