var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./../model/user');

mongoose.connect('mongodb://127.0.0.1:27017/leafclub');

mongoose.connection.on("connected", function(){
    console.log("MongoDB connected succeed.")
});

mongoose.connection.on("error", function(){
    console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function(){
    console.log("MongoDB disconnected.")
});

//手动添加一个用户
router.post('/register',function(req,res,next){
        //var userId = 1;
        var userName = 'LZZ';
        var userPassword = '123456';
        var newUser = new User();

        //newUser.userId = userId;
        newUser.userName = userName;
        newUser.userPassword = userPassword;
    
        newUser.save(function(err,doc){
        if(err){
            res.json({
                result:{
                    status: '304',
                    message: err.message
                }
            })
        }else{
            res.json({
                result:{
                    status: '200',
                    message: 'success'
                },
                data:{
                    userId: doc._id
                }
            })
        }
    });
});

//登录验证
router.post('/login',function(req,res,next){
    var param = {
        userName: req.body.userName,
        userPassword: req.body.Password
    }
    User.findOne(param,function(err,doc){
        if(err){
            res.json({
                result:{
                    status: '304',
                    message: err.message
                }
            })
        }else{
            if(doc){
                //验证成功后，把信息添加到cookie中
                res.cookie("userId",doc._id,{
                    path:'/',
                    maxAge:1000*60*60
                  });
      
                res.cookie("userName",doc.userName,{
                    path:'/',
                    maxAge:1000*60*60
                  });

                res.json({
                    result:{
                        status:"200",
                        message:'success',
                    },   
                    data: {
                        userName: doc.userName
                    }
                })
            }else{
                res.json({
                    result:{
                        status:"304",
                        message:'用户名或者密码不正确'
                    } 
                })
            }
        }
    })
})

//登出
router.post('/logout',function(req,res,next){
    res.cookie("userId","",{
        path:'/',
        maxAge:-1
      })
      res.json({
        result:{
            status:"200",
            message:'success',
        }
      })
})

//检查是否登录
router.post('/checkLogin',function(req,res,next){
    if(req.cookies.userId){
        res.json({
        result:{
            status:'0',
            message:'登录',
        },
        data:{
            userName:req.cookies.userName
            }
        });
      }else{
        res.json({
            result:{
                status:'1',
                message:'未登录'
            }
        });
    }
})

//获取收藏列表
router.get('/getFavouriteList',function(req,res,next){
    User.findEverythings({_id:userId},function(err,doc){
        if(err){
            res.json({
                result:{
                    status:'304',
                    message: err.message
                }
            })
        }else{
            res.json({
                result:{
                    status:'200',
                    message:'success'
                },
                data: {
                    favouriteBlogList: doc.favouriteBlogList,
                    favouriteWorkList: doc.favouriteWorkList
                }
            })
        }
    })
})

//获取点赞列表
router.get('/getPraiseList',function(req,res,next){
    User.findEverythings({_id:userId},function(err,doc){
        if(err){
            res.json({
                result:{
                    status:'302',
                    message: err.message
                }
            })
        }else{
            res.json({
                result:{
                    status:'200',
                    message:'success'
                },    
                data: {
                    praiseBlogList: doc.praiseBlogList,
                    praiseWorkList: doc.praiseWorkList
                }
            })
        }
    })
})

module.exports = router;
