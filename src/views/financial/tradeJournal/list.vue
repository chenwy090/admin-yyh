<template>
  <div class="label_manage">
    <Tabs type="card" @on-click="changeTradeType" value="mechants">
      <Tab-pane label="商户" name="mechants"></Tab-pane>
      <Tab-pane label="商超" name="business"></Tab-pane>
    </Tabs>
    <!-- 商户 -->
    <mechants v-if="currentKey == 'mechants'"></mechants>
    <!-- 商超 -->
    <business v-if="currentKey == 'business'"></business>
  </div>
</template>
<script>
import columns from "./columns";
import { billTransactionFlowList } from "@/api/financial";
// 商户
import mechants from "./merchants";
// 商超
import business from "./business";

export default {
  components: { mechants, business },
  data() {
    return {
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        datetimerange: "",
        orderNo: "",
        merchantName: "",
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
      currentKey: "mechants",
    };
  },
  mounted() {
    //this.getList()
  },
  methods: {
    changeTradeType(val) {
      console.log(val);
      this.currentKey = val;
    },
    // 刷新
    search() {
      this.searchForm.pageNum = 1;
      this.getList();
    },
    getList() {
      this.TableLoading = true;
      let body = JSON.parse(JSON.stringify(this.searchForm));
      delete body.datetimerange;
      billTransactionFlowList(body).then(res => {
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
