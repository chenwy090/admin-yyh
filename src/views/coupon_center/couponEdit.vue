
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
              <Col span="3" class="left-text"><span style="color:red">*</span>适用商户</Col>
              <Col span="16">
                  <Button @click="addMerchantList">点击选择所需商户</Button>
              </Col>
          </Row>
          <Row class="box">
              <Table
                      border width="600px"
                      :columns="columnsSelectMerchant"
                      :data="add_info.merchantList"
              >

                  <template slot-scope="{ row }" slot="operate">
                      <Button
                              size="large"
                              style="color:#2db7f5"
                              @click="remove(row)"
                              icon="ios-trash-outline"
                      >移除</Button>
                  </template>
              </Table>
          </Row>

   <Row class="box">
        <Col span="3" class="left-text"><span style="color:red">*</span>标题</Col>
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
                <Option value="1">立减券</Option>
                <Option value="2">折扣券</Option>
                <Option value="3">满减券</Option>
                <Option value="4">体验券</Option>
                <Option value="5">换购券</Option>
                <Option value="6">赠品券</Option>
              </Select>
        </Col>
      </Row>

  <Row class="box" v-if="edit_info.couponType==1">
        <Col span="3" class="left-text"><span style="color:red">*</span>立减</Col>
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
          <Row class="box" v-if="edit_info.couponType==3">
              <Col span="3" class="left-text"><span style="color:red">*</span>满</Col>
              <Col span="16">
                  <Tooltip trigger="focus" title="提醒" content="最多为一位小数点" placement="right">
                      <InputNumber
                              :min="0"
                              type="text"
                              v-model="edit_info.fullAmout"
                              placeholder="请输入金额"
                              style="width:300px"
                              :max="999999.99"


                      ></InputNumber>
                      <span style="color:red">&nbsp;&nbsp; 元</span>
                  </Tooltip>
              </Col>
          </Row>
          <Row class="box" v-if="edit_info.couponType==3">
              <Col span="3" class="left-text"><span style="color:red">*</span>减</Col>
              <Col span="16">
                  <Tooltip trigger="focus" title="提醒" content="最多为一位小数点" placement="right">
                      <InputNumber
                              :min="0"
                              type="text"
                              v-model="edit_info.decreaseAmount"
                              placeholder="请输入金额"
                              style="width:300px"
                              :max="999999.99"


                      ></InputNumber>
                      <span style="color:red">&nbsp;&nbsp; 元</span>
                  </Tooltip>
              </Col>
          </Row>
          <Row class="box" v-if="edit_info.couponType==4">
              <Col span="3" class="left-text"><span style="color:red">*</span>面额描述</Col>
              <Col span="16">
                  <Tooltip trigger="focus" title="提醒" content="最多10个汉字" placement="right">
                      <Input
                              type="text"
                              v-model="edit_info.displayText"
                              clearable
                              placeholder="请输入描述"
                              style="width:300px"
                              :maxlength="10"
                      ></Input>
                      <span style="color:red">&nbsp;&nbsp; 体验券</span>
                  </Tooltip>
              </Col>
          </Row>
          <Row class="box" v-if="edit_info.couponType==5">
              <Col span="3" class="left-text"><span style="color:red">*</span>面额描述</Col>
              <Col span="16">
                  <Tooltip trigger="focus" title="提醒" content="最多10个汉字" placement="right">
                      <Input
                              type="text"
                              v-model="edit_info.displayText"
                              clearable
                              placeholder="请输入描述"
                              style="width:300px"
                              :maxlength="10"
                      ></Input>
                      <span style="color:red">&nbsp;&nbsp; 换购券</span>
                  </Tooltip>
              </Col>
          </Row>
          <Row class="box" v-if="edit_info.couponType==6">
              <Col span="3" class="left-text"><span style="color:red">*</span>面额描述</Col>
              <Col span="16">
                  <Tooltip trigger="focus" title="提醒" content="最多10个汉字" placement="right">
                      <Input
                              type="text"
                              v-model="edit_info.displayText"
                              clearable
                              placeholder="请输入描述"
                              style="width:300px"
                              :maxlength="10"
                      ></Input>
                      <span style="color:red">&nbsp;&nbsp; 赠品券</span>
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
                    <ImgCutter :label="'选择图片'"  :boxWidth="600"  :boxHeight="500" :rate="1" v-on:cutDown="cutDown1" >
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
                    <ImgCutter :label="'选择图片'"  :boxWidth="600"  :boxHeight="500" :rate="2" v-on:cutDown="cutDown2" >
                        <button slot="openImgCutter"  style="width:100px; background: border-box">上传图片</button>
                    </ImgCutter>
                  </div>
                  <br>
                  <div  class="left-text">选择优惠券缩略图 (不大于1M,JPG/PNG/JPEG/BMP）</div>
               </Col>

          </Row>
          <Row class="box"  >
              <Col span="3" class="left-text"><span style="color:red">*</span>库存数量</Col>
              <Col span="16">
                  <Tooltip trigger="focus" title="提醒" content="发放总量和数量不限制" placement="right">

                      <InputNumber
                              v-model="edit_info.stockCount"
                              placeholder="请输入库存数量(请输入正整数)"
                              style="width:300px"
                              :min="1"
                              :step="1"
                              :max ="999999999"
                      ></InputNumber>
                      <span style="color:red">&nbsp;&nbsp; 张</span>
                  </Tooltip>
              </Col>
          </Row>
       <Row class="box"  >
        <Col span="3" class="left-text"><span style="color:red">*</span>用户限领数量</Col>
        <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="发放总量和数量不限制" placement="right">

                     <InputNumber
                                v-model="edit_info.getLimit"
                                placeholder="请输入用户限领数量(请输入正整数)"
                               style="width:300px"
                                :min="1"
                                :step="1"
                            :max ="999999999"
                              ></InputNumber>

                               <span style="color:red">&nbsp;&nbsp; 张</span>
                                 </Tooltip>
        </Col>
      </Row>
          <Row class="box"  >
              <Col span="3" class="left-text"><span style="color:red">*</span>券使用说明</Col>
              <Col span="16">
                  <Tooltip trigger="focus" title="提醒" content="最多200个汉字" placement="right">
                      <Input
                              type="textarea"
                              v-model="edit_info.useDesc"
                              style="width:400px"
                              :autosize="{minRows: 4,maxRows: 8}"
                              @on-change="statusCheckChange"
                              :maxlength="200"

                      />
                  </Tooltip>
              </Col>
          </Row>
          <Row class="box" >
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

          <!--<Row class="box"  required v-if="camp_pageStatus =='edit' " >
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
      </Row>-->
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
          <Row style="border-top: 1px solid #666;margin-top: 20px" v-if="formShareModal.shareData.length">
              <Form ref="shareModal" :model="formShareModal" :label-width="100" style="margin-top:20px">
                  <FormItem v-for="item in formShareModal.shareData" :key="item.id" :label="item.name" required>
                      <InputNumber
                              :min="item.name=='倍数'?1:0"
                              :step="1"
                              type="text"
                              v-model="item.value"
                              placeholder="请输入"
                              style="width:320px"
                      ></InputNumber>
                      <span v-if="item.name!= '倍数'">&nbsp;&nbsp;U贝</span>
                      <span v-if="item.name== '倍数'">&nbsp;&nbsp;倍</span>
                  </FormItem>
                  <FormItem>
                      <!--<Button style="margin-left: 20px;float: right;" @click="shareDisplay = false">关闭</Button>-->
                      <Button type="primary" @click="shareSave('shareModal')">保存</Button>

                  </FormItem>
              </Form>
          </Row>
     </Row>
        </Card>
         <Modal
                 v-model="merchantTabDisplay"
                 title="商户列表"
                 width="800"
                 footer-hide
                 :closable="false"
                 :mask-closable="false"
         >
             <div>
                 <row>
                     <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
                         <FormItem label="商户编号">
                             <Input
                                     type="text"
                                     v-model="searchItem.merchantId"
                                     clearable
                                     placeholder="请输入商户编号"
                                     style="width: 150px"
                             />
                         </FormItem>
                         <FormItem label="商户名称">
                             <Input
                                     type="text"
                                     v-model="searchItem.name"
                                     clearable
                                     placeholder="请输入商户名称"
                                     style="width: 150px"
                             />
                         </FormItem>
                         <FormItem style="" label="所在地区">
                             <Select v-model="searchItem.provinceId" style="width:150px" clearable @on-change="getcitylist">
                                 <Option v-for="(item,index) in provincelist" :key="index" :value="item.provinceCode">{{item.provinceName}}</Option>
                             </Select>
                             <Select v-model="searchItem.cityId" style="width:150px" clearable @on-change="getarealist">
                                 <Option v-for="(item,index) in citylist" :key="index" :value="item.cityCode" >{{item.cityName}}</Option>
                             </Select>
                             <Select v-model="searchItem.areaId" style="width:150px" clearable >
                                 <Option v-for="(item,index) in arealist" :key="index" :value="item.areaCode" >{{item.areaName}}</Option>
                             </Select>
                         </FormItem>
                         <FormItem style="margin-left:-35px;" class="br">
                             <Button @click="getMerchantListFn" type="primary" icon="ios-search">搜索</Button>
                             <Button @click="refresh">重置</Button>
                         </FormItem>
                     </Form>
                 </row>

                 <!-- 商户列表 -->
                 <Table
                         ref="selection"
                         border width="100%"
                         :columns="columnsMerchant"
                         :data="merchantList"
                         @on-select="selectionCampagin"
                         @on-select-cancel="cancelCampagin"
                         @on-select-all="allCampagin"
                         @on-select-all-cancel="cancelAllCampagin"
                         :loading="TableLoading"
                 >
                 </Table>
                 <Row type="flex" justify="end" class="page">
                     <Page
                             :total="totalSize"
                             show-total
                             show-elevator
                             @on-change="changeCurrent"
                             style="float: right"
                             :current.sync="current"
                     ></Page>
                 </Row>
             </div>

             <Row style="margin-left:350px; margin-top: 30px">
                 <Button style="margin-right: 20px" @click="cancel">取消</Button>
                 <Button type="primary" @click="selectMerchant">确定</Button>
             </Row>

         </Modal>
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
    import {checkImage, uniqueArray} from "@/libs/date";

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
        formShareModal:{
            shareData:[]
        },
      imgSrc1: null,
      imgSrc2: null,
      receiveRuleSetPage: false,
      visible: false,
      imgName: "",
        merchantTabDisplay: false, // 商户选择框显示
        userInfoDisplay: false,     //用户选择显示框
        selectedMerchantList: [],//选中的商户列表
        searchItem: {
            merchantId: "",
            name: "",
            provinceId: "",
            cityId: "",
            areaId: ""
        },
        columnsMerchant: [
            {
                type: "selection",
                width: 60,
                align: "center"
            },
            {
                title: '商户编号',
                align: 'center',
                minWidth: 130,
                key: 'merchantId',
            },
            {
                title: '商户名称',
                align: 'center',
                width: 230,
                key: 'name',
            },
            {
                title: '地址',
                align: 'center',
                width: 340,
                key: 'address',
            }
        ],
        columnsSelectMerchant: [
            {
                title: '商户编号',
                align: 'center',
                width: 200,
                key: 'merchantId',
            },
            {
                title: '商户名称',
                align: 'center',
                width: 200,
                key: 'name',
            },
            {
                title: '地址',
                align: 'center',
                minWidth: 300,
                key: 'address',
            },
            {
                title: '操作',
                align: 'center',
                width: 140,
                key: "action",
                slot: "operate",
            }
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
        add_info: {
            employeeId: "",
            mobile: "",
            realName: "",
            wxAccount: "",
            wxQrcode: "",
            postDesc: "",
            profile: "",
            serviceContent: "",
            roleIdList: [],
            merchantList: [],
            memberId: "",
            openid: "",
        },
      edit_info: {
          orderBy:"",
          merchantList: [],
        startDate: "",
        endDate: "",
        useStartDate: "",
        useEndDate: "",
        addDaysUseStart: "",
        addDaysUseEnd: "",
          new_ticketMoney:0,
        ticketMoney: 0,
        price: 0,
        ticketDiscount: 0,
          new_ticketDiscount:0,
        getLimit: 0,
        stockCount: 0,
          fullAmout: 0,
          decreaseAmount:0,
          displayText:""

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
    this.init();
  },
  methods: {
      share(row){
          this.formShareModal.shareData = [];
          postRequest('/commonConfig/queryConfigByCode',{
                  code:row.templateId
              }
          ).then(res => {
              if (res.code == 200) {
                  if(res.data||res.data.noOverallCommonConfigList){
                      this.formShareModal.shareData = res.data.noOverallCommonConfigList||[];
                      this.formShareModal.shareData.forEach(function(v){
                          v.value = Number(v.value)||0;
                      })
                      this.shareDisplay = true;
                  }else{
                      this.msgErr('未查询到数据');
                  }
              } else {
                  this.msgErr(res.msg);
              }
          });
      },
      shareSave(name){
          let canSave = true;
          let msg = ''
          this.formShareModal.shareData.forEach(function(v){
              v.createTime = null;
              v.updateTime = null;
              v.updateBy = null;
              if(!v.value&&v.value!==0){
                  canSave = false
                  msg='请输入完整表单'
              }
              if(v.name=='倍数'&&v.value<1){
                  canSave = false
                  msg='请输入大于等于1的倍数'
              }
          })
          if(!canSave){
              this.msgErr('请输入完整表单');
              return;
          }
          postRequest(
              "/commonConfig/updateConfigBatch",
              {"noOverallCommonConfigList":this.formShareModal.shareData}
          ).then(res => {
              if (res.code == 200) {
                  //this.formCustom.remark='';
                 this.msgOk('保存成功')
              } else {
                  this.msgErr(res.msg);
              }
          });
      },
    init() {
      this.camp_pageStatus = this.getStore("camp_pageStatus");

      this.getprovincelist();
      this.getMerchantInfo();
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
        getLimit: 0,
        stockCount: 0,
          fullAmout:0,
          decreaseAmount:0,
          displayText:""

      };
    },

    //编辑
    editInfo() {
      this.edit_info = this.couponEdit_info;
      this.share(this.edit_info);
      this.uploadList = [{ url: this.couponEdit_info.couponSmallImg }];
      this.uploadList1 = [{ url: this.couponEdit_info.couponBigImg }];
      this.edit_info.merchantList=this.couponEdit_info.merchantList;

      this.imgSrc1 = this.couponEdit_info.couponSmallImg;
      this.imgSrc2 = this.couponEdit_info.couponBigImg;

      if (this.edit_info.couponKind == 2) {
        this.edit_info.price = this.couponEdit_info.price / 100;
      } else {
        this.edit_info.price = 0;
      }

      this.edit_info.ticketMoney = this.couponEdit_info.ticketMoney / 100;
      //console.info("this.couponEdit_info.ticketMoney" + this.couponEdit_info.ticketMoney);
      //console.info("this.edit_info.ticketMoney" + this.edit_info.ticketMoney);

      this.edit_info.ticketDiscount = this.couponEdit_info.ticketDiscount / 10;

      this.edit_info.couponType =
        this.couponEdit_info.couponType == 1 ? "1" :
            this.couponEdit_info.couponType == 2 ? "2" :
                this.couponEdit_info.couponType == 3 ? "3" :
                    this.couponEdit_info.couponType == 4 ? "4" :
                        this.couponEdit_info.couponType == 5 ? "5" :"6";
      this.edit_info.couponKind =
        this.couponEdit_info.couponKind == 1 ? "1" : "2";
      this.edit_info.useDateType =
        this.couponEdit_info.useDateType == 1 ? "1" : "2";
    },

    statusCheckChange() {
      this.isCheckDisabled = false;
    },
      //重置商户搜索条件
      refresh() {
          // this.updateTableList(this.params);
          this.searchItem.merchantId="";
          this.searchItem.name = "";
          this.searchItem.provinceId = "";
          this.searchItem.cityId = "";
          this.searchItem.areaId = "";
          this.getMerchantListFn();
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
      },
      //分页
      changeCurrent(current) {
          this.pageNum = current;
          this.getMerchantListFn();
      },
      getMerchantInfo(){
          var that= this;
          if(this.camp_pageStatus == 'add'){
              this.couponEdit_info.templateId = '';
          }
          if (this.camp_pageStatus == 'edit' && this.couponEdit_info.templateId){
              postRequest("/merchant/merchantCouponRelation/selectByTemplateId?templateId=" + this.couponEdit_info.templateId).then(res => {
                  if (res.code == 200) {
                      that.add_info = res.data;
                      let obj = {
                          url: res.data.wxQrcode
                      };
                      // that.bsUploadList.push(obj);
                      var roleIdList = [];
                      /*if (res.data.roleIdList){
                          for (var o of res.data.roleIdList){
                              roleIdList.push(parseInt(o))
                          }
                      }
                      this.add_info.roleIdList = roleIdList;*/
                      that.add_info.templateId = that.templateId;
                  } else {
                      this.$Message.error(res.msg);
                  }
              });
          }
      },
      //获取省份信息数据
      getprovincelist() {
          postRequest(
              "/system/area/province/list"
          ).then(res => {
              if (res.code == 200) {
                  this.provincelist = res.data;
              } else {
                  this.$Message.error(res.msg);
              }
          });
      },
      //根据省份code获取城市信息数据
      getcitylist() {
          getRequest(
              "/system/area/city/"+this.searchItem.provinceId
          ).then(res => {
              if (res.code == 200) {
                  this.citylist = res.data;
                  this.searchItem.areaId = '';
              } else {
                  this.$Message.error(res.msg);
              }
          });
      },
      //根据城市code获取区县信息数据
      getarealist() {
          getRequest(
              "/system/area/district/"+this.searchItem.cityId
          ).then(res => {
              if (res.code == 200) {
                  this.arealist = res.data;
              } else {
                  this.$Message.error(res.msg);
              }
          });
      },
      // 取消选中
      cancelCampagin(selection, row) {
          for (let i = 0; i < this.selectedMerchantList.length; i++ ) {
              if ( row.merchantId == this.selectedMerchantList[i].merchantId ) {
                  this.selectedMerchantList.splice(i, 1);
              }
          }
      },

      // 选中
      selectionCampagin(selection, row) {
          this.selectedMerchantList.push(row);
      },

      //全选
      allCampagin(selection) {
          for (let i = 0; i < selection.length; i++) {
              this.selectedMerchantList.push(selection[i]);
          }
      },

      // 取消全选
      cancelAllCampagin(selection) {
          //去重
          var afterArr = uniqueArray(
              this.selectedMerchantList,
              "merchantId"
          );
          this.selectedMerchantList = afterArr;
          for (let i = 0; i < this.selectedMerchantList.length; i++ ) {
              for (let j = 0; j < this.merchantList.length; j++ ) {
                  if ( selection[j].merchantId == this.selectedMerchantList[i].merchantId ) {
                      this.selectedMerchantList.splice(i, 1);
                  }
              }
          }
      },
      // 关闭商户选择框
      cancel() {
          this.merchantTabDisplay = false;
          this.userInfoDisplay = false;
      },
      //弹出商户选择框
      addMerchantList(){
          this.merchantTabDisplay = true;
          this.selectedMerchantList = [],
              this.getMerchantListFn();
      },
      // 获取商户列表
      getMerchantListFn() {
          this.TableLoading = false;
          const reqParams = {
              merchantId: this.searchItem.merchantId,
              name: this.searchItem.name,
              provinceCode: this.searchItem.provinceId,
              cityCode: this.searchItem.cityId,
              areaCode: this.searchItem.areaId
          };
          postRequest('/merchant/merchantInfo/list?isAsc=DESC&orderByColumn=1&pageNum='+ this.pageNum +'&pageSize=10', reqParams).then(res =>{
              if(res.code == 200) {
                  this.totalSize = res.data.total;
                  this.merchantList = res.data.records
              }else {
                  this.msgErr(res.msg)
              }
              this.TableLoading = false;
          });
      },
      //确定选择商户
      selectMerchant(){
          if (this.selectedMerchantList && this.selectedMerchantList.length > 0){
              for(var obj of this.selectedMerchantList){
                  this.add_info.merchantList.push(obj);
              }
              var afterArr = uniqueArray(
                  this.add_info.merchantList,
                  "merchantId"
              );
              this.add_info.merchantList = afterArr;
              this.merchantTabDisplay = false;
          }else {
              this.msgErr("至少选一个商户");
          }
      },

      remove(row){
          this.removeAlert = true;
          for (let i = 0; i < this.add_info.merchantList.length; i++ ) {
              if ( row.merchantId == this.add_info.merchantList[i].merchantId ) {
                  this.add_info.merchantList.splice(i, 1);
              }
          }
      },


    //保存
    campagin_add() {
        this.edit_info.couponKind = 1;
        if(!this.add_info.merchantList || this.add_info.merchantList.length == 0){
            this.$Message.error("请填写适用商户");
            return;
        }
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
            var new_ticketMoney_temp = this.edit_info.ticketMoney * 100;
            this.new_ticketMoney = new_ticketMoney_temp.toFixed(2);
            this.edit_info.displayText = this.edit_info.ticketMoney + "元";

            //this.edit_info.ticketMoney = new_ticketMoney.toFixed(2);
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
            var new_ticketDiscount_temp = this.edit_info.ticketDiscount * 10;
            this.new_ticketDiscount = new_ticketDiscount_temp;
              this.edit_info.displayText = this.edit_info.ticketDiscount + "折"
            //this.edit_info.ticketDiscount = new_ticketDiscount.toFixed(2);
          }

          this.edit_info.ticketMoney = "";
        }
          if (this.edit_info.couponType == "3") {
              if (!this.edit_info.fullAmout) {
                  this.$Message.error("请填写满减金额");
                  return;
              }
              if (!this.edit_info.decreaseAmount) {
                  this.$Message.error("请填写满减金额");
                  return;
              }
              this.edit_info.displayText = "满" + this.edit_info.fullAmout + "减" + this.edit_info.decreaseAmount;
          }

          if (this.edit_info.couponType == "4" ||
              this.edit_info.couponType == "5" ||
              this.edit_info.couponType == "6") {
              if (!this.edit_info.displayText) {
                  this.$Message.error("请输入面额");
                  return;
              }
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

        var nowDate1 = formatDate(
            new Date(),
            "yyyy-MM-dd"
        );
        var nowDate = nowDate1 + " 00:00:00";

        var dataComparedThree =
            this.edit_info.startDate < nowDate;

        if(dataComparedThree){
            this.$Message.error("活动开始时间不能小于当前时间");
            return;
        }

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

          var dataComparedOne =
            Date.parse(this.edit_info.useStartDate) <
            Date.parse(this.edit_info.startDate);

          var dataComparedTwo =
            Date.parse(this.edit_info.useEndDate) <
            Date.parse(this.edit_info.endDate);

          if (dataComparedOne) {
            this.$Message.error("用券开始时间不能小于活动开始时间");
            return;
          }

          if (dataComparedTwo) {
            this.$Message.error("用券结束时间不能小于活动结束时间");
            return;
          }
        }
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

      /*if(this.camp_pageStatus == "edit"){
          this.new_ticketMoney = this.edit_info.ticketMoney;
          this.new_ticketDiscount = this.edit_info.ticketDiscount;
      }*/
      this.reqParams = {
        title: this.edit_info.title,
        // subTitle: this.edit_info.subTitle,
        couponType: this.edit_info.couponType,
        ticketMoney: this.new_ticketMoney,
        ticketDiscount: this.new_ticketDiscount,
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
        orderBy: this.edit_info.orderBy,
          fullAmout: this.edit_info.fullAmout,
          decreaseAmount: this.edit_info.decreaseAmount,
          displayText: this.edit_info.displayText,
          merchantList: this.add_info.merchantList
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
        this.showSize1();
        if (this.imgSrc1Size > 1024) {
            this.$Message.error("图片不能大于1M");
            return;
        }

      var reqParams = {
        imgStr: res.dataURL.substr(22)
      };

        postRequest(
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
      showSize1() {
          //获取base64图片大小，返回MB数字
          var base64url = this.imgSrc1;
          var str = base64url.replace("data:image/png;base64,", "");
          var equalIndex = str.indexOf("=");
          if (str.indexOf("=") > 0) {
              str = str.substring(0, equalIndex);
          }
          var strLength = str.length;
          var fileLength = parseInt(strLength - strLength / 8 * 2);
          // 由字节转换为MB
          var size = "";
          size = (fileLength / 1024).toFixed(2);
          var sizeStr = size + ""; //转成字符串
          var index = sizeStr.indexOf("."); //获取小数点处的索引
          var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
          if (dou == "00") {
              //判断后两位是否为00，如果是则删除00
              this.imgSrc1Size =
                  sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
          }
          this.imgSrc1Size = size;
      },
      showSize2() {
          //获取base64图片大小，返回MB数字
          var base64url = this.imgSrc2;
          var str = base64url.replace("data:image/png;base64,", "");
          var equalIndex = str.indexOf("=");
          if (str.indexOf("=") > 0) {
              str = str.substring(0, equalIndex);
          }
          var strLength = str.length;
          var fileLength = parseInt(strLength - strLength / 8 * 2);
          // 由字节转换为MB
          var size = "";
          size = (fileLength / 1024).toFixed(2);
          var sizeStr = size + ""; //转成字符串
          var index = sizeStr.indexOf("."); //获取小数点处的索引
          var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
          if (dou == "00") {
              //判断后两位是否为00，如果是则删除00
              this.imgSrc2Size =
                  sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
          }
          this.imgSrc2Size = size;
      },

    cutDown2: function(res) {
      this.imgSrc2 = res.dataURL;
        this.showSize2();
        if (this.imgSrc2Size > 1024) {
            this.$Message.error("图片不能大于1M");
            return;
        }

      var reqParams = {
        imgStr: res.dataURL.substr(22)
      };

        postRequest(
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

