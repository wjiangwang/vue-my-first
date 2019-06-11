export default {
  path: 'safety-repository', // 安全知识系统
  name: 'safety-repository',
  redirect: 'safety-repository/repository-base',
  component: {
    render(c) { return c('router-view') }
  },
  children: [
    {
      path: 'repository-base', // 知识库菜单
      name: 'safety-repository-base',
      component: require('@/pages/management/repository/RepositoryMenu').default,
    },
    {
      path: 'repository-msds', // msds
      name: 'safety-repository-msds',
      component: require('@/pages/management/repository/Repositorys').default
    }
  ]
}
