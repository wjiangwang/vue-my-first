import Vue from 'vue'
import Router from 'vue-router'
import { getSession } from '@/modules/authentication'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/signin',
      name: 'signin',
      component: require('@/pages/management/Signin').default
    },
    {
      path: '/',
      name: 'index',
      redirect: { path: '/dashboard' },
      component: require('@/pages/management/Layout').default,
      meta: { authRequired: true },
      children: [
        ...routes,
        {
          path: 'account',
          name: 'account',
          component: require('@/pages/management/Account').default
        }
      ]
    },
    // {
    //   path: 'account',
    //   name: 'account',
    //   component: require('@/pages/management/Account').default
    // }
  ]
})

router.beforeEach((to, from, next) => {
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
