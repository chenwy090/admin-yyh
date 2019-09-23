
<template>
  <!-- 资金明细 -->
  <div>
    <h2 class="header">财务中心 > 商户账务 > 商户预充值 > 资金明细</h2>
    <h3 class="title">{{merchantName}}</h3>
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="类型：" :label-width="80">
            <Select v-model="searchData.changeType" style="width:100px">
              <Option
                v-for="item in typeOption"
                :value="item.value"
                :key="item.value+item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

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

import { queryFundsList } from "@/api/sys";
import { division100, fundsColumns } from "./columns";

export default {
  name: "funds-details",
  computed: {
    // acountId: "", //账号id
    // merchantType: "", //商户类型
    // merchantId: "", //商户id
    // merchantName: "", //商户名称
    ...mapState(["acountId", "merchantType", "merchantId", "merchantName"])
    // ...mapState(["businessId", "businessName"])
  },
  data() {
    return {
      //类型：全部、充值、兑换U贝；默认全部
      typeOption: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "充值"
        },
        {
          value: 1,
          label: "扣款"
        }
      ],
      daterange: [],
      // 查询参数
      searchData: {
        changeType: "", //类型
        gmtCreateStart: "", //开始时间
        gmtCreateEnd: "" //结束时间
      },
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      columns: fundsColumns,
      tableData: []
    };
  },
  created() {
    this.queryTableData();
  },
  mounted() {},
  methods: {
    goback() {
      console.log("funds-details");
      // this.$emit("changeComp", "business-recharge");
      this.$store.dispatch("financial/changeCompName", "business-recharge");
    },
    changeSsartDate(arr) {
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
      } = await queryFundsList({
        merchantAccountId: this.acountId,
        changeType: this.merchantType,
        ...this.searchData,
        ...this.page
      });
      // console.log(res);
      if (code == 200) {
        this.tableData = records.map(item => {
          const arr = ["beforeAmount", "changeAmount", "afterAmount"];
          arr.forEach(name => {
            item[name] = division100(item[name]);
          });

          item.changeTypeName = item.changeType == 0 ? "充值" : "扣款";
          // beforeAmount > afterAmount  => -changeAmount
          if (item.beforeAmount > item.afterAmount) {
            item.changeAmount = -item.changeAmount;
          }
          return item;
        });
        // this.banner_page_req.start = res.data.current; //分页查询起始记录
        this.page.pageNum = current; //分页查询起始记录
        this.page.total = total; //列表总数
        this.page.pageSize = size; //每页数据
        this.loading = false;
      } else {
        this.$Message.error(code + " 数据加载失败!", 3);
        this.loading = false;
      }

      this.loading = false;
    },
    reset() {
      this.daterange = [];
      // 重置查询参数
      this.searchData = {
        changeType: "", //类型
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