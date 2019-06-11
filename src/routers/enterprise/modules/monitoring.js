// 监控模块
export default {
  path: 'monitoring',
  redirect: 'monitoring/monitor',
  component: { render(c) { return c('router-view') } },
  children: [
    {
      path: 'monitor',
      component: require('@/pages/enterprise/hidden-danger-controls/monitor/Monitor').default
    },
    {
      path: 'equipment/:id',
      component: require('@/pages/enterprise/hidden-danger-controls/monitor/MonitorEquipment').default
    }
  ]
}
