export default {
  path: 'enterprise-archives', // 一企一档
  name: 'enterprise-archives',
  redirect: 'enterprise-archives/list',
  component: {
    render(c) { return c('router-view') }
  },
  children: [
    {
      path: 'list', // 企业列表
      component: require('@/pages/management/enterprise-archive/Enterprises').default
    },
    {
      path: 'new', // 新增企业表单页面
      name: 'new-enterprise',
      component: require('@/pages/management/enterprise-archive/EnterpriseForm').default
    },
    {
      path: ':enterpriseId/planar-graph', // 风险平面图设置
      name: 'enterprise-planar-graph',
      component: require('@/pages/management/enterprise-archive/RiskPlanarGraph').default
    },
    {
      path: 'list/:id', // 企业详情
      redirect: 'list/:id/basic-info',
      name: 'enterprise-detail',
      component: require('@/pages/management/enterprise-archive/EnterpriseDetail').default, // 参考以前政府端的企业详情有一个嵌套布局
      children: [
        {
          path: 'basic-info', // 企业基本信息
          name: 'enterprise-info',
          component: require('@/pages/management/enterprise-archive/EnterpriseInfo').default
        },
        {
          path: 'safety-info', // 安全生产信息
          name: 'enterprise-safety-info',
          component: require('@/pages/management/enterprise-archive/EnterpriseSafetyInfo').default
        },
        {
          path: 'certifications', // 资质许可证
          name: 'enterprise-certifications',
          component: require('@/pages/management/enterprise-archive/EnterpriseCertifications').default
        },
        {
          path: 'employees', // 企业人员信息
          name: 'enterprise-employees',
          component: require('@/pages/management/enterprise-archive/EnterpriseEmployees').default
        },
        {
          path: 'risk-assessments', // 风险分级管控及隐患排查治理清单
          name: 'enterprise-risk-assessments',
          component: require('@/pages/management/enterprise-archive/EnterpriseRiskAssessments').default
        },
        {
          path: 'risk-grade', // 整体风险
          name: 'enterprise-risk-grade',
          component: require('@/pages/management/enterprise-archive/EnterpriseRiskGrade').default
        }
      ]
    },
    {
      path: '/enterprise-archives/:enterpriseId/risk-assessments/:id/items', // 风险辨识评估表、安全检查辨识表
      name: 'enterprise-risk-items',
      component: require('@/pages/management/enterprise-archive/RiskAssessmentItems').default
    }
  ]
}
