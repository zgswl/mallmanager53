// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import MyServerHttp from '@/pluginx/http.js'

import axios from 'axios'

// 不要忘记引入css文件
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'

import router from './router'
Vue.prototype.$http = axios

// 适用Vue插件
Vue.use(ElementUI)
Vue.use(MyServerHttp)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
