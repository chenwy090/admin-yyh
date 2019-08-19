<template>
  <div>
    <div class="demo-upload-list" v-for="item in uploadList" :key="item.uid">
      <img :src="item.imgUrl" />
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(item.imgUrl)"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
      </div>
    </div>
    <!-- :default-file-list="defaultList" -->
    <div style="display: inline;">
      <Upload
        :headers="userToken"
        ref="upload"
        type="drag"
        :format="['jpg','jpeg','png','bmp']"
        :show-upload-list="false"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :action="url"
        accept="image"
        :max-size="10240"
        :on-exceeded-size="handleMaxSize"
        :on-format-error="handleFormatError"
        style="display: inline-block;width:90px;"
      >
        <div style="width: 90px;height:90px;line-height: 90px;">
          <Icon type="ios-camera" size="20" />
        </div>
      </Upload>
      <p style="font-size:12px">选择图片(不大于1M,JPG/PNG/JPEG/BMP）</p>
    </div>

    <Modal v-model="visible" :footer-hide="true">
      <img :src="imgUrl" v-if="visible" style="width: 100%" />
    </Modal>
  </div>
</template>
<script>
import { uploadOperationImage2AliOssURl } from "@/api/index";
import { checkImage } from "@/libs/date";
export default {
  name: "upload-image",
  props: {
    defaultList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    fileUploadType: {
      type: [String, Number],
      default: ""
    }
  },
  watch: {
    defaultList() {
      const fileList = this.$refs.upload.fileList;
      // this.$refs.upload.fileList.splice(0, fileList.length);
      this.uploadList = [];
      for (let i = 0; i < this.defaultList.length; i++) {
        let item = this.defaultList[i];
        // this.$refs.upload.fileList.push(item);

        this.uploadList.push(item);
      }
      // this.$refs.upload.fileList
    }
  },
  data() {
    return {
      userToken: {}, //用户token
      // 文件上传
      url: uploadOperationImage2AliOssURl,
      // defaultList: [
      //   {
      //     imgUrl: "https://image.52iuh.cn/wx_mini/ILJAe1kLiF.png"
      //   },
      //   {
      //     imgUrl: "https://image.52iuh.cn/wx_mini/NlXpxCBPzg.png"
      //   }
      // ],
      uploadList: [],
      imgUrl: "",
      visible: false
    };
  },
  created() {
    this.userToken = {
      jwttoken: localStorage.getItem("jwttoken")
    };
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },

  methods: {
    handleView(imgUrl) {
      this.imgUrl = imgUrl;
      this.visible = true;
    },
    handleRemove(file) {
      this.uploadList = [];
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.uploadList = [];
        let imgUrl = res.image_url;
        file.imgUrl = imgUrl;
        this.$emit("uploadSuccess", {
          fileUploadType: this.fileUploadType,
          imgUrl
        });

        this.uploadList.push(file)
        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
    },
    //文件上传
    handleMaxSize(file) {
      this.$Message.error("图片不大于1M");
    },
    handleFormatError() {
      this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传");
    },
    handleBeforeUpload(file) {
      return checkImage(file);
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
.demo-upload-list {
  display: inline-block;
  width: 90px;
  height: 90px;
  text-align: center;
  line-height: 90px;
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