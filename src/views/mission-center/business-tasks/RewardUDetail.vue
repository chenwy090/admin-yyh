<template>
  <!-- 赏U新增/编辑 RewardUEdit -->
  <div class="reward-u-edit">
    <!-- <h2 class="header">任务中心 > 任务模板 > 赏“U”> 新增</h2> -->
    <div>
      <Form label-position="right" ref="form" :model="formData" :label-width="100">
        <row class="task-info">
          <h3>任务信息</h3>
          <FormItem label="任务名称：">{{formData.name}}</FormItem>
          <FormItem label="任务时间：">{{ formData.daterange.join("--")}}</FormItem>

          <FormItem label="审核：">{{formData.statusName}}</FormItem>
          <FormItem label="状态：">{{formData.isStopName}}</FormItem>
          <FormItem label="任务规则：">
            <Row>
              <Col span="10">
                <!-- {{formData.ruleDescribe}} -->
                <div v-html="formData.ruleDescribe"></div>
              </Col>
            </Row>
          </FormItem>
        </row>
        <row class="task-reward-Rules">
          <h3>奖励规则</h3>
          <RewardRulesItemDetail
            v-for="(item, index) in formData.ruleInfoList"
            :key="index"
            :item="item"
          ></RewardRulesItemDetail>
        </row>
      </Form>
    </div>

    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="closeDialog">关闭</Button>
    </div>
  </div>
</template>
<script>
import RewardRulesItemDetail from "./RewardRulesItemDetail";

export default {
  name: "reward-u-edit",
  components: {
    RewardRulesItemDetail,
  },
  props: {
    showDetail: {
      type: Boolean,
      default: true,
    },
    detailData: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  data() {
    return {
      //审核 status examineType ： “待审核、已通过、未通过” 默认显示“请选择”。  审核状态 0-待审核 1-审核通过 2-审核失败
      statusOption: {
        "0": "待审核",
        "1": "已通过",
        "2": "未通过",
      },
      // 状态 status 显示“未开始、进行中、已结束、已终止”选项。	默认显示“请选择”。
      //  isStop 是否终止 1-中止，0-正常
      isStopOption: {
        "0": "未开始",
        "1": "进行中",
        "2": "已结束",
        "3": "已终止",
      },
      merchantTypeOption: { 0: "本地商户（单店）", 1: "本地商户（多店）" },

      formData: {
        // 任务信息
        id: "", //主键
        name: "", // 任务名称
        startTime: "", // 任务开始时间
        endTime: "", // 任务结束时间
        daterange: [], // 任务时间数组
        ruleDescribe: "", //规则描述

        // 奖励规则
        ruleInfoList: [
          {
            // 商户类型 0-本地商户（单店），1-本地商户（多店）
            merchantType: 0,
            merchantId: "", // 商户id
            merhcantName: "", // 商户名称
            brandId: "", // 品牌id
            brandName: "", // 品牌名称
            anticipatedUbay: "", // 预计消耗u贝数量
            templateId: "", //券模板id
            templateName: "", //券模板名称
            endTime: "", // 任务中止时间
            receivedNum: "", // 领取数量
            receiveAwardUbay: "", // 领取奖励，u贝数
            useAwardUbay: "", // 核销奖励，u贝数
            shareReceiveAwardUbay: "", // 分享后被领取奖励u贝数
            shareUseAwardUbay: "", // 分享后被核销奖励u贝数
            defaultBannerList: [],
            imgUrl: "",
            defaultLogoList: [],
            logoUrl: "",
          },
        ],
      },
    };
  },
  mounted() {
    let data = JSON.parse(JSON.stringify(this.detailData));

    // 审核 status 状态  isStop 是否终止 1-中止，0-正常

    // // statusOption/isStopOption
    // const { isStop, status } = data;

    // data.statusName = this.merchantTypeOption[status]; //审核
    // data.isStopName = this.merchantTypeOption[isStop]; //状态

    // data.ruleInfoList = data.ruleInfoList.map(item => {
    //   //merchantType,
    //   const { merchantType } = item;
    //   item.merchantTypeName = this.merchantTypeOption[merchantType];
    //   return item;
    // });

    this.formData = data;

    console.log("mounte detail", this.formData);
  },
  beforeDestroy() {
    this.$store.state.missionCenter.data = {};
  },
  methods: {
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.$emit(`update:showDetail`, false);
    },
  },
};
</script>
<style scoped>
.reward-u-edit {
  position: relative;
  padding-bottom: 30px;
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