$(function (){
  //读取历史记录(localStorage), 渲染历史记录 

  // 将来下面三句话, 可以放在控制台执行, 进行假数据初始化
  // var arr = [ "耐克", "李宁", "新百伦", "耐克王", "阿迪王" ];
  // var jsonStr = JSON.stringify( arr );
  // localStorage.setItem( "search_list", jsonStr );

  //1. 历史记录渲染功能
  //  (1) 读取本地历史, 得到 jsonStr
  //  (2) 将jsonStr 转换成数组
  //  (3) 通过数组, 进行页面渲染(模板引擎)

  render();
  //封装一个方法, 用于读取历史记录数组, 返回一个数组
  function getHistory() {
    //如果读取不出数据, 默认初始化为 '[]'
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse(history); //转成数组
    return arr;
  };

  //专门用于读取本地历史记录, 进行渲染
  function render() {
    var arr = getHistory(); //数组
    // console.log(arr);
    //模板引擎渲染 (需要传入的数据类型为 对象)
    var htmlStr = template("searchTpl", {arr: arr});
    $('.lt_history').html(htmlStr);
    
  };

  //2. 清空历史记录功能
    //(1) 通过事件委托给清空记录绑定点击事件
    //(2) 清空, 将本地的 search_list 移除, removeItem(key);
    //(3) 重新渲染页面
  $('.lt_history').on("click", ".btn_empty", function (){
    //mui 确认框
    //.confirm(message, title, btnValue, callback[type])
    mui.confirm("你确定要清空历史记录吗 ?", "温馨提示", ["取消","确认"], function (e){
      console.log(e);
      if (e.index === 1){
        //移除本地历史
        localStorage.removeItem("search_list");
        //重新渲染
        render();
      }
    })

  });

  //3. 删除单条历史记录
    //(1) 事件委托绑定点击事件
    //(2) 将下标存储在删除按钮中, 点击后获取下标
    //(3) 读取本地存储, 拿到数组
    //(4) 根据下标, 从数组中将该下标的项移除, splice
    //(5) 将数组转换成 jsonStr
    //(6) 存到本地存储中
    //(7) 重新渲染
  $('.lt_history').on("click", ".btn_delete", function (){
    var that = this; //这里需要先获取this,因为在下面的 mui.confirm 中 this 将发生改变,再使用this就获取不到这个值了
    // //使用 that 进行中转

    mui.confirm("你确定要删除该条记录吗 ?", "温馨提示", ["取消","确认"], function (e){
      console.log(e);
      if (e.index === 1){
        var index = $(that).data("index");
        var arr = getHistory();
        //splice() 方法返回被删除的项
        arr.splice( index, 1);
        var jsonStr = JSON.stringify( arr );
        localStorage.setItem( "search_list", jsonStr);
        //重新渲染
        render();
      }
    })

  });


  //4. 点击搜索按钮, 添加搜索记录
    //(1) 给搜索按钮注册点击事件
    //(2) 获取搜索框中的内容
    //(3) 读取本地存储, 拿到数组
    //(4) 将搜索框中的内容, unshift 到数组的最前面(追加到数组的最前面)
    //(5) 将数组转成 jsonStr, 存到本地存储中
    //(6) 重新渲染
  $('.search_btn').click(function (){
    var key = $('.search_input').val();
    //---搜索框中的内容不能为空; 数据不能重复; 渲染的数据不超过 10 个
    //trim()  字符串方法, 去除空白
    if ( key.trim() === ""){
      //mui 自动消失提示框
      //.toast( message, {json}提示消息的参数)
      mui.toast("请输入搜索关键字", {
        duration: 1500, // 持续显示时间
      });
      return; //不执行下面的代码
    }
    // console.log(key);
    var arr = getHistory();
    //需求: 1. 不要有重复项,如果有,移除前面的, 将最新的添加到数组中 (借用 indexOf 方法, 查找驻足中某个元素第一次出现的位置, 查不到 ==> -1)
          //2. 数组长度控制在 10 以内
    var index = arr.indexOf(key);
    if ( index > -1){
      //说明数组中 key 已经存在,移除
      arr.splice(index, 1);
    }
    if (arr.length >= 10){
      //长度大于10, 移除最后一个 pop() 方法
      arr.pop();
      //pop() 在数组中删除最后一项, 返回被删除的项
    }
    //unshift()  方法 返回新数组的长度
    arr.unshift(key);
    var jsonStr = JSON.stringify(arr);
    localStorage.setItem("search_list", jsonStr);
    //重新渲染
    render();
    //清空搜索框的内容
    $('.search_input').val("");

    //搜索完成, 跳转到搜索列表,并将搜索关键字传过去
    location.href = "searchList.html?key=" + key;
  });
})