<template>
  <!--  文件导入  -->
  <div class="file-import">
    <Modal
      v-model="isShow"
      :closable="true"
      :mask-closable="false"
      @on-cancel="closeDialog"
      :styles="{top: '20px'}"
      width="425"
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
          <FormItem label="文件导入：">
            <div>
              <Upload
                ref="upload"
                :headers="userToken"
                :action="`${url}/template/sort/excel/upload`"
                :show-upload-list="false"
                :before-upload="handleBeforeUpload"
                :multiple="false"
                type="select"
              >
                <div>
                  <Input
                    type="text"
                    v-model="filename"
                    clearable
                    placeholder="请选择xlsx文件进行上传"
                    style="width: 200px"
                  />
                </div>
              </Upload>
              <Row type="flex" justify="space-between" class="code-row-bg">
                <Col span="12">仅支持xlsx文件</Col>
                <Col span="12">
                  <!-- 导入模板 -->
                  <a href="javascript:;" @click="downloadTemplate">模板文件</a>
                </Col>
              </Row>
              <div v-if="file !== null">
                <Button type="text" :loading="loadingStatus">{{ loadingStatus ? '正在上传' : '' }}</Button>
              </div>
            </div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeDialog">取消</Button>
        <Button :disabled="!file" type="error" @click="upload" style="margin-left: 8px">上传</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { baseUrl } from "@/api/index";
import { uploadFileRequest, downloadSteam } from "@/libs/axios";
export default {
  name: "file-import",
  props: {
    campId: {
      type: String,
      default: ""
    },
    showFileImport: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      url: baseUrl,
      userToken: {}, //用户token
      isShow: true,
      title: "文件上传",
      file: null,
      loadingStatus: false,
      filename: "",
      uploadList: [],
      formData: {
        isNew: false, // 是否是新店
        startTime: "",
        endTime: ""
      },
      ruleValidate: {}
    };
  },
  created() {
    this.userToken = {
      jwttoken: localStorage.getItem("jwttoken")
    };
  },
  methods: {
    async upload() {
      // this.$refs.upload.post(this.file);

      this.loadingStatus = true;
      // 优惠券上传

      const url = "/campaginGrabInfoSet/upload/barcodeToMoney";
      let fd = new FormData();
      fd.append("file", this.file);
      fd.append("campId", this.campId); //append方法传入formData中

      const { code, msg, data } = await uploadFileRequest(url, fd);

      if (code == 200) {
        // this.msgOk("保存成功");
        // 关闭对话框
        this.closeDialog();
        //刷新列表数据
        this.$emit("refresh", this.filename);
        this.msgOk("文件上传成功");
      } else if (code == 500) {
        this.msgErr(msg);
      } else {
        this.msgErr(msg);
      }

      this.file = null;
      this.loadingStatus = false;
    },
    async downloadTemplate() {
      const url = "/campaginGrabInfoSet/download/barcodeToMoney";

      const res = await downloadSteam(url, { campId: this.campId });

      const content = res.data;

      const { filename } = res.headers;

      const blob = new Blob([content], { type: "application/vnd.ms-excel" });
      const oA = document.createElement("a");
      if ("download" in oA) {
        // 非IE下载
        oA.download = decodeURI(filename);
        oA.style.display = "none";
        oA.href = URL.createObjectURL(blob);
        document.body.appendChild(oA);
        oA.click();
        URL.revokeObjectURL(oA.href); // 释放URL 对象
        document.body.removeChild(oA);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, filename);
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "请上传以xlsx,xls结尾的文件."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小",
        desc: "文件最大只能上传2M."
      });
    },
    handleBeforeUpload(file) {
      this.file = null; //超过大小将文件清空
      this.filename = "";

      const filename = file.name;
      const fileSize = file.size;

      const fileExt = filename.replace(/.+\./, ""); //取得文件的后缀名
      // // if (file.size > 2097152) {
      //判断文件格式
      if (!["xlsx", "xls"].includes(fileExt.toLowerCase())) {
        this.handleFormatError(file);
        return false;
      } else if (fileSize > 2097152) {
        //限制文件的大小
        this.handleMaxSize(file);
        return false;
      }

      this.file = file;
      this.filename = filename;
      console.log("fileExt:", fileExt);
      return false;
    },
    closeDialog() {
      //关闭对话框清除表单数据
      console.log("closeDialog");
      this.$emit(`update:showFileImport`, false);
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
