export default {
  path: 'setting', // 系统设置
  name: 'setting',
  redirect: 'setting/users',
  component: {
    render(c) { return c('router-view') }
  },
  children: [
    {
      path: 'users',
      name: 'system-user',
      component: require('@/pages/management/setting/admin-user/Users').default
    },
    {
      path: 'roles',
      name: 'system-role',
      component: require('@/pages/management/setting/admin-role/Roles').default
    }
  ]
}
