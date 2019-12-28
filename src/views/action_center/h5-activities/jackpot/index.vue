<template>
  <!--  新建/编辑 奖池 -->
  <div class="edit">
    <Card :bordered="false" style="margin-bottom:2px">
      <Row type="flex" justify="start">
        <Button type="primary" icon="md-add" class="marginLeft20" @click="addOrEdit('add')">新增模块</Button>
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
      >
        <template slot-scope="{ row }" slot="action">
          <template v-if="row.status == 1">
            <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px">
              编辑模块   
            </Button>
            <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px">
              编辑模块内容   
            </Button>
            <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px">
              删除   
            </Button>
          </template>
          <template v-else>
            <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px">
              查看模块   
            </Button>
            <Button  type="text" size="small" style="color:#2db7f5;margin-right: 5px">
              查看模块内容   
            </Button>
          </template>

          <!-- <Button
            v-if="row.showEdit"
            type="text"
            size="small"
            style="color:red;margin-right: 5px"
            @click="addOrEdit('edit',row)"
          >编辑奖池</Button>
          <Button
            v-if="!row.showEdit"
            type="text"
            size="small"
            style="color:#2db7f5;margin-right: 5px"
            @click="editPrizePoolContent(row,'query')"
          >查看奖池内容</Button>
          <Button
            v-if="row.showEdit"
            type="text"
            size="small"
            style="color:red;margin-right: 5px"
            @click="editPrizePoolContent(row,'edit')"
          >编辑奖池内容</Button> -->
          <!-- 删除奖池将同步删除奖池内的所有奖品和任务，是否确认操作？  确认删除奖池吗? -->

          <Poptip
            v-if="row.showDel"
            :transfer="true"
            confirm
            placement="bottom-end"
            :title="`${row.delTips}`"
            @on-ok="delItem(row)"
            @on-cancel="delCancel(row)"
            ok-text="确认"
            cancel-text="取消"
            word-wrap
          >
            <Button style="color:red;margin-right: 5px" type="text" size="small">删除</Button>
          </Poptip>
        </template>
      </Table>
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
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="closeDialog">关闭</Button>
    </div>
    <Edit :action="jackpotAction" @refresh="queryTableData"></Edit>
    <!--新增模板-->
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapGetters } = createNamespacedHelpers("egg");
import { postRequest } from "@/libs/axios";
import columns from "./columns";
import Edit from "./Edit";

export default {
  name: "edit",
  components: { Edit },
  props: {
    showEditJackpot: {
      type: Boolean,
      default: false
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
    oVueComponent() {
      let { actionType, compName } = this;

      let pathName = "";

      if (actionType == "query") {
        pathName = compName == "prize/Detail" ? "prize/Detail" : "task/Detail";
      } else if (actionType == "edit") {
        pathName = compName == "prize" ? "prize" : "task";
      }

      //通过import动态导入组件 配合webpack实现组件分离
      return () => import(`../${pathName}`);
    }
  },
  watch: {
    action: {
      handler(val, oldVal) {
        let { type, data } = this.action;

        data = JSON.parse(JSON.stringify(data));
        this.activityId = data.id;

        //this.queryTableData();
        console.log("watch jackpotAction data:", data);

        if (type == "add") {
        } else if (type == "edit") {
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      activityId: "",
      jackpotAction: {
        _id: Math.random(),
        title: "编辑奖池",
        type: "add", //query/add/edit
        data: null
      },
      isShow: false,
      jackpotName: "",
      actionType: "query", //query/edit
      page: {
        pageNum: 1, //页码
        pageSize: 10, //每页数量
        total: 0 //数据总数
      },
      loading: false,
      columns,
      //0已结束1未开始2进行中
      tableData: [{name:'模块具体名称',order:3,productNum:3,time:'2019-12-27 11:24:00-2019-12-27 22:08:08',status:1},
      {name:'模块具体名称',order:3,productNum:3,time:'2019-12-27 11:24:00-2019-12-27 22:08:08',status:0},
      {name:'模块具体名称',order:3,productNum:3,time:'2019-12-27 11:24:00-2019-12-27 22:08:08',status:2}],
    };
  },
  mounted() {
    console.log("showEditJackpot mounted");
  },
  methods: {
    ...mapMutations(["setPrizepoolId"]),
    selectedTrCallBack() {
      console.log("selectedTrCallBack");
      // this.$emit("seclectedTr-event", choice);
    },
    
    async delItem(row) {
      this.msgOk("正在删除...");
      // /activity/prizepool/delete
      const url = "/activity/prizepool/delete";
      const { code, msg } = await postRequest(url, { id: row.id });
      if (code == 200) {
        this.msgOk("删除成功");
        //查询table
        this.queryTableData();
      } else {
        this.msgErr(msg);
      }
    },
    delCancel() {
      this.msgOk("已取消删除");
    },
    addOrEdit(type, data) {
      console.log("addOrEdit1 jackpotAction", type, data);
      this.jackpotAction = {
        id: Math.random(),
        type,
        data
      };
      console.log("addOrEdit2 jackpotAction", { ...this.jackpotAction });
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
      this.showPrizeAndTask = false;
      this.page.pageNum = pageNum || 1;
      this.loading = true;

      const url = "/activity/prizepool/list";

      try {
        let {
          code,
          data: { records, current, total, size }
        } = await postRequest(url, {
          activityId: this.activityId,
          ...this.page
        });

        if (code == 200) {
          this.tableData = records.map(item => {
            //
            let {
              beginTime,
              endTime,
              couponPrizeCount,
              kindPrizeCount,
              taskRelCount
            } = item;

            let s = Date.now();
            let e = new Date(beginTime).getTime();
            if (s <= e) {
              item.showEdit = true;
              item.showDel = true;
            }

            item.time = `${beginTime}-${endTime}`;

            let r = !!(couponPrizeCount || kindPrizeCount || taskRelCount);

            // 删除奖池将同步删除奖池内的所有奖品和任务，是否确认操作？  确认删除奖池吗?

            if (r) {
              item.delTips =
                "删除奖池将同步删除奖池内的所有奖品和任务，是否确认操作？";
            } else {
              item.delTips = "确认删除奖池吗?";
            }

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
      this.$emit("update:showEditJackpot", false);
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