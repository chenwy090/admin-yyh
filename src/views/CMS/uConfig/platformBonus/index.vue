<template>
  <div class="cms">
    <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回上一层</Button>
    <div>
      <Tabs type="card" v-model="compName">
        <TabPane v-for="(tab,k) in tabs" :key="k" :label="tab.label" :name="tab.compName"></TabPane>
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
export default {
  name: "platformBonus",
  inject: ["linkTo"],
  components: {
    Tab1,
    Tab2,
    Tab3,
    Tab4,
    Tab5
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
      // 首页分红banner:4  挣钱指南：101  邀请好友挣钱：102  市场推广：103 赚钱专区:104
      tabs: {
        tab1: {
          id: "tab1",
          type: 4,
          site: 1,
          label: "首页分红banner",
          compName: "tab1"
        },
        tab2: {
          id: "tab2",
          type: 101,
          site: 2,
          label: "赚钱指南",
          compName: "tab2"
        },
        tab3: {
          id: "tab3",
          type: 102,
          site: 2,
          label: "邀请好友赚钱",
          compName: "tab3"
        },
        tab4: {
          id: "tab4",
          type: 103,
          site: 2,
          label: "市场推广",
          compName: "tab4"
        },
        tab5: {
          id: "tab5",
          type: 104,
          site: 2,
          label: "赚钱专区",
          compName: "tab5"
        }
      }
    };
  },
  methods: {
    goback(item) {
      this.linkTo("indexPage");
    }
  }
};
</script>
<style lang="less" scoped>
</style>


<style scoped>
</style>