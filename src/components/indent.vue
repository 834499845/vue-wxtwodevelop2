<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="consume">
        <div class="main">
            <ul>
                <li v-for="(list,index) in lists">
                    <div class="indentLeft">
                        <div>
                            <small v-bind:style="{color:list.status == 0 ? redColor : greenColor}">
                              [{{list.status | statusFun}}]
                            </small>{{list.goodsEntity.gname}}
                        </div>
                        <div>充{{list.goodsEntity.price}}元送{{list.goodsEntity.presentation}}元</div>
                    </div>
                    <div class="indentRig">
                        <div>
                            +&nbsp;{{list.goodsEntity.price + list.goodsEntity.presentation | numFun}}
                        </div>
                        <div>
                            {{list.goodsEntity.ctime | ctimeFun}}
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
    export default {
        name: 'consume',
        data() {
            return {
                redColor: "red",
                greenColor: "green",
                orderLi: false,
                lists: [],
                isTriangle: 0,
                isLoad: false
            }
        },
        computed: mapState(['storeObj', 'WXUSerId', 'userDetailsObj']),
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
                return "20" + year + "." + month + "." + date;
            },
            // 图片过滤
            imgUrlFun: function (val) {
                if (val.split('/')[1] == 'static') {
                    return val
                } else {
                    return "http://" + global.logIp + ":" + global.logFileport + "/files" + val
                }
            },
            statusFun: function (val) {
                if (val == 0) {
                    return '未支付'
                } else {
                    return '已支付'
                }
            },
            numFun: function (val) {
                return val.toFixed(2);
            }
        },
        created: function () {
            var self = this
            this.$emit('appchildsay', 'indent');
            document.title = '充值记录'
            // 发起订单信息请求 self.WXUSerId.id f4be34ca5b1ef077015b1ef9e188000c
            self.isLoad = true
            var loUserId = localStorage.getItem('loUserId')
            if (self.WXUSerId.id) {
                localStorage.setItem('loUserId', self.WXUSerId.id)
                self.getOrderAll({
                    id: self.WXUSerId.id,
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
                    Toast({
                        message: msg,
                        className: 'toastLoad'
                    });
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
                self.getOrderAll({
                    id: self.WXUSerId.id,
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
                    Toast({
                        message: msg,
                        className: 'toastLoad'
                    });
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
                self.isLoad = false
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=indent#wechat_redirect'
            }

        },
        beforeDestroy: function () {
            localStorage.removeItem('loUserId')
        },
        methods: {
            ...mapActions(['getOrderAll'])
        }
    }

</script>

<style scoped>
    #app {
        width: 100vw;
        height: 100vh;
        overflow-x: hidden;
        background-color: #f5f5f6;
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
    
    .main {
        background-color: #f5f5f6;
    }
    
    .main li {
        height: 6.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f7f7f7;
        overflow: hidden;
        background-color: #fff;
    }
    
    .indentLeft>div:nth-child(1) {
        height: 2.2rem;
        line-height: 2.2rem;
        font-size: 1.2rem;
        color: #585858;
        margin-left: 1rem;
    }
    
    .indentLeft>div:nth-child(1) small {
        font-size: 1.2rem;
    }
    
    .indentLeft>div:nth-child(2) {
        margin-top: 0.5rem;
        color: #6f6f6f;
        line-height: 2rem;
        height: 2rem;
        font-size: 1.2rem;
        margin-left: 1rem;
    }
    
    .indentRig {
        margin-right: 1.3rem;
    }
    
    .indentRig>div:nth-child(1) {
        color: #ff2641;
        font-size: 1.2rem;
        height: 2.2rem;
        line-height: 2.2rem;
    }
    
    .indentRig>div:nth-child(2) {
        margin-top: 0.5rem;
        color: #6f6f6f;
        font-size: 1.2rem;
        height: 2rem;
        line-height: 2rem;
        text-align: right;
    }
    
    #orderLi {
        width: 100%;
        display: flex;
        justify-content: center;
        font-size: 1.2rem;
        color: red;
    }
    
    .strutTab {
        height: 4.5rem;
    }
</style>