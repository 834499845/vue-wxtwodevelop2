<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <transition name="bounce">
        <div id="app" class="typeDateils">
            <div class="nearbyShop">
                <div class="nearbyShopUT">
                    <div><img :src="typeCopyObj.icon | imgUrlFun" alt=""></div>
                    <div>{{typeCopyObj.typeName}}</div>
                </div>
                <ul class="nearbyShopU">
                    <li v-cloak v-for="(list,index) in lists" @touchstart="storeListTouchstart($event,index)" @touchend="storeListTouchend($event,index)">
                        <div>
                            <div v-if="list.storeInfo == null" class="headImg">
                                <img src="/static/img/errimg.png" alt="">
                            </div>
                            <div v-else class="headImg">
                                <img :src="list.storeIcon | imgUrlFun" alt="">
                            </div>
                            <div class="nearbyShopDe">
                                <p v-bind:style="{fontSize:list.storeName == null ? fontTwo : list.storeName.length >25 ? fontOne : fontTwo}">{{list.storeName}}</p>
                                <p v-bind:style="{fontSize:list.salesInfo == null ? fontTwo : list.salesInfo.length >25 ? fontOne : fontTwo}">{{list.salesInfo | strPayFun}}</p>
                                <p v-bind:style="{fontSize:list.storeAddress == null ? fontTwo : list.storeAddress.length >25 ? fontOne : fontTwo}">{{list.storeAddress | strPayFun}}</p>
                            </div>
                        </div>
                        <div class="nearPay">
                            <!--<span>付款</span>-->
                        </div>
                    </li>
                    <li id="orderLi" v-show="isNullLi">
                        <div id="orderLiImg">
                            <img src="/static/img/暂无数据.png" alt="">
                        </div>
                        <div id="orderLiNull">
                            暂无记录
                        </div>
                    </li>
                </ul>
            </div>
            <div v-show="isLoad" class="loadIng">
                <mt-spinner type="fading-circle" color="rgb(42, 83, 205)"></mt-spinner>
            </div>
        </div>
    </transition>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    import { Toast } from 'mint-ui';
    require("../../API/config.js");
    export default {
        name: 'typeDateils',
        data() {
            return {
                fontOne: '1.2rem',
                fontTwo: '1.2rem',
                isNullLi: false,
                isLoad: true,
                lists: [],
                typeCopyObj: {
                    ctime: '',
                    icon: '',
                    position: '',
                    id: '',
                    typeName: ''
                },
                startTouchY: ''
            }
        },
        computed: mapState(['storeObj', 'typeObj', 'WXUSerId']),
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
            imgUrlFun: function (val) {
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
            strPayFun: function (val) {
                if (val) {
                    return val
                } else {
                    return '无'
                }
            }
        },
        created: function () {
            this.$emit('appchildsay', "typeDateils");
            var self = this
            document.title = '智慧玛特'
            self.typeCopyObj.typeName = self.typeObj.typeName
            self.typeCopyObj.ctime = self.typeObj.ctime
            self.typeCopyObj.position = self.typeObj.position
            self.typeCopyObj.id = self.typeObj.id
            self.typeCopyObj.icon = self.typeObj.icon
            self.isLoad = true
            localStorage.setItem('typeNamestr', self.typeCopyObj.typeName)
            localStorage.setItem('icon', self.typeCopyObj.icon)
            var typeLoName = localStorage.getItem('typeNamestr')
            var typeLoicon = localStorage.getItem('icon')
            // alert(typeLoName.length)
            var yxUserId = self.WXUSerId.id
            if (yxUserId.length > 0) {
                if (self.typeCopyObj.typeName.length > 0) {
                    self.getHomeType({
                        typeId: self.typeCopyObj.typeName
                    }).then((data) => {
                        self.isLoad = false
                        if (data.data.code == "200") {
                            if (data.data.data.content.length > 0) {
                                self.lists = data.data.data.content
                                self.isNullLi = false
                            } else {
                                self.isNullLi = true
                            }
                        } else if (data.data.code === 404) {
                            self.lists = []
                            self.isNullLi = true
                        }
                    }).catch(msg => {
                        self.isLoad = false
                        Toast({
                            message: '服务器错误',
                            className: 'toastLoad'
                        });

                    })
                } else if (typeLoName.length > 0 && typeLoicon.length > 0) {
                    self.typeCopyObj.typeName = typeLoName
                    self.typeCopyObj.icon = typeLoicon
                    self.getHomeType({
                        typeId: typeLoName
                    }).then((data) => {
                        self.isLoad = false
                        if (data.data.code == "200") {
                            if (data.data.data.content.length > 0) {
                                self.lists = data.data.data.content
                                self.isNullLi = false
                            } else {
                                self.isNullLi = true
                            }
                        } else if (data.data.code === 404) {
                            self.lists = []
                            self.isNullLi = true
                        }
                    }).catch(msg => {
                        self.isLoad = false
                        Toast({
                            message: '服务器错误',
                            className: 'toastLoad'
                        });
                    })
                } else if (typeLoName.length == 0 && typeLoicon.length == 0) {
                    self.isLoad = false
                    self.isNullLi = true
                }
            } else {
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=typeDateils#wechat_redirect'
            }
        },
        methods: {
            // 商户详情
            storeListTouchstart(event, index) {
                this.startTouchY = event.changedTouches[0].clientY
            },
            storeListTouchend(event, index) {
                var distance = event.changedTouches[0].clientY - this.startTouchY
                if (15 > distance && distance > -15) {
                    localStorage.removeItem('payIdStr')
                    localStorage.removeItem('payTwoIdStr')
                    var listObj = this.lists[index]
                    var self = this
                    for (var key in listObj) {
                        self.storeObj[key] = listObj[key]
                    }
                    self.storeObj.pay = 'home'
                    self.$router.push({
                        path: '/pay'
                    })
                }
            },
             ...mapActions(['getHomeType'])
        },
        beforeDestroy: function () {
            localStorage.removeItem('typeNamestr')
            localStorage.removeItem('icon')
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
        background-color: rgba(0, 0, 0, 0);
        display: flex;
        align-items: center;
        z-index: 1000000000;
        justify-content: center;
    }
    
    #app {
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #f5f5f6;
    }
    
    .nearbyShopU .nullLi {
        font-size: 1.6rem;
        color: red;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .nearbyShopUT {
        height: 5.0rem;
        line-height: 5.0rem;
        font-size: 1.7rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #303030;
        background-color: #fff;
        border-bottom: 1px solid #f7f7f7;
        overflow: hidden;
    }
    
    .nearbyShopUT>div {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 0.3rem;
        margin-left: 0.3rem;
    }
    
    .nearbyShopUT>div:nth-child(1) {
        width: 3.5rem;
        height: 3.5rem;
        margin-left: 0.5rem;
        border-radius: 50%;
        overflow: hidden;
        /*border: 1px solid #f7f7f7;*/
    }
    
    .nearbyShopUT img {
        width: 100%;
        height: 100%;
    }
    
    .nearbyShopU li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        height: 8.9rem;
        width: 100vw;
        border-bottom: 1px solid #eeeeee;
        overflow: hidden;
    }
    
    .nearbyShopU li div:nth-child(2) {
        margin-right: 1rem;
    }
    
    .nearbyShopU li>div:nth-child(1) {
        display: flex;
        align-items: center;
        margin-left: 0.8rem;
    }
    
    .nearbyShopDe {
        margin-left: 1.1rem;
    }
    
    .nearbyShopDe p:nth-child(1) {
        font-size: 1.2rem;
        color: #303030;
        width: calc(100vw - 10rem);
        height: 1.7rem;
        line-height: 1.7rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    
    .nearbyShopDe p:nth-child(2) {
        font-size: 1.2rem;
        margin-top: 0.3rem;
        color: #abaaaa;
        width: calc(100vw - 10rem);
        height: 1.5rem;
        line-height: 1.5rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    
    .nearbyShopDe p:nth-child(3) {
        font-size: 1.2rem;
        margin-top: 0.7rem;
        color: #6e6e6e;
        width: calc(100vw - 10rem);
        height: 1.7rem;
        line-height: 1.7rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    
    .headImg {
        /*border: 1px solid #eee;*/
        width: 6rem;
        height: 6rem;
        min-width: 6rem;
        min-height: 6rem;
        border-radius: 0.3rem;
        overflow: hidden;
    }
    
    .headImg img {
        width: 100%;
        height: 100%;
    }
    
    .nearPay {
        font-size: 1.2rem;
        color: #6e6e6e;
        height: 100%;
        display: flex;
        align-items: flex-end;
    }
    
    .nearPay span {
        margin-bottom: 1rem;
        background-color: rgb(26, 172, 25);
        border-radius: 0.2rem;
        color: #fff;
        height: 2rem;
        width: 3.4rem;
        font-size: 1.2rem;
        text-align: center;
        line-height: 2rem;
    }
    
    .bounce-enter-active {
        transition: all 0.7s ease;
    }
    
    .bounce-enter,
    .bounce-leave-active {
        transform: translateY(30px);
        opacity: 0;
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
</style>