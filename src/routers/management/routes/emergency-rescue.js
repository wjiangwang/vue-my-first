export default {
  path: 'emergency-rescue', // 应急救援系统
  name: 'emergency-rescue',
  redirect: 'emergency-rescue/accidents',
  component: {
    render(c) {
      return c('router-view')
    }
  },
  children: [
    {
      path: 'accidents', // 事故管理
      name: 'emergency-rescue-accidents',
      component: require('@/pages/enterprise/contingency-accident-report/accidentReport').default,
      props: { isManagement: true }
    },
    {
      path: 'resources', //资源管理
      name: 'emergency-rescue-resources',
      redirect: 'resources/rescue-team',
      component: require('@/pages/enterprise/contingency-resource-management/Layout').default,
      props: { isManagement: true },
      children: [
        {
          path: 'rescue-team',
          name: 'emergency-rescue-team',
          component: require('@/pages/enterprise/contingency-resource-management/rescue-team/RescueTeam').default,
          props: { isManagement: true }
        },
        {
          path: 'rescue-expert',
          name: 'emergency-rescue-expert',
          component: require('@/pages/enterprise/contingency-resource-management/RescueExpert').default,
          props: { isManagement: true }
        },
        {
          path: 'rescue-resource',
          name: 'emergency-rescue-resource',
          component: require('@/pages/enterprise/contingency-resource-management/RescueResource').default,
          props: { isManagement: true }
        },
        {
          path: 'rescue-nearby',
          name: 'emergency-rescue-nearby',
          component: require('@/pages/enterprise/contingency-resource-management/RescueNearby').default,
          props: { isManagement: true }
        }
      ]
    },
    {
      path: 'plans', //应急预案
      name: 'emergency-rescue-plans',
      component: require('@/pages/management/contingency/ManagementRescuePlans').default,
      props: { isManagement: true },
      children: [
        {
          path: ':enterpriseId/detail',
          name:'emergency-rescue-plans-detail',
          component: require('@/pages/management/contingency/ContingencyPlan').default,
          props: { isManagement: true, canEdit: false }
        }
      ]
    },
    {
      path: 'manoeuvres', //应急救援演练
      name: 'emergency-rescue-manoeuvres',
      component: require('@/pages/management/contingency/ManagementManoeuvres').default,
      props: { isManagement: true },
      children: [
        {
          path: ':enterpriseId/detail',
          name: 'emergency-rescue-manoeuvres-detail',
          redirect: ':enterpriseId/detail/drill-plan',
          component: require('@/pages/enterprise/contingency-drill/Layout.vue').default,
          props: { isManagement: true, canEdit: false },
          children: [
            {
              path: 'drill-plan',
              name:'emergency-drill-plan',
              component: require('@/pages/enterprise/contingency-drill/DrillPlan').default,
              props: { isManagement: true }
            },
            {
              path: 'drill-record',
              name:'emergency-drill-record',
              component: require('@/pages/enterprise/contingency-drill/DrillRecord').default,
              props: { isManagement: true }
            },
            {
              path: 'drill-summary',
              name: 'emergency-drill-summary',
              component: require('@/pages/enterprise/contingency-drill/DrillSummary').default,
              props: { isManagement: true }
            }
          ]
        }
      ]
    }
  ]
}
