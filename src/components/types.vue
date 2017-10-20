<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <transition name="bounce">
        <div id="app" class="type">
            <div class="tyoeNav">
                所有分类
            </div>
            <div class="htabDatails">
                <ul>
                    <li v-for="(tab,index) in tabs" @touchstart="typeTouchstart($event,index)" @touchend="typeTouchend($event,index)">
                        <div>
                            <div><img :src="tab.icon | imgUrlFun" alt=""></div>
                        </div>
                        <div>{{tab.typeName}}</div>
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
        name: 'type',
        data() {
            return {
                isLoad: false,
                tabs: [],
                startTouchY: ''
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
                return "20" + year + "-" + month + "-" + date;
            },
            // 图片过滤
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
            }
        },
        computed: mapState(['typeObj']),
        created: function () {
            var self = this
            this.$emit('appchildsay', "types");
            self.isLoad = true
            document.title = '智慧玛特'
            // 发起获取首页信息请求
            self.getHomeAll({
            }).then((data) => {
                self.isLoad = false
                if (data.data.code == "200") {
                    if (data.data.types.length > 0) {
                        self.tabs = data.data.types
                    } else {
                        self.tabs = self.tabStas
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
        },
        methods: {
            // 跳转到选中的项目
            typeTouchstart(event) {
                this.startTouchY = event.changedTouches[0].clientY
            },
            typeTouchend(event, index) {
                var distance = event.changedTouches[0].clientY - this.startTouchY
                if (15 > distance && distance > -15) {
                    var self = this
                    var listObj = self.tabs[index]
                    for (var key in listObj) {
                        self.typeObj[key] = listObj[key]
                    }
                    self.$router.push({
                        path: '/typeDateils'
                    })
                }
            },
            ...mapActions(['getHomeAll'])
        }
    }

</script>

<style scoped>
    #app {
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fff;
    }
    
    .tyoeNav {
        margin: 0;
        padding: 0;
        height: 5.5rem;
        line-height: 5.5rem;
        border-bottom: 1px solid #f7f7f7;
        font-size: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
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
    
    .htabDatails {
        min-height: 7rem;
        margin-top: 1.5rem;
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
    
    .bounce-enter-active {
        transition: all 0.7s ease;
    }
    
    .bounce-enter,
    .bounce-leave-active {
        transform: translateY(30px);
        opacity: 0;
    }
</style>