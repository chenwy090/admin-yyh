<template>
  <div class="xxx">
    <!-- 赏U列表 RewardUList   -->
    <div class="query-row">
      <Card :bordered="false" style="margin-bottom:2px">
        <Form inline>
          <FormItem label="任务名称：" :label-width="85">
            <Input style="width:200px" type="text" v-model="searchData.name" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="审核：" :label-width="60">
            <Select v-model="searchData.status" style="width:120px" clearable>
              <Option v-for="(v,k) in statusOption" :value="k" :key="k">{{ v }}</Option>
              <!-- <Option v-for="(item,k) in statusOption" :value="item.value" :key="k">{{ item.label }}</Option> -->
            </Select>
          </FormItem>

          <FormItem label="状态：" :label-width="60">
            <Select v-model="searchData.isStop" style="width:120px" clearable>
              <Option v-for="(v,k) in isStopOption" :value="k" :key="k">{{ v }}</Option>
              <!-- <Option v-for="(item,k) in isStopOption" :value="item.value" :key="k">{{ item.label }}</Option> -->
            </Select>
          </FormItem>

          <FormItem :label-width="0">
            <Button type="primary" icon="ios-search" @click="queryTableData()">搜索</Button>
            <Button icon="md-refresh" class="marginLeft20" @click="reset">重置</Button>
          </FormItem>
        </Form>
        <Row type="flex" justify="start">
          <Button type="primary" icon="md-add" @click="addOrEdit('add')">新增</Button>
          <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
        </Row>
      </Card>
    </div>
    <Card :bordered="false">
      <Table border :show-index="true" :loading="loading" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <!-- 点击“查看”按钮时，跳转到查看赏U页面 -->
          <Button type="success" size="small" style="margin-right: 5px" @click="toDetail(row)">查看</Button>
          <Button type="success" size="small" style="margin-right: 5px" @click="toData(row)">数据</Button>
          <!-- 只有“待审核、审核通过未开始、”状态，才会显示“编辑” -->
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="addOrEdit('edit',row)"
          >编辑</Button>
          <!-- 只有“待审核”状态，才会显示审核按钮。 -->
          <Button type="success" size="small" @click="examine(row)">审核</Button>
          <!-- 只有“审核通过进行中、审核通过未开始”的活动，才显示“下架”按钮。 -->
          <Button type="warning" size="small" @click="undercarriage(row)">下架</Button>
          <!-- 只有“待审核、未通过”状态，才会显示“删除”按钮 -->
          <Poptip
            :transfer="true"
            confirm
            placement="bottom-end"
            title="确认删除此任务吗?"
            @on-ok="ok"
            @on-cancel="cancel"
            ok-text="确认"
            cancel-text="取消"
            word-wrap
          >
            <Button type="error" size="small" style="margin-left: 5px" @click="del(row)">删除</Button>
          </Poptip>
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
  </div>
</template>
<script>
import { postRequest } from "@/libs/axios";
import { queryRewardUList, queryDetailById } from "@/api/sys";
import columns from "./columns";

// import DrawEdit from "./DrawEdit";
// import WinningList from "./WinningList";
// import ModalDetail from "../Modal_detail";

export default {
  name: "reward-u",
  components: {
    // ModalDetail: ModalDetail,
    // [DrawEdit.name]: DrawEdit,
    // [WinningList.name]: WinningList
  },
  watch: {},
  data() {
    return {
      id: "",
      //审核 status examineType ： “待审核、已通过、未通过” 默认显示“请选择”。  审核状态 0-待审核 1-审核通过 2-审核失败
      statusOption: {
        "0": "待审核",
        "1": "已通过",
        "2": "未通过"
      },
      // 状态 status 显示“未开始、进行中、已结束、已终止”选项。	默认显示“请选择”。
      //  isStop 是否终止 1-中止，0-正常
      isStopOption: {
        "0": "未开始",
        "1": "进行中",
        "2": "已结束",
        "3": "已终止"
      },
      // 查询参数
      searchData: {
        name: "", //任务名称
        status: "", // 审核类型
        isStop: "" //状态
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
    async toDetail(row) {
      const r = await queryDetailById(row.id);
    },
    toData(data) {
      this.linkTo("reward-u-data", data);
    },
    examine() {},
    undercarriage() {},
    del() {
      console.log("del");
    },
    ok() {
      this.$Message.info("正在删除");
    },
    cancel() {
      this.$Message.info("已取消删除");
    },
    async addOrEdit(type) {
      let data = null;
      let compName = "reward-u-edit";
      if (type == "edit") {
      }
      this.linkTo(compName, data);
    },

    linkTo(compName, data) {
      this.$store.dispatch("missionCenter/changeView", {
        compName,
        data
      });
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

      queryRewardUList({
        ...this.searchData,
        ...this.page
      }).then(res => {
        // console.log(res);
        const {
          code,
          data: { current, total, size, records }
        } = res;

        if (code == 200) {
          this.tableData = records.map(item => {
            // startTimeAndEndTime
            item.startTimeAndEndTime = `${item.startTime}-${item.endTime}`;
            // statusName
            item.statusName = this.statusOption[item.status];
            // isStopName
            item.isStopName = this.isStopOption[item.isStop];
            return item;
          });

          this.page.pageNum = current; //分页查询起始记录
          this.page.total = total; //列表总数
          this.page.pageSize = size; //每页数据
        } else {
          this.$Message.error(res.code + " 数据加载失败!", 3);
        }
        this.loading = false;
      });
    },
    reset() {
      // 重置查询参数
      this.searchData = {
        name: "", //任务名称
        status: "", // 审核类型
        isStop: "" //状态
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