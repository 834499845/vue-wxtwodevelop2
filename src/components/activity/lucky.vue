<template>
    <transition name="bounce">
        <div id="app" class="home">
            <!--introduce-->
            <div class="nav">
                <div @touchend="goDetailsTouchend($event)">活动详情</div>
                <div>一起玩赛龙舟</div>
                <div @touchend="goIntrTouchend($event)">获取粽子</div>
            </div>
            <div class="drawLot">
                <canvas id="canvas" width="200" height="200" class="LotPlate" v-bind:style="{'transform': lotAng}">
                </canvas>
                <!--<div class="LotPlate" v-bind:style="{'transform': lotAng}">
                    <img src="/static/img/转盘.png" alt="">
                </div>-->
                <div class="LotNeet" @touchstart="LotNeetTouchstart($event)">
                </div>
            </div>
            <div class="drawAward">
                <div class="awardTitle">
                    奖品设置
                </div>
                <div class="awardCont">
                    <ul>
                        <li v-for="(award,index) in awards">
                            <div>
                                {{award.name}}：
                            </div>
                            <div>
                                {{award.cont}}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="drawRandking">
                <div class="randTitle">
                    排行榜
                </div>
                <div class="randCont">
                    <ul>
                        <li v-for="rand in rands">
                            <div class="randContHead">
                                <div>
                                    <img :src="rand.headImg" alt="">
                                </div>
                                <div>
                                    {{rand.nickName}}
                                </div>
                            </div>
                            <div class="randContM">
                                {{rand.totalSteps}} m
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
            </div>

        </div>
    </transition>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    import { Toast } from 'mint-ui';
    export default {
        name: 'home',
        data() {
            return {
                orderLi: true,
                lotAng: 'rotate(0deg)',
                angle: 0,
                LotCTrue: true,
                quan: 0,
                odeg: 0,
                oldan: 0,
                awards: [
                    { name: '第一名', cont: '现金30000元，“安康网络龙舟竞技王”勋章一枚' },
                    { name: '2-10名', cont: '现金2000元，“安康网络龙舟竞技勇士”勋章一枚' },
                    { name: '前100名', cont: '第十七届安康龙舟文化形象特使特权证书（享安康市所有景区全年免费游）' },
                    { name: '前1000名', cont: '安康市A级景区门票1张。' },
                    { name: '前2000名', cont: '龙舟节看台票1张' },
                    { name: '前5000名', cont: '特别参与奖小礼品及赠品1份' }
                ],
                rands: [
                ],
                lotTimes: '',
                meterNum: 0
            }
        },
        computed: mapState(['WXUSerId', 'userActObj']),
        created: function () {
            var self = this
            document.title = '智慧玛特'
            this.$emit('appchildsay', "lucky");
            // oXFH71Vz_f5SCJ12m9BAKqaMfdRw f4be34ca5b8f4e09015bb22520cd009c
            // 获取用户米数列表
            self.getActUserMeterList({
            }).then((data) => {
                console.log('米数列表', data)
                // alert(JSON.stringify(data))
                // totalSteps 米数 totalChance 抽奖几次  totalTickets 粽子数
                if (data.data.code == 200) {
                    if (data.data.data.length > 0) {
                        self.rands = data.data.data
                        self.orderLi = false
                    } else {
                        self.orderLi = true
                    }
                } else if (data.data.code == 404) {
                    self.orderLi = true
                }
            }).catch(msg => {
                console.log(msg)
                alert(JSON.stringify(msg))
            })
        },
        mounted() {
            var canvas = document.getElementById("canvas"),
                cxt = canvas.getContext('2d'),
                img = new Image();
            img.src = "/static/img/转盘.png";
            var getPixelRatio = function (context) {
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;

                return (window.devicePixelRatio || 1) / backingStore;
            }
            var ratio = getPixelRatio(cxt);
            canvas.width = 200 * ratio
            canvas.height = 200 * ratio
            img.onload = function () {
                cxt.drawImage(img, -1, 0, 200 * ratio, 200 * ratio);
            }
        },
        methods: {
            // 转盘
            LotNeetTouchstart() {
                var self = this
                var olAng = self.oldan
                if (self.LotCTrue == true) {
                    self.LotCTrue = false
                    self.quan = Math.ceil(Math.random() * 10)
                    self.odeg = Math.ceil(Math.random() * 360)
                    self.oldan = self.quan * 360 + self.odeg
                    var anNum = self.oldan + olAng
                    if (self.angle - anNum <= 1000 && self.angle - anNum >= -1000) {
                        self.angle = anNum + 1000
                    } else {
                        self.angle = anNum
                    }
                    self.lotAng = 'rotate(' + self.angle + 'deg)'
                    setTimeout(function () {
                        self.LotCTrue = true
                        var qx = self.angle / 360
                        var yd = '0.' + qx.toString().split('.')[1]
                        var tnum = yd * 360
                        // console.log(qx, tnum)
                        if (tnum > 330 || tnum <= 30) {
                            console.log(50)
                            self.meterNum = 50
                        } else if (tnum > 30 && tnum <= 90) {
                            console.log(300)
                            self.meterNum = 300
                        } else if (tnum > 90 && tnum <= 150) {
                            console.log(800)
                            self.meterNum = 800
                        } else if (tnum > 150 && tnum <= 210) {
                            console.log(500)
                            self.meterNum = 500
                        } else if (tnum > 210 && tnum <= 270) {
                            console.log(200)
                            self.meterNum = 200
                        } else if (tnum > 270 && tnum <= 330) {
                            console.log(100)
                            self.meterNum = 100
                        }
                        // oXFH71Vz_f5SCJ12m9BAKqaMfdRw f4be34ca5b8f4e09015bb22520cd009c
                        // 抽奖
                        if (self.WXUSerId.openid.length > 0) {
                            if (self.meterNum != 0 && self.userActObj.totalTickets >= 5) {
                                Toast('恭喜你前进了' + self.meterNum + '米');
                                self.getActUserMeter({
                                    openid: self.WXUSerId.openid,
                                    meter: self.meterNum
                                }).then((data) => {
                                    console.log('米数', data)
                                    self.userActObj.totalTickets -= 5
                                    if (data.data.code == 200) {
                                        self.getActUserMeterList({
                                        }).then((data) => {
                                            console.log('米数列表', data)
                                            // alert(JSON.stringify(data))
                                            // totalSteps 米数 totalChance 抽奖几次  totalTickets 粽子数
                                            if (data.data.code == 200) {
                                                if (data.data.data.length > 0) {
                                                    self.rands = data.data.data
                                                    self.orderLi = false
                                                } else {
                                                    self.orderLi = true
                                                }
                                            } else if (data.data.code == 404) {
                                                self.orderLi = true
                                            }
                                        }).catch(msg => {
                                            console.log(msg)
                                            alert(JSON.stringify(msg))
                                        })
                                    } else if (data.data.message == "no more tickets") {
                                        Toast('你没有粽子了');
                                    } else if (data.data.code == 500) {
                                        Toast('请先登录');
                                    }
                                }).catch(msg => {
                                    console.log(msg)
                                })
                            } else {
                                if (self.meterNum == 0) {
                                    Toast('你原地踏步走了');
                                } else if (self.userActObj.totalTickets < 5) {
                                    Toast('你没有粽子了，快点击右上角获取粽子！！');
                                }
                            }
                        } else {
                            location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=lucky#wechat_redirect'
                        }

                        // 5-> 330-30
                        // 200-> 30-90
                        // 10-> 90-150
                        // 500-> 150-210
                        // 20-> 210-270
                        // 100-> 270-330
                    }, 6000);
                }
            },
            // 转盘计算
            show1() {
                var self = this
                self.angle += self.cc
                if (self.angle > 1500) {
                    console.log(11231)
                    clearInterval(self.lotTimes)
                    self.LotCTrue = true
                } else {
                    if (self.angle % 360 == 0) {
                        self.xq += 1
                        if (self.xq == self.quan - 1) {
                            self.cc = 1
                        }
                        self.lotAng = 'rotate(' + self.angle + 'deg)'
                    } else {
                        self.lotAng = 'rotate(' + self.angle + 'deg)'
                    }
                }
            },
            goIntrTouchend() {
                this.$router.push({
                    path: '/introduce'
                })
            },
            goDetailsTouchend() {
                location.href = 'http://mp.weixin.qq.com/s/uuujcBDbJ7FH7yl5sTXbWA'
            },
            ...mapActions(['getActUserMeter','getActUserMeterList'])
        }
    }

</script>
<style scoped>
    #canvas {
        width: 200px;
        height: 200px;
        /*border: 1px solid red;*/
    }
    
    #orderLi {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 16rem;
        border: 0;
        display: flex;
        /*flex-wrap: wrap;*/
        background-color: rgba(222, 235, 228, 0.1);
        flex-direction: column;
        overflow: hidden;
    }
    
    #orderLiImg {
        height: 11rem;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    #orderLiImg img {
        width: 11rem;
        height: 11rem;
    }
    
    #orderLiNull {
        width: 100%;
        height: 4rem;
        text-align: center;
        font-size: 3rem;
        color: #bababa;
    }
    
    #app {
        width: 100vw;
        height: 100vh;
        overflow-x: hidden;
        background: url('/static/img/timg.png') no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-wrap: wrap;
    }
    
    .nav {
        height: 5rem;
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
    }
    
    .nav>div {
        height: 5rem;
        line-height: 5rem;
        font-size: 1.2rem;
        min-width: 5rem;
    }
    
    .nav>div:nth-child(1) {
        margin-left: 1rem;
    }
    
    .nav>div:nth-child(2) {
        font-size: 1.6rem;
    }
    
    .nav>div:nth-child(3) {
        margin-right: 1rem;
    }
    
    .drawLot {
        width: 100%;
        height: 41vh;
        background-color: rgba(204, 230, 231, 0.1);
        position: relative;
        overflow: hidden;
    }
    
    .LotPlate {
        /*border: 1px solid red;*/
        position: absolute;
        top: 50%;
        left: 50%;
        /*width: 20rem;
        height: 20rem;*/
        margin-left: -100px;
        margin-top: -100px;
        transition: transform 6s;
        border-radius: 50%;
        overflow: hidden;
        /*padding-bottom: 0.3rem;*/
    }
    
    .LotPlate img {
        /*width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border-radius: 50%;
        overflow: hidden;
        z-index: 10000000000000000000;*/
    }
    
    .LotNeet {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -25px;
        margin-top: -31px;
        width: 50px;
        height: 62px;
        background: url('/static/img/指针2.png') no-repeat;
        background-size: 100% 100%;
    }
    
    .drawAward {
        width: 100%;
        min-height: 12rem;
        border-bottom: 1px solid #cad5c8;
        background-color: rgba(222, 235, 228, 0.1);
    }
    
    .awardTitle {
        height: 4.4rem;
        text-align: center;
        font-size: 1.8rem;
        line-height: 4.4rem;
        color: #667851;
        margin: 0;
        padding: 0;
    }
    
    .awardCont>ul {
        margin: 0;
        padding: 0;
    }
    
    .awardCont>ul>li {
        margin: 0;
        padding: 0;
        display: flex;
        min-height: 2.4rem;
        /*line-height: 2.4rem;*/
        font-size: 1.1rem;
        color: #667851;
        width: 100%;
        margin-top: 0.3rem;
    }
    
    .awardCont>ul>li:last-of-type {
        margin-bottom: 1rem;
    }
    
    .awardCont>ul>li>div:nth-child(1) {
        margin-left: 2rem;
        /*border: 1px solid red;*/
        width: 20%;
        text-align: right;
    }
    
    .awardCont>ul>li>div:nth-child(2) {
        /*margin-left: 1rem;*/
        /*border: 1px solid red;*/
        width: 75%;
        /*overflow: hidden;*/
        padding-right: 0.3rem;
        word-break: break-all;
    }
    
    .drawRandking {
        background-color: rgba(222, 235, 228, 0.1);
        width: 100%;
        min-height: calc(59vh - 36rem);
        overflow: hidden;
    }
    
    .randTitle {
        height: 4.6rem;
        line-height: 4.6rem;
        text-align: center;
        font-size: 1.8rem;
        color: #46534c;
    }
    
    .randCont>ul>li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        height: 4.5rem;
        line-height: 4.5rem;
        color: #333;
        font-size: 1.5rem;
        margin-top: 0.5rem;
    }
    
    .randCont>ul>li:last-of-type {
        margin-bottom: 1rem;
    }
    
    .randContHead {
        display: flex;
        margin-left: 3rem;
        align-items: center;
    }
    
    .randContHead>div:nth-child(1) {
        width: 3.5rem;
        height: 3.5rem;
        overflow: hidden;
        border-radius: 0.3rem;
    }
    
    .randContHead>div:nth-child(2) {
        margin-left: 1.5rem;
        width: 14rem;
        height: 3.5rem;
        line-height: 3.5rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    
    .randContHead>div:nth-child(1) img {
        width: 100%;
        height: 100%;
    }
    
    .randContM {
        margin-right: 2.5rem;
        min-width: 5rem;
        text-align: right;
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