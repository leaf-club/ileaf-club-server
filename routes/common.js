var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./../model/user');
var Blog = require('./../model/blog');
var Work = require('./../model/work');
var FavouriteList = require('./../model/favouriteList');
var LikeList = require('./../model/likeList');

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
                        var favouriteBlog = new FavouriteList();
                        favouriteBlog.userId = userId;
                        favouriteBlog.blogId = blogOrWorkId;
                        favouriteBlog.type = type;
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
                                    },
                                    data: {
                                        favoriteNum: blogDoc.favoriteNum
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
                        var favouriteWork = new FavouriteList();
                        favouriteWork.userId = userId;
                        favouriteWork.workId = blogOrWorkId;
                        favouriteWork.type = type;
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
                                    },
                                    data: {
                                        favoriteNum: workDoc.favoriteNum
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
                        FavouriteList.remove({userId:userId,blogId:blogOrWorkId,type:type},function(err,doc){
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
                                    },
                                    data: {
                                        favoriteNum: blogDoc.favoriteNum
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
                        FavouriteList.remove({userId:userId,workId:blogOrWorkId,type:type},function(err,doc){
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
                                    },
                                    data: {
                                        favoriteNum: workDoc.favoriteNum
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
                        var likeBlog = new LikeList();
                        likeBlog.userId = userId;
                        likeBlog.blogId = blogOrWorkId;
                        likeBlog.type = type;
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
                                    },
                                    data: {
                                        likeNum: blogDoc.likeNum
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
                    console.log(workDoc.likeNum++);
                    workDoc.save().then(function(workDoc){
                        var likeWork = new LikeList();
                        likeWork.userId = userId;
                        likeWork.workId = blogOrWorkId;
                        likeWork.type = type;
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
                                    },
                                    data: {
                                        likeNum: workDoc.likeNum
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
                        LikeList.remove({userId:userId,blogId:blogOrWorkId,type:type},function(err,doc){
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
                                    },
                                    data: {
                                        likeNum: blogDoc.likeNum
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
                        LikeList.remove({userId:userId,workId:blogOrWorkId,type:type},function(err,doc){
                            if(err){
                                res.json({
                                    result:{
                                        status:'304',
                                        message: err.message
                                    },
                                    data: {
                                        likeNum: workDoc.likeNum
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

