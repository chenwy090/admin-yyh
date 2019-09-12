<template>
  <!-- U贝明细 -->
  <div>
    <h2 class="header">财务中心 > 商户账务 > 商户预充值 > U贝消耗明细</h2>
    <h3 class="title">{{merchantName}}</h3>
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="创建时间：" :label-width="100">
            <DatePicker
              type="daterange"
              placeholder="请选择日期"
              style="display:inline-block;width: 200px"
              :value="daterange"
              @on-change="changeStartDate"
            ></DatePicker>
          </FormItem>

          <FormItem :label-width="0">
            <Button type="primary" icon="ios-search" @click="queryTableData()">搜索</Button>
            <Button icon="md-refresh" class="marginLeft20" @click="reset">重置</Button>
          </FormItem>
        </Form>
        <Row type="flex" justify="start">
          <Button type="dashed" icon="md-arrow-round-back" @click="goback">返回列表</Button>
          <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData"></Table>
      <!-- 分页器 -->
      <Row type="flex" justify="end" class="page">
        <!-- show-total 显示总数 共{{ total }}条 -->
        <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
        <Page
          show-total
          show-elevator
          :current="page.pageNum"
          :page-size="page.pageSize"
          :total="page.total"
          @on-change="changeCurrent"
        ></Page>
      </Row>
    </Card>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("financial");

import { queryUbayList } from "@/api/sys";
import { ubayColumns } from "./columns";

export default {
  name: "ubay-details",
  computed: {
    ...mapState(["acountId", "merchantId", "merchantName"])
  },
  data() {
    return {
      daterange: [],
      // 查询参数
      searchData: {
        gmtCreateStart: "", //开始时间
        gmtCreateEnd: "" //结束时间
      },
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      columns: ubayColumns,
      tableData: []
    };
  },
  created() {
    this.queryTableData();
  },
  mounted() {},
  methods: {
    goback() {
      console.log("ubay-details");
      //   this.$emit("changeComp", "business-recharge");
      this.$store.dispatch("financial/changeCompName", "business-recharge");
    },
    changeStartDate(arr) {
      // yyyy-MM-dd
      this.searchData.gmtCreateStart = `${arr[0]} 00:00:00`;
      this.searchData.gmtCreateEnd = `${arr[1]} 23:59:59`;
    },

    // 刷新搜索
    refresh() {
      this.queryTableData(this.page.pageNum);
    },
    // 分页（点击第几页）
    changeCurrent(pageNum) {
      this.queryTableData(pageNum);
    },
    // 查询
    async queryTableData(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.loading = true;

      let {
        code,
        data: { records, current, total, size }
      } = await queryUbayList({
        merchantAccountId: this.acountId,
        ...this.searchData,
        ...this.page
      });

      if (code == 200) {
        this.tableData = records.map(item => {
          /**
              changeType
              充值里面：changeType 0充值 1扣款    
              ubay里面：changeType 0兑换 1消耗 
          */
          item.changeTypeName = item.changeType == 0 ? "兑换" : "消耗";
          if (item.changeType == 0) {
            item.addOrReduceUbay = item.addUbay;
          } else {
            item.addOrReduceUbay = -item.reduceUbay;
          }
          return item;
        });
        this.page.pageNum = current; //分页查询起始记录
        this.page.total = total; //列表总数
        this.page.pageSize = size; //每页数据
      } else {
        this.$Message.error(code + " 数据加载失败!", 3);
      }

      this.loading = false;
    },
    reset() {
      this.daterange = [];
      // 重置查询参数
      this.searchData = {
        gmtCreateStart: "", //开始时间
        gmtCreateEnd: "" //结束时间
      };

      this.page = {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      };

      //重新查询一遍
      this.queryTableData();
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
    }
  }
};
</script>