export default {
  path: 'policy', // 政策下放
  name: 'policy',
  redirect: 'policy/policy-list',
  component: {
    render(c) { return c('router-view') }
  },
  children: [
    {
      path: 'policy-list',
      name: 'policy-list',
      component: require('@/pages/management/policy/Policies').default
    },
    {
      path: 'new',
      name: 'new-policy',
      component: require('@/pages/management/policy/New').default
    },
    {
      path: ':id',
      name: 'policy-detail',
      component: require('@/pages/management/policy/Detail').default
    },
    {
      path: ':id/edit',
      name: 'edit-policy',
      component: require('@/pages/management/policy/New').default
    },
  ]
}
