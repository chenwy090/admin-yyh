<template>
  <!--  U贝兑换 changeType = 0  -->
  <div class="exchange-edit">
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      @on-visible-change="visibleChange"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="600"
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
          <FormItem label="奖品类型：" prop="prizeType" :rules="{ required: true, message: '请选择奖品类型' }">
            <Select v-model="formData.prizeType" style="width:300px" clearable>
              <!-- <Option v-for="(v,k) in prizeTypeOption" :value="k" :key="v">{{ v }}</Option> -->
              <Option
                v-for="item in prizeTypeOption"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <template v-if="formData.prizeType==2">
            <FormItem
              :key="Math.random()"
              label="优惠券ID："
              prop="couponId"
              :rules="{ required: true, message: '请选择优惠券' }"
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
          <template v-else-if="formData.prizeType==1">
            <FormItem
              label="奖品名称："
              prop="name"
              :rules="{required: true,  validator: validateEmpty('请输入奖品名称',15)}"
            >
              <Tooltip trigger="focus" title="提醒" content="最多15个汉字" placement="right">
                <Input
                  style="width:300px"
                  v-model.trim="formData.name"
                  placeholder="最多15个汉字或30个字母"
                  clearable
                />
              </Tooltip>
            </FormItem>

            <FormItem label="奖品图片：" prop="prizeImg" :rules="{ required: true, message: '请上传图片' }">
              <UploadImage
                :fileUploadType="'prizeImg'"
                :defaultList="formData.defaultPrizeImgList"
                @remove="removePrizeImg"
                @uploadSuccess="prizeImgUploadSuccess"
              ></UploadImage>
            </FormItem>
            <FormItem
              label="奖品价值："
              prop="prizeValue"
              :rules="{ required: true, validator: validateInt('奖品价值') }"
            >
              <Input
                style="width:300px"
                v-model.trim="formData.prizeValue"
                placeholder="仅限填写正整数"
                clearable
              />&nbsp;元
            </FormItem>
          </template>
          <FormItem label="奖励类型：" prop="level" :rules="{ required: true, message: '请选择奖励类型' }">
            <RadioGroup v-model="formData.level">
              <Radio v-for="item in levelOption" :label="item.value" :key="item.value">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            label="奖品库存："
            prop="prizeNum"
            :rules="{ required: true, validator: validateInt('奖品库存') }"
          >
            <Input
              style="width:300px"
              v-model.trim="formData.prizeNum"
              placeholder="仅限填写正整数"
              clearable
            />
          </FormItem>
          <FormItem label="抽中的方式：" prop="level" :rules="{ required: true, message: '请选择奖方式' }">
            <RadioGroup v-model="formData.drawMode">
              <Radio v-for="item in drawModeOption" :label="item.value" :key="item.value">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <template v-if="formData.drawMode==1">
            <FormItem prop="winningPercent" :rules="{ required: true, message: '请输入中奖概率' }">
              <Input
                style="width:300px"
                v-model.trim="formData.winningPercent"
                placeholder="仅限填写0-100间的整数"
                clearable
              />&nbsp;%
              <div style="color:red;font-size:12px;">当前奖池剩余中奖概率为{{lastPercent}}%</div>
            </FormItem>
          </template>
          <template v-else-if="formData.drawMode==2">
            <FormItem prop="winningNo" :rules="{ required: true, message: '请输入抽奖次数' }">
              <Input
                style="width:300px"
                v-model.trim="formData.winningNo"
                placeholder="仅限填写正整数"
                clearable
              />
              <div style="color:red;font-size:12px;">注：若输入多个次数，可用"-"（减号）分隔，且次数的数量与奖品库存必须一致</div>
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
    prizepoolId() {
      console.log("watch:prizepoolId", this.prizepoolId);
    },
    ["formData.prizeType"]() {
      // this.$refs.form.resetFields();
      // this.$refs.form.fields.forEach(field => {
      //   console.log(field.prop);
      //   // if (field.prop == "modelIterationTime") {
      //   //   field.resetField();
      //   // }
      // });
      // this.$refs.form.validateField('xxx');
    },

    ["formData.level"]() {
      this.getPercentByPrizepoolId();
    },
    ["formData.drawMode"]() {
      let { drawMode } = this.formData;
      let fieldName = drawMode == 1 ? "winningPercent" : "winningNo";

      this.$nextTick(_ => {
        this.$refs.form.validateField(fieldName);
      });
    },
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;
        this.isShow = true;
        console.log("watch prize edit action:");
        // 新增
        if (type == "add") {
          this.title = "添加奖品";
          this.url = "/activity/prize/add";
          this.formData = createFormData();
        } else {
          //edit 修改
          this.title = "编辑奖品";
          this.url = "/activity/prize/edit";
          let formData = createFormData();
          let _data = JSON.parse(JSON.stringify(data));

          this.formData = {
            ...formData,
            ..._data
          };
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
      lastPercent: 0,
      // prizeType 奖品类型：1:实物、2：优惠券
      // prizeTypeOption: {
      //   1: "实物",
      //   2: "优惠券"
      // },
      prizeTypeOption: [
        { label: "实物", value: 1 },
        { label: "优惠券", value: 2 }
      ],
      // level 1-大奖 2-普通奖
      // levelOption: {
      //   1: "大奖",
      //   2: "普通奖"
      // },
      levelOption: [{ label: "小奖", value: 2 }, { label: "大奖", value: 1 }],
      // couponType: 1, // 优惠券类型：1：周边券、2：商超券
      // couponTypeOption: {
      //   1: "周边券",
      //   2: "商超券"
      // },
      couponTypeOption: [
        { label: "周边券", value: 1 },
        { label: "商超券", value: 2 }
      ],
      // drawMode: 1, // 1-按概率 2-按奖池累计抽奖次数
      // drawModeOption: {
      //   1: "按概率",
      //   2: "按奖池累计抽奖次数"
      // },
      drawModeOption: [
        { label: "按概率", value: 1 },
        { label: "按奖池累计抽奖次数", value: 2 }
      ],
      daterange: [],
      formData: createFormData(),
      ruleValidate: {}
    };
  },
  mounted() {},
  methods: {
    removePrizeImg() {
      this.formData.prizeImg = "";
      this.formData.defaultPrizeImgList = [];
    },
    prizeImgUploadSuccess({ imgUrl }) {
      this.formData.prizeImg = imgUrl;
      this.formData.defaultPrizeImgList = [{ imgUrl }];
      console.log("prizeImgUploadSuccess", imgUrl);
    },
    handleChooseCoupon() {
      this.showCouponList = true;
    },
    selectedCouponItem(data) {
      console.log("selectedCouponItem----", data);
      let { couponType, id, name, img } = data;

      // templateId 券模板id templateName 券模板名称
      this.formData.couponType = couponType;
      this.formData.couponId = id;
      this.formData.couponName = name;
      this.formData.couponImg = img;
    },
    visibleChange(isShow) {
      console.log("visibleChange", isShow);
      if (isShow) {
        this.getPercentByPrizepoolId();
      }
    },

    async getPercentByPrizepoolId() {
      // 根据奖池和类别获得剩余概率
      const url = "/activity/prize/getPercentByPrizepoolId";

      let params = {
        prizepoolId: this.prizepoolId,
        level: this.formData.level
      };

      let { code, lastPercent, msg } = await postRequest(url, params);

      if (code == 200) {
        this.lastPercent = lastPercent;
      } else {
        this.msgErr(msg);
      }
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

          let arr = [
            "createBy",
            "gmtCreate",
            "gmtModified",
            "modifiedBy",
            "pageNum",
            "pageSize"
          ];

          arr.forEach(name => {
            delete oForm[name];
          });

          oForm.prizepoolId = this.prizepoolId;

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