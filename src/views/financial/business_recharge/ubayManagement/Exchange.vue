<template>
  <!--  兑换  -->
  <div class="exchange-edit">
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
    >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{title}}</span>
      </p>
      <div>
        <Form
          label-position="right"
          ref="form"
          :model="form"
          :rules="ruleValidate"
          :label-width="100"
        >
          <FormItem label="商户类型：" prop="businessType">
            <RadioGroup v-model="form.businessType">
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
                  v-model="form.businessName"
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
          <FormItem label="金额：" prop="money" :rules="{ required: true, validator: validateMoney }">
            <Row>
              <Col span="16">
                <Input
                  style="width:80%"
                  v-model="form.money"
                  placeholder="请输入需要兑换的金额，小数点后两位"
                  clearable
                />&nbsp;元
              </Col>
            </Row>
            <Row>
              <Col span="24">兑换汇率：1元=1000U贝</Col>
            </Row>
          </FormItem>
          <FormItem label="U贝：">{{form.ubay}}（根据兑换金额和汇率实时计算）</FormItem>
          <!-- 必填项 -->
          <FormItem label="备注：" prop="remarks">
            <Row>
              <Col span="10">
                <Tooltip trigger="focus" title="提醒" content="最多200个汉字" placement="right">
                  <Input
                    v-model="form.remarks"
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
  </div>
</template>
<script>
import BusinessList from "../BusinessList";
// import columns from "../columns";
export default {
  name: "exchange-edit",
  components: {
    BusinessList
  },
  props: {
    showExchange: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    dynamicColumns() {
      return this.form.businessType == 1 ? this.columns1 : this.columns2;
    }
  },
  watch: {
    ["form.businessType"]() {
      const type = this.form.businessType;

      // this.$refs.form.resetFields();
      this.businessTypeList.some(item => {
        let r = item.value == type;
        if (r) {
          this.businessTypeLabel = item.label;
        }
        return r;
      });

      this.$refs.form.validateField("businessName");
    },
    ["form.money"]() {
      // 对第二个密码框单独验证 如果为空串则认为验证通过,
      this.$refs.form.validateField("money", errMsg => {
        if (errMsg.length) {
          //  有错误
          this.form.ubay = 0;
        } else {
          //  没错误
          this.form.ubay = this.form.money * 1000;
        }
      });
    }
  },
  data() {
    const validateRemarks = (rule, value, callback) => {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("备注不能为空"));
      } else if (value.length < 6) {
        callback(new Error("备注不得少于6个字"));
      } else {
        callback();
      }
    };
    return {
      // 新增、修改 任务抽奖banner
      isShow: true,
      title: "U贝兑换",
      data: {},
      // businessType 商户/品牌
      businessTypeLabel: "商户",
      businessTypeList: [
        { value: 1, label: "商户" },
        { value: 2, label: "品牌" }
      ],
      form: {
        businessType: 1,
        businessName: "", //
        money: "",
        ubay: 0, //
        remarks: "" //备注 必填
      },
      ruleValidate: {
        remarks: [{ validator: validateRemarks, trigger: "blur" }]
      },
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
    selectedTrCallBack(data) {
      console.log("selectedTrCallBack----", data);
      this.form.businessName = data.name;
      this.tableData = [data.row];
    },
    handleChoose() {
      if (this.form.businessType == 1) {
        this.showBusinessList = true;
      } else {
        // brand品牌
        this.showBusinessList = true;
      }
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
    remove() {
      this.form.businessName = "";
      this.tableData = [];
    },
    changeDrawType(type) {
      console.log(type);
    },
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.$emit(`update:showExchange`, false);
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
</style>