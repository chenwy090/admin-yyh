
<template>
  <div class="search">
    <div
      style="width: 90%;background: #fff;box-shadow:0 6px 6px -4px rgba(0,0,0,.2);z-index: 100;position:fixed; padding:14px"
      v-if="edit_info.merchantId"
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
      <!-- <Card> -->
      <!-- <p slot="title">{{camp_pageStatus}}</p>

        <a href="#" slot="extra">
          <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回列表</Button>
      </a>-->

      <Row style="margin-left:15%;">
        <Form label-position="right" :label-width="150">
          <FormItem
            label="优惠券来源："
            :rules="{ required: true}"
          >{{couponSourceList[edit_info.couponSource]?couponSourceList[edit_info.couponSource].label:''}}</FormItem>
          <FormItem
            label="券码类型："
            :rules="{ required: true}"
          >{{couponCodeTypeList[edit_info.couponCodeType]?couponCodeTypeList[edit_info.couponCodeType].label:''}}</FormItem>

          <FormItem
            label="立即使用打开方式："
            :rules="{ required: true}"
          >{{userOpenWithCouponList[edit_info.userOpenWithCoupon]?userOpenWithCouponList[edit_info.userOpenWithCoupon].label:''}}</FormItem>

          <FormItem label="适用商户：" :rules="{ required: true}">
            <Table
              border
              width="400"
              :columns="columnsSelectMerchant"
              :data="edit_info.merchantInfoVOList"
            ></Table>
          </FormItem>

          <FormItem label="标题：" :rules="{ required: true}">{{edit_info.title}}</FormItem>
          <FormItem
            label="收费类型："
            :rules="{ required: true}"
          >{{couponKindList[edit_info.couponKind-1].label}}</FormItem>

          <template v-if="edit_info.couponKind==1">
            <FormItem label="优惠类型：" :rules="{ required: true}">{{edit_info.couponTypeName}}</FormItem>
          </template>
          <template v-if="edit_info.couponKind==2">
            <FormItem label="优惠类型：" :rules="{ required: true}">
              <Row>
                <Row>{{edit_info.couponTypeName}}</Row>
                <Row>
                  <span style="color:red">*</span>
                  原价 {{edit_info.originalPrice}}
                  <span>&nbsp;&nbsp; 元</span>
                  <span style="color:red;margin-left: 20px">*</span>
                  售卖价 {{edit_info.price}}
                  <span>&nbsp;&nbsp; 元</span>
                </Row>
              </Row>
            </FormItem>
          </template>

          <template v-if="edit_info.couponKind==1">
            <FormItem label="立减：" :rules="{ required: true}" v-if="edit_info.couponType==1">
              {{edit_info.ticketMoney}}
              <span style="color:red">&nbsp;&nbsp; 元</span>
            </FormItem>
            <FormItem label="折扣：" :rules="{ required: true}" v-if="edit_info.couponType==2">
              {{edit_info.ticketDiscount}}
              <span style="color:red">&nbsp;&nbsp; 折</span>
            </FormItem>
            <FormItem label="满：" :rules="{ required: true}" v-if="edit_info.couponType==3">
              {{edit_info.fullAmout}}
              <span style="color:red">&nbsp;&nbsp; 元</span>
            </FormItem>
            <FormItem label="减：" :rules="{ required: true}" v-if="edit_info.couponType==3">
              {{edit_info.decreaseAmount}}
              <span style="color:red">&nbsp;&nbsp; 元</span>
            </FormItem>
            <FormItem label="面额描述：" :rules="{ required: true}" v-if="edit_info.couponType==4">
              {{edit_info.displayText}}
              <span style="color:red">&nbsp;&nbsp; 体验券</span>
            </FormItem>
            <FormItem label="面额描述：" :rules="{ required: true}" v-if="edit_info.couponType==5">
              {{edit_info.displayText}}
              <span style="color:red">&nbsp;&nbsp; 换购券</span>
            </FormItem>
            <FormItem label="面额描述：" :rules="{ required: true}" v-if="edit_info.couponType==6">
              {{edit_info.displayText}}
              <span style="color:red">&nbsp;&nbsp; 赠品券</span>
            </FormItem>
          </template>

          <template v-if="edit_info.couponKind==2">
            <FormItem label="售后条件：" :rules="{ required: true}">
              <span
                v-for="(item,index) in edit_info.couponSaleAfterVOList"
                :key="index"
              >{{item.value}}&nbsp;&nbsp;</span>
            </FormItem>
          </template>

          <FormItem label="活动开始时间：" :rules="{ required: true}">{{edit_info.startDate}}</FormItem>
          <FormItem label="活动结束时间：" :rules="{ required: true}">{{edit_info.endDate}}</FormItem>
          <FormItem
            label="用券有效期类型："
            :rules="{ required: true}"
          >{{['','固定时间范围','相对有效期'][edit_info.useDateType]}}</FormItem>

          <FormItem
            label="用券开始时间："
            :rules="{ required: true}"
            v-if="edit_info.useDateType =='1'"
          >{{edit_info.useStartDate}}</FormItem>
          <FormItem
            label="用券结束时间："
            :rules="{ required: true}"
            v-if="edit_info.useDateType =='1'"
          >{{edit_info.useEndDate}}</FormItem>

          <FormItem label="加X天开始生效：" :rules="{ required: true}" v-if="edit_info.useDateType =='2'">
            {{edit_info.addDaysUseStart}}
            <span style="color:red">&nbsp;&nbsp; 天</span>
          </FormItem>
          <FormItem label="加Y天结束用券：" :rules="{ required: true}" v-if="edit_info.useDateType =='2'">
            {{edit_info.addDaysUseEnd}}
            <span style="color:red">&nbsp;&nbsp; 天</span>
          </FormItem>

          <FormItem
            label="是否活动券："
            :rules="{ required: true}"
          >{{['否','是'][edit_info.isActivityCoupon]}}</FormItem>

          <FormItem label="投放渠道：" :rules="{ required: true}">
            <span
              v-for="(item,index) in  edit_info.couponPutChannelVOList"
              :key="index"
            >{{item.value}}&nbsp;&nbsp;</span>
          </FormItem>

          <FormItem label="优惠券缩略图：" :rules="{ required: true}">
            <div class="imgSrc_box" v-if="imgSrc1">
              <img :src="imgSrc1" style="width:100%" />
            </div>
          </FormItem>
          <FormItem label="优惠券详情图：" :rules="{ required: true}">
            <div class="imgSrc_box" v-if="imgSrc2">
              <img :src="imgSrc2" style="width:100%" />
            </div>
          </FormItem>
          <FormItem label="首页缩略图：" :rules="{ required: true}">
            <div class="imgSrc_box" v-if="imgSrc3">
              <img :src="imgSrc3" style="width:100%" />
            </div>
          </FormItem>

          <FormItem label="库存数量：" :rules="{ required: true}">
            {{edit_info.stockCount}}
            <span style="color:red">&nbsp;&nbsp; 张</span>
          </FormItem>
          <FormItem label="用户限领数量：" :rules="{ required: true}">
            {{edit_info.getLimit}}
            <span style="color:red">&nbsp;&nbsp; 张</span>
          </FormItem>
          <FormItem label="券使用说明：" :rules="{ required: true}">{{edit_info.useDesc}}</FormItem>
          <FormItem label="备注：" :rules="{ required: true}">{{edit_info.remark}}</FormItem>
        </Form>

        <Row
          style="border-top: 1px solid #666;margin-top: 20px"
          v-if="formShareModal.shareData.length"
        >
          <Form ref="shareModal" :model="formShareModal" :label-width="100" style="margin-top:20px">
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
        <Form label-position="right" :label-width="150">
          <FormItem>
            <Button @click="showLog">操作日志</Button>
          </FormItem>
        </Form>
        <Row class="box" v-if="camp_pageStatus=='上架'">
          <Col span="16">
            <Button type="primary" @click="upStatus">上架</Button>
          </Col>
        </Row>
      </Row>
      <!-- </Card> -->

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="close">关闭</Button>
      </div>
    </div>
    <!-- <logModal ref="logModal" v-if="logDialogModal" :logDialogModal.sync="logDialogModal"></logModal> -->
    <logModal :logDialogModal.sync="logDialogModal" :id="couponEdit_info"></logModal>
  </div>
</template>

<script>
import { postJson, postRequest } from "@/libs/axios";
import { baseUrl } from "@/api/index";
import logModal from "./logInfo";
export default {
  name: "BasicSet",
  props: {
    couponEdit_info: String,
    couponDetailPage: {
      type: Boolean,
      default: true
    }
  },
  components: { logModal },
  data() {
    return {
      logDialogModal: false,
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
        }
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
          title: "商户编号",
          align: "center",
          key: "merchantId"
        },
        {
          title: "商户名称",
          align: "center",
          key: "merchantName"
        }
        // {
        //   title: "地址",
        //   align: "center",
        //   minWidth: 300,
        //   key: "address"
        // },
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
        couponSaleAfterList: [],
        startDate: "",
        endDate: "",
        useStartDate: "",
        useEndDate: "",
        addDaysUseStart: "",
        addDaysUseEnd: "",
        new_ticketMoney: 0,
        couponKind: 1,
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
    showLog() {
      this.logDialogModal = true;
      // this.$nextTick(() => {
      //   this.$refs["logModal"].resetRow(this.couponEdit_info);
      // });
    },
    colseModal() {
      this.logDialogModal = false;
    },
    //编辑
    editInfo() {
      postJson(
        baseUrl +
          "/merchantCouponTemplate/selectByTemplateId?templateId=" +
          this.couponEdit_info,
        {}
      )
        .then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.edit_info = res.data;
            this.uploadList = [{ url: this.edit_info.couponSmallImg }];
            this.uploadList1 = [{ url: this.edit_info.couponBigImg }];
            this.edit_info.merchantList = this.edit_info.merchantList;
            this.edit_info.couponType = String(res.data.couponType);
            this.imgSrc1 = this.edit_info.couponSmallImg;
            this.imgSrc2 = this.edit_info.couponBigImg;
            this.imgSrc3 = this.edit_info.couponSimpleImg;

            if (this.edit_info.couponKind == 2) {
              // this.edit_info.price = this.edit_info.price;
            } else {
              this.edit_info.price = 0;
            }

            this.edit_info.ticketMoney = this.edit_info.ticketMoney / 100;
            //console.info("this.edit_info.ticketMoney" + this.edit_info.ticketMoney);
            //console.info("this.edit_info.ticketMoney" + this.edit_info.ticketMoney);

            this.edit_info.ticketDiscount = this.edit_info.ticketDiscount / 10;
            this.edit_info.couponKind = this.edit_info.couponKind - 0;

            this.edit_info.couponKind =
              this.edit_info.couponKind == 1 ? "1" : "2";
            this.edit_info.useDateType =
              this.edit_info.useDateType == 1 ? "1" : "2";
          } else {
            this.msgErr(res.msg);
          }
        })
        .catch(err => {
          // console.log(err, 'operating_merchant/merchant-customer/merchant-customer-add, Line929')
        });
    },
    upStatus() {
      //templateId 券模板id 上架状态, 1:上架
      const reqParams = {
        templateId: this.couponEdit_info,
        status: 1,
        type: "优惠券管理"
      };
      const url = "/merchantCouponTemplate/upShelf";
      postRequest(url, reqParams).then(res => {
        if (res.code == 200) {
          this.msgOk("上架成功");
          this.updateTemplateStatusDisplay = false;
          //this.getList({});
          // 清空输入框
          this.refresh();
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3
      });
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3
      });
    },
    refresh() {
      this.close();
      this.$emit("refresh");
    },
    close() {
      // this.$emit("changeStatus", false);
      this.$emit("update:couponDetailPage", false);
    }
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
/* .ivu-form-item {
  margin-bottom: 0;
} */
.demo-drawer-footer {
  width: 100%;
  position: fixed;
  z-index: 111;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>

