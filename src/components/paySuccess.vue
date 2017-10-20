<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <transition name="bounce">
        <div id="app" class="paysuccess">
            <div class="successDeta">
                <div>
                    <img src="/static/img/成功.png" alt="">
                </div>
                <div>
                    支付成功！
                </div>
            </div>
            <div class="storeSu">
                <ul>
                    <li>
                        <div>店铺名称</div>
                        <div>{{successObj.name}}</div>
                    </li>
                    <li>
                        <div>支付金额</div>
                        <div>￥{{successObj.money}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </transition>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    import { Toast } from 'mint-ui';
    require("../../API/config.js");
    export default {
        name: 'paysuccess',
        data() {
            return {
                successObj: {
                    name: '',
                    money: ''
                }
            }
        },
        computed: mapState(['storeObj', 'WXUSerId', 'userDetailsObj', 'userPayDetaObj']),
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
                if (val.split('/')[1] == 'static') {
                    return val
                } else {
                    return "http://" + global.logIp + ":" + global.logFileport + "/files" + val
                }
            },
            // 文字过滤
            strFun: function (val) {
                if (val) {
                    return val
                } else {
                    return '暂无信息'
                }
            }
        },
        created: function () {
            var self = this
            document.title = '支付成功'
            this.$emit('appchildsay', "paySuccess");
            var nmae = self.userPayDetaObj.name
            var money = self.userPayDetaObj.money
            var nameStr = localStorage.getItem('nmae', nmae)
            var moneyStr = localStorage.getItem('money', money)
            var yxUserId = self.WXUSerId.id
            if (yxUserId.length > 0) {
                if (nmae && money) {
                    localStorage.setItem('nmae', nmae)
                    localStorage.setItem('money', money)
                    self.successObj.name = nmae
                    self.successObj.money = money
                } else if (moneyStr && nameStr) {
                    self.successObj.name = nameStr
                    self.successObj.money = moneyStr
                }
            } else {
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect'
            }
        },
        methods: {

        },
        beforeDestroy: function () {
            localStorage.removeItem('nmae')
            localStorage.removeItem('money')
        }
    }

</script>

<style scoped>
    #app {
        background-color: #f5f5f6;
        height: 100vh;
        width: 100vw;
        overflow-x: hidden;
    }
    
    .successDeta {
        height: 20.5rem;
        background-color: #f5f5f6;
        overflow: hidden;
    }
    
    .successDeta>div:nth-child(1) {
        margin-top: 3rem;
        width: 100%;
        height: 9.5rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .successDeta>div:nth-child(1) img {
        width: 9.5rem;
        height: 9.5rem;
    }
    
    .successDeta>div:nth-child(2) {
        margin-top: 2.5rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.4rem;
        color: #333;
    }
    
    .storeSu {
        background-color: #fff;
    }
    
    .storeSu>ul>li {
        height: 4.5rem;
        width: 100%;
        border-bottom: 1px solid #f7f7f7;
        display: flex;
        justify-content: space-between;
        line-height: 4.5rem;
    }
    
    .storeSu>ul>li>div {
        color: #6f6f6f;
        font-size: 1.2rem;
    }
    
    .storeSu>ul>li>div:nth-child(1) {
        margin-left: 1.3rem;
    }
    
    .storeSu>ul>li>div:nth-child(2) {
        margin-right: 1rem;
    }
</style>