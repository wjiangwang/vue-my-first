export default {
  path: 'safety-training', // 安全教育培训系统
  name: 'safety-training',
  redirect: 'safety-training/database',
  component: {
    render(c) { return c('router-view') }
  },
  children: [
    {
      path: 'database',
      name: 'safety-training-database',
      component: require('@/pages/management/training/Trainings').default
    },
    {
      path: 'new',
      name: 'safety-training-new',
      component: require('@/pages/management/training/Edit').default
    },
    {
      path: ':id/edit',
      name: 'safety-training-edit',
      component: require('@/pages/management/training/Edit').default
    }
  ]
}
