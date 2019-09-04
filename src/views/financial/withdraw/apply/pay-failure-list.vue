<template>
  <Row>
    <Form ref="searchForm" :label-width="80" :model="searchForm" inline>
      <FormItem label="手机号码">
        <Input v-model="searchForm.phone" placeholder="手机号码" />
      </FormItem>
      <FormItem label="提现时间">
        <DatePicker
          type="date"
          placeholder
          style="width: 160px"
          @on-change="(datetime) =>{ changeDateTime(datetime, 1)}"
        ></DatePicker>--
        <DatePicker
          type="date"
          placeholder
          style="width: 160px"
          @on-change="(datetime) =>{ changeDateTime(datetime, 2)}"
        ></DatePicker>
      </FormItem>

      <FormItem label="提现金额">
        <InputNumber v-model="searchForm.applyAmountRangeOpen"></InputNumber>--
        <InputNumber v-model="searchForm.applyAmountRangeClose"></InputNumber>
      </FormItem>
      <FormItem label="提现单号">
        <Input v-model="searchForm.orderNo" placeholder="提现单号" />
      </FormItem>
      <FormItem>
        <ButtonGroup>
          <Button type="primary" class="submit" icon="ios-search" @click="search('searchForm')">搜索</Button>
        </ButtonGroup>
      </FormItem>
    </Form>
    <Row>
      <Table
        :loading="TableLoading"
        border
        :columns="tableColumns"
        :data="listData"
        sortable="custom"
        ref="table"
      ></Table>
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
    <Row>
      <Modal v-model="auditRecordModal" title="审核日志" width="800">
        <Table border :columns="tableAuditRecordColumns" :data="listAuditRecordData"></Table>
      </Modal>
    </Row>
  </Row>
</template>
<script>
import {
  financialWithdrawApplyPayFailureList,
  financialWithdrawApplyAuditRecordList
} from "@/api/sys";
export default {
  data() {
    return {
      TableLoading: false,
      totalSize: 0,
      current: 1,
      listData: [],
      selectDataList: [],
      tableColumnsFilters:[

      ],
      tableColumns: [
        {
          title: "序号",
          type: "index",
          width: 70,
        },
        {
          title: "提现用户",
          key: "realName"
        },
        {
          title: "userId",
          key: "userId"
        },
        {
          title: "手机号码",
          key: "phone"
        },
        {
          title: "提现时间",
          key: "applyDate"
        },
        {
          title: "可提现余额",
          key: "accountBalance"
        },
        {
          title: "申请提现金额",
          key: "amount"
        },
        {
          title: "个税",
          key: "amountFee"
        },
        {
          title: "提现单号",
          key: "orderNo"
        },
        {
          title: "失败原因",
          key: "payFailureReason"
        },
        {
          title: "审核日志",
          key: "operate",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.showAuditList(params.row.id);
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      searchForm: {
        applyDateRangeOpen: null,
        applyDateRangeClose: null,
        phone: null,
        applyAmountRangeOpen: null,
        applyAmountRangeClose: null,
        orderNo: null,
        auditStep: null,
        status:"3",
        current: "1",
        pageSize: "10"
      },
      listAuditRecordData: [],
      auditRecordModal: false,
      tableAuditRecordColumns: [
        {
          title: "时间",
          key: "auditDate"
        },
        {
          title: "审核人",
          key: "auditor"
        },
        {
          title: "审核结果",
          key: "result"
        },
        {
          title: "审核备注",
          key: "remarks"
        }
      ]
    };
  },
  methods: {
    loadTableData(formData) {
      this.totalSize = 0;
      this.listData = [];
      this.TableLoading = true;
      financialWithdrawApplyPayFailureList(formData).then(res => {
        this.TableLoading = false;
        if (res.code === "200") {
          this.totalSize = res.data.total;
          this.listData = res.data.records;
        } else {
          this.msgErr("获取数据失败");
        }
      });
    },
    search() {
      this.searchForm.current = 1;
      this.loadTableData(this.searchForm);
    },
    showAuditList(id) {
      financialWithdrawApplyAuditRecordList(id).then(res => {
        if (res.code === "200") {
          this.auditRecordModal = true;
          this.listAuditRecordData = res.records;
        } else {
          this.msgErr("查询审核日志失败");
        }
      });
    },
    changeCurrent(current) {
      if (this.searchForm.current != current) {
        this.searchForm.current = current;
        this.loadTableData(this.searchForm);
      }
    },
    changeDateTime(datetime, index) {
      switch (index) {
        case 1:
          this.searchForm.applyDateRangeOpen = datetime;
          break;
        case 2:
          this.searchForm.applyDateRangeClose = datetime;
          break;
      }
    },
    msgErr(txt) {
      this.$Message.error({
        content: txt,
        duration: 3
      });
    }
  }
};
</script>
