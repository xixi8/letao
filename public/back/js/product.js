$(function (){
  var currentPage = 1;
  var pageSize = 2;

  //1. 渲染页面 ajax + 模板引擎
  render();
  function render(){
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info){
        console.log(info);
        var htmlStr = template("productTpl", info);
        $('tbody').html(htmlStr);

        //分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page){
            currentPage = page;
            render();
          },
          size: "normal",

          //设置每个按钮的文本
          //每个按钮在初始化时, 都会调用这个方法, 将这个方法的返回值作为按钮的文本
          //type: 按钮类型, page, first, last, prev, next
          //page: 当前按钮指向的页码
          //current: 当前页
          itemTexts: function (type, page, current){
            switch (type){
              case "page":
                return page;
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";                
            }
          },

          //tooltipTitles 设置操作按钮的title属性。是个函数，有3个参数: type, page, current。
          tooltipTitles: function (type, page, current){
            switch (type){
              case "page":
                return "前往第"+ page +"页";
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";                
            }
          },

          // 使用 bootstrap 的 toolTip组件
          useBootstrapTooltip: true,
        });
      }
    })
  };

  //2. 
})