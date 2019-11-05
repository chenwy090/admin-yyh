<template>
  <div class="search">
    <Row v-if="!couponEditPage&&!couponDetailPage">
      <!--  <div
        style="width: 90%;background: #fff;box-shadow:0 6px 6px -4px rgba(0,0,0,.2);z-index: 5;position:fixed; padding:14px"
      >
         <Alert show-icon v-if="merchantId">
           商户编号 :  <span style="color:red">{{merchantId}}</span>
            <span slot="desc"></span>
          </Alert>
      </div>-->
      <div style>
        <Card>
          <Row>
            <Form ref="searchItem" :model="searchItem" inline :label-width="70" class="search-form">
              <FormItem label="标题">
                <Input
                  type="text"
                  v-model="searchItem.title"
                  clearable
                  placeholder="请输入标题"
                  style="width: 200px"
                />
              </FormItem>
              <FormItem label="标签：">
                <Select v-model="searchItem.isTag" style="width:120px" clearable>
                  <Option v-for="(v,k) in tagOptions" :value="k" :key="k">{{ v }}</Option>
                </Select>
              </FormItem>
              <span v-if="drop">
                <FormItem label="适用商户">
                  <Input
                    type="text"
                    v-model="searchItem.merchantNames"
                    clearable
                    placeholder="请输入商户"
                    style="width: 200px"
                  />
                </FormItem>
                <FormItem label="优惠类型">
                  <Select
                    v-model="searchItem.couponType"
                    placeholder="请选择"
                    clearable
                    style="width: 200px"
                  >
                    <Option value>所有</Option>
                    <Option value="1">立减券</Option>
                    <Option value="2">折扣券</Option>
                    <Option value="3">满减券</Option>
                    <Option value="4">体验券</Option>
                    <Option value="5">换购券</Option>
                    <Option value="6">赠品券</Option>
                  </Select>
                </FormItem>
                <FormItem label="卡券状态">
                  <Select
                    v-model="searchItem.templateStatus"
                    placeholder="请选择"
                    clearable
                    style="width: 200px"
                  >
                    <Option value>所有</Option>
                    <Option value="待发布">待发布</Option>
                    <Option value="进行中">进行中</Option>
                    <Option value="已结束">已结束</Option>
                  </Select>
                </FormItem>
                <FormItem label="发布开始时间" :label-width="100">
                  <DatePicker
                    type="datetime"
                    v-model="searchItem.startDate"
                    placeholder="选择日期"
                    style="width: 200px"
                  ></DatePicker>
                </FormItem>

                <FormItem label="发布结束时间" :label-width="100">
                  <DatePicker
                    type="datetime"
                    placeholder="选择日期"
                    style="width:200px"
                    v-model="searchItem.endDate"
                  ></DatePicker>
                </FormItem>
              </span>
              <FormItem style="margin-left:-35px;" class="br">
                <Button @click="queryTableList" type="primary" icon="ios-search">搜索</Button>
                <Button @click="refresh">重置</Button>
                <a class="drop-down" @click="dropDown">
                  {{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a>
              </FormItem>
            </Form>
          </Row>
        </Card>
        <Card>
          <Row class="operation">
            <Button type="dashed" icon="md-arrow-round-back" @click="goback()">返回</Button>
            <Button type="primary" icon="md-add" @click="addInfo()">新增</Button>

            <Button @click="queryTableData" icon="md-refresh">刷新</Button>
            <!-- 排序导入  排序导出 -->
            <Button type="success" class="marginLeft20" @click="upload(1)">排序导入</Button>
            <Button type="success" class="marginLeft20" @click="download(1)">排序导出</Button>
            <Button type="success" class="marginLeft20" @click="upload(2)">分享奖励导入</Button>
            <!--<Button type="success" class="marginLeft20" @click="download(2)">分享奖励导出</Button>-->
          </Row>

          <Row>
            <Table
              :loading="TableLoading"
              border
              :columns="tableColumns"
              :data="table_list"
              sortable="custom"
              ref="table"
            >
              <!-- title  isNew新品/isHot 热门 -->

              <template slot-scope="{ row }" slot="title">
                <!-- style="width:74px;height:43px;" -->
                <img v-if="row.isNew==1" style="width:40px;" src="/images/newCoupon.png" />
                <img v-if="row.isHot==1" style="width:40px;" src="/images/hot.png" />
                {{row.title}}
              </template>

              <template slot-scope="{ row }" slot="couponBigImg">
                <Tooltip content="点击可查看大图 " placement="right">
                  <img
                    :src="row.couponBigImg"
                    style="width:74px;height:43px;"
                    @click="showBigImg(row)"
                  />
                </Tooltip>
              </template>

              <template slot-scope="{ row }" slot="ticketMoney">
                <span v-if="row.couponType==1">{{row.ticketMoney /100}} 元</span>
                <span v-if="row.couponType==2">{{row.ticketDiscount /10}} 折</span>
              </template>

              <template slot-scope="{ row }" slot="ChangeStart">
                <span v-if="row.useDateType ==1">{{row.useStartDate}}</span>
                <span v-if="row.useDateType ==2">加{{row.addDaysUseStart}}天开始生效</span>
              </template>

              <template slot-scope="{ row }" slot="ChangeEnd">
                <span v-if="row.useDateType ==1">{{row.useEndDate}}</span>
                <span v-if="row.useDateType ==2">加{{row.addDaysUseEnd}}天结束用券</span>
              </template>

              <template slot-scope="{ row }" slot="price">
                <span v-if="row.couponKind ==2">{{row.price /100}} 元</span>
                <span v-else>免费</span>
              </template>

              <template slot-scope="{ row }" slot="operate">
                <Button
                  type="text"
                  size="small"
                  style="color:#2db7f5"
                  @click="editInfo(row)"
                  v-if="row.templateStatus == '待发布' "
                >编辑</Button>
                <!--<Button type="text" size="small" style="color:#ed4014" @click="" v-if="row.templateStatus == '待发布' ">删除</Button>-->
                <Button
                  type="text"
                  size="small"
                  style="color:red"
                  @click="inputUpdateAccountStatus(row)"
                  v-if="row.templateStatus == '进行中' "
                >下架</Button>
                <Button
                        type="text"
                        size="small"
                        style="color:red"
                        @click="upStatus(row)"
                        v-if="row.templateStatus == '待发布'||row.templateStatus == '已结束'"
                >上架</Button>
                <!--<Button type="text" size="small" style="color:blue" @click="" v-if="row.templateStatus == '进行中' || row.templateStatus == '已结束' ">查看明细</Button>-->
                <Button type="text" size="small" style="color:red" @click="inputAppendStockCountStatus(row)" v-if="row.templateStatus == '进行中' ">追加</Button>
                <Button type="text" size="small" style="color:green" @click="editInfo(row,'copy')" >复制</Button>
                <!--changeStatus(row)-->
                <Button type="text" size="small" style="color:red" @click="share(row)">分享奖励</Button>
                <Button type="text" size="small" style="color:#2db7f5" @click="setTag(row)">打标签</Button>
                <Button type="text" size="small" style="color:#2d8cf0" @click="detailInfo(row.templateId)">查看详情</Button>
              </template>
              <template slot-scope="{ row }" slot="templateStatus">
                <Tooltip max-width="300" placement="left-start">
                  <Button>{{row.templateStatus}}</Button>
                  <div slot="content">
                    <div v-if="row.couponOperationLogList">
                      <div v-for="item in row.couponOperationLogList">
                        <p>操作人：{{item.operator}}</p>
                        <p>操作时间:{{item.operationTime}}</p>
                        <p>下架原因：{{item.afterOperation}}</p>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </template>
            </Table>
          </Row>
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
        </Card>
      </div>
    </Row>

    <div v-if="couponEditPage">
      <couponEdit @changeStatus="showbasicSetStatus" :couponEdit_info="couponEdit_info"></couponEdit>
    </div>
    <div v-if="couponDetailPage">
      <couponDetail ref="modalDetail" @changeStatus="showbasicSetStatus" :couponEdit_info="couponEdit_info"></couponDetail>
    </div>

    <Modal v-model="bigImgDialog" title="查看大图" width="600" @on-cancel="bigImgCancel">
      <img style="width: 100%" :src="big_Image_url" />
    </Modal>

    <Modal title="上架/下架" v-model="updateTemplateStatusDisplay" :mask-closable="false" footer-hide>
      <Form ref="formCustom" :model="formCustom" :label-width="80" style="margin-top:20px">
        <span>提示：已售卖或领用的卡券仍可有效使用。</span>
        <FormItem label="填写原因" required>
          <Input
            type="textarea"
            :rows="2"
            v-model="formCustom.remark"
            placeholder="提示:200字符"
            style="width:300px"
            :maxlength="200"
          ></Input>
          <!--<Input type="textarea" :rows="2" style="width:300px" ></Input>-->
        </FormItem>
        <FormItem>
          <Button type="primary" @click="updateTemplateStatusFn">确认</Button>
          <Button style="margin-left: 8px" @click="updateTemplateStatusDisplay = false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal title="追加" v-model="appendStockCountDisplay" :mask-closable="false" footer-hide>
      <Form ref="formCustom" :model="formCustom" :label-width="80" style="margin-top:20px">
        <FormItem label="已发布">
          <Input
            type="text"
            v-model="formCustom.stockCount"
            clearable
            placeholder="请输入..."
            style="width: 200px"
          />
          <span>张</span>
        </FormItem>

        <FormItem label="剩余库存">
          <Input
            type="text"
            v-model="formCustom.surplusCount"
            clearable
            placeholder="请输入..."
            style="width: 200px"
          />
          <span>张</span>
        </FormItem>
        <FormItem label="追加" required>
          <Input type="textarea" :rows="2" v-model="formCustom.appendCount" style="width:300px"></Input>
          <span>张</span>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="updateTemplateAppendCountFn">确认</Button>
          <Button style="margin-left: 8px" @click="appendStockCountDisplay = false">关闭</Button>
        </FormItem>
      </Form>
    </Modal>

    <Modal title="分享奖励" v-model="shareDisplay" :mask-closable="false" footer-hide>
      <Form ref="shareModal" :model="formShareModal" :label-width="100" style="margin-top:20px">
        <FormItem
          v-for="item in formShareModal.shareData"
          :key="item.id"
          :label="item.name"
          required
        >
          <InputNumber
            :min="item.name== '倍数'?1:0"
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
          <Button style="margin-left: 20px;float: right;" @click="shareDisplay = false">关闭</Button>
          <Button style="float: right;" type="primary" @click="shareSave('shareModal')">确认</Button>
        </FormItem>
      </Form>
    </Modal>
    <FileImport
            v-if="showFileImport"
      :showFileImport.sync="showFileImport"
      @refresh="queryTableData"
            :upType="upType"
    ></FileImport>

    <SetTag
      v-if="showTag"
      :id="id"
      :showTag.sync="showTag"
      :tagData="tagData"
      @refresh="queryTableData"
    ></SetTag>

    <modalDetail ref="modalDetail" :descConfig="descConfig" :show="modalDetailData.show" />

  </div>
</template>

<script>
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest,
  downloadSteam
} from "@/libs/axios";

import { formatDate } from "@/libs/date";
import couponEdit from "./couponEdit";
import FileImport from "./FileImport";
import SetTag from "./SetTag";

import modalDetail from "@/components/ModalDetail";
import couponDetail from "./couponDetail";

import {
  postJson,
} from "@/libs/axios";
import { baseUrl } from "@/api/index";

export default {
  name: "merchant-information",
  components: {
    modalDetail,
    couponEdit,
    FileImport,
    SetTag,
      couponDetail
  },
  props: {
    merchantId: String
  },
  data() {
    return {
        upType:'',
      descConfig: [
        ['templateId', '优惠券模板ID'],
        ['merchantNames', '商户名称，多个商户'],
        ['title', '优惠标题'],
        ['couponSource', '来源'],
        ['userOpenWithCoupon', '使用打开方式'],
        ['thirdUrl', '第三方Url'],
        ['subTitle', '优惠副标题'],
        ['couponTypeName', '优惠类型'],
        ['couponKind', '收费类型'],
        ['employeeId', '专属客服'],
        ['couponKindName', '优惠券种类'],
          ['price','售卖价'],
          ['originalPrice','原价'],
          ['couponSaleAfterList','售后条件'],
        ['isActivityCouponName', '是否为活动券'],
        ['couponPutChannelList', '投放渠道'],
        ['price', '购买价格，单位分'],
        ['label', '优惠标签-预留字段'],
        ['startDate', '活动开始时间'],
        ['endDate', '活动结束时间'],
        ['useDateTypeName', '用券有效期类型'],
        ['useStartDate', '用券开始时间'],
        ['useEndDate', ' 用券结束时间'],
        ['addDaysUseStart', '加X天开始生效（相对领券日期）'],
        ['addDaysUseEnd', '加Y天结束用券（相对领券日期）'],
        ['couponSmallImg', '优惠券缩略图'],
        ['couponBigImg', '优惠券详情图'],
        ['couponSimpleImg', '优惠券简图'],
        ['buyNotes', '购买须知'],
        ['useDesc', '券使用说明'],
        ['getLimit', '用户限领数量'],
        ['stockCount', '库存数量'],
        ['isNewName', '是否新标签'],
        ['isHotName', '是否热标签'],
        // ['isActivityCoupon', '是否活动券：0-不是活动券, 1-活动券'],
        // ['orderBy', '人工排序字段：顺序排序，创建时前端表单默认9999'],
        ['statusName', '状态'],
        // ['receiveCount', '被领取的数量'],
        // ['surplusCount', '剩余库存'],
      ],
      modalDetailData: {
        show: true,
        data: {
          _id: '周边券详情',
          name: '查看详情呀'
        }
      },
      id: "", // templateId
      showFileImport: false,
      //打标签 已打标签、未打标签
      showTag: false,
      tagOptions: {
        1: "已打标签",
        0: "未打标签"
      },
      tagData: [],
      formShareModal: {
        shareData: []
      },
      couponEditPage: false,
        couponDetailPage: false,
      updateTemplateStatusDisplay: false,
      appendStockCountDisplay: false,
      shareDisplay: false,
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "ios-arrow-down",
      searchItem: {
        title: "",
        // 是否有标签 0-未打标签 1-已打标签
        isTag: "",
        merchantNames: "",
        couponType: "",
        templateStatus: "",
        startDate: "",
        endDate: ""
      },
      formCustom: {
        type: "", // USER_MANAGE会员管理
        id: "",
        templateId: "",
        status: "",
        operation: "", // 操作
        appendCount: 0,
        stockCount: 0,
        getLimit: 0,
        surplusCount: 0,
        remark: "" // 备注
      },
      couponEdit_info: {},
      current: 1,
      totalSize: 0, //总条数
      pageNum: 1, //开始条数
      limit: 10, //每页记录数
      TableLoading: false,
      table_list: [],
      self: this,
      bigImgDialog: false, //显示大图
      big_Image_url: "",
      tableColumns: [
        {
          title: "卡券ID",
          key: "templateId",
          align: "center",
          width: 150
        },
        {
          title: "卡券标题",
          key: "title",
          align: "center",
          width: 200,
          slot: "title" //新品/热门
        },
        {
          title: "适用商户",
          key: "merchantNames",
          align: "center",
          width: 150
        },
        {
          title: "来源",
          key: "source",
          align: "center",
          width: 150
        },

        {
          title: "优惠券类型",
          key: "couponType",
          align: "center",
          width: 200,
          render: (h, params) => {
            const row = params.row;
            const color = "blue";
            const text =
              row.couponType == "1"
                ? "立减券"
                : row.couponType == "2"
                ? "折扣券"
                : row.couponType == "3"
                ? "满减券"
                : row.couponType == "4"
                ? "体验券"
                : row.couponType == "5"
                ? "换购券"
                : row.couponType == "6"
                ? "赠品券"
                : "未知类型";

            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "发放总量",
          key: "stockCount",
          align: "center",
          width: 150
        },
        {
          title: "剩余库存",
          key: "surplusCount",
          align: "center",
          width: 150
        },
        {
          title: "创建人",
          key: "createBy",
          align: "center",
          width: 150
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "center",
          width: 150
        },
        {
          title: "操作人",
          key: "updateBy",
          align: "center",
          width: 150
        },
        {
          title: "操作时间",
          key: "updateTime",
          align: "center",
          width: 150
        },
        {
          title: "状态",
          slot: "templateStatus",
          align: "center",
          width: 150
        },
        {
          title: "操作",
          key: "action",
          fixed: "left",
          align: "center",
          slot: "operate",
          width: 280
        }
      ]
    };
  },

  created: function() {},
  methods: {
    init() {
      this.queryTableData();
    },
    showDetail(templateId) {
      console.log(templateId, '549');
      // /merchantCouponTemplate/selectByTemplateId
      this.modalDetailData.show = true;
      // this.modalDetailData.data = {
      //   templateId: '优惠券模板ID',
      //   title: '优惠标题',
      //   subTitle: '优惠副标题',
      //   couponType: '优惠类型',
      //   employeeId: '专属客服',
      //   couponKind: '优惠券种类',
      //   price: '购买价格，单位分',
      //   label: '优惠标签-预留字段',
      //   startDate: '活动开始时间',
      //   endDate: '活动结束时间',
      //   useDateType: '用券有效期类型',
      //   useStartDate: '用券开始时间',
      //   useEndDate: ' 用券结束时间',
      //   couponSmallImg: '优惠券缩略图',
      //   couponBigImg: '优惠券详情图',
      //   buyNotes: '购买须知',
      //   useDesc: '券使用说明',
      //   getLimit: '用户限领数量',
      //   stockCount: '库存数量',
      //   isActivityCoupon: '是否活动券：0-不是活动券, 1-活动券',
      //   orderBy: '人工排序字段：顺序排序，创建时前端表单默认9999',
      //   status: '状态：0.创建, 1.上架,-1.下架',
      //   couponSimpleImg: '优惠券简图',
      //   merchantNames: '商户名称，多个商户',
      //   receiveCount: '被领取的数量',
      //   surplusCount: '剩余库存',
      //   source: '来源',
      //   userOpenWithCoupon: '使用打开方式',
      //   thirdUrl: '第三方Url',
      // }
      postJson(baseUrl + "/merchantCouponTemplate/selectByTemplateId?templateId="+templateId, {templateId}).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.$refs.modalDetail.showByFather(res.data);
        } else {
          this.msgErr(res.msg);
        }
      }).catch(err=>{
        // console.log(err, 'operating_merchant/merchant-customer/merchant-customer-add, Line929')
      });
      this.$refs.modalDetail.showByFather();
    },
    upload(type) {
      this.showFileImport = true;
      this.upType = type;
    },
    async download() {
      const url = "/template/sort/excel/download";

      const res = await downloadSteam(url);

      console.log(111111111111111111, res);

      const content = res.data;
      const { filename } = res.headers;

      console.log(111111111111111111, res);
      const blob = new Blob([content], { type: "application/vnd.ms-excel" });
      const oA = document.createElement("a");
      if ("download" in oA) {
        // 非IE下载
        oA.download = decodeURI(filename);
        oA.style.display = "none";
        oA.href = URL.createObjectURL(blob);
        document.body.appendChild(oA);
        oA.click();
        URL.revokeObjectURL(oA.href); // 释放URL 对象
        document.body.removeChild(oA);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, filename);
      }
    },
    setTag(row) {
      // templateId
      this.id = row.templateId;
      this.showTag = true;
      this.tagData = row.templateTags;
    },
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "ios-arrow-down";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "ios-arrow-up";
      }
      this.drop = !this.drop;
    },

    //	刷新页面
    refresh() {
      this.searchItem = {
        title: "",
        // 是否有标签 0-未打标签 1-已打标签
        isTag: "",
        merchantNames: "",
        couponType: "",
        templateStatus: "",
        startDate: "",
        endDate: ""
      };
      this.queryTableList();
    },

    //搜索
    queryTableList() {
      this.pageNum = 1;
      this.totalSize = 0;
      this.queryTableData();
    },

    //分页

    changeCurrent(current) {
      this.pageNum = current;
      this.queryTableData();
    },

    queryTableData() {
      this.TableLoading = true;

      const reqParams = {
        title: this.searchItem.title,
        isTag: this.searchItem.isTag,
        merchantNames: this.searchItem.merchantNames,
        couponType: this.searchItem.couponType,
        templateStatus: this.searchItem.templateStatus,
        startDate: this.searchItem.startDate,
        endDate: this.searchItem.endDate
      };

      postRequest(
        "/merchantCouponTemplate/backList?pageNum=" +
          this.pageNum +
          "&pageSize=" +
          this.limit,
        reqParams
      ).then(res => {
        this.TableLoading = false;

        this.totalSize = res.data.total;
        this.table_list = res.data.records;
      });
    },
    inputAppendStockCountStatus(row) {
      this.formCustom.templateId = row.templateId;
      this.formCustom.type = "优惠券管理";
      this.formCustom.stockCount = row.stockCount;
      this.formCustom.surplusCount = row.surplusCount;
      //this.formCustom.appendCount = '-1' ;
      this.appendStockCountDisplay = true;
    },
    share(row) {
      this.formShareModal.shareData = [];
      postRequest("/commonConfig/queryConfigByCode", {
        code: row.templateId
      }).then(res => {
        if (res.code == 200) {
          if (res.data || res.data.noOverallCommonConfigList) {
            this.formShareModal.shareData =
              res.data.noOverallCommonConfigList || [];
            this.formShareModal.shareData.forEach(function(v) {
              v.value = Number(v.value) || 0;
            });
            this.shareDisplay = true;
          } else {
            this.msgErr("未查询到数据");
          }
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    shareSave(name) {
      let canSave = true;
      let msg = "";
      this.formShareModal.shareData.forEach(function(v) {
        v.createTime = null;
        v.updateTime = null;
        v.updateBy = null;
        if (!v.value && v.value !== 0) {
          canSave = false;
          msg = "请输入完整表单";
        }
        if (v.name == "倍数" && v.value < 1) {
          canSave = false;
          msg = "请输入大于等于1的倍数";
        }
      });
      if (!canSave) {
        this.msgErr("请输入完整表单");
        return;
      }
      postRequest("/commonConfig/updateConfigBatch", {
        noOverallCommonConfigList: this.formShareModal.shareData
      }).then(res => {
        if (res.code == 200) {
          //this.formCustom.remark='';
          this.shareDisplay = false;
        } else {
          this.msgErr(res.msg);
        }
      });
    },
    // 更新账户
    updateTemplateAppendCountFn() {
      const reqParams = {
        templateId: this.formCustom.templateId,
        appendCount: this.formCustom.appendCount,
        //remark: this.formCustom.remark,
        type: this.formCustom.type
      };
      postRequest(
        "/merchantCouponTemplate/appendStockCount?templateId=" +
          this.formCustom.templateId,
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.msgOk("追加成功");
          this.appendStockCountDisplay = false;
          //this.getList({});
          // 清空输入框
          this.formCustom.templateId = "";
          this.formCustom.type = "";
          this.formCustom.appendCount = 0;
          //this.formCustom.remark='';
          this.queryTableData();
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    // 传值到审核对话框
    inputUpdateAccountStatus(row) {
      this.formCustom.templateId = row.templateId;
      this.formCustom.type = "优惠券管理";
      this.formCustom.status = "-1";
      this.updateTemplateStatusDisplay = true;
    },
      // 传值到审核对话框
      upStatus(row) {
          this.formCustom.templateId = row.templateId;
          this.formCustom.type = "优惠券管理";
          this.formCustom.status = "1";
          this.updateTemplateStatusDisplay = true;
      },

    // 更新账户
    updateTemplateStatusFn(item) {
      const reqParams = {
        templateId: this.formCustom.templateId,
        status: this.formCustom.status,
        remark: this.formCustom.remark,
        type: this.formCustom.type
      };
      postRequest(
        "/merchantCouponTemplate/updStatus/?templateId=" +
          this.formCustom.templateId +
          "&status="+this.formCustom.status,
        reqParams
      ).then(res => {
        if (res.code == 200) {
          this.msgOk("更新成功");
          this.updateTemplateStatusDisplay = false;
          //this.getList({});
          // 清空输入框
          this.formCustom.templateId = "";
          this.formCustom.type = "";
          this.formCustom.status = "";
          this.formCustom.remark = "";
          this.queryTableData();
        } else {
          this.msgErr(res.msg);
        }
      });
    },

    //新增
    addInfo() {
      this.setStore("camp_pageStatus", "add");
        this.couponEdit_info = {};
      this.couponEdit_info.merchantId = this.merchantId;
      this.couponEditPage = true;
    },

    //编辑
    editInfo(item,type) {
        if(type){
            this.setStore("camp_pageStatus", "copy");
        }else{
            this.setStore("camp_pageStatus", "edit");
        }

      this.couponEdit_info = item;
      this.couponEditPage = true;
    },

      //查看详情
      detailInfo(item) {
          this.setStore("camp_pageStatus", "detail");
          this.couponEdit_info = item;
          this.couponDetailPage = true;
          this.couponEditPage = false;
          // this.$refs.modalDetail.rowDate(item);

      },
    showbasicSetStatus(e) {
      this.couponEditPage = e;
      this.couponDetailPage = e;
      this.queryTableData();
    },

    // 显示大图
    showBigImg: function(row) {
      this.bigImgDialog = true;
      this.big_Image_url = row.couponBigImg;
    },
    bigImgCancel: function() {
      this.bigImgDialog = false;
    },

    //更改列表上下架
    changeStatus(item) {
      const self = this;

      let new_status = "-1";
      console.log(this.pageNum);
      this.$Modal.confirm({
        title: "下架操作",
        content: `提示：已售卖或领用的卡券仍可有效使用。`,

        onOk: function() {
          const reqParams = {
            templateId: item.templateId,
            status: new_status
          };

          postRequest(
            "/merchantCouponTemplate/updStatus/?templateId=" +
              item.templateId +
              "&status=" +
              new_status,
            reqParams
          ).then(res => {
            self.loading = false;

            if (res.code == "200") {
              self.$Message.info("更改状态成功！");

              setTimeout(() => {
                self.queryTableData();
              }, 1200);
            } else {
              self.$Message.error(res.msg);
            }
          });
        },
        onCancel: () => {
          self.$Message.info("点击了取消");
        }
      });
    },
    // 跳转列表

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
    },
    //删除
    removeInfo(item) {
      const self = this;

      this.$Modal.confirm({
        title: "删除确认",
        content: `删除后不可恢复，是否继续删除？`,
        onOk: function() {
          self.$Loading.start();
          getRequest("/merchantCouponTemplate/edit/" + item.templateId).then(
            res => {
              self.loading = false;

              if (res.code == "200") {
                self.$Message.info("删除成功！");

                setTimeout(() => {
                  self.pageNum = 1;
                  self.queryTableData();
                }, 1200);
              } else {
                self.$Message.error(res.msg);
              }
            }
          );
        },
        onCancel: () => {
          self.$Message.info("点击了取消");
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>


<style lang="less" scoped>
.operation {
  margin-bottom: 2vh;
}
.select-count {
  font-size: 13px;
  font-weight: 600;
  color: #40a9ff;
}
.select-clear {
  margin-left: 10px;
}
.page {
  margin-top: 2vh;
}
.drop-down {
  font-size: 13px;
  margin-left: 5px;
}
</style>
