<template>
  <div class="uconfig">
    <keep-alive include="WriteOffRewardC">
      <!-- 将缓存name为a或者b的组件，结合动态组件使用 -->
      <!-- <component :is="currentView"></component> -->
      <component :is="compName"></component>
    </keep-alive>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapState, mapActions } = createNamespacedHelpers("cms");

import ConfigModule from "./ConfigModule";
import BootAd from "./bootAd";
import IndexPage from "./indexPage";
import PlatformBonus from "./platformBonus"; //平台分红

import bannerPage from "./bannerPage/bannerPage";

// 领优惠配置
import DiscountConfig from "./discountConfig";

// 赚钱频道
import makeMoney from "./makeMoney";

export default {
  name: "u-config",
  provide() {
    return {
      linkTo: this.linkTo,
      // 全局提示
      msgOk: this.msgOk,
      msgErr: this.msgErr,
    };
  },
  components: {
    [ConfigModule.name]: ConfigModule,
    BootAd,
    bannerPage,
    IndexPage,
    PlatformBonus,
    DiscountConfig,
    makeMoney,
  },
  computed: {
    ...mapGetters({ compName: "getCompName" }),
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      linkTo: "setCompName",
    }),
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3,
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3,
      });
    },
  },
  mounted() {
    // 开发用 TODO
    // this.linkTo("bannerPage");
  },
};
</script>

<style scoped>
.uconfig {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
}
.uconfig > h3 {
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
