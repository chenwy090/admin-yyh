<!-- 优惠活动对话框 -->
<template>
  <div>
    <Modal
            v-model="isShow"
            title="请选择优惠活动"
            width="650"
            footer-hide
            :closable="false"

            :mask-closable="false"
            @on-cancel="closeDialog"
    >
      <Alert type="warning">请点击选择优惠券类型，按搜索，选择需要的优惠券</Alert>
      <Alert v-if="single === true" type="warning">点击表格行，即可选中该条优惠券</Alert>
      <Form ref="checkDetailsData" :model="checkDetailsData" :label-width="100">
        <FormItem label="优惠券类型：" style="display:inline-block">
          <!-- <Input style="width:200px" v-model="couponSearchData.couponType" placeholder="请输入" clearable /> -->
          <Select
                  v-model="couponSearchData.couponType"
                  style="width:200px"
                  @on-change="optionChange"
          >
            <Option :value="1">超市券</Option>
            <Option :value="2">周边券</Option>
          </Select>
        </FormItem>
        <FormItem label="优惠券名称：" style="display:inline-block">
          <Input style="width:200px" v-model="couponSearchData.name" placeholder="请输入" clearable />
        </FormItem>
        <FormItem class="br" :label-width="10">
          <Button type="primary" icon="ios-search" @click="search1">搜索</Button>
          <!-- <Button icon="md-refresh" @click="reset1">重置</Button> -->
        </FormItem>
      </Form>
      <Table
              v-if="single === true"
              border
              ref="selection"
              :highlight-row="true"
              @on-current-change="currentChange"
              :columns="couponSearchData.couponType == '1'?columns10:columns9"
              :data="CampaginList"
      ></Table>
      <Table
              v-else
              border
              ref="selection"
              :columns="couponSearchData.couponType == '1'?columns10:columns9"
              :data="CampaginList"
              @on-select="selectionCampagin"
              @on-select-cancel="cancelCampagin"
              @on-select-all="allCampagin"
              @on-select-all-cancel="cancelAllCampagin"
      ></Table>
      <!-- 分页器 -->
      <Row type="flex" justify="end" class="page mgt-10">
        <Page
                :total="totalSize1"
                show-total
                show-elevator
                :current="current1"
                @on-change="changeCurrent1"
        ></Page>
      </Row>
      <Row class="mgt-10">
        <Button @click="closeDialog">关闭</Button>
        <Button class="fl-r" type="primary" @click="campaginDisplayFn">保存</Button>
      </Row>
    </Modal>
  </div>
</template>
<script>
/**
 * 选择优惠券 默认多选
 * 需要单选 增加属性 :single="true"
 * 从这里摘出来的：
 * http://localhost:9999/customer_service/compensate
 * 使用方式：
 * <ChooseCoupon
      v-if="showChooseCoupon"
      :showChooseCoupon.sync="showChooseCoupon"
      @couponSelect="selectedCoupon"
    ></ChooseCoupon>
 */
import {
    getCompensateList,
    getCampaginListData,
    addCompensate,
    selectByid,
    addMateria
} from "@/api/sys";
import { uploadOperationImage2AliOssURl,baseUrl } from "@/api/index";
import { postRequest, downloadSteam } from "@/libs/axios";
import { uniqueArray } from "@/libs/date";
import comm from "@/mixins/common";

export default {
  props: {
    // 是否只能单选 默认false
    single: {
      type: Boolean,
      default() {
        return false
      }
    },
    checkedData: Object
    // checkedData = {
    //   couponKind: data.couponKind,
    //   templateId: data.templateId,
    //   title: data.title,
    // }
  },
  data () {
    return {
        isShow: true, // 默认true
        CampaginList: [], //优惠活动列表数据
        // 优惠券搜索
        couponSearchData: {
            couponType: "", //优惠券类型 1：超市券 2：周边券
            name: ""
        },
        // 优惠券列表
        current1: 1,
        totalSize1: 0, //总条数
        // 新增/编辑 周边券列表
        columns9: [
            {
                type: "selection",
                width: 60,
                align: "center"
            },
            {
                title: "优惠券ID",
                align: "center",
                minWidth: 140,
                key: "templateId"
            },
            {
                title: "优惠券名称",
                align: "center",
                minWidth: 140,
                key: "title"
            },
            {
                title: "所属商户",
                align: "center",
                minWidth: 140,
                key: "merchantNames"
            }
        ],
        // 超市券
        columns10: [
            {
                type: "selection",
                width: 60,
                align: "center"
            },
            {
                title: "优惠券ID",
                align: "center",
                minWidth: 140,
                key: "campId"
            },
            {
                title: "优惠券名称",
                align: "center",
                minWidth: 140,
                key: "name"
            }
        ],
        // 新增表单
        formValidate: {
            pushType: "",
            welfareType: "",
            templateIdList: [],
            amount: "",
            title: "",
            reason: "",
            specialTopicCouponList: [],
            remark: "", // 备注
            userId:[],
            failUserIdlist:[],
            reveiveType:'',
        },
        checkDetailsData: {} // 查看详情数据
    }
  },
  mixins: [comm],
  methods: {
      currentChange(row) {
        this.formValidate.specialTopicCouponList = [row];
      },
      // 保存 关闭优惠券选择对话框
      campaginDisplayFn () {
          let resData = JSON.parse(JSON.stringify(this.formValidate.specialTopicCouponList));
          resData.forEach((el,i)=>{
            resData[i].couponKind = this.couponSearchData.couponType;
          })
          this.$emit('couponSelect', resData);
          this.closeDialog();
          this.CampaginList = [];
          this.couponSearchData.couponType = "";
          this.couponSearchData.name = "";
          this.totalSize1 = 0;
          this.current1 = 1;
      },
      closeDialog() {
        this.$emit('update:showChooseCoupon', false);
      },
      //下拉选择器
      optionChange() {
          this.CampaginList = [];
          this.couponSearchData.name = "";
          this.current1 = 1;
      },
      // 分页
      changeCurrent1: function(current) {
          this.current1 = current;
          this.search1();
      },
      // 优惠券搜索
      search1() {
          if (this.couponSearchData.couponType == "") {
              this.msgErr("请选择优惠券类型");
              return;
          }
          let data = {};
          let url = "";
          if (this.couponSearchData.couponType == "1") {
              data = {
                  isEffective: 1,
                  campType: 57,
                  status: 1,
                  sendChannel: null,
                  name: this.couponSearchData.name
              };
              url = "/campagin/list";
          } else {
              data = {
                  templateStatus: "进行中",
                  title: this.couponSearchData.name
              };
              url = "/merchantCouponTemplate/backList";
          }
          getCampaginListData(url, data, this.current1).then(res => {
              if (res.code == 200) {
                  this.CampaginList = res.data.records;
                  if (this.single === true) {
                    this.handleChecked();
                  } else {
                    if (this.formValidate.specialTopicCouponList.length != 0) {
                        if (this.couponSearchData.couponType == "1") {
                            for (let i = 0; i < this.CampaginList.length; i++) {
                                for (
                                    let j = 0;
                                    j < this.formValidate.specialTopicCouponList.length;
                                    j++
                                ) {
                                    if (
                                        this.formValidate.specialTopicCouponList[j].templateId ==
                                        this.CampaginList[i].campId
                                    ) {
                                        this.CampaginList[i]._checked = true;
                                    }
                                }
                            }
                        } else {
                            for (let i = 0; i < this.CampaginList.length; i++) {
                                for (
                                    let j = 0;
                                    j < this.formValidate.specialTopicCouponList.length;
                                    j++
                                ) {
                                    if (
                                        this.formValidate.specialTopicCouponList[j].templateId ==
                                        this.CampaginList[i].templateId
                                    ) {
                                        this.CampaginList[i]._checked = true;
                                    }
                                }
                            }
                        }
                    }
                  }
                  // 分页
                  this.current1 = res.data.current;
                  this.totalSize1 = res.data.total;
              } else {
                  this.msgErr(res.msg);
              }
          });
      },
      handleChecked() {
        if (this.single === true) {
          let _keys = ['', 'campId', 'templateId'];
          let key = _keys[this.couponSearchData.couponType];
          if (this.checkedData && this.checkedData.templateId) {
            const len = this.CampaginList.length;
            for (let i = 0; i < len; i++) {
              if (this.CampaginList[i][key] === this.checkedData.templateId) {
                this.CampaginList[i]._highlight = true;
                this.formValidate.specialTopicCouponList = this.CampaginList[i];
                break;
              }
            }
          }
        }
      },

      // 选中优惠活动
      selectionCampagin(selection, row) {
          let obj = {};
          if (this.couponSearchData.couponType == 1) {
              obj = {
                  templateId: row.campId,
                  couponKind: this.couponSearchData.couponType,
                  merchantName: "",
                  name: row.name
              };
          } else {
              obj = {
                  templateId: row.templateId,
                  couponKind: this.couponSearchData.couponType,
                  merchantName: row.merchantName,
                  name: row.title
              };
          }
          this.formValidate.specialTopicCouponList.push(obj);
          // this.msgOk("选择成功，点击保存即刻关闭");
      },

      //全选优惠券
      allCampagin(selection) {
          let arr = [];
          if (this.couponSearchData.couponType == 1) {
              for (let i = 0; i < selection.length; i++) {
                  let obj = {
                      templateId: selection[i].campId,
                      couponKind: this.couponSearchData.couponType,
                      // merchantName: selection[i].merchantName || "",
                      name: selection[i].name
                  };
                  this.formValidate.specialTopicCouponList.push(obj);
              }
          } else {
              for (let i = 0; i < selection.length; i++) {
                  let obj = {
                      templateId: selection[i].templateId,
                      couponKind: this.couponSearchData.couponType,
                      merchantName: selection[i].merchantName,
                      name: selection[i].title
                  };
                  this.formValidate.specialTopicCouponList.push(obj);
              }
          }
          this.msgOk("选择成功，点击保存即刻关闭");
      },

      // 取消全选
      cancelAllCampagin(selection) {
          //去重
          var afterArr = uniqueArray(
              this.formValidate.specialTopicCouponList,
              "templateId"
          );
          this.formValidate.specialTopicCouponList = afterArr;

          if (this.couponSearchData.couponType == 1) {
              for (let i = 0; i < this.CampaginList.length; i++) {
                  for (
                      let j = 0;
                      j < this.formValidate.specialTopicCouponList.length;
                      j++
                  ) {
                      if (
                          this.CampaginList[i].campId ==
                          this.formValidate.specialTopicCouponList[j].templateId
                      ) {
                          if (this.formValidate.specialTopicCouponList[j].id) {
                              this.formValidate.delIds.push(
                                  this.formValidate.specialTopicCouponList[j].id
                              );
                          }
                          this.formValidate.specialTopicCouponList.splice(j, 1);
                      }
                  }
              }
          } else {
              for (let i = 0; i < this.CampaginList.length; i++) {
                  for (
                      let j = 0;
                      j < this.formValidate.specialTopicCouponList.length;
                      j++
                  ) {
                      if (
                          this.CampaginList[i].templateId ==
                          this.formValidate.specialTopicCouponList[j].templateId
                      ) {
                          if (this.formValidate.specialTopicCouponList[j].id) {
                              this.formValidate.delIds.push(
                                  this.formValidate.specialTopicCouponList[j].id
                              );
                          }
                          this.formValidate.specialTopicCouponList.splice(j, 1);
                      }
                  }
              }
          }
      },

      // 取消选中
      cancelCampagin(selection, row) {
          if (this.couponSearchData.couponType == 1) {
              for (
                  let i = 0;
                  i < this.formValidate.specialTopicCouponList.length;
                  i++
              ) {
                  if (
                      row.campId == this.formValidate.specialTopicCouponList[i].templateId
                  ) {
                      if (this.formValidate.specialTopicCouponList[i].id) {
                          this.formValidate.delIds.push(
                              this.formValidate.specialTopicCouponList[i].id
                          );
                      }
                      this.formValidate.specialTopicCouponList.splice(i, 1);
                  }
              }
          } else {
              for (
                  let i = 0;
                  i < this.formValidate.specialTopicCouponList.length;
                  i++
              ) {
                  if (
                      row.templateId ==
                      this.formValidate.specialTopicCouponList[i].templateId
                  ) {
                      if (this.formValidate.specialTopicCouponList[i].id) {
                          this.formValidate.delIds.push(
                              this.formValidate.specialTopicCouponList[i].id
                          );
                      }
                      this.formValidate.specialTopicCouponList.splice(i, 1);
                  }
              }
          }
      }

  },
  mounted() {
    if (this.single === true) {
      if (this.columns9[0].type === 'selection') {
        this.columns9.shift();
      }
      if (this.columns10[0].type === 'selection') {
        this.columns10.shift();
      }
    }
    if (this.checkedData.couponKind || typeof this.checkedData.couponKind === 'number') {
      this.couponSearchData.couponType = this.checkedData.couponKind;
      this.search1();
    }
  }
}
</script>
