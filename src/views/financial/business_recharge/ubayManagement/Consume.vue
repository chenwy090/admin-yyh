<template>
  <!--  U贝消耗 changeType = 1  -->
  <div class="consume-edit">
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="660"
    >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{title}}</span>
      </p>
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

          <!-- :rules="{ required: true, message: '请选择${businessTypeLabel}' }" -->
          <FormItem
            :label="`${businessTypeLabel}名称：`"
            prop="businessName"
            :rules="{ required: true, validator: validateBusinessName }"
          >
            <Row>
              <Col span="16">
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
          <Row class="box" style="margin-bottom:20px;">
            <Table
              size="small"
              border
              width="600px"
              :columns="dynamicColumns"
              :data="dynamicTableData"
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
          <!-- 商户余额 money U贝余额 ubay    -->
          <FormItem label="商户余额：">{{money}}&nbsp;元</FormItem>
          <FormItem label="U贝余额：">{{ubay}}&nbsp;贝</FormItem>
          <FormItem
            label="消耗U贝："
            prop="reduceUbay"
            :rules="{ required: true, validator: validateUbay }"
          >
            <Row>
              <Col span="16">
                <Input
                  style="width:80%"
                  v-model="formData.reduceUbay"
                  placeholder="请输入需要消耗U贝的数量"
                  clearable
                />
              </Col>
            </Row>
          </FormItem>
          <!-- 必填项 -->
          <FormItem
            label="备注："
            prop="remark"
            :rules="{ required: true, validator: validateRemarks }"
          >
            <Row>
              <Col span="10">
                <Tooltip trigger="focus" title="提醒" content="最多200个汉字" placement="right">
                  <Input
                    v-model="formData.remark"
                    type="textarea"
                    style="width:300px"
                    :autosize="{minRows: 4,maxRows: 8}"
                    placeholder="请输入200个字符以内备注"
                    :maxlength="200"
                  />
                </Tooltip>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="handleSubmit('form')">确认</Button>
        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
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
import { exchangeAndConsume } from "@/api/sys";
import BusinessList from "../BusinessList";
import BrandList from "../BrandList";
import SuperMarket from "../SuperMarket";

import createTypeDate from "./typeData";
export default {
  name: "consume-edit",
  inject: ["merchantTypeOption", "getMoneyAndUbay", "msgOk", "msgErr"],
  created() {
    this.typeData = createTypeDate();
    this.dynamicColumns = this.typeData.type0.columns;
  },
  components: {
    BusinessList,
    BrandList,
    SuperMarket
  },
  props: {
    showConsume: {
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
    },
    ["formData.money"]() {
      // 对第二个密码框单独验证 如果为空串则认为验证通过,
      this.$refs.form.validateField("money", errMsg => {
        if (errMsg.length) {
          //  有错误
          this.formData.ubay = 0;
        } else {
          //  没错误
          this.formData.ubay = this.formData.money * 1000;
        }
      });
    }
  },
  data() {
    return {
      // 新增、修改 任务抽奖banner
      isShow: true,
      title: "U贝消耗",
      // merchantType 商户/品牌/商超/零售商名称
      businessTypeLabel: "商户",
      businessTypePlaceholder: "商户",
      money: 0, // 商户余额 moneyBalance
      ubay: 0, // U贝余额  ubayBalance
      typeData: {},
      formData: {
        changeType: 1, //U贝兑换0 U贝消耗1 写死
        merchantType: 0,
        businessId: "",
        businessName: "",
        merchantId: "",
        merchantName: "",
        brandId: "", //
        brandName: "", //
        anticipatedDeduction: "", // 应扣款
        actualDeduction: "", //实扣款
        remark: "" //备注 必填
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
      this.$emit(`update:showConsume`, false);
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

          let { code, msg } = await exchangeAndConsume(oForm);

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
    //验证正整数
    validateUbay(rule, value, callback) {
      var reg = /^([1-9][0-9]*)$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于0的正整数"));
      }
    },
    validateRemarks(rule, value, callback) {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("备注不能为空"));
      } else if (value.length < 6) {
        callback(new Error("备注不得少于6个字"));
      } else {
        callback();
      }
    }
  }
};
</script>
<style scoped>
</style>