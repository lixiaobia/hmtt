<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check='false'
      @load="onLoad"
       offset="50"
    >
      <!-- immediate-check 是否在初始化时立即执行滚动位置检查 -->
      <ArticleItem
        v-for="(obj,index) in list"
        :key="index"
        :Itemobj="obj"
        @diselikeEv="diselikeFn"
        @reportEv="reportFn"
        @click.native="itemClickFn(obj.art_id)"
      ></ArticleItem>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import { articlesListAPI, dislikesArticleAPI, reportsArticleAPI } from '@/api'
// import { Notify } from 'vant'
import Notify from '@/ui/Notify.js'
export default {
  props: {
    // list: Array
    channelId: Number
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      theTime: new Date().getTime(),
      isLoading: false
    }
  },
  components: {
    ArticleItem
  },
  async created () {
    this.getArticleListFn()
  },
  methods: {
    // 封装专门发请求的函数
    async getArticleListFn () {
      const res = await articlesListAPI({
        channelId: this.channelId, // 默认推荐频道(id为0)
        timestamp: this.theTime
      })

      this.list = [...this.list, ...res.data.data.results]
      // 请求前一页历史数据的时间戳  通过时间戳进行分页
      this.theTime = res.data.data.pre_timestamp
      this.loading = false
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }
      this.loading = false
    },
    async onLoad () {
      if (this.list.length === 0) {
        this.loading = false
      }
      this.getArticleListFn()
    },
    async onRefresh () {
      this.list = []
      this.theTime = new Date().getTime()
      this.getArticleListFn()
      // 顶部加载状态改为false
      this.isLoading = false
    },
    // 不感兴趣的函数
    async diselikeFn (id) {
      try {
        await dislikesArticleAPI({
          artId: id
        })
        Notify({ type: 'success', message: '反馈成功' })
      } catch (error) {
        Notify({ type: 'warning', message: '反馈失败-联系程序员' })
      }
    },
    async reportFn (id, value) {
      try {
        await reportsArticleAPI({
          artId: id,
          value: value
        })
        Notify({ type: 'success', message: '反馈成功' })
      } catch (error) {
        Notify({ type: 'warning', message: '反馈失败-联系程序员' })
      }
    },
    itemClickFn (id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    }
  }
}

</script>

<style>
</style>
