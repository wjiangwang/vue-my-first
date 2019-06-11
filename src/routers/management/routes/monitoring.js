export default {
  path: 'monitoring', // 实时监控系统
  name: 'monitoring',
  redirect: 'monitoring/early-warnings',
  component: {
    render(c) { return c('router-view') }
  },
  children: [
    {
      path: 'early-warnings',
      name: 'monitoring-early-warnings',
      meta: {
        title: '预警监控',
        nav: true
      }
    },
    {
      path: 'videos',
      name: 'monitoring-videos',
      meta: {
        title: '视频监控',
        nav: true
      }
    }
  ]
}
