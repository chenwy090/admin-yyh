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
        <h3>活动信息</h3>
        <Row class="padding-left-12">
          <Col span="18">
            <FormItem label="活动名称">
              <Input
                type="text"
                v-model="modal.name"
                placeholder="请填写活动名称，20字以内"
                style="width: 40%"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row class="padding-left-12">
          <Col span="18">
            <FormItem label="活动时间">
              <DatePicker
                :value="modal.startTime"
                type="date"
                placeholder="请选择时间"
                style="width: 160px"
                :options="options1"
                @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
              ></DatePicker>--
              <DatePicker
                :value="modal.endTime"
                type="date"
                placeholder="请选择时间"
                style="width: 160px"
                :options="options2"
                @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <h3>请选择参与活动券</h3>
        <Row class="padding-left-12">
          <Col span="18">
            <FormItem label="参与活动券">
              <Button type="dashed" @click="openCoupon">
                <span v-if="couponObj.length===0">参与活动券</span>
                <Button :key="index" v-for="(item,index) in couponObj" class="coupon-item">
                  {{item.title +'&nbsp&nbsp'}}
                  <Icon @click.stop="reMoveCoupon(index)" type="ios-close" />
                </Button>
              </Button>
            </FormItem>
          </Col>
        </Row>
        <h3>赠送规则</h3>
        <Row class="padding-left-12">
          <Col span="18">
            <RadioGroup
              v-model="modal.wardType"
              vertical
              style="width: 100%"
              @on-change="changeRadio"
            >
              <Radio label="1" style="display: inline-block">
                <span>核销赠券</span>
              </Radio>
              <div style="width: 2%;display: inline-block"></div>
              <span class="colof-a2">(在核销主商户券码时，赠送合作方发放的优惠券)</span>
              <div></div>
              <div v-if="modal.wardType==1">
                <div v-for="(item,index) in JawardRuleDtos" class="radio-item">
                  <div style="margin: 10px 0;">
                    <Button
                            type="dashed"
                            @click="openVolume(item)"
                    >{{item.awardName||item.title?item.awardName||item.title:'请选择优惠券'}}</Button>
                  </div>
                </div>
              </div>
              <Radio label="2" style="display: inline-block">
                <span>核销赠U贝</span>
              </Radio>
              <div style="width: 2%;display: inline-block"></div>
              <span class="colof-a2">(在核销主商户券码时，赠送平台费U贝)</span>
              <div></div>
              <div v-if="modal.wardType==2">
                <div v-for="(item,index) in UawardRuleDtos" class="radio-item">
                  <div style="margin: 10px 0;">
                    <InputNumber
                            :min="0"
                            :step="1"
                            type="text"
                            :precision="0"
                            v-model="item.awardAmount"
                            placeholder="请输入U贝数量"
                            style="width: 150px"
                    ></InputNumber>  U贝
                    <div style="width: 2%;display: inline-block"></div>
                    <span class="colof-a2">(只能输入整数)</span>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </Col>
        </Row>
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
      titleName: "",
      couponType:'',
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
      options2: {
        disabledDate(date) {
          return date.valueOf() < Date.now() - 1000 * 60 * 60 * 24;
        }
      },
      options1: {
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
            this.couponType = data.couponType;
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
    selectCoupon(e,type) {
      this.couponViewDialogModal = false;
      if (e) {
          if(this.couponType === type){
              var that = this;
              e.forEach(function(v, i) {
                  that.couponObj.forEach(function(value, index) {
                      debugger
                      if (v.templateId === (value.templateId || value.id)) {
                          that.couponObj.splice(index, 1);
                      }
                  });
              });
              this.couponObj = this.couponObj.concat(e);
          }else{
              this.couponObj = e;
          }
          this.couponType = type;
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
        couponType:this.couponType,
        endTime: this.modal.endTime,
        id: this.modal.id,
        name: this.modal.name,
        startTime: this.modal.startTime,
        wardType: this.modal.wardType,
        type: 1,
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
