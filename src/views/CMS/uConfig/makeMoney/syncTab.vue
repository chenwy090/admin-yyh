<template>
  <div style="min-height: 400px;margin-bottom: 100px">
    <Card style="height: 100%">
      <p slot="title">
        同步券
        <span class="tongbu-desc">将券的信息同步到分享券</span>
      </p>

      <Form :model="syncData" ref="syncDataForm" :label-width="70" class="search-form" :rules="syncDataValidate">
        <FormItem label="类型" prop="couponType">
          <RadioGroup v-model="syncData.couponType">
            <Radio :label="1">商超券</Radio>
            <Radio :label="2">周边券</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="优惠券ID" prop="couponId">
          <Input v-model="syncData.couponId" placeholder="请填写优惠券ID"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="submitFun">同步</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import * as cms from "@/api/cms";

export default {
  inject: ["linkTo"],
  data() {
    return {
      syncData: {
        couponType: 1,
        couponId: "",
      },
      syncDataValidate: {
        type: [{ required: true, message: "请选择优惠券类型", trigger: "change" }],
        id: [{ required: true, message: "请输入优惠券ID", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitFun() {
      this.$refs["syncDataForm"].validate(valid => {
        if (!valid) return;
        cms.recommendCouponRevision(this.syncData).then(res => {
          if (res.isSuccess) {
            this.$Message.success("同步成功！");
          } else {
            this.$Message.error(res.msg);
          }
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.tongbu-desc {
  font-weight: 300;
  color: red;
  padding-left: 1vh;
}
.search-form {
  max-width: 500px;
}
</style>
