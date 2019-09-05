<template>
  <!--  消耗  -->
  <div class="consume-edit">
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
          <FormItem label="消耗U贝：" prop="ubay" :rules="{ required: true, validator: validateUbay }">
            <Row>
              <Col span="16">
                <Input style="width:80%" v-model="form.ubay" placeholder="请输入需要消耗U贝的数量" clearable />
              </Col>
            </Row>
          </FormItem>
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
  name: "consume-edit",
  components: {
    BusinessList
  },
  props: {
    showConsume: {
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
      title: "U贝消耗",
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
        ubay: "", //
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
    validateUbay(rule, value, callback) {
      var reg = /^([1-9][0-9]*)$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于0的正整数"));
      }
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
      this.$emit(`update:showConsume`, false);
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