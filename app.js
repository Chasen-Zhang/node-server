/****
 * @Author: Chasen
 * @Description: 应用程序的启动入口文件
 * @Date: 16:11 2018/4/4
 * @param user
 */

/** 加载express模块*/
var express = require('express');

/** 加载模板处理模块*/
var swig = require('swig');

/**  加载数据库模块*/
var mongoose = require('mongoose');

/*** 获取请求数据*/
var bodyParser = require('body-parser');

/***  加载cookies模块*/
var Cookies = require('cookies');

/** 创建app应用*/
var app = express();

/**  引入模型*/
var User = require('./models/User');

/** 设置静态文件托管 css js */
app.use('/public',express.static(__dirname + '/public'));

/** 模板配置*/
app.engine('html',swig.renderFile);

/** 设置模板存放目录*/
app.set('views','./views');

/** 注册所使用的模板引擎*/
app.set('view engine','html');

/***  在开发中，需要取消缓存*/
swig.setDefaults({
    cache:false
});

/**  body-parser设置(使用)*/
app.use(bodyParser.urlencoded({
    extended:true
}));

/**  设置cookies */
app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res);
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            /** 获取用户类型，是否是管理员*/
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });
            //获取当前用户类型
        }catch (e){
            console.log('something wrong');
            next();
        }
    }else{
        next();
    }
});


/***  根据不同的功能划分模块*/

/*** 后台管理*/
app.use('/admin',require('./routers/admin'));

/*** api ajax请求*/
app.use('/api',require('./routers/api'));

/*** 前端展示*/
app.use('/',require('./routers/main'));


/** 首页的*/
/*app.get('/',function (req,res,next) {
  /!* res.send('<h1>欢迎</h1>')*!/
  /!** views目录下的文件，解析并且返回给客户端
   * 参数1：文件相对于views目录下的；
   * 参数2：传递给模板使用的数据；
   * *!/
   res.render('index');
});*/

/* 静态解决方案；
app.get('/main.css',function (req,res,next) {
    res.setHeader('content-type','text/css');
    res.send('body{background:red;color:green;}');
})*/


mongoose.connect('mongodb://localhost:27017/blog2',function (err) {
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        /** 监听 http请求*/
        app.listen(8095);
        console.log('listeing.....8095');
    }

});


