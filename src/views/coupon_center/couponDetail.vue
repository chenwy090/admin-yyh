
<template>
  <div class="search">
    <div
      style="width: 90%;background: #fff;box-shadow:0 6px 6px -4px rgba(0,0,0,.2);z-index: 5;position:fixed; padding:14px"
    >
      <Alert show-icon v-if="edit_info.merchantId">
        <span>
          商户编号 :
          <span style="color:red">{{edit_info.merchantId}}</span>
        </span>
        <span v-if="edit_info.templateId" style="margin-left: 20px">
          优惠券模板ID :
          <span style="color:red">{{edit_info.templateId}}</span>
        </span>
        <span slot="desc"></span>
      </Alert>
    </div>
    <div style="padding-top: 50px">
      <Card>
        <p slot="title">查看详情</p>

        <a href="#" slot="extra">
          <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回列表</Button>
        </a>

        <Row style="margin-left:15%;">
          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>优惠券来源
            </Col>
            <Col span="16">
            {{couponSourceList[edit_info.couponSource]?couponSourceList[edit_info.couponSource].label:''}}
            </Col>
          </Row>

          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>券码类型
            </Col>
            <Col span="16">
              {{couponCodeTypeList[edit_info.couponCodeType]?couponCodeTypeList[edit_info.couponCodeType].label:''}}
            </Col>
          </Row>

          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>立即使用打开方式
            </Col>
            <Col span="20">
            {{userOpenWithCouponList[edit_info.userOpenWithCoupon]?userOpenWithCouponList[edit_info.userOpenWithCoupon].label:''}}
            </Col>
          </Row>

          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>适用商户
            </Col>
          </Row>
          <Row class="box">
            <Table
              border
              width="600px"
              :columns="columnsSelectMerchant"
              :data="edit_info.merchantInfoVOList"
            >
            </Table>
          </Row>

          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>标题
            </Col>
            <Col span="16">
              {{edit_info.title}}
            </Col>
          </Row>

          <Row class="box">
            <Col span="4" class="left-text">
            <span style="color:red">*</span>收费类型
            </Col>
            <Col span="20">
            {{couponKindList[edit_info.couponKind-1].label}}
            </Col>
          </Row>

          <!-- <Row class="box">
        <Col span="4" class="left-text"><span style="color:red">*</span>优惠副标题</Col>
        <Col span="16">
            <Input
                type="text"
                v-model="edit_info.subTitle"
                style="width:300px"
                placeholder="请输入优惠副标题"
                @on-change="statusCheckChange"
              />
        </Col>
          </Row>-->

          <Row class="box"  v-if="edit_info.couponKind==1">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>优惠类型
            </Col>
            <Col span="16">
            {{edit_info.couponTypeName}}
            </Col>
          </Row>
          <Row class="box" v-if="edit_info.couponKind==2">
            <Col span="4" class="left-text">
            <span style="color:red">*</span>优惠类型
            </Col>
            <Col span="16">
            {{edit_info.couponTypeName}}
            <div style="margin-top: 15px;">
              <span style="color:red">*</span>原价
             {{edit_info.originalPrice}}
                <span>&nbsp;&nbsp; 元</span>
              <span style="color:red;margin-left: 20px">*</span>售卖价
             {{edit_info.price}}
                <span>&nbsp;&nbsp; 元</span>
            </div>
            </Col>
          </Row>
          <div v-if="edit_info.couponKind==1">
            <Row class="box" v-if="edit_info.couponType==1">
              <Col span="4" class="left-text">
              <span style="color:red">*</span>立减
              </Col>
              <Col span="16">
              {{edit_info.ticketMoney}}
              <span style="color:red">&nbsp;&nbsp; 元</span>
              </Col>
            </Row>

            <Row class="box" v-if="edit_info.couponType==2">
              <Col span="4" class="left-text">
              <span style="color:red">*</span>折扣
              </Col>
              <Col span="16">
              {{edit_info.ticketDiscount}}
              <span style="color:red">&nbsp;&nbsp; 折</span>
              </Col>
            </Row>
            <Row class="box" v-if="edit_info.couponType==3">
              <Col span="4" class="left-text">
              <span style="color:red">*</span>满
              </Col>
              <Col span="16">
              {{edit_info.fullAmout}}
              <span style="color:red">&nbsp;&nbsp; 元</span>
              </Col>
            </Row>
            <Row class="box" v-if="edit_info.couponType==3">
              <Col span="4" class="left-text">
              <span style="color:red">*</span>减
              </Col>
              <Col span="16">
              {{edit_info.decreaseAmount}}
              <span style="color:red">&nbsp;&nbsp; 元</span>
              </Col>
            </Row>
            <Row class="box" v-if="edit_info.couponType==4">
              <Col span="4" class="left-text">
              <span style="color:red">*</span>面额描述
              </Col>
              <Col span="16">
              {{edit_info.displayText}}
              <span style="color:red">&nbsp;&nbsp; 体验券</span>
              </Col>
            </Row>
            <Row class="box" v-if="edit_info.couponType==5">
              <Col span="4" class="left-text">
              <span style="color:red">*</span>面额描述
              </Col>
              <Col span="16">
              {{edit_info.displayText}}
              <span style="color:red">&nbsp;&nbsp; 换购券</span>
              </Col>
            </Row>
            <Row class="box" v-if="edit_info.couponType==6">
              <Col span="4" class="left-text">
              <span style="color:red">*</span>面额描述
              </Col>
              <Col span="16">
              {{edit_info.displayText}}
              <span style="color:red">&nbsp;&nbsp; 赠品券</span>
              </Col>
            </Row>
          </div>
          <Row class="box" v-if="edit_info.couponKind==2">
            <Col span="4" class="left-text">
            <span style="color:red">*</span>售后条件
            </Col>
            <Col span="20">
            <span v-for="item in couponSaleAfterList">{{item.value}}&nbsp;&nbsp;</span>
            </Col>
          </Row>
          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>活动开始时间
            </Col>
            <Col span="16">
              {{edit_info.startDate}}
            </Col>
          </Row>

          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>活动结束时间
            </Col>
            <Col span="16">
              {{edit_info.endDate}}
            </Col>
          </Row>

          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>用券有效期类型
            </Col>
            <Col span="16">
            {{['','固定时间范围','相对有效期'][edit_info.useDateType]}}
            </Col>
          </Row>

          <Row class="box" v-if="edit_info.useDateType =='1'">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>用券开始时间
            </Col>
            <Col span="16">
             {{edit_info.useStartDate}}
            </Col>
          </Row>

          <Row class="box" v-if="edit_info.useDateType =='1'">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>用券结束时间
            </Col>
            <Col span="16">
             {{edit_info.useEndDate}}
            </Col>
          </Row>

          <Row class="box" v-if="edit_info.useDateType =='2'">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>加X天开始生效
            </Col>
            <Col span="16">
             {{edit_info.addDaysUseStart}}
              <span style="color:red">&nbsp;&nbsp; 天</span>
            </Col>
          </Row>

          <Row class="box" v-if="edit_info.useDateType =='2'">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>加Y天结束用券
            </Col>
            <Col span="16">
             {{edit_info.addDaysUseEnd}}
              <span style="color:red">&nbsp;&nbsp; 天</span>
            </Col>
          </Row>

          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span> 是否活动券
            </Col>
            <Col span="4">
            {{['否','是'][edit_info.isActivityCoupon]}}
            </Col>
          </Row>
          <Row class="box">
            <Col span="4" class="left-text">
            <span style="color:red">*</span>投放渠道
            </Col>
            <Col span="20">
           <span v-for="item in edit_info.couponPutChannelVOList">{{item.value}}&nbsp;&nbsp;</span>
            </Col>
          </Row>
          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span> 优惠券缩略图
            </Col>
            <Col span="4">
              <div class="imgSrc_box" v-if="imgSrc1">
                <img :src="imgSrc1" style="width:100%" />
              </div>
            </Col>
          </Row>

          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span> 优惠券详情图
            </Col>
            <Col span="4">
              <div class="imgSrc_box" v-if="imgSrc2">
                <img :src="imgSrc2" style="width:100%" />
              </div>
            </Col>
          </Row>
          <Row class="box">
            <Col span="4" class="left-text">
            首页缩略图
            </Col>
            <Col span="4">
            <div class="imgSrc_box" v-if="imgSrc3">
              <img :src="imgSrc3" style="width:100%" />
            </div>
            </Col>
          </Row>
          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>库存数量
            </Col>
            <Col span="16">
             {{edit_info.stockCount}}
                <span style="color:red">&nbsp;&nbsp; 张</span>
            </Col>
          </Row>
          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>用户限领数量
            </Col>
            <Col span="16">
            {{edit_info.getLimit}}
                <span style="color:red">&nbsp;&nbsp; 张</span>
            </Col>
          </Row>
          <Row class="box">
            <Col span="4" class="left-text">
              <span style="color:red">*</span>券使用说明
            </Col>
            <Col span="16">
             {{edit_info.useDesc}}
            </Col>
          </Row>
          <Row class="box">
            <Col span="4" class="left-text">备注</Col>
            <Col span="16">
              {{edit_info.remark}}
            </Col>
          </Row>
          <Row
            style="border-top: 1px solid #666;margin-top: 20px"
            v-if="formShareModal.shareData.length"
          >
            <Form
              ref="shareModal"
              :model="formShareModal"
              :label-width="100"
              style="margin-top:20px"
            >
              <FormItem
                v-for="item in formShareModal.shareData"
                :key="item.id"
                :label="item.name"
                required
              >
                {{item.value}}
                <span v-if="item.name!= '倍数'">&nbsp;&nbsp;U贝</span>
                <span v-if="item.name== '倍数'">&nbsp;&nbsp;倍</span>
              </FormItem>
            </Form>
          </Row>
        </Row>
      </Card>
    </div>
  </div>
</template>

<script>
import {
    postJson
} from "@/libs/axios";
import { baseUrl } from "@/api/index";
export default {
  name: "BasicSet",
  props: {
    couponEdit_info: String
  },
  data() {
    return {
      //乐刻需求新增begin--------------------------
      // 优惠券来源 0-平台自营券 1-第三方券
      // couponSource: "0",
      couponSourceList: [
        {
          value: 0,
          label: "平台自营券"
        },
        {
          value: 1,
          label: "第三方券"
        }
      ],
        couponKindList: [
        {
          value: 1,
          label: "免费券"
        },
        {
          value: 2,
          label: "付费券"
        }
      ],
        couponSaleAfterList: [
        {
          code: 1,
            value: "随时退"
        },
        {
          code: 2,
            value: "过期退"
        }
      ],
        couponPutChannelList: [
        {
          code: 1,
          value: "常规券"
        },
        {
          code: 2,
            value: "精准拓客"
        },
            {
                code: 3,
                value: "平台拓客"
            },
            {
                code: 4,
                value: "客服补偿"
            },
            {
                code: 5,
                value: "抽奖团"
            },
            {
                code: 6,
                value: "超值爆抢"
            },
            {
                code: 7,
                value: "专题活动"
            },
            {
                code: 8,
                value: "赏U任务"
            },
            {
                code: 9,
                value: "核销赠券"
            },
      ],
      // 券码类型  0-平台生成券码
      // couponCodeType: "0",
      couponCodeTypeList: [
        {
          value: 0,
          label: "平台生成券码"
        }
      ],
      // 立即使用打开方式 0-打开详情 1-跳转第三方
      // userOpenWithCoupon: "0",
      userOpenWithCouponList: [
        {
          value: 0,
          label: "打开详情"
        }
        // {
        //   value: 1,
        //   label: "跳转第三方"
        // }
      ],
      // thirdUrl: "",

      //乐刻需求新增end--------------------------
      formShareModal: {
        shareData: []
      },
      imgSrc1: null,
      imgSrc2: null,
      imgSrc3: null,
      receiveRuleSetPage: false,
      visible: false,
      imgName: "",
      merchantTabDisplay: false, // 商户选择框显示
      userInfoDisplay: false, //用户选择显示框
      selectedMerchantList: [], //选中的商户列表
      searchItem: {
        merchantId: "",
        name: "",
        provinceId: "",
        cityId: "",
        areaId: ""
      },
      columnsSelectMerchant: [
        {
          title: "商户名称",
          align: "center",
          width: 300,
          key: "merchantName"
        },
        {
          title: "merchantId",
          align: "center",
          minWidth: 200,
          key: "merchantId"
        },
      ],
      current: 1,
      totalSize: 0, //总条数
      pageNum: 1, //开始条数
      TableLoading: false,
      pageStatus: "",
      merchantList: [],
      provincelist: [],
      citylist: [],
      arealist: [],
      userToken: {}, //用户token
      edit_info: {
        // 是否活动券 （默认否）0-否，1-是   isActivityCoupon
        isActivityCoupon: 0,
        orderBy: "",
        merchantList: [],
          couponSaleAfterList:[],
        startDate: "",
        endDate: "",
        useStartDate: "",
        useEndDate: "",
        addDaysUseStart: "",
        addDaysUseEnd: "",
        new_ticketMoney: 0,
          couponKind:1,
        ticketMoney: 0,
        price: 0,
        ticketDiscount: 0,
        new_ticketDiscount: 0,
        getLimit: 0,
        stockCount: 0,
        fullAmout: 0,
        decreaseAmount: 0,
        displayText: ""
      },
      edit_loading: false,
      userToken: "",
      campId: "",
      imgUrl: "",
      uploadList: [],
      uploadList1: [],
      camp_pageStatus: "",
      getUrl: "",
      msg: "",
      isCheckDisabled: false,
      reqParams: {}
    };
  },

  created() {
    this.userToken = { jwttoken: localStorage.getItem("jwttoken") };
    this.init();
  },
  methods: {
    init() {
      this.camp_pageStatus = this.getStore("camp_pageStatus");
      this.editInfo();
    },
    //编辑
    editInfo() {
        postJson(baseUrl + "/merchantCouponTemplate/selectByTemplateId?templateId="+this.couponEdit_info,{}).then(res => {
            // console.log(res);
            if (res.code == 200) {
                this.edit_info = res.data
                this.uploadList = [{ url: this.edit_info.couponSmallImg }];
                this.uploadList1 = [{ url: this.edit_info.couponBigImg }];
                this.edit_info.merchantList = this.edit_info.merchantList;

                this.imgSrc1 = this.edit_info.couponSmallImg;
                this.imgSrc2 = this.edit_info.couponBigImg;
                this.imgSrc3 = this.edit_info.couponSimpleImg;

                if (this.edit_info.couponKind == 2) {
                    this.edit_info.price = this.edit_info.price;
                } else {
                    this.edit_info.price = 0;
                }

                this.edit_info.ticketMoney = this.edit_info.ticketMoney / 100;
                //console.info("this.edit_info.ticketMoney" + this.edit_info.ticketMoney);
                //console.info("this.edit_info.ticketMoney" + this.edit_info.ticketMoney);

                this.edit_info.ticketDiscount = this.edit_info.ticketDiscount / 10;
                this.edit_info.couponKind = this.edit_info.couponKind-0;
                this.edit_info.couponType =
                    this.edit_info.couponType == 1
                        ? "1"
                        : this.edit_info.couponType == 2
                        ? "2"
                        : this.edit_info.couponType == 3
                            ? "3"
                            : this.edit_info.couponType == 4
                                ? "4"
                                : this.edit_info.couponType == 5
                                    ? "5"
                                    : "6";
                this.edit_info.couponKind =
                    this.edit_info.couponKind == 1 ? "1" : "2";
                this.edit_info.useDateType =
                    this.edit_info.useDateType == 1 ? "1" : "2";
            } else {
                this.msgErr(res.msg);
            }
        }).catch(err=>{
            // console.log(err, 'operating_merchant/merchant-customer/merchant-customer-add, Line929')
        });

    },
      goback() {
          this.$emit("changeStatus", false);
      },

  },
  mounted() {
    // this.init();
  }
};
</script>


<style>
.form {
  width: 900px;
}
.form > div {
  display: inline-block;
}
.demo-upload-list {
  display: inline-block;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 60px;
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
.imgSrc_box {
  float: left;
  width: 90px;
  height: 90px;
  line-height: 90px;
  margin-right: 10px;
  border: 1px dashed #dcdee2;
  background: #fff;
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
.box {
  margin-bottom: 20px;
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
</style>

