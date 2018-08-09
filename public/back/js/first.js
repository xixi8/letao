$(function (){
  var currentPage = 1;
  var pageSize = 5;

  //1. 发送ajax, 通过模板引擎渲染到页面中
  render();
  function render(){
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info){
        console.log(info);
        var htmlStr = template('tpl', info);
        $('tbody').html(htmlStr);

        // 分页功能
        $('#paginator').bootstrapPaginator({
          //配置bootstrap 版本
          bootstrapMajorVersion: 3,
          //当前页
          currentPage: info.page,
          //指定总页数
          totalPages: Math.ceil(info.total / info.size),
          //当页码被点击时调用的回调函数
          onPageClicked: function (a, b, c, page){
            //通过 page 获取点击的页码
            //更新当前页
            currentPage = page;
            //重新渲染
            render();
          }
        });
      }
    });
  }

  //2. 点击添加分类按钮, 显示模态框
  $('#addBtn').click(function (){
    $('#addModal').modal("show");
  })

  //3. 使用表单校验插件, 实现表单校验
  $('#form').bootstrapValidator({
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-leaf', //校验成功
      invalid: 'glyphicon glyphicon-remove',  //校验失败
      validating: 'glyphicon glyphicon-refresh'  //校验中
     },
    
     //校验字段 
     fields: {
       //校验用户名, 对应name表单的name 属性
       categoryName: {
          validators: {
            //不能为空
            notEmpty: {
              message: '一级分类名不能为空'
            }
          }
       }
     }
  })

  //4. 注册表单校验成功事件, 阻止默认的成功提交(表单), 通过ajax 进行提交
  $('#form').on("success.form.bv", function (e){
    //阻止表单的默认提交
    e.preventDefault();
    //通过ajax 进行提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      // 表单序列化
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info){
        console.log(info);
        if (info.success){
          //关闭模态框
          $('#addModal').modal("hide");
          //重新渲染第一页
          currentPage = 1;
          render();
          //重置表单的数据和样式
          $('#form').data("bootstrapValidator").resetForm(true);//重置表单,并且会隐藏所有的错误提示和图标
        }
      }
    });
  })
  

})