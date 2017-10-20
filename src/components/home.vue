<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div id="app" class="home">
        <div class="main">
            <div class="view">
                <transition name="bounce">
                    <router-view @childsay="listenToMyBoy" @keyBord="keyBordClick" keep-alive></router-view>
                </transition>
            </div>
            <div class="strutTab">
            </div>
            <div class="tabBar" v-bind:style="{position: fixedStr}">
                <ul>
                    <li v-for="(tabBar,index) in tabBars" @touchstart="tbbarStart($event,index)" :class="{selectBar:isSelectBar == index}">
                        <div v-if="imgG == index"><img :src="tabBar.imgG" alt=""></div>
                        <div v-else><img :src="tabBar.img" alt=""></div>
                        <div>{{tabBar.name}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    export default {
        name: 'home',
        data() {
            return {
                fixedStr: 'fixed',
                isSeekLabel: true,
                seekVal: '',
                tabBars: [{
                    imgG: '/static/img/首页绿色.png',
                    img: '/static/img/首页.png',
                    name: '首页',
                    pathStr: 'homepage'
                }, {
                    imgG: '/static/img/订单-绿色.png',
                    img: '/static/img/订单.png',
                    name: '订单',
                    pathStr: 'payWater'
                }, {
                    imgG: '/static/img/充值--绿色.png',
                    img: '/static/img/充值-.png',
                    name: '套餐',
                    pathStr: 'card'
                }, {
                    imgG: '/static/img/我的绿色.png',
                    img: '/static/img/我的.png',
                    name: '我的',
                    pathStr: 'details'
                }],
                isSelectBar: 0,
                imgG: 0,
                isTriangle: 0
            }
        },
        computed: mapState(['WXuserObj', 'WXUSerId', 'pathObj']),
        created: function () {
            // alert('home')
            var self = this
            var homeT = localStorage.getItem('homeTrueA')
            // alert(homeT)
            // if (homeT == 'Yes') {
            //     self.$router.push({
            //         path: '/home/homepage'
            //     })
            // } else {

            // }
            var pathStr = self.$route.path.split('/')[2]
            switch (pathStr) {
                case 'homepage':
                    self.isSelectBar = 0
                    self.imgG = 0
                    break;
                case "payWater":
                    self.isSelectBar = 1
                    self.imgG = 1
                    break;
                case "card":
                    self.isSelectBar = 2
                    self.imgG = 2
                    break;
                case "details":
                    self.isSelectBar = 3
                    self.imgG = 3
                    break;
                default:
                    break;
            }
        },
        methods: {
            listenToMyBoy(val) {
                var self = this
                this.$emit('appchildsay', val);
                switch (val) {
                    case 'home%2Fhomepage':
                        self.isSelectBar = 0
                        self.imgG = 0
                        break;
                    case "home%2FpayWater":
                        self.isSelectBar = 1
                        self.imgG = 1
                        break;
                    case "home%2Fcard":
                        self.isSelectBar = 2
                        self.imgG = 2
                        break;
                    case "home%2Fdetails":
                        self.isSelectBar = 3
                        self.imgG = 3
                        break;
                    default:
                        break;
                }
            },
            keyBordClick(val) {
            },
            tbbarStart(event, index) {
                var self = this
                self.isSelectBar = index
                self.imgG = index
                var pathStr = "/home/" + self.tabBars[index].pathStr
                self.$router.push({
                    path: pathStr
                })
            },
            ...mapActions(['getWXToken', 'getWXUser'])
        },
        mounted() {
        }
    }

</script>
<style scoped>
    .bounce-enter-active {
        transition: all 0.7s ease;
    }
    
    .bounce-enter,
    .bounce-leave-active {
        transform: translateY(-30px);
        opacity: 0;
    }
    
    #app {
        background-color: #f5f5f6;
        overflow-x: hidden;
        height: 100vh;
    }
    
    .main {
        background-color: #f5f5f6;
    }
    
    .view {
        width: 100vw;
        height: calc(100vh - 4.5rem);
        background-color: #f5f5f6;
        overflow: hidden;
    }
    
    .strutTab {
        height: 4.5rem;
    }
    
    .tabBar {
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 4.5rem;
        border-top: 1px solid #f7f7f7;
        background-color: #fff;
    }
    
    .tabBar>ul {
        display: flex;
    }
    
    .tabBar>ul>li {
        width: 33%;
    }
    
    .tabBar>ul>li>div {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .tabBar>ul>li>div:nth-child(1) {
        height: 2.5rem;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .tabBar>ul>li>div:nth-child(2) {
        height: 1.6rem;
        font-size: 1.2rem;
        color: #848484;
    }
    
    .tabBar>ul>li:nth-child(1)>div:nth-child(1) img {
        display: block;
        width: 1.6rem;
        height: 1.45rem;
        /*64 32 16 58 29 14.5*/
    }
    
    .tabBar>ul>li:nth-child(2)>div:nth-child(1) img {
        /*58 29 14.5 70 35 17.5*/
        display: block;
        width: 1.45rem;
        height: 1.75rem;
    }
    
    .tabBar>ul>li:nth-child(3)>div:nth-child(1) img {
        display: block;
        /*76 38 19 58 29 14.5*/
        width: 1.9rem;
        height: 1.45rem;
    }
    
    .tabBar>ul>li:nth-child(4)>div:nth-child(1) img {
        display: block;
        /*50 25 12.5 62 31 15.5*/
        width: 1.25rem;
        height: 1.55rem;
    }
    
    .tabBar>ul .selectBar div:nth-child(2) {
        color: #1aac19;
    }
</style>