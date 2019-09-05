<template>
  <div class="xxx">
    <!-- 赏U查看 数据 RewardUData   -->
    <h2 class="header">赏U查看 数据</h2>
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="用户手机：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.name" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="类型：" :label-width="60">
            <Select v-model="searchData.type" style="width:100px">
              <Option
                v-for="item in typeOption"
                :value="item.value"
                :key="item.value+item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <!-- 商户类型：商户 品牌 -->
          <FormItem label="商户类型：" :label-width="80">
            <Select v-model="searchData.businessType" style="width:100px">
              <Option
                v-for="item in businessTypeOption"
                :value="item.value"
                :key="item.value+item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="奖励类型：" :label-width="80">
            <Select v-model="searchData.rewardsType" style="width:150px">
              <Option
                v-for="item in rewardsTypeOption"
                :value="item.value"
                :key="item.value+item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="优惠券：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.name" placeholder="请输入"></Input>
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
import { postRequest } from "@/libs/axios";
import { queryLuckDrawList } from "@/api/sys";
import { udataColumns as columns } from "./columns";

export default {
  name: "reward-u-data",
  watch: {},
  data() {
    return {
      id: "",
      /**
        投放：统计整个任务下所有券预计投放的U贝的数量。
        奖励：统计整个任务下被用户已领取的U贝数量。
      */
      typeOption: [
        {
          value: 0,
          label: "投放"
        },
        {
          value: 1,
          label: "奖励"
        }
      ],
      // 商户类型：商户 品牌
      businessTypeOption: [
        {
          value: 0,
          label: "商户"
        },
        {
          value: 1,
          label: "品牌"
        }
      ],
      // 奖励类型 rewards “领取、核销、作为分享者，对方领券获奖励、作为分享者，对方用券获奖励”。 默认显示“请选择”。
      rewardsTypeOption: [
        {
          value: 0,
          label: "领取"
        },
        {
          value: 1,
          label: "核销"
        },
        {
          value: 2,
          label: "作为分享者"
        },
        {
          value: 3,
          label: "对方领券获奖励"
        },
        {
          value: 4,
          label: "作为分享者"
        },
        {
          value: 5,
          label: "对方用券获奖励"
        }
      ],
      // 状态 status 显示“未开始、进行中、已结束、已终止”选项。	默认显示“请选择”。
      statusOption: [
        {
          value: 0,
          label: "未开始"
        },
        {
          value: 1,
          label: "进行中"
        },
        {
          value: 2,
          label: "已结束"
        },
        {
          value: 3,
          label: "已终止"
        }
      ],
      daterange: [],
      // 查询参数
      searchData: {
        name: "", //任务名称
        startTime: "",
        endTime: "",
        type: "",
        businessType: "",
        rewardsType: "",
        status: "" // 状态
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
    changeStartDate(arr) {
      // yyyy-MM-dd
      this.searchData.startTime = arr[0];
      this.searchData.endTime = arr[1];
    },
    goback() {
      console.log("reward-u");
      this.$store.dispatch("missionCenter/changeCompName", "reward-u");
    },
    handleChange(value, selectedData) {
      console.log("handleChange:", value, selectedData);
    },
    linkTo(compName, data) {
      let { id: businessId, name: businessName } = data;
      this.$store.dispatch("financial/showRechargeDetail", {
        compName,
        businessId,
        businessName
      });
    },
    changeComp(compName) {
      // this.$emit("changeComp", compName);
      this.$store.dispatch("financial/changeCompName", compName);
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
        name: "", //任务名称
        startTime: "",
        endTime: "",
        type: "",
        businessType: "",
        rewardsType: "",
        status: "" // 状态
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