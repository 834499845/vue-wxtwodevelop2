import Vue from 'vue'
export default function getLogin(ip, postdata) {
    return Vue.http.post(ip, postdata).then(response => {
        console.log('结束')
        console.log(response.body)
        if (response.status === 200) {
            return Promise.resolve(response.body)
        } else {
            return Promise.reject(response.body)
        }
    })
}