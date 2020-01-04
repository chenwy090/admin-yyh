<template>
  <!--  新建/编辑  -->
  <div class="edit">
    <div>
      <Alert type="warning">图片（大小在1M以内,GIF/JPG/JPEG/PNG格式）</Alert>
      <Form label-position="right" ref="form" :model="formData" :label-width="180">
        <FormItem
          label="页面标题："
          prop="name"
          :rules="{required: true,  validator: validateEmpty('输页面标题',10)}"
        >
          <Tooltip trigger="focus" title="提醒" content="最多10个汉字" placement="right">
            <Input
              style="width:300px"
              v-model="formData.pageTitle"
              placeholder="最多填写10个汉字或20个字母"
              clearable
            />
          </Tooltip>
        </FormItem>
        <FormItem
          label="页面背景："
          prop="pageBackground"
          :rules="{ required: true, message: '页面背景不能为空' }"
        >
          <Input
            style="width:300px"
            v-model="formData.pageBackground"
            placeholder="页面背景"
            clearable
          />
        </FormItem>
        <FormItem label="顶部图片：" prop="headerImgUrl" :rules="{ required: true, message: '请上传图片' }">
          <UploadImage
            :fileUploadType="'headerImgUrl'"
            :defaultList="formData[`default${firstUpperCase('headerImgUrl')}List`]"
            @remove="removeImg('headerImgUrl')"
            @uploadSuccess="imgUploadSuccess($event,'headerImgUrl')"
          ></UploadImage>
        </FormItem>
        <FormItem
          label="我的奖励按钮："
          prop="rewardButtonUrl"
          :rules="{ required: true, message: '请上传图片' }"
        >
          <UploadImage
            :fileUploadType="'rewardButtonUrl'"
            :defaultList="formData[`default${firstUpperCase('rewardButtonUrl')}List`]"
            @remove="removeImg('rewardButtonUrl')"
            @uploadSuccess="imgUploadSuccess($event,'rewardButtonUrl')"
          ></UploadImage>
        </FormItem>
        <FormItem
          label="活动规则按钮："
          prop="eventRuleButtonUrl"
          :rules="{ required: true, message: '请上传图片' }"
        >
          <UploadImage
            :fileUploadType="'eventRuleButtonUrl'"
            :defaultList="formData[`default${firstUpperCase('eventRuleButtonUrl')}List`]"
            @remove="removeImg('eventRuleButtonUrl')"
            @uploadSuccess="imgUploadSuccess($event,'eventRuleButtonUrl')"
          ></UploadImage>
        </FormItem>
        <FormItem
          label="底部（logo）图片："
          prop="footerImgUrl"
          :rules="{ required: true, message: '请上传图片' }"
        >
          <UploadImage
            :fileUploadType="'footerImgUrl'"
            :defaultList="formData[`default${firstUpperCase('footerImgUrl')}List`]"
            @remove="removeImg('footerImgUrl')"
            @uploadSuccess="imgUploadSuccess($event,'footerImgUrl')"
          ></UploadImage>
        </FormItem>

        <FormItem
          label="内容区阴影："
          prop="contentBoxShadow"
          :rules="{ required: true, message: '内容区阴影不能为空' }"
        >
          <Input
            style="width:300px"
            v-model="formData.contentBoxShadow"
            placeholder="页面背景"
            clearable
          />
        </FormItem>

        <FormItem
          label="分享区顶部图："
          prop="couponHeaderImgUrl"
          :rules="{ required: true, message: '请上传图片' }"
        >
          <UploadImage
            :fileUploadType="'couponHeaderImgUrl'"
            :defaultList="formData[`default${firstUpperCase('couponHeaderImgUrl')}List`]"
            @remove="removeImg('couponHeaderImgUrl')"
            @uploadSuccess="imgUploadSuccess($event,'couponHeaderImgUrl')"
          ></UploadImage>
        </FormItem>
        <FormItem
          label="优惠券边框图："
          prop="couponBoxImgUrl"
          :rules="{ required: true, message: '请上传图片' }"
        >
          <UploadImage
            :fileUploadType="'couponBoxImgUrl'"
            :defaultList="formData[`default${firstUpperCase('couponBoxImgUrl')}List`]"
            @remove="removeImg('couponBoxImgUrl')"
            @uploadSuccess="imgUploadSuccess($event,'couponBoxImgUrl')"
          ></UploadImage>
        </FormItem>
        <FormItem
          label="分享区、规则区底部波浪图："
          prop="couponWaveImgUrl"
          :rules="{ required: true, message: '请上传图片' }"
        >
          <UploadImage
            :fileUploadType="'couponWaveImgUrl'"
            :defaultList="formData[`default${firstUpperCase('couponWaveImgUrl')}List`]"
            @remove="removeImg('couponWaveImgUrl')"
            @uploadSuccess="imgUploadSuccess($event,'couponWaveImgUrl')"
          ></UploadImage>
        </FormItem>

        <FormItem
          label="券名称背景颜色："
          prop="couponNameBackground"
          :rules="{ required: true, message: '券名称背景颜色不能为空' }"
        >
          <Input
            style="width:300px"
            v-model="formData.couponNameBackground"
            placeholder="页面背景"
            clearable
          />
        </FormItem>
        <FormItem
          label="券名称背景颜色："
          prop="couponNameBackground"
          :rules="{ required: true, message: '券名称背景颜色不能为空' }"
        >
          <Input
            style="width:300px"
            v-model="formData.couponNameBackground"
            placeholder="页面背景"
            clearable
          />
        </FormItem>
        <FormItem
          label="分享区、规则区背景颜色："
          prop="shareBackground"
          :rules="{ required: true, message: '背景颜色不能为空' }"
        >
          <Input
            style="width:300px"
            v-model="formData.shareBackground"
            placeholder="页面背景"
            clearable
          />
        </FormItem>
      </Form>
    </div>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="closeDialog">取消</Button>
      <Button type="primary" @click="handleSubmit('form')">保存</Button>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("bigc");

import util from "@/libs/util";
import { postRequest } from "@/libs/axios";
import createFormData from "./createFormData";
import UploadImage from "./UploadImage";

//设置单词首字母为大写
const firstUpperCase = s => s.replace(/\b(\w)|\s(\w)/g, m => m.toUpperCase());

export default {
  name: "bigc-edit",
  components: { UploadImage },
  props: {
    action: {
      type: Object,
      default: () => ({
        title: "",
        _id: Math.random(),
        id: "",
        type: "add", //add/edit/detail/audit
        data: {},
      }),
    },
    bigcData: {
      type: Object,
      default: () => createFormData(),
    },
  },
  computed: {
    ...mapState(["assignmentId"]),
  },
  watch: {
    bigcData() {
      this.formData = JSON.parse(JSON.stringify(this.bigcData));
    },
  },
  data() {
    return {
      formData: createFormData(),
    };
  },
  mounted() {},
  methods: {
    ...mapMutations(["setShowBigc"]),
    firstUpperCase,
    removeImg(name) {
      console.log("removeImg", name);
      this.formData[name] = "";
      this.formData[`default${firstUpperCase(name)}List`] = [];
    },
    imgUploadSuccess({ imgUrl }, name) {
      console.log("imgUploadSuccess", imgUrl, name);
      this.formData[name] = imgUrl;
      this.formData[`default${firstUpperCase(name)}List`] = [{ imgUrl }];
    },
    closeDialog() {
      console.log("closeDialog");
      this.setShowBigc(false); //关闭对话框
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          this.msgOk("数据验证成功!");

          let oForm = JSON.parse(JSON.stringify(this.formData));
          oForm.assignmentId = this.assignmentId;

          console.log("submit oForm", oForm);
          // 新增/编辑
          let url = "/merchant/assignment/page/insetOrUpdate";
          let { code, msg } = await postRequest(url, oForm);

          if (code == 200) {
            this.msgOk("保存成功");
            // 关闭对话框
            this.closeDialog();
          } else {
            this.msgErr(msg);
          }
        } else {
          this.msgErr("数据验证失败！");
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
        duration: 3,
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3,
      });
    },
  },
};
</script>
<style scoped>
.edit {
  padding-bottom: 50px;
}
.demo-drawer-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>