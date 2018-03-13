var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = require('./../model/blog');
var User = require('./../model/user');
var BlogCommentList = require('./../model/blogCommentList');
var BlogCommentReplyList = require('./../model/blogCommentReplyList');
var FavouriteList = require('./../model/favouriteList');
var LikeList = require('./../model/likeList');
var larger = require('./../util/util');
var selectTypeName = require('./../util/enumerator');


//id为-1以及status为0是草稿保存，没有id以及status为1是发布
router.post('/saveBlog', function (req, res, next) {
    var userId = req.body.userId,  //获取当前用户
        _id = req.body.id,
        timeNow = Date.now(),
        title = req.body.title,
        abstract = req.body.abstract,
        htmlCode = req.body.htmlCode,
        mdCode = req.body.mdCode,
        tag = req.body.tag,
        typeId = req.body.typeId,
        status = req.body.status;
    var typeName = selectTypeName(typeId);
    //先判断blogId是否存在，如果存在则更新，如果不存在，则保存
    if (_id == -1) {
        var blog = new Blog({
            userInfo: userId,
            title: title,
            abstract: abstract,
            htmlCode: htmlCode,
            mdCode: mdCode,
            tag: tag,
            typeId: typeId,
            status: status,
            typeName: typeName,
            createTime: timeNow,
            updateTime: timeNow,
        });
        blog.save(function (err, doc1) {
            if (status == 0) {
                if (err) {
                    res.json({
                        result: {
                            status: '3101',
                            message: '草稿未保存成功'
                        }
                    })
                } else {
                    res.json({
                        result: {
                            status: '200',
                            message: '草稿保存成功'
                        },
                        data: {
                            id: doc1._id
                        }
                    })
                }
            } else {
                if (err) {
                    res.json({
                        result: {
                            status: '3102',
                            message: '文章未保存成功'
                        }
                    })
                } else {
                    res.json({
                        result: {
                            status: '200',
                            message: '文章发布成功'
                        },
                        data: {
                            id: doc1._id
                        }
                    })
                }
            }
        })
    } else {
        Blog.update({
            _id: _id,
        }, {
                $set: {
                    updateTime: timeNow,
                    title: title,
                    abstract: abstract,
                    content: content,
                    htmlCode: htmlCode,
                    mdCode: mdCode,
                    tag: tag,
                    typeId: typeId,
                    status: status,
                    typeName: typeName,
                }
            }, function (err2, doc2) {
                if (status == 0) {
                    if (err2) {
                        res.json({
                            result: {
                                status: '3103',
                                message: '草稿更新失败'
                            }
                        })
                    } else {
                        res.json({
                            result: {
                                status: '200',
                                message: '草稿更新成功'
                            },
                            data: {
                                id: _id
                            }
                        })
                    }
                } else {
                    if (err2) {
                        res.json({
                            result: {
                                status: '3104',
                                message: '发布失败'
                            }
                        })
                    } else {
                        res.json({
                            result: {
                                status: '200',
                                message: '发布成功'
                            },
                            data: {
                                id: _id
                            }
                        })
                    }
                }
            })
    }
})

//获取博客列表
router.get('/getBlogList', function (req, res, next) {
    let userId = req.param('userId');
    let pageIndex = +req.param('pageIndex');
    let pageSize = +req.param('pageSize');
    let skip = (pageIndex - 1) * pageSize;   //分页参数

    //删选的时候要选出blogStatus为1的已发布的博文
    Blog.findBlogList(skip,pageSize).then(function(docs){
        if(userId){
            FavouriteList.find({ userId: userId, type: 0 }).then(function (favouriteDocs) {
                LikeList.find({ userId: userId, type: 0 }).then(function (likeDocs) {
                    docs.forEach(item => {
                        favouriteDocs.forEach(item1 => {
                            if (item._id == item1) {
                                item.favorited = true;
                            }
                        });
                        likeDocs.forEach(item2 => {
                            if (item._id == item2) {
                                item.liked = true;
                            }
                        });
                    });
                    res.json({
                        result: {
                            status: '200',
                            message: 'success'
                        },
                        data: {
                            blogList: docs
                        }
                    })
                })
            })
        }else{
            res.json({
                result: {
                    status: '200',
                    message: 'success'
                },
                data: {
                    blogList: docs
                }
            })
        }
    })
})

//获取推荐博客
router.get('/getRecommendBlogList', function (req, res, next) {
    //let userId = req.cookies.userId;
    let userId = req.param("userId");
    let count = +req.param('count');
    Blog.findBlogs(count)
        .then(function (docs) {
            if (userId) {
                FavouriteList.find({ userId: userId, type: 0 }).then(function (favouriteDocs) {
                    // var favouriteBlogList = userDocs.favouriteBlogList;
                    LikeList.find({ userId: userId, type: 0 }).then(function (likeDocs) {
                        docs.forEach(item => {
                            favouriteDocs.forEach(item1 => {
                                if (item._id == item1) {
                                    item.favorited = true;
                                }
                            });
                            likeDocs.forEach(item2 => {
                                if (item._id == item2) {
                                    item.liked = true;
                                }
                            });
                        });
                        res.json({
                            result: {
                                status: '200',
                                message: 'success'
                            },
                            data: {
                                blogList: docs
                            }
                        })
                    })
                })
            }
            else {
                res.json({
                    result: {
                        status: '200',
                        message: 'success'
                    },
                    data: {
                        blogList: docs
                    }
                })
            }
        })
})

//获取博客详情，需要把阅读的数量+1
router.get('/getBlogDetail', function (req, res, next) {
    var _id = req.param('id');
    Blog.findOne({ _id: _id }, function (err, doc) {
        if (err) {
            res.json({
                result: {
                    status: '304',
                    message: err.message
                }
            })
        } else {
            if (doc) {
                doc.readNum++;
                doc.save()
                    .then(function (doc) {
                        Blog.findBlogDetail(_id, function (err, doc2) {
                            if (err) {
                                res.json({
                                    result: {
                                        status: '304',
                                        message: err.message
                                    }
                                })
                            } else {
                                res.json({
                                    result: {
                                        status: '200',
                                        message: 'success'
                                    },
                                    data: {
                                        blogDetail: doc2
                                    }
                                })
                            }
                        })
                    })
            } else {
                res.json({
                    result: {
                        status: '304',
                        message: '该文章不存在'
                    }
                })
            }
        }
    })
})

//添加博客评论(需要的参数有评论人的id,评论的博客的id,以及评论的内容)
router.post('/addBlogComment', function (req, res, next) {
    var blogId = req.body.blogId;
    var commentId = req.body.commentId;
    var userInfo = req.body.userId;
    var repliedUserInfo = req.body.repliedUserId;
    var content = req.body.content;
    var status = req.body.status;
    var createTime = Date.now();

    Blog.findOne({ _id: blogId }, function (err, doc) {
        if (err) {
            res.json({
                result: {
                    status: '302',
                    message: err.message
                }
            })
        } else {
            if (doc && status == 1) {
                var blogComment = new BlogCommentList();
                blogComment.blogId = blogId;
                blogComment.userInfo = userInfo;
                blogComment.repliedUserInfo = repliedUserInfo;
                blogComment.createTime = createTime;
                blogComment.likeNum = 0;
                blogComment.content = content;
                blogComment.status = status;
                blogComment.save().then(function (blogCommentDoc) {
                    doc.commentNum++;
                    doc.save(function (err, newDoc) {
                        if (err) {
                            res.json({
                                result: {
                                    status: '302',
                                    message: err.message
                                }
                            })
                        } else {
                            res.json({
                                result: {
                                    status: '200',
                                    message: "success"
                                }
                            })
                        }
                    })
                })
            } else if (doc && status == 2) {
                BlogCommentList.findOne({ _id: commentId }, function (err, doc) {
                    var blogCommentReply = new BlogCommentReplyList();
                    blogCommentReply.replyUserInfo = userInfo,
                        blogCommentReply.repliedUserInfo = repliedUserInfo,
                        blogCommentReply.replyContent = content,
                        blogCommentReply.createTime = createTime,
                        blogCommentReply.save(function (err, doc1) {
                            if (err) {
                                res.json({
                                    result: {
                                        status: '302',
                                        message: err.message
                                    }
                                })
                            } else {
                                var replyId = doc1._id;
                                doc.replyList.push(replyId);
                                doc.save(function (err, doc2) {
                                    if (err) {
                                        res.json({
                                            result: {
                                                status: '302',
                                                message: err.message
                                            }
                                        })
                                    } else {
                                        res.json({
                                            result: {
                                                status: '200',
                                                message: "success"
                                            }
                                        })
                                    }
                                })
                            }
                        })
                })
            } else {
                res.json({
                    result: {
                        status: '304',
                        message: "the blog does not exist"
                    }
                })
            }
        }
    })
});

//获取评论以及评论的回复
router.get('/getCommentList', function (req, res, next) {
    var blogId = req.param('blogId');
    //var commentAndReplyList = [];
    BlogCommentList.findUserByCommentId(blogId, function (err, doc) {
        if (err) {
            res.json({
                result: {
                    status: '302',
                    message: err.message
                }
            })
        } else {
            if (doc) {
                //将评论按时间排序;
                if (doc != null) {
                    doc.sort(larger("createTime"));
                }
                //将评论中的回复按时间排序;
                if (doc.replyList != null) {
                    doc.replyList.sort(larger("createTime"));
                }
                res.json({
                    result: {
                        status: '200',
                        message: 'success'
                    },
                    data: {
                        commentList: doc
                    }
                })
            }
        }
    })
});

//给评论点赞
router.post('/likeCommet',function(req,res,next){
    var commentId = req.body.commentId;
    BlogCommentList.findOne({_id:commentId},function(err,doc){
        if(err){
            res.json({
                result:{
                    status: '302',
                    message: err.message
                }
            })
        }else{
            doc.likeNum++;
            doc.save(function(err,newDoc){
                if(err){
                    res.json({
                        result:{
                            status: '302',
                            message: err.message
                        }
                    })
                }else{
                    res.json({
                        result:{
                            status: '200',
                            message:'success'
                        },
                        data:{
                            likeNum: newDoc.likeNum
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;

