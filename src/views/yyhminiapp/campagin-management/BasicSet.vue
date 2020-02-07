<template>
  <!-- 编辑/新增 领优惠---基础设置 -->
  <div>
    <div v-if="!receiveRuleSetPage">
      <div
        style="width: 100%;background: #fff;box-shadow:0 6px 6px -4px rgba(0,0,0,.2);z-index: 1;position:fixed; padding:14px"
      >
        <Steps :current="0">
          <Step title="基础设置" content="进行中"></Step>
          <Step title="规则设置" content="待进行"></Step>
        </Steps>
      </div>

      <div style="padding-top: 80px">
        <Card>
          <p slot="title">领优惠---基础设置</p>

          <a href="#" slot="extra">
            <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回列表</Button>
          </a>

          <Alert show-icon v-if="campId">
            活动ID :
            <span style="color:red">{{ campId }}</span>
            <span slot="desc"></span>
          </Alert>

          <Form :model="edit_info" ref="edit_info" :label-width="180">
            <FormItem label="appid" required>
              <Select
                v-model="edit_info.appid"
                style="width:300px"
                placeholder="请输入选择appid"
                @on-change="statusCheckChange"
              >
                <Option v-for="item in appId_info" :value="item.appid" :key="item.appid">{{ item.appName }}</Option>
              </Select>
            </FormItem>

            <FormItem label="活动类型" required>
              <Select v-model="edit_info.campType" style="width:300px" disabled>
                <Option value="57">领优惠</Option>
                <Option value="62">要优惠</Option>
                <Option value="63">领优惠分享奖励</Option>
                <Option value="64">要优惠参与奖励（接受分享/参团）</Option>
              </Select>
            </FormItem>

            <FormItem label="优惠券类型" required>
              <Select
                v-model="edit_info.couponType"
                style="width:300px"
                placeholder="请输入选择优惠券类型"
                @on-change="statusCheckChange"
              >
                <Option value="1">换购券</Option>
                <Option value="2">商品券</Option>
                <Option value="3">折扣券</Option>
                <Option value="4">全场券</Option>
                <!-- <Option value="5">赠品券</Option> -->
              </Select>
            </FormItem>

            <FormItem label="优惠券类型" required>
              <ChargeTypeItem
                @change="
                  statusCheckChange();
                  chargeTypeChange($event);
                "
                :chargeData="edit_info"
              ></ChargeTypeItem>
            </FormItem>

            <FormItem label="活动标题" required>
              <Input
                type="text"
                v-model="edit_info.name"
                style="width:300px"
                placeholder="请输入活动标题"
                @on-change="statusCheckChange"
              />
            </FormItem>

            <FormItem label="优惠面额描述" required v-if="edit_info.campType == 57">
              <Input
                type="textarea"
                v-model="edit_info.couponValueDesc"
                style="width:400px"
                @on-change="statusCheckChange"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入优惠面额描述"
              />
            </FormItem>

            <FormItem label="使用门槛描述" required>
              <Input
                type="textarea"
                v-model="edit_info.doorsillDesc"
                style="width:400px"
                @on-change="statusCheckChange"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请填写使用门槛描述"
              />
            </FormItem>

            <FormItem label="活动时间类型" required>
              <Select
                v-model="edit_info.dateType"
                style="width:300px"
                placeholder="请选择活动时间类型"
                @on-change="statusCheckChange"
                disabled
              >
                <Option value="1">固定日期时间范围有效</Option>
              </Select>
            </FormItem>

            <div v-if="edit_info.dateType == '1'">
              <FormItem label="活动开始时间" required>
                <DatePicker
                  type="date"
                  @on-change="statusCheckChange"
                  v-model="edit_info.startDate"
                  placeholder="选择活动开始时间"
                  style="width: 300px"
                ></DatePicker>
              </FormItem>

              <FormItem label="活动结束时间" required>
                <DatePicker
                  type="date"
                  @on-change="statusCheckChange"
                  placeholder="选择活动结束时间"
                  style="width:300px"
                  v-model="edit_info.endDate"
                ></DatePicker>
              </FormItem>
            </div>

            <FormItem label="优惠券缩略图" required>
              <div
                style=" float: left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                v-for="(item, index) in uploadList1"
                :key="index"
              >
                <img :src="item.url" style="width:100%" />
              </div>
              <div style="display: inline-block;">
                <Upload
                  ref="upload"
                  :defaultList="uploadList1"
                  type="drag"
                  :format="['jpg', 'jpeg', 'png', 'bmp']"
                  :on-success="handleSuccess1"
                  :action="url"
                  accept="image"
                  :max-size="1024"
                  :headers="userToken"
                  style="display: inline-block;width:90px;"
                  @on-change="statusCheckChange"
                  :on-exceeded-size="handleMaxSize"
                  :show-upload-list="false"
                >
                  <div style="width: 90px;height:90px;line-height: 90px;">
                    <Icon type="ios-camera" size="20" />
                  </div>
                </Upload>
                <p>选择优惠券缩略图 (不大于1M, JPG/PNG/JPEG/BMP）</p>
              </div>
            </FormItem>

            <FormItem label="优惠券详情图" required>
              <div
                style=" float: left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                v-for="(item, index) in uploadList"
                :key="index"
              >
                <img :src="item.url" style="width:100%" />
              </div>
              <div style="display: inline-block;">
                <Upload
                  ref="upload"
                  :defaultList="uploadList"
                  type="drag"
                  :format="['jpg', 'jpeg', 'png', 'bmp']"
                  :on-success="handleSuccess"
                  :action="url"
                  accept="image"
                  :max-size="1024"
                  :headers="userToken"
                  style="display: inline-block;width:90px;"
                  @on-change="statusCheckChange"
                  :on-exceeded-size="handleMaxSize"
                  :show-upload-list="false"
                >
                  <div style="width: 90px;height:90px;line-height: 90px;">
                    <Icon type="ios-camera" size="20" />
                  </div>
                </Upload>
                <p>选择优惠券详情图 (不大于1M, JPG/PNG/JPEG/BMP）</p>
              </div>
            </FormItem>
            <FormItem label="首页缩略图">
              <div
                style=" float: left;width: 90px;height: 90px;line-height: 90px; margin-right: 10px;border: 1px dashed #dcdee2;background: #fff;"
                v-for="(item, index) in uploadList2"
                :key="index"
              >
                <img :src="item.url" style="width:100%" />
              </div>
              <div style="display: inline-block;">
                <Upload
                  ref="upload"
                  :defaultList="uploadList2"
                  type="drag"
                  :format="['jpg', 'jpeg', 'png', 'bmp']"
                  :on-success="handleSucces2"
                  :action="url"
                  accept="image"
                  :max-size="1024"
                  :headers="userToken"
                  style="display: inline-block;width:90px;"
                  @on-change="statusCheckChange"
                  :on-exceeded-size="handleMaxSize"
                  :show-upload-list="false"
                >
                  <div style="width: 90px;height:90px;line-height: 90px;">
                    <Icon type="ios-camera" size="20" />
                  </div>
                </Upload>
                <p>选择首页缩略图 (不大于1M, JPG/PNG/JPEG/BMP）</p>
              </div>
            </FormItem>
            <!-- <FormItem label="兑换时间类型" required>
              <Select
                v-model="edit_info.ChangeDateType"
                style="width:300px"
                placeholder="请选择兑换时间类型"
                @on-change="statusCheckChange"

              >
                <Option value='0'>固定日期时间范围有效</Option>
                   <Option value='1'>发券后+X天后开始兑换</Option>
              </Select>
         </FormItem>

            <div v-if="edit_info.ChangeDateType =='0'">
              <FormItem label="兑换开始日期" required>
                <DatePicker
                  type="date"
                  @on-change="statusCheckChange"
                  v-model="edit_info.ChangeStartDate"
                  placeholder="选择兑换开始日期"
                  style="width: 300px"
                ></DatePicker>
              </FormItem>

              <FormItem label="兑换结束日期" required>
                <DatePicker
                  type="date"
                  @on-change="statusCheckChange"
                  placeholder="选择兑换结束日"
                  style="width:300px"
                  v-model="edit_info.ChangeEndDate"
                ></DatePicker>
              </FormItem>
            </div>


         <div v-if="edit_info.ChangeDateType =='1'">

              <FormItem label="发券后+X天开始兑换" required>
                      <Input
                          type="text"
                          v-model="edit_info.ChangeStart"
                          style="width:300px"
                          placeholder="请输入发券后+X天开始兑换"
                          @on-change="statusCheckChange"
                        />

                </FormItem>

                <FormItem label="发券后+X天结束兑换" required>
                          <Input
                              type="text"
                              v-model="edit_info.ChangeEnd"
                              style="width:300px"
                              placeholder="请输入发券后+X天结束兑换"
                              @on-change="statusCheckChange"
                            />

                </FormItem>

            </div>-->

            <FormItem label="优惠券模板" required>
              <Button type="dashed" @click="resInfo" :style="{ width: '150px' }" @on-change="statusCheckChange"
                >选择模版</Button
              >

              <Tag checkable color="error" v-if="edit_info.ticketTemplateId" style="margin-left: 3%">已选择</Tag>
            </FormItem>

            <FormItem v-if="edit_info.ticketName">
              <Alert style="width:500px">
                <Row>模版ID：{{ edit_info.ticketTemplateId }}</Row>
                <Row>模版名称：{{ edit_info.ticketName }}</Row>
              </Alert>
            </FormItem>

            <!-- :rules="{ required: true, validator: validateRewardRules }" -->
            <!-- <FormItem label="品类" prop="categoryList">
              <Button
                type="dashed"
                size="small"
                @click="handleAdd"
                icon="md-add"
                style="width:100px;"
              ></Button>
            </FormItem>
            <FormItem>
              <Category
                v-for="(item, index) in edit_info.categoryList"
                :key="index"
                :data="item"
                :index="index"
                @del="del"
              ></Category>
            </FormItem>

            <FormItem label="品牌">
              <Row>
                <Col span="10">
                  <Button type="success" size="small" @click="handleChoose">点击按钮选择品牌</Button>
                  <div style="width:300px;">
                    <Tag v-for="(item, index) in edit_info.brandNames" :key="index">{{item}}</Tag>
                  </div>
                </Col>
              </Row>
            </FormItem>-->

            <FormItem label="活动/领券规则" required>
              <Input
                type="textarea"
                v-model="edit_info.rules"
                style="width:400px"
                @on-change="statusCheckChange"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请填写活动/领券规则"
              />
            </FormItem>

            <FormItem label="券使用说明" required>
              <Input
                type="textarea"
                v-model="edit_info.useDesc"
                style="width:400px"
                :autosize="{ minRows: 4, maxRows: 8 }"
                @on-change="statusCheckChange"
              />
            </FormItem>

            <!-- <FormItem label="优惠券详情" required>{{edit_info.newDiscountDetail}}</FormItem> -->
            <FormItem label="优惠券详情" required>
              <EditorBar
                v-model="edit_info.discountDetail"
                :content="edit_info.discountDetail"
                @on-change="change"
                @on-blur="blur"
                style="width:500px;margin:0;"
              ></EditorBar>
            </FormItem>

            <FormItem label="状态" required placeholder="请选择状态">
              <Select v-model="edit_info.status" style="width:300px" @on-change="statusCheckChange" disabled>
                <Option value="0">创建</Option>
                <Option value="1">上架</Option>
                <Option value="-1">下架</Option>
              </Select>
            </FormItem>

            <FormItem style="{'margin-top':'54px'}">
              <Alert type="warning" show-icon v-if="isCheckDisabled == true" style="width:500px">修改后才能保存</Alert>
              <Button
                type="primary"
                @click="campagin_add()"
                :loading="edit_loading"
                style="width:150px;"
                :disabled="isCheckDisabled"
                >保存</Button
              >
              <Button
                type="dashed"
                @click="nextInfo()"
                style="width:150px;margin-left: 5%"
                v-if="camp_pageStatus == 'edit' && isCheckDisabled == true"
                >下一步</Button
              >
            </FormItem>
          </Form>
        </Card>
      </div>
    </div>

    <Modal v-model="res_Modal_show" width="800" title="选择模版">
      <Form :model="res_info" ref="res_info" :label-width="100" :styles="{ top: '10px' }">
        <Table border ref="selection" :columns="res_columns" :data="res_list" size="small" height="300">
          <template slot-scope="{ row }" slot="ChangeStart">
            <span v-if="row.changeDateType == 0">{{ row.changeStartDate }}</span>
            <span v-if="row.changeDateType == 1">发券后+{{ row.changeStart }}天开始兑换</span>
          </template>

          <template slot-scope="{ row }" slot="ChangeEnd">
            <span v-if="row.changeDateType == 0">{{ row.changeEndDate }}</span>
            <span v-if="row.changeDateType == 1">发券后+{{ row.changeEnd }}天结束兑换</span>
          </template>
        </Table>
      </Form>

      <div slot="footer">
        <Button type="text" @click="res_Modal_show = false">取消</Button>
        <Button type="primary" @click="resOk" :loading="res_loading">保存</Button>
      </div>
    </Modal>

    <div v-if="receiveRuleSetPage">
      <receiveRuleSet :camp_pageStatus="camp_pageStatus" @changeStatus="showReceiveRuleSetStatus"></receiveRuleSet>
    </div>

    <BrandList
      v-if="showBrandList"
      :showBrandList.sync="showBrandList"
      @seclectedTr-event="selectedBrandItem"
      :checked="edit_info.brandIds"
    ></BrandList>
  </div>
</template>

<script>
import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest } from "@/libs/axios";

import { baseUrl, uploadOperationImage2AliOssURl } from "@/api/index";

import { formatDate, checkImageWH } from "@/libs/date";

import receiveRuleSet from "./receiveRuleManagement";

import EditorBar from "@/components/EditorBar";

import ChargeTypeItem from "./comp/ChargeTypeItem";

// 品类
import Category from "./Category";

// 品牌列表
import BrandList from "./BrandList";

export default {
  name: "BasicSet",
  components: {
    receiveRuleSet,
    EditorBar,
    BrandList,
    Category,
    ChargeTypeItem,
  },
  props: {
    campId: [String, Number],
  },
  data() {
    return {
      receiveRuleSetPage: false,
      showBrandList: false,
      list1: [],
      list2: [],
      list3: [],
      camp_Info: {},
      edit_info: {
        firstClassCode: "",
        secondClassCode: "",
        threeClassCode: "",
        categoryList: [],
        appid: "",
        campType: "57",
        couponType: "",
        couponValueDesc: "",
        dateType: "1",
        doorsillDesc: "",
        endDate: "",
        imgUrl: "",
        name: "",
        rules: "",
        startDate: "",
        status: "",
        ticketTemplateId: "",
        useDesc: "",
        couponImg: "",
        couponSimpleImg: "",
        ChangeDateType: "",
        ChangeStartDate: "",
        ChangeEndDate: "",
        ChangeStart: "",
        ChangeEnd: "",
        discountDetail: "", //优惠券详情（富文本）
        newDiscountDetail: "", //中转数据
        brandNames: [],
        brandIds: [],
        brandCodes: [],

        couponKind: 1,
        originalPrice: 0,
        price: 0,
        enableAfterSale: 0,
        settleAmount: 0,
      },
      edit_loading: false,
      userToken: "",
      // campId: "",
      imgUrl: "",
      url: uploadOperationImage2AliOssURl,
      uploadList: [],
      uploadList1: [],
      uploadList2: [],
      camp_pageStatus: "",
      getUrl: "",
      msg: "",
      appId_info: [],
      codeList: [],

      res_Modal_show: false,
      res_loading: false,
      res_list: [],
      res_info: {},

      chooseResArray: [],
      isCheckDisabled: true,
      currentChooseID: "",
      currentChooseName: "",
      res_columns: [
        {
          title: "选择",
          key: "ticketTemplateID",
          width: 70,
          align: "center",
          render: (h, params) => {
            let ticketTemplateID = params.row.ticketTemplateID;
            let ticketName = params.row.ticketName;

            let flag = false;
            if (this.currentChooseID === ticketTemplateID) {
              flag = true;
            } else {
              flag = false;
            }
            let self = this;
            return h("div", [
              h("Radio", {
                props: {
                  value: flag,
                },
                on: {
                  "on-change": () => {
                    self.currentChooseID = ticketTemplateID;
                    self.currentChooseName = ticketName;

                    self.chooseResArray = params.row;
                  },
                },
              }),
            ]);
          },
        },
        {
          title: "sheetID",
          key: "sheetID",
          width: 200,
          align: "center",
        },
        {
          title: "模版ID",
          key: "ticketTemplateID",
          width: 200,
          align: "center",
        },
        {
          title: "模版名称",
          key: "ticketName",
          width: 200,
          align: "center",
        },
        {
          title: "ticketKind",
          key: "ticketKind",
          width: 200,
          align: "center",
        },
        {
          title: "兑换类型",
          key: "ChangeDateType",
          width: 200,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color = row.changeDateType === 0 ? "red" : "blue";
            const text = row.changeDateType === 0 ? "固定时间兑换" : "发券后+X天后开始兑换";

            return h(
              "Tag",
              {
                props: {
                  color: color,
                },
              },
              text
            );
          },
        },

        {
          title: "兑换开始时间",
          key: "ChangeStart",
          width: 200,
          align: "center",
          slot: "ChangeStart",
        },

        {
          title: "兑换结束时间",
          key: "ChangeEnd",
          width: 200,
          align: "center",
          slot: "ChangeEnd",
        },
      ],
    };
  },

  created() {
    this.userToken = { jwttoken: localStorage.getItem("jwttoken") };
    // console.log("camp_Info", this.camp_Info);
  },
  // beforeDestroy() {
  //   alert("beforeDestroy");
  // },
  methods: {
    handleAdd() {
      //修改后才能保存
      this.isCheckDisabled = false;

      this.edit_info.categoryList.push({
        _id: Math.random(),
        id: "",
        firstClassCode: "",
        secondClassCode: "",
        threeClassCode: "",
      });
    },
    del(index) {
      console.log("del categoryList:", index);
      this.edit_info.categoryList.splice(index, 1);
      this.isCheckDisabled = false;
    },
    handleChoose() {
      this.showBrandList = true;
    },
    selectedBrandItem(data) {
      //修改后才能保存
      this.isCheckDisabled = false;

      console.log("selectedBrandItem----", data);
      // let { id, brandCode, brandName } = data;
      // templateId 券模板id templateName 券模板名称
      let brandNames = [];
      let brandIds = [];
      let brandCodes = [];
      data.forEach(item => {
        brandNames.push(item.brandName);
        brandIds.push(item.id);
        brandCodes.push(item.brandCode);
      });
      this.edit_info.brandNames = brandNames;
      this.edit_info.brandIds = brandIds;
      this.edit_info.brandCodes = brandCodes;
    },
    init() {
      this.camp_pageStatus = this.getStore("camp_pageStatus");
      // console.log(this.camp_pageStatus);
      this.getAppId();
      this.getCampInfo();
    },
    getCampInfo() {
      if (this.camp_pageStatus == "add") {
        this.addInfo();
      } else if (this.camp_pageStatus == "edit") {
        this.queryXX();
      }
    },
    //新增
    addInfo() {
      this.edit_info = {
        appid: "",
        campType: "57",
        couponType: "2",
        couponValueDesc: "",
        doorsillDesc: "",
        imgUrl: "",
        name: "",
        rules: "",
        status: "0",
        ticketTemplateId: "",
        dateType: "1",
        endDate: "",
        startDate: "",
        useDesc: "",
        couponImg: "",
        couponSimpleImg: "",
        ChangeDateType: "",
        ChangeStartDate: "",
        ChangeEndDate: "",
        ChangeStart: "",
        ChangeEnd: "",
        categoryList: [],
        discountDetail: "",
        newDiscountDetail: "",

        couponKind: 1,
        originalPrice: 0,
        price: 0,
        enableAfterSale: 0,
        settleAmount: 0,
      };
      this.currentChooseID = "";
      this.currentChooseName = "";
      this.chooseResArray = "";
      this.isCheckDisabled = true;
      this.uploadList = [];
      this.uploadList1 = [];
      this.uploadList2 = [];
    },

    //编辑
    editInfo() {
      this.edit_info = {
        ...this.edit_info,
        ...this.camp_Info,
      };
      this.edit_info.categoryList = [];
      this.uploadList = [{ url: this.camp_Info.imgUrl }];
      this.uploadList1 = [{ url: this.camp_Info.couponImg }];
      this.uploadList2 = [{ url: this.camp_Info.couponSimpleImg }];
      this.edit_info.appid = this.camp_Info.appid;

      this.edit_info.name = this.camp_Info.name;
      this.edit_info.rules = this.camp_Info.rules.replace(/\\n/g, "\n");
      this.edit_info.couponValueDesc = this.camp_Info.couponValueDesc.replace(/\\n/g, "\n");
      this.edit_info.doorsillDesc = this.camp_Info.doorsillDesc.replace(/\\n/g, "\n");

      this.edit_info.imgUrl = this.camp_Info.imgUrl;
      this.edit_info.couponImg = this.camp_Info.couponImg;

      this.edit_info.campType = "57";

      this.edit_info.couponType =
        this.camp_Info.couponType == 1
          ? "1"
          : this.camp_Info.couponType == 2
          ? "2"
          : this.camp_Info.couponType == 3
          ? "3"
          : this.camp_Info.couponType == 4
          ? "4"
          : "5";

      this.edit_info.status = this.camp_Info.status == 0 ? "0" : this.camp_Info.status == 1 ? "1" : "-1";

      this.edit_info.ticketTemplateId = this.camp_Info.ticketTemplateId;

      this.currentChooseID = this.edit_info.ticketTemplateId;

      this.currentChooseName = this.edit_info.ticketName;

      this.chooseResArray = this.edit_info.ticketTemplateId;

      this.edit_info.dateType = this.camp_Info.dateType == 1 ? "1" : "2";
      this.edit_info.startDate = this.camp_Info.startDate || "";
      this.edit_info.endDate = this.camp_Info.endDate || "";

      this.edit_info.useDesc = this.camp_Info.useDesc.replace(/\\n/g, "\n");

      this.edit_info.ChangeDateType = this.camp_Info.changeDateType == 0 ? "0" : "1";
      this.edit_info.ChangeStartDate = this.camp_Info.changeStartDate;
      this.edit_info.ChangeEndDate = this.camp_Info.changeEndDate;
      this.edit_info.ChangeStart = this.camp_Info.changeStart;
      this.edit_info.ChangeEnd = this.camp_Info.changeEnd;
      this.edit_info.discountDetail = this.camp_Info.discountDetail;
      this.edit_info.newDiscountDetail = this.camp_Info.discountDetail;

      // console.log(this.edit_info.ChangeDateType);

      this.isCheckDisabled = true;
    },

    async queryXX() {
      let url = "/campagin/selectCampaignByCampId";
      let { code, msg, classListList, brandList, campaign } = await postRequest(url, {
        campId: this.campId,
      });
      let categoryList = [];
      classListList.forEach(arr => {
        arr.sort((item1, item2) => {
          return item1.sort - item2.sort;
        });
        let obj = {};
        arr.forEach(item => {
          if (item.sort == 1) {
            obj.firstClassCode = item.classCode;
          }
          if (item.sort == 2) {
            obj.secondClassCode = item.classCode;
          }
          if (item.sort == 3) {
            obj._id = Math.random();
            obj.id = item.id;
            obj.threeClassCode = item.classCode;
          }
        });
        categoryList.push(obj);
      });

      campaign.settleAmount = campaign.settleAmountYuan;
      campaign.price = campaign.priceYuan;
      campaign.originalPrice = campaign.originalPriceYuan;

      this.camp_Info = campaign;
      this.editInfo();

      this.edit_info.categoryList = categoryList;

      let brandIds = [];
      let brandNames = [];
      let brandCodes = [];
      brandList.forEach(item => {
        brandIds.push(item.id);
        brandNames.push(item.brandName);
        brandCodes.push(item.brandCode);
      });
      this.edit_info.brandNames = brandNames;
      this.edit_info.brandIds = brandIds;
      this.edit_info.brandCodes = brandCodes;
    },

    statusCheckChange() {
      this.isCheckDisabled = false;
    },

    //优惠券类型改变
    chargeTypeChange(item) {
      console.info(item);
      Object.assign(this.edit_info, item);
      console.info(this.edit_info);
    },

    //保存
    campagin_add() {
      if (this.edit_info.couponKind == 3) {
        if (this.edit_info.originalPrice <= 0) {
          this.$Message.error("请填写原价");
          return;
        }
        if (this.edit_info.price < 0.1) {
          this.$Message.error("请填写售卖价并且不能低于0.1元");
          return;
        }
        if (this.edit_info.price > this.edit_info.originalPrice) {
          this.$Message.error("您的优惠价高于原价，请重新输入");
          return;
        }
      }

      if (this.edit_info.name == "") {
        this.$Message.error("请填写活动标题");
        return;
      }
      if (this.edit_info.appid == "") {
        this.$Message.error("请选择appid");
        return;
      }

      if (this.edit_info.doorsillDesc == "") {
        this.$Message.error("请填写使用门槛描述");
        return;
      }

      if (this.edit_info.startDate == "" || this.edit_info.endDate == "") {
        this.$Message.error("请选择开始日前和结束日期");
        return;
      }
      if (this.edit_info.startDate != "" || this.edit_info.endDate != "") {
        if (
          formatDate(new Date(this.edit_info.startDate), "yyyy-MM-dd hh:mm:ss") >
          formatDate(new Date(this.edit_info.endDate), "yyyy-MM-dd hh:mm:ss")
        ) {
          this.$Message.error("开始日期不能大于结束日期");
          return;
        }
      }

      this.edit_info.startDate = formatDate(new Date(this.edit_info.startDate), "yyyy-MM-dd hh:mm:ss");
      this.edit_info.endDate = formatDate(new Date(this.edit_info.endDate), "yyyy-MM-dd hh:mm:ss");

      // 转换结束时间 23:59:59
      this.edit_info.endDate = this.edit_info.endDate.slice(0, 10) + " 23:59:59";
      // console.log(this.edit_info.endDate);
      // return;

      if (this.edit_info.rules == "") {
        this.$Message.error("请填写活动/领券规则");
        return;
      }

      if (this.edit_info.imgUrl == "") {
        this.$Message.error("请上传优惠券详情图");
        return;
      }

      if (this.edit_info.couponImg == "") {
        this.$Message.error("请上传优惠券缩略图");
        return;
      }

      if (this.edit_info.useDesc == "") {
        this.$Message.error("请填写券使用说明");
        return;
      }

      if (this.edit_info.ticketTemplateId == "") {
        this.$Message.error("请选择优惠券模板");
        return;
      }

      if (this.camp_pageStatus === "add") {
        this.getUrl = "/campagin/add";
        this.campId = "";
        this.msg = "新增成功";
      } else {
        this.getUrl = "/campagin/edit/" + this.campId;
        this.msg = "编辑成功";
      }
      // const reqParams = this.edit_info;

      // this.$refs["edit_info"].validate(async valid => {
      // console.log("categoryList:", JSON.stringify(this.edit_info.categoryList));
      // 品类 "goodsClassIds":[1,2],
      // 品牌 "goodsBrandIds":[1,2]

      // if (!valid) {
      //   this.msgErr("数据校验失败");
      //   return;
      // }
      let goodsClassIds = this.edit_info.categoryList.map(item => item.id);
      let goodsBrandIds = this.edit_info.brandIds;
      const reqParams = {
        goodsClassIds,
        goodsBrandIds,
        campId: this.campId,
        appid: this.edit_info.appid,
        campType: this.edit_info.campType,
        couponType: this.edit_info.couponType,
        ticketTemplateId: this.edit_info.ticketTemplateId,
        name: this.edit_info.name,
        couponValueDesc: this.edit_info.couponValueDesc.replace(/\t/g, "").replace(/\n/g, "\\n"),
        doorsillDesc: this.edit_info.doorsillDesc.replace(/\t/g, "").replace(/\n/g, "\\n"),
        dateType: this.edit_info.dateType,
        startDate: this.edit_info.startDate,
        endDate: this.edit_info.endDate,
        rules: this.edit_info.rules.replace(/\t/g, "").replace(/\n/g, "\\n"),
        useDesc: this.edit_info.useDesc.replace(/\t/g, "").replace(/\n/g, "\\n"),
        status: this.edit_info.status,
        ticketName: this.edit_info.ticketName,
        couponImg: this.edit_info.couponImg,
        couponSimpleImg: this.edit_info.couponSimpleImg,
        imgUrl: this.edit_info.imgUrl,
        // discountDetail: this.edit_info.discountDetail // 优惠券详情(富文本)
        discountDetail: this.edit_info.newDiscountDetail, // 优惠券详情(富文本)

        // 1.5.6.1.1
        couponKind: this.edit_info.couponKind,
        originalPrice: this.edit_info.originalPrice,
        price: this.edit_info.price,
        enableAfterSale: this.edit_info.enableAfterSale,
        settleAmount: this.edit_info.settleAmount,
        couponAfterSaleVOList: this.edit_info.couponAfterSaleVOList,
      };

      if (reqParams.couponKind == 1) {
        delete reqParams.couponAfterSaleVOList;
        delete reqParams.originalPrice;
        delete reqParams.price;
        delete reqParams.enableAfterSale;
        delete reqParams.settleAmount;
      }

      // console.log("save:reqParams==>", reqParams);
      // return;
      this.add_loading = true;
      postRequest(this.getUrl, reqParams).then(res => {
        this.add_loading = false;

        if (res.code == 200) {
          this.isCheckDisabled = true;

          this.$Message.info(this.msg);
          if (this.camp_pageStatus === "add") {
            this.campId = res.campId;
          }
          setTimeout(() => {
            this.nextInfo();
          }, 1200);
        } else {
          this.$Message.error(res.msg);
        }
      });
      // });
    },

    dataProcessing() {
      if (this.edit_info.startDate == "" || this.edit_info.endDate == "") {
        this.$Message.error("请选择开始日前和结束日期");
        return;
      }
      if (this.edit_info.startDate != "" || this.edit_info.endDate != "") {
        if (
          formatDate(new Date(this.edit_info.startDate), "yyyy-MM-dd hh:mm:ss") >
          formatDate(new Date(this.edit_info.endDate), "yyyy-MM-dd hh:mm:ss")
        ) {
          this.$Message.error("开始日期不能大于结束日期");
          return;
        }
      }

      var old_sDate = formatDate(new Date(this.edit_info.startDate), "yyyy-MM-dd hh:mm:ss");

      var old_eDate = formatDate(new Date(this.edit_info.endDate), "yyyy-MM-dd hh:mm:ss");

      var new_sdate = new Date(old_sDate.replace(/-/g, "/"));
      var new_edate = new Date(old_eDate.replace(/-/g, "/"));
      var days = new_edate.getTime() - new_sdate.getTime();
      var daySum = parseInt(days / (1000 * 60 * 60 * 24));

      this.setStore("daySum", daySum);
    },
    //下一步
    nextInfo() {
      this.setStore("camp_pageStatus", "");
      this.setStore("campId", this.campId);

      this.receiveRuleSetPage = true;
      this.dataProcessing();
    },

    showReceiveRuleSetStatus(e) {
      if (e.type == 1) {
        this.$emit("changeStatus", false);
      }
      this.$emit(`update:basicSetPage`, true);
      this.receiveRuleSetPage = e.Return;

      this.edit_info = { ...this.edit_info };
    },

    goback() {
      this.$emit("changeStatus", false);
    },

    // statusCheckChange() {
    //   this.isCheckDisabled = false;
    // },
    handleMaxSize(file) {
      this.$Message.error("图片不大于1M");
    },
    //上传imgUrl图片
    handleSuccess(res, file) {
      if (res.code == 200) {
        this.edit_info.imgUrl = res.image_url;

        if (this.uploadList.length == 0) {
          let obj = {
            url: res.image_url,
          };
          this.uploadList.push(obj);
        } else {
          this.uploadList[0].url = res.image_url;
        }

        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
      this.statusCheckChange();
    },

    handleBeforeUpload(file) {
      return checkImageWH(file, 130, 130);
    },

    handleBeforeUpload1(file) {
      return checkImageWH(file, 280, 218);
    },

    //上传couponImg图片
    handleSuccess1(res, file) {
      if (res.code == 200) {
        this.edit_info.couponImg = res.image_url;

        if (this.uploadList1.length == 0) {
          let obj = {
            url: res.image_url,
          };
          this.uploadList1.push(obj);
        } else {
          this.uploadList1[0].url = res.image_url;
        }

        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
      this.statusCheckChange();
    },
    //上传couponImg图片
    handleSucces2(res, file) {
      if (res.code == 200) {
        this.edit_info.couponSimpleImg = res.image_url;

        if (this.uploadList2.length == 0) {
          let obj = {
            url: res.image_url,
          };
          this.uploadList2.push(obj);
        } else {
          this.uploadList2[0].url = res.image_url;
        }

        this.$Message.info("上传图片成功");
      } else {
        this.$Message.error("上传图片失败，请重新上传");
      }
      this.statusCheckChange();
    },

    //获取APPid
    getAppId() {
      getRequest("/miniapp/miniapp-info/store").then(res => {
        if (res.code == 200) {
          this.appId_info = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    // 选择模版start--------------------------------
    resInfo() {
      if (this.edit_info.startDate == "" || this.edit_info.endDate == "") {
        this.$Message.error("请选择开始日前和结束日期");
        return;
      }
      if (this.edit_info.startDate != "" || this.edit_info.endDate != "") {
        if (
          formatDate(new Date(this.edit_info.startDate), "yyyy-MM-dd hh:mm:ss") >
          formatDate(new Date(this.edit_info.endDate), "yyyy-MM-dd hh:mm:ss")
        ) {
          this.$Message.error("开始日期不能大于结束日期");
          return;
        }
      }

      this.edit_info.startDate = formatDate(new Date(this.edit_info.startDate), "yyyy-MM-dd hh:mm:ss");
      this.edit_info.endDate = formatDate(new Date(this.edit_info.endDate), "yyyy-MM-dd hh:mm:ss");

      // 转换结束时间 23:59:59
      this.edit_info.endDate = this.edit_info.endDate.slice(0, 10) + " 23:59:59";

      this.res_Modal_show = true;
      this.res_info.ticketTemplateIDs = this.edit_info.ticketTemplateId;

      this.getTicketTemplate(this.edit_info.campType);
      this.statusCheckChange();
    },
    //获取模版ID
    getTicketTemplate(obj) {
      postRequest(
        "/campagin/selectSweetprojectitemBySheetID?type=" +
          obj +
          "&campId=" +
          this.campId +
          "&ChangeStartDate=" +
          this.edit_info.startDate +
          "&ChangeEndDate=" +
          this.edit_info.endDate
      ).then(res => {
        if (res.code == 200) {
          this.res_list = res.data;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    resOk() {
      this.res_info.ticketTemplateIDs = this.currentChooseID;
      this.edit_info.ticketTemplateId = this.currentChooseID;
      this.edit_info.ticketName = this.currentChooseName;
      this.res_Modal_show = false;
    },

    // 富文本
    change(val) {
      // console.log("change:", val);
      // console.log("data:",this.edit_info.discountDetail);
      this.edit_info.newDiscountDetail = val;
      this.isCheckDisabled = false;
    },
    blur(val) {
      // console.log("blur:", val);
      this.edit_info.newDiscountDetail = val;
      this.isCheckDisabled = false;
    },

    // 选择模版end--------------------------------

    //品牌
    async getBrandList() {
      const url = "/campagin/listGoodBrand";
      let { code, msg, data } = await postRequest(url, {
        brandCode: "",
        brandName: "",
        pageNum: 1,
        pageSize: 10,
      });
      if (code == 200) {
        this.list3 = data;
      } else {
        this.msgErr(msg);
      }
    },
    // 全局提示
    msgOk(txt) {
      this.$Message.info({
        content: txt,
        duration: 3,
      });
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3,
      });
    },
  },
  mounted() {
    this.init();
    this.getBrandList();
  },
};
</script>

<style>
.form {
  width: 900px;
}
.form > div {
  display: inline-block;
}
</style>
