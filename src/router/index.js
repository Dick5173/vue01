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
            title: '创建平台商品',
            breadcrumbItems: [
              {
                text: '平台商品',
                to: {
                  name: 'PlatformProductIndex'
                }
              },
              {
                text: '创建'
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
                text: '编辑'
              }
            ],
            customBreadcrumb: false
          }
        },
        {
          path: 'tsproduct',
          name: 'TenantSelfProductIndex',
          component: () => import('src/ui/product/tenant-self/Index.vue'),
          meta: {
            group: 'Product',
            title: '店铺自营商品',
            showInSide: true
          }
        },
        {
          path: 'tsproduct/detail/:id',
          name: 'TenantSelfProductDetail',
          component: () => import('src/ui/product/tenant-self/TenantSelfDetail.vue'),
          meta: {
            group: 'Product',
            title: '商品详情',
            breadcrumbItems: [
              {
                text: '自营商品',
                to: {
                  name: 'TenantSelfProductIndex'
                }
              },
              {
                text: '商品详情'
              }
            ],
            customBreadcrumb: false
          }
        },
        {
          path: 'category',
          name: 'CategoryIndex',
          component: () => import('src/ui/product/category/Index.vue'),
          meta: {
            group: 'Product',
            title: '分类',
            showInSide: true
          }
        },
        {
          path: 'tag',
          name: 'Tag',
          component: () => import('src/ui/product/tag/Index.vue'),
          meta: {
            group: 'Product',
            title: '标签',
            showInSide: true
          }
        },
        {
          path: 'afterservice',
          name: 'AfterServiceIndex',
          component: () => import('src/ui/product/after-service/Index.vue'),
          meta: {
            group: 'Product',
            title: '售后模板',
            showInSide: true
          }
        },
        {
          path: 'afterservice/create',
          name: 'AfterServiceCreate',
          component: () => import('src/ui/product/after-service/Create.vue'),
          meta: {
            group: 'Product',
            title: '创建售后模板',
            breadcrumbItems: [
              {
                text: '售后模板',
                to: {
                  name: 'AfterServiceIndex'
                }
              },
              {
                text: '创建'
              }
            ],
            customBreadcrumb: false
          }
        },
        {
          path: 'afterservice/edit/:id',
          name: 'AfterServiceEdit',
          component: () => import('src/ui/product/after-service/Edit.vue'),
          meta: {
            group: 'Product',
            title: '编辑售后模板',
            breadcrumbItems: [
              {
                text: '售后模板',
                to: {
                  name: 'AfterServiceIndex'
                }
              },
              {
                text: '编辑'
              }
            ],
            customBreadcrumb: false
          }
        },
        {
          path: 'service',
          name: 'ServiceIndex',
          component: () => import('src/ui/product/service/Index.vue'),
          meta: {
            group: 'Product',
            title: '服务',
            showInSide: true
          }
        },
        {
          path: 'deliveryregion',
          name: 'DeliveryRegionIndex',
          component: () => import('src/ui/product/delivery-region/Index.vue'),
          meta: {
            group: 'Product',
            title: '配送区域',
            showInSide: true
          }
        },
        {
          path: 'deliveryregion/edit/:id',
          name: 'DeliveryRegionEdit',
          component: () => import('src/ui/product/delivery-region/Edit.vue'),
          meta: {
            group: 'Product',
            title: '编辑配送区域',
            breadcrumbItems: [
              {
                text: '配送区域',
                to: {
                  name: 'DeliveryRegionIndex'
                }
              },
              {
                text: '编辑'
              }
            ],
            customBreadcrumb: false
          }
        },
        {
          path: 'deliveryregion/create',
          name: 'DeliveryRegioncCreate',
          component: () => import('src/ui/product/delivery-region/Create.vue'),
          meta: {
            group: 'Product',
            title: '创建配送区域',
            breadcrumbItems: [
              {
                text: '配送区域',
                to: {
                  name: 'DeliveryRegionIndex'
                }
              },
              {
                text: '创建'
              }
            ],
            customBreadcrumb: false
          }
        },
        {
          path: 'tenant',
          name: 'Tenant',
          component: () => import('src/ui/other/tenant/Index.vue'),
          meta: {
            group: 'Other',
            title: '店铺',
            showInSide: true
          }
        },
        {
          path: 'tenant/detail',
          name: 'TenantDetail',
          component: () => import('src/ui/other/tenant/TenantDetail.vue'),
          meta: {
            title: '店铺详情',
            showInSide: false,
            breadcrumbItems: [{
              text: '店铺',
              to: {name: 'Tenant'}
            }, {
              text: '店铺详情'
            }]
          }
        },
        {
          path: 'tenant/income',
          name: 'TenantIncome',
          component: () => import('src/ui/other/tenant/Income.vue'),
          meta: {
            title: '收入',
            showInSide: false,
            breadcrumbItems: [{
              text: '店铺',
              to: {name: 'Tenant'}
            }, {
              text: '收入'
            }]
          }
        },
        {
          path: 'tenantuser',
          name: 'TenantUser',
          component: () => import('src/ui/other/tenant-user/Index.vue'),
          meta: {
            group: 'Other',
            title: '店铺管理员',
            showInSide: true
          }
        },
        {
          path: 'tenantuser/create',
          name: 'CreateTenantUser',
          component: () => import('src/ui/other/tenant-user/Create.vue'),
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
          component: () => import('src/ui/other/tenant-user/Edit.vue'),
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
          path: 'user',
          name: 'User',
          component: () => import('src/ui/other/user/Index.vue'),
          meta: {
            group: 'Other',
            title: '用户',
            showInSide: true
          }
        },
        {
          path: 'userdetail/:id',
          name: 'UserDetail',
          component: () => import('src/ui/other/user/Detail.vue'),
          meta: {
            title: '用户详情',
            showInSide: false,
            breadcrumbItems: [{
              text: '用户',
              to: {name: 'User'}
            }, {
              text: '用户详情'
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
