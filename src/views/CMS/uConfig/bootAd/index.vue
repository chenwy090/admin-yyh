<template>
  <div class="cms">
    <Card style="height: 100%">
      <p slot="title">开机广告</p>
      <a href="#" slot="extra">
        <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回上一层</Button>
      </a>
      <div>
        <launchPageAd></launchPageAd>
      </div>
    </Card>
  </div>
</template>
<script>
  import  launchPageAd from '../../launchPageAd/launchPageAd'
export default {
  name: "bootAd",
  inject: ["linkTo"],
    components:{launchPageAd},
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
