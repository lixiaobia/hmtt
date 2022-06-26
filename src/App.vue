<template>
  <div>
    <!-- exclude不需要缓存的名字 -->
    <keep-alive exclude="Search,SearchResult,UserEdit,ArticleDetail">
    <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { allChannelListAPI } from '@/api/index'
export default {

  async created () {
    try {
      const res = await allChannelListAPI()
      console.log(res)
    } catch (err) {
      console.dir(err)
    }
  }
}
</script>

<style lang="less" scoped></style>
