<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ Itemobj.title }}</span>
          <!-- 单图 -->
          <!-- <lazy-component> -->
          <img
            v-if="Itemobj.cover.type === 1"
            class="thumb"
            v-lazy="Itemobj.cover.images[0]"
          />
          <!-- </lazy-component> -->
          <!-- <van-image
            v-if="Itemobj.cover.type === 1"
            class="thumb"
            :src="Itemobj.cover.images[0]"
          > -->
            <!-- <template v-slot:error>加载失败</template>
          </van-image> -->
        </div>
        <!-- 多图 -->

        <div class="thumb-box" v-if="Itemobj.cover.type > 1">
          <!-- <lazy-component> -->
          <img
            v-for="(imgUrl, i) in Itemobj.cover.images"
            :key="i"

            class="thumb"
            alt=""
  v-lazy="imgUrl"
          />
            <!-- </lazy-component> -->
          <!-- <van-image>
            <template v-slot:error>加载失败</template>
          </van-image> -->
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ Itemobj.aut_name }}</span>
            <span>{{ Itemobj.comm_count }}评论</span>
            <span>{{ timeAgo(Itemobj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
        </div>
      </template>
    </van-cell>
    <van-action-sheet
      v-model="show"
      :cancel-text="bottonText"
      :actions="actions"
      @select="onSelect"
      get-container="body"
      @cancel="cancelFn"
      @closed="closeFn"
    />
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js'
import { firstActions, secondActions } from '@/api/report'
export default {
  props: {
    Itemobj: Object,
    isShow: {
      type: Boolean,
      default: true // 默认显示
    }
  },
  data () {
    return {
      show: false,
      actions: firstActions,
      bottonText: '取消'
    }
  },
  methods: {
    timeAgo,
    onSelect (action, index) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = true
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottonText = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit('diselikeEv', this.Itemobj.art_id)
        this.show = false // 不管反馈成功与否都要关闭弹窗
      } else { // 二级反馈
        this.$emit('reportEv', this.Itemobj.art_id, action.value)
        this.show = false // 不管反馈成功与否都要关闭弹窗
      }
    },
    cancelFn () {
      // 判断点击时显示的文字
      if (this.bottonText === '返回') {
        this.show = true// 强制显示 不让其隐藏
        this.actions = firstActions // 数据改为一级的
        this.bottonText = '取消'
      }
    },
    closeFn () {
      this.actions = firstActions // 数据改为一级的
      this.bottonText = '取消'
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
