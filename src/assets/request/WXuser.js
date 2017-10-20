import Vue from 'vue'
const WX = {
  // 获取用户信息
  WXUsers: function WXUsers(ip, postdata) {
    var ipStr = ip + '?openid=' + postdata.openid + '&nick=' + postdata.nick + '&avatar=' + postdata.avatar + '&inviteCode=' + postdata.invite_code
    // alert(JSON.stringify(postdata))
    return Vue.http.get(ipStr, {}).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response.body)
      } else {
        // alert(JSON.stringify(response.data))
        return Promise.reject(response.data.message)
      }
    })
  }
}

export default WX
