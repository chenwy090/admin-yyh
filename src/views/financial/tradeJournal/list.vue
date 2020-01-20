<template>
  <div class="label_manage">
    <Tabs type="card" @on-click="changeTradeType" value="mechants">
      <Tab-pane label="商户" name="mechants"></Tab-pane>
      <Tab-pane label="商超" name="business"></Tab-pane>
    </Tabs>
    <mechants v-if="currentKey == 'mechants'"></mechants>
    <business v-if="currentKey == 'business'"></business>


    
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
import mechants from './merchants'
import business from './business'
export default {
  components:{mechants,business},
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
      currentKey:"mechants"
    }
  },
  mounted() {
    //this.getList()
  },
  methods: {
    changeTradeType(val){
      console.log(val);
      this.currentKey = val;
    },
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
