<template>
  <!--新增/编辑弹窗-->
  <!--<Modal width="800"-->
  <!--v-model="viewDialogVisible"-->
  <!--:title="titleName"-->
  <!--:closable="false"-->
  <!--:mask-closable="false"-->
  <!--footer-hide>-->
  <div v-if="viewDialogVisible" class="modal" @click.stop>
    <Card>
      <p slot="title">新增</p>
      <a href="#" slot="extra">
        <Button type="dashed" icon="md-arrow-round-back" @click="close()">返回上一层</Button>
      </a>
      <Form
        :model="modal"
        ref="addOrEditModal"
        :rules="ruleValidate"
        :label-width="80"
        label-position="left"
      >
        <Row class="padding-left-12">
          <Col span="18">
            <FormItem label="标题">
              <Input
                type="text"
                v-model="modal.name"
                placeholder="请填写活动名称，20字以内"
                style="width: 100%"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row class="padding-left-12">
          <Col span="18">
            <FormItem label="内容选择">
              <Button type="dashed" @click="openCoupon">
                <span v-if="couponObj.length===0">请选择</span>
                <Button :key="index" v-for="(item,index) in couponObj" class="coupon-item">
                  {{item.title +'&nbsp&nbsp'}}
                  <Icon @click.stop="reMoveCoupon(index)" type="ios-close" />
                </Button>
              </Button>
            </FormItem>
          </Col>
        </Row>
        <h3>banner位设置</h3>
        <div style="padding: 20px;border: 1px solid #999;">
          <Row class="padding-left-12">
            <Col span="18">
            <FormItem label="门店选择">
              <Button type="dashed" @click="openCoupon">
                <span v-if="couponObj.length===0">请选择</span>
                <Button :key="index" v-for="(item,index) in couponObj" class="coupon-item">
                  {{item.title +'&nbsp&nbsp'}}
                  <Icon @click.stop="reMoveCoupon(index)" type="ios-close" />
                </Button>
              </Button>
            </FormItem>
            </Col>
          </Row>
          <Row class="padding-left-12">
            <Col span="18">
            <FormItem label="终端选择">
              <Select v-model="modal.awardType" style="width:30%">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <span style="margin: 0 10px 0 30px;">运营位选择</span>
              <Select v-model="modal.awardType" style="width:30%">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row class="padding-left-12">
            <Col span="18">
            <FormItem label="选择时间">
              <DatePicker
                      :value="modal.expandTimeStart"
                      type="date"
                      placeholder
                      style="width: 48%"
                      :options="options1"
                      @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
              ></DatePicker>
              <div style="width: 2%;display: inline-block"></div>
              <DatePicker
                      :value="modal.expandTimeEnd"
                      type="date"
                      placeholder
                      style="width: 48%"
                      :options="options2"
                      @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
              ></DatePicker>
            </FormItem>
            </Col>
          </Row>
          <Row class="padding-left-12">
            <Col span="18">
            <FormItem label="banner图片">
              <div class="demo-upload-list" v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                      ref="upload"
                      :show-upload-list="false"
                      :default-file-list="defaultList"
                      :on-success="handleSuccess"
                      :format="['jpg','jpeg','png']"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      :before-upload="handleBeforeUpload"
                      multiple
                      type="drag"
                      action="//jsonplaceholder.typicode.com/posts/"
                      style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal title="View Image" v-model="visible">
                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
              </Modal>
            </FormItem>
            </Col>
          </Row>
        </div>
        <FormItem>
          <Button style="margin:20px" type="primary" size="large" @click="ok()">保存</Button>
          <Button style="margin:20px" @click="close">返回</Button>
        </FormItem>
      </Form>
    </Card>
    <!--</Modal>-->
    <volumeModal
      ref="volumeModal"
      :viewDialogVisible="selectActiveVolumeModal"
      @setViewDialogVisible="selectVolume"
    ></volumeModal>
    <couponModal
      ref="couponModal"
      :viewDialogVisible="couponViewDialogModal"
      @setViewDialogVisible="selectCoupon"
    ></couponModal>
  </div>
</template>

<script>
import { postRequest, getRequest, getSyncRequest } from "@/libs/axios";
import volumeModal from "./volumeModalC";
import couponModal from "./couponModalC";
export default {
  name: "add-or-edit-modal",
  components: { volumeModal, couponModal },
  props: {
    viewDialogVisible: { type: Boolean, default: false }
  },
  data() {
    return {
      uploadList:[{}],
        defaultList:[],
        visible:false,
        typeList:[{value:1,label:'核销赠券'},{value:2,label:'核销赠U贝'}],
      titleName: "",
      selectActiveVolumeModal: false,
      selectActiveVolumeObj: {},
      couponViewDialogModal: false,
      couponObj: [],
      modal: {
        name: "",
        startTime: "",
        endTime: "",
        wardType: "1",
        type: "1"
      },
      options1: {
        disabledDate(date) {
          return date.valueOf() < Date.now() - 1000 * 60 * 60 * 24;
        }
      },
        options2: {
            disabledDate(date) {
                return date.valueOf() < Date.now() - 1000 * 60 * 60 * 24;
            }
        },
      JawardRuleDtos: [
        {
          verifyCountMin: null,
          verifyCountMax: null,
          awardAmount: null,
          awardType: "1",
          couponType: "",
          awardName: ""
        }
      ],
      UawardRuleDtos: [
        {
          verifyCountMin: null,
          verifyCountMax: null,
          awardAmount: null,
          awardType: "2",
          couponType: "",
          awardName: ""
        }
      ],
      ruleValidate: {}
    };
  },
  methods: {


      handleView (name) {
          this.imgName = name;
          this.visible = true;
      },
      handleRemove (file) {
          const fileList = this.$refs.upload.fileList;
          this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleSuccess (res, file) {
          file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
          file.name = '7eb99afb9d5f317c912f08b5212fd69a';
      },
      handleFormatError (file) {
          this.$Notice.warning({
              title: 'The file format is incorrect',
              desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
          });
      },
      handleMaxSize (file) {
          this.$Notice.warning({
              title: 'Exceeding file size limit',
              desc: 'File  ' + file.name + ' is too large, no more than 2M.'
          });
      },
      handleBeforeUpload () {
          const check = this.uploadList.length < 5;
          if (!check) {
              this.$Notice.warning({
                  title: 'Up to five pictures can be uploaded.'
              });
          }
          return check;
      },









    changeDateTime(datetime, index) {
      switch (index) {
        case 1:
          this.modal.startTime = datetime;
          this.options2 = {
            disabledDate(date) {
              return date.valueOf() < new Date(datetime) - 1000 * 60 * 60 * 24;
            }
          };
          break;
        case 2:
          this.modal.endTime = datetime;
          this.options1 = {
            disabledDate(date) {
              return (
                date.valueOf() < Date.now() - 1000 * 60 * 60 * 24 ||
                date.valueOf() > new Date(datetime)
              );
            }
          };
          break;
      }
    },
    resetRow(row) {
      this.options2 = {
        disabledDate(date) {
          return date.valueOf() < Date.now() - 1000 * 60 * 60 * 24;
        }
      };
      this.options1 = {
        disabledDate(date) {
          return date.valueOf() < Date.now() - 1000 * 60 * 60 * 24;
        }
      };
      if (row) {
        this.titleName = "编辑";
        this.modal.id = row.id;
        // /merchant/activity/award/activity/{id}
        getRequest(`/customer/activity/award/activity/${row.id}`).then(res => {
          if (res.code === "200") {
            var data = res.data;
            this.modal.name = data.name;
            this.modal.startTime = data.startTime;
            this.modal.wardType = data.awardType.toString();
            this.modal.endTime = data.endTime;
            this.modal.type = "2";
            this.couponObj = data.coupons;
            this.modal.status = data.status;
            if (data.awardRuleVos && data.awardRuleVos.length) {
              data.awardRuleVos.forEach(function(v, i) {
                v.awardAmount = v.award;
              });
            }
            if (data.awardType == "1") {
              this.JawardRuleDtos = data.awardRuleVos;
              this.JawardRuleDtos.forEach(function(v, i) {
                if (!v.verifyCountMax) {
                  v.verifyCountMax = null;
                }
                if (!v.verifyCountMin) {
                  v.verifyCountMin = null;
                }
              });
              this.UawardRuleDtos = [
                {
                  verifyCountMin: null,
                  verifyCountMax: null,
                  awardAmount: null,
                  awardType: "1",
                  couponType: "",
                  awardName: ""
                }
              ];
            } else if (data.awardType == "2") {
              this.UawardRuleDtos = data.awardRuleVos;
              this.UawardRuleDtos.forEach(function(v, i) {
                if (!v.verifyCountMax) {
                  v.verifyCountMax = null;
                }
                if (!v.verifyCountMin) {
                  v.verifyCountMin = null;
                }
              });
              this.JawardRuleDtos = [
                {
                  verifyCountMin: null,
                  verifyCountMax: null,
                  awardAmount: null,
                  awardType: "2",
                  couponType: "",
                  awardName: ""
                }
              ];
            }
          } else {
            this.$Message.error(res.msg);
          }
        });
      } else {
        this.titleName = "新增";
        this.modal.name = "";
        this.modal.startTime = "";
        this.modal.wardType = "1";
        this.modal.endTime = "";
        this.modal.type = "1";
        this.couponObj = [];
        this.JawardRuleDtos = [
          {
            verifyCountMin: null,
            verifyCountMax: null,
            awardAmount: null,
            awardType: "1",
            couponType: "",
            awardName: ""
          }
        ];
        this.UawardRuleDtos = [
          {
            verifyCountMin: null,
            verifyCountMax: null,
            awardAmount: null,
            awardType: "2",
            couponType: "",
            awardName: ""
          }
        ];
      }
    },
    openVolume(item) {
      this.selectActiveVolumeModal = true;
      this.$nextTick(() => {
        this.$refs["volumeModal"].resetRow(item);
      });
    },
    openCoupon() {
      this.couponViewDialogModal = true;
      this.$nextTick(() => {
        this.$refs["couponModal"].resetRow(this.couponObj);
      });
    },
    selectCoupon(e) {
      this.couponViewDialogModal = false;
      if (e) {
        var that = this;
        if(this.couponObj.length==0){
            this.couponObj = e;
        }else if((e[0].shopName&&!this.couponObj[0].shopName)||e[0].merchantName&&!this.couponObj[0].merchantName){
            this.couponObj = e;
        }else{
            e.forEach(function(v, i) {
                that.couponObj.forEach(function(value, index) {
                    debugger
                    if (v.templateId === (value.templateId || value.id)) {
                        that.couponObj.splice(index, 1);
                    }
                });
            });
            this.couponObj = this.couponObj.concat(e);
        }
      }
    },
    selectVolume(e) {
      this.selectActiveVolumeModal = false;
    },
    reMoveCoupon(index) {
      this.couponObj.splice(index, 1);
    },
    changeRadio() {
        if(this.modal.wardType == '1'){
            this.JawardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'2',couponType:'',awardName:''}];
            this.UawardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'1',couponType:'',awardName:''}];
        }else{
            this.UawardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'1',couponType:'',awardName:''}];
            this.JawardRuleDtos = [{verifyCountMin:null,verifyCountMax:null,awardAmount:null,awardType:'1',couponType:'',awardName:''}];
        }
    },
    ok() {
      // /merchant/activity/award/add/activity
      // /merchant/activity/award/update/activity
      let params = {
        endTime: this.modal.endTime,
        id: this.modal.id,
        name: this.modal.name,
        startTime: this.modal.startTime,
        wardType: this.modal.wardType,
        type: 1
      };
      let couponIds = [];
      if (!this.couponObj || !this.couponObj.length) {
        this.$Message.error("请选择优惠券");
        return;
      } else {
        this.couponObj.forEach(function(v, i) {
          couponIds.push(v.templateId || v.id);
        });
      }
      params.couponIds = couponIds;
      if (!this.modal.name) {
        this.$Message.error("请填写活动名称");
        return;
      }
      if (!this.modal.startTime || !this.modal.endTime) {
        this.$Message.error("请选择时间");
        return;
      }
      if (!this.modal.wardType) {
        this.$Message.error("请选择赠送类型");
        return;
      }

      if (this.modal.wardType == "1") {
        params.awardRuleDtos = this.JawardRuleDtos;
        if (!params.awardRuleDtos[0].awardAmount) {
          this.$Message.error("请选择优惠券");
          return;
        }
      } else if (this.modal.wardType == "2") {
        params.awardRuleDtos = this.UawardRuleDtos;
        if (
          !params.awardRuleDtos[0].awardAmount ||
          params.awardRuleDtos[0].awardAmount == 0
        ) {
          this.$Message.error("请填写大于0的U贝数量");
          return;
        }
      }
      if (this.titleName == "新增") {
        postRequest(`/customer/activity/award/add/activity`, params).then(
          res => {
            if (res.code === "200") {
              this.$Message.success("新增成功");
              this.$emit("setViewDialogVisible", false);
              this.$emit("search");
            } else {
              this.$Message.error(res.msg);
            }
          }
        );
      } else {
        postRequest(`/customer/activity/award/update/activity`, params).then(
          res => {
            if (res.code === "200") {
              this.$Message.success("编辑成功");
              this.$emit("setViewDialogVisible", false);
              this.$emit("search");
            } else {
              this.$Message.error(res.msg);
            }
          }
        );
      }
    },
    close() {
      this.$emit("setViewDialogVisible", false);
    }
  }
};
</script>

<style scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  background: #fff;
  padding: 10px;
  z-index: 1;
}
h3 {
  border-left: 3px solid #333;
  padding-left: 10px;
  margin: 15px 0;
}
.padding-left-12 {
  padding-left: 12px;
}
.colof-a2 {
  color: #a2a2a2;
}
.ivu-radio-group-vertical .ivu-radio-wrapper {
  height: auto;
}
.coupon-item {
  position: relative;
  margin: 10px;
}
.coupon-item .ivu-icon {
  position: absolute;
}
</style>
