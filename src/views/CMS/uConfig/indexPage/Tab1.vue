<template>
  <div class="cms">
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
      <FormItem label="背景图：" prop="backgroundUrl" :rules="{ required: true, message: '请上传背景图' }">
        <UploadImage
                :fileUploadType="'backgroundUrl'"
                :defaultList="formData.defaultBackgroundUrlList"
                @remove="removeBackgroundUrl"
                @uploadSuccess="backgroundUrlUploadSuccess"
        ></UploadImage>
      </FormItem>

      <FormItem label="扫码背景图：" prop="scanCodeImgUrl" :rules="{ required: true, message: '请上传扫码背景图' }">
        <UploadImage
                :fileUploadType="'scanCodeImgUrl'"
                :defaultList="formData.defaultScanCodeImgUrlList"
                @remove="removeScanCodeImgUrl"
                @uploadSuccess="scanCodeImgUrlUploadSuccess"
        ></UploadImage>
      </FormItem>

      <FormItem label="扫码icon：" prop="scanCodeIconUrl" :rules="{ required: true, message: '请上传扫码icon' }">
        <UploadImage
                :fileUploadType="'scanCodeIconUrl'"
                :defaultList="formData.defaultScanCodeIconUrlList"
                @remove="removeScanCodeIconUrl"
                @uploadSuccess="scanCodeIconUrlUploadSuccess"
        ></UploadImage>
      </FormItem>

      <FormItem
        label="扫码主标题："
        prop="scanCodeTitle"
        :rules="{ required: true, message: '请输入扫码主标题' }"
      >
        <Tooltip trigger="focus" title="提醒" content="最多8个汉字" placement="right">
          <Input
            style="width:200px"
            v-model="formData.scanCodeTitle"
            :maxlength="8"
            placeholder="请输入扫码主标题"
            clearable
          />
        </Tooltip>
      </FormItem>

      <FormItem
              label="扫码副标题："
              prop="subtitle"
              :rules="{ required: true, message: '请输入扫码副标题' }"
      >
        <Tooltip trigger="focus" title="提醒" content="最多10个汉字" placement="right">
          <Input
                  style="width:200px"
                  v-model="formData.subtitle"
                  :maxlength="10"
                  placeholder="请输入扫码副标题"
                  clearable
          />
        </Tooltip>
      </FormItem>

      <FormItem label="结算背景图：" prop="settlementImgUrl" :rules="{ required: true, message: '请上传结算背景图' }">
        <UploadImage
                :fileUploadType="'settlementImgUrl'"
                :defaultList="formData.defaultSettlementImgUrlList"
                @remove="removeSettlementImgUrl"
                @uploadSuccess="settlementImgUrlUploadSuccess"
        ></UploadImage>
      </FormItem>

      <FormItem label="结算icon：" prop="settlementIconUrl" :rules="{ required: true, message: '请上传结算icon' }">
        <UploadImage
                :fileUploadType="'settlementIconUrl'"
                :defaultList="formData.defaultSettlementIconUrlList"
                @remove="removeSettlementIconUrl"
                @uploadSuccess="settlementIconUrlUploadSuccess"
        ></UploadImage>
      </FormItem>

      <FormItem
              label="结算标题："
              prop="settlementTitle"
              :rules="{ required: true, message: '请输入结算标题' }"
      >
        <Tooltip trigger="focus" title="提醒" content="最多4个汉字" placement="right">
          <Input
                  style="width:200px"
                  v-model="formData.settlementTitle"
                  :maxlength="4"
                  placeholder="请输入扫结算标题"
                  clearable
          />
        </Tooltip>
      </FormItem>

      <FormItem label="条码背景图：" prop="barcodeImgUrl" :rules="{ required: true, message: '请上传条码背景图' }">
        <UploadImage
                :fileUploadType="'barcodeImgUrl'"
                :defaultList="formData.defaultBarcodeImgUrlList"
                @remove="removeBarcodeImgUrl"
                @uploadSuccess="barcodeImgUrlUploadSuccess"
        ></UploadImage>
      </FormItem>

      <FormItem label="条码icon：" prop="barcodeIconUrl" :rules="{ required: true, message: '请上传条码icon' }">
        <UploadImage
                :fileUploadType="'barcodeIconUrl'"
                :defaultList="formData.defaultBarcodeIconUrlList"
                @remove="removeBarcodeIconUrl"
                @uploadSuccess="barcodeIconUrlUploadSuccess"
        ></UploadImage>
      </FormItem>

      <FormItem
              label="条码标题："
              prop="barcodeTitle"
              :rules="{ required: true, message: '请输入条码标题' }"
      >
        <Tooltip trigger="focus" title="提醒" content="最多20个汉字" placement="right">
          <Input
                  style="width:200px"
                  v-model="formData.barcodeTitle"
                  :maxlength="20"
                  placeholder="请输入条码标题"
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
        /*verifyTitle: "", //一键核销文案
        verifyIconUrl: "", //一键核销图标
        defaultVerifyIconUrlList: [],
        slogan: "", //Solagon
        backgroundUrl: "", //背景图
        defaultBackgroundUrlList: []*/
        backgroundUrl: "",//主背景图
        defaultBackgroundUrlList: [],

        scanCodeIconUrl: "",//扫码icon
        efaultScanCodeIconUrlList: [],
        scanCodeImgUrl: "",//扫码背景图
        efaultScanCodeImgUrlList: [],
        scanCodeTitle: "",//扫码主标题
        subtitle: "",//扫码副标题

        settlementIconUrl: "",//结算icon
        efaultSettlementIconUrlList: [],
        settlementImgUrl: "",//结算背景图
        efaultSettlementImgUrlList: [],
        settlementTitle: "",//结算标题

        barcodeIconUrl: "",//条码icon
        efaultBarcodeIconUrlList: [],
        barcodeImgUrl: "",//条码背景图
        efaultBarcodeImgUrlList: [],
        barcodeTitle: "",//条码标题
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
      let { code, msg, data } = await postRequest(url, { site: 1 });
      if (code == 200) {
        if (data == "") {
          data = {
            id: "",
            backgroundUrl: "",//主背景图
            defaultBackgroundUrlList: [],

            scanCodeIconUrl: "",//扫码icon
            defaultScanCodeIconUrlList: [],
            scanCodeImgUrl: "",//扫码背景图
            defaultScanCodeImgUrlList: [],
            scanCodeTitle: "",//扫码主标题
            subtitle: "",//扫码副标题

            settlementIconUrl: "",//结算icon
            defaultSettlementIconUrlList: [],
            settlementImgUrl: "",//结算背景图
            defaultSettlementImgUrlList: [],
            settlementTitle: "",//结算标题

            barcodeIconUrl: "",//条码icon
            defaultBarcodeIconUrlList: [],
            barcodeImgUrl: "",//条码背景图
            defaultBarcodeImgUrlList: [],
            barcodeTitle: "",//条码标题
          };
        }
        const { backgroundUrl, scanCodeIconUrl, scanCodeImgUrl, settlementIconUrl, settlementImgUrl, barcodeIconUrl, barcodeImgUrl } = data;

        data.defaultBackgroundUrlList	= [];
        data.defaultScanCodeIconUrlList   = [];
        data.defaultScanCodeImgUrlList    = [];
        data.defaultSettlementIconUrlList = [];
        data.defaultSettlementImgUrlList  = [];
        data.defaultBarcodeIconUrlList    = [];
        data.defaultBarcodeImgUrlList     = [];

        if (backgroundUrl) {
          data.defaultBackgroundUrlList.push({ imgUrl: backgroundUrl });
        }
          if (scanCodeImgUrl) {
              data.defaultScanCodeImgUrlList.push({ imgUrl: scanCodeImgUrl });
          }
        if (scanCodeIconUrl) {
          data.defaultScanCodeIconUrlList.push({ imgUrl: scanCodeIconUrl });
        }
          if (settlementImgUrl) {
              data.defaultSettlementImgUrlList.push({ imgUrl: settlementImgUrl });
          }
        if (settlementIconUrl) {
          data.defaultSettlementIconUrlList.push({ imgUrl: settlementIconUrl });
        }
          if (barcodeImgUrl) {
              data.defaultBarcodeImgUrlList.push({ imgUrl: barcodeImgUrl });
          }
        if (barcodeIconUrl) {
          data.defaultBarcodeIconUrlList.push({ imgUrl: barcodeIconUrl });
        }

        this.formData = data;
      } else {
        this.msgErr(msg);
      }
    },

    removeBackgroundUrl() {
      this.formData.backgroundUrl = "";
      this.formData.defaultBackgroundUrlList = [];
    },
    removeScanCodeIconUrl() {
      this.formData.scanCodeIconUrl = "";
      this.formData.defaultScanCodeIconUrlList = [];
    },
    removeScanCodeImgUrl() {
      this.formData.scanCodeImgUrl = "";
      this.formData.defaultScanCodeImgUrlList = [];
    },
    removeSettlementIconUrl() {
      this.formData.settlementIconUrl = "";
      this.formData.defaultSettlementIconUrlList = [];
    },
    removeSettlementImgUrl() {
      this.formData.settlementImgUrl = "";
      this.formData.defaultSettlementImgUrlList = [];
    },
    removeBarcodeIconUrl() {
      this.formData.barcodeIconUrl = "";
      this.formData.defaultBarcodeIconUrlList = [];
    },
    removeBarcodeImgUrl() {
      this.formData.barcodeImgUrl = "";
      this.formData.defaultBarcodeImgUrlList = [];
    },


    backgroundUrlUploadSuccess({ imgUrl }) {
      this.formData.backgroundUrl = imgUrl;
      this.formData.defaultBackgroundUrlList = [{ imgUrl }];
    },
      scanCodeImgUrlUploadSuccess({ imgUrl }) {
          this.formData.scanCodeImgUrl = imgUrl;
          this.formData.defaultScanCodeImgUrlList = [{ imgUrl }];
      },
    scanCodeIconUrlUploadSuccess({ imgUrl }) {
      this.formData.scanCodeIconUrl = imgUrl;
      this.formData.defaultScanCodeIconUrlList = [{ imgUrl }];
    },
    settlementIconUrlUploadSuccess({ imgUrl }) {
      this.formData.settlementIconUrl = imgUrl;
      this.formData.defaultSettlementIconUrlList = [{ imgUrl }];
    },
    settlementImgUrlUploadSuccess({ imgUrl }) {
      this.formData.settlementImgUrl = imgUrl;
      this.formData.defaultSettlementImgUrlList = [{ imgUrl }];
    },
    barcodeIconUrlUploadSuccess({ imgUrl }) {
      this.formData.barcodeIconUrl = imgUrl;
      this.formData.defaultBarcodeIconUrlList = [{ imgUrl }];
    },
    barcodeImgUrlUploadSuccess({ imgUrl }) {
      this.formData.barcodeImgUrl = imgUrl;
      this.formData.defaultBarcodeImgUrlList = [{ imgUrl }];
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
  .cms{
    padding: 10px;
  }
</style>
