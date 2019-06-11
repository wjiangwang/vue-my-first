// 监控应急图
export default {
  path: 'contingency-monitoring-graph',
  redirect: 'contingency-monitoring-graph/planar-graph',
  component: {
    render(c) {
      return c('router-view')
    }
  },
  children: [
    {
      path: 'planar-graph',
      redirect: 'planar-graph/risk-planar-graph-monitor',
      component: require('@/pages/enterprise/risk-planar-graph-monitor/Layout')
        .default,
      children: [
        {
          path: 'risk-planar-graph',
          component: require('@/pages/enterprise/risk-lassification-control/general-layout/RiskPlanarGraph')
            .default,
          props: {
            secondUrl: 'contingency-monitoring-graph'
          }
        },
        {
          //TODO:各种平面图
          path: 'risk-planar-graph-3D',
          // component: require('@/pages/enterprise/risk-lassification-control/RiskAssessments')
          //   .default
        },
        {
          path: 'risk-planar-graph-job',
          // component: require('@/pages/enterprise/risk-lassification-control/RiskAssessments')
          //   .default
        },
        {
          path: 'risk-planar-graph-hazard',
          // component: require('@/pages/enterprise/risk-lassification-control/RiskAssessments')
          //   .default
        },
        {
          path: 'risk-planar-graph-monitor',
          // component: require('@/pages/enterprise/risk-lassification-control/RiskAssessments')
          //   .default
        },
        {
          path: 'risk-planar-graph-evacuate',
          // component: require('@/pages/enterprise/risk-lassification-control/RiskAssessments')
          //   .default
        },
        {
          path: 'risk-planar-graph-disposal',
          // component: require('@/pages/enterprise/contingency-plan/contingency-plan-card/ContingencyPlanCard')
          //   .default
        }
      ]
    },
    {
      path: 'risk-planar/risks/:id',
      redirect: 'risk-planar/risks/:id/scl',
      component: require('@/pages/management/risk/RiskDetail').default,
      props: {
        routePath:
          'contingency-monitoring-graph/planar-graph/risk-planar-graph',
        secondUrl: 'contingency-monitoring-graph'
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
