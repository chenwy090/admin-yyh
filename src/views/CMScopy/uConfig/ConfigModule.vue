<template>
  <div class="cms">
    <h3>请选择配置模块</h3>
    <Row type="flex" justify="space-around" :gutter="16">
      <Col span="8" v-for="(item,k) in choice" :key="k">
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
          label: "赚钱banner"
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


<style scoped>
.content {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.content > h3 {
  font-size: 24px;
  padding: 20px;
}
.table-box {
  width: 100%;
  display: flex;
  height: 120px;
  justify-content: space-between;
  box-sizing: border-box;
}
.table-item {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
  display: flex;
  background: #dbdbdb;
  margin: 20px;
  cursor: pointer;
}
.table-item-right {
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-evenly;
}
.table-item-right h3 {
  text-align: center;
}
.table-item-right p {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>