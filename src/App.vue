<template>
  <div class="test">
    这是个 vue 测试页面
    <el-button
      type="primary"
      @click="handleShowTest"
    >
      展示异步组件22
    </el-button>
    <div v-if="show">
      <test />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  components: {
    test: defineAsyncComponent(() => import('./test')),
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    handleShowTest() {
      this.show = true;
    },
  },
};
</script>

<style scoped lang="scss">
.test {
  transition: all 1s;
}
</style>
