<template>
  <!--  查看详情页  -->
  <div class="detail">
    <Row style="border:1px solid #ccc">
      <Col span="12">
        <Card>
          <Form label-position="right" :label-width="120">
            <FormItem label="商户类型：">
              <Radio :value="true" disabled>{{formData.merchantTypeName}}</Radio>
            </FormItem>
            <!-- label="商户名称：" -->
            <FormItem :label="`${formData.businessTypeLabel}名称：`">{{formData.businessName}}</FormItem>

            <FormItem label="最低提现金额：">{{formData.withdrawMin}}</FormItem>
            <FormItem label="关联提现账号："></FormItem>
 

            <FormItem label="生效时间：">
              <Radio :value="true" disabled>保存即生效</Radio>
            </FormItem>
          </Form>
        </Card>
      </Col>
      <Col span="12">
        <Card>
          <p slot="title">Use a card with a shadow effect</p>
          <p>Content of card</p>
          <p>Content of card</p>
          <p>Content of card</p>
        </Card>
      </Col>
    </Row>
    <div>
      <Form label-position="right" :label-width="120">
        <FormItem label="商户类型：">
          <Radio :value="true" disabled>{{formData.merchantTypeName}}</Radio>
        </FormItem>
        <!-- label="商户名称：" -->
        <FormItem :label="`${formData.businessTypeLabel}名称：`">{{formData.businessName}}</FormItem>

        <FormItem label="提现手续费：">
          <span>企业对公账户：{{info.obj.corporateWithdrawFee.total}}元/每笔（银行{{info.obj.corporateWithdrawFee.bank}}元/每笔、平台{{info.obj.corporateWithdrawFee.platform}}元/每笔）</span>
          <span>个人账户：{{info.obj.individualWithdrawFee.total}}元/每笔（银行{{info.obj.individualWithdrawFee.bank}}元/每笔）</span>
        </FormItem>
        <FormItem label="支付通道费：">
          <span>
            <Radio :value="true" disabled>平台承担</Radio>
            {{info.obj.payPipelineFeeRate.wx}}%/每笔（微信）
          </span>
          <span>{{info.obj.payPipelineFeeRate.aliPay}}%/每笔（支付宝）</span>
        </FormItem>

        <FormItem label="润模板：">
          <span>商户分润： {{info.obj.shareProfitRate.merchant}}%/每笔</span>
          <span>平台分润： {{info.obj.shareProfitRate.platform}}%/每笔</span>
          <span>（未分润部分归平台所有；分润金额四舍五入，保留至小数点两位）</span>
        </FormItem>

        <FormItem label="最低提现金额：">{{formData.withdrawMin}}</FormItem>
        <FormItem label="关联提现账号："></FormItem>

        

        <FormItem label="生效时间：">
          <Radio :value="true" disabled>保存即生效</Radio>
        </FormItem>
      </Form>
    </div>

    <template v-if="action.type=='detail'">
      <div>审核日志</div>
      <Log :id="action.id"></Log>
    </template>
    <template v-else-if="action.type=='audit'">
      <Audit :id="action.id" @refresh="closeDialog"></Audit>
    </template>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="closeDialog">关闭</Button>
    </div>
  </div>
</template>
<script>

// // 日志表格
// import Log from "./Log";
// // 审核
// import Audit from "./Audit";

export default {
  name: "detail",
  // components: { Log, Audit },
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
  props: {
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
    },
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
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;
        data = JSON.parse(JSON.stringify(data));
        this.formData = data;
        this.withdrawUserTableData = data.withdrawUserTableData;
        console.log("mounte detail", this.formData);

        if (type == "detail") {
        } else if (type == "audit") {
        }
      },
      deep: true,
      immediate: true
    }
  },
  // created() {
  mounted() {},
  data() {
    return {
      // 新增、修改 任务抽奖banner
      title: "扣款信息",
      // merchantType 商户/品牌
      // businessTypeLabel: "商户",
      // merchantTypeOption: {
      //   0: "本地商户（单店）",
      //   1: "本地商户（多店）",
      //   2: "商超门店",
      //   3: "零售商"
      // },
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
      formData: {
        merchantType: 0,
        merchantTypeName: "",
        businessId: "",
        businessName: "",
        merchantId: "",
        merchantName: "",
        brandId: "", //
        brandName: "", //
        reduceUbay: "", //消耗U贝
        remark: "remarks" //备注 必填
      },
      withdrawUserTableData: []
    };
  },
  methods: {
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.$emit(`update:showDetail`, false);
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