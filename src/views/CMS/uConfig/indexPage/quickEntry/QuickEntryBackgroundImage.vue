<template>
  <!--  快捷入口 QuickEntry  -->
  <div class="cms">
    <Form
      label-position="right"
      ref="form"
      :model="formData"
      :rules="ruleValidate"
      :label-width="130"
    >
      <FormItem label="快捷入口背景图：" prop="iconUrl" :rules="{ required: true, message: '请上传图片' }">
        <UploadImage
          :fileUploadType="'iconUrl'"
          :defaultList="formData.defaultIconUrlList"
          @remove="removeIconUrl"
          @uploadSuccess="iconUrlUploadSuccess"
        ></UploadImage>
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
import { postRequest } from "@/libs/axios";

import UploadImage from "../UploadImage";

export default {
  name: "QuickEntryBackgroundImage",
  inject: ["msgOk", "msgErr"],
  components: { UploadImage },
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          id: "QuickEntry",
          // type: 4,
          type: 8,
          site: 1,
          label: "快捷入口",
          compName: "QuickEntry"
        };
      }
    }
  },
  data() {
    return {
      submitDisabled: false,
      formData: {
        id: "",
        iconUrl: "", //首页分红banner图片
        defaultIconUrlList: []
      },
      ruleValidate: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const url = "/page/module/layout/getCommonSetting";
      //  平台分红：4
      const { type, site } = this.tab;
      //  site 页面位置，1：首页、2：首页-平台分红
      let { code, msg, data } = await postRequest(url, { type, site });
      if (code == 200) {
        if (data == "") {
          data = {
            id: "",
            iconUrl: "", //首页分红banner图片
            defaultIconUrlList: []
          };
        }
        const { iconUrl } = data;

        data.defaultIconUrlList = [];
        if (iconUrl) {
          data.defaultIconUrlList.push({ imgUrl: iconUrl });
        }

        this.formData = data;
      } else {
        this.msgErr(msg);
      }
    },
    removeIconUrl() {
      this.formData.iconUrl = "";
      this.formData.defaultIconUrlList = [];
    },
    iconUrlUploadSuccess({ imgUrl }) {
      this.formData.iconUrl = imgUrl;
      this.formData.defaultIconUrlList = [{ imgUrl }];
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        console.log("valid", valid);

        if (!valid) {
          this.msgErr("数据验证失败！");
          return;
        }

        // 核销扫码首页配置
        const url = "/page/module/layout/saveCommonSetting";

        //清洗数据
        let formData = JSON.parse(JSON.stringify(this.formData));

        const { type, site } = this.tab;
        formData.type = type;
        formData.site = site;
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