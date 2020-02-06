<template>
  <!-- 商超 -->
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
        <Form-item label="订单号" prop="orderNo">
          <Input clearable v-model="searchForm.orderNo" placeholder="请输入订单号" style="width: 200px" />
        </Form-item>
        <Form-item label="微信单号" prop="tradeNo">
          <Input clearable v-model="searchForm.tradeNo" placeholder="请输入微信单号" style="width: 200px" />
        </Form-item>
        <Form-item label="优惠券ID" prop="couponId">
          <Input
            clearable
            v-model="searchForm.couponId"
            placeholder="请输入优惠券ID"
            style="width: 200px"
          />
        </Form-item>
        <!-- <Form-item label="品牌名称" prop="brandName">
          <Input clearable v-model="searchForm.brandName" placeholder="请输入品牌名称" style="width: 200px" />
        </Form-item>-->
        <Form-item label="零售商名称" prop="venderName">
          <Input
            clearable
            v-model="searchForm.venderName"
            placeholder="请输入零售商名称"
            style="width: 200px"
          />
        </Form-item>

        <Form-item label="支付方式" prop="payType">
          <Select
            v-model="searchForm.payType"
            placeholder="请选择支付方式"
            clearable
            style="width: 200px;"
          >
            <Option :value="0">全部</Option>
            <Option :value="1">微信小程序</Option>
            <Option :value="2">微信app</Option>
          </Select>
        </Form-item>
        <Form-item label="交易类型" prop="tradeType">
          <Select
            v-model="searchForm.tradeType"
            placeholder="请选择交易类型"
            clearable
            style="width: 200px;"
          >
            <Option value>全部</Option>
            <Option value="1">支付</Option>
            <Option value="2">退款</Option>
          </Select>
        </Form-item>

        <FormItem label="交易时间" prop="datetimerange">
          <DatePicker
            transfer
            type="datetimerange"
            placeholder="请选择交易时间"
            v-model="searchForm.datetimerange"
            @on-change=";[searchForm.tradeTimeStrat, searchForm.tradeTimeEnd] = $event"
            style="width: 275px;"
          ></DatePicker>
        </FormItem>

        <Form-item class="br">
          <Button @click="search" type="primary" icon="ios-search">搜索</Button>
          <Button @click="resetForm('searchForm')">重置</Button>
          <Button type="primary" icon="ios-cloud-download-outline" @click="downLoad">下载</Button>
        </Form-item>
      </Form>
    </Card>
    <Card style="margin-top: 1vh;">
      <!-- 用户列表 -->
      <Table
        :loading="TableLoading"
        border
        :columns="tableColumns"
        :data="table_list"
        sortable="custom"
        ref="table"
      >
        <template slot-scope="{ row }" slot="brandIdStr">
          <p>{{ row.brandIdStr || '--' }}</p>
        </template>
      </Table>
      <!-- 用户列表 -->
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
      <!-- 分页 -->
    </Card>
  </div>
</template>
<script>
import { businessColumns as columns } from "./columns";
import { billTransactionFlowList } from "@/api/financial";
import { downloadSteam } from "@/libs/axios";
export default {
  data() {
    return {
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        datetimerange: "",
        orderNo: "",
        venderName: "",
        brandName: "",
        tradeNo: "",
        couponId: "",
        payType: 0,
        tradeType: "",
        tradeTimeStrat: "",
        tradeTimeEnd: "",
      },

      current: 1,
      totalSize: 0, //总条数
      // pageNum: 1, //开始条数
      TableLoading: false,
      table_list: [],
      tableColumns: columns,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 刷新
    search() {
      this.searchForm.pageNum = 1;
      this.getList();
    },
    getList() {
      this.TableLoading = true;
      let body = JSON.parse(JSON.stringify(this.searchForm));
      delete body.datetimerange;
      this.postRequest("/trade/merchant/bill/transaction/business/list", body).then(res => {
        this.TableLoading = false;
        if (res && res.code == 200) {
          if (res.data.records instanceof Array) {
            res.data.records.forEach(item => {
              item.orderAmount = this.division100(item.orderAmount || 0);
              item.payChannelFee = this.division100(item.payChannelFee || 0);
              item.totalFee = this.division100(item.totalFee || 0);
              item.paidAmount = this.division100(item.paidAmount || 0);
            });
          }
          this.table_list = res.data.records;
          this.totalSize = res.data.total;
        } else {
          this.table_list = [];
          this.totalSize = 0;
          this.$Message.error(res.msg);
        }
      });
    },
    changeCurrent(current) {
      this.searchForm.pageNum = current;
      this.getList();
    },
    // 重置form表单
    resetForm(name) {
      this.$refs[name].resetFields();
      this.searchForm.tradeTimeStrat = "";
      this.searchForm.tradeTimeEnd = "";
      if (name == "searchForm") {
        this.search();
      }
    },
    division100(n) {
      let num = String(n);
      let arr = num.split(/\./);
      if (arr.length == 2) {
        if (arr[1].length < 2) {
          arr[1] = arr[1].padEnd(2, "0");
        }
        return arr.join(".");
      } else {
        return `${num}.00`;
      }
    },
    async downLoad() {
      //如导出的内容超出5000条记录，弹出提示框信息"一次性最多只能导出5000条记录"
      if (this.totalSize > 5000) {
        this.$Message.error("一次性最多只能导出5000条记录");
        return false;
      }
      const {
        searchForm: {
          pageNum,
          pageSize,
          datetimerange,
          orderNo,
          merchantName,
          brandName,
          tradeNo,
          couponId,
          payType,
          tradeType,
          tradeTimeStrat,
          tradeTimeEnd,
          venderName,
        },
      } = this;
      let params = {
        brandName: brandName,
        couponId: couponId,
        couponType: 2,
        orderNo: orderNo,
        pageNum: pageNum,
        pageSize: pageSize,
        payType: payType,
        tradeNo: tradeNo,
        tradeTimeStrat: tradeTimeStrat,
        tradeTimeEnd: tradeTimeEnd,
        tradeType: tradeType,
        venderName: venderName,
      };
      const res = await downloadSteam("/trade/merchant/bill/transaction/business/download", params);
      const content = res;

      //const { filename } = res.headers;
      const blob = new Blob([content], { type: "application/vnd.ms-excel" });

      const filename = "商超交易流水.csv";
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
        navigator.msSaveBlob(blob, "商超交易流水");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.operation {
  margin-bottom: 2vh;
}

.page {
  margin-top: 2vh;
}
</style>
