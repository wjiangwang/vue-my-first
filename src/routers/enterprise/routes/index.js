import { omit, cloneDeep } from 'lodash'

export default [
  'enterprise-info',
  'risk-control',
  'safety-training',
  'major-hazard-management',
  'production-standardization',
  'real-time-monitoring',
  'emergency-rescue'
].map(primaryNav => {
  const config = require(`./${primaryNav}`).default
  const route = {
    path: config.name,
    name: config.name,
    component: {
      render(c) { return c('router-view') }
    },
    meta: {
      primaryNav: true,
      title: config.title,
      icon: require(`@/assets/icons/nav/${config.name}.png`)
    }
  }

  if (config.menus) {
    const children = config.menus.map(menu => {
      const options = Object.assign({}, omit(menu, 'moduleName'), {
        primaryNavPath: config.name,
        icon: require(`@/assets/icons/nav/secondary/${menu.moduleName}.png`)
      })

      const childRoute = cloneDeep(require(`../modules/${menu.moduleName}`).default)
      mergeRouteMeta(childRoute, options)
      return childRoute
    })

    Object.assign(route, {
      redirect: `/${config.name}/${children[0].path}`,
      children
    })
  }

  return route
})

function mergeRouteMeta(route, meta) {
  route.meta = Object.assign({}, route.meta || {}, meta)
  if (route.children && route.children.length > 0)
    route.children.forEach(child => mergeRouteMeta(child, meta))
}
