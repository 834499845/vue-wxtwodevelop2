import Vue from 'vue'
const user = {
  // 获取用户信息
  userList: function userList(ip, postdata) {
    var ipStr = ip + "/" + postdata.id
    return Vue.http.post(ipStr, {}).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  },
  userUrl: function userUrl(ip, postdata) {
    return Vue.http.get(ip, {}).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  },
  UserFist: function UserFist(ip, postdata) {
    var ipPath = ip + '/' + postdata.code
    return Vue.http.get(ipPath, {}).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        return Promise.reject(response.data.message)
      }
    })
  }
}

export default user
