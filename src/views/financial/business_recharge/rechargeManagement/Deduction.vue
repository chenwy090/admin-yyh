<template>
  <!--  扣款  -->
  <div class="deduction-edit">
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
        <FormItem label="应扣款：" prop="money1" :rules="{ required: true, validator: validateMoney }">
          <Row>
            <Col span="16">
              <Input
                style="width:80%"
                v-model="formData.money1"
                placeholder="请输入应扣款金额，小数点后两位"
                clearable
              />&nbsp;元
            </Col>
          </Row>
        </FormItem>
        <FormItem label="实扣款：" prop="money2" :rules="{ required: true, validator: validateMoney }">
          <Row>
            <Col span="16">
              <Input
                style="width:80%"
                v-model="formData.money2"
                placeholder="请输入实扣款金额，小数点后两位"
                clearable
              />&nbsp;元
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
// import columns from "../columns";
export default {
  name: "deduction-edit",
  components: {
    BusinessList
  },
  props: {
    showDeduction: {
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
        money: "",
        ubay: 0, //
        remarks: "" //备注 必填
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
      this.$emit(`update:showDeduction`, false);
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