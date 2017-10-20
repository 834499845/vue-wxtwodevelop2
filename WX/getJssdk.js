const express = require('express');
const request = require('request');
const crypto = require('crypto');
const qs = require('querystring');
const config = require('../WXconfig.js');
const WxToken = require('../Wxtoken.js');
const fs = require('fs')
const router = express.Router();

// 获取jsapi_ticket
function getJsApiTicket() {
    // const token = fs.readFileSync('./token').toString();
    const token = WxToken.Wxtoken
    const reqUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi';
    let options = {
        method: 'get',
        url: reqUrl
    };
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (res) {
                // console.log('jsapi_ticket:', body, '********************')
                resolve(body);
            } else {
                reject(err);
            }
        })
    })
}
//获取 noncestr
function getNonceStr() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    // console.log('text:', text, '********************')
    return text;
}
//获取时间 timestamp
function getTimestamp() {
    var time = new Date().valueOf()
    var times = parseInt(time / 1000)
    // console.log('times:', times, '********************')
    return times;
}
// 获取签名
function getSign(jsApiTicket, noncestr, timestamp, url) {
    let data = {
        'jsapi_ticket': jsApiTicket,
        'noncestr': noncestr,
        'timestamp': timestamp,
        'url': 'http://payment-api.juxiyo.com/'
    };
    var sortData = "jsapi_ticket=" + jsApiTicket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(sortData, 'utf-8').digest("hex");
    // console.log('code:', code, '********************')
    return code;
}
//返回数据分别为sign, timestamp, noncestr
function getJsApiData(clientUrl) {
    let noncestr = getNonceStr();
    let timestamp = getTimestamp();
    return getJsApiTicket().then(data => {
        return [getSign(JSON.parse(data).ticket, noncestr, timestamp, clientUrl), timestamp, noncestr];
    })
}


module.exports = getJsApiData;