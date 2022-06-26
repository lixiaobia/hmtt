<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card" >
      <!-- 用户头像、姓名 -->
      <van-cell >
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="user.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{user.name}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{user.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{user.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{user.like_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit"/>
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="quitFn"/>
    </van-cell-group>
  </div>
</template>

<script>
import { getUserinfoAPI } from '@/api'// 获取用户自己信息
import { Dialog } from 'vant'
import { removeToken } from '@/utils/token.js'
export default {

  data () {
    return {
      user: {}// 自己信息
    }
  },
  async activated () {
    const res = await getUserinfoAPI()
    console.log(res)
    this.user = res.data.data
  },
  methods: {
    // 退出登录
    quitFn () {
      Dialog.confirm({
        title: '是否确定退出登录',
        message: '这就走了，不多看一眼么？'
      }).then(() => {
        // 确定退出后 跳转到登录页 然后清空本地token
        removeToken()
        this.$router.replace('/login')
        // on confirm
      }).catch(() => {
        // on cancel
      })
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
