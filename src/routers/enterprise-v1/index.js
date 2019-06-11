import Vue from 'vue'
import Router from 'vue-router'
import { getSession } from '@/modules/authentication'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/signin',
      name: 'signin',
      component: require('@/pages/enterprise-v1/Signin').default
    },
    {
      path: '/dashboard-screen-drop',
      name: 'dashboard-screen-drop',
      component: require('@/pages/enterprise-v1/DashboardCarousel').default,
      meta: { authRequired: true },
      props: (route) => ({ device: route.query.device })
    },
    {
      path: '/',
      name: 'home',
      redirect: '/dashboard',
      component: require('@/pages/enterprise-v1/Layout').default,
      meta: { authRequired: true },
      children: [
        {
          path: 'account',
          name: 'account',
          component: require('@/pages/management/Account').default
        },

        {
          path: 'policies',
          name: 'policies',
          component: require('@/pages/enterprise-v1/Policies').default
        },
        {
          path: 'policies/:id',
          name: 'policy',
          component: require('@/pages/management/policy/Detail').default
        },

        {
          path: 'dashboard',
          name: 'dashboard',
          component: require('@/pages/enterprise-v1/Dashboard').default
        },

        {
          path: 'information',
          redirect: { name: 'basic-info' },
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'basic',
              name: 'basic-info',
              component: require('@/pages/enterprise-v1/BasicInfo').default
            },
            {
              path: 'safety',
              name: 'safety-info',
              component: require('@/pages/enterprise-v1/SafetyInfo').default
            },
            {
              path: 'certifications',
              name: 'certifications',
              component: require('@/pages/enterprise-v1/Certifications').default
            },
            {
              path: 'employees',
              name: 'employees',
              component: require('@/pages/enterprise-v1/Employees').default,
              children: [
                {
                  path: ':employeeId/certificates',
                  name: 'enterprise-employee-certificates',
                  component: require('@/pages/management/enterprise-archive/EmployeeCertificates').default
                }
              ]
            },
            {
              path: 'risk-grade',
              name: 'risk-grade',
              component: require('@/pages/enterprise-v1/RiskGrade').default
            },
            {
              path: 'hierarchy-setting',
              name: 'hierarchy-setting',
              redirect: { name: 'hierarchy-count' },
              component: require('@/pages/enterprise-v1/hierarchy-setting/Layout').default,
              children: [
                {
                  path: 'hierarchy-count',
                  name: 'hierarchy-count',
                  component: require('@/pages/enterprise-v1/hierarchy-setting/HierarchyCount').default
                },
                {
                  path: 'hierarchies/:hierarchy/jobs',
                  name: 'hierarchy-jobs-setting',
                  component: require('@/pages/enterprise-v1/hierarchy-setting/HierarchyJobs').default,
                  props: (route) => ({
                    hierarchy: parseInt(route.params.hierarchy, 10)
                  })
                }
              ]
            }
          ]
        },

        {
          path: 'risk-assessments',
          name: 'risk-assessments',
          component: require('@/pages/enterprise-v1/RiskAssessments').default
        },
        {
          path: 'risk-assessments/:id/items',
          name: 'enterprise-risk-items',
          component: require('@/pages/management/enterprise-archive/RiskAssessmentItems').default,
          props: (route) => ({
            canEdit: false,
            breadcrumbs: [
              { name: '风险辨识评估', route: { name: 'risk-assessments', query: { reset: false } } },
              { name: route.query.type }
            ]
          })
        },

        {
          path: 'risk-planar',
          name: 'risk-planar',
          component: require('@/pages/enterprise-v1/RiskPlanarGraph').default
        },
        {
          path: 'risk-planar/risks/:id',
          name: 'risk-detail',
          redirect: { name: 'risk-scl' },
          component: require('@/pages/management/risk/RiskDetail').default,
          props: {
            breadcrumbs: [
              { name: '风险四色分布图', route: { name: 'risk-planar' } },
              { name: '风险点详情' }
            ]
          },
          children: [
            {
              path: 'scl',
              name: 'risk-scl',
              component: require('@/pages/management/risk/RiskSCL').default
            },
            {
              path: 'jha',
              name: 'risk-jha',
              component: require('@/pages/management/risk/RiskJHA').default
            },
            {
              path: 'risk-controls',
              name: 'risk-controls',
              component: require('@/pages/management/risk/RiskControls').default
            },
            {
              path: 'hidden-danger-controls',
              name: 'hidden-danger-controls',
              component: require('@/pages/management/risk/HiddenDangerControls').default
            }
          ]
        },

        {
          path: 'risk-controls',
          name: 'all-risk-controls',
          component: require('@/pages/enterprise-v1/RiskControls').default
        },
        {
          path: 'hidden-danger-controls',
          name: 'all-hidden-danger-controls',
          component: require('@/pages/enterprise-v1/HiddenDangerControls').default
        },

        {
          path: 'users',
          name: 'users',
          component: require('@/pages/enterprise-v1/Users').default
        }
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
