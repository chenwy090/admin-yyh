<template>
  <div class="cms">
    <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回上一层</Button>publish
  </div>
</template>
<script>
export default {
  name: "publish",
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