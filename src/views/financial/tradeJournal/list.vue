<template>
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="订单号" prop="orderNo">
          <Input v-model="searchForm.orderNo" placeholder="请输入订单号" style="width: 200px" />
        </Form-item>
        <Form-item label="微信单号" prop="tradeNo">
          <Input v-model="searchForm.tradeNo" placeholder="请输入微信单号" style="width: 200px" />
        </Form-item>
        <Form-item label="优惠卷ID" prop="couponName">
          <Input v-model="searchForm.couponName" placeholder="请输入微信单号" style="width: 200px" />
        </Form-item>
        <Form-item label="品牌名称" prop="brandName">
          <Input v-model="searchForm.brandName" placeholder="请输入品牌名称" style="width: 200px" />
        </Form-item>
        <Form-item label="商户名称" prop="merchantName">
          <Input v-model="searchForm.merchantName" placeholder="请输入商户名称" style="width: 200px" />
        </Form-item>

        <Form-item label="支付方式" prop="payType">
          <Select v-model="searchForm.payType" placeholder="请选择支付方式" clearable style="width: 200px;">
            <Option value="">全部</Option>
            <Option value="1">微信</Option>
            <Option value="2">支付宝</Option>
          </Select>
        </Form-item>
        <Form-item label="交易类型" prop="tradeType">
          <Select v-model="searchForm.tradeType" placeholder="请选择交易类型" clearable style="width: 200px;">
            <Option value="">全部</Option>
            <Option value="1">支付</Option>
            <Option value="2">退款</Option>
          </Select>
        </Form-item>

        <FormItem label="交易时间" prop="datetimerange">
          <DatePicker type="datetimerange" placeholder="请选择交易时间" v-model="searchForm.datetimerange"
            @on-change=" [searchForm.tradeTimeStrat, searchForm.tradeTimeEnd] = $event " style="width: 275px;">
          </DatePicker>
        </FormItem>

        <Form-item class="br">
          <Button @click="search" type="primary" icon="ios-search">搜索</Button>
          <Button @click="resetForm('searchForm')">重置</Button>
        </Form-item>
      </Form>
    </Card>
    <Card style="margin-top: 1vh;">
      <!-- 用户列表 -->
      <Table :loading="TableLoading" border :columns="tableColumns" :data="table_list" sortable="custom" ref="table">

      </Table>
      <!-- 用户列表 -->
      <!-- 分页 -->
      <Row type="flex" justify="end" class="page">
        <Page :total="totalSize" show-total show-elevator @on-change="changeCurrent" style="float: right"
          :current.sync="current"></Page>
      </Row>
      <!-- 分页 -->
    </Card>

  </div>
</template>
<script>
  const columns = [{
      title: "订单号",
      width: 190,
      align: "center",
      key: 'orderNo'
    },
    {
      title: "微信单号",
      width: 190,
      align: "center",
      key: 'tradeNo'
    },
    {
      title: "优惠卷ID",
      width: 190,
      align: "center",
      key: 'couponId'
    },
    {
      title: "优惠卷名称",
      width: 190,
      align: "center",
      key: 'couponName'
    },
    {
      title: "数量",
      width: 190,
      align: "right",
      key: 'couponCount'
    },
    {
      title: "品牌名称",
      width: 190,
      align: "center",
      key: 'brandName'
    },
    {
      title: "商户名称",
      width: 190,
      align: "center",
      key: 'merchantName'
    },
    {
      title: "交易金额（元）",
      width: 190,
      align: "right",
      key: 'orderAmount'
    },
    {
      title: "支付通消费（元）",
      width: 190,
      align: "right",
      key: 'payChannelFee'
    },
    {
      title: "平台分账含通消费（元）",
      width: 190,
      align: "right",
      key: 'totalFee'
    },
    {
      title: "商户分账（元）",
      width: 190,
      align: "right",
      key: 'paidAmount'
    },
    {
      title: "支付方式",
      width: 190,
      align: "center",
      key: 'payType'
    },
    {
      title: "交易类型",
      width: 190,
      align: "center",
      key: 'tradeType'
    },
    {
      title: "交易时间",
      width: 190,
      align: "center",
      key: 'tradeTime'
    },
  ]

  import {
    billTransactionFlowList
  } from '@/api/financial'

  export default {
    data() {
      return {
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          datetimerange: '',
          orderNo: '',
          merchantName: '',
          brandName: '',
          tradeNo: '',
          couponId: '',
          payType: '',
          tradeType: '',
          tradeTimeStrat: '',
          tradeTimeEnd: ''
        },

        current: 1,
        totalSize: 0, //总条数
        // pageNum: 1, //开始条数
        TableLoading: false,
        table_list: [],
        tableColumns: columns,
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 刷新
      search() {
        this.searchForm.pageNum = 1;
        this.getList()
      },
      getList() {
        this.TableLoading = true;
        let body = {
          ...this.searchForm
        }
        delete body.datetimerange
        billTransactionFlowList(body).then(res => {
          this.TableLoading = false;
          if (res && res.code == 200) {
            this.table_list = res.data.records
            this.totalSize = res.data.total
          } else {
            this.$Message.error(res.msg);
          }
        })
      },
      changeCurrent(current) {
        this.searchForm.pageNum = current;
        this.getList();
      },
      // 重置form表单
      resetForm(name) {
        this.$refs[name].resetFields();
        this.searchForm.tradeTimeStrat = '';
        this.searchForm.tradeTimeEnd = '';
        if (name == "searchForm") {

        }
      },
    },
  }

</script>
<style lang="less" scoped>
  .operation {
    margin-bottom: 2vh;
  }

  .page {
    margin-top: 2vh;
  }

</style>
