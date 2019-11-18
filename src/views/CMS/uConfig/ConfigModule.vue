<template>
  <div class="cms">
    <h3 >请选择配置模块</h3>
    <Row type="flex" justify="space-between" :gutter="10">
      <Col span="6" v-for="(item,k) in choice" :key="k">
        <Card class="card-item" @click.native="fn(item)">
          <span style>{{item.label}}</span>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  name: "cms",
  inject: ["linkTo"],
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
        },
        bannerPage: {
          compName: "bannerPage",
          label: "banner设置"
        },
        discountConfig: {
          compName: "discountConfig",
          label: "领优惠配置"
        }
      }
    };
  },
  methods: {
    fn(item) {
      console.log("click", { ...item });
      this.linkTo(item.compName);
    }
  }
};
</script>
<style lang="less" scoped>
  .cms {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 20px;
  }
  .cms>h3{
    font-size: 24px;
    margin: 20px 0;
  }
.card-item {
  font-family: "PingFangSC-Regular", "PingFang SC";
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  text-align: center;
  background-color: #f4f4f4;
  .ivu-card-body {
    padding: 0;
  }
}
</style>
