var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

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
    var mailOptions = {
        from: "330879229@qq.com",
        to: email,
        subject: "this is a test",
        // text: "An excellent person like you",
        html: "this is the validation number"+ randomNumber
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
    
