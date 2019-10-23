<template>
  <div class="cms">
    <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回上一层</Button>
    <div>
      <Tabs type="card" v-model="compName">
        <TabPane v-for="tab in tabs" :key="tab.id" :label="tab.label" :name="tab.compName"></TabPane>
      </Tabs>
      <component :is="compName" :tab="tab"></component>
    </div>
  </div>
</template>
<script>
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";
import Tab4 from "./Tab4";
import Tab5 from "./Tab5";
import Tab6 from "./Tab6";
import QuickEntry from "./quickEntry"; //快捷入口
import ContentArea from "./ContentArea"; //内容专区

export default {
  name: "indePage",
  inject: ["linkTo"],
  components: {
    Tab1,
    Tab2,
    Tab3,
    Tab4,
    Tab5,
    Tab6,
    QuickEntry,
    ContentArea
  },
  computed: {
    tab() {
      return this.tabs[this.compName];
    }
  },
  watch: {
    compName() {
      if (this.compName == "tab4") {
        this.linkTo("platformBonus");
      }
      console.log("watch:compName", this.compName);
    }
  },
  data() {
    return {
      compName: "tab1",
      // 1 核销扫码区 2 超值爆抢券  3 免费抽大奖 4 平台分红 5 品牌专区  6 好券一起领
      tabs: [
        {
          id: "tab1",
          type: 1,
          label: "核销扫码区",
          compName: "tab1"
        },
        {
          id: "QuickEntry",
          type: 8,
          label: "快捷入口",
          compName: "QuickEntry"
        },
        {
          id: "ContentArea",
          type: 7,
          label: "内容专区",
          compName: "ContentArea"
        },
        {
          id: "tab4",
          type: 4,
          label: "平台分红",
          compName: "tab4"
        },
        {
          id: "tab3",
          type: 3,
          label: "免费抽大奖",
          compName: "tab3"
        },
        {
          id: "tab2",
          type: 2,
          label: "超值爆抢券",
          compName: "tab2"
        },
        {
          id: "tab5",
          type: 5,
          label: "品牌专区",
          compName: "tab5"
        },
        {
          id: "tab6",
          type: 6,
          label: "好券一起领",
          compName: "tab6"
        }
      ]
    };
  },
  methods: {
    goback() {
      this.linkTo("cms");
    }
  }
};
</script>
<style lang="less" scoped>
</style>


<style scoped>
</style>