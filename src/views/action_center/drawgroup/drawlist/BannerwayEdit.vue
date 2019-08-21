<template>
  <div class="bannerwayEdit">
    <Modal v-model="isShow" :closable="true" :mask-closable="false" @on-cancel="closeDialog">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{title}}</span>
      </p>
      <div>
        <Form
          label-position="left"
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="100"
        >
          <!-- 1.抽奖id 2抽奖链接 -->
          <FormItem prop="drawType">
            <RadioGroup v-model="formValidate.drawType">
              <!-- <Radio label="1">抽奖id</Radio>
              <Radio label="2">抽奖链接</Radio>-->
              <Radio v-for="item in drawTypeList" :label="item.value" :key="item.value">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="checkDrawType">
            <Input v-model="formValidate.checkDrawType" type="text"></Input>
          </FormItem>

          <FormItem label="上传图片：" prop="imgUrl">
            <div class="demo-upload-list" v-for="item in uploadList" :key="item.imgUrl">
              <img :src="item.imgUrl" />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.imgUrl)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </div>
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
          </FormItem>
          <FormItem label="上线时间：" prop="onlineTime">
            <DatePicker
              type="datetime"
              placeholder="请选择抽奖日期"
              format="yyyy-MM-dd HH:mm"
              style="display:inline-block;width: 200px"
              :value="formValidate.onlineTime"
              @on-change="changeTime"
            ></DatePicker>
          </FormItem>

          <FormItem label="排序字段：" prop="rankNum">
            <Input number v-model="formValidate.rankNum" type="text" placeholder="排序字段，值越大优先级越高..."></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="save('formValidate')">确认</Button>
        <Button @click="cancelHandleReset('formValidate')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>

    <Modal v-model="visible" :footer-hide="true">
      <img :src="formValidate.imgUrl" v-if="visible" style="width: 100%" />
    </Modal>
  </div>
</template>
<script>
import { addBannerWay, editBannerWay } from "@/api/sys";
import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
import { checkImage } from "@/libs/date";
export default {
  name: "bannerway-edit",
  props: {
    // action: "add", //新增 add、修改 edit
    action: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function() {
        return { type: "add" };
      }
    }
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;
        this.isShow = true;

        if (type == "add") {
          this.title = "添加任务抽奖banner";
          Object.keys(this.formValidate).forEach(name => {
            this.formValidate[name] = "";
          });
        } else {
          //edit
          this.title = "修改任务抽奖banner";
          this.$nextTick(() => {
            Object.keys(this.formValidate).forEach(name => {
              this.formValidate[name] = data[name];
            });
            //  1.抽奖id drawId 2抽奖链接 linkUrl
            let { drawId, linkUrl } = data;
            let drawType = drawId ? 1 : 2;
            this.formValidate.drawType = drawType;
            this.formValidate.checkDrawType = drawType == 1 ? drawId : linkUrl;

            this.uploadList = [{ imgUrl: data.imgUrl }];
            // console.log("edit", this.formValidate);
          });
        }
      },
      deep: true
    }
  },
  data() {
    const validateDrawType = (rule, value, callback) => {
      value += "";
      value = value.trim();
      // console.log("validateDrawType", value);
      // console.log("this.formValidate.drawType", this.formValidate);
      if (value == "") {
        // drawType: 1, //  1.抽奖id：drawId 2抽奖链接 linkUrl
        callback(new Error("请选择类型"));
      } else {
        callback();
      }
    };
    const validateCheckDrawType = (rule, value, callback) => {
      if (value === "") {
        // drawType: 1, //  1.抽奖id：drawId 2抽奖链接 linkUrl
        let msg = "";
        if (this.formValidate.drawType == "") {
          return this.$refs.formValidate.validateField("drawType");
        } else if (this.formValidate.drawType == 1) {
          msg = "请输入抽奖id";
        } else {
          msg = "请输入抽奖链接";
        }
        callback(new Error(msg));
      } else {
        if (this.formValidate.drawType == 1) {
          //id必须输入数字
          value += "";
          if (value.indexOf(".") != -1) {
            return callback(new Error("请输入整数"));
          }

          let n = parseInt(value);

          if (isNaN(n)) {
            return callback(new Error("请输入整数"));
          }

          if (n != value) {
            return callback(new Error("请输入整数"));
          }
        }
        callback();
      }
    };
    const validateRankNum = (rule, value, callback) => {
      value += "";
      // console.log("validateRankNum", rule, value);
      // 允许不填
      if (value.trim() == "") {
        return callback();
      }
      // 填了就要验证
      if (value.indexOf(".") != -1) {
        return callback(new Error("请输入整数"));
      }

      let n = parseInt(value);

      if (isNaN(n)) {
        return callback(new Error("请输入整数"));
      }

      if (n != value) {
        return callback(new Error("请输入整数"));
      }

      if (n >= 1 && n <= 99999) {
        callback();
      }

      callback(new Error("请输入[1—99999]之间的整数"));
    };
    return {
      userToken: {}, //用户token
      // 文件上传
      url: uploadOperationImage2AliOssURl,
      uploadList: [],
      visible: false,
      // 新增、修改 任务抽奖banner
      isShow: false,
      title: "新增",
      data: {},
      drawTypeList: [
        { value: 1, label: "抽奖id" },
        { value: 2, label: "抽奖链接" }
      ],
      formValidate: {
        id: "",
        drawType: 1, //  1.抽奖id 2抽奖链接
        checkDrawType: "",
        drawId: "", //抽奖活动ID
        linkUrl: "", //外置链接跳转地址
        imgUrl: "", // banner图片访问地址
        onlineTime: "", //上线时间
        rankNum: "" //排序字段，值越大优先级越高
      },
      ruleValidate: {
        drawType: [
          { required: true, validator: validateDrawType, trigger: "blur" }
        ],
        checkDrawType: [
          { required: true, validator: validateCheckDrawType, trigger: "blur" }
        ],
        imgUrl: [{ required: true, message: "请上传图片", trigger: "blur" }],
        onlineTime: [
          {
            required: true,
            type: "string",
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        rankNum: [{ validator: validateRankNum, trigger: "blur" }]
      }
    };
  },
  created() {
    this.userToken = {
      jwttoken: localStorage.getItem("jwttoken")
    };
  },
  methods: {
    closeDialog() {
      //关闭对话框清除表单数据
      this.$refs.formValidate.resetFields();
      this.uploadList = [];
    },
    handleView(name) {
      this.formValidate.imgUrl = name;
      this.visible = true;
    },
    handleRemove(file) {
      this.$refs.upload.fileList = [];
      this.uploadList = [];
      this.formValidate.imgUrl = "";
    },
    handleUploadSuccess(res, file) {
      if (res.code == 200) {
        let imgUrl = res.image_url;
        this.uploadList = [{ imgUrl }];

        this.formValidate.imgUrl = imgUrl;
        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
    },
    //文件上传
    handleMaxSize(file) {
      this.$Message.error("图片不大于10M");
    },

    handleFormatError() {
      this.msgErr("只能上传jpg,jpeg,png,bmp格式,请重新上传");
    },
    handleBeforeUpload(file) {
      return checkImage(file);
    },
    changeTime(time) {
      this.formValidate.onlineTime = time;
    },
    // 显示大图
    showBigImg: function(row) {
      this.bigImgDialog = true;
      this.bigImageUrl = row.imgUrl;
    },
    bigImgCancel: function() {
      this.bigImgDialog = false;
    },
    cancelHandleReset(name) {
      name = name || "formValidate";
      this.isShow = false;
      this.$nextTick(() => {
        this.$refs[name].resetFields();
        this.uploadList = [];

        this.formValidate = {
          id: "",
          drawType: 1, //  1.抽奖id 2抽奖链接
          checkDrawType: "",
          drawId: "", //抽奖活动ID
          linkUrl: "", //外置链接跳转地址
          imgUrl: "", // banner图片访问地址
          onlineTime: "", //上线时间
          rankNum: "" //排序字段，值越大优先级越高
        };
      });
    },

    save(name) {
      this.$refs[name].validate(async valid => {
        // console.log(JSON.stringify(this.formValidate));
        if (valid) {
          // this.$Message.success("数据验证成功!");
          let oForm = JSON.parse(JSON.stringify(this.formValidate));
          let { drawType, checkDrawType } = oForm;
          if (drawType) {
            oForm.drawId = checkDrawType;
          } else {
            oForm.linkUrl = checkDrawType;
          }
          delete oForm.checkDrawType;

          let fnName = null;
          if (this.action.type == "add") {
            fnName = addBannerWay;
          } else {
            fnName = editBannerWay;
          }

          let res = await fnName(oForm);

          if (res.code == 200) {
            // 关闭对话框
            this.cancelHandleReset();
            //刷新列表数据
            this.$emit("refresh");
          } else {
            this.msgErr(res.msg);
          }
        } else {
          this.$Message.error("数据验证失败！");
        }
      });
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