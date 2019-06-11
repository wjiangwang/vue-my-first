export default {
  path: 'major-hazard',
  name: 'major-hazard',
  redirect: 'major-hazard/hazard-list',
  component: {
    render(c) { return c('router-view') }
  },
  meta: {
    title: '重大危险源管理系统',
    nav: true
  },
  children: [
    {
      path: 'hazard-list',
      // component: require('@/pages/group/major-hazard/MajorHazard').default,
      component: require('@/pages/management/major-hazard/MajorHazard').default,
      props: { isGroup: true },
      meta: {
        title: '危险源管理',
        nav: true
      }
    }
    // {
    //   path: 'record-list',
    //   // component: require('@/pages/group/major-hazard/MajorHazardApprove').default,
    //   component: require('@/pages/management/major-hazard/MajorHazard').default,
    //   props: { isRecord: true, isGroup: true },
    //   meta: {
    //     title: '危险源备案审批',
    //     nav: true
    //   }
    // },
    // {
    //   path: 'cancel-list',
    //   // component: require('@/pages/group/major-hazard/MajorHazardApprove').default,
    //   component: require('@/pages/management/major-hazard/MajorHazard').default,
    //   props: { isCancel: true, isGroup: true },
    //   meta: {
    //     title: '危险源核销审批',
    //     nav: true
    //   }
    // }
  ]
}
