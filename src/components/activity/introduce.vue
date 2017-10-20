<template>
    <transition name="bounce">
        <div id="app" class="introduce">
            <div class="nav">
                <div @touchend="shareTouchend($event)">分享得粽子</div>
                <div>粽子*{{zongziNum}}</div>
                <div @touchend="goHomeTouchend($event)">参加游戏</div>
            </div>
            <ul>
                <li v-for="(item,ind) in dats" class="intOne">
                    <div v-for="(n,index) in item.n" @touchstart="hotTouchstart($event,ind,index)" @touchend="hotTouchend($event,ind,index)">
                        <div v-show="n.spotStatus == 0">
                            <img src="/static/img/定位灰色.png" alt="">
                        </div>
                        <div v-show="n.spotStatus != 0">
                            <img src="/static/img/定位红色.png" alt="">
                        </div>
                        <div>{{n.spotName}}</div>
                    </div>
                </li>
            </ul>
            <!--热点弹出框-->
            <div v-show="popupShow" class="popupCont">
                <div>
                    <div class="cloneCl" @touchend="closeTouchend($event)">

                    </div>
                    <div class="textCont">
                        <div>
                            {{text.name}}
                        </div>
                        <div>
                            {{text.cont}}
                        </div>
                    </div>
                </div>
            </div>
            <!--分享弹出框-->
            <div class="tostPopup" v-show="tostShow">
                <div>
                    <div>请进入右上角功能按钮，选择分享。</div>
                    <div><img src="/static/img/jiantou.png" alt=""></div>
                    <div @touchend="closeTouchend($event)">

                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    export default {
        name: 'introduce',
        data() {
            return {
                dats: [
                ],
                oldA: 0,
                oldB: 0,
                text: {
                    name: '暂无名称',
                    cont: "暂无信息"
                },
                popupShow: false,
                tostShow: false,
                startSwipTouchY: 0,
                zongziNum: 0,
                dcode: false
            }
        },
        computed: mapState(['WXUSerId', 'userActObj']),
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
            }
        },
        created: function () {
            // this.randomReDian()
            var self = this
            // alert(self.WXUSerId.openid)
            self.$emit('appchildsay', "introduce");
            document.title = '智慧玛特'
            // oXFH71Vz_f5SCJ12m9BAKqaMfdRw f4be34ca5b8f4e09015bb22520cd009c

            // self.getActHotAll({
            //     openid: "oXFH71Vz_f5SCJ12m9BAKqaMfdRw"
            // }).then((data) => {
            //     console.log('热点', data)
            //     if (data.data.code == 200) {
            //         if (data.data.data.length > 0) {
            //             var dataArr = data.data.data
            //             var dataNum = Math.ceil(dataArr.length / 8)
            //             let nArr = []
            //             for (let i = 0; i < dataNum; i++) {
            //                 nArr = dataArr.slice(i * 8, (i + 1) * 8)
            //                 self.dats.push({
            //                     name: i, n: nArr
            //                 })
            //             }
            //         } else {
            //             var dataArrs = [{
            //                 name: '', n: [
            //                     { spotName: '暂无热点' }
            //                 ]
            //             }]
            //             self.dats = dataArrs
            //         }
            //     }
            // }).catch(msg => {
            //     console.log(msg)
            //     alert(JSON.stringify(msg))
            // })

            if (self.WXUSerId.openid.length > 0) {
                // 获取热点列表
                self.getActHotAll({
                    openid: self.WXUSerId.openid
                }).then((data) => {
                    console.log('热点', data)
                    if (data.data.code == 200) {
                        if (data.data.data.length > 0) {
                            var dataArr = data.data.data
                            var dataNum = Math.ceil(dataArr.length / 8)
                            let nArr = []
                            for (let i = 0; i < dataNum; i++) {
                                nArr = dataArr.slice(i * 8, (i + 1) * 8)
                                self.dats.push({
                                    name: i, n: nArr
                                })
                            }
                        } else {
                            var dataArrs = [{
                                name: '', n: [
                                    { spotName: '暂无热点' }
                                ]
                            }]
                            self.dats = dataArrs
                        }
                    }
                }).catch(msg => {
                    console.log(msg)
                    alert(JSON.stringify(msg))
                })
                // 获取用户粽子
                self.getActUserAll({
                    openid: self.WXUSerId.openid
                }).then((data) => {
                    console.log('粽子', data)
                    // alert(JSON.stringify(data))
                    if (data.data.code == 200) {
                        if (data.data.data == null) {
                            self.zongziNum = 0
                        } else {
                            self.zongziNum = data.data.data.totalTickets
                            self.userActObj.totalTickets = data.data.data.totalTickets
                        }
                    }
                }).catch(msg => {
                    console.log(msg)
                    alert(JSON.stringify(msg))
                })
            } else {
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbb3826cc54cad66&redirect_uri=http%3a%2f%2fpayment-api.juxiyo.com%2f&response_type=code&scope=snsapi_userinfo&state=lucky#wechat_redirect'
            }
        },
        mounted() {
        },
        methods: {
            // 生成随机坐标
            randomReDian() {
                var self = this
                var arrs = this.datas
                arrs.forEach(function (ele, ind) {
                    var ss = ele.n
                    ss.forEach(function (eld, index) {
                        if (index == 0) {
                            self.datas[ind].n[index].t = 1 + Math.ceil(Math.random() * 15) + 'vh'
                            self.datas[ind].n[index].l = 4 + Math.ceil(Math.random() * 5) + 'rem'
                        }
                        if (index == 1) {
                            self.datas[ind].n[index].t = 1 + Math.ceil(Math.random() * 5) + 'vh'
                            self.datas[ind].n[index].l = 14 + Math.ceil(Math.random() * 5) + 'rem'
                        }
                        if (index == 2) {
                            self.datas[ind].n[index].t = 32 + Math.ceil(Math.random() * 5) + 'vh'
                            self.datas[ind].n[index].l = 5 + Math.ceil(Math.random() * 5) + 'rem'
                        }
                        if (index == 3) {
                            self.datas[ind].n[index].t = 28 + Math.ceil(Math.random() * 5) + 'vh'
                            self.datas[ind].n[index].l = 20 + Math.ceil(Math.random() * 5) + 'rem'
                        }
                        if (index == 4) {
                            self.datas[ind].n[index].t = 49 + Math.ceil(Math.random() * 5) + 'vh'
                            self.datas[ind].n[index].l = 13 + Math.ceil(Math.random() * 5) + 'rem'
                        }
                        if (index == 5) {
                            self.datas[ind].n[index].t = 52 + Math.ceil(Math.random() * 5) + 'vh'
                            self.datas[ind].n[index].l = 22 + Math.ceil(Math.random() * 5) + 'rem'
                        }
                        if (index == 6) {
                            self.datas[ind].n[index].t = 72 + Math.ceil(Math.random() * 25) + 'vh'
                            self.datas[ind].n[index].l = 4 + Math.ceil(Math.random() * 5) + 'rem'
                        }
                        if (index == 7) {
                            self.datas[ind].n[index].t = 77 + Math.ceil(Math.random() * 15) + 'vh'
                            self.datas[ind].n[index].l = 13 + Math.ceil(Math.random() * 5) + 'rem'
                        }
                    })
                })
            },
            // 地址触发
            hotTouchstart(event) {
                this.startSwipTouchY = event.changedTouches[0].clientY
            },
            hotTouchend(event, a, b) {
                var distance = event.changedTouches[0].clientY - this.startSwipTouchY
                if (15 > distance && distance > -15) {
                    var self = this
                    self.oldA = a
                    self.oldB = a
                    self.popupShow = true
                    self.text.name = self.dats[a].n[b].spotName
                    self.text.cont = self.dats[a].n[b].spotDesc
                    console.log(self.dats[a].n[b].spotStatus, self.dats[a].n[b].id)
                    if (self.dats[a].n[b].spotStatus == 0) {
                        // oXFH71Vz_f5SCJ12m9BAKqaMfdRw self.WXUSerId.openid
                        self.getActAddHot({
                            openid: self.WXUSerId.openid,
                            spotid: self.dats[a].n[b].id
                        }).then((data) => {
                            // console.log('添加热点', data)
                            if (data.data.code == 200) {
                                self.dats[a].n[b].spotStatus = 1
                                self.getActUserAll({
                                    openid: self.WXUSerId.openid
                                }).then((data) => {
                                    // console.log('粽子', data)
                                    // alert(JSON.stringify(data))
                                    if (data.data.code == 200) {
                                        if (data.data.data == null) {
                                            self.zongziNum = 0
                                        } else {
                                            self.zongziNum = data.data.data.totalTickets
                                            self.userActObj.totalTickets = data.data.data.totalTickets
                                        }
                                    }
                                }).catch(msg => {
                                    console.log(msg)
                                    alert(JSON.stringify(msg))
                                })
                            } else {
                                if (self.dcode == false) {
                                    Toast('你今天的点亮次数已经用完');
                                    self.dcode = true
                                } else {

                                }
                            }
                        }).catch(msg => {
                            console.log(msg)
                            self.dats[a].n[b].spotStatus = 0
                        })
                    } else {

                    }
                }
            },
            // 关闭弹出框
            closeTouchend() {
                this.popupShow = false
                this.tostShow = false
            },
            // 去转盘页面
            goHomeTouchend() {
                this.$router.push({
                    path: '/lucky'
                })
            },
            // 分享粽子
            shareTouchend() {
                this.tostShow = true
            },
            ...mapActions(['getActHotAll', 'getActUserAll', 'getActAddHot'])
        }
    }

</script>
<style scoped>
    .toastLoad {
        z-index: 10000000000;
    }
    
    #app {
        width: 100vw;
        height: 100vh;
        overflow-x: hidden;
        position: relative;
        background: url('/static/img/introduce.png') no-repeat;
        background-size: 100% 100%;
        background-position: 0px 5rem;
    }
    
    .nav {
        position: absolute;
        top: 0;
        left: 0;
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
    
    .introduce>ul {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        margin-top: 50px;
    }
    
    .intOne {
        background: url('/static/img/introduce.png') no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
        position: relative;
        margin: 0;
        padding: 0;
        margin-bottom: -1px;
    }
    
    .intOne>div {
        position: absolute;
        width: 3rem;
        min-height: 4rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .intOne>div:nth-child(1) {
        top: 12vh;
        left: 4rem;
    }
    
    .intOne>div:nth-child(2) {
        top: 0.2vh;
        left: 15rem;
    }
    
    .intOne>div:nth-child(3) {
        top: 35vh;
        left: 10rem;
    }
    
    .intOne>div:nth-child(4) {
        top: 34vh;
        left: 22rem;
    }
    
    .intOne>div:nth-child(5) {
        top: 53vh;
        left: 10rem;
    }
    
    .intOne>div:nth-child(6) {
        top: 65vh;
        left: 25rem;
    }
    
    .intOne>div:nth-child(7) {
        top: 79vh;
        left: 4rem;
    }
    
    .intOne>div:nth-child(8) {
        top: 85vh;
        left: 20rem;
    }
    
    .intOne>div>div:nth-child(1) {
        width: 1.5rem;
        height: 2rem;
        overflow: hidden;
    }
    
    .intOne>div>div:nth-child(2) {
        width: 1.5rem;
        height: 2rem;
        overflow: hidden;
    }
    
    .intOne>div>div:nth-child(3) {
        margin-top: 0.3rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 5rem;
    }
    
    .intOne>div>div img {
        width: 100%;
        height: 100%;
    }
    /*热点详情弹出框*/
    
    .popupCont {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 1001;
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .popupCont>div {
        z-index: 10;
        background-color: rgba(0, 0, 0, 0);
        width: 28rem;
        background: url('/static/img/form-bg.png') no-repeat;
        background-size: 100% 100%;
        position: relative;
        border: 1px solid rgba(0, 0, 0, 0);
        /*border: 1px solid red;*/
    }
    
    .cloneCl {
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        width: 2.7rem;
        height: 2.7rem;
        background: url('/static/img/close.png') no-repeat;
        background-size: 100% 100%;
    }
    
    .textCont {
        margin: 3rem auto;
        min-height: 35rem;
        max-height: 48rem;
        width: 25rem;
        overflow: hidden;
        /*border: 1px solid red;*/
    }
    
    .textCont>div:nth-child(1) {
        width: 100%;
        height: 4rem;
        line-height: 4rem;
        font-size: 1.6rem;
        overflow: hidden;
        text-align: center;
        /*border: 1px solid red;*/
    }
    
    .textCont>div:nth-child(2) {
        font-size: 1.2rem;
        padding-left: 1rem;
        padding-right: 0.5rem;
        /*border: 1px solid red;*/
        position: relative;
        overflow: hidden;
        /*border: 1px solid red;*/
        max-height: 35rem;
        overflow-y: scroll;
    }
    /*    
    .textCont:after {
        position: absolute;
        bottom: 40px;
        right: 20px;
        width: 20px;
        color: #000;
        height: 20px;
        content: "...";
        background-color: #fff;
        border: 0;
    }*/
    /*提示分享弹出框*/
    
    .tostPopup {
        z-index: 10000;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .tostPopup>div {
        z-index: 100000;
        width: 28rem;
        height: 7rem;
        background-color: rgba(184, 225, 90, 0.3);
        border-radius: 0.3rem;
        position: relative;
    }
    
    .tostPopup>div>div:nth-child(1) {
        position: absolute;
        width: 25rem;
        height: 7rem;
        line-height: 7rem;
        font-size: 1.3rem;
        text-align: center;
    }
    
    .tostPopup>div>div:nth-child(2) {
        position: fixed;
        top: -7vh;
        left: 45vw;
        width: 50vw;
        height: 58vh;
    }
    
    .tostPopup>div>div:nth-child(3) {
        position: absolute;
        top: -0rem;
        right: -0rem;
        width: 2.7rem;
        height: 2.7rem;
        background: url('/static/img/close.png') no-repeat;
        background-size: 100% 100%;
    }
    
    .tostPopup>div>div:nth-child(2) img {
        width: 100%;
        height: 100%;
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