<template>
<div>
  <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
        <template>
            <img :src="item.img_url">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
            </div>
        </template>
      
    </div>
     <Upload   
        ref="upload"
         :defaultList="uploadList"                
         accept="image" 
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="1024"
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
  props: ["uploadList", "width", "height"],

  data() {
    return {
      defaultList: [],
      imgName: "",
      visible: false,
      uptoken: {},
      actionUrl: uploadOperationImage2AliOssURl,
      fileList: [],
      userToken:"",
    };
  },
    created: function() {
    this.userToken = { jwttoken: localStorage.getItem("jwttoken") };
  },
  methods: {
    handleView(item) {
      this.imgName = item.img_url;
      this.visible = true;
    },
    handleRemove(index) {
      this.uploadList.splice(index, 1);
    },
    handleSuccess(res, file) {
      let obj = {
        img_url: res.image_url
      };
      this.uploadList.push(obj);
     

      this.$emit("handleSuccess", this.uploadList); //传递给父组件
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
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "最多只能上传五张图片"
        });
      }
      return check;
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

