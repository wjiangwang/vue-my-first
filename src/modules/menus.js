const buildIcon = (menu) => {
  const iconName = menu.icon
  menu.icon = require(`@/assets/icons/nav-menu/${iconName}.png`)
  menu.iconHighlight = require(`@/assets/icons/nav-menu/${iconName}-highlight.png`)
  return menu
}

const buildIconTwo = (menu) => {
  const iconName = menu.icon
  menu.icon = require(`@/assets/icons/nav-menu/nav/${iconName}.png`)
  menu.iconHighlight = require(`@/assets/icons/nav-menu/nav/${iconName}-highlight.png`)
  return menu
}

// const managementMenuItems = [
//   {
//     name: '首页',
//     icon: 'home',
//     code: 'homePage-security',
//     route: { path: '/dashboard' }
//   },
//   {
//     name: '电子地图',
//     tag: '安全风险一张图',
//     icon: 'map',
//     code: 'map-show',
//     tag: '安全风险一张图',
//     route: { path: '/emap' }
//   },
//   {
//     name: '一企一档',
//     icon: 'archive',
//     code: 'coCompanyInfo-list',
//     route: { path: '/enterprise-archives' }
//   },
//   {
//     name: '教育培训',
//     icon: 'training',
//     code: 'trainingEducation-list',
//     route: { path: '/trainings' }
//   },
//   {
//     name: '政策下放',
//     icon: 'policy',
//     code: 'policyUnder-list',
//     route: { path: '/policies' }
//   },
//   {
//     name: '系统设置',
//     icon: 'setting',
//     code: 'system',
//     route: { path: '/setting' },
//     items: [
//       {
//         name: '企业端用户管理',
//         code: 'companyUser-list',
//         route: { name: 'enterprise-user-index' }
//       },
//       {
//         name: '管理端用户管理',
//         code: 'user-list',
//         route: { name: 'admin-users' }
//       },
//       {
//         name: '管理端角色管理',
//         code: 'permissions-list',
//         route: { name: 'admin-roles' }
//       },
//       {
//         name: '导入设置',
//         route: { name: 'import-setting' }
//       }
//     ]
//   }
// ].map(buildIcon)

const managementMenuItems = [
  {
    name: '首页',
    icon: 'dashboard',
    code: 'dashboard',
    route: { path: '/dashboard' }
  },
  {
    name: '风险管控及隐患排查系统',
    icon: 'risk-gis',
    code: 'risk-gis',
    route: { path: '/risk-gis' }
  },
  {
    name: '一企一档',
    icon: 'enterprise-archives',
    code: 'enterprise-archives',
    route: { path: '/enterprise-archives' }
  },
  {
    name: '重大危险源管理系统',
    icon: 'major-hazard',
    code: 'major-hazard',
    route: { path: '/major-hazard' },
    items: [
      {
        name: '危险源管理',
        code: 'major-hazard-list',
        route: { name: 'major-hazard-list' }
      },
      {
        name: '危险源备案审批',
        code: 'major-hazard-record',
        route: { name: 'major-record-list' }
      },
      {
        name: '危险源核销审批',
        code: 'major-hazard-cancel',
        route: { name: 'major-cancel-list' }
      }
    ]
  },
  {
    name: '应急救援系统',
    icon: 'emergency-rescue',
    code: 'emergency-rescue',
    route: { path: '/emergency-rescue' },
    items: [
      {
        name: '事故管理',
        code: 'emergency-rescue-accidents',
        route: { name: 'emergency-rescue-accidents' }
      },
      {
        name: '资源管理',
        code: 'emergency-rescue-resources',
        route: { name: 'emergency-rescue-resources' }
      },
      {
        name: '应急预案',
        code: 'emergency-rescue-plans',
        route: { name: 'emergency-rescue-plans' }
      },
      {
        name: '应急救援演练',
        code: 'emergency-rescue-manoeuvres',
        route: { name: 'emergency-rescue-manoeuvres' }
      }
    ]
  },
  {
    name: '安全教育培训系统',
    icon: 'safety-training',
    code: 'safety-training',
    route: { path: '/safety-training' },
    items: [
      {
        name: '资料库管理',
        code: 'safety-training-database',
        route: { name: 'safety-training-database' }
      }
    ]
  },
  {
    name: '政策下放',
    icon: 'policy',
    code: 'policy',
    route: { path: '/policy' }
  },
  {
    name: '行政执法系统',
    icon: 'enforcement',
    code: 'enforcement',
    route: { path: '/enforcement' }
  },
  {
    name: '安全知识系统',
    icon: 'safety-repository',
    code: 'safety-repository',
    route: { path: '/safety-repository' },
    items: [
      {
        name: '知识库管理',
        code: 'safety-repository-base',
        route: { name: 'safety-repository-base' }
      }
    ]
  },
  {
    name: '实时监控系统',
    icon: 'monitoring',
    code: 'monitoring',
    route: { path: '/monitoring' }
  },
  {
    name: '系统设置',
    icon: 'setting',
    code: 'setting',
    route: { path: '/setting' },
    items: [
      {
        name: '用户管理',
        code: 'system-user-list',
        route: { name: 'system-user' }
      },
      {
        name: '角色管理',
        code: 'system-role-list',
        route: { name: 'system-role' }
      }
    ]
  }
].map(buildIconTwo)

const enterpriseMenuItems = [
  {
    name: '首页',
    icon: 'e-home',
    route: { path: '/dashboard' }
  },
  {
    name: '企业基本信息',
    icon: 'e-basic-info',
    route: { path: '/information' },
    items: [
      {
        name: '企业基础信息',
        route: { name: 'basic-info' }
      },
      {
        name: '安全生产信息',
        route: { name: 'safety-info' }
      },
      {
        name: '资质许可证信息',
        route: { name: 'certifications' }
      },
      {
        name: '企业人员信息',
        route: { name: 'employees' }
      },
      {
        name: '整体风险',
        route: { name: 'risk-grade' }
      },
      {
        name: '企业配置',
        route: { name: 'hierarchy-setting' }
      }
    ]
  },
  {
    name: '风险辨识评估',
    icon: 'e-risk-assessment',
    route: { path: '/risk-assessments' }
  },
  {
    name: '风险四色分布图',
    icon: 'e-risk-planar',
    route: { path: '/risk-planar' }
  },
  {
    name: '风险管控台账',
    icon: 'e-risk-control',
    route: { path: '/risk-controls' }
  },
  {
    name: '隐患治理台账',
    icon: 'e-hidden-danger',
    route: { path: '/hidden-danger-controls' }
  },
  {
    name: '用户管理',
    icon: 'e-user',
    route: { path: '/users' }
  }
].map(buildIcon)

export default {
  managementMenuItems,
  enterpriseMenuItems
}
