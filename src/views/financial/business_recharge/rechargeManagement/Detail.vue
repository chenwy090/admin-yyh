<template>
  <!--  查看充值详情页  -->
  <div class="money-detail">
    <div>
      <Form label-position="right" ref="form" :model="formData" :label-width="100">
        <FormItem label="商户类型：">
          <Radio :value="true" disabled>{{formData.merchantTypeName}}</Radio>
        </FormItem>

        <FormItem label="商户名称：">
          <Row>
            <Col span="16">
              <Input v-model="formData.businessName" disabled></Input>
            </Col>
          </Row>
        </FormItem>

        <template v-if="formData.changeType==0">
          <FormItem label="应收款：">
            <Row>
              <Col span="16">
                <Input
                  style="width:80%"
                  v-model="formData.receivables"
                  placeholder="请输入应收款金额，小数点后两位"
                  disabled
                />&nbsp;元
              </Col>
            </Row>
          </FormItem>
          <!-- Contract number -->
          <FormItem label="合同号：">
            <Row>
              <Col span="16">
                <Input
                  style="width:80%"
                  v-model="formData.contractNumber"
                  placeholder="请输入合同号"
                  disabled
                />
              </Col>
            </Row>
          </FormItem>

          <!--签单销售：请输入销售名字 salesName: "", //销售名字 -->
          <FormItem label="签单销售：">
            <Row>
              <Col span="16">
                <Input style="width:80%" v-model="formData.biller" placeholder="请输入销售名字" disabled />
              </Col>
            </Row>
          </FormItem>
        </template>

        <template v-if="formData.changeType==1">
          <!-- anticipatedDeduction // 应扣款 -->
          <FormItem label="应扣款：">
            <Row>
              <Col span="16">
                <Input
                  style="width:80%"
                  v-model="formData.anticipatedDeduction"
                  placeholder="请输入应扣款金额，小数点后两位"
                  disabled
                />&nbsp;元
              </Col>
            </Row>
          </FormItem>
          <!-- actualDeduction  //实扣款 -->
          <FormItem label="实扣款：">
            <Row>
              <Col span="16">
                <Input
                  style="width:80%"
                  v-model="formData.actualDeduction"
                  placeholder="请输入实扣款金额，小数点后两位"
                  disabled
                />&nbsp;元
              </Col>
            </Row>
          </FormItem>
        </template>

        <!-- 必填项 -->
        <FormItem label="备注：">
          <Row>
            <Col span="10">
              <Input
                v-model="formData.remark"
                type="textarea"
                style="width:300px"
                :autosize="{minRows: 4,maxRows: 8}"
                placeholder="请输入500个字符以内备注"
                :maxlength="500"
                disabled
              />
            </Col>
          </Row>
        </FormItem>

        <template v-if="formData.changeType==0">
          <FormItem label="收费条目："></FormItem>
          <FeeEntryDetail
            v-if="formData.merchantMoneyChargesRecords && formData.merchantMoneyChargesRecords.length"
            :merchantMoneyChargesRecords="formData.merchantMoneyChargesRecords"
          ></FeeEntryDetail>
        </template>
      </Form>
    </div>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="closeDialog">关闭</Button>
    </div>
  </div>
</template>
<script>
import FeeEntryDetail from "./FeeEntryDetail";
export default {
  name: "deduction-edit",
  props: {
    showDetail: {
      type: Boolean,
      default: true
    },
    detailData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  components: {
    FeeEntryDetail
  },
  // mounted() {
  created() {
    let data = JSON.parse(JSON.stringify(this.detailData));
    const { merchantType } = data;
    data.merchantTypeName = this.merchantTypeOption[merchantType];
    //  merchantName brandName
    let row = null;
    if (merchantType == 0) {
      data.businessName = data.merchantName;
    } else {
      data.businessName = data.brandName;
    }

    this.formData = data;

    console.log("mounte detail", this.formData);
  },
  data() {
    return {
      // 新增、修改 任务抽奖banner
      isShow: false,
      title: "扣款信息",
      // merchantType 商户/品牌
      businessTypeLabel: "商户",
      merchantTypeOption: { 0: "本地商户（单店）", 1: "本地商户（多店）" },
      formData: {
        changeType: 0, //充值0 扣款1 写死
        merchantType: 0,
        businessId: "",
        businessName: "",
        merchantId: "",
        merchantName: "",
        brandId: "", //
        brandName: "", //
        reduceUbay: "", //消耗U贝
        remark: "remarks" //备注 必填
      },
      tableData: [],
      columns1: [
        {
          title: "商户编号",
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
          title: "操作",
          align: "center",
          width: 140,
          key: "action",
          slot: "operate"
        }
      ],
      columns2: [
        {
          title: "品牌名称",
          align: "center",
          width: 200,
          key: "name"
        },
        {
          title: "关联店铺数",
          align: "center",
          width: 200,
          key: "relationMerchantCount"
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
      const { merchantType, id, name, row } = data;
      this.formData.businessId = id;
      this.formData.businessName = name;
      if (merchantType == 0) {
        this.tableData1 = [row];
      } else {
        this.tableData2 = [row];
      }
    },
    handleChoose() {
      //  商户类型 0-本地商户（单店），1-本地商户（多店）
      if (this.formData.merchantType == 0) {
        this.showBusinessList = true;
      } else {
        // brand品牌
        this.showBrandList = true;
      }
    },

    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.$emit(`update:showDetail`, false);
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.$Message.success("数据验证成功!");

          let oForm = JSON.parse(JSON.stringify(this.formData));

          const type = oForm.merchantType;

          if (type == 0) {
            oForm.merchantId = oForm.businessId;
            oForm.merchantName = oForm.businessName;
          } else {
            oForm.brandId = oForm.businessId;
            oForm.brandName = oForm.businessId;
          }
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