
<template>
  <!-- 收费条目 FeeEntry -->
  <div>
    <Alert>
      <Row
        type="flex"
        justify="center"
        :gutter="10"
        v-for="(item, index) in merchantMoneyChargesRecords"
        :key="index"
      >
        <Col span="4">
          <!-- 支付方式: -->
          <FormItem :label-width="0">
            <Input :value="payTypeList[item.paymentMode]" disabled />
          </FormItem>
        </Col>
        <Col span="5">
          <!-- 实际收款金额 -->
          <FormItem :label-width="0">
            <Input v-model="item.actualAmount" disabled />
          </FormItem>
        </Col>
        <Col span="4">
          <!-- 收款人 -->
          <FormItem :label-width="0">
            <Input v-model="item.payee" disabled />
          </FormItem>
        </Col>
        <Col span="4">
          <!-- 收款日期 -->
          <FormItem :label-width="0">
            <Input v-model="item.receivedDate" disabled />
          </FormItem>
        </Col>
        <Col span="5">
          <!-- 流水号 -->
          <FormItem :label-width="0">
            <Input v-model="item.serialNumber" disabled />
          </FormItem>
        </Col>
      </Row>
    </Alert>
  </div>
</template>
<script>
export default {
  name: "fee-entry-detail",
  props: {
    merchantMoneyChargesRecords: {
      type: Array,
      default: function() {
        return [
          // id: "",
          // paymentMode: "",//支付方式
          // actualAmount: null,//实际收款金额
          // payee: "",//收款人
          // receivedDate: "",//收款日期
          // serialNumber: ""//流水号
        ];
      }
    }
  },
  data() {
    return {
      payTypeList: {
        "1": "现金",
        "2": "微信",
        "3": "支付宝",
        "4": "银行卡"
      }
    };
  },

  methods: {
    // 删除兼容品牌
  }
};
</script>