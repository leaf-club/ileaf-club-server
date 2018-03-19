var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./../model/user');
var Blog = require('./../model/blog');
var Work = require('./../model/work');
var FavouriteList = require('./../model/favouriteList');
var LikeList = require('./../model/likeList');
var sendEmail = require('./../util/email');
var getRandomNumber = require('./../util/randomNumber');


mongoose.connect('mongodb://127.0.0.1:27017/leafclub');

mongoose.connection.on("connected", function () {
    console.log("MongoDB connected succeed.")
});

mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
    console.log("MongoDB disconnected.")
});

//手动添加一个用户
router.post('/register', function (req, res, next) {
    //var userId = 1;
    var userName = req.body.userName;
    var password = req.body.password;
    var contact = req.body.contact;
    var createTime = Date.now();
    var avatar = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520856372350&di=16e737ec8db51023769db892e5b059a8&imgtype=0&src=http%3A%2F%2Fp1.gexing.com%2Fshaitu%2F20121005%2F1117%2F506e513777326.jpg'
    var newUser = new User();

    //newUser.userId = userId;
    newUser.userName = userName;
    newUser.password = password;
    newUser.contact = contact;
    newUser.avatar = avatar;
    newUser.registeredTime = createTime;

    // var num = getRandomNumber();
    // console.log(req.session);
    // req.session.contact = num;
    // console.log(req.session);
    // sendEmail(contact,num);

    newUser.save(function (err, doc) {
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
                    userInfo: {
                        userId: doc._id,
                        userName: doc.userName,
                        avatar: doc.avatar,
                        contact: doc.contact
                    }
                }
            })
        }
    });
});

router.post('/validationCode',function(req,res,next){
    var email = req.body.email;
    var contact = getRandomNumber();
    req.session.contact = num;
    sendEmail(email,num);
    res.json({
        result: {
            status: '200',
            message: '验证码已发送'
        }
    })
})


//登录验证
router.post('/login', function (req, res, next) {
    var param = {
        contact: req.body.contact,
        password: req.body.password
    }
    // console.log(req.session);
    // var num = req.session.contact;
    // console.log("2"+num);
    User.findOne(param, function (err, doc) {
        if (err) {
            res.json({
                result: {
                    status: '304',
                    message: err.message
                }
            })
        } else {
            if (doc) {
                //验证成功后，把信息添加到cookie中
                res.cookie("userId", doc._id, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });

                res.cookie("userName", doc.userName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                // req.session.userId = doc._id;
                
                res.json({
                    result: {
                        status: "200",
                        message: 'success',
                    },
                    data: {
                        userInfo: {
                            userId: doc._id,
                            userName: doc.userName,
                            avatar: doc.avatar,
                            contact: doc.contact
                        }
                    }
                })
            } else {
                res.json({
                    result: {
                        status: "304",
                        message: '用户名或者密码不正确'
                    }
                })
            }
        }
    })
})

//登出
router.post('/logout', function (req, res, next) {
    res.cookie("userId", "", {
        path: '/',
        maxAge: -1
    })
    res.json({
        result: {
            status: "200",
            message: 'success',
        }
    })
})

//检查是否登录
router.get('/checkLogin', function (req, res, next) {
    if (req.cookies.userId) {
        User.findOne({ _id: req.cookies.userId }, function (err, userDoc) {
            if (err) {
                res.json({
                    result: {
                        status: '302',
                        message: '未登录',
                    },
                })
            } else {
                res.json({
                    result: {
                        status: '200',
                        message: '登录',
                    },
                    data: {
                        userInfo: {
                            userId: userDoc._id,
                            userName: userDoc.userName,
                            avatar: userDoc.avatar,
                            contact: userDoc.contact
                        }
                    }
                });
            }
        })
    } else {
        res.json({
            result: {
                status: '302',
                message: '未登录'
            }
        });
    }
})

//获取用户信息
router.get('/getUserInfo', function (req, res, next) {
    var userId = req.param('userId');
    User.findOne({ _id: userId }, function (err, userDoc) {
        if (err) {
            res.json({
                result: {
                    status: '304',
                    message: err.message
                }
            })
        } else {
            if (userDoc) {
                res.json({
                    result: {
                        status: '200',
                        message: 'success'
                    },
                    data: {
                        userInfo: userDoc
                    }
                })
            } else {
                res.json({
                    result: {
                        status: '304',
                        message: '该用户不存在'
                    }
                })
            }
        }
    })
})

//获取文章数，作品数，收藏数，点赞数，草稿数
router.get('/getCounts', function (req, res, next) {
    var userId = req.param("userId");
    Blog.find({ userInfo: userId, status: 1 }).then(function (blogDoc) {
        Work.find({ userInfo: userId }).then(function (workDoc) {
            FavouriteList.find({ userId: userId }).then(function (FavouriteList) {
                LikeList.find({ userId: userId }).then(function (LikeList) {
                    Blog.find({ userId: userId, status: 0 }).then(function (draftDoc) {
                        res.json({
                            result: {
                                status: '200',
                                message: 'success'
                            },
                            data: {
                                blogCount: blogDoc.length,
                                workCount: workDoc.length,
                                favoriteCount: FavouriteList.length,
                                likeCount: LikeList.length,
                                draftCount: draftDoc.length
                            }
                        })
                    })
                })
            })
        })
    })
})

//获取个人博客列表(需要传userId)
router.get('/getBlogList', function (req, res, next) {
    // let userId = req.cookies.userId;
    let userId = req.param('userId');
    let pageIndex = +req.param('pageIndex');
    let pageSize = +req.param('pageSize');
    let skip = (pageIndex - 1) * pageSize;   //分页参数

    //筛选的时候要选出blogStatus为1的已发布的博文
    let blogModel = Blog.find({ userInfo: userId, status: 1 }).skip(skip).limit(pageSize)
        .populate({ path: "userInfo", select: "userName avatar contact _id" });
    blogModel.sort({ createTime: -1 });
    blogModel.exec(function (err, doc) {
        if (err) {
            res.json({
                status: '3201',
                message: err.message
            })
        } else {
            FavouriteList.find({userId:userId},function(err,doc1){
                if(err){
                    res.json({
                        status:'302',
                        message:err.message
                    })
                }else{
                    LikeList.find({userId:userId},function(err,doc2){
                        if(err){
                            res.json({
                                status:'302',
                                message:err.message
                            })
                        }else{
                            doc.forEach(item=>{
                                doc1.forEach(item1=>{
                                    if(item._id==item1.blogId){
                                        item.favorited = true;
                                    }
                                })
                            });
                            doc.forEach(item=>{
                                doc2.forEach(item1=>{
                                    if(item._id==item1.blogId){
                                        item.liked = true;
                                    }
                                })
                            });
                            res.json({
                                result: {
                                    status: '200',
                                    message: '博客列表获取成功'
                                },
                                data: {
                                    blogList: doc
                                }
                            })
                        }
                    });   
                }
            }) 
        }
    })
})

//获取个人作品列表
router.get('/getWorkList', function (req, res, next) {
    let userId = req.cookies.userId;
    // let userId = req.param('userId');
    let pageIndex = +req.param('pageIndex');
    let pageSize = +req.param('pageSize');
    let skip = (pageIndex - 1) * pageSize;   //分页参数

    let workModel = Work.find({ userInfo: userId }).skip(skip).limit(pageSize);
    workModel.exec(function (err, doc) {
        if (err) {
            res.json({
                result: {
                    status: '304',
                    message: err.message
                }
            })
        } else {
            FavouriteList.find({userId:userId},function(err,doc1){
                if(err){
                    res.json({
                        status:'302',
                        message:err.message
                    })
                }else{
                    LikeList.find({userId:userId},function(err,doc2){
                        if(err){
                            res.json({
                                status:'302',
                                message:err.message
                            })
                        }else{
                            doc.forEach(item=>{
                                doc1.forEach(item1=>{
                                    if(item._id==item1.workId){
                                        item.favorited = true;
                                    }
                                })
                            });
                            doc.forEach(item=>{
                                doc2.forEach(item1=>{
                                    if(item._id==item1.workId){
                                        item.liked = true;
                                    }
                                })
                            });
                            res.json({
                                result: {
                                    status: '200',
                                    message: '博客列表获取成功'
                                },
                                data: {
                                    workList: doc
                                }
                            })
                        }  
                    });   
                }
            })
        }
    })
})

//获取收藏列表
router.get('/getFavouriteList', function (req, res, next) {
    let userId = req.cookies.userId;
    FavouriteList.findFavouriteBlogs(userId, function (err, doc) {
        if (err) {
            res.json({
                result: {
                    status: '302',
                    message: err.message
                }
            })
        } else {
            FavouriteList.findFavouriteWorks(userId, function (err, doc1) {
                if (err) {
                    res.json({
                        result: {
                            status: '302',
                            message: err.message
                        }
                    })
                } else {
                    LikeList.findLikeList(userId,function(err,doc2){
                        if(err){
                            res.json({
                                result: {
                                    status: '302',
                                    message: err.message
                                }
                            })
                        }else{
                            var favouriteBlogList = [];
                            var favouriteWorkList = [];
                            doc.forEach(item => {
                                if (item.userId == userId) {
                                    item.blogId.favorited = true;
                                }
                                doc2.forEach(item1=>{
                                    if(item.blogId._id==item1.blogId._id){
                                        item.blogId.liked = true;
                                    }
                                })
                                favouriteBlogList.push(item.blogId);                      
                            });                           
                            doc1.forEach(item => {
                                if (item.userId == userId) {
                                    item.workId.favorited = true;
                                }
                                doc2.forEach(item1=>{
                                    if(item.workId._id==item1.workId._id){
                                        item.workId.liked = true;
                                    }
                                })
                                favouriteWorkList.push(item.workId);
                            });
                            // doc1.forEach(item=>{
                            //     if(item.workId==doc2.workId){
                            //         item.workId.liked = true;
                            //     }
                            // })
                            res.json({
                                result: {
                                    status: '200',
                                    message: 'success'
                                },
                                data: {
                                    favouriteBlogList: favouriteBlogList,
                                    favouriteWorkList: favouriteWorkList
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

//获取点赞列表
router.get('/getLikeList', function (req, res, next) {
    let userId = req.cookies.userId;
    LikeList.findLikeBlogs(userId, function (err, doc) {
        if (err) {
            res.json({
                result: {
                    status: '302',
                    message: err.message
                }
            })
        } else {
            LikeList.findLikeWorks(userId, function (err, doc1) {
                if (err) {
                    res.json({
                        result: {
                            status: '302',
                            message: err.message
                        }
                    })
                } else {
                    FavouriteList.findFavouriteList(userId,function(err,doc2){
                        if(err){
                            res.json({
                                result: {
                                    status: '302',
                                    message: err.message
                                }
                            })
                        }else{
                            var likeBlogList = [];
                            var likeWorkList = [];
                            doc.forEach(item => {
                                if (item.userId == userId) {
                                    item.blogId.liked = true;
                                }
                                doc2.forEach(item1=>{
                                    if(item.blogId._id==item1.blogId._id){
                                        item.blogId.favorited = true;
                                    }
                                })
                                likeBlogList.push(item.blogId);
                            });
                            doc1.forEach(item => {
                                if (item.userId == userId) {
                                    item.workId.liked = true;
                                }
                                doc2.forEach(item1=>{
                                    if(item.workId._id==item1.workId._id){
                                        item.workId.favorited = true;
                                    }
                                })
                                likeWorkList.push(item.workId);
                            });
                            res.json({
                                result: {
                                    status: '200',
                                    message: 'success'
                                },
                                data: {
                                    likeBlogList: likeBlogList,
                                    likeWorkList: likeWorkList
                                }
                            })
                        }
                    })                   
                }
            })
        }
    })
})

//获取草稿列表
router.get('/getDraft', function (req, res, next) {
    let userId = req.cookies.userId;
    let pageIndex = +req.param('pageIndex');
    let pageSize = +req.param('pageSize');
    let skip = (pageIndex - 1) * pageSize;   //分页参数

    //筛选的时候要选出blogStatus为1的已发布的博文
    let blogModel = Blog.find({ userInfo: userId, status: 0 }).skip(skip).limit(pageSize);
    blogModel.sort({ createTime: -1 });
    blogModel.exec(function (err, doc) {
        if (err) {
            res.json({
                status: '3201',
                message: err.message
            })
        } else {
            res.json({
                result: {
                    status: '200',
                    message: '草稿列表获取成功'
                },
                data: {
                    draftList: doc
                }
            })
        }
    })
})
module.exports = router;
