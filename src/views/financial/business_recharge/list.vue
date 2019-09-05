<template>
  <div class="bussiness">
    <!-- <component :is="compName" @changeComp="changeComp"></component> -->
    <component :is="compName"></component>
  </div>
</template>
<script>
import BusinessRecharge from "./BusinessRecharge";
// 充值管理 
import RechargeManagement from "./rechargeManagement";
// U贝管理
import UbayManagement from "./ubayManagement";

// 资金明细
import FundsDetails from "./FundsDetails";
// U贝明细
import UbayDetails from "./UbayDetails";

var i = 0;
export default {
  name: "bussiness",
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
    };
  },
  methods: {
    changeComp(name) {
      console.log(1111, name);
      // this.compName = name;
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