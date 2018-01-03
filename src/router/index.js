import Vue from 'vue'
import Router from 'vue-router'
import { getMe } from 'src/api/uc'

Vue.use(Router)

const homeGroups = [
  {
    name: 'Administrator',
    title: '管理员',
    path: '/'
  },
  {
    name: 'Other',
    title: '其他',
    path: '/'
  },
  {
    name: 'Product',
    title: '商品管理',
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
          path: 'pfproduct',
          name: 'PlatformProductIndex',
          component: () => import('src/ui/product/platform/Index.vue'),
          meta: {
            group: 'Product',
            title: '平台商品',
            showInSide: true
          }
        },
        {
          path: 'pfproduct/create',
          name: 'PlatformProductCreate',
          component: () => import('src/ui/product/platform/Create.vue'),
          meta: {
            group: 'Product',
            title: '添加平台商品',
            breadcrumbItems: [
              {
                text: '平台商品',
                to: {
                  name: 'PlatformProductIndex'
                }
              },
              {
                text: '添加平台商品'
              }
            ],
            customBreadcrumb: false
          }
        },
        {
          path: 'pfproduct/edit/:id',
          name: 'PlatformProductEdit',
          component: () => import('src/ui/product/platform/Edit.vue'),
          meta: {
            group: 'Product',
            title: '编辑平台商品',
            breadcrumbItems: [
              {
                text: '平台商品',
                to: {
                  name: 'PlatformProductIndex'
                }
              },
              {
                text: '编辑平台商品'
              }
            ],
            customBreadcrumb: false
          }
        },
        {
          path: 'tenantuser',
          name: 'TenantUser',
          component: () => import('src/ui/user/tenant-user/Index.vue'),
          meta: {
            group: 'Other',
            title: '店铺管理员',
            showInSide: true
          }
        },
        {
          path: 'tenantuser/create',
          name: 'CreateTenantUser',
          component: () => import('src/ui/user/tenant-user/Create.vue'),
          meta: {
            title: '创建店铺管理员',
            showInSide: false,
            breadcrumbItems: [{
              text: '店铺管理员',
              to: {name: 'TenantUser'}
            }, {
              text: '创建店铺管理员'
            }]
          }
        },
        {
          path: 'tenantuser/edit/:id',
          name: 'EditTenantUser',
          component: () => import('src/ui/user/tenant-user/Edit.vue'),
          meta: {
            title: '编辑店铺管理员',
            showInSide: false,
            breadcrumbItems: [{
              text: '店铺管理员',
              to: {name: 'TenantUser'}
            }, {
              text: '编辑店铺管理员'
            }]
          }
        },
        {
          path: 'sysuser',
          name: 'SysUserIndex',
          component: () => import('src/ui/user/sys-user/Index.vue'),
          meta: {
            group: 'Administrator',
            title: '管理员列表',
            showInSide: true
          }
        }
      ]
    },
    {
      path: '/login',
      name:
        'Login',
      component:
        () => import('src/ui/auth/login/Index.vue')
    }
  ]
})
