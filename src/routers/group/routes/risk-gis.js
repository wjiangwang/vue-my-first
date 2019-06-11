export default {
  path: 'risk-gis',
  name: 'risk-gis',
  redirect: 'risk-gis/risk-gis',
  component: {
    render(c) { return c('router-view') }
  },
  meta: {
    title: '风险管控及隐患排查系统',
    nav: true
  },
  children: [
    {
      path: 'risk-gis',
      component: require('@/pages/management/e-map/Map').default,
      props: {address: '四川省'}
    },
    {
      path: 'risks-planar-graph/:enterpriseId',
      name: 'emap-risk-planar-graph',
      component: require('@/pages/management/enterprise-archive/RiskPlanarGraph').default,
      props: { readonly: true, isGroup: true }
    },
    {
      path: 'risks-planar-graph/:enterpriseId/risks/:id',
      name: 'risk-detail',
      redirect: { name: 'risk-scl' },
      component: require('@/pages/management/risk/RiskDetail').default,
      props: { isGroup: true },
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
        },
        {
          path: 'monitor',
          name: 'monitor',
          component: require('@/pages/enterprise/contingency-plan/contingency-plan-card/PlanCardForm').default
        },
        {
          path: 'disposal-card',
          name: 'disposal-card',
          component: require('@/pages/enterprise/contingency-plan/contingency-plan-card/PlanCardForm').default
        }
      ]
    }
  ]
}
