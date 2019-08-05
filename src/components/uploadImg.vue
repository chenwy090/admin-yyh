<template>
<div>
  <div class="demo-upload-list"  v-if="uploadImg">
  
        <template >
            <img :src="uploadImg">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
            </div>
        </template>
      
    </div>
    <Upload   
        ref="upload"
         :defaultList="uploadImg"                
         accept="image" 
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="1048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        type="drag"
        :headers="userToken"
        :action="actionUrl"
         :before-upload="handleBeforeUpload"
        style="display: inline-block;width:78px">
        <div style="width: 78px;height:78px;line-height: 58px" >
            <Icon type="ios-camera" size="36" style="margin-top: 24px"></Icon>
        </div>
    
    </Upload>
      
   <Modal title="查看图片" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
</div>
</template>
<script>
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from "@/libs/axios";

import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
import { formatDate, checkImageWH } from "@/libs/dataUtil";
export default {
  props: ["uploadImg", "width", "height"],

  data() {
    return {
      defaultList: [],
      imgName: "",
      visible: false,
      uptoken: {},
      actionUrl: uploadOperationImage2AliOssURl,
      fileList: [],
      userToken: ""
    };
  },
  created: function() {
    this.userToken = { jwttoken: localStorage.getItem("jwttoken") };
  },
  methods: {
    handleView(item) {
      this.imgName = this.uploadImg;
      this.visible = true;
    },
    handleRemove() {
      this.uploadImg = "";
      this.$emit("handleSuccess", "");
    },
    handleSuccess(res, file) {
      this.$emit("handleSuccess", res.image_url); //传递给父组件
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传的格式不正确",
        desc: "文件'" + file.name + "'不合法, 请重新选择jpg or png.的格式"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小超出限制",
        desc: "文件'" + file.name + "'大小超出" + this.maxSize / 1024 + "M限制"
      });
    },
    handleBeforeUpload(file) {
      return checkImageWH(file, this.width, this.height);
    }
  },
  mounted() {}
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 78px;
  height: 78px;
  text-align: center;
  line-height: 78px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>

