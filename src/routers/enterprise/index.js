import Vue from 'vue'
import Router from 'vue-router'
import { getSession } from '@/modules/authentication'
import storage from '@/modules/storage'
import multiLevelNavRoutes from './routes'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/signin',
      name: 'signin',
      component: require('@/pages/enterprise/Signin').default
    },
    // 全屏轮播需要的路由
    {
      path: '/carousel-screen-drop',
      name: 'carousel-screen-drop',
      component: require('@/pages/enterprise/carousel/Carousel').default,
      meta: { authRequired: true },
      props: (route) => ({ device: route.query.device })
    },
    {
      path: '/',
      name: 'index',
      redirect: '/dashboard',
      component: require('@/pages/enterprise/Layout').default,
      meta: { authRequired: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          meta: {
            primaryNav: true,
            title: '首页',
            icon: require('@/assets/icons/nav/dashboard.png')
          },
          component: require('@/pages/enterprise/Dashboard').default
        },
        ...multiLevelNavRoutes,
        {
          path: 'liaison',
          name: 'liaison',
          meta: {
            primaryNav: true,
            title: '政企联络',
            icon: require('@/assets/icons/nav/liaison.png')
          },
          component: require('@/pages/enterprise/Liaison').default
        },
        {
          path: 'carousel',
          name: 'carousel',
          meta: {
            primaryNav: true,
            title: '轮播展示',
            icon: require('@/assets/icons/nav/carousel.png')
          },
          component: require('@/pages/enterprise/carousel/Layout').default
        },

        // 没有依附于导航的其它路由
        {
          path: 'account',
          name: 'account',
          component: require('@/pages/management/Account').default
        },
        {
          path: 'policies',
          name: 'policies',
          component: require('@/pages/enterprise/Policies').default
        },
        {
          path: 'policies/:id',
          name: 'policy',
          component: require('@/pages/management/policy/Detail').default,
          props: { isEnterprise: true }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 验证从政府端、集团端过来时，增加isRedirect状态

  if (to.matched[to.matched.length - 1]) {
    if (!to.matched[to.matched.length - 1].props.default) {
      to.matched[to.matched.length - 1].props.default = {}
    }
    if (typeof to.matched[to.matched.length - 1].props.default !== 'function'
      && to.matched[to.matched.length - 1].components.default)
      to.matched[to.matched.length - 1].props.default.isRedirect = storage.getIsRedirect()
  }

  if (to.matched.some(m => m.meta.authRequired)) {
    const session = getSession()
    if (session && session.token) {
      next()
    } else {
      next({
        name: 'signin',
        query: {
          redirectTo: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default router
