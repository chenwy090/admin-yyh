<template>
  <Modal v-model="showModal2" :mask-closable="false" title="退款申请" @on-cancel="cancel">
    <p style="padding: 10px 0;color:red;">退款申请过后，退款将原路退回用户账户，请谨慎操作！</p>
    <Form ref="formData222" :label-width="90" :model="formData" :rules="ruleCustom">
      <FormItem label="退款原因：" required prop="msg">
        <Input v-model="formData.msg" type="textarea" :rows="4" placeholder="请输入退款原因" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button @click="cancel">关闭</Button>
      <Button type="primary" @click="ok">确定</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  name: "applyRefundModal",
  props: ["showModal"],
  data() {
    return {
      formData: {
        msg: "",
      },
      showModal2: false,
      ruleCustom: { msg: [{ required: true, message: "请输入退款原因", trigger: "change" }] },
    };
  },
  watch: {
    showModal(val) {
      this.showModal2 = val;
    },
  },
  methods: {
    ok() {
      this.$refs.formData222.validate(valid => {
        if (!valid) return;
        this.$emit("update:showModal", false);
      });
    },
    cancel() {
      this.$emit("update:showModal", false);
    },
  },
};
</script>
<style lang="less" scoped></style>
