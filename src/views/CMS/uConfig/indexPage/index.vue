<template>
  <div class="cms">
    <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回上一层</Button>首页
    <div>
      <Tabs type="card" v-model="compName">
        <TabPane v-for="(tab,k) in tabs" :key="k" :label="tab.label" :name="tab.compName"></TabPane>
      </Tabs>
      <component :is="compName" :tab="tab"></component>
    </div>
  </div>
</template>
<script>
import Tab1 from "./tab1";
import Tab2 from "./tab2";
import Tab3 from "./tab3";
import Tab4 from "./tab4";
import Tab5 from "./tab5";
import Tab6 from "./tab6";
export default {
  name: "indePage",
  inject: ["linkTo"],
  components: {
    Tab1,
    Tab2,
    Tab3,
    Tab4,
    Tab5,
    Tab6
    // CompSuperMarketList
  },
  computed: {
    tab() {
      return this.tabs[this.compName];
    }
  },
  watch: {
    compName() {
      console.log("watch:compName", this.compName);
    }
  },
  data() {
    return {
      compName: "tab1",
      // 1 核销扫码区 2 超值爆抢券  3 免费抽大奖 4 平台分红 5 品牌专区  6 好券一起领
      tabs: {
        tab1: {
          id: "tab1",
          name: "xxx",
          label: "核销扫码区",
          compName: "tab1"
        },
        tab2: {
          id: "tab2",
          name: "xxx",
          label: "超值爆抢券",
          compName: "tab2"
        },
        tab3: {
          id: "tab3",
          name: "xxx",
          label: "免费抽大奖",
          compName: "tab3"
        },
        tab4: {
          id: "tab4",
          name: "xxx",
          label: "平台分红",
          compName: "tab4"
        },
        tab5: {
          id: "tab5",
          name: "xxx",
          label: "品牌专区",
          compName: "tab5"
        },
        tab6: {
          id: "tab6",
          name: "xxx",
          label: "好券一起领",
          compName: "tab6"
        }
      }
    };
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