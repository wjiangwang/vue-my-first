// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins'

import ManagementApp from './ManagementApp'
import store from './stores/management'
import router from './routers/management'

/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  store,
  router,
  components: { ManagementApp },
  template: '<ManagementApp/>'
})
