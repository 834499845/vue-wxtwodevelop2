var exec = require('child_process').exec;
check()
function check() {
    last = exec('lsof -i:80')
    last.on('exit', function (code) {
        if (code != '0') {
            console.log('主服务已经关闭，正在启动')
            run()
        } else {
            console.log('主服务正常')
        }
    })
    setTimeout(check, 5000);
}
function run() {
    last = exec('node server.js');
    last.on('exit', function (code) {
        if (code != '0') {
            console.log('主服务已经重启')
        } else {
            console.log('重启失败')
        }
    })
}