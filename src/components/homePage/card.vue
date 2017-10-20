<template id="card" xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="card">
        <div class="h">
            请选择充值套餐
        </div>
        <div class="main">
            <ul>
                <li v-for="(list,index) in lists">
                    <div class="rocedDeta">
                        <div>
                            <span>{{list.gname}}</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余：{{list.inventory}}</span>
                        </div>
                        <div>
                            <span>冲{{list.price}}元送{{list.presentation}}元</span>
                        </div>
                    </div>
                    <div @touchstart="shopTouch($event,index)" @touchend="shopTouchEnd($event,index)">
                        <span>充值</span>
                    </div>
                </li>
                <li id="orderLi" v-show="orderLi">
                    <div id="orderLiImg">
                        <img src="/static/img/暂无数据.png" alt="">
                    </div>
                    <div id="orderLiNull">
                        暂无套餐
                    </div>
                </li>
            </ul>
        </div>
        <div v-show="isLoad" class="loadIng">
            <mt-spinner type="fading-circle" color="rgb(42, 83, 205)"></mt-spinner>
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
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    import { Toast, MessageBox } from 'mint-ui';
    const crypto = require('crypto');
    const configA = require('../../../WXconfig.js');
    export default {
        name: 'card',
        data() {
            return {
                ToxShowTrue: false,
                hintStr: '',
                isLoad: false,
                lists: [
                ],
                isTriangle: 0,
                startTouchY: '',
                orderLi: true
            }
        },
        computed: mapState(['storeObj', 'WXUSerId', 'userDetailsObj', 'userPayDetaObj', 'pathObj']),
        created: function () {
            var urlStr = location.href
            this.$emit('childsay', 'home%2Fcard');
            var self = this
            document.title = '智慧支付'
            // 发起获取首页信息请求
            self.isLoad = true
            var loUserId = localStorage.getItem('loUserId')
            if (self.WXUSerId.id) {
                localStorage.setItem('loUserId', self.WXUSerId.id)
                self.getGoodsAll({
                }).then((data) => {
                    self.isLoad = false
                    if (data.data.code == "200") {
                        if (data.data.data.length > 0) {
                            self.orderLi = false
                            self.lists = data.data.data
                        } else {
                            self.orderLi = true
                        }
                    }
                }).catch(msg => {
                    self.isLoad = false
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
            } else if (loUserId) {
                self.WXUSerId.id = loUserId
                self.getGoodsAll({
                }).then((data) => {
                    self.isLoad = false
                    if (data.data.code == "200") {
                        if (data.data.data.length > 0) {
                            self.orderLi = false
                            self.lists = data.data.data
                        } else {
                            self.orderLi = true
                        }
                    }
                }).catch(msg => {
                    self.isLoad = false
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
            } else {
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=home%2Fcard#wechat_redirect'
            }

        },
        beforeDestroy: function () {
            localStorage.removeItem('loUserId')
        },
        methods: {
            callPayClick() {
                var self = this
                self.ToxShowTrue = false
                self.hintStr = ''
            },
            // 选中套餐
            triangleTouch: function (event, index) {
                this.startTouchY = event.changedTouches[0].clientY
            },
            triangleTouchend(event, index) {
                var distance = event.changedTouches[0].clientY - this.startTouchY
                if (15 > distance && distance > -15) {
                    this.isTriangle = index
                }
            },
            // 立即购买
            shopTouch(event, index) {
                this.startTouchY = event.changedTouches[0].clientY
            },
            // 点击买
            shopTouchEnd(event, index) {
                var distance = event.changedTouches[0].clientY - this.startTouchY
                var self = this
                if (15 > distance && distance > -15) {
                    var selectIndex = index
                    // 购买套餐 微信支付
                    if (self.lists[selectIndex].inventory > 0) {
                        self.getWXGZHPay({
                            consumer_id: self.WXUSerId.id,
                            goods_id: self.lists[selectIndex].id
                        }).then((data) => {
                            if (data.data.code == 200) {
                                var signTypePrepay = data.data.prepayId
                                var SIGN = 'prepay_id=' + signTypePrepay
                                var KEY = data.data.key
                                var payObj = self.getPaySign(SIGN, KEY)
                                // 支付
                                function onBridgeReady() {
                                    WeixinJSBridge.invoke(
                                        'getBrandWCPayRequest', {
                                            "appId": configA.appId,     //公众号名称，由商户传入     
                                            "timeStamp": payObj.timestampStr,         //时间戳，自1970年以来的秒数     
                                            "nonceStr": payObj.nonceStrStr, //随机串     
                                            "package": SIGN,
                                            "signType": "MD5",         //微信签名方式：     
                                            "paySign": payObj.paysignStr //微信签名
                                        },
                                        function (res) {
                                            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                                self.userPayDetaObj.name = self.lists[selectIndex].gname
                                                self.userPayDetaObj.money = self.lists[selectIndex].price
                                                self.$router.push({
                                                    path: '/paySuccess'
                                                })
                                            } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                                                // MessageBox.alert('微信支付失败', '提示');
                                                self.ToxShowTrue = true
                                                self.hintStr = '微信支付失败'
                                            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                                // MessageBox.alert('支付取消', '提示');
                                                self.ToxShowTrue = true
                                                self.hintStr = '支付取消'
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
                            } else {
                                // MessageBox.alert('支付失败', '提示')
                                self.ToxShowTrue = true
                                self.hintStr = '支付失败'
                            }
                        }).catch(msg => {
                            // MessageBox.alert('服务器错误', '提示')
                            self.ToxShowTrue = true
                            self.hintStr = '服务器错误'
                        })
                    } else {
                        // MessageBox.alert('暂时没有库存了', '提示')
                        self.ToxShowTrue = true
                        self.hintStr = '暂时没有库存了'
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
            ...mapActions(['getGoodsAll','getShopGoods','getWXGZHPay'])
        }
    }

</script>

<style scoped>
    #orderLi {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 25rem;
        background-color: #f5f5f6;
        border: 0;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
    }
    
    #orderLiImg {
        height: 11rem;
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 6.3rem;
        align-items: center;
    }
    
    #orderLiImg img {
        width: 11rem;
        height: 11rem;
    }
    
    #orderLiNull {
        margin-top: 3.5rem;
        width: 100%;
        height: 4rem;
        line-height: 4rem;
        text-align: center;
        font-size: 3rem;
        color: #bababa;
    }
    
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
    
    #app {
        background-color: #f5f5f6;
        height: 100vh;
        width: 100vw;
        overflow-x: hidden;
        position: relative;
    }
    
    .h {
        height: 5.5rem;
        line-height: 5.5rem;
        width: 100vw;
        padding-left: 3vw;
        font-size: 1.2rem;
        color: #969696;
        background-color: #f5f5f6;
    }
    
    .main {
        width: 100vw;
    }
    
    .main>ul>li {
        background-color: #fff;
        width: 100%;
        height: 7.5rem;
        overflow: hidden;
        border-bottom: 1px solid #f7f7f7;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .rocedDeta {
        margin-left: 1.4rem;
    }
    
    .rocedDeta>div:nth-child(1) {
        height: 2.5rem;
        line-height: 2.5rem;
    }
    
    .rocedDeta>div:nth-child(1)>span:nth-child(1) {
        color: #353535;
        font-size: 1.2rem;
    }
    
    .rocedDeta>div:nth-child(1)>span:nth-child(2) {
        color: #a3a3a3;
        font-size: 1.2rem;
    }
    
    .rocedDeta>div:nth-child(2) {
        margin-top: 0.5rem;
        height: 2rem;
        color: #3eb53d;
        font-size: 1.2rem;
    }
    
    .main>ul>li>div:nth-child(2) {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90%;
    }
    
    .main>ul>li>div:nth-child(2) span {
        width: 5rem;
        border: 1px solid #8dd68c;
        border-radius: 0.2rem;
        height: 2rem;
        font-size: 1.2rem;
        color: #71c970;
        line-height: 2rem;
        text-align: center;
        margin-right: 1.5rem;
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
        font-size: 1.2rem;
    }
    
    .ToxPopup>div:nth-child(1) {
        height: 4rem;
        line-height: 4.3rem;
        padding-left: 2rem;
        /*font-size: 2rem;*/
        overflow: hidden;
    }
    
    .ToxPopup>div:nth-child(2) {
        height: 6rem;
        line-height: 6rem;
        /*font-size: 1.7rem;*/
        padding-left: 2rem;
    }
    
    .ToxPopup>div:nth-child(3) {
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        /*font-size: 1.5rem;*/
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
</style>