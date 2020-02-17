<template>
  <!--  查看 奖品设置  -->
  <div class="detail">
    <Card :bordered="false" style="margin-bottom:2px">
      <Row type="flex" justify="start">
        <Button icon="md-refresh" class="marginLeft20" @click="refresh">刷新</Button>
      </Row>
    </Card>
    <Card :bordered="false">
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
import { postRequest } from "@/libs/axios";
import { detailColumns as columns } from "./columns";

export default {
  name: "detail",
  props: {
    tab: {
      type: Object,
      default: function() {
        return {
          id: Math.random(),
          label: "奖品设置",
          compName: "prize",
          url: "/activity/prize/list"
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
      console.log("prize watch prizepoolId:", this.prizepoolId);
      console.log("prize watch tab:", { ...this.tab });
      this.queryTableData();
    },
    tab: {
      handler(val, oldVal) {
        this.queryTableData();
        console.log("watch prize this.tab:", { ...this.tab });
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      activityId: "",
      prizeAction: {
        _id: Math.random(),
        title: "添加奖品",
        type: "add", //query/add/edit
        data: null
      },
      // prizeType 奖品类型：1:实物、2：优惠券
      prizeTypeOption: {
        1: "实物",
        2: "优惠券"
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
      columns,
      tableData: []
    };
  },
  mounted() {
    console.log("prize.vue mounted", this.tab);
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

      const url = "/activity/prizepool/list";

      try {
        let {
          code,
          data: { records, current, total, size }
        } = await postRequest(this.tab.url, {
          prizepoolId: this.prizepoolId,
          ...this.page
        });

        if (code == 200) {
          this.tableData = records.map(item => {
            let { prizeType } = item;
            item.prizeTypeName = this.prizeTypeOption[prizeType];
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