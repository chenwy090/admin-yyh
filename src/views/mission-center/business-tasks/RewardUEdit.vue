<template>
  <!-- 赏U新增/编辑 RewardUEdit -->
  <div class="reward-u-edit">
    <h2 class="header">任务中心 > 任务模板 > 赏“U”> 新增</h2>
    <Row type="flex" justify="start">
      <Button type="dashed" icon="md-arrow-round-back" @click="goback">返回列表</Button>
    </Row>
    <br />
    <div>
      <Form
        label-position="right"
        ref="form"
        :model="formData"
        :rules="ruleValidate"
        :label-width="100"
      >
        <Row class="task-info">
          <h3>任务信息</h3>

          <FormItem label="任务名称：" prop="name" :rules="{ required: true, message: '请输入任务名称' }">
            <Row>
              <Col span="10">
                <Input
                  style="width:90%"
                  v-model="formData.name"
                  :maxlength="20"
                  placeholder="请输入"
                  clearable
                />
              </Col>
            </Row>
          </FormItem>

          <FormItem label="任务时间：" prop="startTime" :rules="{ required: true, message: '请选择时间' }">
            <Row>
              <Col span="10">
                <DatePicker
                  style="width:90%"
                  type="daterange"
                  format="yyyy-MM-dd"
                  placeholder="请选择时间"
                  :options="m_dateOptions"
                  :value="formData.daterange"
                  @on-change="changeTaskDate"
                  class="date-range"
                ></DatePicker>
              </Col>
            </Row>
          </FormItem>

          <!-- 必填项 -->
          <FormItem label="任务规则：">
            <Row>
              <Col span="10">
                <Tooltip trigger="focus" title="提醒" content="最多500个汉字" placement="right">
                  <Input
                    v-model="formData.ruleDescribe"
                    type="textarea"
                    style="width:400px"
                    :autosize="{minRows: 4,maxRows: 8}"
                    placeholder="请输入500个字符以内"
                    :maxlength="500"
                  />
                </Tooltip>
              </Col>
            </Row>
          </FormItem>
        </Row>
        <Row class="task-reward-Rules">
          <h3>奖励规则</h3>
          <FormItem
            label="奖励规则："
            prop="ruleInfoList"
            :rules="{ required: true, validator: validateRewardRules }"
          >
            <Button type="primary" icon="md-add-circle" size="small" @click="addRewardRules">新增</Button>
          </FormItem>

          <RewardRulesItem
            v-for="(item, index) in formData.ruleInfoList"
            :key="index"
            :item="item"
            :index="index"
            @del="del"
            :refForm="this"
          ></RewardRulesItem>
        </Row>
      </Form>
    </div>

    <div class="demo-drawer-footer">
      <Button type="primary" style="margin-right: 8px" @click="handleSubmit('form')">保存</Button>
      <Button style="margin-right: 8px" @click="closeDialog">取消</Button>
    </div>
  </div>
</template>
<script>
import { addOrEdit } from "@/api/sys";

import comm from "@/mixins/common";
import RewardRulesItem from "./RewardRulesItem";

export default {
  name: "reward-u-edit",
  mixins: [comm],
  inject: ["msgOk", "msgErr"],
  components: {
    RewardRulesItem
  },
  props: {
    showDeduction: {
      type: Boolean,
      default: true
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
            defaultShareLogoList: [],
            shareLogo: ""
          }
        ]
      },
      ruleValidate: {}
    };
  },
  mounted() {
    console.log("xxxxxx mounted", this.$refs.form);

    let { type, data } = this.$store.state.missionCenter;
    //修改
    if (type == "edit") {
      this.formData = data; //任务数据
      console.log("this.formData", data);
    }
  },
  beforeDestroy() {
    this.$store.state.missionCenter.data = {};
  },
  methods: {
    goback() {
      console.log("reward-u");
      this.$store.dispatch("missionCenter/changeCompName", "reward-u");
    },
    del(index) {
      console.log("delrules:", index);
      this.formData.ruleInfoList.splice(index, 1);
    },
    changeTaskDate(arr) {
      console.log("1form.daterange", this.formData.daterange);
      this.formData.daterange = arr;
      console.log("2form.daterange", this.formData.daterange);
      // yyyy-MM-dd
      this.formData.startTime = arr[0];
      this.formData.endTime = arr[1];
    },

    addRewardRules() {
      this.formData.ruleInfoList.push({
        merchantType: 0,
        businessId: "",
        businessName: "",
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
        defaultShareLogoList: [],
        shareLogo: ""
      });
    },

    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      // this.$emit(`update:showDeduction`, false);
      this.goback();
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          const validateZero = [
            "receiveAwardUbay",
            "useAwardUbay",
            "shareReceiveAwardUbay",
            "shareUseAwardUbay"
          ];

          let flag = this.formData.ruleInfoList.some(item => {
            let len = 0;
            validateZero.forEach(name => {
              if (item[name] == 0) {
                len++;
              }
            });

            return len == 4;
          });

          if (flag) {
            return this.msgErr("U贝不能全为0！");
          }
          this.msgOk("数据验证成功!");
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

          console.log("add save:", oForm);
          let url = "";
          if (oForm.id) {
            // 修改
            url = "/merchant/assignment/edit";
          } else {
            // 新增：
            url = "/merchant/assignment/add";
          }

          let res = await addOrEdit(url, oForm);

          if (res.code == 200) {
            // 关闭对话框
            // this.closeDialog();
            //刷新列表数据
            // this.$emit("refresh");
            this.msgOk("保存成功");
            this.goback();
          } else {
            this.msgErr(res.msg);
          }
        } else {
          this.msgErr("数据验证失败！");
        }
      });
    },
    validateRewardRules(rule, value, callback) {
      console.log("validateRewardRules", rule, value);
      if (!value.length) {
        return callback(`请填写奖励规则`);
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
    }
  }
};
</script>
<style scoped>
.reward-u-edit {
  position: relative;
  padding-bottom: 30px;
}
/* .demo-drawer-footer {
  width: 100%;
  position: fixed;;
  bottom: 0;
  left: 300px;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  background: #fff;
} */
</style>