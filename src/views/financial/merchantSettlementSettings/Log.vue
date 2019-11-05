<template>
  <!-- 日志表格-->
  <Card :bordered="false">
    <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData"></Table>
  </Card>
</template>
<script>
import { postRequest } from "@/libs/axios";
import { auditLogColoumns as columns } from "./columns";

export default {
  name: "log",
  props: {
    id: {
      type: [Number, Object],
      default: null
    }
  },
  watch: {
    id: {
      handler() {
        console.log("watch:", this.id);
      },
      immediate: true
    }
  },
  data() {
    return {
      isShow: true,
      columns,
      tableData: []
    };
  },
  created() {
    console.log("created", this.id);
    this.queryTableData();
  },
  methods: {
    // 查询
    async queryTableData() {
      this.loading = true;
      // 审核记录
      const url = "/trade/merchant/account/setting/audit/list";

      let { code, msg, data } = await postRequest(url, { id: this.id });
      if (code == 200) {
        this.tableData = data;
      } else {
        this.msgErr(code + " 数据加载失败!");
      }
      this.loading = false;
    },
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

<style scoped>
</style>

<style lang="less">
</style>
