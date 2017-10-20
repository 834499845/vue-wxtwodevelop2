<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="consume">
        <div class="main">
            <ul>
                <li v-for="(list,index) in lists" @touchstart="storeListTouchstart($event,index)" @touchend="storeListTouchend($event,index)">
                    <div>
                        <div class="headImg">
                            <img :src="list.storeInfoEntity.storeIcon | imgUrlFun" alt="">
                        </div>
                        <div>
                            <p v-bind:style="{fontSize:list.storeInfoEntity.storeName == null ? fontTwo : list.storeInfoEntity.storeName.length >20 ? fontOne : fontTwo}">{{list.storeInfoEntity.storeName | strFun}}</p>
                            <p v-bind:style="{fontSize:list.storeInfoEntity.storeAddress == null ? fontTwo : list.storeInfoEntity.storeAddress.length >25 ? fontOne : fontTwo}">{{list.storeInfoEntity.storeAddress | strFun}}</p>
                            <p>{{list.ctime | ctimeFun}}</p>
                        </div>
                    </div>
                    <div>
                        <div v-bind:style="{fontSize:list.amount == null ? fontTwo : list.amount.length >25 ? fontOne : fontTwo}">
                            - {{list.amount | numFun}}
                        </div>
                        <div v-bind:style="{color:list.orderStatus == 0 ? redColor : greenColor}">
                            {{list.orderStatus | statusFun}}
                        </div>
                    </div>
                </li>
                <li id="orderLi" v-show="orderLi">
                    <div id="orderLiImg">
                        <img src="/static/img/暂无数据.png" alt="">
                    </div>
                    <div id="orderLiNull">
                        暂无记录
                    </div>
                </li>
            </ul>
        </div>
        <div class="strutTab">
        </div>
        <div v-show="isLoad" class="loadIng">
            <mt-spinner type="fading-circle" color="rgb(42, 83, 205)"></mt-spinner>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    import { Toast } from 'mint-ui';
    require("../../../API/config.js");
    export default {
        name: 'consume',
        data() {
            return {
                redColor: 'red',
                greenColor: 'green',
                fontOne: '1.2rem',
                fontTwo: '1.2rem',
                orderLi: true,
                lists: [],
                isLoad: false,
                startTouchY: '',
            }
        },
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
                return "20" + year + "-" + month + "-" + date + " " + hour + ":" + minute;
            },
            // 图片过滤
            imgUrlFun: function (val) {
                if (val) {
                    return "http://" + global.logIp + ":" + global.logFileport + "/files" + val
                } else {
                    return "/static/img/errimg.png"
                }
            },
            statusFun: function (val) {
                if (val == 0) {
                    return '待支付'
                } else {
                    return '已支付'
                }
            },
            strFun: function (val) {
                if (val) {
                    return val
                } else {
                    return '无'
                }
            },
            paystatusFun: function (val) {
                if (val == 100) {
                    return '余额支付'
                } else {
                    return '微信支付'
                }
            },
            numFun: function (val) {
                return val.toFixed(2);
            }
        },
        computed: mapState(['storeObj', 'WXUSerId', 'userDetailsObj', 'typeObj', 'WXuserObj', 'seekObj', 'payWarthObj', 'pathObj']),
        created: function () {
            var urlStr = location.href
            this.$emit('childsay', 'home%2FpayWater');
            var self = this
            document.title = '消费明细'
            this.$emit('isSelcts', 1)
            // 发起订单信息请求 self.WXUSerId.id f4be34ca5b8f4e09015bb22520cd009c
            self.isLoad = true
            var loUserId = localStorage.getItem('loUserId')
            // alert(self.WXUSerId.id)
            if (self.WXUSerId.id) {
                localStorage.setItem('loUserId', self.WXUSerId.id)
                self.getPayWarchAll({
                    consumer_id: self.WXUSerId.id,
                    page_size: 20,
                    number: 1,
                }).then((data) => {
                    self.isLoad = false
                    if (data.data.code == "200") {
                        self.lists = data.data.data.content
                        self.orderLi = false
                    } else if (data.data.code == "404") {
                        self.orderLi = true
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
                self.getPayWarchAll({
                    consumer_id: loUserId,
                    page_size: 20,
                    number: 1,
                }).then((data) => {
                    self.isLoad = false
                    if (data.data.code == "200") {
                        self.lists = data.data.data.content
                        self.orderLi = false
                    } else if (data.data.code == "404") {
                        self.orderLi = true
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
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=home%2FpayWater#wechat_redirect'
            }
        },
        beforeDestroy: function () {
            localStorage.removeItem('loUserId')
        },
        methods: {
            // 商户详情 touch处理
            storeListTouchstart(event, index) {
                this.startTouchY = event.changedTouches[0].clientY
            },
            storeListTouchend(event, ind) {
                var self = this
                var distance = event.changedTouches[0].clientY - this.startTouchY
                if (15 > distance && distance > -15) {
                    localStorage.removeItem('payTwoIdStr')
                    localStorage.removeItem('payIdStr')
                    self.payWarthObj.name = self.lists[ind].storeInfoEntity.storeName
                    self.payWarthObj.id = self.lists[ind].storeInfoEntity.id
                    self.payWarthObj.pay = 'pay'
                    this.$router.push({
                        path: '/pay'
                    })
                }
            },
            ...mapActions(['getPayWarchAll'])
        }
    }

</script>

<style scoped>
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
    
    .strutTab {
        height: 4.5rem;
    }
    
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
    
    .main {
        background-color: #f5f5f6;
    }
    
    .main li {
        height: 9rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f7f7f7;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        overflow: hidden;
        background-color: #fff;
    }
    
    .main li>div:nth-child(1) {
        height: 100%;
        display: flex;
        align-items: center;
    }
    
    .main li>div:nth-child(1)>div:nth-child(1) {
        width: 6rem;
        height: 6rem;
        border-radius: 0.4rem;
        /*border: 1px solid #f7f7f7;*/
        overflow: hidden;
        min-width: 6rem;
        min-height: 6rem;
    }
    
    .main li>div:nth-child(1)>div:nth-child(1) img {
        width: 100%;
        height: 100%;
    }
    
    .main li>div:nth-child(1)>div:nth-child(2) {
        margin-left: 0.7rem;
    }
    
    .main li>div:nth-child(1)>div:nth-child(2) p {
        margin-top: 0.2rem;
    }
    
    .main li>div:nth-child(1)>div:nth-child(2) p:nth-child(1) {
        font-size: 1.2rem;
        color: #353535;
        margin-top: 0;
        width: calc(100vw - 13.5rem);
        height: 1.7rem;
        line-height: 1.7rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    /*36*/
    
    .main li>div:nth-child(1)>div:nth-child(2) p:nth-child(2) {
        font-size: 1.2rem;
        color: #6f6f6f;
        margin-top: 0.4rem;
        width: calc(100vw - 13.5rem);
        height: 1.7rem;
        line-height: 1.7rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    
    .main li>div:nth-child(1)>div:nth-child(2) p:nth-child(3) {
        font-size: 1.2rem;
        color: #858585;
        margin-top: 0.4rem;
    }
    
    .main li>div:nth-child(2) {
        min-width: 5rem;
    }
    
    .main li>div:nth-child(2)>div:nth-child(1) {
        height: 2rem;
        line-height: 2rem;
        color: #353535;
        font-size: 1.2rem;
        text-align: right;
    }
    
    .main li>div:nth-child(2)>div:nth-child(2) {
        height: 2rem;
        line-height: 2rem;
        font-size: 1.2rem;
        margin-top: 0.3rem;
        text-align: right;
    }
</style>