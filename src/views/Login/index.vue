<template>
  <div>
  <van-nav-bar
  title="黑马头条-登录"
/>
<van-form @submit="onSubmit">
  <van-field
    v-model="user.mobile"
    required
    name="mobile"
    label="手机号"
    placeholder="请输入手机号"
    :rules="[{ required: true, message: '请填写正确手机号', pattern:/^1[3-9]\d{9}$/}]"
  />
  <van-field
    v-model="user.code"
    required
    type="password"
    name="code"
    label="密码"
    placeholder="请填写密码"
    :rules="[{ required: true, message: '请填正确写密码' ,pattern:/^\d{6}$/}]"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit"
    :loading= "isLoading"
    :disabled="isLoading"
    loading-text="加载中..."
    >登录</van-button>
  </div>
</van-form>
  </div>
</template>

<script>
// 登录接口 提交表单时候才发送请求
import { loginAPI } from '@/api'
// 登录提示
// import { Notify } from 'vant'
import Notify from '@/ui/Notify.js'
// token存储
import { setToken } from '@/utils/token'
import { setStorages } from '@/utils/storage'
export default {
  name: 'login',
  data () {
    return {
      user: {
        mobile: '13888888888', // 手机号
        code: '246810'// 验证码246810
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit (val) {
      this.isLoading = true
      // console.log('submit', val)
      try {
        const res = await loginAPI(this.user)
        console.log(res)
        Notify({ type: 'success', message: '登录成功' })
        // 登录成功存储token到本地
        setToken(res.data.data.token)
        // 同时保存一个自动更新token的在本地
        setStorages('refresh_token', res.data.data.refresh_token)
        // 登录成功进行跳转
        // push跳转后, 可以返回 -
        // replace跳转后, 无法返回
        this.$router.replace({
          path: this.$route.query.path || '/layout/home'
        })
      } catch (error) {
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang='less' scoped>
.van-nav-bar{
  background-color: #007bff;
};
/* /deep/ 就是把data-v-hash值选择器写到类名的前面 */
/deep/ .van-nav-bar__title{
  color: white;
}
</style>
