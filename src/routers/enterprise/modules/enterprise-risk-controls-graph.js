// 企业总平面布局图
export default {
  path: 'enterprise-planar-graph',
  redirect: 'enterprise-planar-graph/planar-graph',
  component: {
    render(c) {
      return c('router-view')
    }
  },
  children: [
    {
      path: 'planar-graph',
      redirect: 'planar-graph/risk-planar-graph',
      component: require('@/pages/enterprise/risk-lassification-control/general-layout/Layout')
        .default,
      props: {
        isRiskControlMenu: true,
        breadcrumbName: '风险四色图例'
      },
      children: [
        {
          path: 'risk-planar-graph',
          component: require('@/pages/enterprise/risk-lassification-control/general-layout/RiskPlanarGraph')
            .default
        },
        {
          path: 'risk-planar-graph-job',
          component: require('@/pages/enterprise/risk-lassification-control/general-layout/RiskPlanarGraphJob')
            .default
        },
        {
          path: 'risk-planar-graph-3D'
          // component: require('@/pages/enterprise/risk-lassification-control/RiskAssessments').default
        }
      ]
    },
    {
      path: 'risk-planar/risks/:id',
      redirect: 'risk-planar/risks/:id/scl',
      component: require('@/pages/management/risk/RiskDetail').default,
      props: {
        routePath: 'enterprise-planar-graph/planar-graph/risk-planar-graph'
      },
      children: [
        {
          path: 'scl',
          component: require('@/pages/management/risk/RiskSCL').default
        },
        {
          path: 'jha',
          component: require('@/pages/management/risk/RiskJHA').default
        },
        {
          path: 'risk-controls',
          component: require('@/pages/management/risk/RiskControls').default
        },
        {
          path: 'hidden-danger-controls',
          component: require('@/pages/management/risk/HiddenDangerControls')
            .default
        },
        {
          path: 'monitor',
          component: require('@/pages/enterprise/contingency-plan/contingency-plan-card/PlanCardForm')
            .default,
          props: { isEdit: true }
        },
        {
          path: 'disposal-card',
          component: require('@/pages/enterprise/contingency-plan/contingency-plan-card/PlanCardForm')
            .default,
          props: { isEdit: true }
        }
      ]
    }
  ]
}
