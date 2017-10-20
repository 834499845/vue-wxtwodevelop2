/**
 * Created by LangK on 2016/12/20.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isLoading: false,
    isToasting: false,
    storeObj: {
      pay: '',
      contact: '',
      ctime: '',
      hotPoint: '',
      id: '',
      mobile: '',
      pwd: '',
      salesInfo: '',
      storeAddress: '',
      storeIcon: '',
      storeImages: '',
      storeInfo: '',
      storeLocation: '',
      storeName: '',
      typeId: ''
    },
    typeObj: {
      ctime: '',
      icon: '',
      position: '',
      id: '',
      typeName: ''
    },
    WXuserObj: {
      openid: '',
      nickname: '',
      sex: 1,
      language: '',
      city: '',
      province: '',
      country: '',
      headimgurl: ''
    },
    WXUSerId: {
      id: '',
      code: '',
      openid: ''
    },
    userDetailsObj: {
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
    userPayDetaObj: {
      name: '',
      money: ''
    },
    appIndex: '0',
    seekObj: {
      seekStr: ''
    },
    payWarthObj: {
      pay: '',
      name: '',
      amount: '',
      consumerEntity: '',
      ctime: '',
      id: '',
      orderNumber: '',
      orderStatus: '',
      paymentType: ''
    },
    pathObj: {
      name: ''
    },
    erPayObj: {
      id: ''
    },
    userActObj: {
      id: '',
      openid: '',
      nickName: '',
      totalTickets: 0,
      totalSteps: '',
      totalChance: ''
    },
    codeObj: {
      code: ''
    }
  },
  mutations,
  actions
})



export default store
