export default {
  name: 'risk-control',
  title: '双控概览',
  menus: [
    {
      moduleName: 'risk-dashboard',
      title: '数据分析'
    },
    {
      moduleName: 'risk-assessment',
      title: '风险辨识评估'
    },
    {
      moduleName: 'risk-control-book',
      title: '风险管控台账'
    },
    {
      moduleName: 'hidden-inspect-list',
      title: '隐患排查清单'
    },
    {
      moduleName: 'check-control-book',
      title: '隐患治理台账'
    },
    {
      moduleName: 'risk-promise-progress',
      title: '风控承诺进度'
    },
    {
      moduleName: 'history-promise-book',
      title: '历史承诺台账'
    },
    {
      moduleName: 'enterprise-risk-controls-graph',
      title: '风险四色图例'
    },

    {
      moduleName: 'enterprise-staff-certification',
      title: '岗位人员特证',
      external: true
    },
    {
      moduleName: 'enterprise-user',
      title: '人员配置',
      external: true
    },
    {
      moduleName: 'standing-book',
      title: '台账类',
      external: true
    }
  ]
}
