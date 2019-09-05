<template>
  <div class="bussiness-tasks">
    <component :is="compName"></component>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("missionCenter");
// 赏U列表
import RewardUList from "./RewardUList";
// 赏U新增/编辑
import RewardUEdit from "./RewardUEdit";
// 赏U查看 数据
import RewardUData from "./RewardUData";

export default {
  name: "bussiness-tasks",
  components: {
    [RewardUList.name]: RewardUList,
    [RewardUEdit.name]: RewardUEdit,
    [RewardUData.name]: RewardUData
  },
  computed: {
    ...mapGetters({
      compName: "getCompName"
    })
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="less">
.bussiness-tasks {
  .header {
    height: 24px;
    line-height: 24px;
    background-color: #929292;
    font-family: "微软雅黑";
    font-size: 12px;
    font-weight: 400;
    text-indent: 1em;
    margin-bottom: 10px;
  }
  .title {
    font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑";
    font-weight: 700;
    font-style: normal;
    font-size: 13px;
    border-left: 6px solid #62666b;
    padding-left: 10px;
    margin-bottom: 10px;
  }
  .marginLeft20 {
    margin-left: 20px;
  }
}
</style>