
var express = require('express');

var router =  express.Router();

var User = require('../models/User');

//统一返回格式；
var responseData;

router.use( function (req,res,next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
} );
/** 用户注册
 * 注册逻辑
 *
 * */
router.post('/user/register',function (req,res,next) {
   /* res.send('api user');*/
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if( username ==''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if(password ==''){
        responseData.code = 2;
        responseData.message = '密码不嫩为空';
        res.json(responseData);
        return;
    }
    if(password!=repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }
    /** 操作数据库*/
    User.findOne({
        username:username
    }).then(function (userInfo) {
       console.log(userInfo);
       if(userInfo){
           responseData.code = 4;
           responseData.message = '用户名已经被注册';
           res.json(responseData);
           return;
       }
       var user = new User({
           username:username,
           password:password
       });
       return user.save();
    }).then(function (newUserInfo) {
        console.log(newUserInfo,'new re');
        responseData.code = 0;
        responseData.message = '注册成功!!!!';
        res.json(responseData);
    });

});
router.post('/user/login',function (req,res) {
    var username = req.body.username;
    var password = req.body.password;

    if(username=='' || password==''){
        responseData.code = 2;
        responseData.message = '用户名或者密码不能为空';
        res.json(responseData);
        return;
    }
    //查询是否存在；
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        console.log(userInfo);
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或者密码错误';
            res.json(responseData);
            return;
        }
        responseData.code = 0;
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id:userInfo._id,
            username:userInfo.username
        };

        /** 为客户端设置cookies，保存站点信息*/
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));

        res.json(responseData);
        return;
    })
});

router.get('/user/logout',function (req,res) {
    req.cookies.set('userInfo',null);
    responseData.code = 0;
    responseData.message = "退出成功";
    res.json(responseData);
})


module.exports = router;