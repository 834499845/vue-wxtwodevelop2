import Vue from 'vue'
const home = {
    // 获取首页信息
    homeList: function homeList(ip, postdata) {
        console.log(ip, postdata)
        return Vue.http.get(ip, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 首页搜索
    homeSeek: function homeSeek(ip, postdata) {
        console.log(ip, postdata)
        var ipStr = ip + "?storeName=" + postdata.storeName;
        return Vue.http.get(ipStr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 首页类别搜索
    homeType: function homeType(ip, postdata) {
        console.log(ip, postdata)
        var ipStr = ip + "/" + 20 + "/" + 1 + "?typeId=" + postdata.typeId;
        return Vue.http.get(ipStr, {}).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    }
}

export default home
