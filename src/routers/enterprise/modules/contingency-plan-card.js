// 应急处置卡
export default {
  path: 'contingency-plan-card',
  name:'enterprise-contingency-plan-card',
  redirect: 'contingency-plan-card/contingency-plan-card',
  component: require('@/pages/enterprise/contingency-plan/contingency-plan-card/Layout').default,
  children: [
    {
      path: 'contingency-plan-card',
      component: require('@/pages/enterprise/contingency-plan/contingency-plan-card/ContingencyPlanCard').default
    },
    {
      path: 'detail/:id',
      name:'contingency-plan-card-detail',
      redirect: 'detail/:id/card',
      component: require('@/pages/enterprise/contingency-plan/contingency-plan-card/PlanCardDetail').default,
      children: [
        {
          name:'plan-card',
          path: 'card',
          component: require('@/pages/enterprise/contingency-plan/contingency-plan-card/PlanCardForm').default,
          props:{isEdit:true}
        },
        {
          name:'plan-card-scl',
          path: 'scl',
          component: require('@/pages/management/risk/RiskSCL').default
        },
        {
          name:'plan-card-jha',
          path: 'jha',
          component: require('@/pages/management/risk/RiskJHA').default
        },
        {
          name:'plan-card-risk-controls',
          path: 'risk-controls',
          component: require('@/pages/management/risk/RiskControls').default
        },
        {
          name:'plan-card-hidden-danger-controls',
          path: 'hidden-danger-controls',
          component: require('@/pages/management/risk/HiddenDangerControls').default
        },
        {
          name:'plan-card-monitoring-equipment',
          path: 'monitoring-equipment',
         // component: require('@/pages/management/risk/EnterpriseRiskGrade').default
        },
      ]
    }
  ]
}
