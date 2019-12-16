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
        activityTypeOption:{{activityTypeOption}}
        <Form
          label-position="right"
          ref="form"
          :model="formData"
          :rules="ruleValidate"
          :label-width="100"
        >
          <FormItem
            label="活动类型："
            prop="activityType"
            :rules="{ required: true, message: '请选择活动类型' }"
          >
            <Select v-model="formData.activityType" style="width:300px">
              <Option
                v-for="item in activityTypeOption"
                :value="item.id"
                :key="item.name"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>

          <FormItem
            label="活动名称"
            prop="name"
            :rules="{required: true,  validator: validateEmpty('请输入活动名称',30)}"
          >
            <Tooltip trigger="focus" title="提醒" content="最多15个汉字" placement="right">
              <Input
                style="width:300px"
                v-model="formData.name"
                :maxlength="15"
                placeholder="请输入活动名称"
                clearable
              />
            </Tooltip>
          </FormItem>
          <FormItem label="活动时间：" prop="beginTime" :rules="{ required: true, message: '请选择活动时间' }">
            <DatePicker
              type="datetimerange"
              placeholder="请选择抽奖日期"
              format="yyyy-MM-dd HH:mm:ss"
              style="display:inline-block;width: 300px"
              :value="daterange"
              @on-change="changeTime"
            ></DatePicker>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="handleSubmit('form')">确认</Button>
        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("egg");

import { postRequest } from "@/libs/axios";
export default {
  name: "edit",
  props: {
    action: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => ({ type: "add" })
    }
  },
  computed: {
    ...mapGetters({
      // 映射 `this.activityTypeOption` 为 `store.getters.getActivityTypeOption`
      activityTypeOption: "getActivityTypeOption"
    })
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;
        this.isShow = true;
        console.log("xxxx");

        // 新增
        if (type == "add") {
          this.title = "创建活动";
          this.url = "/activityInfo/add";
          Object.keys(this.formData).forEach(name => {
            this.formData[name] = "";
          });
        } else {
          //edit 修改
          this.title = "修改活动";
          this.url = "/activityInfo/edit";
          this.$nextTick(() => {
            Object.keys(this.formData).forEach(name => {
              this.formData[name] = data[name];
            });

            let { beginTime, endTime } = data;
            this.daterange = [beginTime, endTime];
          });
        }
      },
      deep: true
    }
  },
  data() {
    return {
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
      daterange: [],
      formData: {
        id: "",
        activityType: 0,
        name: "",
        beginTime: "",
        endTime: ""
      },
      ruleValidate: {}
    };
  },
  async mounted() {},
  methods: {
    changeTime(arr) {
      // yyyy-MM-dd HH:mm:ss
      console.log(arr);
      let [beginTime, endTime] = arr;
      this.formData.beginTime = beginTime;
      this.formData.endTime = endTime;
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
          this.$Message.success("数据验证成功!");

          let oForm = JSON.parse(JSON.stringify(this.formData));

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
    },
    validateEmpty(msg, len = 20) {
      return function(rule, value, callback) {
        value += "";
        value = value.trim();
        if (value == "") {
          return callback(msg);
        }
        if (value.length > len) {
          return callback(`最多只能输入${len}个汉字`);
        }
        callback();
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