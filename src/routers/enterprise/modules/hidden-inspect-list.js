// 隐患排查清单
import storage from '@/modules/storage'
export default {
  path: 'hidden-inspect-list',
  redirect: 'hidden-inspect-list/hidden-inspect-list',
  name: 'hidden-inspect-list',
  component: {
    render(c) {
      return c('router-view')
    }
  },
  children: [
    {
      path: 'hidden-inspect-list',
      component: require('@/pages/enterprise/risk-lassification-control/hidden-inspect-list/HiddenInspectList')
        .default
    },
    {
      path: ':id/detail/items',
      component: require('@/pages/enterprise/risk-lassification-control/hidden-inspect-list/HiddenAssessmentItems')
        .default
    },
    {
      path: 'hidden-book/:id',
      component: require('@/pages/enterprise/risk-lassification-control/hidden-inspect-list/HiddenDetail').default
    },
  ]
}
