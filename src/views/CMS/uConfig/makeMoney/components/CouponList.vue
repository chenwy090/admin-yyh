<template>
  <!-- 优惠券 -->
  <div class="coupon-list-box">
    <Modal
      v-model="isShow"
      title="优惠券列表"
      width="900"
      footer-hide
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{ top: '20px' }"
    >
      <div>
        <Tabs type="card" v-model="compName">
          <TabPane v-for="(tab, k) in tabs" :key="k" :label="tab.label" :name="tab.compName"></TabPane>
        </Tabs>
        <component
          :is="compName"
          :tab="tab"
          @closeDialog="closeDialog"
          @seclectedTr-event="selectedTrCallBack"
        ></component>
      </div>
    </Modal>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";

import CompMerchantLlist from "./CompMerchantLlist";
import CompSuperMarketList from "./CompSuperMarketList";

export default {
  name: "coupon-list",
  props: ["searchForm"],
  components: {
    CompMerchantLlist,
    CompSuperMarketList,
  },
  computed: {
    tab() {
      return this.tabs[this.compName];
    },
    getSearchForm() {
      return this.searchForm;
    },
  },
  provide() {
    return {
      searchForm: this.getSearchForm,
    };
  },
  watch: {
    compName() {
      console.log("watch:compName", this.compName);
    },
  },
  data() {
    return {
      isShow: true,
      compName: "CompMerchantLlist",
      // 优惠券类型：包括"周边券2"、"超市券1"；
      //  couponType 优惠券类型 0-商超券 1-商户/周边券
      // 商超 /zex-mgr/coupon/superMarket/list
      // 商户 /zex-mgr/coupon/merchant/list
      tabs: {
        CompMerchantLlist: {
          id: Math.random(),
          name: "xxx",
          couponType: 1,
          label: "周边券",
          compName: "CompMerchantLlist",
          // url: "/campagin/activitylist"
          url: "/share/recommend/coupon/list/coupon",
        },
        CompSuperMarketList: {
          id: Math.random(),
          name: "xxx",
          couponType: 2,
          label: "商超券",
          compName: "CompSuperMarketList",
          // url: "/merchantCouponTemplate/activitylist"
          url: "/share/recommend/coupon/list/coupon",
        },
      },
    };
  },
  methods: {
    // 关闭商户选择框
    cancel() {
      this.closeDialog();
    },
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      this.$emit(`update:showCouponList`, false);
    },
    //确定选择商户
    selectedTrCallBack(choice) {
      choice.couponType = this.tab.couponType;
      // console.log("choice",JSON.stringify(choice));
      this.$emit("seclectedTr-event", choice);
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3,
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3,
      });
    },
  },
};
</script>

<style scoped>
.form > div {
  display: inline-block;
}
</style>

<style lang="less">
.bussiness-list-box {
  /*调整table cell间隔和行高*/
  .ivu-table-cell {
    padding-left: 1px;
    padding-right: 1px;
  }
  .ivu-table-small td {
    height: 30px;
  }
}
</style>
