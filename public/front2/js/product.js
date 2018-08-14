/**
 * Created by Jepson on 2018/8/13.
 */

$(function() {

  // 1. 从地址栏获取传递过来的productId, 根据产品id发送ajax请求, 进行渲染
  var productId = getSearch("productId");

  // 发送 ajax 请求
  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: productId
    },
    dataType: "json",
    success: function( info ) {
      console.log( info );
      var htmlStr = template( "productTpl", info );
      $('.lt_main .mui-scroll').html( htmlStr );


      // 手动初始化轮播图
      // 获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
      });


      // 手动初始化 数字框
      mui('.mui-numbox').numbox();
    }
  })


})
