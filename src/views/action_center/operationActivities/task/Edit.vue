<template>
  <!--  U贝兑换 changeType = 0  -->
  <div class="exchange-edit">
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="500"
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
          :label-width="120"
        >
          <FormItem
            label="任务类型："
            prop="assignmentType"
            :rules="{ required: true, message: '请选择任务类型：' }"
          >
            <Select v-model="formData.assignmentType" style="width:300px" clearable>
              <!-- <Option v-for="(v,k) in assignmentTypeOption" :value="k" :key="v">{{ v }}</Option> -->
              <Option
                v-for="item in assignmentTypeOption"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <template v-if="formData.assignmentType==3 || formData.assignmentType==4">
            <FormItem
              label="页面类型 ："
              prop="assignmentType"
              :rules="{ required: true, message: '请选择页面类型：' }"
            >
              <Select v-model="formData.assignmentObjectType" style="width:300px" clearable>
                <!-- <Option v-for="(v,k) in assignmentTypeOption" :value="k" :key="v">{{ v }}</Option> -->
                <Option
                  v-for="item in assignmentObjectTypeOption"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </template>
          <!-- 浏览内容数量 -->
          <template v-if="formData.assignmentObjectType==7 || formData.assignmentObjectType==8">
            <FormItem
              label="浏览内容数量："
              prop="executeNum"
              :rules="{ required: true, validator: validateInt('浏览内容数量') }"
            >
              <Input
                style="width:300px"
                v-model.trim="formData.executeNum"
                placeholder="仅限填写正整数"
                clearable
              />
            </FormItem>
          </template>
          <FormItem
            label="任务标题"
            prop="name"
            :rules="{required: true,  validator: validateEmpty('请输入任务标题',13)}"
          >
            <Tooltip trigger="focus" title="提醒" content="最多13个汉字" placement="right">
              <Input
                style="width:300px"
                v-model="formData.name"
                placeholder="最多填写13个汉字或26个字母"
                clearable
              />
            </Tooltip>
          </FormItem>

          <template v-if="formData.assignmentType==1">
            <FormItem
              :key="Math.random()"
              label="优惠券ID："
              prop="couponId"
              :rules="{ required: true, message: '请选择优惠券ID' }"
            >
              <Row>
                <Col span="16">
                  <Input v-model.trim="formData.couponId" placeholder="点击按钮选择优惠券" disabled>
                    <Button @click="handleChooseCoupon" slot="append">选择</Button>
                  </Input>
                </Col>
              </Row>
            </FormItem>
          </template>

          <template v-if="formData.assignmentType==2">
            <FormItem
              label="每天可完成次数："
              prop="executeNum"
              :rules="{ required: true, validator: validateInt('每天可完成次数') }"
            >
              <Input
                style="width:300px"
                v-model.trim="formData.executeNum"
                placeholder="仅限填写正整数"
                clearable
              />
            </FormItem>
          </template>

          <template v-if="formData.assignmentType==5">
            <FormItem
              label="内容点赞数量："
              prop="executeNum"
              :rules="{ required: true, validator: validateInt('内容点赞数量') }"
            >
              <Input
                style="width:300px"
                v-model.trim="formData.executeNum"
                placeholder="仅限填写正整数"
                clearable
              />
            </FormItem>
          </template>

          <FormItem
            label="奖励能量："
            prop="rewardPoints"
            :rules="{ required: true, validator: validateInt('奖励能量') }"
          >
            <Input
              style="width:300px"
              v-model.trim="formData.rewardPoints"
              placeholder="仅限填写正整数"
              clearable
            />
          </FormItem>

          <template v-if="formData.assignmentType==1">
            <FormItem
              label="是否推荐："
              prop="isRecommend"
              :rules="{ required: true, message: '请选择是否推荐' }"
            >
              <RadioGroup v-model="formData.isRecommend">
                <Radio v-for="item in isRecommendOption" :label="item.value" :key="item.value">
                  <span>{{item.label}}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </template>
        </Form>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="handleSubmit('form')">确认</Button>
        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <CouponList
      v-if="showCouponList"
      :showCouponList.sync="showCouponList"
      @seclectedTr-event="selectedCouponItem"
    ></CouponList>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("egg");

import util from "@/libs/util";
import { postRequest } from "@/libs/axios";
import createFormData from "./createFormData";

import CouponList from "@/views/action_center/operationActivities/components/CouponList";
import UploadImage from "@/views/action_center/operationActivities/components/UploadImage";

export default {
  name: "edit",
  components: {
    CouponList,
    UploadImage
  },
  props: {
    action: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => ({ type: "add" })
    }
  },
  computed: {
    ...mapGetters({
      // 映射 `this.activityId` 为 `store.getters.getActivityId`
      activityId: "getActivityId",
      prizepoolId: "getPrizepoolId"
    })
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;
        this.isShow = true;
        console.log("watch task edit action:");

        // 新增
        if (type == "add") {
          this.title = "新增任务";
          this.url = "/activity/assignment/rule/add";
          this.formData = createFormData();
        } else {
          //edit 修改
          this.title = "编辑任务";
          this.url = "/activity/assignment/rule/edit";
          this.formData = JSON.parse(JSON.stringify(data));
        }
      },
      deep: true
    }
  },
  data() {
    return {
      showCouponList: false,
      // 新增、修改 任务抽奖banner
      // /activityInfo/add新增 /activityInfo/edit修改
      url: "/activityInfo/add",
      isShow: false,
      title: "创建活动",
      // activityTypeOption: [
      //   {
      //     value: 0,
      //     label: "扭蛋机抽奖"
      //   }
      // ],
      /*
      assignmentObjectType  任务类型是1，领优惠券时此字段传优惠券类型，1-商超券 2-周边券 
    页面类型 4-领优惠频道页 5-抽奖广场页 6-活动主页 7-优惠券详情页 8-内容详情页
    */
      // assignmentType
      assignmentTypeOption: [
        { label: "领取优惠券类", value: 1 },
        { label: "邀请助力类", value: 2 },
        { label: "浏览页面类", value: 3 },
        { label: "分享页面类", value: 4 },
        { label: "内容点赞类", value: 5 },
        { label: "下载APP类", value: 6 }
      ],
      // assignmentObjectType
      // 页面类型 4-领优惠频道页 5-抽奖广场页-->改成赚钱频道页 6-活动主页 7-优惠券详情页 8-内容详情页
      assignmentObjectTypeOption: [
        { label: "领优惠频道页", value: 4 },
        { label: "赚钱频道页", value: 5 },
        // { label: "活动主页", value: 6 },
        // { label: "优惠券详情页", value: 7 },
        { label: "内容详情页", value: 8 }
      ],
      // isRecommend 是否推荐：0-未推荐 1-被推荐（好券推荐列表页展示）
      isRecommendOption: [{ label: "是", value: 1 }, { label: "否", value: 0 }],
      formData: createFormData(),
      ruleValidate: {}
    };
  },
  async mounted() {},
  methods: {
    handleChooseCoupon() {
      this.showCouponList = true;
    },
    selectedCouponItem(data) {
      console.log("selectedCouponItem----", data);
      let { couponType, id, name } = data;

      // templateId 券模板id templateName 券模板名称
      this.formData.couponType = couponType;
      this.formData.couponId = id;
      this.formData.couponName = name;
    },

    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.isShow = false;
      // this.$emit(`update:showExchange`, false);
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          // this.msgOk("数据验证成功!");

          let oForm = JSON.parse(JSON.stringify(this.formData));
          oForm.activityId = this.activityId;
          oForm.prizepoolId = this.prizepoolId;
          if (oForm.assignmentType == 1) {
            oForm.assignmentObjectType = oForm.couponType;
            oForm.assignmentObject = oForm.couponId;
          }

          let { code, msg } = await postRequest(this.url, oForm);

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
    validateEmpty(msg, len = 20) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        let length = util.getByteLen(value);
        if (length > len * 2) {
          return callback(`最多只能输入${len}个汉字`);
        }
        callback();
      };
    },
    validateInt(msg) {
      //验证正整数
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        // 允许不填
        if (value == "") {
          return callback(`${msg}不能为空`);
        }
        let reg = /^(0|\+?[1-9][0-9]*)$/;
        if (reg.test(value)) {
          console.log("reg.test(value)", reg.test(value));

          callback();
        } else {
          callback(new Error("请输入大于等于0的正数"));
        }
      };
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