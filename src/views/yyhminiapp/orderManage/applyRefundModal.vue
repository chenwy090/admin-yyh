<template>
  <Modal v-model="showModal2" :mask-closable="false" title="退款申请" @on-cancel="cancel" @on-visible-change="close">
    <p style="padding: 10px 0;color:red;">退款申请过后，退款将原路退回用户账户，请谨慎操作！</p>
    <Form ref="formData222" :label-width="90" :model="formData" :rules="ruleCustom">
      <FormItem label="退款原因：" required prop="refundReason">
        <Input v-model="formData.refundReason" type="textarea" :rows="4" placeholder="请输入退款原因" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button @click="cancel">关闭</Button>
      <Button type="primary" @click="okFun" :loading="cancelLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import * as order from "@/api/order";

export default {
  name: "applyRefundModal",
  props: ["showModal", "orderNo", "ok"],
  data() {
    return {
      formData: {
        refundReason: "",
        orderNo: null,
      },
      showModal2: false,
      cancelLoading: false,
      ruleCustom: { refundReason: [{ required: true, message: "请输入退款原因", trigger: "change" }] },
    };
  },
  watch: {
    showModal(val) {
      this.showModal2 = val;
    },
    orderNo(val) {
      this.formData.orderNo = val;
      console.info(val);
    },
  },
  mounted() {
    console.info(this.orderNo);
  },
  methods: {
    okFun() {
      this.$refs.formData222.validate(valid => {
        if (!valid) return;
        this.cancelLoading = true;
        order.orderRefundApply(this.formData).then(res => {
          this.cancelLoading = false;
          if (res.code == 200) {
            this.$emit("update:showModal", false);
            this.$emit("ok");
          } else {
            this.$Message.error(res.msg);
          }
        });
      });
    },
    cancel() {
      this.$emit("update:showModal", false);
    },
    close(result) {
      console.info(result);
      if (!result) {
        this.formData = {
          refundReason: "",
          orderNo: null,
        };
      }
    },
  },
};
</script>
<style lang="less" scoped></style>
