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
      <Log :id="id"></Log>
      <div slot="footer">
        <Button type="primary" style="margin-right: 20px" @click="closeDialog">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
import { auditLogColoumns as columns } from "./columns";

// 日志表格
import Log from "./Log";

export default {
  name: "aduit-log-list",
  components: { Log },
  props: {
    id: {
      type: [Number, Object],
      default: null
    }
  },
 
  data() {
    return {
      isShow: true,
    };
  },
  methods: {
    closeDialog() {
      //关闭对话框清除表单数据
      this.$emit(`update:showAuditLogList`, false);
    }
  }
};
</script>

<style scoped>
</style>

<style lang="less">
</style>
