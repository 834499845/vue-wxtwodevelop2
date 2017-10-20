<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <transition name="bounce">
        <div id="app" class="contacts">
            <div class="main">
                <div>
                    <ul>
                        <li class="nameLi" v-for="(item,ind) in lists" v-show="orderLi">
                            <div>
                                <div>
                                    <img :src="item.avatar | imgUrlFun" width="32" height="32" alt="">
                                </div>
                                <div>
                                    {{item.nickName}}
                                </div>
                            </div>
                            <div>
                                {{item.ctime | ctimeFun}}
                            </div>
                        </li>
                        <li id="orderLi" v-show="!orderLi">
                            <div id="orderLiImg">
                                <img src="/static/img/暂无数据.png" alt="">
                            </div>
                            <div id="orderLiNull" @touchend="ceshitouch">
                                暂无记录
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-show="isLoad" class="loadIng">
                <mt-spinner type="fading-circle" color="rgb(42, 83, 205)"></mt-spinner>
            </div>
        </div>
    </transition>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    export default {
        name: 'contacts',
        data() {
            return {
                lists: [],
                orderLi: false,
                isLoad: false
            }
        },
        computed: mapState(['WXuserObj', 'WXUSerId', 'userDetailsObj', 'erPayObj']),
        filters: {
            // 时间戳过滤
            ctimeFun: function (val) {
                if (val) {
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
                } else {
                    return '无'
                }
            },
            // 图片过滤
            imgUrlFun: function (val) {
                if (val) {
                    return val
                } else {
                    return "/static/img/errimg.png"
                }
            }
        },
        created: function () {
            var self = this
            document.title = '我邀请的人'
            this.$emit('appchildsay', 'contacts');
            //  1099226 941364
            // alert(self.WXUSerId.code)
            self.isLoad = true
            self.getUserFist({
                code: self.WXUSerId.code
            }).then((data) => {
                // alert(JSON.stringify(data))
                console.log(data)
                self.isLoad = false
                if (data.data.code == "200") {
                    if (data.data.data.length > 0) {
                        self.lists = data.data.data
                        self.orderLi = true
                    } else {
                        self.orderLi = false
                    }
                } else {
                    self.orderLi = false
                }
            }).catch(msg => {
                self.isLoad = false
                console.log(msg)
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
            ceshitouch() {
                // this.$router.push({
                //     path: '/introduce'
                // })
            },
         ...mapActions(['getUserFist'])
        }
    }

</script>

<style scoped>
    #app {
        background-color: #f5f5f6;
        height: 100vh;
        width: 100vw;
    }
    
    .main {
        background-color: #f5f5f6;
    }
    
    .oneInd {
        background-color: #f5f5f5;
        height: 2rem;
        line-height: 2rem;
        color: #9d9d9d;
        padding-left: 1.3rem;
    }
    
    .nameLi {
        height: 4.4rem;
        border-bottom: 1px solid #f7f7f7;
        background-color: #fff;
        line-height: 4.4rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .nameLi div {
        font-size: 1.2rem;
        color: #525252;
    }
    
    .nameLi>div:nth-child(1) {
        display: flex;
        align-items: center;
        margin-left: 1.5rem;
    }
    
    .nameLi>div:nth-child(1)>div:nth-child(1) {
        width: 3.2rem;
        height: 3.2rem;
    }
    
    .nameLi>div:nth-child(1)>div:nth-child(1) img {
        width: 100%;
        height: 100%;
    }
    
    .nameLi>div:nth-child(1)>div:nth-child(2) {
        margin-left: 2.5rem;
    }
    
    .nameLi>div:nth-child(2) {
        margin-right: 1.5rem;
        display: flex;
        align-items: center;
    }
    
    .bounce-enter-active {
        transition: all 0.7s ease;
    }
    
    .bounce-enter,
    .bounce-leave-active {
        transform: translateX(30px);
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