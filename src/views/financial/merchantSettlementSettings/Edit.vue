<template>
  <!--  新建/编辑  -->
  <div class="edit">
    <div>
      <Form
        label-position="right"
        ref="form"
        :model="formData"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem label="结算商户类型：" prop="merchantType">
          <RadioGroup v-model="formData.merchantType">
            <Radio v-for="item in merchantTypeOption" :label="item.value" :key="item.value">
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>

        <FormItem
          :label="`${businessTypeLabel}名称：`"
          :prop="`businessName`"
          :rules="{ required: true, validator: validateBusinessName }"
        >
          <Row>
            <Col span="12">
              <template v-if="formData.merchantType!=3">
                <Input
                  v-model.trim="formData.businessName"
                  :placeholder="`点击按钮选择${businessTypePlaceholder}`"
                  disabled
                >
                  <Button @click="handleChoose" slot="append">选择</Button>
                </Input>
              </template>
            </Col>
          </Row>
        </FormItem>

        <Row class="box" style="margin-bottom:20px; ">
          <Table size="small" border width="540" :columns="dynamicColumns" :data="dynamicTableData">
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

        <FormItem label="提现手续费：">
          <span>企业对公账户：{{info.obj.corporateWithdrawFee.total}}元/每笔（银行{{info.obj.corporateWithdrawFee.bank}}元/每笔、平台{{info.obj.corporateWithdrawFee.platform}}元/每笔）</span>
          <span>个人账户：{{info.obj.individualWithdrawFee.total}}元/每笔（银行{{info.obj.individualWithdrawFee.bank}}元/每笔）</span>
        </FormItem>
        <FormItem label="支付通道费：">
          <span>
            <Radio :value="true">平台承担</Radio>
            {{info.obj.payPipelineFeeRate.wx}}%/每笔（微信）
          </span>
          <span>{{info.obj.payPipelineFeeRate.aliPay}}%/每笔（支付宝）</span>
        </FormItem>

        <FormItem label="润模板：">
          <span>商户分润： {{info.obj.shareProfitRate.merchant}}%/每笔</span>
          <span>平台分润： {{info.obj.shareProfitRate.platform}}%/每笔</span>
          <span>（未分润部分归平台所有；分润金额四舍五入，保留至小数点两位）</span>
        </FormItem>

        <FormItem
          label="最低提现金额："
          prop="withdrawMin"
          :rules="{ required: formData.requiredWithdrawMin, validator:formData.requiredWithdrawMin?validatorWithdrawMin:null }"
        >
          <Row>
            <Col span="20">
              <Input
                style="width:60%"
                v-model.trim="formData.withdrawMin"
                placeholder="请输入最低提现金额"
                clearable
              />&nbsp;不填，则不限制
            </Col>
          </Row>
        </FormItem>
        <FormItem
          label="关联提现账号："
          prop="withdrawUserId"
          :rules="{ required: true, validator: validateAccountList }"
        >
          <Button type="primary" class="marginLeft20" @click="handleChooseAccount">选择商户账号</Button>（只有关联账号才可以提现，提现余额为结算商户所有余额）
        </FormItem>
        <Row class="box" style="margin-bottom:20px; ">
          <Table size="small" border :columns="withdrawUserColumns" :data="withdrawUserTableData">
            <template slot-scope="{ row, index }" slot="action">
              <Button
                size="small"
                style="color:#2db7f5"
                @click="removeAccount(row,index)"
                icon="ios-trash-outline"
              >移除</Button>
            </template>
          </Table>
        </Row>

        <FormItem label="生效时间：">
          <Radio :value="true">保存即生效</Radio>
        </FormItem>
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
    <BrandList
      v-if="showBrandList"
      :showBrandList.sync="showBrandList"
      @seclectedTr-event="selectedTrCallBack"
    ></BrandList>
    <MerchantAccountList
      v-if="showMerchantAccountList"
      :showMerchantAccountList.sync="showMerchantAccountList"
      :id="formData.businessId"
      :checked="formData.withdrawUserId"
      @seclectedTr-event="selectedAccount"
    ></MerchantAccountList>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("financial");

import { postRequest } from "@/libs/axios";
import { formatDate } from "@/libs/dataUtil";
import { rechargeAndDeduction } from "@/api/sys";

// 商户列表
import BusinessList from "./BusinessList";
// 品牌列表
import BrandList from "./BrandList";
// 关联提现商户 商户账号列表
import MerchantAccountList from "./MerchantAccountList";

import createTypeDate from "./typeData";
let typeData = createTypeDate();

import { withdrawUserColumns } from "./columns";

export default {
  name: "edit",
  created() {
    // console.log("data:",this.data);
    // console.log("created typeData", this.typeData);
    // console.log("created", this.action);
    this.dynamicColumns = this.typeData.type0.columns;
  },
  // mounted() {
  //   console.log("mounted", this.info);
  // },
  inject: {
    info: {
      default: () => {
        return {
          obj: {
            // corporateWithdrawFee: { total: 10, bank: 8, platform: 2 },
            // individualWithdrawFee: { total: 1, bank: 1 },
            // payPipelineFeeRate: { wx: 0.6, aliPay: 0.6 },
            // shareProfitRate: { merchant: 97, platform: 3 }
          }
        };
      }
    }
  },
  components: {
    BusinessList,
    BrandList,
    MerchantAccountList
  },
  props: {
    showEdit: {
      type: Boolean,
      default: true
    },
    action: {
      type: Object,
      default: function() {
        return {
          title: "",
          _id: Math.random(),
          id: "",
          type: "", //add/edit/detail/audit
          data: {}
        };
      }
    }
  },
  computed: {},
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;
        data = JSON.parse(JSON.stringify(data));
        console.log("watch action data:", data);

        if (data.length) {
          this.formData = data;
          this.withdrawUserTableData = data.withdrawUserTableData;
        }

        if (type == "add") {
        } else if (type == "edit") {
          const {
            merchantType,
            businessId: id,
            businessName,
            tableData = []
          } = data;

          let typeData = this.typeData[`type${merchantType}`];
          typeData.id = id;
          typeData.name = businessName;
          this.dynamicColumns = typeData.columns;
          this.dynamicTableData = typeData.tableData = tableData;
        }
      },
      deep: true,
      immediate: true
    },
    ["formData.merchantType"]() {
      const { merchantType: type } = this.formData;

      console.log(11111, type);

      const { id, name, label, desc, columns, tableData } = this.typeData[
        `type${type}`
      ];
      this.formData.businessId = id;
      this.formData.businessName = name;

      this.businessTypeLabel = label;
      this.businessTypePlaceholder = desc;
      this.dynamicColumns = columns;
      this.dynamicTableData = tableData;

      this.$refs.form.validateField("businessName");
      console.log("businessName", this.formData.businessName);
    },
    ["formData.withdrawMin"]() {
      const { withdrawMin } = this.formData;
      this.formData.requiredWithdrawMin = !!withdrawMin.length;
      console.log(
        "withdrawMin:",
        withdrawMin,
        withdrawMin.length,
        this.formData.requiredWithdrawMin
      );

      if (this.formData.requiredWithdrawMin) {
        this.$refs.form.validateField("withdrawMin");
      } else {
        // this.$refs.form.resetFields();
        // this.formData.withdrawMin = "";
        this.$nextTick(_ => {
          this.$refs.form.fields.some(field => {
            let r = field.prop == "withdrawMin";
            if (r) {
              console.log(field);
              field.validateState = "success";
              // field.resetField();
            }
            return r;
          });
        });
      }
    }
  },
  data() {
    return {
      merchantId: "",
      // 新增、修改 任务抽奖banner
      isShow: false,
      title: "扣款信息",
      showMerchantAccountList: false,
      // merchantType 商户/品牌/商超/零售商名称
      businessTypeLabel: "商户",
      businessTypePlaceholder: "商户",
      money: 0, // 商户余额 moneyBalance
      ubay: 0, // U贝余额  ubayBalance
      typeData,
      formData: {
        id: "",
        merchantType: 0,
        fundAccountId: "",
        withdrawMin: "",
        requiredWithdrawMin: false,

        pipelineFeeType: 1, //支付通道费类型

        businessId: "",
        businessName: "",
        merchantId: "",
        merchantName: "",
        brandId: "", //
        brandName: "", //
        withdrawUserId: [],
        withdrawUserTableData: []
      },
      ruleValidate: {},
      showBusinessList: false,
      showBrandList: false,
      //  '商户类型 0-本地商户（单店），1-本地商户（多店）' 2 商超门店、3 零售商
      merchantTypeOption: [
        {
          value: 0,
          label: "本地商户（单店）"
        },
        {
          value: 1,
          label: "本地商户（多店）"
        }
      ],
      // dynamicColumns: typeData.type0.columns,
      dynamicColumns: [],
      dynamicTableData: [],
      withdrawUserColumns: [
        ...withdrawUserColumns,
        {
          title: "操作",
          align: "center",
          width: 100,
          fixed: "right",
          slot: "action"
        }
      ],
      withdrawUserTableData: []
    };
  },

  methods: {
    selectedAccount(arr) {
      console.log("selectedTrCallBack----", arr);
      this.withdrawUserTableData = arr;
    },
    selectedTrCallBack(data) {
      console.log("selectedTrCallBack----", data);
      const { merchantType: type, id, name, row } = data;

      let typeData = this.typeData[`type${type}`];
      this.formData.fundAccountId = row.basicId;
      this.formData.businessId = typeData.id = id;
      this.formData.businessName = typeData.name = name;
      this.dynamicTableData = typeData.tableData = [row];
    },
    handleChoose() {
      //  '商户类型 0-本地商户（单店），1-本地商户（多店）' 2 商超门店、3 零售商
      const arr = ["showBusinessList", "showBrandList"];
      const type = this.formData.merchantType;
      this[arr[type]] = true;
    },
    handleChooseAccount() {
      this.showMerchantAccountList = true;
      console.log(this.formData.businessId);
    },
    removeAccount(row, index) {
      this.withdrawUserTableData.splice(index, 1);
    },
    remove() {
      const type = this.formData.merchantType;
      let typeData = this.typeData[`type${type}`];

      this.formData.businessId = typeData.id = "";
      this.formData.businessName = typeData.name = "";
      this.dynamicTableData = typeData.tableData = [];
    },
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.$emit(`update:showEdit`, false);
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.$Message.success("数据验证成功!");

          let oForm = JSON.parse(JSON.stringify(this.formData));

          // // 提交的时候清理数据
          // const { withdrawUserId } = oForm;
          oForm.withdrawUserId = this.withdrawUserTableData.map(item => {
            return item.userId;
          });

          console.log("submit oForm", oForm);
          // 新增/编辑
          let url = "/trade/merchant/account/setting/save";
          if (oForm.id) {
            //编辑
            url = "/trade/merchant/account/setting/update";
          }

          let { code, msg } = await postRequest(url, oForm);

          if (code == 200) {
            this.msgOk("保存成功");
            // 关闭对话框
            this.closeDialog();
            //刷新列表数据
            this.$emit("refresh");
          } else {
            this.msgErr(msg);
          }
        } else {
          this.msgErr("数据验证失败！");
        }
      });
    },
    validateBusinessName(rule, value, callback) {
      value += "";
      value = value.trim();
      // 允许不填
      if (value == "") {
        // ("请选择${businessTypeLabel}");
        return callback(`请选择${this.businessTypePlaceholder}`);
      }
      callback();
    },
    //验证金额 validateMoney
    validatorWithdrawMin(rule, value, callback) {
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
    validateAccountList(rule, value, callback) {
      console.log("validateAccountList", rule, value);
      // if (!value.length) {
      if (!this.withdrawUserTableData.length) {
        return callback("请选择商户账号");
      }
      callback();
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
.edit {
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