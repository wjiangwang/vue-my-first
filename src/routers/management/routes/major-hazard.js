export default {
  path: 'major-hazard',
  name: 'major-hazard',
  redirect: 'major-hazard/hazard-list',
  component: {
    render(c) { return c('router-view') }
  },
  children: [
    {
      path: 'hazard-list', // 危险源管理
      name: 'major-hazard-list',
      component: require('@/pages/management/major-hazard/MajorHazard').default
    },
    {
      path: 'record-list', // 危险源备案审批
      name: 'major-record-list',
      component: require('@/pages/management/major-hazard/MajorHazard').default,
      props: { isRecord: true, type: 1 },
    },
    {
      path: 'cancel-list', // 危险源核销审批
      name: 'major-cancel-list',
      component: require('@/pages/management/major-hazard/MajorHazard').default,
      props: { isCancel: true, type: 2 },
    }
  ]
}
