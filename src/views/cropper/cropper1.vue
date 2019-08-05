<template>
  <div >
 
  <Form >

    <FormItem label="商户logo">

          <div class="imgSrc_box" v-if="imgSrc"  >
                  <img  :src="imgSrc" style="width:100%">
          </div>
            <ImgCutter :label="'选择图片'"  :boxWidth="400"  :boxHeight="500" :rate="1.2" @click="cutDown" > 
                <span slot="openImgCutter" class="ivu-btn" style="width:100px">上传图片</span>
          </ImgCutter>
          <div style="line-height: 40px">选择商户logo (不大于1M,JPG/PNG/JPEG/BMP）</div> 
      </FormItem >

  </Form >

  </div>
</template>

<script>
import ImgCutter from "@/components/ImgCutter.vue";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest,
  uploadformData
} from "@/libs/axios";
export default {
  name: "App",
  components: {
    ImgCutter
  },
  data() {
    return {
      imgSrc: null
    };
  },
  methods: {
    cutDown: function(res) {
      console.log(res);
      this.imgSrc = res.dataURL;

      var reqParams = {
        imgStr: res.dataURL.substr(22)
      };

      uploadFileRequest(
        "/operation/operation-info/uploadBase64Image2AliOss",
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.imgSrc = res.image_url;
        } else {
          this.$Message.error(res.msg);
        }
      });
    }
  }
};
</script>
<style>
.imgSrc_box {
  float: left;
  width: 90px;
  height: 90px;
  line-height: 90px;
  margin-right: 10px;
  border: 1px dashed #dcdee2;
  background: #fff;
}
</style>