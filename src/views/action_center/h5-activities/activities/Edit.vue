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
        <template v-if="action.type == 'query'">
          <ul class="query-activity">
            <li class="item">
              <span class="label">活动类型：</span>
              <div class="value">定时展示类</div>
            </li>
            <li class="item">
              <span class="label">活动名称：</span>
              <div class="value">定时展示类</div>
            </li>
            <li class="item">
              <span class="label">活动时间：</span>
              <div class="value">定时展示类</div>
            </li>
            <li class="item">
              <span class="label">开放城市：</span>
              <div class="value">定时展示类</div>
            </li>
            <li class="item">
              <span class="label">活动链接：</span>
              <div class="value">www.xxx.com/222<Button type="primary" size="small" style="margin-left:20px;">复制链接</Button></div>
            </li>
          </ul>


        </template>
        <template v-else>
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
              label="活动名称："
              prop="name"
              :rules="{required: true,  validator: validateEmpty('请输入活动名称',15)}"
            >
              <Tooltip trigger="focus" title="提醒" content="最多15个汉字" placement="right">
                <Input style="width:300px" v-model="formData.name" placeholder="请输入活动名称" clearable />
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
            <FormItem
              label="开放城市："
              prop="cityType"
            >
              <RadioGroup v-model="formData.cityType">
                  <Radio label="1">全部城市</Radio>
                  <Radio label="2">指定城市</Radio>
              </RadioGroup>
              <div class="change-city" v-if="formData.cityType == '2'">
                <CheckboxGroup v-model="formData.city">
                  <Checkbox label="杭州"></Checkbox>
                  <Checkbox label="无锡"></Checkbox>
                </CheckboxGroup>
              </div>
            </FormItem>
          </Form>
        </template>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="handleSubmit('form')" v-if="action.type != 'query'">确认</Button>
        <Button @click="closeDialog" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("egg");

import util from "@/libs/util";
import { postRequest } from "@/libs/axios";
import createFormData from "./createFormData";

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
          this.formData = createFormData();
          this.daterange = [];
        } else if(type == "query"){
          this.title = "查看活动";
        }else {
          //edit 修改
          this.title = "修改活动";
          this.url = "/activityInfo/edit";
          this.formData = JSON.parse(JSON.stringify(data));

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
      formData: createFormData(),
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
          // this.$Message.success("数据验证成功!");

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
<style scoped lang="less">
  .change-city{
    border-top:1px #ddd solid;
    width:300px;
  }
  .query-activity{
    list-style:none;
    .item{
      display:flex;
    }
    .label{
      width:80px;
    }
    .value{
      flex:1
    }
  }
</style>