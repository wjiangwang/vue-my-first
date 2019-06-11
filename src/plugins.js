import Vue from 'vue'
import Vuebar from 'vuebar'
import ElementUI from 'element-ui'
import VueResize from 'vue-resize'

import 'element-ui/lib/theme-chalk/index.css'
import 'vue-resize/dist/vue-resize.css'

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import dayjs from 'dayjs'

Vue.use(Vuebar)
Vue.use(ElementUI)
Vue.use(VueResize)

const requireComponent = require.context(
  './components/inputs',
  false,
  /[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(
    camelCase(
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )

  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

Vue.filter('strftime', (value, format = 'YYYY-MM-DD') => {
  if (!value) return ''

  return dayjs(value).format(format)
})

Vue.filter('riskLevel', value => {
  switch (value) {
  case 1:
    return '重大风险'
  case 2:
    return '较大风险'
  case 3:
    return '一般风险'
  case 4:
    return '低风险'
  }
})

Vue.filter('hiddenDangerLevel', value => {
  switch (value) {
  case 0:
    return '无'
  case 1:
    return '重大隐患'
  case 2:
    return '一般隐患'
  }
})

Vue.prototype.$resolveRoutePath = function(path) {
  return `/${this.$route.meta.primaryNavPath}/${path}`
}

Vue.config.productionTip = false
