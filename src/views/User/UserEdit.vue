<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="userProfile.photo"
            @click="imgClickFn"
          />
          <!-- file 选择框 -->
          <!-- 视觉上的隐藏 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userProfile.name"
        @click="uaseNameFn"
      />
      <van-cell title="生日" is-link :value="userProfile.birthday"
       @click="dataTimeshowFn"
      />
    </van-cell-group>

    <!-- 用户名弹出框 -->
    <van-dialog
      v-model="show"
      title="标题"
      show-cancel-button
      :before-close="beforeCloseFn"
    >
      <input type="text" v-fofo v-model="inputUserName" />
    </van-dialog>

   <van-popup v-model="dataTimeshow" position="bottom" :style="{ height: '30%' }" >
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="cancelFn"
      @confirm="confirmFn"
    />
  </van-popup>
  </div>
</template>

<script>
// 获取用户个人资料
import { userProfileAPI, updatePhotoAPI, updateProfileAPI } from '@/api'
// import { Notify } from 'vant'
import Notify from '@/ui/Notify.js'
import { dataTime } from '@/utils/date.js'
export default {
  // name: 'UserEdit',
  data () {
    return {
      userProfile: {}, // 用户资料
      show: false, // 用户名弹出框
      inputUserName: '', // 修改时的用户名
      dataTimeshow: false, // 生日面板
      minDate: new Date(1922, 0, 1), // 出生的最早时间
      maxDate: new Date(), // 出生的最大时间 应该为当前
      currentDate: new Date()// 当前时间 应该为出生日期
    }
  },
  name: 'UserEdit',
  async created () {
    // 获取用户个人资料
    const res = await userProfileAPI()
    // console.log(res)
    this.userProfile = res.data.data
  },
  methods: {
    // 修改头像
    async onFileChange (e) {
      if (e.target.files.length === 0) return
      // console.log(e.target.files[0])
      // 发数据请求
      const thefd = new FormData()
      thefd.append('photo', e.target.files[0])
      const res = await updatePhotoAPI(thefd)
      // console.log(res)
      this.userProfile.photo = res.data.data.photo
    },
    imgClickFn () {
      // JS模拟用户的点击事件 点击文件框file
      this.$refs.iptFile.click()
    },
    // 修改用户名
    uaseNameFn () {
      this.show = true
      this.inputUserName = this.userProfile.name
    },
    //  用户名 验证及是否确定修改
    async beforeCloseFn (action, done) {
      // actiond点击确认或者取消时返回的值
      // console.log(action)  确定confirm
      if (action === 'confirm') {
        // 判断 点击确定
        const res = /^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/
        // 正则
        if (res.test(this.inputUserName)) {
          // 判断用户名是否通过正则 通过就关闭弹窗
          await updateProfileAPI({
            name: this.inputUserName
          })
          // 后台数据请求修改成功 吧前端也要修改 用户名回显到页面
          this.userProfile.name = this.inputUserName
          done()
        } else {
          // 没通过就不关闭弹窗 并且给个提示
          // 提示用户
          Notify({ type: 'warning', message: '用户名中英文和数字1-7位' })
          // 阻止弹窗关闭
          done(false)
        }
      } else {
        // 否则就是取消  直接关闭即可
        done()
      }
    },
    dataTimeshowFn () {
      this.dataTimeshow = true
      this.currentDate = new Date(this.userProfile.birthday)
    },
    // 点击取消按钮触发
    cancelFn () {
      // 点击取消直接让面板隐藏
      this.dataTimeshow = false
    },
    // 点击确定按钮触发
    async confirmFn () {
      // 点击确定 获取当前选择的时间
      // 发送给后台
      await updateProfileAPI({
        // 这里要把字符串转换成后台需要的时间格式 格式'2018-12-20'
        birthday: dataTime(this.currentDate)
      })
      this.dataTimeshow = false// 隐藏面板
      // 页面回显
      this.userProfile.birthday = dataTime(this.currentDate)
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/ .van-dialog__content {
  text-align: center;
  input {
    padding: 0;
    border: none;
    outline: none;
    text-align: center;
  }
}
</style>
