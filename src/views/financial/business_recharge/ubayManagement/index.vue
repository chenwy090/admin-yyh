<template>
  <div class="xxx">
    <h2 class="header">财务中心 > 商户账务 > 商户预充值 > U贝消耗明细 {{showExchange?1:2}}</h2>
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <!-- 商户/品牌名称 -->
          <FormItem label="商户/品牌名称：" :label-width="100">
            <Input style="width:200px" type="text" v-model="searchData.name" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="状态：" :label-width="60">
            <Select v-model="searchData.status" style="width:100px">
              <Option
                v-for="item in statusOption"
                :value="item.value"
                :key="item.value+item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="创建时间：" :label-width="80">
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
          <Button type="primary" class="marginLeft20" @click="showExchange=true">U贝兑换</Button>
          <Button type="primary" class="marginLeft20" @click="showConsume=true">U贝消耗</Button>
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <Button type="text" size="small" @click="linkTo()">查看</Button>
        </template>
      </Table>
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

    <exchange v-if="showExchange" :showExchange.sync="showExchange" @refresh="queryTableData"></exchange>
    <consume v-if="showConsume" :showConsume.sync="showConsume" @refresh="queryTableData"></consume>
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
import { queryLuckDrawList } from "@/api/sys";
import { ubayMColumns as columns } from "../columns";

import Exchange from "./Exchange";
import Consume from "./Consume";

export default {
  name: "ubay-management",
  components: {
    Exchange,
    Consume
  },
  watch: {},
  data() {
    return {
      showExchange: false,
      showConsume: false,
      // 状态： 全部 、 待审核 、 已通过 、 审核失败 ；默认全部
      statusOption: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "待审核"
        },
        {
          value: 2,
          label: "已通过"
        },
        {
          value: 3,
          label: "审核失败"
        }
      ],
      daterange: [],
      // 查询参数
      searchData: {
        name: "", //商户名称
        // status: 0, //状态
        status: "", //状态
        startTime: "", //开始时间
        endTime: "" //结束时间
      },
      loading: false, //列表加载动画
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      columns,
      tableData: []
    };
  },
  created() {
    this.queryTableData();
  },
  methods: {
    goback() {
      this.$store.dispatch("financial/changeCompName", "business-recharge");
    },
    linkTo(compName, data) {},
    changeComp(compName) {
      // this.$emit("changeComp", compName);
      this.$store.dispatch("financial/changeCompName", compName);
    },
    changeStartDate(arr) {
      // yyyy-MM-dd
      this.searchData.startTime = arr[0];
      this.searchData.endTime = arr[1];
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
    queryTableData(pageNum) {
      this.page.pageNum = pageNum || 1;
      this.loading = true;

      queryLuckDrawList({
        ...this.searchData,
        ...this.page
      }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.tableData = res.data.records;
          // this.banner_page_req.start = res.data.current; //分页查询起始记录
          this.page.pageNum = res.data.current; //分页查询起始记录
          this.page.total = res.data.total; //列表总数
          this.page.pageSize = res.data.size; //每页数据
          this.loading = false;
        } else {
          this.$Message.error(res.code + " 数据加载失败!", 3);
          this.loading = false;
        }
      });
    },
    reset() {
      this.daterange = [];
      // 重置查询参数
      this.searchData = {
        name: "", //商户名称
        // status: 0, //状态
        status: "", //状态
        startTime: "", //开始时间
        endTime: "" //结束时间
      };

      this.page = {
        pageNum: 1, //页码
        pageSize: 10 //每页数量
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
<style scoped>
.underline {
  text-decoration: underline;
}
.table-box {
  min-height: 100px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.marginLeft20 {
  margin-left: 20px;
}
</style>