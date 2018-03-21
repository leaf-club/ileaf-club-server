var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var timeFormat = require('./formatDate');

var transport = nodemailer.createTransport(smtpTransport({
    host:"smtp.qq.com",
    secure:true,
    secureConnection: true,
    port:465,
    auth: {
        user: "330879229@qq.com",
        pass: "mbmsgmvmwsgtcaec"
    }
}));


var sendEmail = function(email,randomNumber){
    var dateNow = new Date();
    var year = dateNow.getFullYear();
    var month = dateNow.getMonth() + 1;
    var date = dateNow.getDate();
    var formatDateNow = timeFormat(dateNow);
    var mailOptions = {
        from: "330879229@qq.com",
        to: email,
        subject: "Leaf Club注册验证码",
        // text: "An excellent person like you",
        html: '<!DOCTYPE html>\
        <html lang="zh-CN">\
        <head>\
          <meta charset="UTF-8">\
          <title>validtion code</title>\
        </head>\
        <body>\
          <div style="max-width: 900px; margin: 0 auto;">\
            <a href="#"><img src="http://p5ttngtv2.bkt.clouddn.com/leaf-logo.png" alt="leaf-club-logo" style="border-bottom: 1px solid #eee;width: 200px;margin-bottom: 10px;"></a>\
            <header>尊敬的leaf用户：</header>\
            <p style="text-indent: 2em;">您好！</p>\
            <p style="text-indent: 2em;line-height: 1.5;">您于' + formatDateNow + '在Leaf Club官网提交了验证邮箱申请，验证码为：<span>' + randomNumber + '</span>。（在30分钟内有效，30分钟后需要重新提交）</p>\
            <p style="color:#ccc; font-size: 13px;line-height: 1.5;">注：此邮件为leaf club系统自动发出，请勿直接回复。如非本人操作，请注意安全。</p>\
            <footer style="text-align: right;">\
              <p>Leaf Club</p>\
              <p>' + year + '年' + month + '月' + date + '日</p>\
            </footer>\
          </div>\
        </body>\
        </html>'
    }
    transport.sendMail(mailOptions,function(err,response){
        if(err){
            console.log(err);
        }else{
            console.log(response);
            transport.close();
        }
    })
}

module.exports = sendEmail;
    
