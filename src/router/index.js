import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('src/ui/layout/home/Index.vue'),
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('src/ui/home/dashboard/Index.vue'),
          meta: {
            title: 'Home'
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
