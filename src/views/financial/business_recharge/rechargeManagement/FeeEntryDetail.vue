
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
          <FormItem :label-width="0">
            <Input v-model="item.paymentMode" disabled/>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem :label-width="0">
            <Input v-model="item.actualAmount" disabled />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label-width="0">
            <Input v-model="item.payee" disabled />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label-width="0">
            <Input v-model="item.receivedDateStr" disabled />
          </FormItem>
        </Col>
        <Col span="5">
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
      payTypeList: [
        {
          id: "1",
          name: "现金"
        },
        {
          id: "2",
          name: "微信"
        },
        {
          id: "3",
          name: "支付宝"
        },
        {
          id: "4",
          name: "银行卡"
        }
      ]
    };
  },

  methods: {
    // 删除兼容品牌
  }
};
</script>