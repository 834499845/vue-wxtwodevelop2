<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="details">
        <div class="main">
            <div class="hdels">
                <div>
                    <img :src="userObj.avatar" alt="">
                </div>
                <div>
                    <p>会员昵称：{{userObj.nickName}}</p>
                    <p>积分：{{userObj.scores}}
                    </p>
                </div>
            </div>
            <div class="hdetail">
                <ul>
                    <li @touchstart="detailTouch(0)">
                        <div><img src="/static/img/余额.png" alt=""></div>
                        <div>
                            <span>余额</span>
                            <p>￥{{amount | amountFun}}</p>
                        </div>
                    </li>
                    <li @touchstart="detailTouch(1)">
                        <div><img src="/static/img/充值记录.png" alt=""></div>
                        <div>
                            <span>充值记录</span>
                        </div>
                    </li>
                    <li @touchstart="detailTouch(2)">
                        <div><img src="/static/img/邀请的人.png" alt=""></div>
                        <div>
                            <span>邀请的人</span>
                        </div>
                    </li>
                    <li @touchstart="detailTouch(3)">
                        <!--84 84 -->
                        <div><img src="/static/img/关于我们.png" alt=""></div>
                        <div>
                            <span>关于我们</span>
                        </div>
                    </li>
                </ul>
            </div>
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
        name: 'details',
        data() {
            return {
                delId: '215210',
                integ: '120',
                userObj: {
                    avatar: '',
                    nickName: '',
                    amount: '',
                    ctime: '',
                    mobile: '',
                    openId: '',
                    otherCode: '',
                    pwd: '',
                    scores: '',
                    selfCode: '',
                    id: ''
                },
                isLoad: false,
                amount: '0'
            }
        },
        computed: mapState(['WXuserObj', 'WXUSerId', 'userDetailsObj', 'pathObj']),
        filters: {
            // 余额过滤
            amountFun: function (val) {
                if (val || val == 0) {
                    return val.toFixed(2)
                }
            },
            // 图片过滤
            imgUrlFun: function (val) {
                if (val) {
                    return "http://" + global.logIp + ":" + global.logFileport + "/files" + val
                } else {
                    return '/static/img/errimg.png'
                }
            },
            // 文字过滤
            amountFun: function (val) {
                return val.toFixed(2);
            }
        },
        created: function () {
            var urlStr = location.href
            this.$emit('childsay', 'home%2Fdetails');
            document.title = '智慧玛特'
            var self = this
            self.isLoad = true
            var issWxuserId = localStorage.getItem('WxuserId')
            if (self.WXUSerId.id) {
                self.getUserAll({
                    id: self.WXUSerId.id
                }).then((data) => {
                    self.isLoad = false
                    if (data.data.code == 200) {
                        self.userObj = data.data.data
                        var listObj = data.data.data
                        for (var key in listObj) {
                            self.userDetailsObj[key] = listObj[key]
                        }
                        self.amount = data.data.data.amount
                        localStorage.removeItem('WxuserId')
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
            } else if (issWxuserId) {
                self.WXUSerId.id = issWxuserId
                if (issWxuserId) {
                    self.getUserAll({
                        id: issWxuserId
                    }).then((data) => {
                        self.isLoad = false
                        if (data.data.code == 200) {
                            self.userObj = data.data.data
                            var listObj = data.data.data
                            for (var key in listObj) {
                                self.userDetailsObj[key] = listObj[key]
                            }
                            self.amount = data.data.data.amount
                            self.isLoad = false
                            localStorage.removeItem('WxuserId')
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
                }
            } else {
                self.isLoad = false
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=home%2Fdetails#wechat_redirect'
            }
        },
        methods: {
            isContains(str, substr) {
                return str.indexOf(substr) >= 0;
            },
            isUrls(str, substr) {
                return str.indexOf(substr) >= 0;
            },
            // 跳转
            detailTouch: function (index) {
                var self = this
                switch (index) {
                    case 0:
                        break;
                    case 1:
                        self.$router.push({
                            path: '/indent'
                        })
                        break;
                    case 2:
                        self.$router.push({
                            path: '/contacts'
                        })
                        break;
                    case 3:
                        localStorage.setItem('WxuserId', this.WXUSerId.id)
                        localStorage.setItem('homePage', 'home')
                        self.getUserUrl({
                        }).then((data) => {
                            if (data.data.code == 200 && data.data.data.length > 0) {
                                var isUrlHttp = self.isUrls(data.data.data, 'http://')
                                var isUrlHttps = self.isUrls(data.data.data, 'http://')
                                if (isUrlHttp) {
                                    location.href = data.data.data
                                } else {
                                    location.href = 'http://' + data.data.data
                                }
                                if (isUrlHttps) {
                                    location.href = data.data.data
                                } else {
                                    location.href = 'https://' + data.data.data
                                }
                            } else {
                                alert('暂时没有主页')
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

                        break;
                    default:
                        break;
                }
            },
            ...mapActions(['getUserAll','getUserUrl','getWXToken','getWXUser'])
        }
    }

</script>
<style scoped>
    .strutTab {
        height: 4.5rem;
    }
    
    .main {
        background-color: #f5f5f6;
    }
    
    .hdels {
        display: flex;
        height: 9rem;
        background-color: #fff;
        border-bottom: 1px solid #efefef;
        align-items: center;
    }
    
    .hdels>div:nth-child(1) {
        margin-left: 2.0rem;
        border-radius: 5px;
        overflow: hidden;
        width: 5.3rem;
        height: 5.3rem;
        /*border: 1px solid #dbdbdb;*/
    }
    
    .hdels>div:nth-child(1) img {
        width: 100%;
        height: 100%;
    }
    
    .hdels>div:nth-child(2) {
        margin-left: 1.3rem;
        width: 50%;
    }
    
    .hdels>div:nth-child(2) p:nth-child(1) {
        color: #5a5a5a;
        font-size: 1.2rem;
    }
    
    .hdels>div:nth-child(2) p:nth-child(2) {
        margin-top: 1rem;
        color: #dbdbdb;
        font-size: 1.2rem;
    }
    
    .hdetail {
        margin-top: 1.7rem;
        border-top: 1px solid #f7f7f7;
        background-color: white;
        overflow: hidden;
    }
    
    .hdetail ul {
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
    }
    
    .hdetail li {
        width: 49.5%;
        height: 7.5rem;
        border-bottom: 1px solid #f7f7f7;
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        color: #353535;
        overflow: hidden;
    }
    
    .hdetail li div:nth-child(1) {
        margin-left: 2.6rem;
        /*84 42 21 */
        width: 2.1rem;
        height: 2.1rem;
    }
    
    .hdetail li div:nth-child(1) img {
        width: 100%;
        height: 100%;
    }
    
    .hdetail li div:nth-child(2) {
        margin-left: 1rem;
        width: 7rem;
    }
    
    .hdetail li:nth-child(1) {
        border-right: 1px solid #f7f7f7;
    }
    
    .hdetail li:nth-child(1)>div>span {
        width: 100%;
        display: inline-block;
        overflow: hidden;
    }
    
    .hdetail li:nth-child(1)>div>p {
        width: 100%;
        display: inline-block;
        overflow: hidden;
    }
    
    .hdetail li:nth-child(1) span {
        height: 1.5rem;
        line-height: 1.8rem;
    }
    
    .hdetail li:nth-child(1) p {
        margin-top: 0.5rem;
        color: #ff6879;
        font-size: 1.2rem;
    }
    
    .hdetail li:nth-child(3) {
        border-right: 1px solid #f7f7f7;
    }
    
    .hdetail li:nth-child(5) {
        border-right: 1px solid #f7f7f7;
        border-bottom: 1px solid #f7f7f7;
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
</style>