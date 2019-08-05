<template>
  <div >

     <div style=" float: left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
         v-if="imgSrc"  >
            <img  :src="imgSrc" style="width:100%">
     </div>

 
         <Button type="dashed">
           <span style="z-index:-1"> 上传图片</span>
           
      <ImgCutter
        :label="'选择图片'"
        :boxWidth="750"
        :boxHeight="1108"
        v-on:cutDown="cutDown"
        style="margin-top: -17px;height: 20px;"
        >
        
        <button slot="openImgCutter" ></button>
          </ImgCutter>
        </Button>
        
       <div style="line-height: 40px">选择商户logo (不大于1M,尺寸为150*150, JPG/PNG/JPEG/BMP）</div>

 
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

var reqParams={
  imgSrc:res.dataURL
}

  uploadformData(
          "/operation/operation-info/uploadOperationImage2AliOss" ,
          reqParams
        ).then(res => {
       
          if (res.code == 200) {
           
          } else {
            this.$Message.error(res.msg);
          }
        });

    }
  }
};
</script>