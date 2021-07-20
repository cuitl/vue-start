<template>
  <div class="about">
    <h1>This is an about page</h1>

    <!-- <AspectContainer :x="4" :y="3">4 / 3 宽高固定比例容器</AspectContainer> -->
    <AspectContainer aspect="16/9">16 / 9 宽高固定比例容器</AspectContainer>
  </div>
</template>

<script>
import AspectContainer from '@/components/AspectContainer'

export default {
  components: {
    AspectContainer
  }
}
</script>
