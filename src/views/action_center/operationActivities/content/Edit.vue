<template>
  <!-- 新增/编辑内容 -->
  <div class="edit">
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="600"
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
          :label-width="120"
        >
          <template v-for="(item,index) in formData.activityPicTextList">
            <div :key="item.type">
              <FormItem
                :label="item.picUrlLabel"
                :prop="'activityPicTextList.' + index + '.picUrl'"
              >
                <UploadImage
                  :fileUploadType="'picUrl'"
                  :defaultList="item.defaultPicUrlList"
                  @remove="removePicUrl(index)"
                  @uploadSuccess="picUrlUploadSuccess($event,index)"
                ></UploadImage>
              </FormItem>
              <FormItem
                :label="item.remarkLabel"
                :prop="'activityPicTextList.' + index + '.remark'"
              >
                <Input type="text" v-model="item.remark" placeholder></Input>
              </FormItem>

              <FormItem
                v-if="item.type==4"
                :label="item.buttonTextLabel"
                :prop="'activityPicTextList.' + index + '.buttonText'"
              >
                <Input type="text" v-model="item.buttonText" placeholder></Input>
              </FormItem>
            </div>
          </template>
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

import util from "@/libs/util";
import { postRequest } from "@/libs/axios";
import createFormData from "./createFormData";

import UploadImage from "@/views/action_center/operationActivities/components/UploadImage";

export default {
  name: "edit",
  components: {
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
      activityId: "getActivityId"
    })
  },
  watch: {},
  data() {
    return {
      // 新增、修改 任务抽奖banner
      // /activityInfo/add新增 /activityInfo/edit修改
      url: "/activityInfo/add",
      isShow: true,
      title: "添加内容",
      formData: createFormData(),
      ruleValidate: {}
    };
  },
  async mounted() {
    let { type, data } = this.action;
    this.isShow = true;
    console.log("mounted content edit action:", type, data);
    // 新增
    if (type == "add") {
      this.title = "添加内容";
      this.url = "/activityPic/text/add";
    } else {
      //edit 修改
      this.title = "编辑内容";
      this.url = "/activityPic/text/edit";
    }
    this.formData = data;
  },
  methods: {
    removePicUrl(index) {
      console.log("removePicUrl", index);

      let item = this.formData.activityPicTextList[index];
      item.picUrl = "";
      item.defaultPicUrlList = [];
      this.formData.activityPicTextList.splice(index, 1, item);
    },
    picUrlUploadSuccess({ imgUrl }, index) {
      console.log("picUrlUploadSuccess", imgUrl, index);
      let item = this.formData.activityPicTextList[index];
      item.picUrl = imgUrl;
      item.defaultPicUrlList = [{ imgUrl }];
      this.formData.activityPicTextList.splice(index, 1, item);
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
          this.msgOk("数据验证成功!");

          let oForm = JSON.parse(JSON.stringify(this.formData));
          oForm.activityId = this.activityId;

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