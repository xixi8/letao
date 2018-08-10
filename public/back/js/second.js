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

  // 3. 通过事件委托，给 dropdown-menu 下的所有 a 绑定点击事件
  $('.dropdown-menu').on("click", "a", function (){
    //获取 a 的文字
    var txt = $(this).text();
    // console.log(txt);
    $('#dropdownText').text(txt);

    //获取 categoryId
    var id = $(this).data("id");
    $('[name="categoryId"]').val(id);

    //重置隐藏域
    //将隐藏域校验状态, 设置成校验成功状态 updateStatus
    // 手动改变字段值的状态: updateStatus(字段名, 校验状态, 校验规则)
      //status的值有：
      // - NOT_VALIDATED：未校验的
      // - VALIDATING：校验中的
      // - INVALID ：校验失败的
      // - VALID：校验成功的。

      //重置表单后面校验状态(后面显示的图标)
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");


  });
  /*
  文件上传思路:
      1. 引包
      2. 准备结构, name  data-url
      3. 进行文件上传初始化, 配置 done 回调函数
  */ 
 //4. 进行文件上传初始化
  $("#fileupload").fileupload({     
    // 指定响应的数据格式      
    dataType:"json",      
    //e：事件对象      
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址      
    done:function (e, data) {       
        // console.log(data); 
        //获取上传得到的图片地址
        var imgUrl = data.result.picAddr;
        //赋值给img
        $('#imgBox img').attr("src",imgUrl);
        //将图片地址设置给input
        $('[name="brandLogo"]').val(imgUrl);

        //手动重置隐藏域的校验状态   
        $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  //5. 实现表单校验
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型, 默认为 [':disabled', ':hidden', ':not(:visible)'], 可以不设置
    //设置为空, 表示都进行校验
    excluded: [],

    //2. 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-leaf', //校验成功
      invalid: 'glyphicon glyphicon-remove',  //校验失败
      validating: 'glyphicon glyphicon-refresh'  //校验中
    },
    //3. 校验字段
    fields: {
      //校验用户名, 对应name表单的name属性
      categoryId: {
        validators: {
          //非空校验
          notEmpty: {
            message: '请选择一级分类'
          },
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请选择图片'
          }
        }
      },
    }
  });

  //6. 注册表单校验成功事件,阻止默认提交, 通过 ajax 进行提交
  $('#form').on('success.form.bv', function (e){
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info){
        console.log(info);
        if (info.success){
          //隐藏模态框
          $('#addModal').modal("hide");
          //页面重新渲染
          currentPage = 1;
          render();

          //表单重置
          //重置模态框的表单, 不仅校验状态要重置,文本内容也要重置
          $('#form').data("bootstrapValidator").resetForm(true);

          //手动重置文本内容 和 图片路径
          $('#dropdownText').text("请选择一级分类");
          $('#imgBox img').attr("src", "./images/none.png");
        }
      }
    });
  });





  




})