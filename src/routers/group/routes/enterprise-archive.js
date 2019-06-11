export default {
  path: 'enterprise-archive',
  name: 'enterprise-archive',
  redirect: 'enterprise-archive/list',
  component: {
    render(c) { return c('router-view') }
  },
  meta: {
    title: '一企一档',
    nav: true
  },
  children: [
    {
      path: 'list', // 企业列表
      component: require('@/pages/group/Enterprises').default
    },
    {
      path: 'new', // 新增企业表单页面
      name: 'new-enterprise',
      component: require('@/pages/management/enterprise-archive/EnterpriseForm').default,
      props: { isGroup: true }
    },
    {
      path: ':enterpriseId/planar-graph',
      name: 'enterprise-planar-graph',
      component: require('@/pages/management/enterprise-archive/RiskPlanarGraph').default,
      props: { isGroup: true }
    },
    {
      path: 'list/:id', // 企业详情
      redirect: 'list/:id/basic-info',
      name: 'enterprise-detail',
      component: require('@/pages/management/enterprise-archive/EnterpriseDetail').default, // 参考以前政府端的企业详情有一个嵌套布局
      props: { isGroup: true },
      children: [
        {
          path: 'basic-info',
          name: 'enterprise-info',
          component: require('@/pages/management/enterprise-archive/EnterpriseInfo').default
        },
        {
          path: 'safety-info',
          name: 'enterprise-safety-info',
          component: require('@/pages/management/enterprise-archive/EnterpriseSafetyInfo').default
        },
        {
          path: 'certifications',
          name: 'enterprise-certifications',
          component: require('@/pages/management/enterprise-archive/EnterpriseCertifications').default
        },
        {
          path: 'employees',
          name: 'enterprise-employees',
          component: require('@/pages/management/enterprise-archive/EnterpriseEmployees').default
        },
        {
          path: 'risk-assessments',
          name: 'enterprise-risk-assessments',
          component: require('@/pages/management/enterprise-archive/EnterpriseRiskAssessments').default
        },
        {
          path: 'risk-grade',
          name: 'enterprise-risk-grade',
          component: require('@/pages/management/enterprise-archive/EnterpriseRiskGrade').default
        }
        // other children
      ]
    },
    {
      path: '/enterprise-archives/:enterpriseId/risk-assessments/:id/items',
      name: 'enterprise-risk-items',
      component: require('@/pages/management/enterprise-archive/RiskAssessmentItems').default,
      props: { isGroup: true }
    }
  ]
}
