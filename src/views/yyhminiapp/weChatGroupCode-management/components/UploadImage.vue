<template>
  <div>
    <span class="label">{{label}}</span>
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
        ref="upload"
        :type="dragType"
        :headers="userToken"
        :action="url"
        accept="image"
        :format="['jpg','png']"
        :on-format-error="handleFormatError"
        :show-upload-list="false"
        :default-file-list="myDefaultList"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :max-size="2048"
        :on-exceeded-size="handleMaxSize"
        :style="uploadStyle"
      >
        <!-- :style="display: inline-block;width:90px;" -->
        <template v-if="uploadList.length==0">
          <div style="width: 90px;height:90px;line-height: 90px;">
            <Icon type="ios-camera" size="20" />
          </div>
        </template>
        <template v-else>
          <Button size="small" icon="ios-cloud-upload-outline">更改</Button>
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
import { checkImage, getImageWH } from "@/libs/date";
export default {
  name: "upload-image",
  props: {
    label: {
      type: String,
      default: ""
    },
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
    defaultList: {
      handler: function() {
         //console.log("watch", JSON.stringify(this.defaultList));
        this.uploadList = [];
        for (let i = 0; i < this.defaultList.length; i++) {
          let item = this.defaultList[i];
          this.uploadList.push(item);
        }
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
      width: 0,
      height: 0,
      userToken: {}, //用户token
      // 文件上传
      url: uploadOperationImage2AliOssURl,
      uploadList: [],
      imgUrl: "",
      visible: false,
      myDefaultList:this.defaultList
    };
  },
  created() {
    this.userToken = {
      jwttoken: localStorage.getItem("jwttoken")
    };
  },
  mounted() {
    // this.uploadList = this.$refs.upload.fileList;
    if (this.myDefaultList.length) {
      this.uploadList = this.myDefaultList;
    }
  },

  methods: {
    handleView(imgUrl) {
      this.imgUrl = imgUrl;
      this.visible = true;
    },
    handleRemove(file) {
      this.uploadList = [];
      this.myDefaultList = [];
      this.$emit("remove");
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.uploadList = [];

        let imgUrl = res.image_url;
        file.imgUrl = imgUrl;
        let imgName = file.name;
        console.log(this.width);
        this.$emit("uploadSuccess", {
          coverImgHeight: this.height,
          coverImgWidth: this.width,
          fileUploadType: this.fileUploadType,
          imgUrl,
          imgName
        });

        this.uploadList.push(file);
        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
    },
    //文件上传
    handleMaxSize(file) {
      this.$Message.error("图片不大于2M");
    },
    handleFormatError() {
      this.msgErr("只能上传jpg,png格式,请重新上传");
    },
    handleBeforeUpload(file) {
      console.log(file);
      getImageWH(file).then(res => {
        console.log(res);
        this.width = res.w;
        this.height = res.h;
      });
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
<style  lang="less" scoped>
.label {
  float: left;
  height: 90px;
}
.demo-upload-list {
  /* display: inline-block; */
  float: left;
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
