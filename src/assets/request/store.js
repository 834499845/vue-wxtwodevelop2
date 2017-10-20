import Vue from 'vue'
const store = {
  // 获取列表
  storeOneFind: function storeOneFind(ip, postdata) {
    var ipStr = ip + "/" + postdata.id
    return Vue.http.get(ipStr).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  }
}

export default store
