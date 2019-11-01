<template>
  <!-- 优惠券 footer-hide-->
  <div class="add-phone-number-box">
    <Modal
      v-model="isShow"
      title="审核日志"
      width="700"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
    >
      <Card :bordered="false">
        <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData"></Table>
      </Card>
      <div slot="footer">
        <Button type="primary" style="margin-right: 20px" @click="closeDialog">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
import { auditLogColoumns as columns } from "./columns";

export default {
  name: "aduit-log-list",
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

  mounted() {
    console.log("mouted", this.id);
  },
  methods: {
    closeDialog() {
      //关闭对话框清除表单数据
      this.$emit(`update:showAuditLogList`, false);
    },
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
