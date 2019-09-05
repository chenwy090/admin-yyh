
<template>
  <!-- 收费条目 FeeEntry -->
  <div>
    <Alert>
      <!-- :label="'Item ' + index" -->
      <Row type="flex" justify="center" :gutter="10" v-for="(item, index) in compatibleList" :key="index">
        <Col span="4">
          <FormItem
            :key="index"
            :label-width="0"
            :prop="`compatibleList.${index}.paymentMode`"
            :rules="{required: true,  validator: validateEmpty('请选择支付方式'), trigger: 'blur'}"
          >
            <Select v-model="item.paymentMode" placeholder="请选择支付方式">
              <Option v-for="item in payTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem
            :key="index"
            :label-width="0"
            :prop="`compatibleList.${index}.actualAmount`"
            :rules="{required: true,  validator: validateMoney}"
          >
            <Input v-model="item.actualAmount" placeholder="请填写实际收款金额，小数点后两位" clearable />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem
            :key="index"
            :label-width="0"
            :prop="`compatibleList.${index}.payee`"
            :rules="{required: true,  validator: validateEmpty('请填写收款人'), trigger: 'blur'}"
          >
            <Input v-model="item.payee" :maxlength="10" placeholder="请填写收款人" clearable />
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem
            :key="index"
            :label-width="0"
            :prop="`compatibleList.${index}.receivedDate`"
            :rules="{required: true, validator: validateEmpty('请填写收款日期'), trigger: 'blur'}"
          >
            <DatePicker type="date" placeholder="请填写收款日期" v-model="item.receivedDate"></DatePicker>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem
            :key="index"
            :label-width="0"
            :prop="`compatibleList.${index}.serialNumber`"
            :rules="{required: true,  validator: validateEmpty('请填写流水号'), trigger: 'blur'}"
          >
            <Input v-model="item.serialNumber" :maxlength="20" placeholder="请填写流水号" clearable />
          </FormItem>
        </Col>
        <Col span="2">
          <FormItem :key="index" :label-width="0">
            <Button
              type="error"
              icon="md-trash"
              size="small"
              @click="compatible_delInfo(index,item)"
            >删除</Button>
          </FormItem>
        </Col>
      </Row>
    </Alert>
  </div>
</template>
<script>
export default {
  name: "fee-entry",
  props: {
    compatibleList: {
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
    compatible_delInfo(index, item) {
      this.compatibleList.splice(index, 1);
    },
    validateEmpty(msg) {
      return function(rule, value, callback) {
        console.log(1111111, rule, value);

        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        callback();
      };
    },
    //验证金额
    validateMoney(rule, value, callback) {
      value += "";
      value = value.trim();
      // 允许不填
      if (value == "") {
        return callback("金额不能为空");
      }

      // 排除 "","0","0.0","0.00"格式
      if (!value || value == "0" || value == "0.0" || value == "0.00") {
        return callback(new Error("金额不能为0"));
      }

      // 验证是否是数字
      const n = Number(value);
      if (isNaN(n)) {
        return callback(new Error("请输入数字"));
      }

      if (n > 0 && n <= 99999.99) {
        const reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/;

        if (!reg.test(value)) {
          return callback(
            new Error("请输入大于等于0的金额，小数点最多包含两位小数")
          );
        }
      } else {
        return callback(new Error("请输入[0.01—99999.99]之间的数"));
      }

      callback();
    }
  }
};
</script>