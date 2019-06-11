export default {
  name: 'emergency-rescue',
  title: '应急救援',
  menus: [
    {
      moduleName: 'emergency-rescue-map',
      title: '应急救援一张图'
    },
    {
      moduleName: 'contingency-plan',
      title: '企业预案'
    },
    {
      moduleName: 'contingency-plan-card',
      title: '应急处置卡'
    },
    {
      moduleName: 'contingency-evacuation-graph',
      title: '应急疏散图'
    },
    {
      moduleName: 'contingency-monitoring-graph',
      title: '监控应急图'
    },
    {
      moduleName: 'contingency-resource-management',
      title: '应急资源管理'
    },
    {
      moduleName: 'contingency-drill',
      title: '应急演练'
    },
    // {
    //   moduleName: 'contingency-accident-report',
    //   title: '事故报送'
    // },
    {
      moduleName: 'contingency-accident-statistics',
      title: '事故管理'
    },
    {
      moduleName: 'enterprise-planar-graph',
      title: '企业总平面布局图',
      external: true
    },
    {
      moduleName: 'safety-repository',
      title: '安全知识库',
      external: true
    }
  ]
}
