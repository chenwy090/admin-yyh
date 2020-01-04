<template>
  <div class="label_manage">
    <Card>
      <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
        <Form-item label="订单号" prop="orderNo">
          <Input clearable v-model="searchForm.orderNo" placeholder="请输入订单号" style="width: 200px" />
        </Form-item>
        <Form-item label="微信单号" prop="tradeNo">
          <Input clearable v-model="searchForm.tradeNo" placeholder="请输入微信单号" style="width: 200px" />
        </Form-item>
        <Form-item label="优惠券ID" prop="couponId">
          <Input clearable v-model="searchForm.couponId" placeholder="请输入优惠券ID" style="width: 200px" />
        </Form-item>
        <Form-item label="品牌名称" prop="brandName">
          <Input clearable v-model="searchForm.brandName" placeholder="请输入品牌名称" style="width: 200px" />
        </Form-item>
        <Form-item label="商户名称" prop="merchantName">
          <Input clearable v-model="searchForm.merchantName" placeholder="请输入商户名称" style="width: 200px" />
        </Form-item>

        <Form-item label="支付方式" prop="payType">
          <Select v-model="searchForm.payType" placeholder="请选择支付方式" clearable style="width: 200px;">
            <Option :value="0">全部</Option>
            <Option :value="1">微信小程序</Option>
            <Option :value="2">微信app</Option>
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
          <DatePicker
            transfer
            type="datetimerange"
            placeholder="请选择交易时间"
            v-model="searchForm.datetimerange"
            @on-change=";[searchForm.tradeTimeStrat, searchForm.tradeTimeEnd] = $event"
            style="width: 275px;"
          >
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
        <template slot-scope="{ row }" slot="merchantName">
          <p>{{ row.merchantName || '--' }}</p>
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
const columns = [
  {
    title: '订单号',
    width: 160,
    align: 'center',
    key: 'orderNo',
  },
  {
    title: '微信单号',
    width: 134,
    align: 'center',
    key: 'tradeNo',
  },
  {
    title: '优惠券ID',
    width: 100,
    align: 'center',
    key: 'couponId',
  },
  {
    title: '优惠券名称',
    width: 190,
    align: 'center',
    key: 'couponName',
  },
  {
    title: '数量',
    width: 100,
    align: 'right',
    key: 'couponCount',
  },
  {
    title: '品牌名称',
    width: 190,
    align: 'center',
    key: 'brandName',
  },
  {
    title: '商户名称',
    width: 190,
    align: 'center',
    key: 'merchantName',
    slot: 'merchantName',
  },
  {
    title: '交易金额（元）',
    width: 150,
    align: 'right',
    key: 'orderAmount',
  },
  {
    title: '支付通消费（元）',
    width: 150,
    align: 'right',
    key: 'payChannelFee',
  },
  {
    title: '平台分账含通消费（元）',
    width: 190,
    align: 'right',
    key: 'totalFee',
  },
  {
    title: '商户分账（元）',
    width: 150,
    align: 'right',
    key: 'paidAmount',
  },
  {
    title: '支付方式',
    width: 100,
    align: 'center',
    key: 'payTypeDesc',
  },
  {
    title: '交易类型',
    width: 100,
    align: 'center',
    key: 'tradeTypeDesc',
  },
  {
    title: '交易时间',
    width: 150,
    align: 'center',
    key: 'tradeTime',
  },
]

import { billTransactionFlowList } from '@/api/financial'

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
        payType: 0,
        tradeType: '',
        tradeTimeStrat: '',
        tradeTimeEnd: '',
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
      this.searchForm.pageNum = 1
      this.getList()
    },
    getList() {
      this.TableLoading = true
      let body = JSON.parse(JSON.stringify(this.searchForm))
      delete body.datetimerange
      billTransactionFlowList(body).then(res => {
        this.TableLoading = false
        if (res && res.code == 200) {
          if (res.data.records instanceof Array) {
            res.data.records.forEach(item => {
              item.orderAmount = this.division100(item.orderAmount || 0)
              item.payChannelFee = this.division100(item.payChannelFee || 0)
              item.totalFee = this.division100(item.totalFee || 0)
              item.paidAmount = this.division100(item.paidAmount || 0)
            })
          }
          this.table_list = res.data.records
          this.totalSize = res.data.total
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    changeCurrent(current) {
      this.searchForm.pageNum = current
      this.getList()
    },
    // 重置form表单
    resetForm(name) {
      this.$refs[name].resetFields()
      this.searchForm.tradeTimeStrat = ''
      this.searchForm.tradeTimeEnd = ''
      if (name == 'searchForm') {
        this.search()
      }
    },
    division100(n) {
      let num = String(n)
      let arr = num.split(/\./)
      if (arr.length == 2) {
        if (arr[1].length < 2) {
          arr[1] = arr[1].padEnd(2, '0')
        }
        return arr.join('.')
      } else {
        return `${num}.00`
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
