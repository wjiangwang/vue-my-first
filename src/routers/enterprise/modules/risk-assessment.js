// 风险辨识评估
import storage from '@/modules/storage'

export default {
  path: 'risk-assessment',
  redirect: 'risk-assessment/risk-assessments',
  component: require('@/pages/enterprise/risk-lassification-control/risk-identification-assessment/Layout')
    .default,
  children: [
    {
      path: 'risk-assessments',
      name:'risk-assessments-area-risk',
      component: require('@/pages/enterprise/risk-lassification-control/risk-identification-assessment/RiskAssessments')
        .default
    },

    {
      path: ':id/onTime/items',
      component: require('@/pages/enterprise/risk-lassification-control/risk-identification-assessment/RiskAssessmentItems')
        .default,
      props: route => ({
        canEdit: true,
        breadcrumbs: [
          {
            name: '区域风险',
            route: {
              path: 'risk-assessment/risk-assessments',
              query: { reset: false }
            }
          },
          { name: route.query.type }
        ],
        isRedirect: storage.getIsRedirect()
      })
    },
    {
      path: 'onTime/risks/:id',
      name: 'risk-control-standing-book',
      component: require('@/pages/enterprise/risk-lassification-control/risk-identification-assessment/RiskDanger').default
    },

    {
      path: 'onTime/risk-hidden-level-detail',
      // name:'risk-hidden-level-detail',
      component: require('@/pages/enterprise/risk-lassification-control/risk-identification-assessment/RiskAndHiddenLevelDetail')
        .default
    },
    {
      path: 'real-time-risk-assessment',
      name: 'real-time-risk-assessment',
      component: require('@/pages/enterprise/risk-lassification-control/risk-identification-assessment/real-time-risk/RealTimeRisk')
        .default
    },
    {
      path: ':id/realTime/items',
      component: require('@/pages/enterprise/risk-lassification-control/risk-identification-assessment/real-time-risk/RealTimeRiskDetail')
        .default,
      props: route => ({
        canEdit: true,
        breadcrumbs: [
          {
            name: '实时风险辨识评估',
            route: {
              path: 'real-time-risk-assessment/risk-assessment',
              query: { reset: false }
            }
          },
          { name: 'JHA' }
        ],
        isRedirect: storage.getIsRedirect()
      })
    }
  ]
}
