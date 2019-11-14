<template>
  <div class="publish">
    <component :is="action.compName" :action="action"></component>
  </div>
</template>
<script>
// 列表
import List from "./List";
// 新增/编辑
import Edit from "./Edit";

export default {
  name: "publish",
  components: { [List.name]: List, [Edit.name]: Edit },
  computed: {},
  data() {
    return {
      compName: List.name,
      action: {
        id: Math.random(),
        compName: List.name,
        type: "list", // list/add/edit
        data: {}
      }
    };
  },
  created() {},
  methods: {}
};
</script>
<style lang="less">
.publish {
  padding: 20px;
  background: #fff;
}
</style>