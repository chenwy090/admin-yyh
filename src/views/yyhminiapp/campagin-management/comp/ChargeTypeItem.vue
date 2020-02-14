<template>
  <div>
    <RadioGroup v-model="body.couponKind" @on-change="statusCheckChange">
      <!-- :disabled="disabled" -->
      <Radio :label="1">免费</Radio>
      <Radio :label="3">收费（平台自营）</Radio>
    </RadioGroup>

    <template v-if="body.couponKind === 3">
      <div class="item">
        <span class="label-width">
          原价：
        </span>
        <InputNumber
          :min="0"
          :step="0.1"
          v-model="body.originalPrice"
          style="width:100px"
          placeholder="请输入原价"
          @on-change="statusCheckChange"
        />
        <span style="padding-left:5px">元</span>
        <span style="padding-left:30px">售卖价：</span>
        <InputNumber
          v-model="body.price"
          :min="0.1"
          :max="body.originalPrice"
          :step="0.1"
          style="width:100px"
          placeholder="请输入售卖价"
          @on-change="statusCheckChange"
        />
        <span style="padding-left:5px">元</span>

        <span class="error" v-if="errorStatus">{{ errorStatus.message }}</span>
      </div>
      <!-- 只有在“付费券”类型中出现，支持退款和不支持退款单选 -->
      <div class="item item-flex">
        <span class="label-width">
          售后条件：
        </span>
        <RadioGroup v-model="body.enableAfterSale" vertical @on-change="statusCheckChange">
          <!-- 1.5.6.1.1 （本期不支持前端退款，支持退款选项禁用） -->
          <Radio :label="1" :disabled="false">支持退款</Radio>
          <Radio :label="0">不支持退款</Radio>
        </RadioGroup>
        <div v-if="body.enableAfterSale === 1">
          <CheckboxGroup v-model="couponAfterSaleVOLists" @on-change="statusCheckChange">
            <Checkbox :label="'1:过期退'">过期退</Checkbox>
            <Checkbox :label="'2:随时退'">随时退</Checkbox>
          </CheckboxGroup>
        </div>
      </div>
      <div class="item">
        <span class="label-width">结算金额：</span>
        <InputNumber
          :min="0"
          :step="0.01"
          v-model="body.settleAmount"
          style="width:100px"
          placeholder="请输入结算金额"
          @on-change="statusCheckChange"
        />
        <span style="padding-left:5px">元</span>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "ChargeTypeItem",
  props: {
    change: {
      default: () => {},
      type: Function,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    chargeData: {
      default: null,
      type: Object,
    },
  },
  data() {
    return {
      body: {
        couponKind: 1,
        originalPrice: 0,
        price: 0,
        enableAfterSale: 0,
        settleAmount: 0,
      },
      couponAfterSaleVOLists: ["1:过期退", "2:随时退"],
    };
  },
  watch: {
    chargeData(val) {
      this.chargeDataView(val);
      // if (val) {
      //   Object.keys(this.body).forEach(key => {
      //     this.body[key] = val[key];
      //   });
      //   if (val.couponAfterSaleVOList) {
      //     this.couponAfterSaleVOLists = val.couponAfterSaleVOList.map(({ code, value }) => {
      //       return `${code}:${value}`;
      //     });
      //   }
      // }
    },
  },
  computed: {
    errorStatus() {
      if (this.body.originalPrice && this.body.price) {
        if (this.body.price > this.body.originalPrice)
          return {
            type: 1,
            message: "您的优惠价高于原价，请重新输入。",
          };
        if ((this.body.originalPrice - this.body.price) / this.body.originalPrice > 0.3)
          return {
            type: 2,
            message: "您的优惠价设置偏低，请确认是否需要调整。",
          };
      }
      return null;
    },
  },
  methods: {
    statusCheckChange() {
      this.body.couponAfterSaleVOList = this.couponAfterSaleVOLists.map(item => {
        let [code, value] = item.split(":");
        return {
          code,
          value,
        };
      });
      let body = JSON.parse(JSON.stringify(this.body));
      if (body.enableAfterSale !== 1) {
        delete body.couponAfterSaleVOList;
      }
      this.$emit("change", body);
    },
    chargeDataView(val) {
      if (val) {
        Object.keys(this.body).forEach(key => {
          this.body[key] = val[key];
        });
        if (val.couponAfterSaleVOList) {
          this.couponAfterSaleVOLists = val.couponAfterSaleVOList.map(({ code, value }) => {
            return `${code}:${value}`;
          });
        }
      }
    },
  },
  mounted() {
    console.info(this.chargeData);
    this.chargeDataView(this.chargeData);
  },
};
</script>
<style lang="less" scoped>
.item {
  margin-top: 10px;
}
.item-flex {
  display: flex;
}
.label-width {
  display: inline-block;
  width: 60px;
  text-align: right;
}
.error {
  padding-left: 10px;
  color: red;
}
</style>
