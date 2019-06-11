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
      component: require('@/pages/group/Signin').default
    },

    {
      path: '/',
      name: 'index',
      redirect: '/dashboard',
      component: require('@/pages/group/Layout').default,
      meta: { authRequired: true },
      children: [
        {
          path: 'account',
          name: 'account',
          component: require('@/pages/management/Account').default
        },
        ...routes
      ]
    }
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
