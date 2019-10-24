<template>
  <div class="publish">
    <component :is="compName"></component>
  </div>
</template>
<script>
// 列表
import List from "./List";
// 新增/编辑
import Edit from "./Edit";

export default {
  name: "publish",
  provide() {
    return {
      // 全局提示
      msgOk: this.msgOk,
      msgErr: this.msgErr
    };
  },
  components: {
    [List.name]: List,
    [Edit.name]: Edit
  },
  computed: {
    ...mapGetters({
      compName: "getCompName"
    })
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3
      });
    }
  }
};
</script>
<style lang="less">
</style>