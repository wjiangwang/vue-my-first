// 安全知识库
export default {
  path: 'safety-repository',
  redirect: 'safety-repository/repository',
  component: { render(c) { return c('router-view') } },
  children: [
    {
      path: 'repository',
      component: require('@/pages/enterprise/safety-repository/Repository').default
    },
    {
      path: 'repository-detail/:id',
      component: require('@/pages/enterprise/safety-repository/RepositoryDetail').default
    },
  ]
}
