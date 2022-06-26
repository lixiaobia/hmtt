<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="close"/>
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>我的频道
          <span class="small-title">
            点击{{isEdit? '删除':'进入'}}频道
          </span>
        </span>
        <span @click="isEditFn">{{isEdit? '完成':'编辑'}}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="obj in userLists" :key="obj.id"
        @click='removeFn(obj)'>
          <div class="channel-item van-hairline--surround">
            {{obj.name}}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge"
            v-show="isEdit && obj.id !== 0"
            >
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="obj in unChanneList" :key="obj.id" @click="moreFn(obj)">
          <div class="channel-item van-hairline--surround">{{obj.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userLists: Array, // 我的数据
    unChanneList: Array// 剩余频道数据
  },
  data () {
    return {
      isEdit: false
    }
  },
  methods: {
    // 频道切换状态
    isEditFn () {
      this.isEdit = !this.isEdit
    },
    // 添加到我的频道
    moreFn (channelObj) {
      if (this.isEdit === true) {
        this.$emit('addchannelEv', channelObj)
      }
    },
    // 删除我的频道
    removeFn (channelObj) {
      // 为编辑状态删除点击的频道
      if (this.isEdit === true) {
        // 再判断id是否为0（推荐模块） 为0就不执行
        if (channelObj.id !== 0) {
          this.$emit('removechannelEv', channelObj)
        }
      } else {
        // 否则就是不处于编辑状态  那么点击就需要跳转
        this.$emit('closeEv') // 先关闭弹出层
        this.$emit('input', channelObj.id)// 点击的对应的索引传过去
        // 触发v-module绑定的input事件 对应hone index.vue第38行的事件
      }
    },
    // 关闭弹出层
    close () {
      this.$emit('closeEv')
      this.isEdit = false
    }
  }
}
</script>

<style scoped lang="less">
.van-nav-bar{
    background-color: #007bff;
}
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
