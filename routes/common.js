var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./../model/user');
var Blog = require('./../model/blog');
var FavouriteBlogList = require('./../model/favouriteBlogList');
var FavouriteWorkList = require('./../model/favouriteWorkList');
var LikeBlogList = require('./../model/likeBlogList');
var LikeWorkList = require('./../model/likeWorkList');

//博客收藏，需要把收藏量+1
router.post('/favorite',function(req,res,next){
    // var _id = req.body.id;
    var userId = req.body.userId;
    var blogOrWorkId = req.body.id;
    var type = req.body.type;
    var operate = req.body.operate;
    var createTime = Date.now();

    //先判断operate的值,true的话,是点赞
    if(operate==true&&type==0){
        Blog.findOne({_id:blogOrWorkId},function(err,blogDoc){
            if(err){
                res.json({
                    result:{
                        status:'304',
                        message: err.message
                    }
                })
            }else{
                if(blogDoc){
                    blogDoc.favoriteNum++;
                    blogDoc.save().then(function(blogDoc){
                        var favouriteBlog = new FavouriteBlogList();
                        favouriteBlog.userId = userId;
                        favouriteBlog.blogId = blogOrWorkId;
                        favouriteBlog.createTime = createTime;
                        favouriteBlog.save(function(err,doc){
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
                    })
                }else{
                    res.json({
                        result:{
                            status:'304',
                            message: '博文不存在'
                        }
                    })
                }
            }
        })
    }else if(operate==true&&type==1){
        Work.findOne({_id:blogOrWorkId},function(err,workDoc){
            if(err){
                res.json({
                    result:{
                        status:'304',
                        message: err.message
                    }
                })
            }else{
                if(workDoc){
                    workDoc.favoriteNum++;
                    workDoc.save().then(function(workDoc){
                        var favouriteWork = new FavouriteWorkList();
                        favouriteWork.userId = userId;
                        favouriteWork.workId = blogOrWorkId;
                        favouriteWork.createTime = createTime;
                        favouriteWork.save(function(err,doc){
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
                    })
                }else{
                    res.json({
                        result:{
                            status:'304',
                            message: '作品不存在'
                        }
                    })
                }
            }
        })
    }else if(operate==false&&type==0){
        Blog.findOne({_id:blogOrWorkId},function(err,blogDoc){
            if(err){
                res.json({
                    result:{
                        status:'304',
                        message: err.message
                    }
                })
            }else{
                if(blogDoc){
                    blogDoc.favoriteNum--;
                    blogDoc.save().then(function(blogDoc){
                        FavouriteBlogList.remove({userId:userId,blogId:blogOrWorkId},function(err,doc){
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
                                        message: '取消收藏成功'
                                    }
                                })
                            }
                        })
                    })
                }
            }
        })
    }else{
        Work.findOne({_id:blogOrWorkId},function(err,workDoc){
            if(err){
                res.json({
                    result:{
                        status:'304',
                        message: err.message
                    }
                })
            }else{
                if(workDoc){
                    workDoc.favoriteNum--;
                    workDoc.save().then(function(workDoc){
                        FavouriteWorkList.remove({userId:userId,workId:blogOrWorkId},function(err,doc){
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
                                        message: '取消收藏成功'
                                    }
                                })
                            }
                        })
                    })
                }
            }
        })
    }
})
                       
//博客点赞，需要把点赞量+1
router.post('/like',function(req,res,next){
    // var _id = req.body.id;
    var userId = req.body.userId;
    var blogOrWorkId = req.body.id;
    var type = req.body.type;
    var operate = req.body.operate;
    var createTime = Date.now();

    //先判断operate的值,true的话,是点赞
    if(operate==true&&type==0){
        Blog.findOne({_id:blogOrWorkId},function(err,blogDoc){
            if(err){
                res.json({
                    result:{
                        status:'304',
                        message: err.message
                    }
                })
            }else{
                if(blogDoc){
                    blogDoc.likeNum++;
                    blogDoc.save().then(function(blogDoc){
                        var likeBlog = new LikeBlogList();
                        likeBlog.userId = userId;
                        likeBlog.blogId = blogOrWorkId;
                        likeBlog.createTime = createTime;
                        likeBlog.save(function(err,doc){
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
                    })
                }else{
                    res.json({
                        result:{
                            status:'304',
                            message: '博文不存在'
                        }
                    })
                }
            }
        })
    }else if(operate==true&&type==1){
        Work.findOne({_id:blogOrWorkId},function(err,workDoc){
            if(err){
                res.json({
                    result:{
                        status:'304',
                        message: err.message
                    }
                })
            }else{
                if(workDoc){
                    workDoc.likeNum++;
                    workDoc.save().then(function(workDoc){
                        var likeWork = new LikeWorkList();
                        likeWork.userId = userId;
                        likeWork.workId = blogOrWorkId;
                        likeWork.createTime = createTime;
                        likeWork.save(function(err,doc){
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
                    })
                }else{
                    res.json({
                        result:{
                            status:'304',
                            message: '作品不存在'
                        }
                    })
                }
            }
        })
    }else if(operate==false&&type==0){
        Blog.findOne({_id:blogOrWorkId},function(err,blogDoc){
            if(err){
                res.json({
                    result:{
                        status:'304',
                        message: err.message
                    }
                })
            }else{
                if(blogDoc){
                    blogDoc.likeNum--;
                    blogDoc.save().then(function(blogDoc){
                        LikeWorkList.remove({userId:userId,blogId:blogOrWorkId},function(err,doc){
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
                                        message: '取消收藏成功'
                                    }
                                })
                            }
                        })
                    })
                }
            }
        })
    }else{
        Work.findOne({_id:blogOrWorkId},function(err,workDoc){
            if(err){
                res.json({
                    result:{
                        status:'304',
                        message: err.message
                    }
                })
            }else{
                if(workDoc){
                    workDoc.likeNum--;
                    workDoc.save().then(function(workDoc){
                        LikeWorkList.remove({userId:userId,workId:blogOrWorkId},function(err,doc){
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
                                        message: '取消收藏成功'
                                    }
                                })
                            }
                        })
                    })
                }
            }
        })
    }
})

module.exports = router;

