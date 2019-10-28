<template>
  <!--  快捷入口 QuickEntry  -->
  <div class="cms">
    {{tab.label}}
    <QuickEntryBackgroundImage :tab="tab"></QuickEntryBackgroundImage>
    <QuickEntryList></QuickEntryList>
  </div>
</template>
<script>
import QuickEntryBackgroundImage from "./QuickEntryBackgroundImage";
import QuickEntryList from "./QuickEntryList";

export default {
  name: "quick-entry",
  provide() {
    return {
      //类型（1专题活动、2抽奖广场页、3内链、4外链、5平台分红页、6领优惠页－周边券、7领优惠－超市券、8邀请好友页、9签到功能）
      typeOption: {
        "1": "专题活动",
        "2": "抽奖广场页",
        "3": "内链",
        "4": "外链",
        "5": "平台分红页",
        "6": "领优惠页－周边券",
        "7": "领优惠－超市券",
        "8": "邀请好友页",
        "9": "签到功能",
        "13": "赚钱",
        "14": "我的券"
      }
    };
  },
  components: { QuickEntryBackgroundImage, QuickEntryList },
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          id: "QuickEntry",
          // type: 4,
          type: 8,
          site: 1,
          label: "快捷入口",
          compName: "QuickEntry"
        };
      }
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>
<style lang="less" scoped>
</style>