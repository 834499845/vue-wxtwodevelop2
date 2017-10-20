/**
 * Created by LangK on 2016/12/20.
 */
import Vue from 'vue'
require("../../API/config")
import home from "../assets/request/home"
import user from "../assets/request/user"
import store from "../assets/request/store"
import goods from "../assets/request/goods"
import order from "../assets/request/order"
import WXuser from "../assets/request/WXuser"
import WXpay from "../assets/request/WXpay"
import Acthome from "../assets/request/Acthome"
export default {
  // 首页信息
  getHomeAll({ }, postdata) {
    return home.homeList(global.homePath, postdata)
  },
  // 首页搜索
  getHomeSeek({ }, postdata) {
    return home.homeSeek(global.homeSearchPath, postdata)
  },
  // 首页类别搜索
  getHomeType({ }, postdata) {
    return home.homeType(global.storeTypeListPath, postdata)
  },
  // 用户信息
  getUserAll({ }, postdata) {
    return user.userList(global.userOnePath, postdata)
  },
  // 获取关于我的 url
  getUserUrl({}, postdata) {
    return user.userUrl(global.userUrlPath, postdata)
  },
  // 个体商户详情
  getstoreOne({ }, postdata) {
    return store.storeOneFind(global.storeOnePath, postdata)
  },
  // 套餐列表
  getGoodsAll({ }, postdata) {
    return goods.goodsLists(global.goodsListPath, postdata)
  },
  // 根据套餐生成订单
  getShopGoods({ }, postdata) {
    return goods.goodsShop(global.goodsorderPath, postdata)
  },
  // 订单列表
  getOrderAll({ }, postdata) {
    return order.orderLists(global.orderListPath, postdata)
  },
  // 获取用户信息
  getWXUser({ }, postdata) {
    // return this.$http.post(global.WXuserOnePath, postdata).then(function (res) {
    //   alert(res.body);
    // }, function () {
    //   alert('请求失败处理'); //失败处理
    // });
    return WXuser.WXUsers(global.WXuserOnePath, postdata)
  },
  // 从微信获取信息注册
  getWXToken({}, postdata) {
    return Vue.http.post('/home', postdata).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  },
  // 余额支付
  getWXPay({}, postdata) {
    return WXpay.WXPay(global.WXPaymentPath, postdata)
  },
  // 支付流水
  getPayWarchAll({}, postdata) {
    return WXpay.WXPayWarch(global.WXPaymentWarchPath, postdata)
  },
  // 公众号支付
  getWXGZHPay({}, postdata) {
    return WXpay.WXGZHPayWarch(global.WXGZHPayPath, postdata)
  },
  // 从微信获取信息注册
  getWxJssdk({}, postdata) {
    return Vue.http.post('/apphome', postdata).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  },
  // 获取用户信息
  getUserFist({ }, postdata) {
    return user.UserFist(global.firsCodePath, postdata)
  },
  // 端午活动
  // 获取热点信息
  getActHotAll({ }, postdata) {
    return Acthome.hotLists(global.homeActPath, postdata)
  },
  // 获取用户粽子信息
  getActUserAll({ }, postdata) {
    return Acthome.userLists(global.homeUserActPath, postdata)
  },
  // 添加热点信息
  getActAddHot({ }, postdata) {
    return Acthome.addHots(global.homeaddHotActPath, postdata)
  },
  // 用户转转转米数
  getActUserMeter({ }, postdata) {
    return Acthome.userMeter(global.meterActPath, postdata)
  },
  // 用户的米数列表
  getActUserMeterList({ }, postdata) {
    return Acthome.userMeterList(global.meterListActPath, postdata)
  }
}
