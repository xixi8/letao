$(function (){
  //区域滚动
  //1. 引包
  //2.准备结构(不要忘记给父容器设置: position: relative)
  //3. 进行初始化

  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005,//flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条
  });

  //获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
  });
  
  

})

// 专门通过传递的参数, 可以解析出地址栏的参数值
function getSearch(name){
  var search = location.search; //?key=%E5%A4%8F%E6%98%8E
  //解码,转换成中文
  search = decodeURI(search); //?key=夏明
  //去掉 ? (去掉第一个, 返回一个新数组)
  search = search.slice(1); //key=夏明

  //转换成数组
  var arr = search.split("&"); //["key=夏明"]

  var obj = {};
  //遍历数组
  arr.forEach(function (v, i) {
    var key = v.split("=")[0];
    var value = v.split("=")[1];
    obj[key] = value; //{key: "夏明"}
  });
  return obj[name];
}