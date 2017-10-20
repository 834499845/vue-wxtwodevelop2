<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="home">
        <div class="main">
            <div class="htab">
                <div class="htabSeek">
                    <div>
                        <div>
                            <input type="text" @keyup="seekClick" @keyup.delete="delSeekClick" v-model="seekVal" id="seekLabel">
                        </div>
                        <div v-show="!isSeekLabel" @click="searchClick">
                            <img src="/static/img/搜索.png" alt="">
                        </div>
                    </div>
                    <div v-show="isSeekLabel">
                        <div>
                            <label class="isLabelFor" for="seekLabel">
                                <div><img src="/static/img/搜索.png" alt=""> </div>
                                <div><span>输入商家，商品名称</span></div>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="htabDatails">
                    <ul>
                        <li v-for="(tab,index) in tabs" @touchstart="typeTouchstart($event,index)" @touchend="typeTouchend($event,index)">
                            <div>
                                <div><img :src="tab.icon | imgTypeUrlFun" alt=""></div>
                            </div>
                            <div>{{tab.typeName}}</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="hroll" @touchstart="swipeTouchstart($event)" @touchend="swipeTouchend($event)">
                <mt-swipe @change="handleChange" :auto="4000">
                    <mt-swipe-item v-for="scoll in scollImgs" :key="scoll">
                        <img :src="scoll.img | imgUrlFun" alt="">
                    </mt-swipe-item>
                </mt-swipe>
            </div>
            <div class="nearbyShop">
                <div class="nearbyShopUT">
                    <div>热门商家</div>
                    <div>
                        <!--<img src="/static/img/extended.png" alt="">-->
                    </div>
                </div>
                <ul class="nearbyShopU">
                    <li v-cloak v-for="(list,index) in lists" @touchstart="storeListTouchstart($event,index)" @touchend="storeListTouchend($event,index)">
                        <div>
                            <div v-if="list.storeIcon == null" class="headImg">
                                <img src="/static/img/errimg.png" alt="">
                            </div>
                            <div v-else class="headImg">
                                <img :src="list.storeIcon | imgUrlFun" alt="">
                            </div>
                            <div class="nearbyShopDe">
                                <p v-bind:style="{fontSize:list.storeName == null ? fontTwo : list.storeName.length >16 ? fontOne : fontTwo}">{{list.storeName}}</p>
                                <p v-bind:style="{fontSize:list.salesInfo == null ? fontTwo : list.salesInfo.length >16 ? fontOne : fontTwo}">{{list.salesInfo | strFun}}</p>
                                <p v-bind:style="{fontSize:list.storeAddress == null ? fontTwo : list.storeAddress.length >16 ? fontOne : fontTwo}">{{list.storeAddress | strFun}}</p>
                            </div>
                        </div>
                        <div class="nearPay">
                            <!--<span>付款</span>-->
                        </div>
                    </li>
                    <li class="nullLi" v-show="isNullLi">
                        <div>没有搜索到商户！</div>
                    </li>
                </ul>
            </div>
            <div class="strutTab">
            </div>
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
        name: 'home',
        data() {
            return {
                fontOne: '1.2rem',
                fontTwo: '1.2rem',
                isNullLi: false,
                isLoad: false,
                isSeekLabel: true,
                seekVal: '',
                scollImgs: [],
                scollImgStas: [
                    { img: '/static/img/errimg.png' }
                ],
                tabs: [],
                tabCopyaaas: [],
                tabStas: [
                    { icon: '/static/img/全部分类.png', typeName: '全部分类' }
                ],
                isTriangle: 0,
                value: '',
                lists: [],
                listStas: [
                    { storeInfo: '/static/img/errimg.png', storeName: '暂无数据', ctime: '1345648454000', storeAddress: '暂无数据' },
                ],
                startTouchY: '',
                startSwipTouchY: '',
                imgIndex: 0
            }
        },
        computed: mapState(['storeObj', 'typeObj', 'WXuserObj', 'WXUSerId', 'seekObj', 'pathObj', 'codeObj']),
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
            imgTypeUrlFun: function (val) {
                if (val.split('/')[1] == 'static') {
                    return '/static/img/全部分类.png'
                } else {
                    return "http://" + global.logIp + ":" + global.logFileport + "/files" + val
                }
            },
            // 图片过滤
            imgUrlFun: function (val) {
                if (val) {
                    if (val.split('/')[1] == 'static') {
                        return '/static/img/errimg.png'
                    } else {
                        return "http://" + global.logIp + ":" + global.logFileport + "/files" + val
                    }
                } else {
                    return '/static/img/errimg.png'
                }
            },
            // 文字过滤
            strFun: function (val) {
                if (val) {
                    return val
                } else {
                    return '无'
                }
            }
        },
        created: function () {
            var urlStr = location.href
            var self = this
            this.$emit('childsay', 'home%2Fhomepage');
            document.title = '智慧玛特'
            // 发起获取首页信息请求
            self.isLoad = true
            self.getHomeAll({
            }).then((data) => {
                self.isLoad = false
                console.log(data)
                if (data.data.code == "200") {
                    if (data.data.stores.length > 0) {
                        self.lists = data.data.stores
                        self.isNullLi = false
                    } else {
                        self.isNullLi = true
                    }
                    if (data.data.notices.length > 0) {
                        self.scollImgs = data.data.notices
                    } else {
                        self.scollImgs = self.scollImgStas
                    }
                    if (data.data.types.length > 0) {
                        if (data.data.types.length > 9) {
                            self.tabs = data.data.types.splice(0, 9)
                            self.tabs.push({ typeName: '更多', icon: '/static/img/全部分类.png' })
                        } else {
                            self.tabs = data.data.types
                        }
                    } else {
                        self.tabs = self.tabStas
                    }
                }
            }).catch(msg => {
                self.isLoad = false
                self.lists = self.listStas
                self.scollImgs = self.scollImgStas
                self.tabs = self.tabStas
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
        watch: {
            // 监视搜索，发起搜索请求
            seekVal: function (val, oldVal) {
                console.log("新值", val, "旧值", oldVal)
                var self = this
                // if (self.seekVal.length == 0) {
                //     this.$emit('keyBord', 'No')
                // } else {
                //     this.$emit('keyBord', 'Yes')
                // }
            }
        },
        methods: {
            // 搜索操作
            seekClick() {
                this.isSeekLabel = false
            },
            // 隐藏搜索文字
            delSeekClick() {
                if (this.seekVal.length == 0) {
                    this.isSeekLabel = true
                    // this.$emit('keyBord', 'No')
                }
            },
            searchClick() {
                var self = this
                if (!self.seekVal) {
                    self.isLoad = true
                    self.getHomeAll({
                    }).then((data) => {
                        self.isLoad = false
                        if (data.data.code == "200") {
                            if (data.data.stores.length > 0) {
                                self.lists = data.data.stores
                                self.isNullLi = false
                            } else {
                                self.isNullLi = true
                            }
                        }
                    }).catch(msg => {
                        console.log(msg)
                        self.isLoad = false
                        self.lists = self.listStas
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
                    self.seekObj.seekStr = self.seekVal
                    // console.log(self.seekVal)
                    self.$router.push({
                        path: '/seekdateils'
                    })
                }
            },
            // 类别选择 touch处理
            typeTouchstart(event, index) {
                // event.preventDefault()
                this.startTouchY = event.changedTouches[0].clientY
            },
            typeTouchend(event, index) {
                var distance = event.changedTouches[0].clientY - this.startTouchY
                if (15 > distance && distance > -15) {
                    var self = this
                    if (self.tabs.length == 10) {
                        if (index == 9) {
                            self.$router.push({
                                path: '/types'
                            })
                        } else {
                            var listObj = self.tabs[index]
                            var self = this
                            for (var key in listObj) {
                                self.typeObj[key] = listObj[key]
                            }
                            self.$router.push({
                                path: '/typeDateils'
                            })
                        }
                    } else if (self.tabs.length < 10) {
                        var listObj = self.tabs[index]
                        var self = this
                        for (var key in listObj) {
                            self.typeObj[key] = listObj[key]
                        }
                        self.$router.push({
                            path: '/typeDateils'
                        })
                    }
                }
            },
            handleChange(index) {
                this.imgIndex = index
            },
            // 图片touch处理
            swipeTouchstart(event) {
                this.startSwipTouchY = event.changedTouches[0].clientY
                // event.preventDefault()
            },
            swipeTouchend(event) {
                var self = this
                var distance = event.changedTouches[0].clientY - self.startSwipTouchY
                if (15 > distance && distance > -15) {
                    console.log(self.scollImgs[self.imgIndex].url.length)
                    if (self.scollImgs[self.imgIndex].url.length == 0) {
                    } else {
                        if (self.scollImgs[self.imgIndex].url == '/introduce') {
                            self.$router.push({
                                path: self.scollImgs[self.imgIndex].url
                            })
                        } else if (this.scollImgs[this.imgIndex].url.indexOf('https://') == -1) {
                            location.href = 'https://' + this.scollImgs[this.imgIndex].url
                        } else if (this.scollImgs[this.imgIndex].url.indexOf('http://') == -1) {
                            location.href = 'http://' + this.scollImgs[this.imgIndex].url
                        } else {
                            location.href = this.scollImgs[this.imgIndex].url
                        }
                    }
                }
            },
            // 商户详情 touch处理
            storeListTouchstart(event, index) {
                // event.preventDefault()
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
                    this.$router.push({
                        path: '/pay'
                    })
                }
            },
            ...mapActions(['getHomeAll','getHomeSeek','getHomeType','getstoreOne'])
        }
    }

</script>
<style scoped>
    .nearbyShopU .nullLi {
        font-size: 1.6rem;
        color: red;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .toastLoad {
        color: red;
        font-size: 2.2rem;
        font-weight: 700;
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
    
    .htab {
        border-top: 1px solid #f7f7f7;
        min-height: 15.5rem;
        height: 100%;
        background-color: #f5f5f6;
    }
    
    .htabSeek {
        height: 7.0rem;
        position: relative;
    }
    
    .htabSeek>div:nth-child(1) {
        width: 100%;
        height: 7.0rem;
        position: relative;
        overflow: hidden;
    }
    
    .htabSeek>div:nth-child(1)>div:nth-child(1) input {
        border: 1px solid #e7e7e8;
        border-top-left-radius: 2rem;
        border-top-right-radius: 2rem;
        border-bottom-left-radius: 2rem;
        border-bottom-right-radius: 2rem;
        background-color: rgb(255, 255, 255);
        font-size: 1.4rem;
        padding-left: 0.7rem;
        color: #333;
        position: absolute;
        top: 1.7rem;
        left: 5vw;
        width: 90vw;
        height: 3.2rem;
    }
    
    .htabSeek>div:nth-child(1)>div:nth-child(2) {
        position: absolute;
        top: 1.9rem;
        right: 3.5vw;
        width: 3rem;
        height: 3.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
    
    .htabSeek>div:nth-child(2) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 7.0rem;
        font-size: 1.2rem;
        color: #353535;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .htabSeek>div:nth-child(2)>div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .isLabelFor {
        display: inline-block;
        width: 90%;
        height: 3.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .isLabelFor>div:nth-child(2) {
        margin-top: 0.1rem;
        margin-left: 0.3rem;
    }
    
    .htabSeek>div:nth-child(2) img {
        width: 1.4rem;
        height: 1.5rem;
        margin-right: 0.2rem;
        vertical-align: bottom;
    }
    
    .htabDatails {
        min-height: 7rem;
        margin-bottom: 1rem;
    }
    
    .htabDatails>ul {
        display: flex;
        flex-wrap: wrap;
    }
    
    .htabDatails>ul>li {
        width: 19.99999%;
        height: 7rem;
        overflow: hidden;
        text-align: center;
    }
    
    .htabDatails>ul>li>div:nth-child(1) {
        margin-top: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .htabDatails>ul>li>div:nth-child(1)>div {
        width: 4.0rem;
        height: 4.0rem;
        overflow: hidden;
        /*border: 1px solid #dedede;*/
        border-radius: 50%;
    }
    
    .htabDatails>ul>li>div:nth-child(2) {
        margin-top: 0.3rem;
        font-size: 1.2rem;
        color: #393939;
    }
    
    .htabDatails>ul>li>div img {
        width: 4.0rem;
        height: 4.0rem;
    }
    
    .hroll {
        height: 10.0rem;
        width: 100vw;
    }
    
    .hroll img {
        width: 100%;
        height: 100%;
    }
    
    .nearbyShopUT {
        height: 3.5rem;
        line-height: 3.5rem;
        text-align: center;
        font-size: 1.4rem;
        color: #303030;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
    }
    
    .nearbyShopUT img {
        width: 0.5rem;
        height: 1rem;
        margin-left: 0.5rem;
    }
    
    .nearbyShopU li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        height: 8.9rem;
        width: 100vw;
        border-top: 1px solid #f7f7f7;
        overflow: hidden;
    }
    
    .nearbyShopU li>div:nth-child(1) {
        display: flex;
        align-items: center;
        margin-left: 0.8rem;
    }
    
    .nearbyShopDe {
        margin-left: 1.1rem;
        margin-right: 1rem;
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
</style>