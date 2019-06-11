// 应急资源管理
export default {
  path: 'contingency-resource-management',
  redirect: 'contingency-resource-management/rescue-team',
  component: require('@/pages/enterprise/contingency-resource-management/Layout')
    .default,
  children: [
    {
      path: 'rescue-team',
      component: require('@/pages/enterprise/contingency-resource-management/rescue-team/RescueTeam')
        .default
    },
    {
      path: 'rescue-expert',
      component: require('@/pages/enterprise/contingency-resource-management/RescueExpert')
        .default
    },
    {
      path: 'rescue-resource',
      component: require('@/pages/enterprise/contingency-resource-management/RescueResource')
        .default
    },
    {
      path: 'rescue-nearby',
      component: require('@/pages/enterprise/contingency-resource-management/RescueNearby')
        .default
    }
  ]
}
