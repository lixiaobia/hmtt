<template>
  <div>
    <van-nav-bar fixed>
      <!-- //v-slot简写# 插槽占位符 -->
      <template v-slot:left>
        <img class="logo" src="@/assets/logo.png" alt="" />
      </template>
      <template #right>
        <van-icon name="search" size="0.48rem" color="#fff" @click="searchFn"/>
      </template>
    </van-nav-bar>
    <div class="main">
      <van-tabs v-model="channelId"
      @click="channeChangeFn"
       animated sticky offset-top="1.226667rem">
        <van-tab
          :title="obj.name"
          v-for="obj in userChanneList"
          :key="obj.id"
          :name="obj.id"
        >
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 -->
      <van-icon
        name="plus"
        size="0.37333334rem"
        class="moreChannels"
        @click="showPopup"
      />
    </div>
    <van-popup v-model="show" class="edit_wrap">
      <ChannelEdit
        :userLists="userChanneList"
        :unChanneList="unChannelList"
        @addchannelEv="addchannelFn"
        @removechannelEv="removechannelFn"
        @closeEv="closeFn"
        v-model="channelId"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getChannelsAPI, allChannelListAPI, updateChannelAPI, removeTheChannelAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
export default {
  name: 'home',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      channelId: 0, // 当前频道id
      allChanneList: [], // 所有频道数据
      userChanneList: [], // 用户频道数据
      // articList: []// 获取文章新闻推荐数据
      show: false,
      channeScrollTobj: {}
    }
  },
  // 页面加载就要获取数据
  async created () {
    // 用户频道数据
    const res = await getChannelsAPI()
    // console.log(res)
    this.userChanneList = res.data.data.channels
    // 调用函数获取数据
    // this.ChannelChange()
    const res2 = await allChannelListAPI()// 所有频道数据
    // console.log(res2)
    this.allChanneList = res2.data.data.channels
  },
  methods: {
    channeChangeFn () {
      // 频道切换回来 吧记录的对应的高度 赋值给页面滚动
      // 一切回来高度为0 滚动直接就到顶部了
      // 所以要先渲染dom 再执行滚动
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channeScrollTobj[this.channelId]
      })
    },
    showPopup () {
      this.show = true
    },
    // 添加到我的频道
    async addchannelFn (channelObj) {
      this.userChanneList.push(channelObj)
      const newArr = this.userChanneList.filter(obj => obj.id !== 0)
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj }// 浅拷贝
        delete newObj.name
        newObj.seq = index
        return newObj
      })
      await updateChannelAPI({
        channels: theNewArr
      })
      // console.log(res)
    },
    // 删除我的频道
    async  removechannelFn (channelObj) {
      // 判断点击时的id 在原数组是都存在并且返回在原数组中的位置（索引）
      const index = this.userChanneList.findIndex(obj => obj.id === channelObj.id)
      // console.log(index)
      // 根据返回的索引进行删除
      this.userChanneList.splice(index, 1)
      // 后端也要发送数据请求 删除对应的值、
      await removeTheChannelAPI({
        channelId: channelObj.id
      })
    },
    // 关闭弹出层
    closeFn () {
      this.show = false
    },
    searchFn () {
      this.$router.push('/search')
    },
    // 滚动位置
    scrollFn () {
      // 实时记录滚动的记录 保存下来
      this.$route.meta.scrollT = document.documentElement.scrollTop
      // 保存当前频道的滚动距离
      this.channeScrollTobj[this.channelId] = document.documentElement.scrollTop
      console.log(this.channeScrollTobj)
    }
  },
  computed: {
    // 封装所有数据-用户数据=剩下的数据
    unChannelList () {
      // 遍历数据全的数组  在里面再遍历数据少的数组进行判断 如果id有就返回false
      const newArr = this.allChanneList.filter((bigObj) => {
        // 用少的再多的里面排除
        const index = this.userChanneList.findIndex((smallObj) => {
          // 如果有相同id就说明数据一样 就可以剔除  为false就说明没找到 findIndex就返回-1 所以只要大于-1就说明有一样的
          return smallObj.id === bigObj.id
        })
        // 在进行判断 有一样的就返回false filter会进行筛选 只有为true才会吧数据返回到新数组
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  },
  activated () { // 如果页面有 keep-alive 缓存功能，这个函数会触发
    window.addEventListener('scroll', this.scrollFn)
    // 监听滚动距离 保存下来
    // 页面返回时 立刻吧上次记录的距离赋值给html
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  // 全局资源失焦之后要移除掉
  deactivated () {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style lang="less" scoped>
.logo {
  width: 100px;
  height: 30px;
}
.van-nav-bar {
  background-color: #007bff;
}
.main {
  padding-top: 46px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
/* 频道编辑弹出层铺满屏幕 */
.edit_wrap {
  width: 100%;
  height: 100%;
}
</style>
