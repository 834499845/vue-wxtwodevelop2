import Vue from 'vue'
const order = {
  // 获取订单列表
  orderLists: function orderLists(ip, postdata) {
    var ipStr = ip + "/" + postdata.id + "/" + postdata.page_size + "/" + postdata.number
    console.log(ipStr)
    return Vue.http.get(ipStr, postdata).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  }
}

export default order
