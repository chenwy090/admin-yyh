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
          <span>企业对公账户：10元/每笔（银行8元/每笔、平台2元/每笔）</span>
          <span>个人账户：1元/每笔（银行1元/每笔）</span>
        </FormItem>
        <FormItem label="支付通道费：">
          <span>平台承担 0.6%/每笔（微信）</span>
          <span>0.6%/每笔（支付宝）</span>
        </FormItem>

        <FormItem label="润模板：">
          <span>商户分润： 97%/每笔</span>
          <span>平台分润： 3%/每笔</span>
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
              />不填，则不限制
            </Col>
          </Row>
        </FormItem>
        <FormItem
          label="关联提现账号："
          prop="withdrawUserId"
          :rules="{ required: true, validator: validateContractNumber }"
        >
          <Button type="primary" class="marginLeft20" @click="handleChoose">选择商户账号</Button>（只有关联账号才可以提现，提现余额为结算商户所有余额）
        </FormItem>
        <Row class="box" style="margin-bottom:20px; ">
          <Table
            size="small"
            border
            width="540"
            :columns="withdrawUserColumns"
            :data="withdrawUserTableData"
          >
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

        <FormItem label="生效时间：">
          <Radio :value="true" disabled>保存即生效</Radio>
        </FormItem>
        <FormItem label="审核结果：">
          <Radio :value="true" disabled>保存即生效</Radio>
        </FormItem>

        <FormItem label="审核结果：" prop="status">
          <RadioGroup v-model="formData.status">
            <Radio v-for="item in merchantTypeOption" :label="item.value" :key="item.value">
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>

        <!-- 必填项 -->
        <FormItem label="原因：">
          <Row>
            <Col span="10">
              <Tooltip trigger="focus" title="提醒" content="最多100个汉字" placement="right">
                <Input
                  v-model="formData.remark"
                  type="textarea"
                  style="width:300px"
                  :autosize="{minRows: 4,maxRows: 8}"
                  placeholder="请输入100字以内未通过原因"
                  :maxlength="500"
                />
              </Tooltip>
            </Col>
          </Row>
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
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("financial");

import { postRequest } from "@/libs/axios";
import { formatDate } from "@/libs/dataUtil";
import { rechargeAndDeduction } from "@/api/sys";

import BusinessList from "./BusinessList";
import BrandList from "./BrandList";

import createTypeDate from "./typeData";

import { withdrawUserColumns } from "./columns";

export default {
  name: "edit",
  created() {
    this.typeData = createTypeDate();
    this.dynamicColumns = this.typeData.type0.columns;
  },
  components: {
    BusinessList,
    BrandList
  },
  props: {
    showEdit: {
      type: Boolean,
      default: true
    }
  },
  computed: {},
  watch: {
    ["formData.merchantType"]() {
      const { merchantType: type } = this.formData;

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
    },
    ["formData.withdrawMin"]() {
      const { withdrawMin } = this.formData;
      this.formData.requiredWithdrawMin = !!withdrawMin.length;
      console.log(this.formData.requiredWithdrawMin);

      if (this.formData.requiredWithdrawMin) {
        this.$refs.form.validateField("withdrawMin");
      } else {
        // this.$refs.form.resetFields();
        this.$refs.form.fields.some(function(e) {
          let r = e.prop == "withdrawMin";
          r && e.resetField();
          return r;
        });
      }
    }
  },
  data() {
    return {
      // 新增、修改 任务抽奖banner
      isShow: false,
      title: "扣款信息",
      // merchantType 商户/品牌/商超/零售商名称
      businessTypeLabel: "商户",
      businessTypePlaceholder: "商户",
      money: 0, // 商户余额 moneyBalance
      ubay: 0, // U贝余额  ubayBalance
      typeData: {},
      formData: {
        requiredWithdrawMin: false,
        withdrawMin: "",
        changeType: 0, //充值0 扣款1 写死
        merchantType: 0,
        businessId: "",
        businessName: "",
        merchantId: "",
        merchantName: "",
        brandId: "", //
        brandName: "", //
        receivables: "", //应收款
        contractNumber: "", //合同号
        biller: "", //签单销售 销售名字 salesName
        // 签单销售
        remark: "" //备注 必填
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
      withdrawUserColumns,
      withdrawUserTableData: []
    };
  },
  methods: {
    selectedTrCallBack(data) {
      console.log("selectedTrCallBack----", data);
      const { merchantType: type, id, name, row } = data;

      let typeData = this.typeData[`type${type}`];
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

          // 提交的时候清理数据
          const {
            merchantType: type,
            businessId: id,
            businessName: name
          } = oForm;

          if (type == 0) {
            oForm.merchantId = id;
            oForm.merchantName = name;

            oForm.brandId = "";
            oForm.brandName = "";
          } else {
            oForm.brandId = id;
            oForm.brandName = name;

            oForm.merchantId = "";
            oForm.merchantName = "";
          }

          console.log("submit oForm", oForm);

          let { code, msg } = await rechargeAndDeduction(oForm);

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