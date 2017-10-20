const express = require('express');
const request = require('request');
const qs = require('querystring');
const fs = require('fs')
const config = require('../WXconfig.js');
const WxToken = require('../Wxtoken.js');
const router = express.Router();

setInterval(function () {
    let Url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appId + '&secret=' + config.appSecret;
    request.get(Url, function (err, res, body) {
        if (res) {
            var tokenObj = JSON.parse(body);
            var token = tokenObj.access_token;
            // fs.writeFile('./token', token, function (err) {
            // });Wxtoken
            if (token) {
                console.log('已经存储成功**************')
                WxToken.Wxtoken = token
            }
        } else { }
    });
}, 7000 * 1000);

// 获取jssdk 所需 token
const getAccessToken = function () {
    let Url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appId + '&secret=' + config.appSecret;
    request.get(Url, function (err, res, body) {
        if (res) {
            var tokenObj = JSON.parse(body);
            var token = tokenObj.access_token;
            // fs.writeFile('./token', token, function (err) {
            // });Wxtoken
            if (token) {
                console.log('已经存储成功')
                WxToken.Wxtoken = token
            }
        } else { }
    });
};
getAccessToken()

// 服务器启动验证
// function yanzheng() {
//     var token = "yjceshi";
//     var signature = req.query.signature;
//     var timestamp = req.query.timestamp;
//     var nonce = req.query.nonce;
//     var echostr = req.query.echostr;
//     /*  加密/校验流程如下： */
//     //1. 将token、timestamp、nonce三个参数进行字典序排序
//     var array = new Array(token, timestamp, nonce);
//     array.sort();
//     var str = array.toString().replace(/,/g, "");
//     //2. 将三个参数字符串拼接成一个字符串进行sha1加密
//     var sha1Code = crypto.createHash("sha1");
//     var code = sha1Code.update(str, 'utf-8').digest("hex");
//     //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
//     if (code === signature) {
//         res.send(echostr)
//     } else { }
// }

module.exports = {
    getAccessToken: getAccessToken
}