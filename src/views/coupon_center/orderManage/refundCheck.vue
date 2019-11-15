<template>
  <div style="height: 100%">
    <div v-if="!showViewDialogVisible" style="min-height: 100%">
      <Card style="height: 100%">
        <div>
          <Card :bordered="false" style="margin-bottom:2px">
            <Form
              ref="searchForm"
              label-position="right"
              :label-width="100"
              :model="searchForm"
              inline
            >
              <RadioGroup
                v-model="searchForm.auditStatus"
                @on-change="changeRadio"
                style="width: 100%;margin: 10px;"
              >
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
              <FormItem label="领取人手机：" span="24" style="width:25%">
                <Input v-model="searchForm.phoneNumber" placeholder="请填写领取人手机" />
              </FormItem>
              <FormItem label="订单号：" span="24" style="width:25%">
                <Input v-model="searchForm.orderNo" placeholder="请填写订单号" />
              </FormItem>
              <FormItem label="退款申请时间：" span="35" style="width:40%">
                <DatePicker
                  :value="searchForm.applyRefundTimeStart"
                  type="date"
                  placeholder
                  style="width: 48%"
                  :options="options1"
                  @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
                ></DatePicker>
                <div style="width: 2%;display: inline-block"></div>
                <DatePicker
                  :value="searchForm.applyRefundTimeEnd"
                  type="date"
                  placeholder
                  style="width: 48%"
                  :options="options2"
                  @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
                ></DatePicker>
              </FormItem>
              <FormItem span="20" :label-width="1" style="width:23%">
                <Button
                  type="primary"
                  class="submit"
                  icon="ios-search"
                  @click="search('searchForm')"
                  style="margin-right: 5px"
                >搜索</Button>
                <!--<Button type="primary" icon="ios-search" @click="search">搜索</Button>-->
                <Button icon="md-refresh" @click="reset">重置</Button>
              </FormItem>
            </Form>
          </Card>
          <Card>
            <Row class="operation">
              <Button type="primary" @click="checkModal" v-if="searchForm.auditStatus=='1'">批量审核</Button>
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
                  <Button
                    type="info"
                    style="margin-right: 5px"
                    size="small"
                    @click="showDetail(row)"
                  >查看详情</Button>
                  <Button
                    type="info"
                    style="margin-right: 5px"
                    size="small"
                    v-if="searchForm.auditStatus=='1'"
                    @click="oneCheck(row)"
                  >审核</Button>
                </template>
                <template slot-scope="{ row }" slot="log">
                  <Button
                    type="info"
                    style="margin-right: 5px"
                    size="small"
                    @click="showLog(row)"
                  >审核日志</Button>
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
    <Modal title="Title" v-model="showCheck" @on-ok="check" :styles="{top: '20px'}">
      <Form>
        <RadioGroup v-model="checkData.auditStatus" style="width: 100%;margin: 10px;">
          <Radio label="2">
            <span>通过</span>
          </Radio>
          <Radio label="3">
            <span>不通过</span>
          </Radio>
        </RadioGroup>
        <FormItem label="备注：" span="24" :labelWidth="80">
          <Input v-model="checkData.remark" type="textarea" :rows="4" placeholder="请输入备注" />
        </FormItem>
      </Form>
    </Modal>
   
    <checkModal
      ref="showDetailModal"
      :viewDialogVisible="showViewDialogVisible"
      @setViewDialogVisible="closeTab"
    ></checkModal>
    <Modal v-model="showLogModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">审核日志</p>
      <div style="text-align:center">
        <Table
          :loading="TableLoading"
          border
          :columns="tableColumnsLog"
          :data="logData"
          ref="tableLog"
        ></Table>
      </div>
      <div slot="footer">
        <Button type="error" @click="showLogModal=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import checkModal from "./checkModal";
import { postRequest, getRequest, getSyncRequest } from "@/libs/axios";
export default {
  name: "refundCheck",
  components: { checkModal },
  data() {
    return {
      showLogModal: false,
      showCheck: false,
      // mini: 微信小程序 IOS: 苹果app Android: 安卓app
      // 1: 待付款 2:已取消 3: 已付款 4: 退款 5: 已完成
      sourceList: [
        { value: "mini", label: "微信小程序" },
        { value: "IOS", label: "苹果app" },
        { value: "Android", label: "安卓app" }
      ],
      statusList: [
        { value: "1", label: "待付款" },
        { value: "2", label: "已取消" },
        { value: "3", label: "已付款" },
        { value: "4", label: "退款" },
        { value: "5", label: "已完成" }
      ],
      TableLoading: false,
      totalSize: 0,
      listData: [],
      logData: [],
      addressValue: [],
      selectDataList: [],
      checkData: {
        auditStatus: "2"
      },
      tableColumnsLog: [
        {
          title: "审核人",
          width: 200,
          key: "auditUser"
        },
        {
          title: "审核时间",
          width: 200,
          key: "auditTime"
        },
        {
          title: "审核结果",
          width: 200,
          key: "auditResult"
        },
        {
          title: "审核备注",
          width: 200,
          key: "remark"
        }
      ],
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "操作",
          width: 200,
          align: "center",
          slot: "action"
        },
        {
          title: "订单编号",
          width: 200,
          key: "orderNo"
        },
        {
          title: "优惠券ID",
          width: 200,
          align: "center",
          key: "couponId"
        },
        {
          title: "优惠券标题",
          width: 200,
          key: "couponTitle"
        },
        {
          title: "所属商户",
          minWidth: 250,
          key: "merchantName"
        },
        {
          title: "数量",
          minWidth: 150,
          key: "amount"
        },
        {
          title: "单价",
          width: 100,
          align: "center",
          key: "price"
        },
        {
          title: "总价",
          width: 100,
          key: "totalPrice"
        },
        {
          title: "U贝抵扣",
          minWidth: 250,
          key: "ubayDiscount"
        },
        {
          title: "红包抵扣",
          minWidth: 150,
          key: "redEnvelopeDiscount"
        },
        {
          title: "实付款",
          width: 100,
          align: "center",
          key: "realPay"
        },
        {
          title: "买家",
          width: 100,
          key: "phoneNumber"
        },
        {
          title: "付款时间",
          minWidth: 250,
          key: "payTime"
        },
        {
          title: "渠道",
          minWidth: 150,
          key: "source"
        },
        {
          title: "审核日志",
          minWidth: 150,
          slot: "log"
        }
      ],
      selectDataList: [],
      searchForm: {
        auditStatus: "1",
        applyRefundTimeEnd: "",
        applyRefundTimeStart: "",
        orderNo: "",
        phoneNumber: "",
        current: 1,
        pageSize: 10
      },
      current: 1,
      addressData: [],
      options2: {},
      options1: {},
      TokerViewDialogVisible: false,
      DownViewDialogVisible: false,
      showViewDialogVisible: false
    };
  },
  methods: {
    changeDateTime(datetime, index) {
      switch (index) {
        case 1:
          this.searchForm.applyRefundTimeStart = datetime;
          this.options2 = {
            disabledDate(date) {
              return date.valueOf() < new Date(datetime) - 1000 * 60 * 60 * 24;
            }
          };
          break;
        case 2:
          this.searchForm.applyRefundTimeEnd = datetime;
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
    search() {
      this.searchForm.current = 1;
      this.current = 1;
      this.loadTableData();
    },
    reset() {
      this.searchForm.applyRefundTimeEnd = "";
      this.searchForm.applyRefundTimeStart = "";
      this.searchForm.orderNo = "";
      this.searchForm.phoneNumber = "";
      this.searchForm.auditStatus = "1";
      this.searchForm.current = 1;
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
      postRequest(
        `/trade/fund/account/order/orderRefundPage?pageNum=${page ||
          1}&pageSize=10`,
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
    checkModal() {
      if (!this.selectDataList.length) {
        this.$Message.error("请选择审核数据");
        return;
      }
      this.showCheck = true;
    },
    showLog(row) {
      postRequest(`/trade/fund/account/order/batchAudit`, {
        orderRefundId: row.id
      }).then(res => {
        this.TableLoading = false;
        if (res.code === "200") {
          this.logData = res.data || [];
        } else {
          this.$Message.error("获取数据失败");
        }
      });
    },
    check() {
      var arr = [];
      this.selectDataList.forEach(function(v, i) {
        arr.push({ orderRefundId: v.id });
      });
      // /trade/fund/account/order/batchAudit
      this.checkData.data = arr;
      postRequest(`/trade/fund/account/order/batchAudit`, this.checkData).then(
        res => {
          this.TableLoading = false;
          if (res.code === "200") {
            this.search();
          } else {
            this.$Message.error("获取数据失败");
          }
        }
      );
    },
    showDetail(row) {
      this.showViewDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["showDetailModal"].resetRow(row);
      });
    },
    oneCheck(row) {
      this.showViewDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["showDetailModal"].resetRow(row);
      });
    },
    changeCurrent(current) {
      if (this.searchForm.current != current) {
        this.searchForm.current = current;
        this.loadTableData(current);
      }
    },
    closeTab(e) {
      this.showViewDialogVisible = false;
      this.loadTableData();
    },
    close() {
      this.$emit("close", false);
    }
  },
  created() {
    this.reset();
  }
};
</script>

<style scoped>
.operation {
  margin-bottom: 2vh;
}
</style>
