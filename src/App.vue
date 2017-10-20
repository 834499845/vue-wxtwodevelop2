<template>
  <div id="app" class="views">
    <router-view @appchildsay="ApplistenToMyBoy" class="view" keep-alive></router-view>
  </div>

</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { MessageBox, Indicator } from 'mint-ui';
  export default {
    name: 'views',
    data() {
      return {
        isLoad: true,
        toUrlPathStr: '',
        inviteCodeStr: '0',
        inviteCodeStrCode: '',
        toUrlOnePath: '',
        chengYY: false
      }
    },
    computed: mapState(['WXuserObj', 'WXUSerId', 'userDetailsObj', 'erPayObj', 'codeObj']),
    created: function () {
      var self = this
      // invite_code
      var urlStr = location.href
      var pathStrs = ''
      var toStrPath = ''
      var payIdStr = ''
      // 判断url是否为正常url，如果正常，则进行下一步，否则跳转至正常url
      if (urlStr.indexOf('?') != -1 && urlStr.indexOf('&') != -1 && urlStr.indexOf('=') != -1 && urlStr.indexOf('#') != -1) {
        // 根据分享的url 获取到当前页面的信息
        if (urlStr.split('?')[1].split('&')[0].split('=')[0] == 'fenxiang' && urlStr.split('?')[1].split('&')[0].split('=')[1] == 'fenxiang') {
          var sssad = urlStr.split('?')[1].split('&')[1].split('=')[1]
          location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=' + sssad + '#wechat_redirect'
        } else {
          var sssStrs = urlStr.split('?')[1].split('&')[1].split('=')[1].split('#')[0]
          var idStrArrs = ''
          var channelStr = ''
          var inCodeStr = ''
          var pathStrUrlA = ''
          var pathStrsRe = ''
          if (sssStrs.indexOf('%7C') != -1) {
            var pathStrUrlS = sssStrs.split('%7C')
            pathStrUrlA = pathStrUrlS[0]
            self.inviteCodeStr = pathStrUrlS[1]
            if (pathStrUrlA.indexOf('%3B') != -1) {
              idStrArrs = pathStrUrlA.split('%3B')
              pathStrs = idStrArrs[0]
              payIdStr = idStrArrs[1]
              localStorage.setItem('payIdStr', payIdStr)
            } else {
              pathStrs = pathStrUrlA
            }
          } else {
            if (sssStrs.indexOf('%3B') != -1) {
              idStrArrs = sssStrs.split('%3B')
              pathStrs = idStrArrs[0]
              payIdStr = idStrArrs[1]
              localStorage.setItem('payIdStr', payIdStr)
            } else {
              pathStrs = sssStrs
            }
          }
          // 分享url处理，获取需要前往的页面
          if (pathStrs.length > 0) {
            pathStrsRe = pathStrs.replace('%2F', '/')
          }
          // 根据复制链接的url 获取页面信息
          var toStrPathToOne = ''
          var toStrPathToTwo = ''
          var toStrPathToOT = ''
          // 复制的URL处理获取到需要前往的页面。
          toStrPath = urlStr.split('#')[1]
          var toStrPathArr = toStrPath.split('/')
          if (toStrPathArr.length == 2) {
            toStrPathToOne = toStrPathArr[1]
            toStrPathToOT = toStrPathToOne
          } else if (toStrPathArr.length == 3) {
            toStrPathToOne = toStrPathArr[1]
            toStrPathToTwo = toStrPathArr[2]
            toStrPathToOT = toStrPathToOne + '%2F' + toStrPathToTwo
          } else {
            toStrPathToOT = ''
          }
          var issWxuserId = localStorage.getItem('WxuserId')
          var homepage = localStorage.getItem('homePage')
          self.WXUSerId.id = issWxuserId
          // 如果是从项目里面进入到指定主页。并返回之后会进入下面，
          if (homepage) {
            localStorage.removeItem('homePage')
            if (issWxuserId) {
              self.getUserAll({
                id: issWxuserId
              }).then((data) => {
                if (data.data.code == 200) {
                  self.userObj = data.data.data
                  var listObj = data.data.data
                  for (var key in listObj) {
                    self.userDetailsObj[key] = listObj[key]
                  }
                  self.details[0].amount = data.data.data.amount
                  self.isLoad = false
                }
              }).catch(msg => {
                switch (msg.status) {
                  case 500:
                    Toast({
                      message: '服务器没有启动',
                      className: 'toastLoad'
                    });
                    break;
                  case 504:
                    Toast({
                      message: '请求超时，服务器未启动',
                      className: 'toastLoad'
                    });
                    break;
                  default:
                    break;
                }
              })
            }
          } else {
            // 否则重新获取用户信息
            var isCodewen = self.isContains(urlStr, '?')
            var isCodeqi = self.isContains(urlStr, '&')
            var isCodedeng = self.isContains(urlStr, '=')
            if (isCodewen == true && isCodeqi == true && isCodedeng == true) {
              // WX获取用户
              self.getWXToken({
                url: urlStr
              }).then((data) => {
                if (data.data == 'error') {
                  // alert('code错误')
                  // 如果是复制的url地址，code会显示错误，跳转到授权页面。并传递一个参数，为复制url的页面。
                  location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=' + toStrPathToOT + '#wechat_redirect'
                } else {
                  // 正常进入。
                  // alert('code正确')
                  var dataObj = data.data
                  var userObjs = JSON.parse(dataObj)
                  // alert(userObjs.openid)
                  // oXFH71Vz_f5SCJ12m9BAKqaMfdRw
                  self.WXuserObj.openid = userObjs.openid
                  self.WXuserObj.nickname = userObjs.nickname
                  self.WXuserObj.sex = userObjs.sex
                  self.WXuserObj.language = userObjs.language
                  self.WXuserObj.city = userObjs.city
                  self.WXuserObj.province = userObjs.province
                  self.WXuserObj.country = userObjs.country
                  self.WXuserObj.headimgurl = userObjs.headimgurl
                  self.WXUSerId.openid = userObjs.openid
                  // 根据微信信息，存储到自己数据库。
                  // alert(self.inviteCodeStr)
                  self.getWXUser({
                    openid: userObjs.openid,
                    nick: userObjs.nickname,
                    avatar: userObjs.headimgurl,
                    invite_code: self.inviteCodeStr
                  }).then((data) => {
                    // otherCode 自己的code
                    // selfCode 邀请code
                    self.WXUSerId.id = data.data.data.id
                    self.WXUSerId.code = data.data.data.selfCode
                    // alert(data.data.data.selfCode)
                    self.inviteCodeStrCode = data.data.data.selfCode
                    self.codeObj.code = data.data.data.selfCode
                    localStorage.setItem('homeTrueA', 'Yes')
                    // 根据url处理的页面信息，进行跳转。
                    var OnrStrval = ''
                    if (pathStrsRe == 'home/homepage' || pathStrsRe == 'home') {
                      self.$router.push({
                        path: '/home/homepage'
                      })
                    } else {
                      if (pathStrsRe.length > 0) {
                        var sssssssss = '/' + pathStrsRe
                        self.$router.push({
                          path: sssssssss
                        })
                      } else {
                        self.$router.push({
                          path: '/home/homepage'
                        })
                      }
                    }
                    // localStorage.setItem('WxuserId', data.data.data.id)
                  }).catch(msg => {
                    alert(JSON.stringify(msg))
                  })
                }
              }).catch(msg => {
              })
            } else {
              // 判断url不符合时跳转到别的地方
              location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect'
            }
          }
        }
        // 同步请求jssdk信息
      } else {
        // 如果不符合uel,直接跳转授权页面.
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect'
      }
    },
    methods: {
      isContains(str, substr) {
        return str.indexOf(substr) >= 0;
      },
      // 监视当前在那个页面,并对其进行分享处理.
      ApplistenToMyBoy(val) {
        var self = this
        if (self.inviteCodeStrCode.length == 0) {
          self.inviteCodeStrCode = "000"
        }
        self.toUrlPathStr = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=' + val + '|' + self.inviteCodeStrCode + '#wechat_redirect'
        var linkPath = self.toUrlPathStr
        var urlStr = location.href
        if (urlStr.indexOf('?') != -1) {
          if (self.chengYY == false) {
            self.getWxJssdk({
              urlStr: urlStr
            }).then((data) => {
              wx.config({
                'debug': false, // 开启调试模式
                'appId': data.appId, // 微信后分配的App唯一标识符
                'timestamp': data.timestamp, // 时间标记（服务端返回的配置数据是有时效的）
                'nonceStr': data.nonceStr, // 加密或签名用的随机字符串
                'signature': data.signature, // 签名（能够证明数据是否被篡改）
                'jsApiList': [ // 打算调用的微信的JSAPI的列表，只有在这个列表中的方法才能调用成功
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage',
                  'onMenuShareQQ',
                  'onMenuShareWeibo',
                  'onMenuShareQZone',
                  'startRecord',
                  'stopRecord',
                  'onVoiceRecordEnd',
                  'playVoice',
                  'pauseVoice',
                  'stopVoice',
                  'onVoicePlayEnd',
                  'uploadVoice',
                  'downloadVoice',
                  'chooseImage',
                  'previewImage',
                  'uploadImage',
                  'downloadImage',
                  'translateVoice',
                  'getNetworkType',
                  'openLocation',
                  'getLocation',
                  'hideOptionMenu',
                  'showOptionMenu',
                  'hideMenuItems',
                  'showMenuItems',
                  'hideAllNonBaseMenuItem',
                  'showAllNonBaseMenuItem',
                  'closeWindow',
                  'scanQRCode',
                  'chooseWXPay',
                  'openProductSpecificView',
                  'addCard',
                  'chooseCard',
                  'openCard'
                ]
              })
              wx.ready(function () {
                // alert('成功')
                self.chengYY = true
                wx.onMenuShareAppMessage({
                  title: '聚硒优', // 分享标题
                  desc: self.WXuserObj.nickname + '-邀你一起参与2017安康网络龙舟竞技,赢取万元大奖', // 分享描述
                  imgUrl: 'http://116.62.180.74:9091/files/20170329/getheadimg.jpg', // 分享图标
                  link: 'http://payment-api.juxiyo.com?fenxiang=fenxiang&pathstr=' + val + '|' + self.inviteCodeStrCode, // 分享链接
                  type: 'link', // 分享类型,music、video或link，不填默认为link
                  dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                  success: function () {
                    // alert('成功')
                  },
                  cancel: function () {
                    // 用户取消分享后执行的回调函数
                    // alert('取消分享！')
                  },
                  fail: function (err) {
                    alert(JSON.stringify(err))
                  }
                });
                // 分享给朋友圈
                wx.onMenuShareTimeline({
                  title: '聚硒优', // 分享标题
                  imgUrl: 'http://116.62.180.74:9091/files/20170329/getheadimg.jpg',
                  link: 'http://payment-api.juxiyo.com?fenxiang=fenxiang&pathstr=' + val + '|' + self.inviteCodeStrCode, // 分享链接// 分享图标
                  success: function () {
                    // alert(self.inviteCodeStrCode)
                    // 用户确认分享后执行的回调函数
                    // alert('分享朋友圈成功！')
                  },
                  cancel: function () {
                    // 用户取消分享后执行的回调函数
                    // alert('取消分享！')
                  }
                });
                // 分享到qq
                wx.onMenuShareQQ({
                  title: '聚硒优', // 分享标题
                  desc: '邀你一起参与2017安康网络龙舟竞技,赢取万元大奖', // 分享描述
                  imgUrl: 'http://116.62.180.74:9091/files/20170329/getheadimg.jpg',// 分享图标
                  link: 'http://payment-api.juxiyo.com?fenxiang=fenxiang&pathstr=' + val + '|' + self.inviteCodeStrCode, // 分享链接
                  success: function () {
                    // 用户确认分享后执行的回调函数
                    // alert('分享QQ成功！')
                  },

                  cancel: function () {
                    // 用户取消分享后执行的回调函数
                    // alert('取消分享！')
                  }
                });
                // 分享到腾讯微博
                wx.onMenuShareWeibo({
                  title: '聚硒优', // 分享标题
                  desc: '邀你一起参与2017安康网络龙舟竞技,赢取万元大奖', // 分享描述
                  imgUrl: 'http://116.62.180.74:9091/files/20170329/getheadimg.jpg', // 分享图标
                  success: function () {
                    // 用户确认分享后执行的回调函数
                    // alert('分享QQ微博成功！')
                  },
                  link: 'http://payment-api.juxiyo.com?fenxiang=fenxiang&pathstr=' + val + '|' + self.inviteCodeStrCode, // 分享链接
                  cancel: function () {
                    // 用户取消分享后执行的回调函数
                    // alert('取消分享！')
                  }
                });
                // 分享到qq空间
                wx.onMenuShareQZone({
                  title: '聚硒优', // 分享标题
                  desc: '邀你一起参与2017安康网络龙舟竞技,赢取万元大奖', // 分享描述
                  imgUrl: 'http://116.62.180.74:9091/files/20170329/getheadimg.jpg', // 分享图标
                  success: function () {
                    // 用户确认分享后执行的回调函数
                    // alert('分享QQ空间成功！')
                  },
                  link: 'http://payment-api.juxiyo.com?fenxiang=fenxiang&pathstr=' + val + '|' + self.inviteCodeStrCode,// 分享链接
                  cancel: function () {
                    // 用户取消分享后执行的回调函数
                    // alert('取消分享！')
                  }
                });
              });
              wx.error(function (err) {
                // alert(JSON.stringify(err))
              });
            }).catch(msg => {
              // alert('服务器错误啦..')
            })
          } else {
            wx.onMenuShareAppMessage({
              title: '聚硒优', // 分享标题
              desc: self.WXuserObj.nickname + '-邀你一起参与2017安康网络龙舟竞技,赢取万元大奖', // 分享描述
              imgUrl: 'http://116.62.180.74:9091/files/20170329/getheadimg.jpg', // 分享图标
              link: 'http://payment-api.juxiyo.com?fenxiang=fenxiang&pathstr=' + val + '|' + self.inviteCodeStrCode, // 分享链接
              type: 'link', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // alert('成功')
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
                // alert('取消分享！')
              },
              fail: function (err) {
                alert(JSON.stringify(err))
              }
            });
            // 分享给朋友圈
            wx.onMenuShareTimeline({
              title: '聚硒优', // 分享标题
              imgUrl: 'http://116.62.180.74:9091/files/20170329/getheadimg.jpg',
              link: 'http://payment-api.juxiyo.com?fenxiang=fenxiang&pathstr=' + val + '|' + self.inviteCodeStrCode, // 分享链接// 分享图标
              success: function () {
                // alert(self.inviteCodeStrCode)
                // 用户确认分享后执行的回调函数
                // alert('分享朋友圈成功！')
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
                // alert('取消分享！')
              }
            });
            // 分享到qq
            wx.onMenuShareQQ({
              title: '聚硒优', // 分享标题
              desc: '邀你一起参与2017安康网络龙舟竞技,赢取万元大奖', // 分享描述
              imgUrl: 'http://116.62.180.74:9091/files/20170329/getheadimg.jpg',// 分享图标
              link: 'http://payment-api.juxiyo.com?fenxiang=fenxiang&pathstr=' + val + '|' + self.inviteCodeStrCode, // 分享链接
              success: function () {
                // 用户确认分享后执行的回调函数
                // alert('分享QQ成功！')
              },

              cancel: function () {
                // 用户取消分享后执行的回调函数
                // alert('取消分享！')
              }
            });
            // 分享到腾讯微博
            wx.onMenuShareWeibo({
              title: '聚硒优', // 分享标题
              desc: '邀你一起参与2017安康网络龙舟竞技,赢取万元大奖', // 分享描述
              imgUrl: 'http://116.62.180.74:9091/files/20170329/getheadimg.jpg', // 分享图标
              success: function () {
                // 用户确认分享后执行的回调函数
                // alert('分享QQ微博成功！')
              },
              link: 'http://payment-api.juxiyo.com?fenxiang=fenxiang&pathstr=' + val + '|' + self.inviteCodeStrCode, // 分享链接
              cancel: function () {
                // 用户取消分享后执行的回调函数
                // alert('取消分享！')
              }
            });
            // 分享到qq空间
            wx.onMenuShareQZone({
              title: '聚硒优', // 分享标题
              desc: '邀你一起参与2017安康网络龙舟竞技,赢取万元大奖', // 分享描述
              imgUrl: 'http://116.62.180.74:9091/files/20170329/getheadimg.jpg', // 分享图标
              success: function () {
                // 用户确认分享后执行的回调函数
                // alert('分享QQ空间成功！')
              },
              link: 'http://payment-api.juxiyo.com?fenxiang=fenxiang&pathstr=' + val + '|' + self.inviteCodeStrCode,// 分享链接
              cancel: function () {
                // 用户取消分享后执行的回调函数
                // alert('取消分享！')
              }
            });
          }

        }
      },
      ...mapActions(['getWXToken', 'getWXUser','getUserAll','getWxJssdk'])
    }
  }

</script>
<style>
  .loadIng {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    z-index: 1000000000;
    justify-content: center;
  }
  
  html,
  body,
  form,
  fieldset,
  p,
  div,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    -webkit-text-size-adjust: 100%;
  }
  
  body {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
  }
  
  a {
    text-decoration: none;
  }
  
  img {
    border: 0px solid #ddd;
    outline: none;
  }
  
  [v-cloak] {
    display: none;
  }
  
  ul {
    margin: 0;
    padding: 0;
  }
  
  li {
    list-style: none;
  }
  
  .mint-button {
    height: 5rem;
  }
  
  p {
    margin: 0;
    padding: 0;
  }
  
  a,
  button,
  input,
  optgroup,
  select,
  textarea,
  div {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  
  body,
  html {
    margin: 0;
    padding: 0;
    font-family: "Microsoft YaHei", Arial, "Helvetica Neue", Helvetica, sans-serif;
    overflow-x: hidden;
    overflow-y: auto;
    min-width: 320px;
  }
  
  input,
  textarea {
    -webkit-appearance: none;
    outline: none;
  }
  
  a,
  img {
    -webkit-touch-callout: none;
  }
</style>