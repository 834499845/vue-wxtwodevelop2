/**
 * Created by LangK on 2016/12/19.
 */

export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    redirect: '/home/homepage'
  },
  {
    // 支付界面
    path: '/pay',
    component: function (resolve) {
      require(['./components/pay.vue'], resolve)
    }
  },
  {
    // 抽奖
    path: '/lucky',
    component: function (resolve) {
      require(['./components/activity/lucky.vue'], resolve)
    }
  },
  {
    // 获取粽子
    path: '/introduce',
    component: function (resolve) {
      require(['./components/activity/introduce.vue'], resolve)
    }
  },
  {
    // 好友界面
    path: '/contacts',
    component: function (resolve) {
      require(['./components/contacts.vue'], resolve)
    }
  },
  {
    path: '/typeDateils',
    component: function (resolve) {
      require(['./components/typeDateils.vue'], resolve)
    }
  },
  {
    path: '/paySuccess',
    component: function (resolve) {
      require(['./components/paySuccess.vue'], resolve)
    }
  },
  {
    path: '/types',
    component: function (resolve) {
      require(['./components/types.vue'], resolve)
    }
  },
  {
    path: '/indent',
    component: function (resolve) {
      require(['./components/indent.vue'], resolve)
    }
  },
  {
    path: '/seekdateils',
    component: function (resolve) {
      require(['./components/seekDateils.vue'], resolve)
    }
  },
  {
    path: '/home',
    component: function (resolve) {
      require(['./components/home.vue'], resolve)
    },
    children: [
      {
        path: 'details',
        component: function (resolve) {
          require(['./components/homePage/details.vue'], resolve)
        }
      },
      {
        path: 'payWater',
        component: function (resolve) {
          require(['./components/homePage/payWater.vue'], resolve)
        }
      },
      {
        path: 'card',
        component: function (resolve) {
          require(['./components/homePage/card.vue'], resolve)
        }
      },
      {
        path: 'homepage',
        component: function (resolve) {
          require(['./components/homePage/homepage.vue'], resolve)
        }
      }
    ]
  }

]
