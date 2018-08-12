/**
 * Created by Jepson on 2018/8/12.
 */

$(function() {
  // 功能1: 获取地址栏参数, 设置给 input, 并且根据 input 的值, 进行渲染一次
  var key = getSearch("key");
  $('.search_input').val( key );
  render();

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
    render();
  })


  // 功能3: 排序功能, 有了需要多传的参数(在render进行处理)
  //        这里切换类即可
  $('.lt_sort a[data-type]').click(function() {

    if ( $(this).hasClass("current") ) {
      // 自己有 current类, 直接切换箭头方向
      $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
    }
    else {
      // 自己没有 current 类, 加上 current 并排他
      $(this).addClass("current").siblings().removeClass("current");
    }

    // 在 render 中已经进行所有的参数处理
    // 重新渲染
    render();
  })


  // 解析处理所有的参数, 将来根据参数进行请求, 获取数据, 进行渲染
  function render() {
    // 每次重新渲染前, 先初始化成加载中的效果
    $('.lt_product').html('<div class="loading"></div>');

    // 需要给后台传递的参数对象
    var params = {};
    // 三个必传的参数
    params.proName = $('.search_input').val();
    params.page = 1;
    params.pageSize = 100;

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
          var htmlStr = template( "tpl", info );
          $('.lt_product').html( htmlStr );
        }
      })
    }, 1000);

  }


});
