<template>
  <div class="bussiness-list-box">
    <Modal
      v-model="isShow"
      title="商户列表"
      width="900"
      footer-hide
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
    >
      <div>
        <Tabs type="card" v-model="compName">
          <TabPane v-for="(tab,k) in tabs" :key="k" :label="tab.label" :name="tab.compName"></TabPane>
        </Tabs>
        <component
          :is="compName"
          :tab="tab"
          :checked="checked"
          @closeDialog="closeDialog"
          @seclectedTr-event="selectedTrCallBack"
        ></component>
      </div>
    </Modal>
  </div>
</template>
<script>
import CompMerchantList from "./CompMerchantList";
import CompBrandList from "./CompBrandList";

export default {
  name: "business-list",
  components: { CompMerchantList, CompBrandList },
  props: {
    id: {
      type: [Number, String],
      default: ""
    },
    checked: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tab() {
      return this.tabs[this.compName];
    }
  },
  watch: {
    compName() {
      console.log("watch:compName", this.compName);
    }
  },
  data() {
    return {
      isShow: true,
      compName: "CompMerchantList",
      //选中的数据
      choices: [
        /*{ id: "", name: "", row: {} } */
      ],
      tabs: {
        CompMerchantList: {
          id: Math.random(),
          name: "xxx",
          couponType: 0,
          label: "周边商户（单店）",
          compName: "CompMerchantList",
          url: "/trade/merchant/fund/account/basic/success"
        },
        // 创建优惠券-获取成功开户的商户信息
        CompBrandList: {
          id: Math.random(),
          name: "xxx",
          couponType: 1,
          label: "周边商户（多店）",
          compName: "CompBrandList",
          url: "/trade/merchant/fund/account/create/coupon/successBrand"
        }
      }
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
      console.log("closeDialog showBusinessList");
      this.$emit(`update:showBusinessList`, false);
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
