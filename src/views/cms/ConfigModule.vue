<template>
  <Row type="flex" justify="space-around" class="code-row-bg" :gutter="16">
    <Col span="12" v-for="(item,k) in choice" :key="k">
      <Card class="card-item" @click.native="fn(item)">
        <span style>{{item.label}}</span>
      </Card>
    </Col>
  </Row>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("cms");

export default {
  name: "config-module-choice",
  data() {
    return {
      choice: {
        bootAd: {
          compName: "bootAd",
          label: "开机广告" //Boot advertisement
        },
        indexPage: {
          compName: "indexPage",
          label: "首页"
        }
      }
    };
  },
  methods: {
    ...mapActions({
      linkTo: "setCompName"
    }),
    fn(item) {
      console.log("click", { ...item });
      this.linkTo(item.compName);
    }
  }
};
</script>
<style lang="less" scoped>
.card-item {
  height: 200px;
  line-height: 200px;
  font-family: "PingFangSC-Regular", "PingFang SC";
  font-weight: 400;
  font-style: normal;
  font-size: 28px;
  text-align: center;

  .ivu-card-body {
    padding: 0;
  }
}
</style>