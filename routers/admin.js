
var express = require('express');

var router =  express.Router();

router.use(function (req,res,next) {
   if(!req.userInfo.isAdmin){
       res.send('对不起，只有管理员才可以进入后台管理');
       return;
   }
   next();
});

router.get('/',function (req,res,next) {
  /*  res.send('管理首页');*/
  res.render('admin/index',{
      userInfo:req.userInfo
  });
});

module.exports = router;