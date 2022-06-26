<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="{
        'art-cmt-container-1': isShowCmt,
        'art-cmt-container-2': !isShowCmt,
      }"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check='false'
      >
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in list" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="obj.is_liking === true"
                @click="linkFn(true, obj)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="linkFn(false, obj)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ obj.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
        </div>
      </van-list>
    </div>

    <!-- 发表品论 -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCmt === true">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="targetShowFn">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
            <van-icon name="comment-o" size="0.53333334rem" @click="moveFn" />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          v-fofo
          placeholder="友善评论、理性发言、阳光心灵"
          @blur="blurFn"
          v-model.trim="comText"
        ></textarea>
        <van-button
          type="default"
          :disabled="comText.length === 0"
          @click="sendFn"
          >发布</van-button
        >
        <!-- comText输入的内容 有内容length不为0 就解除禁用-->
      </div>
    </div>
  </div>
</template>

<script>
import { commentListAPI, commentLikingAPI, uncommentLikingAPI, sendCommentAPI } from '@/api'
import { timeAgo } from '@/utils/date.js'
export default {
  data () {
    return {
      offset: null, // 评论偏移量
      list: [], // 后台所有的评论的内容
      totalCount: 0, // 评论的总数
      isShowCmt: true, // 是否显示评论框和输入框
      comText: '', // 每一条评论的内容
      lastId: null, // 分页
      loading: false,
      finished: false
    }
  },
  async created () {
    const res = await commentListAPI({
      id: this.$route.query.art_id
    })
    console.log(res)
    this.list = res.data.data.results
    this.totalCount = res.data.data.total_count
    this.lastId = res.data.data.last_id// 分页
    // 如果一开始就没有品论 就直接显示加载结束的文字
    if (this.list.length === 0) {
      this.finished = true
    }
  },
  methods: {
    timeAgo,
    async linkFn (bool, obj) {
      if (bool === true) {
        //   点击的当前状态是红色 喜欢 就表示要取消点亮红色
        obj.is_liking = false
        // 取消喜欢就调用取消点赞的接口
        await uncommentLikingAPI({
          artId: obj.com_id
        })
      } else {
        //   点击的当前状态是白色 不喜欢 就表示要点亮红色
        obj.is_liking = true
        // 点亮喜欢就调用点赞的接口
        await commentLikingAPI({
          artId: obj.com_id
        })
      }
    },
    targetShowFn () {
      this.isShowCmt = false
    },
    // 评论滑动
    async moveFn () {
      // 真实DOM都在document(所以不再一个vue文件内), 也是可以获取的
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 输入框 失去焦点
    blurFn () {
      //   点击发布事件  跟输入框失去焦点隐藏产生冲突  所以要加个定时器 延迟销毁 先把内容获取过来
      setTimeout(() => {
        this.isShowCmt = true
      }, 0)
    },
    // 点击发布事件
    async sendFn () {
      // 因为一点击发布 输入框就失去焦点  输入框就被销毁 文字还未来得及获取 跟输入框失去焦点隐藏产生冲突
      // console.log(this.comText)
      const res = await sendCommentAPI({
        id: this.$route.query.art_id, // 通过路由传过来的id
        content: this.comText
      })
      // console.log(res)
      // unshift追加到数组的最前面
      this.list.unshift(res.data.data.new_obj)
      // 数量+1
      this.totalCount++
      // 成功后, 清除输入框内容
      this.comText = ''
      this.moveFn()// 滚动到品论最上面
    },
    // 滚动加载更多评论
    async  onLoad () {
      // 有数据才能发送下一页的请求
      if (this.list.length > 0) {
        const res = await commentListAPI({
          id: this.$route.query.art_id,
          offset: this.lastId
        })
        // console.log(res)合并数据
        this.list = [...this.list, ...res.data.data.results]
        this.totalCount = res.data.data.total_count
        this.lastId = res.data.data.last_id// 分页

        if (this.lastId == null) {
          this.finished = true
        }

        this.loading = false
      } else {
        this.loading = false
      }
    }
  }

}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
