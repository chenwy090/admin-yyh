<template>
  <div class="cms">
    {{tab.label}}
    <Form
      label-position="right"
      ref="form"
      :model="formData"
      :rules="ruleValidate"
      :label-width="130"
    >
      <!-- verifyTitle: "string", //一键核销文案
      verifyIconUrl: "string", //一键核销图标
      slogan: "string", //Solagon
      backgroundUrl: "string" //背景图-->
      <FormItem
        label="一键核销文案："
        prop="verifyTitle"
        :rules="{ required: true, message: '请输入一键核销文案' }"
      >
        <Tooltip trigger="focus" title="提醒" content="最多20个汉字" placement="right">
          <Input
            style="width:200px"
            v-model="formData.verifyTitle"
            :maxlength="20"
            placeholder="请输入一键核销文案"
            clearable
          />
        </Tooltip>
      </FormItem>
      <FormItem
        label="一键核销图标："
        prop="verifyIconUrl"
        :rules="{ required: true, message: '请上传一键核销图标' }"
      >
        <UploadImage
          :fileUploadType="'verifyIconUrl'"
          :defaultList="formData.defaultVerifyIconUrlList"
          @remove="removeVerifyIconUrl"
          @uploadSuccess="verifyIconUrlUploadSuccess"
        ></UploadImage>
      </FormItem>
      <FormItem label="背景图：" prop="backgroundUrl" :rules="{ required: true, message: '请上传背景图' }">
        <UploadImage
          :fileUploadType="'backgroundUrl'"
          :defaultList="formData.defaultBackgroundUrlList"
          @remove="removeBackgroundUrl"
          @uploadSuccess="backgroundUrlUploadSuccess"
        ></UploadImage>
      </FormItem>
      <FormItem label="Solagon：" prop="slogan" :rules="{ required: true, message: '请输入Solagon' }">
        <Tooltip trigger="focus" title="提醒" content="最多15个汉字" placement="right">
          <Input
            style="width:200px"
            v-model="formData.slogan"
            :maxlength="15"
            placeholder="请输入Solagon"
            clearable
          />
        </Tooltip>
      </FormItem>
      <div style="margin-top:20px;">
        <FormItem label>
          <Button type="primary" :disabled="submitDisabled" @click="handleSubmit('form')">保存</Button>
        </FormItem>
      </div>
    </Form>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/libs/axios";

import UploadImage from "./UploadImage";

export default {
  name: "tab1",
  inject: ["msgOk", "msgErr"],
  components: { UploadImage },
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          id: "tab1",
          name: "xxx",
          label: "核销扫码区",
          compName: "tab1"
        };
      }
    }
  },
  data() {
    return {
      submitDisabled: false,
      formData: {
        id: "",
        verifyTitle: "", //一键核销文案
        verifyIconUrl: "", //一键核销图标
        defaultVerifyIconUrlList: [],
        slogan: "", //Solagon
        backgroundUrl: "", //背景图
        defaultBackgroundUrlList: []
      },
      ruleValidate: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const url = "/page/module/layout/getVerification";

      //  site 页面位置，1：首页、2：首页-平台分红
      const { code, msg, data } = await postRequest(url, { site: 1 });
      if (code == 200) {
        const { verifyIconUrl, backgroundUrl } = data;

        data.defaultVerifyIconUrlList = [];
        data.defaultBackgroundUrlList = [];
        if (verifyIconUrl) {
          data.defaultVerifyIconUrlList.push({ imgUrl: verifyIconUrl });
        }
        if (backgroundUrl) {
          data.defaultBackgroundUrlList.push({ imgUrl: backgroundUrl });
        }

        this.formData = data;
      } else {
        this.msgErr(msg);
      }
    },
    removeVerifyIconUrl() {
      this.formData.verifyIconUrl = "";
      this.formData.defaultVerifyIconUrlList = [];
    },
    removeBackgroundUrl() {
      this.formData.backgroundUrl = "";
      this.formData.defaultBackgroundUrlList = [];
    },
    verifyIconUrlUploadSuccess({ imgUrl }) {
      this.formData.verifyIconUrl = imgUrl;
      this.formData.defaultVerifyIconUrlList = [{ imgUrl }];
    },
    backgroundUrlUploadSuccess({ imgUrl }) {
      this.formData.backgroundUrl = imgUrl;
      this.formData.defaultBackgroundUrlList = [{ imgUrl }];
    },
    handleSubmit(name) {
      // this.submitDisabled = true;
      this.$refs[name].validate(valid => {
        console.log("valid", valid);

        if (!valid) {
          this.msgErr("数据验证失败！");
          // this.submitDisabled = false;
          return;
        }

        // 核销扫码首页配置
        const url = "/page/module/layout/saveVerification";

        //清洗数据
        let formData = JSON.parse(JSON.stringify(this.formData));
        formData.site = 1;
        postRequest(url, formData).then(res => {
          if (res.code == 200) {
            this.msgOk("保存成功");
          } else {
            this.msgErr(res.msg);
          }
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>