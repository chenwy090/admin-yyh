<template>
  <div id="main" class="app-main" :data-updated="updated">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 上线之后可以看到是什么时候打的包
      updated: __UPDATED__,
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {},
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  /* overflow: hidden; */
}

.app-main {
  width: 100%;
  height: 100%;
}

.br button {
  margin-right: 5px;
}

.operation button {
  margin-right: 5px;
}

.ivu-btn-text:focus {
  box-shadow: none !important;
}
.ivu-card-extra {
  z-index: 9999999 !important;
}
</style>
