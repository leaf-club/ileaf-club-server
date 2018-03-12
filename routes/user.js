var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./../model/user');
var Blog = require('./../model/blog');
var Work = require('./../model/work');
var FavouriteBlogList = require('./../model/favouriteBlogList');
var FavouriteWorkList = require('./../model/favouriteWorkList');
var LikeBlogList = require('./../model/likeBlogList');
var LikeWorkList = require('./../model/likeWorkList');

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
        var password = '123456';
        var avatar = './images/1.jpg'
        var newUser = new User();

        //newUser.userId = userId;
        newUser.userName = userName;
        newUser.password = password;
        newUser.avatar = avatar;
    
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
        password: req.body.password
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

//获取个人博客列表
router.get('/getBlogList',function(req,res,next){
    //let userId = req.cookies.userId;
    let userId = req.param('userId');
    let pageIndex = +req.param('pageIndex');
    let pageSize = +req.param('pageSize');
    let skip = (pageIndex-1)*pageSize;   //分页参数
    
    //筛选的时候要选出blogStatus为1的已发布的博文
    let blogModel = Blog.find({userInfo:userId,status:1}).skip(skip).limit(pageSize);
    blogModel.sort({createTime:-1});
    blogModel.exec(function(err,doc){
        if(err){
            res.json({
                status:'3201',
                message: err.message
            })
        }else{
            res.json({
                result: {
                    status:'200',
                    message: '博客列表获取成功'
                },
                data: {
                    blogList:doc
                }
            })
        } 
    })
})

//获取个人作品列表
router.get('/getWorkList',function(req,res,next){
    //let userId = req.cookies.userId;
    let userId = req.param('userId');
    let pageIndex = +req.param('pageIndex');
    let pageSize = +req.param('pageSize');
    let skip = (pageIndex-1)*pageSize;   //分页参数
    
    let workModel = Work.find({userInfo:userId}).skip(skip).limit(pageSize);
    workModel.exec(function(err,doc){
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
                data: {
                    workList: doc
                }
            })
        }
    })
})

//获取收藏列表
router.get('/getFavouriteList',function(req,res,next){
    //var userId = req.cookies.userId;
    var userId = req.param('userId');
    var favouriteBlogListModel = FavouriteBlogList.find({userId:userId}).sort({createTime:-1});
    favouriteBlogListModel.exec().then(function(doc){
        var favouriteWorkListModel = FavouriteBlogList.find({userId:userId}).sort({createTime:-1});
        favouriteWorkListModel.exec({userId:userId},function(err,doc1){
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
                        favouriteBlogList: doc,
                        favouriteWorkList: doc1
                    }
                })
            }
        })
    })
})

//获取点赞列表
router.get('/getLikeList',function(req,res,next){

    var userId = req.param('userId');
    var likeBlogListModel = LikeBlogList.find({userId:userId}).sort({createTime:-1});
    likeBlogListModel.exec().then(function(doc){
        LikeWorkList.find({userId:userId},function(err,doc1){
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
                        likeBlogList: doc,
                        likeWorkList: doc1
                    }
                })
            }
        })
    })
})

module.exports = router;
