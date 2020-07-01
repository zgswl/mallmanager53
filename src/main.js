// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// MyBread其实就是组件选项的对象
import MyBread from '@/components/cuscom/myBread.vue'

import MyServerHttp from '@/pluginx/http.js'
import moment from 'moment'

import axios from 'axios'

// 不要忘记引入css文件
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'

// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'

import router from './router'
Vue.prototype.$http = axios

// 适用Vue插件
Vue.use(ElementUI)
Vue.use(MyServerHttp)

Vue.config.productionTip = false

Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

// 全局自定义组件
Vue.component(MyBread.name, MyBread)
// 组件全局注册 表格树
Vue.component('tree-table', TreeTable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
