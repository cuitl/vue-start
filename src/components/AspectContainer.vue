<template>
  <div class="aspect-container" :style="style">
    <!-- use padding-top for aspect hack -->
    <!-- <div v-if="!isSupportAspect" class="aspect-box" :style="hackStyle">
      <div class="content">
        <slot>not support</slot>
      </div>
    </div>

    <slot v-if="isSupportAspect">{{ isSupportAspect }}</slot> -->

    <div class="aspect-height" :style="hackStyle"></div>
    <slot>{{ isSupportAspect }}</slot>
  </div>
</template>

<script>
/**
 * @file 宽高比例固定容器
 */
import { isSupportCss } from '@/common/util'
import { computed, ref } from '@vue/composition-api'

export default {
  components: {},
  props: {
    // 宽高比如： 1/1 === :x="1" :y="1"
    aspect: String,
    // 宽度占比
    x: {
      type: Number,
      default: 1
    },
    // 高度占比
    y: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    const isSupportAspect = ref(true)
    isSupportAspect.value = isSupportCss('aspect-ratio')
    // isSupportAspect.value = false

    // 宽高 比例 数值
    const aspect = computed(() => {
      if (props.aspect && props.aspect.indexOf('/') > -1) {
        const [x, y] = props.aspect.split('/').map(v => Number(v.trim()))
        if (x && y) {
          return [x, y]
        }
      }
      if (props.x > 0 && props.y > 0) {
        return [props.x, props.y]
      }
      return [1, 1]
    })

    const style = computed(() => {
      const [x, y] = aspect.value

      if (isSupportAspect.value) {
        return {
          aspectRatio: `${x} / ${y}`
        }
      }

      return {}
    })

    const hackStyle = computed(() => {
      const [x, y] = aspect.value

      if (!isSupportAspect.value) {
        return {
          paddingTop: `calc(${y} / ${x} * 100%)`
        }
      }
      return {}
    })

    return {
      isSupportAspect,
      style,
      hackStyle
    }
  }
}
</script>

<style lang="scss" scoped>
.aspect-container {
  width: 100%;
  background-color: greenyellow;
  overflow: hidden;

  // 脱离文档流 使 aspect-container 可以承载数据
  // 设置 padding-top/bottom 使 aspect-container (BFC创建 overflow) 高度被撑开
  .aspect-height {
    float: left;
  }

  // 容器 使用 padding-top 撑开高度
  // .aspect-box {
  //   position: relative;
  //   width: 100%;
  //   // 绝对定位元素 承载内容
  //   .content {
  //     position: absolute;
  //     top: 0;
  //     left: 0;
  //     width: 100%;
  //     height: 100%;
  //   }
  // }
}
</style>
