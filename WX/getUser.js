const express = require('express');
const request = require('request');
const qs = require('querystring');
const config = require('../WXconfig.js');

const router = express.Router();

// 获取拉去用户信息
function getToken(code) {
    let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
    let params = {
        appid: config.appId,
        secret: config.appSecret,
        code: code,
        grant_type: 'authorization_code'
    };
    let options = {
        method: 'get',
        url: reqUrl + qs.stringify(params)
    };
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (res) {
                // console.log('拉取用户信息')
                resolve(body);
            } else {
                reject(err);
            }
        })
    })
}
// 刷新
function getRefreshToken(refreshToken) {
    let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?';
    let params = {
        appid: config.appId,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    };
    let options = {
        method: 'get',
        url: reqUrl + qs.stringify(params)
    };
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (res) {
                // console.log('刷新Token')
                resolve(body);
            } else {
                reject(err);
            }
        })
    })
}
// 拉去用户
function getUserInfo(AccessToken, openId) {
    let reqUrl = 'https://api.weixin.qq.com/sns/userinfo?';
    let params = {
        access_token: AccessToken,
        openid: openId,
        lang: 'zh_CN'
    };
    let options = {
        method: 'get',
        url: reqUrl + qs.stringify(params)
    };
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (res) {
                // console.log('拉取用户成功')
                resolve(body);
            } else {
                reject(err);
            }
        });
    })
}

module.exports = {
    getUserInfo: getUserInfo,
    getRefreshToken: getRefreshToken,
    getToken: getToken
};