<template>
  <div>
    <span class="label">{{label}} multiple</span>
    <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
      <img :src="item.imgUrl" />
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(item.imgUrl)"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
      </div>
    </div>
    <!-- :default-file-list="defaultList"  :default-file-list="defaultList"-->
    <div style="display: inline-block;">
      <Upload
        ref="upload"
        type="drag"
        :headers="userToken"
        :action="url"
        accept="image"
        :format="['gif','jpg','jpeg','png','bmp']"
        :on-format-error="handleFormatError"
        :show-upload-list="false"
        :defaultList="defaultList"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :max-size="1024"
        :on-exceeded-size="handleMaxSize"
        :style="uploadStyle"
        multiple
      >
        <!-- :style="display: inline-block;width:90px;" -->
        <template v-if="uploadList.length<=3">
          <div style="width: 90px;height:90px;line-height: 90px;">
            <Icon type="ios-camera" size="20" />
          </div>
        </template>
      </Upload>
      <!-- <p style="font-size:12px">选择图片(不大于1M,JPG/PNG/JPEG/BMP）</p> -->
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
  name: "upload-image-multiple",
  props: {
    label: {
      type: String,
      default: "label"
    },
    defaultList: {
      type: Array,
      default: function() {
        return [
          {
            name: "image1",
            imgUrl: "http://image.52iuh.cn/wx_mini/hgjdP0vWDQ.png"
          },
          {
            name: "image2",
            imgUrl: "http://image.52iuh.cn/wx_mini/ykiJ52fpFg.jpeg"
          },
          {
            name: "image3",
            imgUrl: "http://image.52iuh.cn/wx_mini/6CXwqm7UXz.jpeg"
          }
        ];
      }
    },
    fileUploadType: {
      type: [String, Number],
      default: ""
    }
  },
  watch: {
    defaultList: {
      handler: function() {
        // console.log("watch", JSON.stringify(this.defaultList));
        this.uploadList = [];
        for (let i = 0; i < this.defaultList.length; i++) {
          let item = this.defaultList[i];
          this.uploadList.push(item);
        }

        console.log("uploadList:", this.uploadList);
      },
      immediate: true
    }
  },
  computed: {
    uploadStyle() {
      return this.uploadList.length == 0
        ? "display: inline-block;width:90px;"
        : "float:'left';padding-top:60px;";
    },
    dragType() {
      return this.uploadList.length ? "select" : "drag";
    }
  },
  data() {
    return {
      userToken: {}, //用户token
      // 文件上传
      url: uploadOperationImage2AliOssURl,
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
    // this.uploadList = this.$refs.upload.fileList;
    if (this.defaultList.length) {
      this.uploadList = this.defaultList;

      console.log("mounted:", this.uploadList);
    }
  },

  methods: {
    handleView(imgUrl) {
      this.imgUrl = imgUrl;
      this.visible = true;
    },
    handleRemove(file) {
      this.uploadList = [];
      this.defaultList = [];
      this.$emit("remove");
    },

    // handleBeforeUpload(file) {
    //   return checkImage(file);
    // },
    handleBeforeUpload() {
      const check = this.uploadList.length < 3;
      if (!check) {
        this.$Notice.warning({
          title: "Up to 3 pictures can be uploaded."
        });
      }
      return check;
    },
    handleFormatError(file) {
      this.msgErr("只能上传gif,jpg,jpeg,png,bmp格式,请重新上传");
    },
    //文件上传
    handleMaxSize(file) {
      this.$Message.error("图片不大于1M");
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

        this.uploadList.push(file);
        this.msgOk("上传图片成功");
      } else {
        this.msgErr("上传图片失败，请重新上传");
      }
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
.label {
  float: left;
  height: 90px;
}
.demo-upload-list {
  display: inline-block;
  /* float: left; */
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