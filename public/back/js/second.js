$(function (){
  var currentPage = 1;
  var pageSize = 5;

  render();
  function render(){
    // 1. 一进入页面发送ajax请求, 获取数据, 通过模板引擎渲染
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info){
        console.log(info);
        var htmlStr = template("secondTpl", info);
        $('tbody').html(htmlStr);

        // 分页插件
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          //当前页
          currentPage: info.page,
          //总页数
          totalPages: Math.ceil(info.total / info.size),
          //为按钮绑定点击事件, page 当前点击的按钮值
          onPageClicked: function (a, b, c, page){
            currentPage = page;
            render();
          }
        });
      }
    });
  }

  // 2. 点击添加分类按钮, 显示添加模态框
  $('#addBtn').click(function (){
    $('#addModal').modal("show");

    // 发送ajax请求, 获取一级分类全部数据, 通过模板引擎渲染
    // 通过, page=1, pageSize=100, 模拟获取全部分类数据的接口
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info){
        console.log(info);
        //渲染数据
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  });


})