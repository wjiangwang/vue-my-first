// 应急演练
export default {
  path: 'contingency-drill',
  redirect: 'contingency-drill/drill-plan',
  component: require('@/pages/enterprise/contingency-drill/Layout').default,
  children: [
    {
      path: 'drill-plan',
      component: require('@/pages/enterprise/contingency-drill/DrillPlan')
        .default
    },
    {
      path: 'drill-record',
      component: require('@/pages/enterprise/contingency-drill/DrillRecord')
        .default
    },
    {
      path: 'drill-summary',
      component: require('@/pages/enterprise/contingency-drill/DrillSummary')
        .default
    }
  ]
}
