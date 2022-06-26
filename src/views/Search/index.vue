<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-fofo
        @input="inputFn"
        v-model.trim="kw"
        @search='searchFn'
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
        class="sugg-item"
        v-for="(str, index) in suggestList"
        :key="index"
        v-html="lightFn(str, kw)"
        @click="suggestFn(str)"
      ></div>

    </div>
       <!-- 搜索历史 -->
      <div class="search-history" v-else>
        <!-- 标题 -->
        <van-cell title="搜索历史">
          <!-- 使用 right-icon 插槽来自定义右侧图标 -->
          <template #right-icon>
            <van-icon name="delete" class="search-icon" @click="delFn"/>
          </template>
        </van-cell>

        <!-- 历史列表 -->
        <div class="history-list">
          <span class="history-item" v-for="(str,index) in history"
          :key="index"
          @click="historyFn(str)"
          >{{str}}</span>
        </div>
      </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api'
import { setStorages, getStorages } from '@/utils/storage'
export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null,
      suggestList: [],
      history: JSON.parse(getStorages('his')) || []// 搜索历史
    }
  },
  methods: {
    // 搜索框数据联想请求 防抖
    inputFn () {
      // 事件触发先清除定时器
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        //   防抖 延迟执行逻辑代码 事件再次触发时 清除上一个延时器
        this.timer = setTimeout(async () => {
          // console.log(this.kw)
          const res = await suggestListAPI({
            keywords: this.kw
          })
          // console.log(res)
          this.suggestList = res.data.data.options
        }, 300)
      }
    },
    // 关键字高亮
    lightFn (originStr, target) {
      // originStr原字符串
      // target关键字
      // 通过replace方法进行替换
      const reg = new RegExp(target, 'ig')
      // match匹配的原字符
      return originStr.replace(reg, (match) => {
        // 里面不能用target  因为target已经忽略大小写了 会改变原字符
        return `<span style="color:red;">${match}</span>`
      })
    },
    // 封装
    moveFn (thekw) {
      setTimeout(() => {
        this.$router.push({
          path: `/searchResult/${thekw}`
        })
      }, 0)
    },
    // 确定搜索跳转
    searchFn () {
      if (this.kw.length > 0) {
        this.history.push(this.kw)// 保存搜索关键字
        this.moveFn(this.kw)
      }
    },
    // 点击搜索建议
    suggestFn (str) {
      this.history.push(str)// 保存搜索关键字
      this.moveFn(str)
    },
    // 点击历史列表
    historyFn (str) {
      this.moveFn(str)
    },
    // 清空搜索历史
    delFn () {
      this.history = []
    }
  },
  // 侦听器
  watch: {
    history: {
      deep: true,
      handler () {
        // es6新增set去重方法 不允许出现重复
        const set = new Set(this.history)
        // 吧set数据类型转换成Arr
        const arr = Array.from(set)
        setStorages('his', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
