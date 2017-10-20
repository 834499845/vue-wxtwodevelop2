const express = require('express');
const request = require('request');
const crypto = require('crypto');
const qs = require('querystring');
const config = require('../WXconfig.js');
const fs = require('fs')
const router = express.Router();

//获取 随机字符串
function getNonceStr() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    // console.log('text:', text, '********************')
    return text;
}
//获取时间 timestamp
function getTimestamp() {
    var time = new Date().valueOf()
    var times = parseInt(time / 10000)
    // console.log('times:', times, '********************')
    return times;
}
// 获取签名 paySign
// function getPaySign() {
//     let timestamp = getTimestamp()
//     let nonceStr = getNonceStr()
//     var sortData = "appId=" + config.appId + "&timeStamp=" + timestamp + "&nonceStr=" + nonceStr + "&package=" + package + "&signType=" + 'sha1';
//     var sha1Code = crypto.createHash("sha1");
//     var paySign = sha1Code.update(sortData, 'utf-8').digest("hex");
//     console.log('code:', paySign, '********************')
//     var paySignObj = {
//         paysignStr: paySign,
//         timestampStr: timestamp,
//         nonceStrStr: nonceStr,
//     }
//     return paySignObj;
// }

export default getPaySign;