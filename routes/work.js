var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Work = require('./../model/work');
var WorkCommentList = require('./../model/workCommentList');
var WorkCommentReplyList = require('./../model/workCommentReplyList');
var FavouriteBlogList = require('./../model/favouriteBlogList');
var FavouriteWorkList = require('./../model/favouriteWorkList');
var LikeBlogList = require('./../model/likeBlogList');
var LikeWorkList = require('./../model/likeWorkList');
var larger = require('./../util/util');


//保存作品
router.post('/saveWork',function(req,res,next){
    var userId = req.body.userId,  //获取当前用户
        createTime = Date.now(),
        url = req.body.url,
        title = req.body.title,
        description = req.body.description;
        cover = req.body.cover;
        //workTypeName = req.body.workTypeName,
        //workTypeId = req.body.workTypeId;

        var work = new Work({
            userInfo: userId,
            createTime:createTime,
            url:url,
            title:title,
            description:description,
            cover:cover,
        });

        work.save(function(err,doc){
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
                    data:{
                        workId: doc._id
                    }
                })
            }
        })    
})

//获取作品列表
router.get('/getWorkList',function(req,res,next){
    let pageIndex = +req.param('pageIndex');
    let pageSize = +req.param('pageSize');
    let skip = (pageIndex-1)*pageSize;   //分页参数
    
    let workModel = Work.find().skip(skip).limit(pageSize);
    workModel.sort({createTime:-1});
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

//根据时间获取最新的5部作品
router.get('/getRecommendWorkList',function(req,res,next){
    //let userId = req.cookies.userId;
    let userId = req.param("userId");
    let count = +req.param('count');  
    Work.findWorks(count)
    .then(function(docs){
        if(userId){
            FavouriteWorkList.find({userId:userId}).then(function(favouriteDocs){
                // var favouriteBlogList = userDocs.favouriteBlogList;
                LikeWorkList.find({userId:userId}).then(function(likeDocs){
                    docs.forEach(item=>{
                        favouriteDocs.forEach(item1=>{
                            if(item._id==item1){
                                docs.favorited = true;
                            }
                        });
                        likeDocs.forEach(item2=>{
                            if(item._id==item2){
                                docs.liked = true;
                            }
                        });
                    });
                    res.json({
                        result:{
                            status:'200',
                            message:'success'
                        },
                        data: {
                            workList:docs
                        }
                    })  
                })    
        })
    }else{
            res.json({
                result:{
                    status:'200',
                    message:'success'
                },
                data: {
                    workList:docs
                }
            })  
        } 
    })
})

//获取作品详情，需要把阅读的数量+1
router.get('/getWorkDetail',function(req,res,next){
    var _id = req.param('id');
    Work.findOne({_id:_id},function(err,doc){
        if(err){
               res.json({
                   result: {
                       status:'304',
                       message: err.message
                       }
                   })
               }else{
                   if(doc){
                       doc.readNum++;
                       doc.save()
                       .then(function(doc){
                           Work.findWorkDetail(_id,function(err,doc2){
                               if(err){
                                   res.json({
                                       result: {
                                           status:'304',
                                           message: err.message
                                       }
                                   })
                               }else{
                                   res.json({
                                       result: {
                                           status:'200',
                                           message:'success'
                                           },
                                       data: {
                                           workDetail: doc2
                                       }
                                   })
                               }
                           })
                       })
                   }else{
                       res.json({
                           result:{
                               status:'304',
                               message: '该文章不存在'
                           }
               })
           }
       }
    })
})

//作品点赞，需要把点赞量+1
// router.post('/praiseWork',function(req,res,next){
//     var _id = req.body.id;
//     Work.findOne({_id:_id},function(err,doc){
//         if(err){
//             res.json({
//                 result:{
//                     status:'304',
//                     message: err.message
//                 }
//             })
//         }else{
//             doc.workPraiseCount++;
//             doc.save(function(err,doc1){
//                 if(err){
//                     res.json({
//                         result:{
//                             status:'304',
//                             message: err.message
//                         }
//                     })
//                 }else{
//                     res.json({
//                         result:{
//                             status:'200',
//                             message: 'success'
//                         }          
//                     })
//                 }
//             })
//         }
//     })
// });

//添加博客评论(需要的参数有评论人的id,评论的博客的id,以及评论的内容)
// router.post('/addWorkComment',function(req,res,next){
//     var workId = req.body.workId;
//     var commentId = req.body.commentId;
//     var commentUserInfo = req.body.commentUserId;
//     var repliedUserInfo = req.body.repliedUserId;
//     var content = req.body.content;
//     var commentStatus = req.body.commentStatus;
//     var createTime = Date.now();
    
//     Work.findOne({_id:workId},function(err,doc){
//         if(err){
//             res.json({
//                 result:{
//                     status:'304',
//                     message: err.message
//                 }
//             })
//         }else{
//             if(doc&&commentStatus==1){
//                 var workComment = new WorkCommentList();
//                 workComment.workId = workId;    
//                 workComment.commentUserInfo = commentUserInfo;
//                 workComment.repliedUserInfo = repliedUserInfo;
//                 workComment.createTime = createTime;
//                 workComment.workCommentPraiseCount = 0;
//                 workComment.workCommentContent = content;
//                 workComment.commentStatus = commentStatus;
//                 workComment.save(function(err,doc1){
//                     if(err){
//                         res.json({
//                             result:{
//                                 status:'304',
//                                 message: err.message
//                             }
//                         })
//                     }else{
//                         res.json({
//                             result:{
//                                 status: '200',
//                                 message: 'success'
//                             }
//                         })
//                     }        
//                 })
//             }else if(doc&&commentStatus==2){
//                 WorkCommentList.findOne({_id:commentId},function(err,doc){
//                     var workCommentReply = new WorkCommentReplyList();
//                         workCommentReply.replyUserInfo = commentUserInfo;
//                         workCommentReply.commentRepliedUserInfo = repliedUserInfo;
//                         workCommentReply.replyContent = content;
//                         workCommentReply.createTime = createTime;
//                         workCommentReply.replyPraiseCount = 0;
//                     workCommentReply.save(function(err,doc1){
//                         if(err){
//                             res.json({
//                                 result:{
//                                     status:'304',
//                                     message: err.message
//                                 }
//                             })
//                         }else{
//                             var replyId = doc1._id;
//                             doc.workCommentReplyList.push(replyId);
//                             doc.save(function(err,doc2){
//                                 if(err){
//                                     res.json({
//                                         result:{
//                                             status:'304',
//                                             message: err.message
//                                         }
//                                     })
//                                 }else{
//                                     res.json({
//                                         result:{
//                                             status: '200',
//                                             message: 'success'
//                                         }
//                                     })
//                                 }
//                             })
//                         }
//                     })
//                 })
//             }else{
//                 res.json({
//                     result:{
//                         status: '304',
//                         message: "the blog does not exist"
//                     }
//                 })
//             }
//         }
//     })
// });

//获取评论以及评论的回复
// router.get('/getCommentAndReply',function(req,res,next){
//     var workId = req.param('workId');
//     var commentAndReplyList = [];
//     WorkCommentList.findUserByCommentId(workId,function(err,doc){
//         if(err){
//             res.json({
//                 result:{
//                     status:'304',
//                     message: err.message
//                 }
//             })
//         }else{
//             if(doc){
//                 //将评论按时间排序;
//                 if(doc!=null){
//                     doc.sort(larger("createTime"));
//                 }
//                 //将评论中的回复按时间排序;
//                 if(doc.workCommentReplyList!=null){
//                     doc.workCommentReplyList.sort(larger("createTime"));
//                 }  
//                 res.json({
//                     result:{
//                         status: '200',
//                         message: 'success'
//                     },
//                     data: {
//                         workCommentReplyList: doc
//                     }
//                 })  
//             }
//         }
//     })
// });

module.exports = router;