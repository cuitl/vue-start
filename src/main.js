import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import VueCompositionAPI from '@vue/composition-api'
import { createApp } from '@vue/composition-api'

Vue.use(VueCompositionAPI)

Vue.config.productionTip = false

Vue.prototype.$alert = function (msg) {
  console.debug(msg)
}

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')

// createApp({
//   router,
//   store,
//   render: h => h(App)
// }).mount('#app')

createApp({
  router,
  store,
  ...App
}).mount('#app')
