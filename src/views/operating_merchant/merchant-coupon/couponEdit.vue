
<template>
   <div class="search">
    <div
            style="width: 90%;background: #fff;box-shadow:0 6px 6px -4px rgba(0,0,0,.2);z-index: 5;position:fixed; padding:14px">
      <Alert show-icon v-if="couponEdit_info.merchantId">
              <span> 
                商户编号 :
                <span style="color:red">{{couponEdit_info.merchantId}}</span>

            </span> 
            <span  v-if="edit_info.templateId" style="margin-left: 20px"> 
             优惠券模板ID :
                <span style="color:red">{{edit_info.templateId}}</span>
        </span> 
                <span slot="desc"></span>
              </Alert>
    </div>
     <div style="padding-top: 100px">
        <Card>
          <p slot="title">优惠券模版设置</p>

          <a href="#" slot="extra">
            <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回列表</Button>
          </a>

      <Row style="margin-left:15%;" >

   <Row class="box"> 
        <Col span="3" class="left-text"><span style="color:red">*</span>优惠券标题</Col>
        <Col span="16">
            <Tooltip trigger="focus" title="提醒" content="最多10个汉字" placement="right">
              <Input
                  type="text"
                v-model="edit_info.title"
                style="width:300px"
                placeholder="请输入优惠券标题"
                @on-change="statusCheckChange"
                 :maxlength="10"
              />
                  </Tooltip>
        </Col>
      </Row>


  <!-- <Row class="box"> 
        <Col span="3" class="left-text"><span style="color:red">*</span>优惠副标题</Col>
        <Col span="16">
            <Input
                type="text"
                v-model="edit_info.subTitle"
                style="width:300px"
                placeholder="请输入优惠副标题"
                @on-change="statusCheckChange"
              />
        </Col>
        </Row> -->

  <Row class="box"> 
        <Col span="3" class="left-text"><span style="color:red">*</span>优惠类型</Col>
        <Col span="16">
            <Select
                v-model="edit_info.couponType"
                style="width:300px"
                @on-change="statusCheckChange"
              >
                <Option value="1">固定金额</Option>
                <Option value="2">折扣</Option>
              </Select>
        </Col>
      </Row>

  <Row class="box" v-if="edit_info.couponType==1"> 
        <Col span="3" class="left-text"><span style="color:red">*</span>金额</Col>
        <Col span="16">
            <Tooltip trigger="focus" title="提醒" content="最多为两位小数点,最大为999999.99" placement="right">
                <InputNumber
                        :min="0"
                        type="text"
                        v-model="edit_info.ticketMoney"
                        placeholder="请输入金额"
                        style="width:300px"
                      :max="999999.99"
                      ></InputNumber>
                        <span style="color:red">&nbsp;&nbsp; 元</span>
              </Tooltip>
        </Col>
      </Row>
             
  <Row class="box" v-if="edit_info.couponType==2"> 
        <Col span="3" class="left-text"><span style="color:red">*</span>折扣</Col>
        <Col span="16">
            <Tooltip trigger="focus" title="提醒" content="最多为一位小数点" placement="right">
               <InputNumber
                    :min="0"
                    type="text"
                    v-model="edit_info.ticketDiscount"
                    placeholder="请输入折扣"
                    style="width:300px"
                    :max="10.0"

                    
                  ></InputNumber>
                    <span style="color:red">&nbsp;&nbsp; 折</span>
              </Tooltip>
        </Col>
      </Row>

       
  <Row class="box" > 
        <Col span="3" class="left-text"><span style="color:red">*</span>优惠券种类</Col>
        <Col span="16">
              <Select
                v-model="edit_info.couponKind"
                style="width:300px"
                @on-change="statusCheckChange"
              >
                <Option value="1">免费券</Option>
                <Option value="2">付费券</Option>
              </Select>
        </Col>
      </Row>

           
  <Row class="box"   v-if="edit_info.couponKind==2"> 
        <Col span="3" class="left-text"><span style="color:red">*</span>购买价格</Col>
        <Col span="16">
           <Tooltip trigger="focus" title="提醒" content="最多为两位小数点,最大为999999.99" placement="right">
  
             <InputNumber
                :min="0"
                type="text"
                v-model="edit_info.price"
                placeholder="请输入购买价格"
                style="width:300px"
                :max="999999.99"

              ></InputNumber>
             <span style="color:red">&nbsp;&nbsp; 元</span>

            </Tooltip>
        </Col>
      </Row>
   


       <Row class="box" > 
        <Col span="3" class="left-text"><span style="color:red">*</span>活动开始时间</Col>
        <Col span="16">
               <DatePicker
                  type="date"
                  @on-change="statusCheckChange"
                  v-model="edit_info.startDate"
                  placeholder="选择活动开始时间"
                  style="width: 300px"
                ></DatePicker>
        </Col>
      </Row>

   <Row class="box" > 
        <Col span="3" class="left-text"><span style="color:red">*</span>活动结束时间</Col>
        <Col span="16">
             <DatePicker
                  type="date"
                  @on-change="statusCheckChange"
                  placeholder="选择活动结束时间"
                  style="width:300px"
                  v-model="edit_info.endDate"
                ></DatePicker>
        </Col>
      </Row>
         
   <Row class="box" > 
        <Col span="3" class="left-text"><span style="color:red">*</span>用券有效期类型</Col>
        <Col span="16">
              <Select
                v-model="edit_info.useDateType"
                style="width:300px"
                @on-change="statusCheckChange"
              >
                <Option value="1">固定时间范围</Option>
                <Option value="2">相对有效期</Option>
              </Select>
        </Col>
      </Row>
           

        <Row class="box" v-if="edit_info.useDateType =='1'" > 
        <Col span="3" class="left-text"><span style="color:red">*</span>用券开始时间</Col>
        <Col span="16">
                <DatePicker
                      type="date"
                      @on-change="statusCheckChange"
                      v-model="edit_info.useStartDate"
                      placeholder="选择用券开始时间"
                      style="width: 300px"
                    ></DatePicker>
        </Col>
      </Row>  

      <Row class="box" v-if="edit_info.useDateType =='1'" > 
        <Col span="3" class="left-text"><span style="color:red">*</span>用券结束时间</Col>
        <Col span="16">
                <DatePicker
                      type="date"
                      @on-change="statusCheckChange"
                      placeholder="选择用券结束时间"
                      style="width:300px"
                      v-model="edit_info.useEndDate"
                    ></DatePicker>
                  </FormItem>
        </Col>
      </Row>  
       

      <Row class="box" v-if="edit_info.useDateType =='2'" > 
        <Col span="3" class="left-text"><span style="color:red">*</span>加X天开始生效</Col>
        <Col span="16">
                <Input
                          type="text"
                          :min="0"

                          v-model="edit_info.addDaysUseStart"
                          style="width:300px"
                          placeholder="请输入加X天开始生效"
                      />
                 <span style="color:red">&nbsp;&nbsp; 天</span>
        </Col>
      </Row>             

      

      <Row class="box" v-if="edit_info.useDateType =='2'" > 
        <Col span="3" class="left-text"><span style="color:red">*</span>加Y天结束用券</Col>
        <Col span="16">
               <Input
                       :min="0"
                              type="text"
                              v-model="edit_info.addDaysUseEnd"
                              style="width:300px"
                              placeholder="请输入加Y天结束用券"
                          />
                       <span style="color:red">&nbsp;&nbsp; 天</span>
        </Col>
      </Row>    
            



    <Row class="box">
              <Col span="3" class="left-text"> <span style="color:red">*</span> 优惠券缩略图</Col>
              <Col span="3"  >
                  <div class="imgSrc_box"   v-if="imgSrc1" >
                      <img  :src="imgSrc1" style="width:100%">
                  </div>
               </Col>
                  <Col span="9"  >
                  <div style="width:100px; float:left">
                    <ImgCutter :label="'选择图片'"  :boxWidth="600"  :boxHeight="500" v-on:cutDown="cutDown1" >
                        <button slot="openImgCutter"  style="width:100px; background: border-box">上传图片</button>
                    </ImgCutter>
                  </div>
                  <br>
                  <div  class="left-text">选择优惠券缩略图 (不大于1M,JPG/PNG/JPEG/BMP）</div>
               </Col>
             
          </Row>


          <Row class="box">
              <Col span="3" class="left-text"> <span style="color:red">*</span> 优惠券详情图</Col>
              <Col span="3"  >
                  <div class="imgSrc_box"   v-if="imgSrc2" >
                      <img  :src="imgSrc2" style="width:100%">
                  </div>
               </Col>
                  <Col span="9"  >
                  <div style="width:100px; float:left">
                    <ImgCutter :label="'选择图片'"  :boxWidth="600"  :boxHeight="500" v-on:cutDown="cutDown2" >
                        <button slot="openImgCutter"  style="width:100px; background: border-box">上传图片</button>
                    </ImgCutter>
                  </div>
                  <br>
                  <div  class="left-text">选择优惠券缩略图 (不大于1M,JPG/PNG/JPEG/BMP）</div>
               </Col>
             
          </Row>

           

      <Row class="box"  > 
        <Col span="3" class="left-text"><span style="color:red">*</span>购买须知</Col>
        <Col span="16">
               <Input
                type="textarea"
                v-model="edit_info.buyNotes"
                style="width:300px"
                :autosize="{minRows: 2,maxRows: 5}"
                @on-change="statusCheckChange"
              />
        </Col>
      </Row>    

   <Row class="box"  > 
        <Col span="3" class="left-text"><span style="color:red">*</span>券使用说明</Col>
        <Col span="16">
                 <Tooltip trigger="focus" title="提醒" content="最多100个汉字" placement="right">
              <Input
                type="textarea"
                v-model="edit_info.useDesc"
                style="width:400px"
                :autosize="{minRows: 4,maxRows: 8}"
                @on-change="statusCheckChange"
                :maxlength="100"

              />
                   </Tooltip>
        </Col>
      </Row>   


       <Row class="box"  > 
        <Col span="3" class="left-text"><span style="color:red">*</span>用户限领数量</Col>
        <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="最大为2147483647" placement="right">

                     <InputNumber
                                v-model="edit_info.getLimit"
                                placeholder="请输入用户限领数量(请输入正整数)"
                               style="width:300px"
                                :min="1"
                                :step="1"
                            :max ="2147483647"
                              ></InputNumber>
                            
                               <span style="color:red">&nbsp;&nbsp; 张</span>
                                 </Tooltip> 
        </Col>
      </Row>      
       
       <Row class="box"  > 
        <Col span="3" class="left-text"><span style="color:red">*</span>库存数量</Col>
        <Col span="16">
             <Tooltip trigger="focus" title="提醒" content="最大为2147483647" placement="right">

                     <InputNumber
                                v-model="edit_info.stockCount"
                                placeholder="请输入库存数量(请输入正整数)"
                               style="width:300px"
                                :min="1"
                                 :step="1"
                        :max ="2147483647"
                           
                              ></InputNumber>
              <span style="color:red">&nbsp;&nbsp; 张</span>
                </Tooltip> 
        </Col>
      </Row>      
       

      
       <Row class="box"  required v-if="camp_pageStatus =='edit' " > 
        <Col span="3" class="left-text"><span style="color:red">*</span>顺序排序</Col>
        <Col span="16">
             <Tooltip trigger="focus" title="提醒" content="最大为999999999" placement="right">
              <Input
                type="text"
                v-model="edit_info.orderBy"
                style="width:300px"
                placeholder="请输入顺序排序"
                @on-change="statusCheckChange"
                
                    :maxlength="9"
              />
                </Tooltip> 
        </Col>
      </Row>     

           
      <Row class="box"  required v-if="camp_pageStatus =='edit' " > 
        <Col span="3" class="left-text">备注</Col>
        <Col span="16">
            <Input
                type="textarea"
                v-model="edit_info.remark"
                style="width:400px"
                :autosize="{minRows: 4,maxRows: 8}"
                @on-change="statusCheckChange"
              />
        </Col>
      </Row>     

      

            <Row style="{'margin-top':'54px'}">
              <Alert type="warning" show-icon v-if="isCheckDisabled == true" style="width:500px">修改后才能保存</Alert>
              <Button
                type="primary"
                @click="campagin_add()"
                :loading="edit_loading"
                style="width:300px;"
                :disabled="isCheckDisabled"
              >保存</Button>
             
            </Row>
     </Row>
        </Card>

  </div>

 </div>
 
</template>

<script>
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from "@/libs/axios";
import { formatDate, checkImageWH } from "@/libs/date";
import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";
import ImgCutter from "@/components/ImgCutter.vue";
export default {
  name: "BasicSet",
  components: {
    ImgCutter
  },
  props: {
    couponEdit_info: Object
  },
  data() {
    return {
      imgSrc1: null,
      imgSrc2: null,
      receiveRuleSetPage: false,
      visible: false,
      imgName: "",
      edit_info: {
        startDate: "",
        endDate: "",
        useStartDate: "",
        useEndDate: "",
        addDaysUseStart: "",
        addDaysUseEnd: "",
        ticketMoney: 0,
        price: 0,
        ticketDiscount: 0,
        getLimit: 1,
        stockCount: 1
      },
      edit_loading: false,
      userToken: "",
      campId: "",
      imgUrl: "",
      url: uploadOperationImage2AliOssURl,
      uploadList: [],
      uploadList1: [],
      camp_pageStatus: "",
      getUrl: "",
      msg: "",
      isCheckDisabled: false,
      reqParams: {}
    };
  },

  created: function() {
    this.userToken = { jwttoken: localStorage.getItem("jwttoken") };
  },
  methods: {
    init() {
      this.camp_pageStatus = this.getStore("camp_pageStatus");

      this.getCampInfo();
    },
    getCampInfo() {
      if (this.camp_pageStatus == "add") {
        this.addInfo();
      } else if (this.camp_pageStatus == "edit") {
        this.editInfo();
      }
    },
    //新增
    addInfo() {
      this.edit_info = {
        startDate: "",
        endDate: "",
        useStartDate: "",
        useEndDate: "",
        addDaysUseStart: "",
        addDaysUseEnd: "",
        status: "0",
        orderBy: "9999",
        ticketMoney: 0,
        price: 0,
        ticketDiscount: 0,
        getLimit: 1,
        stockCount: 1
      };
    },

    //编辑
    editInfo() {
      this.edit_info = this.couponEdit_info;
      this.uploadList = [{ url: this.couponEdit_info.couponSmallImg }];
      this.uploadList1 = [{ url: this.couponEdit_info.couponBigImg }];

      this.imgSrc1 = this.couponEdit_info.couponSmallImg;
      this.imgSrc2 = this.couponEdit_info.couponBigImg;

      if (this.edit_info.couponKind == 2) {
        this.edit_info.price = this.couponEdit_info.price / 100;
      } else {
        this.edit_info.price = 0;
      }

      this.edit_info.ticketMoney = this.couponEdit_info.ticketMoney / 100;

      this.edit_info.ticketDiscount = this.couponEdit_info.ticketDiscount / 10;

      this.edit_info.couponType =
        this.couponEdit_info.couponType == 1 ? "1" : "2";
      this.edit_info.couponKind =
        this.couponEdit_info.couponKind == 1 ? "1" : "2";
      this.edit_info.useDateType =
        this.couponEdit_info.useDateType == 1 ? "1" : "2";
    },

    statusCheckChange() {
      this.isCheckDisabled = false;
    },

    //保存
    campagin_add() {
      if (!this.edit_info.title) {
        this.$Message.error("请填写优惠券标题");
        return;
      }

      if (!this.edit_info.couponType) {
        this.$Message.error("请选择优惠类型");
        return;
      } else {
        if (this.edit_info.couponType == "1") {
          if (!this.edit_info.ticketMoney) {
            this.$Message.error("请填写金额");
            return;
          }
          if (!/^\d{1,10}(\.\d{1,2})?$/.test(this.edit_info.ticketMoney)) {
            this.$Message.error("金额最多为2位小数");
            return;
          } else {
            var new_ticketMoney = this.edit_info.ticketMoney * 100;
            this.edit_info.ticketMoney = new_ticketMoney.toFixed(2);
          }

          this.edit_info.ticketDiscount = "";
        }

        if (this.edit_info.couponType == "2") {
          if (!this.edit_info.ticketDiscount) {
            this.$Message.error("请填写折扣");
            return;
          } else if (this.edit_info.ticketDiscount > 10) {
            this.$Message.error("折扣不可大于10.00");
            return;
          } else if (
            !/^\d{1,10}(\.\d{1,1})?$/.test(this.edit_info.ticketDiscount)
          ) {
            this.$Message.error("折扣最多为1位小数");
            return;
          } else {
            var new_ticketDiscount = this.edit_info.ticketDiscount * 10;
            this.edit_info.ticketDiscount = new_ticketDiscount.toFixed(2);
          }

          this.edit_info.ticketMoney = "";
        }
      }
      if (!this.edit_info.couponKind) {
        this.$Message.error("请选择优惠券种类");
        return;
      } else if (this.edit_info.couponKind == 2) {
        if (!this.edit_info.price) {
          this.$Message.error("请填写购买价格");
          return;
        }
        if (!/^\d{1,10}(\.\d{1,2})?$/.test(this.edit_info.price)) {
          this.$Message.error("购买价格最多为2位小数");
          return;
        }
      }

      if (this.edit_info.startDate == "" || this.edit_info.endDate == "") {
        this.$Message.error("请选择活动开始时间和活动结束时间");
        return;
      }
      if (this.edit_info.startDate != "" || this.edit_info.endDate != "") {
        if (
          Date.parse(this.edit_info.startDate) >
          Date.parse(this.edit_info.endDate)
        ) {
          this.$Message.error("活动开始时间不能大于活动结束时间");
          return;
        }
      }

      this.edit_info.startDate = formatDate(
        new Date(this.edit_info.startDate),
        "yyyy-MM-dd hh:mm:ss"
      );

      this.edit_info.endDate = formatDate(
        new Date(this.edit_info.endDate),
        "yyyy-MM-dd"
      );
      var newendDate = this.edit_info.endDate;

      this.edit_info.endDate = newendDate + " 23:59:59";

      if (!this.edit_info.useDateType) {
        this.$Message.error("请选择用券有效期类型");
        return;
      }

      if (this.edit_info.useDateType == "1") {
        if (
          this.edit_info.useStartDate == "" ||
          this.edit_info.useEndDate == ""
        ) {
          this.$Message.error("请选择用券开始时间和用券结束时间");
          return;
        }
        if (
          this.edit_info.useStartDate != "" ||
          this.edit_info.useEndDate != ""
        ) {
          if (
            Date.parse(this.edit_info.useStartDate) >
            Date.parse(this.edit_info.useEndDate)
          ) {
            this.$Message.error("用券开始时间不能大于用券结束时间");
            return;
          }

          var dataComparedOne =
            Date.parse(this.edit_info.useStartDate) <
            Date.parse(this.edit_info.startDate);

          var dataComparedTwo =
            Date.parse(this.edit_info.useEndDate) <
            Date.parse(this.edit_info.endDate);

          if (dataComparedOne) {
            this.$Message.error("用券开始时间不能大于活动开始时间");
            return;
          }

          if (dataComparedTwo) {
            this.$Message.error("用券结束时间不能小于活动结束时间");
            return;
          }
        }

        this.edit_info.useStartDate = formatDate(
          new Date(this.edit_info.useStartDate),
          "yyyy-MM-dd hh:mm:ss"
        );

        this.edit_info.useEndDate = formatDate(
          new Date(this.edit_info.useEndDate),
          "yyyy-MM-dd"
        );
        var newUseEndDate = this.edit_info.useEndDate;

        this.edit_info.useEndDate = newUseEndDate + " 23:59:59";
      }

      if (this.edit_info.useDateType == "2") {
        this.edit_info.useStartDate = "";
        this.edit_info.useEndDate = "";

        if (
          this.edit_info.addDaysUseStart == "" &&
          this.edit_info.addDaysUseStart != 0
        ) {
          this.$Message.error("请填写加X天开始生效");
          return;
        }

        if (
          this.edit_info.addDaysUseEnd == "" &&
          this.edit_info.addDaysUseEnd != 0
        ) {
          this.$Message.error("请填写加Y天结束用券");
          return;
        }

        if (this.edit_info.addDaysUseStart > this.edit_info.addDaysUseEnd) {
          this.$Message.error("'加X天开始生效'不能大于'加Y天结束用券'");
          return;
        }

        if (
          this.edit_info.addDaysUseStart != 0 &&
          !/^[1-9]\d*$/.test(this.edit_info.addDaysUseStart)
        ) {
          this.$Message.error("加X天开始生效请输入正整数");
          return;
        }

        if (
          this.edit_info.addDaysUseEnd != 0 &&
          !/^[1-9]\d*$/.test(this.edit_info.addDaysUseEnd)
        ) {
          this.$Message.error("加Y天结束用券请输入正整数");
          return;
        }
      }

      if (!this.edit_info.couponSmallImg) {
        this.$Message.error("请上传优惠券缩略图");
        return;
      }
      if (!this.edit_info.couponBigImg) {
        this.$Message.error("请上传优惠券详情图");
        return;
      }

      if (!this.edit_info.useDesc) {
        this.$Message.error("请填写券使用说明");
        return;
      }

      if (!this.edit_info.getLimit) {
        this.$Message.error("请填写用户限领数量");
        return;
      }

      if (!/^[1-9]\d*$/.test(this.edit_info.getLimit)) {
        this.$Message.error("用户限领数量输入正整数");
        return;
      }

      if (!this.edit_info.stockCount) {
        this.$Message.error("请填写库存数量");
        return;
      }

      if (!/^[1-9]\d*$/.test(this.edit_info.stockCount)) {
        this.$Message.error("库存数量请输入正整数");
        return;
      }

      if (this.edit_info.getLimit > this.edit_info.stockCount) {
        this.$Message.error("'用户限领数量' 不能大于'库存数量'");
        return;
      }
      if (this.camp_pageStatus == "edit") {
        if (!this.edit_info.orderBy) {
          this.$Message.error("请填写顺序排序");
          return;
        }

        if (
          this.edit_info.orderBy != 0 &&
          !/^[1-9]\d*$/.test(this.edit_info.orderBy)
        ) {
          this.$Message.error("顺序排序请输入正整数");
          return;
        }
      }

      this.reqParams = {
        title: this.edit_info.title,
        // subTitle: this.edit_info.subTitle,
        couponType: this.edit_info.couponType,
        ticketMoney: this.edit_info.ticketMoney,
        ticketDiscount: this.edit_info.ticketDiscount,
        couponKind: this.edit_info.couponKind,
        price: this.edit_info.price,

        label: this.edit_info.label,
        startDate: this.edit_info.startDate,
        endDate: this.edit_info.endDate,
        useDateType: this.edit_info.useDateType,
        useStartDate: this.edit_info.useStartDate,
        useEndDate: this.edit_info.useEndDate,
        addDaysUseStart: this.edit_info.addDaysUseStart,
        addDaysUseEnd: this.edit_info.addDaysUseEnd,
        couponSmallImg: this.edit_info.couponSmallImg,
        couponBigImg: this.edit_info.couponBigImg,
        buyNotes: this.edit_info.buyNotes,
        useDesc: this.edit_info.useDesc,
        getLimit: this.edit_info.getLimit,
        stockCount: this.edit_info.stockCount,
        status: this.edit_info.status,
        remark: this.edit_info.remark,
        merchantId: this.couponEdit_info.merchantId,
        orderBy: this.edit_info.orderBy
      };
      if (this.camp_pageStatus === "add") {
        this.getUrl = "/merchantCouponTemplate/add";

        this.msg = "新增成功";
      } else {
        this.getUrl =
          "/merchantCouponTemplate/edit/" + this.edit_info.templateId;
        this.msg = "编辑成功";

        this.reqParams.templateId = this.edit_info.templateId;
      }

      this.edit_loading = true;
      console.log(JSON.stringify(this.reqParams));
      postRequest(this.getUrl, this.reqParams).then(res => {
        this.edit_loading = false;

        if (res.code == 200) {
          this.$Message.info(this.msg);

          setTimeout(() => {
            this.goback();
          }, 1200);
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    goback() {
      this.$emit("changeStatus", false);
    },

    cutDown1: function(res) {
      this.imgSrc1 = res.dataURL;

      var reqParams = {
        imgStr: res.dataURL.substr(22)
      };

      uploadFileRequest(
        "/operation/operation-info/uploadBase64Image2AliOss",
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.edit_info.couponSmallImg = res.image_url;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    cutDown2: function(res) {
      this.imgSrc2 = res.dataURL;

      var reqParams = {
        imgStr: res.dataURL.substr(22)
      };

      uploadFileRequest(
        "/operation/operation-info/uploadBase64Image2AliOss",
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.edit_info.couponBigImg = res.image_url;
        } else {
          this.$Message.error(res.msg);
        }
      });
    }
  },
  mounted() {
    this.init();
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

