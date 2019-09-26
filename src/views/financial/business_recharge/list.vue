<template>
  <div class="bussiness">
    <!-- <component :is="compName" @changeComp="changeComp"></component> -->
    <component :is="compName"></component>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";

import BusinessRecharge from "./BusinessRecharge";
// 充值管理
import RechargeManagement from "./rechargeManagement";
// U贝管理
import UbayManagement from "./ubayManagement";

// 资金明细
import FundsDetails from "./FundsDetails";
// U贝明细
import UbayDetails from "./UbayDetails";

export default {
  name: "bussiness",
  provide() {
    return {
      // 商户类型：下拉选择框“全部、本地商户（多店）、本地商户（单店）”，默认“全部”。 商超门店、零售商
      //  '商户类型 0-本地商户（单店），1-本地商户（多店）' 2 商超门店、3 零售商
      merchantTypeOption: [
        {
          value: 0,
          label: "本地商户（单店）"
        },
        {
          value: 1,
          label: "本地商户（多店）"
        },
        {
          value: 2,
          label: "商超门店"
        },
        {
          value: 3,
          label: "零售商"
        }
      ],
      getMoneyAndUbay: this.getMoneyAndUbay,
      // 全局提示
      msgOk: this.msgOk,
      msgErr: this.msgErr
    };
  },
  components: {
    [BusinessRecharge.name]: BusinessRecharge,
    [RechargeManagement.name]: RechargeManagement,
    [UbayManagement.name]: UbayManagement,
    [FundsDetails.name]: FundsDetails,
    [UbayDetails.name]: UbayDetails
  },
  computed: {
    compName() {
      return this.$store.getters["financial/getCompName"];
    }
  },
  data() {
    return {
      // compName: BusinessRecharge.name
      retailerInfoList: []
    };
  },
  created() {
    this.getRetailerInfoList();
  },
  methods: {
    changeComp(name) {
      console.log(1111, name);
      // this.compName = name;
    },
    async getRetailerInfoList() {
      const url = "/system/sys-shop-info/getRetailerInfoList";
      const { code, data } = await postRequest(url);
      let options = [];
      if (code == 200) {
        options = data;
      }
      this.$store.commit("financial/setRetailerInfoList", options);
    },
    async getMoneyAndUbay(type, id) {
      let params = { merchantType: type, merchantId: "", brandId: "" };

      if (type == 0) {
        params.merchantId = id;
      } else {
        params.brandId = id;
      }

      const url = "/merchant/account/getMerchantAccountInfoByTypeAndBrandId";
      //  money: 0, // 商户余额
      // ubay: 0, // U贝余额

      let money = 0;
      let ubay = 0;
      let { code, msg, data } = await postRequest(url, params);
      if (code == 200) {
        money = data.money;
        ubay = data.ubay;
      } else {
        // 不做 没有查询到商户余额信息 的提示
        // this.msgErr(msg);
      }
      return { money, ubay };
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
<style>
.header {
  height: 24px;
  line-height: 24px;
  background-color: #929292;
  font-family: "微软雅黑";
  font-size: 12px;
  font-weight: 400;
  text-indent: 1em;
  margin-bottom: 10px;
}
.title {
  font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑";
  font-weight: 700;
  font-style: normal;
  font-size: 13px;
  border-left: 6px solid #62666b;
  padding-left: 10px;
  margin-bottom: 10px;
}
.marginLeft20 {
  margin-left: 20px;
}
</style>