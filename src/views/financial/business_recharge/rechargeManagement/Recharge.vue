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
        <FormItem label="商户类型：" prop="merchantType">
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
                  v-model="formData.businessName"
                  :placeholder="`点击按钮选择${businessTypePlaceholder}`"
                  disabled
                >
                  <Button @click="handleChoose" slot="append">选择</Button>
                </Input>
              </template>
              <template v-else>
                <Select
                  :label="formData.businessName"
                  ref="retailerSel"
                  @on-clear="clearSel"
                  clearable
                >
                  <Option
                    v-for="item in retailerInfoList"
                    :value="item.venderId"
                    :label="item.venderName"
                    :key="item.venderId"
                    @click.native="selectRetailer(item)"
                  >
                    <span>{{item.venderName}}</span>
                    <span style="float:right;">关联店铺数{{item.num}}</span>
                  </Option>
                </Select>
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

        <!-- 商户余额 money U贝余额 ubay    -->
        <FormItem label="商户余额：">{{money}}&nbsp;元</FormItem>
        <FormItem label="U贝余额：">{{ubay}}&nbsp;贝</FormItem>

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
                  v-model="formData.remark"
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
          prop="merchantMoneyChargesRecords"
          :rules="{ required: true, validator: validateCompatibleList }"
        >
          <Button type="primary" icon="md-add-circle" size="small" @click="compatible_addInfo">新增</Button>
        </FormItem>
        <FeeEntry
          v-if="formData.merchantMoneyChargesRecords.length"
          :merchantMoneyChargesRecords="formData.merchantMoneyChargesRecords"
        ></FeeEntry>
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
    <SuperMarket
      v-if="showSuperMarketList"
      :showSuperMarketList.sync="showSuperMarketList"
      @seclectedTr-event="selectedTrCallBack"
    ></SuperMarket>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("financial");

import { formatDate } from "@/libs/dataUtil";
import { rechargeAndDeduction } from "@/api/sys";

import BusinessList from "../BusinessList";
import BrandList from "../BrandList";
import SuperMarket from "../SuperMarket";
import FeeEntry from "./FeeEntry";

import createTypeDate from "./typeData";

export default {
  name: "recharge-edit",
  inject: ["merchantTypeOption", "getMoneyAndUbay", "msgOk", "msgErr"],
  created() {
    this.typeData = createTypeDate();
    this.dynamicColumns = this.typeData.type0.columns;
  },
  components: {
    BusinessList,
    FeeEntry,
    BrandList,
    SuperMarket
  },
  props: {
    showRecharge: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState(["retailerInfoList"])
  },
  watch: {
    ["formData.merchantType"]() {
      const type = this.formData.merchantType;

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
        remark: "", //备注 必填
        merchantMoneyChargesRecords: [] //收款明细
      },
      ruleValidate: {},
      showBusinessList: false,
      showBrandList: false,
      showSuperMarketList: false,
      // dynamicColumns: typeData.type0.columns,
      dynamicColumns: [],
      dynamicTableData: []
    };
  },
  methods: {
    compatible_addInfo() {
      this.formData.merchantMoneyChargesRecords.push({
        id: "",
        paymentMode: "",
        actualAmount: "",
        payee: "",
        receivedDate: "",
        receivedDateStr: "",
        serialNumber: ""
      });
    },
    selectRetailer(row) {
      // venderName: "上海世纪联华", num: 7, venderId: "80"}
      const { venderId: id, venderName: name, num } = row;
      const { merchantType: type } = this.formData;
      let typeData = this.typeData[`type${type}`];
      this.formData.businessId = typeData.id = id;
      this.formData.businessName = typeData.name = name;
      this.dynamicTableData = typeData.tableData = [{ ...row }];
      console.log("dynamicTableData", JSON.stringify(this.dynamicTableData));

      this.setMoneyAndUbay(type, id);
    },
    selectedTrCallBack(data) {
      console.log("selectedTrCallBack----", data);
      const { merchantType: type, id, name, row } = data;

      let typeData = this.typeData[`type${type}`];
      this.formData.businessId = typeData.id = id;
      this.formData.businessName = typeData.name = name;
      this.dynamicTableData = typeData.tableData = [row];

      this.setMoneyAndUbay(type, id);
    },
    async setMoneyAndUbay(type, id) {
      const { money, ubay } = await this.getMoneyAndUbay(type, id);
      this.money = money;
      this.ubay = ubay;
    },
    handleChoose() {
      //  '商户类型 0-本地商户（单店），1-本地商户（多店）' 2 商超门店、3 零售商
      const arr = [
        "showBusinessList",
        "showBrandList",
        "showSuperMarketList",
        "retailer"
      ];
      const type = this.formData.merchantType;
      this[arr[type]] = true;
    },
    clearSel() {
      // 清空select绑定值
      // this.$refs.retailerSel.clearSingleSelect();
      console.log("clear");
      const type = this.formData.merchantType;
      let typeData = this.typeData[`type${type}`];

      this.formData.businessId = typeData.id = "";
      this.formData.businessName = typeData.name = "";
      this.dynamicTableData = typeData.tableData = [];
      this.money = 0;
      this.ubay = 0;
    },
    remove() {
      const type = this.formData.merchantType;
      let typeData = this.typeData[`type${type}`];

      this.formData.businessId = typeData.id = "";
      this.formData.businessName = typeData.name = "";
      this.dynamicTableData = typeData.tableData = [];

      this.money = 0;
      this.ubay = 0;

      if (type == 3) {
        // 清空select绑定值
        this.$refs.retailerSel.clearSingleSelect();
      }
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

          // 应收款:给后端*100 转分
          oForm.receivables *= 100;

          oForm.merchantMoneyChargesRecords = oForm.merchantMoneyChargesRecords.map(
            item => {
              item.actualAmount *= 100;
              item.receivedDateStr = formatDate(
                new Date(item.receivedDate),
                "yyyy-MM-dd hh:mm:ss"
              );
              return item;
            }
          );

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
          this.$Message.error("数据验证失败！");
        }
      });
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
        return callback(`请选择${this.businessTypePlaceholder}`);
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