const adminMenus = [
  {
    name: '首页',
    icon: 'home',
    route: { path: '/dashboard' }
  },
  {
    name: '电子地图',
    tag: '安全风险一张图',
    icon: 'map',
    route: { path: '/emap' }
  },
  {
    name: '一企一档',
    icon: 'archive',
    route: { path: '/enterprise-archives' }
  },
  {
    name: '教育培训',
    icon: 'training',
    route: { path: '/trainings' }
  },
  {
    name: '政策下放',
    icon: 'policy',
    route: { path: '/policies' }
  },
  {
    name: '系统设置',
    icon: 'setting',
    route: { path: '/setting' },
    items: [
      {
        name: '企业端用户管理',
        route: { name: 'enterprise-user-index' }
      },
      {
        name: '管理端用户管理',
        route: { name: 'admin-users' }
      },
      {
        name: '管理端角色管理',
        route: { name: 'admin-roles' }
      },
      {
        name: '导入设置',
        route: { name: 'import-setting' }
      }
    ]
  }
].map(menu => {
  const iconName = menu.icon
  menu.icon = require(`@/assets/icons/nav-menu/${iconName}.png`)
  menu.iconHighlight = require(`@/assets/icons/nav-menu/${iconName}-highlight.png`)
  return menu
})

const enterpriseMenus = [

]

export default {
  namespaced: true,

  state: {
    navMenus: {
      admin: adminMenus,
      enterprise: enterpriseMenus
    }
  },

  getters: {
    filteredNavMenus: state => roleName => {
      return state.navMenus[roleName]
    }
  }
}