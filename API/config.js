/**
 * Created by Administrator on 2016/10/22 0022.
 */

/**
 * 内网
 * @type {string}
 */
// 测试ip
// global.logIp = '192.168.1.181'
// 内网ip
// global.logIp = '10.27.113.15'
// 外网ip
global.logIp = '116.62.180.74'
// 上传图片,文件
global.logFileport = '9091'
// 应用端口
global.logport = '80'

// 首页模块****************************************************
// 首页信息
global.homePath = '/client/home/init'
// 首页搜索
global.homeSearchPath = '/client/home/search'
// 店铺类别列表信息
global.storeTypeListPath = '/client/store/find_all'
// 商户信息
global.storeOnePath = '/client/store/find_one'

// 套餐模块****************************************************
// 套餐信息
global.goodsListPath = '/client/goods/find_all'
// 根据套餐
global.goodsorderPath = '/client/order/create_order'
// 微信公众号支付
global.WXGZHPayPath = '/client/order/create_order'
// 订单模块****************************************************
// 所用订单信息
global.orderListPath = '/client/order/find_order'

// 用户模块****************************************************
// 用户信息
global.userOnePath = '/client/consumer/find_by_id'
// 用户主页url
global.userUrlPath = '/client/about/get'

// WX用户模块****************************************************
// 用户信息
global.WXuserOnePath = '/client/consumer/save'

// 支付模块****************************************************
// 支付
global.WXPaymentPath = '/client/payment/create_payment'
// 支付流水
global.WXPaymentWarchPath = '/client/payment/find_payment_by_consumer'

// 好友列表****************************************************
// 好友
global.firsCodePath = '/client/consumer/find_by_othercode'

// 划龙舟模块****************************************************
// 龙舟热点列表  用户id openid
global.homeActPath = '/client/activity/hotspot_list'
// 点亮热点 用户id openid 热点id spotid
global.homeaddHotActPath = '/client/activity/lighten_hotspot'
// 用户粽子详情 用户id openid
global.homeUserActPath = '/client/activity/details'
// 转盘****************************************************
// 转转转 用户id openid  meter米数
global.meterActPath = '/client/activity/play_game'
// 用户米数排行榜
global.meterListActPath = '/client/activity/distance_sort/'
