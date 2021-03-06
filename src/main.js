// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import VeeValidate from 'vee-validate'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/css/global.css'

const moment = require('moment')
require('moment/locale/da')

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.use(VeeValidate)
Vue.use(require('vue-moment'), {
  moment
})
Vue.component('icon', Icon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
