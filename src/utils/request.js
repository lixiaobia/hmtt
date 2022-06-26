// 封装axios请求模块
import ajax from 'axios'
import router from '@/router'
// import { Notify } from 'vant'
import Notify from '@/ui/Notify.js'
import { getToken, removeToken } from './token' // setToken,
// import { refreshTokenAPI } from '@/api'
const axios = ajax.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 20000 // 请求时间限制
})
// 请求响应拦截器
// 请求拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, async function (error) {
  console.dir(error)
  if (error.response.status === 401) {
    Notify({ type: 'danger', message: '身份已过期' })
    // 先清除token 让路由守卫失效
    removeToken()
    // 方法1 从新登录  router.replace('/login')
    // 方法2 后天自动更新token
    // const res = await refreshTokenAPI()
    // console.log(res)
    // // 更新本地token
    // setToken(res.data.data.token)
    // // 更新新的token在请求头里
    // error.config.headers.Authorization = res.data.data.token
    // // 吧未完成的请求再发一次
    // return axios(error.config)
    router.replace(`/login?path=${router.currentRoute.fullPath}`)
  }
  // Do something with response error
  return Promise.reject(error)
})
// 导出自定义函数, 参数对象解构赋值
export default ({ url, method = 'GET', data = {}, headers = {}, params = {} }) => {
  return axios({
    url,
    method,
    data,
    headers,
    params
  })
}
