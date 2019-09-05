<template>
  <!--  充值  -->
  <div class="recharge-edit">
    <div>
      <Form
        label-position="right"
        ref="form"
        :model="formData"
        :rules="ruleValidate"
        :label-width="100"
      >
        <FormItem label="商户类型：" prop="businessType">
          <RadioGroup v-model="formData.businessType">
            <Radio v-for="item in businessTypeList" :label="item.value" :key="item.value">
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>

        <!-- :rules="{ required: true, message: '请选择${businessTypeLabel}' }" -->
        <FormItem
          :label="`所属${businessTypeLabel}：`"
          prop="businessName"
          :rules="{ required: true, validator: validateBusinessName }"
        >
          <Row>
            <Col span="16">
              <Input
                v-model="formData.businessName"
                :placeholder="`点击按钮选择${businessTypeLabel}`"
                disabled
              >
                <Button @click="handleChoose" slot="append">选择</Button>
              </Input>
            </Col>
          </Row>
        </FormItem>
        <Row class="box" style="margin-bottom:20px;">
          <Table size="small" border width="600px" :columns="dynamicColumns" :data="tableData">
            <template slot-scope="{ row }" slot="operate">
              <Button
                size="small"
                style="color:#2db7f5"
                @click="remove(row)"
                icon="ios-trash-outline"
              >移除</Button>
            </template>
          </Table>
        </Row>
        <FormItem
          label="应收款："
          prop="receivables"
          :rules="{ required: true, validator: validateMoney }"
        >
          <Row>
            <Col span="16">
              <Input
                style="width:80%"
                v-model="formData.receivables"
                placeholder="请输入应收款金额，小数点后两位"
                clearable
              />&nbsp;元
            </Col>
          </Row>
        </FormItem>
        <!-- Contract number -->
        <FormItem
          label="合同号："
          prop="contractNumber"
          :rules="{ required: true, validator: validateContractNumber }"
        >
          <Row>
            <Col span="16">
              <Input
                style="width:80%"
                v-model="formData.contractNumber"
                placeholder="请输入合同号"
                clearable
              />
            </Col>
          </Row>
        </FormItem>

        <!--签单销售：请输入销售名字 salesName: "", //销售名字 -->
        <FormItem
          label="签单销售："
          prop="biller"
          :rules="{ required: true, validator: validateSalesName }"
        >
          <Row>
            <Col span="16">
              <Input style="width:80%" v-model="formData.biller" placeholder="请输入销售名字" clearable />
            </Col>
          </Row>
        </FormItem>

        <!-- 必填项 -->
        <FormItem label="备注：">
          <Row>
            <Col span="10">
              <Tooltip trigger="focus" title="提醒" content="最多500个汉字" placement="right">
                <Input
                  v-model="formData.remarks"
                  type="textarea"
                  style="width:300px"
                  :autosize="{minRows: 4,maxRows: 8}"
                  placeholder="请输入500个字符以内备注"
                  :maxlength="500"
                />
              </Tooltip>
            </Col>
          </Row>
        </FormItem>

        <FormItem
          label="收费条目："
          prop="compatibleList"
          :rules="{ required: true, validator: validateCompatibleList }"
        >
          <Button type="primary" icon="md-add-circle" size="small" @click="compatible_addInfo">新增</Button>
        </FormItem>
        <FeeEntry v-if="formData.compatibleList.length" :compatibleList="formData.compatibleList"></FeeEntry>
      </Form>
    </div>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="closeDialog">取消</Button>
      <Button type="primary" @click="handleSubmit('form')">保存</Button>
    </div>

    <BusinessList
      v-if="showBusinessList"
      :showBusinessList.sync="showBusinessList"
      @seclectedTr-event="selectedTrCallBack"
    ></BusinessList>
  </div>
</template>
<script>
import BusinessList from "../BusinessList";
import FeeEntry from "./FeeEntry";
// import columns from "../columns";
export default {
  name: "recharge-edit",
  components: {
    BusinessList,
    FeeEntry
  },
  props: {
    showRecharge: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    dynamicColumns() {
      return this.formData.businessType == 1 ? this.columns1 : this.columns2;
    }
  },
  watch: {
    ["formData.businessType"]() {
      const type = this.formData.businessType;

      // this.$refs.form.resetFields();
      this.businessTypeList.some(item => {
        let r = item.value == type;
        if (r) {
          this.businessTypeLabel = item.label;
        }
        return r;
      });

      this.$refs.form.validateField("businessName");
    }
  },
  data() {
    return {
      // 新增、修改 任务抽奖banner
      isShow: false,
      title: "扣款信息",
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      data: {},
      // businessType 商户/品牌
      businessTypeLabel: "商户",
      businessTypeList: [
        { value: 1, label: "商户" },
        { value: 2, label: "品牌" }
      ],
      formData: {
        businessType: 1,
        businessName: "", //
        receivables: "", //应收款
        contractNumber: "", //合同号
        biller: "", //签单销售 销售名字 salesName
        // 签单销售
        remarks: "", //备注 必填
        compatibleList: [] //收款明细
      },
      ruleValidate: {},
      showBusinessList: false,
      tableData: [],
      columns1: [
        {
          title: "商户编号1",
          align: "center",
          width: 200,
          key: "merchantId"
        },
        {
          title: "商户名称",
          align: "center",
          width: 200,
          key: "name"
        },
        {
          title: "地址",
          align: "center",
          minWidth: 300,
          key: "address"
        },
        {
          title: "操作",
          align: "center",
          width: 140,
          key: "action",
          slot: "operate"
        }
      ],
      columns2: [
        {
          title: "商户编号2",
          align: "center",
          width: 200,
          key: "merchantId"
        },
        {
          title: "商户名称",
          align: "center",
          width: 200,
          key: "name"
        },
        {
          title: "地址",
          align: "center",
          minWidth: 300,
          key: "address"
        },
        {
          title: "操作",
          align: "center",
          width: 140,
          key: "action",
          slot: "operate"
        }
      ]
    };
  },
  methods: {
    compatible_addInfo() {
      this.formData.compatibleList.push({
        id: "",
        paymentMode: "",
        actualAmount: "",
        payee: "",
        receivedDate: "",
        serialNumber: ""
      });
    },
    selectedTrCallBack(data) {
      console.log("selectedTrCallBack----", data);
      this.formData.businessName = data.name;
      this.tableData = [data.row];
    },
    handleChoose() {
      if (this.formData.businessType == 1) {
        this.showBusinessList = true;
      } else {
        // brand品牌
        this.showBusinessList = true;
      }
    },
    validateCompatibleList(rule, value, callback) {
      console.log("validateCompatibleList", rule, value);
      if (!value.length) {
        return callback(`请填写收费条目`);
      }
      callback();
    },
    validateBusinessName(rule, value, callback) {
      value += "";
      value = value.trim();
      // 允许不填
      if (value == "") {
        // ("请选择${businessTypeLabel}");
        return callback(`请选择${this.businessTypeLabel}`);
      }
      callback();
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
        return callback(new Error("兑换的金额不能为0"));
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
    },
    validateContractNumber(rule, value, callback) {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("合同号不能为空,且最多支持30个字"));
      } else if (value.length > 30) {
        callback(new Error("合同号最多支持30个字"));
      } else {
        callback();
      }
    },
    validateSalesName(rule, value, callback) {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("签单销售不能为空"));
      } else if (value.length > 30) {
        callback(new Error("签单销售最多支持30个字"));
      } else {
        callback();
      }
    },
    remove() {
      this.formData.businessName = "";
      this.tableData = [];
    },
    changeDrawType(type) {
      console.log(type);
    },
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.$emit(`update:showRecharge`, false);
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.$Message.success("数据验证成功!");
          let oForm = JSON.parse(JSON.stringify(this.form));
          let { drawType, checkDrawType } = oForm;
          if (drawType == 1) {
            oForm.drawId = checkDrawType;
          } else {
            //drawType == 2
            oForm.linkUrl = checkDrawType;
          }

          // let res = await fnName(oForm);

          // if (res.code == 200) {
          //   // 关闭对话框
          //   this.closeDialog();
          //   //刷新列表数据
          //   this.$emit("refresh");
          // } else {
          //   this.msgErr(res.msg);
          // }
        } else {
          this.$Message.error("数据验证失败！");
        }
      });
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
.recharge-edit {
  padding-bottom: 50px;
}
.demo-drawer-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>