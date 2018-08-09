
$(function (){
  var currentPage = 1;
  var pageSize = 5;

  var currentId; //当前选中的用户的id
  var isDelete;
  //1. 一进入页面,发送ajax请求，获取到用户的数据,通过模板引擎渲染数据

  render();
  function render(){
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info){
        console.log(info);
        //结合模板引擎，把数据渲染到页面
        var htmlStr = template('tpl', info);
        $('tbody').html(htmlStr);

        //分页初始化
        $('#paginator').bootstrapPaginator({
          //bootstrap的版本如果是3,指定为3
          bootstrapMajorVersion: 3,
          //指定当前页
          // currentPage: currentPage,
          currentPage: info.page,
          //指定总页数
          totalPages: Math.ceil(info.total / info.size),

          // onPageClicked:function(event, originalEvent, type,page){
          //   //为按钮绑定点击事件 page:当前点击的按钮值
          // }
          onPageClicked: function (a, b, c, page){
            // 通过 page 获取点击的页码
            //更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }

        })
      }
    });
  }

  // 2. 点击启用禁用按钮, 显示模态框, 通过事件委托绑定事件
  $('tbody').on("click", ".btn", function (){
    //显示模态框
    $('#userModal').modal("show");
    //获取到自定义属性id
    currentId = $(this).parent().data("id");
    console.log(currentId);
    //如果按钮是禁用,说明现在是启用的状态,要修改为 0 
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1; 
  })

  // 3. 点击确认按钮, 发送ajax请求, 修改对应用户状态, 需要两个参数(用户id, isDelete用户改成的状态)
  $('#submitBtn').click(function (){
    //获取到禁用还是启用的状态(根据btn的类名)
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function (info){
        //必须是成功的时候!!!
        if (info.success){
          //1. 关闭模态框
          $('#userModal').modal("hide");
          //2. 重新渲染当前页
          render();
        }
      }
    });
  })
})