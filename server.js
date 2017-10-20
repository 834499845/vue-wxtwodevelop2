/**
 * Created by LangK on 2016/12/20.
 */
var path = require('path')
var http = require('http')

var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')
const bodyParser = require('body-parser')
const request = require('request')
const qs = require('querystring')

require('body-parser-xml')(bodyParser)
const fs = require('fs')
const crypto = require('crypto')
const app = express()
const toke = require('./toke.js')
const getTok = require('./WX/getToken.js')
const getUser = require('./WX/getUser.js')
const getJdk = require('./WX/getJssdk.js');
require('./API/config.js')
const config = require('./WXconfig.js');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.xml({
  limit: '2MB',
  xmlParseOptions: {
    normalize: true,
    normalizeTags: true,
    explicitArray: false
  }
}))
app.use(express.static(path.join(__dirname, '/dist/')))
// 获取用户信息
app.post('/home', function (req, res) {
  var codeStr = req.body.url
  if (codeStr.length > 0) {
    var code = codeStr.split('?')[1].split('&')[0].split('=')[1]
    let _res = res
    // console.log('code:::', code)
    if (code) {
      getUser.getToken(code).then(data => {
        var tokenObj = JSON.parse(data)
        // console.log('根据code获取token--', tokenObj)
        var openId = tokenObj.openid
        var AccessToken = tokenObj.access_token
        var refreshTtoken = tokenObj.refresh_token
        if (openId && AccessToken && refreshTtoken) {
          toke.openId = openId
          toke.AccessToken = AccessToken
          toke.refreshTtoken = refreshTtoken
        }
        if (tokenObj.errmsg) {
          getUser.getUserInfo(toke.AccessToken, toke.openId).then(data => {
            // console.log('用户数据:::', data)
            _res.status(200).json({
              'status': 200,
              'data': 'error'
            })
          })
        } else {
          // 每隔7000秒刷新一次id和token
          // setInterval(function () {
          //   var refreshTtokenR = toke.refreshTtoken
          //   getUser.getRefreshToken(refreshTtokenR).then(data => {
          //     var tokenObjR = JSON.parse(data)
          //     toke.openId = tokenObjR.openid
          //     toke.AccessToken = tokenObjR.access_token
          //   })
          // }, 7000 * 1000)
          getUser.getUserInfo(toke.AccessToken, toke.openId).then(data => {
            console.log('用户数据:::', data)
            _res.status(200).json({
              'status': 200,
              'data': data
            })
          })
        }
      })
    } else if (toke.AccessToken.length > 0) {
      console.log('code有问题1')
      // 子页面进行授权
      // getUser.getUserInfo(toke.AccessToken, toke.openId).then(data => {
      //   console.log('返回的用户数据---', data)
      //   _res.status(200).json({
      //     'status': 200,
      //     'data': data
      //   })
      // })
    } else {
      console.log('code有问题2')
    }
  }
})
// jssdk信息
app.post('/apphome', function (req, res) {
  var clientUrl = req.body.urlStr.split('#')[0]
  // console.log('url+++++++++++++', clientUrl)
  // console.log(config.appId)
  let _res = res
  getJdk(clientUrl).then(data => {
    // console.log('JSSDK:::', data)
    _res.status(200).json({
      signature: data[0],
      timestamp: data[1],
      nonceStr: data[2],
      appId: config.appId
    })
  })
})

// 代理
var proxyTable = {
  '/client/home': {
    target: 'http://' + global.logIp + ':' + global.logport,
    changeOrigin: true
  },
  '/client/store': {
    target: 'http://' + global.logIp + ':' + global.logport,
    changeOrigin: true
  },
  '/client/consumer': {
    target: 'http://' + global.logIp + ':' + global.logport,
    changeOrigin: true
  },
  '/client/goods': {
    target: 'http://' + global.logIp + ':' + global.logport,
    changeOrigin: true
  },
  '/client/order': {
    target: 'http://' + global.logIp + ':' + global.logport,
    changeOrigin: true
  },
  '/client/payment': {
    target: "http://" + global.logIp + ":" + global.logport,
    changeOrigin: true
  },
  '/client/about': {
    target: "http://" + global.logIp + ":" + global.logport,
    changeOrigin: true
  },
  '/client/activity': {
    target: "http://" + global.logIp + ":" + global.logport,
    changeOrigin: true
  }
}
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// var port = 3031
// app.set('port', port)
// var server = http.createServer(app)
// server.listen(port)

app.listen(80, function () {
  console.log('server start')
})



// 服务器启动验证
// app.get('/', function (req, res) {
//   console.log(req.body)
//   var token = "yjceshi"
//   var signature = req.query.signature
//   var timestamp = req.query.timestamp
//   var nonce = req.query.nonce
//   var echostr = req.query.echostr
//   /*  加密/校验流程如下： */
//   //1. 将token、timestamp、nonce三个参数进行字典序排序
//   var array = new Array(token, timestamp, nonce)
//   array.sort()
//   var str = array.toString().replace(/,/g, "")
//   //2. 将三个参数字符串拼接成一个字符串进行sha1加密
//   var sha1Code = crypto.createHash("sha1")
//   var code = sha1Code.update(str, 'utf-8').digest("hex")
//   //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
//   if (code === signature) {
//     res.send(echostr)
//   } else { }
// })
