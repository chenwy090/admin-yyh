<template>
  <!-- 审核日志-->
  <div class="add-phone-number-box">
    <Modal
      v-model="isShow"
      title="审核日志"
      width="700"
      :closable="true"
      :mask-closable="true"
      @on-cancel="closeDialog"
    >
      <Log ref="logRef" :id="id"></Log>
      <div slot="footer">
        <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
        <Button type="primary" style="margin-right: 20px" @click="closeDialog">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

// 日志表格
import Log from "./Log";

export default {
  name: "aduit-log-list",
  components: { Log },
  props: {
    id: {
      type: [Number, Object],
      default: null,
    },
  },
  data() {
    return {
      isShow: true,
    };
  },
  methods: {
    
    refresh() {
      this.$refs.logRef.refresh();
    },
    closeDialog() {
      //关闭对话框清除表单数据
      this.$emit(`update:showAuditLogList`, false);
    },
  },
};
</script>

<style scoped>
</style>

<style lang="less">
</style>
