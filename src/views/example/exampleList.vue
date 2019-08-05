<template>
<div>
    <Card>
   <Form >
      <FormItem label="单图上传">
            <uploadImg  ref="upload"   :uploadImg="image_url" :width="200" :height="160"
              @handleSuccess = "(url) => this.image_url = url">
          </uploadImg>   
            <p>选择单图上传图 (不大于1M,尺寸为200*160, JPG/PNG/JPEG/BMP）</p> 

    </FormItem >

        <FormItem label="多图上传">
            <uploadImgMore   :uploadList="ulrList" :width="200" :height="160"
              @handleSuccess = "(url) => this.ulrList = url">
          </uploadImgMore>
            <p>选择多图上传图 (不大于1M,尺寸为200*160, JPG/PNG/JPEG/BMP）</p>

    </FormItem >

      <FormItem label="图片裁剪">
          <div class="imgSrc_box" v-if="imgSrc"  >
                  <img  :src="imgSrc" style="width:100%">
          </div>
            <ImgCutter :label="'选择图片'"  :boxWidth="400"  :boxHeight="500" :rate="1.2" @click="cutDown" >
              <span slot="openImgCutter" class="ivu-btn" style="width:100px">上传图片</span>
          </ImgCutter>


          <p style="color:red"> boxWidth为裁剪框宽度 boxHeight为裁剪框高度  rate为宽高比</p>
      </FormItem >



  <Alert>
      可编辑表格
        <template slot="desc">
      参考模版 ：   components/editTable.vue

           </template>
    </Alert>


  <Alert  type="success">
      树形表格
        <template slot="desc">
      参考模版  ：   sys/menu-manage/menuManage.vue

           </template>
    </Alert>


  <Alert>
       时间戳转为年月日时分秒
        <template slot="desc">
             import { formatDate } from "@/libs/dataUtil";
           <br>
           formatDate( new Date(JSON.parse(this.add_time)), "yyyy-MM-dd hh:mm:ss" )

           </template>
    </Alert>




  <Alert type="success">
       去重复
        <template slot="desc">
           import { uniqueArray } from "@/libs/dataUtil";
           <br>
        var afterArr = uniqueArray(this.checkUserList, "id");

           </template>
    </Alert>

 <Alert>
       时间戳+日期
        <template slot="desc">
           import { addDate } from "@/libs/dataUtil";
           <br>
     var validity_end =
                addDate(
                  formatDate(
                    new Date(JSON.parse(this.add_time)),
                    "yyyy-MM-dd"
                  ),
                11
                ) ;

           </template>
    </Alert>







<Button @click="saveInfo">保存</Button>

    </Form >   
 </Card>   

</div>
</template>
<script>
import uploadImg from "@/components/uploadImg.vue";
import uploadImgMore from "@/components/uploadImgMore.vue";

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
  components: { uploadImg, uploadImgMore, ImgCutter },
  data() {
    return {
      image_url: "http://pic17.nipic.com/20111102/8732394_164338399113_2.jpg",
      ulrList: [
        {
          img_url:
            "http://www.ghost64.com/qqtupian/zixunImg/local/2019/03/15/15525976683034.jpeg"
        },
        {
          img_url:
            "https://ku.90sjimg.com/element_origin_min_pic/17/06/17/8b91e3acb380d9cd4de59796f6c035cb.jpg"
        }
      ],
      imgSrc: null
    };
  },
  methods: {
    saveInfo() {
      console.log(this.image_url);
      console.log(this.ulrList);
    },
    //裁剪图片
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
  },
  mounted() {}
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