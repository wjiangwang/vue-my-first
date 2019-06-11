// 事故统计
export default {
  path: 'contingency-accident',
  redirect: 'contingency-accident/statistics',
  component: {
    render(c) {
      return c('router-view')
    }
  },
  children: [
    {
      path: 'statistics',
      name: 'contingency-accident-statistics',
      component: require('@/pages/enterprise/contingency-accident-statistics/accidentStatistics')
        .default
    },
    {
      path: 'report',
      name: 'contingency-accident-report',
      component: require('@/pages/enterprise/contingency-accident-report/accidentReport')
        .default
    }
  ]
}
