import Vue from 'vue'
import Router from 'vue-router'
import { getMe } from 'src/api/uc'

Vue.use(Router)

const homeGroups = [
  {
    name: 'Other',
    title: '其它',
    path: '/'
  }
]

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('src/ui/layout/home/Index.vue'),
      beforeEnter: async (to, from, next) => {
        if (Vue.$store.getters.isLogin) {
          next()
        } else {
          try {
            await getMe()
            next()
          } catch (err) {
            next({
              name: 'Login',
              replace: true
            })
          }
        }
      },
      meta: {
        menu: true,
        groups: homeGroups
      },
      children: [
        {
          path: '/',
          name: 'Dashboard',
          component: () => import('src/ui/home/dashboard/Index.vue'),
          meta: {
            title: '首页',
            showInSide: true
          }
        },
        {
          path: 'sysuser',
          name: 'SysUserIndex',
          component: () => import('src/ui/user/sys-user/Index.vue'),
          meta: {
            group: 'Other',
            title: '管理员',
            showInSide: true
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('src/ui/auth/login/Index.vue')
    }
  ]
})
