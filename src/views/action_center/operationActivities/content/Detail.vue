<template>
  <!-- 新增/编辑内容 -->
  <div class="edit">
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="true"
      footer-hide
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
          :label-width="120"
        >
          <template v-for="item in formData.activityPicTextList">
            <div :key="item.type">
              <FormItem :label="item.picUrlLabel">
                <img :src="item.picUrl" title style="width:88px;height:88px;" />
              </FormItem>
              <FormItem :label="item.remarkLabel">{{item.remark}}</FormItem>
              <FormItem v-if="item.type==4" :label="item.buttonTextLabel">{{item.buttonText}}</FormItem>
            </div>
          </template>
        </Form>
      </div>
      <!-- <div slot="footer">
        <Button @click="closeDialog" style="margin-left: 8px">关闭</Button>
      </div>-->
    </Modal>
  </div>
</template>
<script>
import util from "@/libs/util";
import { postRequest } from "@/libs/axios";
import createFormData from "./createFormData";

import UploadImage from "@/views/action_center/operationActivities/components/UploadImage";

export default {
  name: "detail",
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
  data() {
    return {
      isShow: true,
      title: "查看内容",
      formData: createFormData(),
    };
  },
  async mounted() {
    let { type, data } = this.action;
    this.isShow = true;
    console.log("mounted content edit action:", type, data);
    this.formData = data;
  },
  methods: {
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.isShow = false;
      // this.$emit(`update:showExchange`, false);
    }
  }
};
</script>
<style scoped>
</style>