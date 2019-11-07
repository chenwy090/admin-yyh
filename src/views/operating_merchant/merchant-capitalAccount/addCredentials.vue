<template>
  <div>
    <Card>
      <!-- <Button type="dashed" icon="md-arrow-round-back">返回列表</Button> -->
      <Divider orientation="left">
        <h3>证件信息</h3>
      </Divider>
      <Row v-if="businessCustomer == 'business'">
        <Col span="2" class="left-text">
          <span style="color:red">*</span> 营业执照:
        </Col>

        <Col span="8">
          <div class="imgSrc_box" v-if="bsUploadList1">
            <img :src="bsUploadList1" style="width:100%" />
          </div>

          <div style="width:300px; float:left">
            <ImgCutter :label="'选择图片'" :boxWidth="500" :boxHeight="400" v-on:cutDown="cutDown1">
              <button slot="openImgCutter" style="width:100px; background: border-box">上传图片</button>
            </ImgCutter>
            <p class="left-text" v-if="businessCustomer == 'customer'">(不大于500k, JPG/PNG/JPEG/BMP）</p>
            <p class="left-text" v-else>(不大于1M, JPG/PNG/JPEG/BMP）</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="2" class="left-text">
          <span style="color:red">*</span>
          {{businessCustomer == 'business'?'法人身份证: ':'证件图片: '}}
        </Col>

        <Col span="6">
          <div class="imgSrc_box" v-if="bsUploadList2">
            <img :src="bsUploadList2" style="width:100%" />
          </div>

          <span style="width:300px; float:left; display:inline-block">
            <ImgCutter :label="'选择图片'" :boxWidth="500" :boxHeight="400" v-on:cutDown="cutDown2">
              <button slot="openImgCutter" style="width:100px; background: border-box">上传图片</button>
            </ImgCutter>
            <p
              class="left-text"
              v-if="businessCustomer == 'customer'"
            >正面 (不大于500k, JPG/PNG/JPEG/BMP）</p>
            <p class="left-text" v-else>正面 (不大于1M, JPG/PNG/JPEG/BMP）</p>
          </span>
        </Col>
        <Col span="6">
          <div class="imgSrc_box" v-if="bsUploadList3">
            <img :src="bsUploadList3" style="width:100%" />
          </div>

          <span style="width:300px; float:left; display:inline-block">
            <ImgCutter :label="'选择图片'" :boxWidth="500" :boxHeight="400" v-on:cutDown="cutDown3">
              <button slot="openImgCutter" style="width:100px; background: border-box">上传图片</button>
            </ImgCutter>
            <p
              class="left-text"
              v-if="businessCustomer == 'customer'"
            >反面 (不大于500k, JPG/PNG/JPEG/BMP）</p>
            <p class="left-text" v-else>反面 (不大于1M, JPG/PNG/JPEG/BMP）</p>
          </span>
        </Col>
      </Row>
      <Row style="margin: 20px 0 0 55px">
        <Col span="8" class="left-text">
          <Button
            type="info"
            style="width:240px;margin-right: 20px; float: left;"
            @click="goback()"
          >取&nbsp;&nbsp;&nbsp;消</Button>
          <Button
            type="primary"
            style="width:240px; float: left;"
            @click="editCredentialsFn()"
          >保&nbsp;&nbsp;&nbsp;存</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
  import { getCredentialsInfo, editCredentials } from "@/api/sys";
  import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
  } from "@/libs/axios";
  import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
  import { formatDate, checkImageWH, checkImage, uniqueArray } from "@/libs/date";
  import ImgCutter from "@/components/ImgCutter.vue";

  export default {
    name: "addCredentials",
    props: {
      id: null,
      businessCustomer: String
    },
    components: {
      ImgCutter
    },
    data() {
      return {
        userInfo: "",
        addEdit: null, // 1新增 2编辑
        userToken: {}, //用户token
        bsUploadList1: "",
        bsUploadList2: "",
        bsUploadList3: "",
        url: uploadOperationImage2AliOssURl,
        id1: "",
        id2: "",
        id3: ""
      };
    },
    created: function() {
      // console.log(this.businessCustomer);
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.userToken = {
        jwttoken: localStorage.getItem("jwttoken")
      };
      this.getCredentialsInfoFn();
    },
    mounted() {},
    methods: {
      // 根据id获取信息
      getCredentialsInfoFn() {
        getCredentialsInfo(this.id).then(res => {
          if (res.code == 200) {
            if (res.data != null) {
              this.addEdit = 2;
              if (this.businessCustomer == "business") {
                let list = res.data;
                for (let i = 0; i < list.length; i++) {
                  if (list[i].picType == "201") {
                    this.bsUploadList1 = list[i].picUrl;
                    this.id1 = list[i].id;
                  }
                  if (list[i].picType == "202") {
                    this.bsUploadList2 = list[i].picUrl;
                    this.id2 = list[i].id;
                  }
                  if (list[i].picType == "203") {
                    this.bsUploadList3 = list[i].picUrl;
                    this.id3 = list[i].id;
                  }
                }
              } else {
                let list = res.data;
                for (let i = 0; i < list.length; i++) {
                  if (list[i].picType == "101") {
                    this.bsUploadList2 = list[i].picUrl;
                    this.id2 = list[i].id;
                  }
                  if (list[i].picType == "102") {
                    this.bsUploadList3 = list[i].picUrl;
                    this.id3 = list[i].id;
                  }
                }
              }
            } else {
              this.addEdit = 1;
            }
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      //上传营业执照
      showSize() {
        //获取base64图片大小，返回MB数字
        var base64url = this.logeImgSrc;
        var str = base64url.replace("data:image/png;base64,", "");
        var equalIndex = str.indexOf("=");
        if (str.indexOf("=") > 0) {
          str = str.substring(0, equalIndex);
        }
        var strLength = str.length;
        var fileLength = parseInt(strLength - (strLength / 8) * 2);
        // 由字节转换为MB
        var size = "";
        size = (fileLength / 1024).toFixed(2);
        var sizeStr = size + ""; //转成字符串
        var index = sizeStr.indexOf("."); //获取小数点处的索引
        var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
        if (dou == "00") {
          //判断后两位是否为00，如果是则删除00
          this.logImgSize =
            sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
        }
        this.logImgSize = size;
      },

      cutDown1: function(res) {
        this.logeImgSrc = res.dataURL;
        this.showSize();
        if (this.businessCustomer == "customer") {
          if (this.logImgSize > 512) {
            this.$Message.error("图片不能大于500K");
            return;
          }
        } else {
          if (this.logImgSize > 1024) {
            this.$Message.error("图片不能大于1M");
            return;
          }
        }
        var reqParams = {
          imgStr: res.dataURL.substr(22)
        };
        postRequest(
          "/operation/operation-info/uploadBase64Image2AliOss",
          reqParams
        ).then(res => {
          if (res.code == 200) {
            this.bsUploadList1 = res.image_url;
          } else {
            this.$Message.error(res.msg);
          }
        });
        this.isCheckDisabled = false;
      },

      cutDown2: function(res) {
        this.logeImgSrc = res.dataURL;
        this.showSize();
        if (this.businessCustomer == "customer") {
          if (this.logImgSize > 512) {
            this.$Message.error("图片不能大于500K");
            return;
          }
        } else {
          if (this.logImgSize > 1024) {
            this.$Message.error("图片不能大于1M");
            return;
          }
        }
        var reqParams = {
          imgStr: res.dataURL.substr(22)
        };
        postRequest(
          "/operation/operation-info/uploadBase64Image2AliOss",
          reqParams
        ).then(res => {
          if (res.code == 200) {
            this.bsUploadList2 = res.image_url;
          } else {
            this.$Message.error(res.msg);
          }
        });
        this.isCheckDisabled = false;
      },

      cutDown3: function(res) {
        this.logeImgSrc = res.dataURL;
        this.showSize();
        if (this.businessCustomer == "customer") {
          if (this.logImgSize > 512) {
            this.$Message.error("图片不能大于500K");
            return;
          }
        } else {
          if (this.logImgSize > 1024) {
            this.$Message.error("图片不能大于1M");
            return;
          }
        }
        var reqParams = {
          imgStr: res.dataURL.substr(22)
        };
        postRequest(
          "/operation/operation-info/uploadBase64Image2AliOss",
          reqParams
        ).then(res => {
          if (res.code == 200) {
            this.bsUploadList3 = res.image_url;
          } else {
            this.$Message.error(res.msg);
          }
        });
        this.isCheckDisabled = false;
      },

      // 新增编辑
      editCredentialsFn() {
        // 验证
        if (!this.ruleValidate()) {
          return;
        }
        let data;
        if (this.businessCustomer == "customer") {
          // 个人
          data = [
            {
              basicId: this.id,
              type: this.businessCustomer,
              picUrl: this.bsUploadList2,
              picFmt: "jpg",
              picType: "101"
            },
            {
              basicId: this.id,
              type: this.businessCustomer,
              picUrl: this.bsUploadList3,
              picFmt: "jpg",
              picType: "102"
            }
          ];
          if (this.addEdit == 1) {
            data[0].createBy = this.userInfo.username;
            data[0].modifiedBy = this.userInfo.username;
            data[1].createBy = this.userInfo.username;
            data[1].modifiedBy = this.userInfo.username;
          } else {
            data[0].modifiedBy = this.userInfo.username;
            data[1].modifiedBy = this.userInfo.username;
            data[0].id = this.id2;
            data[1].id = this.id3;
            data[0].operateType = "update";
            data[1].operateType = "update";
          }
        } else {
          // 企业
          data = [
            {
              basicId: this.id,
              type: this.businessCustomer,
              picUrl: this.bsUploadList1,
              picFmt: "jpg",
              picType: "201"
            },
            {
              basicId: this.id,
              type: this.businessCustomer,
              picUrl: this.bsUploadList3,
              picFmt: "jpg",
              picType: "202"
            },
            {
              basicId: this.id,
              type: this.businessCustomer,
              picUrl: this.bsUploadList3,
              picFmt: "jpg",
              picType: "203"
            }
          ];
          if (this.addEdit == 1) {
            data[0].createBy = this.userInfo.username;
            data[0].modifiedBy = this.userInfo.username;
            data[1].createBy = this.userInfo.username;
            data[1].modifiedBy = this.userInfo.username;
            data[2].createBy = this.userInfo.username;
            data[2].modifiedBy = this.userInfo.username;
          } else {
            data[0].modifiedBy = this.userInfo.username;
            data[1].modifiedBy = this.userInfo.username;
            data[2].modifiedBy = this.userInfo.username;
            data[0].id = this.id1;
            data[1].id = this.id2;
            data[2].id = this.id3;
            data[0].operateType = "update";
            data[1].operateType = "update";
            data[2].operateType = "update";
          }
        }
        // let data = {
        //   basicId: 5,
        //   type: this.businessCustomer,
        //   picUrl: "",
        //   picFmt: "jpg",
        //   picType: "101",
        //   createBy: "admin",
        //   modifiedBy: "admin"
        // };
        editCredentials(data).then(res => {
          if (res.code == 200) {
            this.msgOk("保存成功");
            this.goback();
          } else {
            this.msgErr(res.msg);
          }
        });
      },

      // 验证
      ruleValidate() {
        if (this.businessCustomer == "business") {
          if (this.bsUploadList1 == "") {
            this.msgErr("营业执照图片未上传");
            return;
          }
        }
        if (this.bsUploadList2 == "") {
          this.msgErr("正面图片未上传");
          return;
        }
        if (this.bsUploadList2 == "") {
          this.msgErr("反面图片未上传");
          return;
        }
        return true
      },

      // 返回
      goback() {
        this.$emit("changeStatus", false);
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

<style>
  .box {
    margin-bottom: 20px;
  }

  .CertificatesImg {
    display: inline-block;
    width: 130px;
    height: 80px;
  }

  .left-text {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 12px;
    color: #515a6e;
    line-height: 1;
    padding: 10px 12px 10px 0;
    box-sizing: border-box;
  }

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
