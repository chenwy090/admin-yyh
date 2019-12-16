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
        activityId:{{activityId}}
        <Form
          label-position="right"
          ref="form"
          :model="formData"
          :rules="ruleValidate"
          :label-width="100"
        >
          <FormItem
            label="奖池名称"
            prop="name"
            :rules="{required: true,  validator: validateEmpty('请输入奖池名称',10)}"
          >
            <Tooltip trigger="focus" title="提醒" content="最多10个汉字" placement="right">
              <Input
                style="width:300px"
                v-model="formData.name"
                :maxlength="10"
                placeholder="请输入奖池名称"
                clearable
              />
            </Tooltip>
          </FormItem>
          <FormItem label="适用时间：" prop="beginTime" :rules="{ required: true, message: '请选择时间' }">
            <DatePicker
              type="datetimerange"
              placeholder="请选时间"
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
      // 映射 `this.activityId` 为 `store.getters.getActivityId`
      activityId: "getActivityId"
    })
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;
        this.isShow = true;
        console.log("watch jackpot edit action:");

        // 新增
        if (type == "add") {
          this.title = "添加奖池";
          this.url = "/activity/prizepool/add";
          Object.keys(this.formData).forEach(name => {
            this.formData[name] = "";
          });
          this.daterange = [];
        } else {
          //edit 修改
          this.title = "修改奖池";
          this.url = "/activity/prizepool/edit";

          Object.keys(this.formData).forEach(name => {
            this.formData[name] = data[name];
          });

          let { beginTime, endTime } = data;
          this.daterange = [beginTime, endTime];
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
        activityId: "",
        id: "",
        name: "",
        name: "",
        beginTime: "",
        endTime: "",
        prizepoolType: 1,
        isDeleted: 0
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
          oForm.activityId = this.activityId;
          oForm.prizepoolType = 1;
          oForm.prizepoolType = 1;
          oForm.isDeleted = 0;

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