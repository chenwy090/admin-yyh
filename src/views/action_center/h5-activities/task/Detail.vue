<template>
  <!--  查看 任务设置  -->
  <div class="detail">
    <Card :bordered="false" style="margin-bottom:2px">
      <Row type="flex" justify="start">
        <!-- prizepoolId:{{prizepoolId}} -->
        <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
      </Row>
    </Card>
    <Card :bordered="false">
      <!-- 1: 已上架、2：已下架 -->
      <!-- <template slot-scope="{ row }" slot="action">
      -->
      <Table
        border
        size="small"
        :show-index="true"
        :loading="loading"
        :columns="columns"
        :data="tableData"
      ></Table>
      <!-- 分页器 -->
      <Row type="flex" justify="end" class="page">
        <!-- show-total 显示总数 共{{ total }}条 -->
        <!-- show-elevator 显示电梯，可以快速切换到某一页  跳至 xx 页-->
        <Page
          size="small"
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
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("egg");
import { getRequest, postRequest } from "@/libs/axios";
import columns from "./columns";

let cols = JSON.parse(JSON.stringify(columns));
cols.shift();

export default {
  name: "detail",
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          id: Math.random(),
          label: "任务设置",
          compName: "task",
          url: "/activity/assignment/rule/list"
        };
      }
    },
    action: {
      type: Object,
      default: () => ({
        _id: Math.random(),
        title: "编辑奖池",
        type: "edit", //add/edit/detail/audit
        data: {}
      })
    }
  },
  computed: {
    ...mapState(["prizepoolId"])
  },
  watch: {
    prizepoolId() {
      console.log("task watch prizepoolId:", this.prizepoolId);
      console.log("task watch tab:", { ...this.tab });
      this.queryTableData();
    },
    tab: {
      handler(val, oldVal) {
        this.queryTableData();
        console.log("watch task this.tab:", { ...this.tab });
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      activityId: "",
      taskAction: {
        _id: Math.random(),
        title: "添加任务",
        type: "add", //query/add/edit
        data: null
      },

      // 任务类型 1-领优惠券 2-邀请助力 3-浏览页面 4-分享页面 5-内容点赞 6-下载APP
      assignmentType: "",
      assignmentTypeOption: {
        1: "领优惠券",
        2: "邀请助力",
        3: "浏览页面",
        4: "分享页面",
        5: "内容点赞",
        6: "下载APP"
      },
      // 新增、修改 任务抽奖banner
      isShow: false,
      // title: "查看奖池",
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      loading: false,
      columns: cols,
      tableData: []
    };
  },
  mounted() {
    console.log("task.vue mounted", this.tab);
  },
  methods: {
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

      const url = "/activity/assignment/rule/list";
      console.log("queryTableData", this.tab.url);

      try {
        let {
          code,
          data: { records, current, total, size }
        } = await getRequest(this.tab.url, {
          prizepoolId: this.prizepoolId,
          ...this.page
        });

        if (code == 200) {
          this.tableData = records.map(item => {
            let { assignmentType } = item;

            item.assignmentTypeName = this.assignmentTypeOption[assignmentType];
            console.log({ ...item });

            return item;
          });
          this.page.pageNum = current; //分页查询起始记录
          this.page.total = total; //列表总数
          this.page.pageSize = size; //每页数据
        } else {
          this.msgErr(code + " 数据加载失败!");
        }
      } catch (err) {
        console.log("try catch", err);
      }
      this.loading = false;
    },
    closeDialog() {
      //关闭对话框清除表单数据
      // this.$refs.formValidate.resetFields();
      console.log("closeDialog");
      this.$emit(`update:showEditJackpot`, false);
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
.edit {
  padding-bottom: 50px;
}
.demo-drawer-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>