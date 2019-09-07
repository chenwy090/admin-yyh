<template>
  <div class="xxx">
    <!-- 赏U查看 数据 RewardUData   -->
    <h2 class="header">赏U查看 数据</h2>
    <div v-show="tableData.length">投放{{xxxxxx}}U贝 &nnsp;&nnsp; 奖励 {{xxxxxx}}U贝</div>
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="用户手机：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.mobile" placeholder="请输入"></Input>
          </FormItem>
          <!-- 商户类型：商户 品牌 -->
          <FormItem label="商户类型：" :label-width="80">
            <Select v-model="searchData.merchantType" style="width:100px" clearable>
              <Option v-for="(v,k) in merchantTypeOption" :value="k" :key="k">{{ v }}</Option>
            </Select>
          </FormItem>
          <FormItem label="奖励类型：" :label-width="80">
            <Select v-model="searchData.awardType" style="width:150px" clearable>
              <Option v-for="(v,k) in awardTypeOption" :value="k" :key="k">{{ v }}</Option>
            </Select>
          </FormItem>

          <FormItem label="优惠券名称：" :label-width="85">
            <Input
              style="width:200px"
              type="text"
              v-model="searchData.couponTitle"
              placeholder="请输入"
              clearable
            ></Input>
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
const { mapState } = createNamespacedHelpers("missionCenter");
import { queryMerchantDataById } from "@/api/sys";
import { udataColumns as columns } from "./columns";

export default {
  name: "reward-u-data",
  computed: {
    ...mapState(["id"])
  },
  data() {
    return {
      // id: "",
      /**
        投放：统计整个任务下所有券预计投放的U贝的数量。
        奖励：统计整个任务下被用户已领取的U贝数量。
      */
      receiveNum: "", //领取数量
      anticipatedUbay: "", //核销数量
      // 商户类型：商户 品牌
      merchantTypeOption: {
        "0": "商户",
        "1": "品牌"
      },
      // 奖励类型 rewards “领取、核销、作为分享者，对方领券获奖励、作为分享者，对方用券获奖励”。 默认显示“请选择”。
      awardTypeOption: {
        "1": "领取",
        "2": "核销",
        "3": "分享领取",
        "4": "分享核销"
      },
      // 状态 status 显示“未开始、进行中、已结束、已终止”选项。	默认显示“请选择”。
      daterange: [],
      // 查询参数
      searchData: {
        mobile: "", //手机号
        // 商户类型 0-本地商户（单店），1-本地商户（多店）
        merchantType: "", //商户类型
        // 奖励类型 1-领取 2-核销 3-分享领取 4-分享核销
        awardType: "", //奖励类型
        couponTitle: "", //优惠券名称
        createTimeStart: "",
        createTimeEnd: ""
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
  mounted() {
    this.$nextTick(_ => {
      this.queryTableData();
    });
  },
  methods: {
    changeStartDate(arr) {
      // yyyy-MM-dd
      this.searchData.createTimeStart = arr[0];
      this.searchData.createTimeEnd = arr[1];
    },
    goback() {
      console.log("reward-u");
      // this.$store.dispatch("missionCenter/changeCompName", "reward-u");
      this.changeComp("reward-u");
    },
    handleChange(value, selectedData) {
      console.log("handleChange:", value, selectedData);
    },
    changeComp(compName) {
      this.$store.dispatch("missionCenter/changeCompName", compName);
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
      } = await queryMerchantDataById({
        id: this.id,
        ...this.searchData,
        ...this.page
      });

      if (code == 200) {
        this.tableData = records.map(item => {
          // merchantTypeOption awardTypeOption
          item.merchantTypeName = this.merchantTypeOption[item.merchantType];
          item.awardTypeName = this.awardTypeOption[item.awardType];
          return item;
        });
        this.page.pageNum = current; //分页查询起始记录
        this.page.total = total; //列表总数
        this.page.pageSize = size; //每页数据
      } else {
        this.$Message.error(res.code + " 数据加载失败!", 3);
      }
      this.loading = false;
    },
    reset() {
      this.daterange = [];
      // 重置查询参数
      this.searchData = {
        mobile: "", //手机号
        // 商户类型 0-本地商户（单店），1-本地商户（多店）
        merchantType: "", //商户类型
        // 奖励类型 1-领取 2-核销 3-分享领取 4-分享核销
        awardType: "", //奖励类型
        couponTitle: "", //优惠券名称
        createTimeStart: "",
        createTimeEnd: ""
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