// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins'

import GroupApp from './GroupApp'
import store from './stores/group'
import router from './routers/group'

/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  store,
  router,
  components: { GroupApp },
  template: '<GroupApp/>'
})
