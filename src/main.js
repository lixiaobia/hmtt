import '@/utils/log.js'// 上线的时候去掉console.log();
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'// 适配
import './vantcomp.js'
import 'vant/lib/index.css'
import 'highlight.js/styles/default.css' // 代码高亮的样式
import directiveObj from '@/utils/directive.js'
import axios from 'axios'
Vue.config.productionTip = false
Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

axios.get('/api/nc/article/headline/T1348647853363/0-40.html').then((res) => {
  console.log(res)
})
