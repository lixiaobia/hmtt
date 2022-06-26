import Vue from 'vue'
import Vant, { Lazyload } from 'vant'// 组件库
Vue.use(Lazyload)
// Vue.use(Button)
Vue.use(Vant)

Vue.use(Lazyload, {
  preLoad: 0.8, // 预载高度比例
  error: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.zhimg.com%2Fv2-fc044a235e2c25da02782af0d8cb0504_1200x500.jpg&refer=http%3A%2F%2Fpic4.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657457440&t=e222a7ca8212e6fe4af0213ef9ae22ed'
  // 错误的显示替换图片
})
