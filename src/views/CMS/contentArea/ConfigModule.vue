<template>
  <div class="cms">
    <h3>请选择配置模块</h3>
    <Row type="flex" justify="center" :gutter="10">
      <Col span="6" v-for="(item,k) in choice" :key="k" v-if="item.show">
        <Card class="card-item" @click.native="fn(item)">
          <span style>{{item.label}}</span>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
export default {
  name: "cms",
  inject: ["linkTo"],
  data() {
    return {
      choice: {
        examine: {
          compName: "examine",
          label: "审核",
          show: false
        },
        publish: {
          compName: "publish",
          label: "发布",
          show: false
        }
      }
    };
  },
  created() {
    // content:examine
    // content:publish
    this.getPerms("content:examine");
    this.getPerms("content:publish");
  },
  methods: {
    fn(item) {
      console.log("click", { ...item });
      this.linkTo(item.compName);
    },
    async getPerms(perms) {
      let type = perms.split(":")[1];
      //获取权限
      const url = "/system/sys-menu/hasPerms";
      const { code, msg, data } = await postRequest(url, { perms });
      if (code == 200 && data) {
        // data:[{id,name,sort}]
        this.choice[type].show = true;
      } else {
        // this.msgErr(msg);
      }
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
.cms > h3 {
  font-size: 24px;
  margin: 20px 0;
  text-align: center;
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
