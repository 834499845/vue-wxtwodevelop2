<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <transition name="bounce">
        <div id="app" v-bind:style="{'overflow-y' : payPopup}" class="pay">
            <div class="main">
                <div class="callHome" @click="callClickHome">
                    首页
                </div>
                <div class="m-titleImg">
                    <div>
                        <img :src="dataObj.storeIcon | imgUrlFun" alt="">
                        <p v-cloak>{{dataObj.storeName}}</p>
                    </div>
                </div>
                <div class="m-consum">
                    <div>消费金额：<b>￥</b></div>
                    <div><input type="number" v-model="money" placeholder="0"></div>
                </div>
                <div class="m-pay">
                    <div class="pay-cont">
                        <h4>选择支付方式：</h4>
                        <ul>
                            <li @touchstart="radioTouchStart($event)" @touchend="radioTouchEnd($event,200)" class="selectPay">
                                <div>
                                    <div class="selectImg"><img src="/static/img/weixin.png" alt=""></div>
                                    <div class="paypay">
                                        <p>微信支付</p>
                                        <p style="margin-top: 0.2rem;">微信安全支付</p>
                                    </div>
                                </div>
                                <div>
                                    <div :class="{radioV:isRadioV,radioG:isRadioG == 200}">
                                        <div></div>
                                    </div>
                                </div>
                            </li>
                            <li @touchstart="radioTouchStart($event)" @touchend="radioTouchEnd($event,100)" class="selectPay">
                                <div>
                                    <div class="selectImg"><img src="/static/img/yue.png" alt=""></div>
                                    <div class="paypay">
                                        <p>余额支付</p>
                                        <p style="margin-top: 0.2rem;">账户余额：￥<small>{{amount | amountFun}}</small></p>
                                    </div>
                                </div>
                                <div>
                                    <div :class="{radioV:isRadioV,radioG:isRadioG == 100}">
                                        <div></div>
                                    </div>
                                </div>
                            </li>
                            <li class="payBut selectPay">
                                <div @touchstart="payTouch($event)" @touchend="payTouchEnd($event)">
                                    <img src="/static/img/payBut.png" alt="">
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="m-introduce">
                    <h4>
                        商家介绍
                    </h4>
                    <ul class="strLi">
                        <li>
                            <p v-show="TeSestrSShow">
                                {{storeInf}}
                            </p>
                            <p v-show="!TeSestrSShow">
                                暂无信息
                            </p>
                        </li>
                    </ul>
                    <ul class="imgLi">
                        <li v-for="stor in storImgs">
                            <img :src="stor | imgStoreUrlFun" alt="">
                        </li>
                    </ul>
                </div>
            </div>
            <div v-show="ToxShowTrue" class="tostPopup">
                <div class="ToxPopup">
                    <div>
                        提示
                    </div>
                    <div>
                        {{hintStr}}
                    </div>
                    <div>
                        <div @click="callPayClick">
                            取消
                        </div>
                        <div @click="callPayClick">
                            确认
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    import { MessageBox, Indicator } from 'mint-ui';
    const crypto = require('crypto');
    const configA = require('../../WXconfig.js');
    require("../../API/config.js");
    export default {
        name: 'pay',
        data() {
            return {
                ToxShowTrue: false,
                hintStr: '',
                payPopup: 'scroll',
                isTriangle: 0,
                isRadioV: true,
                isRadioG: 200,
                money: '',
                dataObj: {
                    storeName: '诸葛烤鱼'
                },
                payid: '',
                amount: 0,
                startTouchY: '',
                channel: '',
                storImgs: [
                ],
                imgSShow: false,
                TeSestrSShow: true,
                JYstrSShow: true,
                storeInf: '',
                imgss: []
            }
        },
        computed: mapState(['storeObj', 'WXUSerId', 'userDetailsObj', 'userPayDetaObj', 'payWarthObj', 'erPayObj']),
        filters: {
            // 时间戳过滤
            ctimeFun: function (val) {
                var now = new Date(val)
                var year = now.getYear() - 100;
                var month = now.getMonth() + 1;
                month = month > 9 ? month : "0" + month
                var date = now.getDate();
                date = date > 9 ? date : "0" + date
                var hour = now.getHours();
                hour = hour > 9 ? hour : "0" + hour
                var minute = now.getMinutes();
                minute = minute > 9 ? minute : "0" + minute
                return "20" + year + "-" + month + "-" + date;
            },
            // 图片过滤
            imgUrlFun: function (val) {
                if (val) {
                    return "http://" + global.logIp + ":" + global.logFileport + "/files" + val
                } else {
                    return "/static/img/errimg.png"
                }
            },
            // 商户图片过滤
            imgStoreUrlFun: function (val) {
                if (val) {
                    return "http://" + global.logIp + ":" + global.logFileport + "/files" + val
                } else {
                    return "/static/img/errimg.png"
                }
            },
            // 文字过滤
            strFun: function (val) {
                if (val) {
                    return val
                } else {
                    return '暂无信息'
                }
            },
            // 文字过滤
            amountFun: function (val) {
                return val.toFixed(2);
            }
        },
        created: function () {
            // f4be34ca5b227275015b22746a660001   self.payid f4be34ca5b288281015b6b933c65006a
            var self = this
            var payIdStr = localStorage.getItem('payIdStr')
            var TwoIdStr = localStorage.getItem('payTwoIdStr')
            this.$emit('appchildsay', "pay");
            document.title = '智慧玛特'
            self.amount = self.userDetailsObj.amount
            if (self.payWarthObj.pay == 'pay') {
                self.payid = self.payWarthObj.id
            }
            if (self.storeObj.pay == 'home') {
                self.payid = self.storeObj.id
            }
            // alert(payIdStr)
            // alert(self.payid)
            // alert(TwoIdStr)
            // 获取商户的信息
            if (payIdStr) {
                self.payid = payIdStr
                self.getstoreOne({
                    id: payIdStr
                }).then((data) => {
                    console.log(data)
                    if (data.data.code == "200") {
                        self.dataObj = data.data.data
                        if (data.data.data.storeImages == null && data.data.data.storeInfo == null) {
                            self.TeSestrSShow = false
                        } else {
                            if (data.data.data.storeInfo.length > 0) {
                                self.storeInf = data.data.data.storeInfo
                            }
                            self.imgss = data.data.data.storeImages
                            var ssssss = self.imgss.split(',')
                            if (ssssss.length > 0) {
                                self.storImgs = ssssss
                            }
                        }
                        self.payWarthObj.pay = ''
                        self.storeObj.pay = ''
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
            } else if (self.payid) {
                if (self.payid.length > 0) {
                    self.getstoreOne({
                        id: self.payid
                    }).then((data) => {
                        console.log(data)
                        if (data.data.code == "200") {
                            self.dataObj = data.data.data
                            if (data.data.data.storeImages == null && data.data.data.storeInfo == null) {
                                self.TeSestrSShow = false
                            } else {
                                if (data.data.data.storeInfo.length > 0) {
                                    self.storeInf = data.data.data.storeInfo
                                }
                                self.imgss = data.data.data.storeImages
                                var ssssss = self.imgss.split(',')
                                if (ssssss.length > 0) {
                                    self.storImgs = ssssss
                                }
                            }
                            self.payWarthObj.pay = ''
                            self.storeObj.pay = ''
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
            } else if (TwoIdStr) {
                if (TwoIdStr.length > 0) {
                    self.payid = TwoIdStr
                    self.getstoreOne({
                        id: TwoIdStr
                    }).then((data) => {
                        console.log(data)
                        if (data.data.code == "200") {
                            self.dataObj = data.data.data
                            if (data.data.data.storeImages == null && data.data.data.storeInfo == null) {
                                self.TeSestrSShow = false
                            } else {
                                if (data.data.data.storeInfo.length > 0) {
                                    self.storeInf = data.data.data.storeInfo
                                }
                                self.imgss = data.data.data.storeImages
                                var ssssss = self.imgss.split(',')
                                if (ssssss.length > 0) {
                                    self.storImgs = ssssss
                                }
                            }
                            self.payWarthObj.pay = ''
                            self.storeObj.pay = ''
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
            }
            // 如果已经获取到用户信息 则不用再次获取
            var issWxuserId = localStorage.getItem('WxuserId')
            // 获取用户余额
            self.getUserAll({
                id: self.WXUSerId.id
            }).then((data) => {
                if (data.data.code == 200) {
                    var listObj = data.data.data
                    for (var key in listObj) {
                        self.userDetailsObj[key] = listObj[key]
                    }
                    self.amount = data.data.data.amount
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

        },
        methods: {
            callPayClick() {
                var self = this
                self.ToxShowTrue = false
                self.hintStr = ''
                self.payPopup = 'scroll'
            },
            // 选择支付方式
            radioTouchStart(event) {
                this.startTouchY = event.changedTouches[0].clientY
            },
            radioTouchEnd(event, ind) {
                var distance = event.changedTouches[0].clientY - this.startTouchY
                if (15 > distance && distance > -15) {
                    this.isRadioG = ind
                }
            },
            isContains(str, substr) {
                return str.indexOf(substr) >= 0;
            },
            isChannelStr(str) {
                var a = []
                var sss = ''
                var aaaaaa = ''
                if (str.indexOf('?') >= 0) {
                    a = str.split('?')[1]
                    if (a.indexOf('&channel=') >= 0) {
                        var s = a.split('&')
                        s.forEach(function (ele, ind) {
                            if (ele.indexOf('channel=') >= 0) {
                                sss = ele.split('=')[1]
                            }
                        })
                        return sss
                    } else if (a.indexOf('channel=') >= 0) {
                        var s = a.split('&')
                        s.forEach(function (ele, ind) {
                            if (ele.indexOf('channel=') >= 0) {
                                aaaaaa = ele.split('=')[1]
                            }
                        })
                        return aaaaaa
                    }
                }
            },
            // 发起支付
            payTouch(event) {
                this.startTouchY = event.changedTouches[0].clientY
            },
            payTouchEnd(event) {
                var self = this
                var distance = event.changedTouches[0].clientY - this.startTouchY
                var urlStr = location.href
                if (urlStr.indexOf('?') != -1 && urlStr.indexOf('&') != -1 && urlStr.indexOf('=') != -1 && urlStr.indexOf('#') != -1) {
                    var sssStrs = urlStr.split('?')[1].split('&')[1].split('=')[1].split('#')[0]
                    var idStrArrs = []
                    var channelTrue = ''
                    if (sssStrs.indexOf('%7C') != -1) {
                        var pathStrUrlS = sssStrs.split('%7C')
                        pathStrUrlA = pathStrUrlS[0]
                        if (pathStrUrlA.indexOf('%3B') != -1) {
                            idStrArrs = pathStrUrlA.split('%3B')
                            // self.payid = idStrArrs[1]
                            channelTrue = idStrArrs[2]
                        }
                    } else {
                        if (sssStrs.indexOf('%3B') != -1) {
                            idStrArrs = sssStrs.split('%3B')
                            // self.payid = idStrArrs[1]
                            channelTrue = idStrArrs[2]
                        }
                    }
                    if (channelTrue.length > 0) {
                        self.channel = channelTrue
                    } else {
                        self.channel = 'system'
                    }
                } else {
                    self.channel = 'system'
                }
                // 支付
                if (15 > distance && distance > -15) {
                    localStorage.setItem('payTwoIdStr', self.payid)
                    if (self.isRadioG == '100') {
                        // 余额超出支付 才会继续进行支付  self.WXUSerId.id     self.payid
                        // 正式 f4be34ca5b1ef077015b1ef9e188000c f4be34ca5b227275015b22746a660001 
                        // 测试 4028818b5b14364c015b1442be0a0000 402881325b6b9b07015b6b9b821a0000
                        if (self.money > 0) {
                            if (self.userDetailsObj.amount >= self.money) {
                                Indicator.open('支付中...');
                                let beforeAmount = self.userDetailsObj.amount
                                self.getWXPay({
                                    consumer_id: self.WXUSerId.id,
                                    store_id: self.payid,
                                    amount: self.money,
                                    payment_type: self.isRadioG,
                                    channel: self.channel
                                }).then((data) => {
                                    Indicator.close();
                                    console.log(data)
                                    if (data.data.code == 200) {
                                        // MessageBox.alert('支付成功', '提示');
                                        self.ToxShowTrue = true
                                        self.hintStr = '支付成功'
                                        self.payPopup = 'hidden'
                                        self.userDetailsObj.amount = beforeAmount - self.money
                                        self.amount = self.userDetailsObj.amount
                                        self.money = ''
                                        self.userPayDetaObj.name = self.dataObj.storeName
                                        self.userPayDetaObj.money = self.money
                                        self.$router.push({
                                            path: '/paySuccess'
                                        })
                                    } else {
                                        // MessageBox.alert('支付失败', '提示');
                                        self.ToxShowTrue = true
                                        self.payPopup = 'hidden'
                                        self.hintStr = '支付失败'
                                    }
                                }).catch(msg => {
                                    // alert(JSON.stringify(msg))
                                    console.log(msg)
                                    // Indicator.close();
                                    // MessageBox.alert('支付失败-服务器错误', '提示');
                                    self.ToxShowTrue = true
                                    self.payPopup = 'hidden'
                                    self.hintStr = '支付失败-服务器错误'
                                })
                            } else {
                                // MessageBox.alert('余额不足', '提示');
                                self.ToxShowTrue = true
                                self.hintStr = '余额不足'
                                self.payPopup = 'hidden'
                            }
                        } else {
                            // MessageBox.alert('', '提示');
                            self.ToxShowTrue = true
                            self.payPopup = 'hidden'
                            self.hintStr = '消费金额不能为空'
                        }
                    } else {
                        if (self.money > 0) {
                            // 使用微信支付
                            self.getWXPay({
                                consumer_id: self.WXUSerId.id,
                                store_id: self.payid,
                                amount: self.money,
                                payment_type: self.isRadioG,
                                channel: self.channel
                            }).then((data) => {
                                var signTypePrepay = data.data.prepayId
                                var SIGN = 'prepay_id=' + signTypePrepay
                                var KEY = data.data.key
                                var payObj = self.getPaySign(SIGN, KEY)
                                // 支付
                                function onBridgeReady() {
                                    WeixinJSBridge.invoke(
                                        'getBrandWCPayRequest', {
                                            "appId": configA.appId, //公众号名称，由商户传入     
                                            "timeStamp": payObj.timestampStr, //时间戳，自1970年以来的秒数     
                                            "nonceStr": payObj.nonceStrStr, //随机串     
                                            "package": SIGN,
                                            "signType": "MD5", //微信签名方式：     
                                            "paySign": payObj.paysignStr //微信签名
                                        },
                                        function (res) {
                                            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                                self.userPayDetaObj.name = self.dataObj.storeName
                                                self.userPayDetaObj.money = self.money
                                                self.$router.push({
                                                    path: '/paySuccess'
                                                })
                                                self.money = ''
                                            } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                                                // MessageBox.alert('支付失败', '提示');
                                                self.ToxShowTrue = true
                                                self.hintStr = '支付失败'
                                                self.payPopup = 'hidden'
                                            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                                // MessageBox.alert('支付取消', '提示');
                                                self.ToxShowTrue = true
                                                self.hintStr = '支付取消'
                                                self.payPopup = 'hidden'
                                            }
                                        }
                                    );
                                    
                                }
                                if (typeof WeixinJSBridge == "undefined") {
                                    if (document.addEventListener) {
                                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                    } else if (document.attachEvent) {
                                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                    }
                                } else {
                                    onBridgeReady();
                                }
                            }).catch(msg => {
                                self.ToxShowTrue = true
                                self.payPopup = 'hidden'
                                self.hintStr = '支付失败-服务器错误'
                                // Indicator.close();
                                // MessageBox.alert('支付失败-服务器错误', '提示');
                            })
                        } else {
                            // MessageBox.alert('消费金额不能为空', '提示');
                            self.ToxShowTrue = true
                            self.payPopup = 'hidden'
                            self.hintStr = '消费金额不能为空'
                        }
                    }
                }
            },
            // 获取时间戳
            getTimestamp() {
                var time = new Date().valueOf()
                var times = parseInt(time / 1000)
                var ss = times.toString()
                return ss;
            },
            // 获取随机字符串
            getNonceStr() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 16; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            },
            // 获取签名
            getPaySign(packageStr, keyStr) {
                let timeStamp = this.getTimestamp()
                let nonceStr = this.getNonceStr()
                var sortData = "appId=" + configA.appId + "&nonceStr=" + nonceStr + "&package=" + packageStr + "&signType=MD5" + "&timeStamp=" + timeStamp;
                var pStr = sortData + "&key=" + keyStr
                var sha1Code = crypto.createHash("md5");
                var paySign = sha1Code.update(pStr, 'utf-8').digest("hex").toUpperCase();
                var paySignObj = {
                    paysignStr: paySign,
                    timestampStr: timeStamp,
                    nonceStrStr: nonceStr
                }
                return paySignObj;
            },
            callClickHome() {
                localStorage.setItem('payTwoIdStr', this.payid)
                this.$router.push({
                    path: '/home/homepage'
                })
            },
             ...mapActions(['getWXPay','getstoreOne','getUserAll','getWxJssdk','getWXGZHPay'])
        },
        beforeDestroy: function () {
            // localStorage.removeItem('payIdStr')
        }
    }

</script>

<style scoped>
    .paySuccess {
        color: green;
        font-size: 1.4rem;
    }
    
    #app {
        background-color: #f5f5f6;
        height: 100vh;
        width: 100vw;
        overflow-x: hidden;
        position: relative;
    }
    
    .main {
        background-color: #f5f5f6;
        position: relative;
    }
    
    .callHome {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        width: 4rem;
        font-size: 1.2rem;
        border: 1px solid #ccc;
        text-align: center;
        line-height: 2.1rem;
        height: 2.0rem;
        border-radius: 0.3rem;
    }
    
    .m-titleImg {
        height: 13rem;
        background-color: #f5f5f6;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .m-titleImg div {
        min-width: 6rem;
        height: 10rem;
        text-align: center;
    }
    
    .m-titleImg div img {
        width: 6rem;
        height: 6rem;
        border-radius: 0.3rem;
    }
    
    .m-titleImg div p {
        margin-top: 0.7rem;
        font-size: 1.2rem;
        color: #373737;
    }
    
    .m-consum {
        height: 5rem;
        background-color: #fff;
        width: 100vw;
        line-height: 5rem;
        overflow: hidden;
        padding-left: 3vw;
        display: flex;
    }
    
    .m-consum>div {
        /*width: 100%;*/
    }
    
    .m-consum>div:nth-child(1) {
        font-size: 1.2rem;
        color: #646464;
    }
    
    .m-consum>div:nth-child(1) b {
        font-size: 1.2rem;
        color: #2f2f2f;
    }
    
    .m-consum>div:nth-child(2) input {
        width: 65vw;
        border: 0;
        border-radius: 0;
        overflow: hidden;
        border-bottom: 1px solid #2f2f2f;
        font-size: 1.2rem;
        margin-left: 0.2rem;
    }
    
    .m-pay {
        min-height: 21rem;
        height: 100%;
        width: 100vw;
        background-color: #f5f5f6;
        overflow: hidden;
    }
    
    .pay-cont {
        width: 100%;
        margin-top: 2rem;
        background-color: #fff;
        overflow: hidden;
    }
    
    .pay-cont h4 {
        margin: 0;
        padding: 0;
        height: 3.5rem;
        padding-left: 1rem;
        font-size: 1.2rem;
        color: #828282;
        line-height: 3.5rem;
    }
    
    .pay-con ul {
        margin: 0;
        padding: 0;
    }
    
    .pay-cont .selectPay {
        display: flex;
        justify-content: space-between;
        height: calc(17rem / 3);
        width: 100vw;
        align-items: center;
        overflow: hidden;
    }
    
    .pay-cont .selectPay>div:nth-child(1) {
        display: flex;
        padding-left: 0.8rem;
    }
    
    .pay-cont .selectPay>div:nth-child(2) {
        width: 4rem;
        height: 5rem;
        display: flex;
        align-items: center;
    }
    
    .radioV {
        width: 2.0rem;
        height: 2.0rem;
        border: 1px solid #d2d2d2;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .radioV>div {
        width: 0.8rem;
        height: 0.8rem;
        background-color: white;
        border-radius: 50%;
    }
    
    .radioG {
        background-color: #1aac19;
        border: 1px solid #fff;
    }
    
    .paypay {}
    
    .paypay>p:nth-child(1) {
        font-size: 1.2rem;
        color: #010101;
        padding-left: 0.5rem;
    }
    
    .selectImg {
        width: 3.2rem;
        height: 3.2rem;
    }
    
    .selectImg img {
        width: 100%;
        height: 100%;
    }
    
    .paypay>p:nth-child(2) {
        font-size: 1.2rem;
        color: #010101;
        padding-left: 0.5rem;
    }
    
    .selectPay {
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .payBut div {
        width: 100vw;
        height: 3.8rem;
        display: flex;
        justify-content: center;
    }
    
    .payBut div img {
        width: 90%;
        height: 100%;
    }
    
    .m-introduce {
        background-color: #fff;
        margin-top: 3rem;
    }
    
    .m-introduce h4 {
        margin: 0;
        padding: 0;
        height: 3.5rem;
        line-height: 3.5rem;
        padding-left: 1rem;
        font-size: 1.2rem;
        color: #828282;
        border-bottom: 1px solid #f7f7f7;
    }
    
    .m-introduce li {
        overflow: hidden;
        width: 100vw;
        min-height: 2rem;
        /*height: 7rem;*/
        /*border: 1px solid red;*/
    }
    
    .m-introduce .strLi {
        overflow: hidden;
    }
    
    .m-introduce .strLi li p {
        font-size: 1.2rem;
        color: #545454;
        margin-top: 0.2em;
        padding-left: 1rem;
        padding-right: 1rem;
        text-indent: 2.7rem;
        padding-right: 0.5em;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
    
    .m-introduce li img {
        width: 100%;
    }
    
    .m-introduce .imgLi .bullImgLi {
        height: 4rem;
        line-height: 4rem;
        width: 100%;
        text-align: center;
        font-size: 1.2rem;
    }
    
    .indexnt {
        line-height: 1.5rem;
        text-indent: 2.4rem;
    }
    /*弹出框*/
    
    .tostPopup {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .ToxPopup {
        width: 80%;
        height: 14rem;
        background-color: #fff;
        overflow: hidden;
        border-radius: 0.3rem;
    }
    
    .ToxPopup>div {
        width: 100%;
        /*font-size: 1.2rem;*/
    }
    
    .ToxPopup>div:nth-child(1) {
        height: 4rem;
        line-height: 4.3rem;
        padding-left: 2rem;
        font-size: 1.2rem;
        overflow: hidden;
    }
    
    .ToxPopup>div:nth-child(2) {
        height: 6rem;
        line-height: 6rem;
        font-size: 1.2rem;
        padding-left: 2rem;
    }
    
    .ToxPopup>div:nth-child(3) {
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 1.2rem;
    }
    
    .ToxPopup>div:nth-child(3)>div {
        width: 4rem;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        margin-right: 0.9rem;
    }
    
    .ToxPopup>div:nth-child(3)>div:nth-child(1) {
        color: #828282;
    }
    
    .ToxPopup>div:nth-child(3)>div:nth-child(2) {
        color: #1aac19;
    }
    
    .bounce-enter-active {
        transition: all 0.7s ease;
    }
    
    .bounce-enter,
    .bounce-leave-active {
        transform: translateX(30px);
        opacity: 0;
    }
</style>