import Vue from 'vue'
const WX = {
  // 发起支付
  WXPay: function WXPay(ip, postdata) {
    var ipStr = ip + '/' + postdata.consumer_id + '/' + postdata.store_id + '/' + postdata.amount + '/' + postdata.payment_type + '/' + postdata.channel
    console.log(ipStr, postdata)
    return Vue.http.get(ipStr, postdata).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  },
  // 支付流水
  WXPayWarch: function WXPayWarch(ip, postdata) {
    var ipStr = ip + '/' + postdata.consumer_id + '/' + postdata.page_size + '/' + postdata.number
    return Vue.http.get(ipStr, {}).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  },
  // 公众号支付
  WXGZHPayWarch: function WXGZHPayWarch(ip, postdata) {
    var ipStr = ip + '/' + postdata.goods_id + '/' + postdata.consumer_id
    return Vue.http.get(ipStr, postdata).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  }
}

export default WX
