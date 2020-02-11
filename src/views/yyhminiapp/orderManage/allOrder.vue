<template>
  <div style="height: 100%">
    <div style="min-height: 100%">
      <Card style="height: 100%">
        <div>
          <Card :bordered="false" style="margin-bottom:2px">
            <Form ref="searchForm" label-position="right" :label-width="75" :model="searchForm" inline>
              <FormItem label="领取人手机：" span="24" :label-width="100">
                <Input v-model="searchForm.phoneNumber" placeholder="请填写领取人手机" />
              </FormItem>
              <FormItem label="订单号：" span="24">
                <Input v-model="searchForm.orderNo" placeholder="请填写订单号" />
              </FormItem>
              <FormItem label="状态：" span="24">
                <Select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100px;">
                  <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="领取终端：" span="24" :label-width="100">
                <Select v-model="searchForm.source" placeholder="请选择领取终端" clearable>
                  <Option v-for="item in sourceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <!--<FormItem label="套餐：" span="24"  style="width:20%">-->
              <!--<Select v-model="searchForm.expandType" style="width:100%">-->
              <!--<Option v-for="item in expandTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
              <!--</Select>-->
              <!--</FormItem>-->
              <FormItem label="领取时间：" span="35" :label-width="100">
                <DatePicker
                  type="daterange"
                  placeholder="选择领取时间"
                  v-model="searchForm.gmtDate"
                  @on-change="[searchForm.gmtCreateStart, searchForm.gmtCreateEnd] = $event"
                ></DatePicker>
              </FormItem>
              <FormItem label="核销时间：" span="35" :label-width="100">
                <DatePicker
                  type="daterange"
                  placeholder="选择核销时间"
                  v-model="searchForm.verifyTime"
                  @on-change="[searchForm.verifyStartTime, searchForm.verifyEndTime] = $event"
                ></DatePicker>
              </FormItem>
              <FormItem span="20" :label-width="1">
                <Button
                  type="primary"
                  class="submit"
                  icon="ios-search"
                  @click="search('searchForm')"
                  style="margin-right: 5px"
                  >搜索</Button
                >
                <Button style="margin-right: 5px" icon="md-refresh" @click="reset">重置</Button>

                <Button @click="downExcel">下载</Button>
              </FormItem>
            </Form>
          </Card>
          <Card style="margin-top: 1vh;">
            <Row class="operation" style="margin-bottom:1vh">
              <Button icon="md-refresh" @click="refech">刷新</Button>
              <!-- <span
                v-if="refreshData&&refreshData.allOrderCount"
              >总共{{refreshData.allOrderCount}}单，待付款{{refreshData.pendingPaymentOrderCount}}单，已付款{{refreshData.paidOrderCount}}单，已取消{{refreshData.cancelledOrderCount}}单，退款{{refreshData.refundOrderCount}}单</span> -->
              <!--<Button type="primary" icon="ios-download-outline" @click="downFn">下载</Button>-->
            </Row>
            <Row>
              <Table
                :loading="TableLoading"
                border
                :columns="tableColumns"
                :data="listData"
                sortable="custom"
                ref="table"
              >
                <template slot-scope="{ row }" slot="action">
                  <ButtonGroup>
                    <!-- 查看详情 -->
                    <!-- 查看详情：“待付款、已付款（券码未过期、已过期）、已取消、退款中、已退款、退款失败、付款中、已完成” -->
                    <Button type="info" size="small" @click="showDetail(row)">查看详情</Button>
                    <!-- 申请退款 -->
                    <!-- 申请退款：“已付款、退款失败 -->
                    <!-- 退款状态 （1：退款中 2：部分退款 3：全部退款 4：退款失败） -->
                    <Button
                      :disabled="!((row.status === 5 && row.refundStatus === 4) || row.status === 4)"
                      type="error"
                      size="small"
                      @click="applyRefund(row)"
                      >申请退款</Button
                    >
                  </ButtonGroup>
                </template>
              </Table>
            </Row>
            <!-- 分页 -->
            <Row type="flex" justify="end" class="page" style="padding-top:1vh">
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
      </Card>
    </div>
    <!--<TokerModal ref="TokerModal" :viewDialogVisible="TokerViewDialogVisible" @setViewDialogVisible="closeTab" @search="search"></TokerModal>-->
    <!--<DownModal ref="DownModal" :viewDialogVisible="DownViewDialogVisible" @setViewDialogVisible="closeTab"></DownModal>-->

    <Drawer v-model="showViewDialogVisible" :closable="true" :mask-closable="true" width="700" :styles="styles">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>详情</span>
      </p>
      <showDetailModal
        ref="showDetailModal"
        :viewDialogVisible="showViewDialogVisible"
        @setViewDialogVisible="closeTab"
      ></showDetailModal>
    </Drawer>

    <applyRefundModal
      :showModal.sync="applyRefundModalVisible"
      :orderNo="orderNo"
      @ok="applyRefundOk"
    ></applyRefundModal>
  </div>
</template>

<script>
import showDetailModal from "./showDetailModal";
import applyRefundModal from "./applyRefundModal";
import { postRequest, getRequest, getSyncRequest } from "@/libs/axios";
import * as order from "@/api/order";
const tableColumns = [
  {
    title: "操作",
    width: 200,
    align: "center",
    slot: "action",
    fixed: "left",
  },
  {
    title: "订单编号",
    width: 160,
    key: "orderNo",
  },
  {
    title: "订单状态",
    width: 120,
    align: "center",
    key: "statusStr",
  },
  {
    title: "券码状态",
    width: 120,
    align: "center",
    key: "couponTemplateTypeStr",
  },

  {
    title: "优惠券ID",
    width: 180,
    align: "center",
    key: "couponId",
  },
  {
    title: "优惠券标题",
    width: 200,
    key: "couponTitle",
  },
  // {
  //   title: "所属商户",
  //   minWidth: 250,
  //   key: "merchantName",
  // },
  {
    title: "数量",
    minWidth: 100,
    key: "amount",
  },
  {
    title: "单价",
    width: 100,
    align: "center",
    key: "price",
  },
  {
    title: "总价",
    width: 100,
    key: "totalPrice",
  },
  {
    title: "U贝抵扣",
    minWidth: 100,
    key: "ubayDiscount",
  },
  {
    title: "红包抵扣",
    minWidth: 100,
    key: "redEnvelopeDiscount",
  },
  {
    title: "实付款",
    width: 100,
    align: "center",
    key: "realPay",
  },
  {
    title: "买家",
    width: 120,
    key: "phoneNumber",
  },
  {
    title: "付款时间",
    minWidth: 180,
    key: "payTime",
  },
  {
    title: "渠道",
    minWidth: 150,
    key: "source",
  },
];
export default {
  name: "allOrder",
  components: { showDetailModal, applyRefundModal },
  data() {
    return {
      orderNo: null, //订单编号
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static",
      },
      // miniApp: 微信小程序 ios: 苹果app android: 安卓app
      // 1: 待付款 2:已取消 3: 已付款 4: 退款 5: 已完成
      sourceList: [
        { value: "miniApp", label: "微信小程序" },
        { value: "ios", label: "苹果app" },
        { value: "android", label: "安卓app" },
      ],
      //1: 待付款  2:已取消  3: 付款中  4：已付款  5: 退款  6: 已完成
      //全部、待付款、已取消（超时未支付、手动取消）、已付款（全部券码可使用、部分券码可使用）、退款（退款中、已退款、退款失败）、已完成（已全部使用、已全部退款）
      // 1: 待付款  2:已取消  3: 付款中  4：已付款  5: 退款  6: 已完成 )

      // 待付款、已付款（券码未过期、已过期）、已取消、退款中、已退款、退款失败、付款中、已完成
      statusList: [
        { value: "1", label: "待付款" },
        { value: "2", label: "已取消" },
        { value: "3", label: "付款中" },
        { value: "4", label: "已付款" },
        { value: "5", label: "退款" },
        { value: "6", label: "已完成" },
      ],
      TableLoading: false,
      totalSize: 0,
      listData: [],
      addressValue: [],
      selectDataList: [],
      tableColumns: tableColumns,
      refreshData: {},
      searchForm: {
        gmtCreateDate: "",
        gmtCreateEnd: "",
        gmtCreateStart: "",
        verifyTime: "",
        verifyStartTime: "",
        verifyEndTime: "",
        orderNo: "",
        phoneNumber: "",
        source: "",
        status: "",
        current: 1,
        pageSize: 10,
        couponTemplateType: 1,
      },
      current: 1,
      addressData: [],
      TokerViewDialogVisible: false,
      DownViewDialogVisible: false,
      showViewDialogVisible: false,
      applyRefundModalVisible: false,
    };
  },
  methods: {
    search() {
      this.searchForm.pageNum = 1;
      this.current = 1;
      this.totalSize = 0;
      this.loadTableData();
    },
    refech() {
      this.loadTableData();
    },
    reset() {
      this.$refs["searchForm"].resetFields();
      this.searchForm.gmtCreateDate = "";
      this.searchForm.gmtCreateEnd = "";
      this.searchForm.gmtCreateStart = "";
      this.searchForm.verifyTime = "";
      this.searchForm.verifyStartTime = "";
      this.searchForm.verifyEndTime = "";
      this.searchForm.orderNo = "";
      this.searchForm.phoneNumber = "";
      this.searchForm.source = "";
      this.searchForm.status = "";
      this.searchForm.couponTemplateType = 1;
      this.current = 1;
      this.search();
    },
    loadTableData() {
      this.listData = [];
      this.TableLoading = true;
      postRequest(
        `/trade/fund/account/order/page?pageNum=${this.searchForm.pageNum || 1}&pageSize=10`,
        this.searchForm
      ).then(res => {
        this.TableLoading = false;
        if (res.code === "200") {
          this.totalSize = res.data.total;
          this.listData = res.data.records;
        } else {
          this.$Message.error("获取数据失败");
        }
      });
    },
    showDetail(row) {
      this.showViewDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["showDetailModal"].resetRow(row);
      });
    },
    // 申请退款
    applyRefund(row) {
      this.orderNo = row.orderNo;
      this.applyRefundModalVisible = true;
    },
    applyRefundOk() {
      this.search();
    },
    // 下载订单
    downExcel() {
      let gmtCreateStart = this.searchForm.gmtCreateStart;
      let gmtCreateEnd = this.searchForm.gmtCreateEnd;
      if (gmtCreateStart && gmtCreateEnd) {
        let day = Math.round(
          (new Date(`${gmtCreateEnd} 23:59:59`).getTime() - new Date(`${gmtCreateStart} 00:00:00`).getTime()) / 86400000
        );
        if (day > 31) {
          this.$Message.error("请选择需要下载的订单数据，单次做多导出1个月的订单");
          return;
        }
      }else{
        this.$Message.error("请选择需要下载的订单数据，单次做多导出1个月的订单");
        return;
      }

      order.orderDownload(this.searchForm).then(res => {
        if (res.code == 500) {
          this.$Message.error(res.msg || '');
          return;
        };
        const content = res.data;
        let fileName = res.headers["filename"];
        const blob = new Blob([content], {
          type: "application/vnd.ms-excel",
        });
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = decodeURI(fileName);
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    changeCurrent(current) {
      if (this.searchForm.pageNum != current) {
        this.searchForm.pageNum = current;
        this.loadTableData();
      }
    },
    closeTab(e) {
      this.TokerViewDialogVisible = false;
      this.DownViewDialogVisible = false;
      this.showViewDialogVisible = false;
    },
    close() {
      this.$emit("close", false);
    },
  },
  created() {
    this.search();
  },
};
</script>

<style scoped>
/* .operation {
  margin-bottom: 2vh;
} */
</style>
