<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- Object.keys()  --------------------------------检测对象返回一个数组 -->
 <van-loading size="24px" vertical color="#0094ff" v-if="Object.keys(artObj).length===0">加载中...</van-loading>
  <div v-else>
      <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{artObj.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="artObj.aut_name" :label="timeAgo(artObj.pubdate)">
        <template #icon>
          <img :src="artObj.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button type="info" size="mini"
             v-if="artObj.is_followed"
             @click="followedFn(true)"
             >已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain
            v-else
            @click="followedFn(false)"
            >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="artObj.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small"
        v-if="artObj.attitude === 1"
        @click='loveFn(true)'
        >
          >已点赞</van-button
        >
        <van-button icon="good-job-o" type="danger" plain size="small"
        v-else
        @click='loveFn(false)'
          >点赞</van-button
        >
      </div>
    </div>

  <!-- 评论区 -->
  <CommentList></CommentList>

  </div>
  </div>
</template>

<script>
import { detailAPI, followedUserAPI, unFollowedUserAPI, articleLikeAPI, articleDisLikeAPI } from '@/api'
import { timeAgo } from '@/utils/date.js'
import CommentList from './CommentList.vue'
export default {
  name: 'ArticleDetail',
  data () {
    return {
      artObj: {}
    }
  },
  async created () {
    const res = await detailAPI({
      id: this.$route.query.art_id
      // id: this.$route.params.art_id
    })
    console.log(res)
    this.artObj = res.data.data
  },
  methods: {
    timeAgo,
    // 对用户的 关注和取关函数
    async followedFn (bool) {
      if (bool === true) {
        // 点击了"已关注" ->  取消关注
        // 让已关注按钮隐藏
        this.artObj.is_followed = false
        // 发送取关请求
        await unFollowedUserAPI({
          artId: this.artObj.aut_id
        })
        // console.log(res)
      } else {
      // 点击了关注 ->  就是要关注
        // 让已关注按钮显示
        this.artObj.is_followed = true
        // 发送关注请求
        await followedUserAPI({
          artId: this.artObj.aut_id
        })
        // console.log(res)
      }
    },
    // 对文章的点赞和取消
    async loveFn (bool) {
      if (bool === true) {
        // 相当于点击了"已点赞" -> 取消点赞(显示点赞按钮)
        this.artObj.attitude = 0
        // 调用取消点赞接口
        await articleDisLikeAPI({
          artId: this.artObj.art_id
        })
      } else {
        // 相当于点击了"点赞" -> 要点赞(显示已点赞按钮)
        this.artObj.attitude = 1
        // 调用点赞接口
        await articleLikeAPI({
          artId: this.artObj.art_id
        })
      }
    }
  },
  components: {
    CommentList
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
.van-loading {
  text-align: center;
  padding-top: 46px;
}
</style>
