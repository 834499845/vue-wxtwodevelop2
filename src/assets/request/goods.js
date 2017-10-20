import Vue from 'vue'
const goods = {
  // 获取列表
  goodsLists: function goodsLists(ip, postdata) {
    return Vue.http.get(ip, postdata).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  },
  // 购买套餐 生成订单
  goodsShop: function goodsShop(ip, postdata) {
    var ipStr = ip + "/" + postdata.goodsId + "/" + postdata.consumerId
    return Vue.http.get(ipStr, {}).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  }
}

export default goods
