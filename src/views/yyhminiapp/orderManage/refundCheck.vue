<template>
  <div style="height: 100%">
    <div style="min-height: 100%">
      <Card style="height: 100%">
        <div>
          <Card :bordered="false" style="margin-bottom:2px">
            <Form ref="searchForm" label-position="right" :label-width="100" :model="searchForm" inline>
              <RadioGroup v-model="searchForm.auditStatus" @on-change="changeRadio" style="width: 100%;margin: 10px;">
                <Radio label="1">
                  <span>待审核</span>
                </Radio>
                <Radio label="2">
                  <span>审核成功</span>
                </Radio>
                <Radio label="3">
                  <span>审核失败</span>
                </Radio>
              </RadioGroup>
              <FormItem label="领取人手机：" span="24">
                <Input v-model="searchForm.phoneNumber" placeholder="请填写领取人手机" />
              </FormItem>
              <FormItem label="订单号：" span="24" :label-width="70">
                <Input v-model="searchForm.orderNo" placeholder="请填写订单号" />
              </FormItem>
              <FormItem label="退款申请时间：" :label-width="120">
                <!-- <DatePicker
                  :value="searchForm.applyRefundTimeStart"
                  type="date"
                  placeholder="选择开始退款申请时间"
                  style="width: 48%"
                  :options="options1"
                  @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                ></DatePicker>
                <div style="width: 2%;display: inline-block"></div>
                <DatePicker
                  :value="searchForm.applyRefundTimeEnd"
                  type="date"
                  placeholder="选择结束退款申请时间"
                  style="width: 48%"
                  :options="options2"
                  @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                ></DatePicker> -->

                <DatePicker
                  type="daterange"
                  v-model="searchForm.applyRefundTimeDate"
                  placeholder="选择退款申请时间"
                  @on-change="[searchForm.applyRefundTimeStart, searchForm.applyRefundTimeEnd] = $event"
                ></DatePicker>
              </FormItem>
              <FormItem span="20" :label-width="1" style="width:23%">
                <Button
                  type="primary"
                  class="submit"
                  icon="ios-search"
                  @click="search('searchForm')"
                  style="margin-right: 5px"
                  >搜索</Button
                >
                <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                <Button icon="md-refresh" @click="reset">重置</Button>
              </FormItem>
            </Form>
          </Card>
          <Card>
            <Row class="operation">
              <Button type="primary" @click="checkModal" v-if="searchForm.auditStatus == '1'">批量审核</Button>
              <!--<span v-if="refreshData&&refreshData.allOrderCount">总共{{refreshData.allOrderCount}}单，待付款{{refreshData.pendingPaymentOrderCount}}单，已付款{{refreshData.paidOrderCount}}单，已取消{{refreshData.cancelledOrderCount}}单，退款{{refreshData.refundOrderCount}}单</span>-->
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
                @on-selection-change="handleSelect"
              >
                <template slot-scope="{ row }" slot="action">
                  <Button type="info" style="margin-right: 5px" size="small" @click="oneCheck(row, 'detail')"
                    >查看详情</Button
                  >
                  <Button
                    type="info"
                    style="margin-right: 5px"
                    size="small"
                    v-if="searchForm.auditStatus == '1'"
                    @click="oneCheck(row, 'audit')"
                    >审核</Button
                  >
                </template>
                <template slot-scope="{ row }" slot="log">
                  <Button type="info" style="margin-right: 5px" size="small" @click="showLog(row)">审核日志</Button>
                </template>
              </Table>
            </Row>
            <!-- 分页 -->
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
      </Card>
    </div>
    <Modal title="批量审核" v-model="showCheck" :styles="{ top: '20px' }" @on-cancel="closeAuditModal">
      <Form ref="form" :model="checkData" label-position="right" :label-width="120">
        <FormItem label="审核结果：" prop="status">
          <RadioGroup v-model="checkData.auditStatus">
            <Radio label="2">
              <span>通过</span>
            </Radio>
            <Radio label="3">
              <span>不通过</span>
            </Radio>
          </RadioGroup>
          <div>
            <p style="color:red;">退款申请过后，退款将原路退回用户账户，请谨慎操作！</p>
          </div>
        </FormItem>
        <FormItem label="备注：" prop="remark" :rules="{ required: true, validator: validateRemark }">
          <Row>
            <Col span="16">
              <Tooltip trigger="focus" title="提醒" content="最多100个汉字" placement="right">
                <Input
                  v-model.trim="checkData.remark"
                  type="textarea"
                  style="width:300px"
                  :rows="4"
                  placeholder="请输入备注"
                />
              </Tooltip>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="error" @click="check('form')" :loading="auditLoading">确认</Button>
        <Button @click="cancelHandleReset('form')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>

    <Drawer v-model="showDetail" :closable="true" :mask-closable="true" width="700" :styles="styles">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>{{ title }}</span>
      </p>
      <checkModal ref="showDetailModal" :showDetail.sync="showDetail" @refresh="closeTab"></checkModal>
    </Drawer>
    <Modal v-model="showLogModal" width="700">
      <p slot="header" style="color:#f60;text-align:center">审核日志</p>
      <div style="text-align:center">
        <Table :loading="TableLoading" border :columns="tableColumnsLog" :data="logData" ref="tableLog"></Table>
      </div>
      <div slot="footer">
        <Button type="error" @click="showLogModal = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import checkModal from "./checkModal";
import { postRequest } from "@/libs/axios";
import * as order from "@/api/order";
const tableColumnsLog = [
  {
    title: "审核人",
    width: 160,
    key: "auditUser",
    align: "center",
  },
  {
    title: "审核时间",
    width: 180,
    key: "auditTime",
    align: "center",
  },
  {
    title: "审核结果",
    key: "auditResult",
    align: "center",
  },
  {
    title: "审核备注",
    key: "remark",
    align: "center",
  },
];

const tableColumns = [
  {
    type: "selection",
    width: 60,
    align: "center",
  },
  {
    title: "操作",
    width: 200,
    align: "center",
    slot: "action",
  },
  {
    title: "订单编号",
    width: 200,
    key: "orderNo",
  },
  {
    title: "退款原因",
    width: 200,
    align: "center",
    key: "refundReason",
  },
  // {
  //   title: "券码状态",
  //   width: 200,
  //   key: 'barCodeStatus'
  // },
  {
    title: "退款金额",
    width: 200,
    align: "right",
    key: "realRefundMoney",
  },
  {
    title: "优惠券ID",
    width: 200,
    align: "center",
    key: "couponId",
  },
  {
    title: "优惠券标题",
    width: 200,
    align: "center",
    key: "couponTitle",
  },
  // {
  //   title: "所属商户",
  //   minWidth: 250,
  //   align: "center",
  //   key: "merchantName",
  // },
  {
    title: "数量",
    minWidth: 150,
    align: "right",
    key: "amount",
  },
  {
    title: "单价",
    width: 100,
    align: "right",
    key: "price",
  },
  {
    title: "总价",
    width: 100,
    align: "right",
    key: "totalPrice",
  },
  {
    title: "U贝抵扣",
    minWidth: 100,
    align: "right",
    key: "ubayDiscount",
  },
  {
    title: "红包抵扣",
    minWidth: 150,
    align: "right",
    key: "redEnvelopeDiscount",
  },
  {
    title: "实付款",
    width: 100,
    align: "right",
    key: "realPay",
  },
  {
    title: "买家",
    width: 120,
    align: "center",
    key: "phoneNumber",
  },
  {
    title: "付款时间",
    minWidth: 250,
    align: "center",
    key: "payTime",
  },
  {
    title: "渠道",
    minWidth: 150,
    key: "source",
  },
  {
    title: "审核日志",
    minWidth: 150,
    slot: "log",
  },
];

export default {
  name: "refundCheck",
  components: { checkModal },
  data() {
    return {
      showLogModal: false,
      showCheck: false,
      auditLoading: false,

      // mini: 微信小程序 IOS: 苹果app Android: 安卓app
      // 1: 待付款 2:已取消 3: 已付款 4: 退款 5: 已完成
      sourceList: [
        { value: "mini", label: "微信小程序" },
        { value: "IOS", label: "苹果app" },
        { value: "Android", label: "安卓app" },
      ],
      statusList: [
        { value: "1", label: "待付款" },
        { value: "2", label: "已取消" },
        { value: "3", label: "已付款" },
        { value: "4", label: "退款" },
        { value: "5", label: "已完成" },
      ],
      TableLoading: false,
      totalSize: 0,
      listData: [],
      logData: [],
      addressValue: [],
      selectDataList: [],
      checkData: {
        auditStatus: "2",
        remark: "",
      },
      tableColumnsLog: tableColumnsLog,
      tableColumns: tableColumns,
      selectDataList: [],
      searchForm: {
        auditStatus: "1",
        applyRefundTimeDate: "",
        applyRefundTimeEnd: "",
        applyRefundTimeStart: "",
        orderNo: "",
        phoneNumber: "",
        current: 1,
        pageSize: 10,
        couponTemplateType: 1,
      },
      current: 1,
      addressData: [],
      // options2: {},
      // options1: {},
      TokerViewDialogVisible: false,
      DownViewDialogVisible: false,
      title: "详情", //"详情":"审核";
      showDetail: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static",
      },
    };
  },
  methods: {
    // changeDateTime(datetime, index) {
    //   switch (index) {
    //     case 1:
    //       this.searchForm.applyRefundTimeStart = datetime;
    //       this.options2 = {
    //         disabledDate(date) {
    //           return date.valueOf() < new Date(datetime) - 1000 * 60 * 60 * 24;
    //         }
    //       };
    //       break;
    //     case 2:
    //       this.searchForm.applyRefundTimeEnd = datetime;
    //       this.options1 = {
    //         disabledDate(date) {
    //           return (
    //             date.valueOf() < Date.now() - 1000 * 60 * 60 * 24 ||
    //             date.valueOf() > new Date(datetime)
    //           );
    //         }
    //       };
    //       break;
    //   }
    // },
    search() {
      this.searchForm.current = 1;
      this.current = 1;
      this.loadTableData();
    },
    reset() {
      this.$refs["searchForm"].resetFields();
      this.searchForm.applyRefundTimeDate = "";
      this.searchForm.applyRefundTimeEnd = "";
      this.searchForm.applyRefundTimeStart = "";
      this.searchForm.orderNo = "";
      this.searchForm.phoneNumber = "";
      this.searchForm.auditStatus = "1";
      this.searchForm.current = 1;
      this.searchForm.couponTemplateType = 1;
      this.current = 1;
      this.loadTableData();
    },
    handleSelect(selection, index) {
      this.selectDataList = selection;
    },
    changeRadio() {
      this.search();
    },
    loadTableData(page) {
      this.searchForm.current = page || 1;
      this.searchForm.pageNum = page || 1;
      this.totalSize = 0;
      this.listData = [];
      this.TableLoading = true;
      postRequest(`/trade/fund/account/order/orderRefundPage?pageNum=${page || 1}&pageSize=10`, this.searchForm).then(
        res => {
          this.TableLoading = false;
          if (res.code === "200") {
            this.totalSize = res.data.total;
            this.listData = res.data.records;
          } else {
            this.$Message.error("获取数据失败");
          }
        }
      );
    },
    checkModal() {
      if (!this.selectDataList.length) {
        this.$Message.error("请选择审核数据");
        return;
      }
      this.showCheck = true;
      console.log(11111, this.showCheck);
    },
    async showLog(row) {
      this.showLogModal = true;
      const url = `/trade/fund/account/order/auditLog/${row.id}`;
      let { code, msg, data } = await postRequest(url);
      this.TableLoading = false;
      if (code === "200") {
        this.logData = data || [];
      } else {
        this.$Message.error(msg);
      }
    },
    check(name) {
      this.$refs[name].validate(async valid => {
        if (!valid) return;
        this.auditLoading = true;
        var arr = this.selectDataList.map(item => ({ orderRefundId: item.id }));
        // /trade/fund/account/order/batchAudit
        this.checkData.data = arr;
        const { code, msg } = await order.orderBatchAudit(this.checkData);
        this.auditLoading = false;
        if (code === "200") {
          this.$Message.error("审核成功");

          this.selectDataList = [];
          this.showCheck = false;
          this.cancelHandleReset(name);
          this.search();
        } else {
          this.$Message.error(msg);
        }
      });
    },
    closeAuditModal() {
      this.cancelHandleReset("form");
    },
    cancelHandleReset(name) {
      this.$nextTick(() => {
        this.$refs[name].resetFields();
        this.showCheck = false;
      });
    },
    validateRemark(rule, value, callback) {
      value += "";
      value = value.trim();
      if (value == "") {
        callback(new Error("审核内容不能为空"));
      } else if (value.length >= 100) {
        callback(new Error("请输入100字以内的字符"));
      } else {
        callback();
      }
    },
    oneCheck(row, action) {
      this.title = action == "detail" ? "详情" : "审核";
      this.showDetail = true;
      this.$nextTick(() => {
        this.$refs["showDetailModal"].resetRow(row, action);
      });
    },
    changeCurrent(current) {
      if (this.searchForm.current != current) {
        this.searchForm.current = current;
        this.loadTableData(current);
      }
    },
    closeTab(e) {
      this.loadTableData();
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
.operation {
  margin-bottom: 2vh;
}
</style>
