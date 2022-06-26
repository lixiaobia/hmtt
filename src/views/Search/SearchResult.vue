<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check='false'
      >
        <ArticleItem
          v-for="obj in articList"
          :key="obj.art_id"
          :Itemobj="obj"
          :isShow="false"
          @click.native="itemClickFn(obj.art_id)"
        >
        </ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import { searchAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem.vue'
export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1, // 页码
      articList: [], // 文章列表
      loading: false, // 加载更多
      finished: false// 加载完成
    }
  },
  async created () {
    const res = await searchAPI({
      page: this.page,
      q: this.$route.params.kw // 搜索关键词
    })
    console.log(res)
    this.articList = res.data.data.results
  },
  components: {
    ArticleItem
  },
  methods: {
    async  onLoad () {
      // 判断是否有数据 有数据在加载
      if (this.articList.length > 0) {
        //   页码加1 请求下一页
        this.page++
        // 发送数据请求 拿下一页的数据
        const res = await searchAPI({
          page: this.page,
          q: this.$route.params.kw // 搜索关键词
        })
        // 数据加载完就不用合并了 所以在这里判断
        if (res.data.data.results.length === 0) {
          this.finished = true
          return
        }
        console.log(res)
        // 数据进行合并
        this.articList = [...this.articList, ...res.data.data.results]
        // 数据更新完不用继续加载
        this.loading = false
      }
    },
    itemClickFn (id) {
      // console.log(123)
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
/deep/.van-nav-bar__left i {
  color: #fff;
}
.van-nav-bar {
  background-color: #007bff;
}
</style>
