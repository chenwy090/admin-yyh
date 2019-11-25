<template>
  <div class="zex-upload-box">
    <span class="label">{{label}}</span>
    <!-- <div>uploadList:{{uploadList}} ---changeImageSort:{{changeImageSort}}</div> -->

    <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
      <div class="item">
        <img :src="item.imgUrl" />
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.imgUrl)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item,index)"></Icon>
        </div>
      </div>
      <div class="imgSort">
        <!--  style="display:inline-block;width:80px" v-model="item.sort"  @on-change="xxx($event,index)" -->
        <Input
          size="small"
          v-model="item.sort"
          placeholder="请输入排序"
          @input.native="changeImageSort($event,index)"
        />
        <span class="error-msg">{{item.msg}}</span>
      </div>
    </div>
    <!-- :default-file-list="defaultList"  :default-file-list="defaultList" :defaultList="defaultList"-->
    <div class="btn-upload">
      <Upload
        ref="upload"
        type="drag"
        :headers="userToken"
        :action="url"
        accept="image"
        :format="['gif','jpg','jpeg','png']"
        :on-format-error="handleFormatError"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :max-size="2048"
        :on-exceeded-size="handleMaxSize"
        :style="uploadStyle"
        multiple
      >
        <!-- :style="display: inline-block;width:90px;" -->
        <template v-if="uploadList.length<=14">
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
      default: ""
    },
    defaultList: {
      type: Array,
      default: function() {
        return [
          // {
          //   name: "image1",
          //   imgUrl: "http://image.52iuh.cn/wx_mini/hgjdP0vWDQ.png"
          // },
          // {
          //   name: "image2",
          //   imgUrl: "http://image.52iuh.cn/wx_mini/ykiJ52fpFg.jpeg"
          // },
          // {
          //   name: "image3",
          //   imgUrl: "http://image.52iuh.cn/wx_mini/6CXwqm7UXz.jpeg"
          // }
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
        this.uploadList = JSON.parse(JSON.stringify(this.defaultList));
        // this.uploadList = [];
        // for (let i = 0; i < this.defaultList.length; i++) {
        //   let item = this.defaultList[i];
        //   this.uploadList.push(item);
        // }
        let arr = JSON.stringify(this.uploadList);
        console.log("watch defaultList uploadList:", arr);
      },
      immediate: true
    }
  },
  computed: {
    uploadStyle() {
      // return this.uploadList.length == 0
      //   ? "display: inline-block;width:90px;"
      //   : "float:'left';padding-top:60px;";

      return "display: inline-block;width:90px;";
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
  renderError(createElement, err) {
    console.log("ssssrenderError");
    return createElement("div", err.stack);
    //return createElement("div",{},err.stack);
  },
  errorCaptured() {
    console.log("11errorCaptured");
  },
  methods: {
    changeImageSort(ev, index) {
      this.idx = index;
      let fileItem = this.uploadList[index];

      let { value } = ev.target;
      value = value.replace(/\D/g, "");
      if (!/^[1-9]\d*$|^$/.test(value)) {
        value = "";
        // ev.target.value = "";
      }

      let sort = value;
      let msg = "请输入排序";
      if (sort.length) {
        //验证sort是否重复
        let isRepeat = false;
        for (let i = 0; i < this.uploadList.length; i++) {
          let item = this.uploadList[i];
          if (item._id == fileItem._id) continue;
          if (item.sort == sort) {
            isRepeat = true;
            break;
          }
        }

        msg = isRepeat ? "排序不能重复" : "";
      }
      let newFileItem = { ...fileItem, msg, sort };
      this.uploadList.splice(index, 1, newFileItem);

      // console.log("change sort : newFileItem ", JSON.stringify(newFileItem));

      let images = JSON.parse(JSON.stringify(this.uploadList));
      this.$emit("updateImages", images);
    },
    handleView(imgUrl) {
      this.imgUrl = imgUrl;
      this.visible = true;
    },
    handleRemove(file, index) {
      this.uploadList.splice(index, 1);

      let images = JSON.parse(JSON.stringify(this.uploadList));
      // images = images.map((item, index) => {
      //   item.sort = index;
      //   return item;
      // });
      this.$emit("remove", images);
    },
    handleBeforeUpload(file) {
      console.log(file);
      const len = this.uploadList.length; // 文件长度
      let re = /\.(gif)$/i;

      // 判断是否是gif 有且只能是一张
      let isGif = re.test(file.name);
      if (isGif && len == 0) {
        return true;
      } else if (isGif && len > 0) {
        this.msgErr("最多只能上传1张gif图片！");
        return false;
      }

      const hasGif = this.uploadList.some(item => {
        return re.test(item.imgUrl);
      });

      if (hasGif) {
        this.msgErr("hasGif最多只能上传1张gif图片！");
        return false;
      }
      const check = len < 15;
      if (!check) {
        this.msgErr("最多上传15张图片！");
      }
      return check;
    },
    handleFormatError(file) {
      this.msgErr("只能上传gif,jpg,jpeg,png,bmp格式,请重新上传");
    },
    //文件上传
    handleMaxSize(file) {
      this.$Message.error("图片不大于2M");
    },
    createSort(arr) {
      arr = JSON.parse(JSON.stringify(arr));
      console.log("this.uploadList arr:", arr);

      let max = -1;
      if (arr.length == 0) {
        max = 1;
      } else if (arr.length == 1) {
        max = Number(arr[0].sort) + 1;
      } else {
        arr.sort((obj1, obj2) => obj2.sort - obj1.sort);
        max = Number(arr[0].sort) + 1;
      }

      max = max || 1;
      console.log("max===>", max);

      return max;
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code == 200) {
        let imgUrl = res.image_url;
        let sort = this.createSort(this.uploadList);
        let _id = Math.random();
        let msg = "";
        this.uploadList.push({ _id, msg, imgUrl, sort });

        let images = JSON.parse(JSON.stringify(this.uploadList));
        // images = images.map((item, index) => {
        //   item.sort = index;
        //   return item;
        // });

        this.$emit("uploadSuccess", {
          fileUploadType: this.fileUploadType,
          images
        });

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
<style  lang="less" scoped>
.zex-upload-box {
  margin-bottom: 30px;
}
.label {
  float: left;
  height: 90px;
}

.btn-upload {
  display: inline-block;
  width: 90px;
  height: 150px;
}
.demo-upload-list {
  position: relative;
  // display: inline-block;
  float: left;
  width: 90px;
  height: 150px;
  text-align: center;
  // line-height: 90px;
  border: 1px solid transparent;
  border-radius: 4px;
  // overflow: hidden;
  background: #fff;
  // border: 1px solid red;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);

  margin-right: 4px;

  .item {
    position: relative;
    width: 90px;
    height: 90px;

    img {
      width: 100%;
      height: 100%;
    }

    .demo-upload-list-cover {
      display: none;
      position: absolute;
      line-height: 90px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
    }
  }

  .imgSort {
    position: relative;
    // left: 0;
    // bottom: -30px;
    width: 80px;
    height: 30px;
    // background: yellow;
    .error-msg {
      position: absolute;
      left: 0;
      top: 26px;
      color: red;
    }
  }
}
.demo-upload-list .item:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>