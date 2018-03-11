var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./../model/user');
var Blog = require('./../model/blog');
var FavouriteBlogList = require('./../model/favouriteBlogList');
var FavouriteWorkList = require('./../model/favouriteWorkList');
var PraiseBlogList = require('./../model/praiseBlogList');
var PraiseWorkList = require('./../model/praiseWorkList');

//博客收藏，需要把收藏量+1
router.post('/favouriteBlog',function(req,res,next){
    // var _id = req.body.id;
    var userId = req.body.userId;
    var blogOrWorkId = req.body.id;
    var type = req.body.type;
    var operate = req.body.operate;
    var createTime = Date.now();
    Blog.findOne({_id:blogOrWorkId},function(err,doc){
        if(err){
            res.json({
                result:{
                    status:'304',
                    message: err.message
                }
            })
        }else{
            if(doc){
                doc.blogFavoritesCount++;
                doc.save().then(function(doc){
                    var userId = req.body.userId;
                    var blogOrWorkId = req.body.id;
                    var type = req.body.type;
                    var operate = req.body.operate;
                    var createTime = Date.now();
                    //先判断operate的值,true的话,是点赞
                    if(operate){
                        //添加到喜欢的博客
                            User.findOne({_id:userId},function(err,userDoc){
                            if(type==0) {
                            var favouriteBlog = new FavouriteBlogList();
                            favouriteBlog.userId = userId;
                            favouriteBlog.blogId = blogOrWorkId;
                            favouriteBlog.type = type;
                            // favouriteBlog.operate = operate;
                            favouriteBlog.createTime = createTime;
                            favouriteBlog.save(function(err,doc1){
                                if(err){
                                    res.json({
                                        result:{
                                            status:'304',
                                            message: err.message
                                        }
                                    })
                                }else{
                                    var farouriteBlogId = doc1._id;
                                    userDoc.userFavouritesCount++;
                                    userDoc.favourtiteBlogList.push(farouriteBlogId);
                                    userDoc.save(function(err,doc2){
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
                                                    message: 'success'
                                                }  
                                            })
                                        }
                                    }) 
                                }
                            })
                        }else{
                                var favouriteWork = new FavouriteWorkList();
                                favouriteWork.userId = userId;
                                favouriteWork.workId = blogOrWorkId;
                                favouriteWork.type = type;
                                // favouriteWork.operate = operate;
                                favouriteWork.createTime = createTime;
                                favouriteWork.save(function(err,doc1){
                                    if(err){
                                        res.json({
                                            result:{
                                                status:'304',
                                                message: err.message
                                            }
                                        })
                                    }else{
                                        var farouriteWorkId = doc1._id;
                                        userDoc.userFavouritesCount++;
                                        userDoc.favourtiteWorkList.push(farouriteWorkId);
                                        userDoc.save(function(err,doc2){
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
                                                        message: 'success'
                                                    }  
                                                })
                                            }
                                        })
                                    }
                                })
                            }  
                        })
                    }else{
                        //取消点赞
                        User.findOne({_id:userId},function(err,userDoc){
                            if(type==0){
                                FavouriteBlogList.remove({userId:userId,blogId:blogOrWorkId},function(err,doc1){
                                    if(err){
                                        res.json({
                                            result:{
                                                status:'304',
                                                message: err.message
                                            }
                                        })
                                    }else{
                                        userDoc.userFavouritesCount--;
                                       var result = [];
                                       userDoc.favourtieBlogList.forEach(item=>{
                                           if(item!=blogOrWorkId){
                                            result.push(item);
                                           }
                                       })
                                       userDoc.favourtieBlogList = result;
                                       userDoc.save(function(err,doc2){
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
                                                    message: 'success'
                                                }  
                                            })
                                        }
                                       })
                                    }  
                                })
                            }else{
                                FavouriteWorkList.remove({userId:userId,workId:blogOrWorkId},function(err,doc1){
                                    if(err){
                                        res.json({
                                            result:{
                                                status:'304',
                                                message: err.message
                                            }
                                        })
                                    }else{
                                        doc.userFavouritesCount--;
                                       var result = [];
                                       userDoc.favouriteWorkList.forEach(item=>{
                                           if(item!=blogOrWorkId){
                                            result.push(item);
                                           }
                                       })
                                       userDoc.favouriteWorkList = result;
                                       userDoc.save(function(err,doc2){
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
                                                    message: 'success'
                                                }  
                                            })
                                            }
                                       })   
                                    }  
                                })
                            }
                        })
                    }
                })
            }else{
                res.json({
                    result:{
                        status:'304',
                        message: '参数不对'
                    }
                })
            }
        }
    })
});

//博客点赞，需要把点赞量+1
router.post('/praiseBlog',function(req,res,next){
    // var _id = req.body.id;
    var userId = req.body.userId;
    var blogOrWorkId = req.body.id;
    var type = req.body.type;
    var operate = req.body.operate;
    var createTime = Date.now();
    Blog.findOne({_id:blogOrWorkId},function(err,doc){
        if(err){
            res.json({
                result:{
                    status:'304',
                    message: err.message
                }
            })
        }else{
            if(doc){
                doc.blogPraiseCount++;
                doc.save().then(function(doc){ 
                    //先判断operate的值,true的话,是点赞
                    if(operate){
                        //添加到喜欢的博客
                            User.findOne({_id:userId},function(err,userDoc){
                            if(type==0) {
                            var favouriteBlog = new FavouriteBlogList();
                            favouriteBlog.userId = userId;
                            favouriteBlog.blogId = blogOrWorkId;
                            favouriteBlog.type = type;
                            // favouriteBlog.operate = operate;
                            favouriteBlog.createTime = createTime;
                            favouriteBlog.save(function(err,doc1){
                                if(err){
                                    res.json({
                                        result:{
                                            status:'304',
                                            message: err.message
                                        }
                                    })
                                }else{
                                    var farouriteBlogId = doc1._id;
                                    userDoc.userFavouritesCount++;
                                    userDoc.favouriteBlogList.push(farouriteBlogId);
                                    userDoc.save(function(err,doc2){
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
                                                    message: 'success'
                                                }
                                            })
                                        }
                                    }) 
                                }
                            })
                        }else{
                                var favouriteWork = new FavouriteWorkList();
                                favouriteWork.userId = userId;
                                favouriteWork.workId = blogOrWorkId;
                                favouriteWork.type = type;
                                // favouriteWork.operate = operate;
                                favouriteWork.createTime = createTime;
                                favouriteWork.save(function(err,doc1){
                                    if(err){
                                        res.json({
                                            result:{
                                                status:'304',
                                                message: err.message
                                            }
                                        })
                                    }else{
                                        var farouriteWorkId = doc1._id;
                                        userDoc.userFavouritesCount++;
                                        userDoc.favouriteWorkList.push(farouriteWorkId);
                                        userDoc.save(function(err,doc2){
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
                                                        message: 'success'
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }  
                        })
                    }else{
                        //取消点赞
                        User.findOne({_id:userId},function(err,userDoc){
                            if(type==0){
                                FavouriteBlogList.remove({userId:userId,blogId:blogOrWorkId},function(err,doc1){
                                    if(err){
                                        res.json({
                                            result:{
                                                status:'304',
                                                message: err.message
                                            }
                                        })
                                    }else{
                                       userDoc.userFavouritesCount--;
                                       var result = [];
                                       userDoc.favouriteBlogList.forEach(item=>{
                                           if(item!=blogOrWorkId){
                                            result.push(item);
                                           }
                                       })
                                       userDoc.favouriteBlogList = result;
                                       userDoc.save(function(err,doc2){
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
                                                    message: 'success'
                                                }
                                            })
                                        }
                                       })
                                    }  
                                })
                            }else{
                                FavouriteWorkList.remove({userId:userId,workId:blogOrWorkId},function(err,doc1){
                                    if(err){
                                        res.json({
                                            result:{
                                                status:'304',
                                                message: err.message
                                            }
                                        })
                                    }else{
                                       userDoc.userFavouritesCount--;
                                       var result = [];
                                       userDoc.favouriteWorkList.forEach(item=>{
                                           if(item!=blogOrWorkId){
                                            result.push(item);
                                           }
                                       })
                                       userDoc.favouriteWorkList = result;
                                       userDoc.save(function(err,doc2){
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
                                                    message: 'success'
                                                }
                                            })
                                        }
                                       })   
                                    }  
                                })
                            }
                        })
                    }
                })
            }else{
                res.json({
                    result:{
                        status:'304',
                        message: '参数不对'
                    }
                })
            }
        }
    })
});

module.exports = router;

