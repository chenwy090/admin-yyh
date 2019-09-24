<template>
  <div class="cms">
    <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回上一层</Button>开机广告
  </div>
</template>
<script>
export default {
  name: "bootAd",
  inject: ["linkTo"],
  data() {
    return {};
  },
  methods: {
    goback(item) {
      this.linkTo("cms");
    }
  }
};
</script>
<style lang="less" scoped>
</style>


<style scoped>
</style>