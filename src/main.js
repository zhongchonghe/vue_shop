import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/font/iconfont.css'

import './assets/css/global.css'

Vue.prototype.$axios = axios

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config.headers.Authorization);
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

